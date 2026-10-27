"""Bind verified dimensional sheets to the maintained page's CAD-to-solid handoff."""
import copy,json,math,shutil
import xml.etree.ElementTree as ET
from pathlib import Path
from ceramic_paths import ROOT,SKILL,PROFILE
from drawing_review import verify,sha

NS='{http://www.w3.org/2000/svg}'

def prepare(project,prepared,review):
    option=review.get('dimensionalDrawing')
    if option is None:return None
    if not isinstance(option,dict) or set(option)-{'directory','extraScrollVh','camera'}:raise ValueError('Invalid dimensionalDrawing fields')
    if review.get('cadPresentation'):raise ValueError('Dimensional drawing cannot combine with grouped legacy CAD pages')
    directory=(ROOT/option['directory']).resolve()
    if not directory.is_relative_to(ROOT):raise ValueError('Drawing must be in workspace')
    manifest=verify(directory);plan=json.loads((directory/'drawing-plan.json').read_text())
    source=json.loads((directory/'input.json').read_text())
    if (ROOT/source['sourceProject']).resolve()!=project:raise ValueError('Drawing source project mismatch')
    if sha(directory/'source-config.json')!=sha(project/'input/config.json'):raise ValueError('Drawing source config is stale')
    for part in json.loads((project/'input/config.json').read_text())['parts']:
        for key in ('profile','dimensions','handle','material'):
            if key not in part:continue
            current=ROOT/part[key]
            for name in (f'{part["id"]}-{key}.json',f'{part["id"]}-{current.name}'):
                archived=directory/'sources'/name
                if archived.exists() and sha(archived)!=sha(current):raise ValueError('Drawing source input is stale: '+key)
    ids=[p['id'] for p in json.loads((project/'input/config.json').read_text())['parts']]
    if [p['id'] for p in plan['parts']]!=ids:raise ValueError('Drawing part order must match page CAD')
    parts=prepared.get('parts',[])
    if parts and {p.get('sourcePartId',p['id']) for p in parts}!=set(ids):
        raise ValueError('Drawing sources must cover every scene part')
    for item in plan['parts']:
        candidates=[project/'geometry'/item['id']/'model.step',project/'cad/solid'/item['id']/'model.step']
        current=next((p for p in candidates if p.is_file()),None)
        if not current or sha(current)!=item['sourceStepSha256']:raise ValueError('Drawing STEP is stale')
        prepared['inputsSha256'][str(current.relative_to(ROOT))]=sha(current)
    extra=option.get('extraScrollVh',200)
    if isinstance(extra,bool) or not isinstance(extra,(int,float)) or not math.isfinite(extra) or not 50<=extra<=600:raise ValueError('extraScrollVh must be 50–600')
    camera=None
    if option.get('camera'):
        from drawing_camera import validate_camera
        path=(ROOT/option['camera']).resolve()
        if len(ids)!=1:raise ValueError('Explicit page camera currently supports a single part; multi-part uses the combined sheet')
        if not path.is_relative_to(ROOT):raise ValueError('Camera input must be inside workspace')
        camera=validate_camera(json.loads(path.read_text()),directory,ids).get(ids[0])
        prepared['inputsSha256'][str(path.relative_to(ROOT))]=sha(path)
    for path in [directory/'drawing-manifest.json',*(directory/n for n in manifest['files'])]:
        prepared['inputsSha256'][str(path.relative_to(ROOT))]=sha(path)
    mode=prepared.get('mode')
    if mode in ('handled','feature'):
        timing=json.loads(PROFILE.read_text())['sceneDefaults']['handled']['timing']
        end=min(timing['frontStart'],timing['sheetFadeStart'])*timing['pageClayEnd']
    elif mode=='multiple':
        t=review['motion']['timing'];end=min(t['frontMoveStart'],t['sheetFadeStart'])
    else:end=100/1200
    return {'directory':directory,'manifest':manifest,'plan':plan,'extraScrollVh':extra,'end':end,'cameraKeys':camera}

def extract_front(source,target):
    root=ET.parse(source).getroot()
    front=next(e for e in root.iter() if e.get('data-view')=='front')
    geo=next(e for e in front.iter() if e.get('data-geometry'))
    rect=next(e for e in front.iter(NS+'rect'))
    out=ET.Element(NS+'svg',{'viewBox':' '.join(rect.get(k) for k in ('x','y','width','height'))})
    for style in root.findall(NS+'style'):out.append(copy.deepcopy(style))
    for defs in root.iter(NS+'defs'):out.append(copy.deepcopy(defs))
    out.append(copy.deepcopy(geo));ET.ElementTree(out).write(target,encoding='unicode')

def install(binding,prepared,stage):
    if binding is None:return
    directory=binding['directory'];dest=stage/'dimensional-drawing';shutil.copytree(directory,dest)
    config_path=stage/'assets/project.json';config=json.loads(config_path.read_text())
    config['drawingBridge']={k:binding[k] for k in ('extraScrollVh','end','cameraKeys')}
    layouts=copy.deepcopy(binding['manifest']['layouts'])
    layouts['mobile-short']=copy.deepcopy(layouts['mobile'])
    ids=[p['id'] for p in binding['plan']['parts']]
    mode=prepared.get('mode')
    if mode in ('handled','feature'):
        settings_path=stage/'review-input.json';settings=json.loads(settings_path.read_text())
        settings['layouts']={k:{'file':'dimensional-drawing/'+v['file'],'frontBox':v['frontBoxes'][ids[0]]} for k,v in layouts.items()}
        settings_path.write_text(json.dumps(settings,indent=2)+'\n')
        extract_front(directory/f'{ids[0]}-desktop.svg',stage/'front-view.svg')
    elif mode=='multiple':
        for entry in layouts.values():entry['file']='../dimensional-drawing/'+entry['file']
        from feature_instances import alias_sheet
        config['sheets']=alias_sheet({'layouts':layouts},prepared['parts'])['layouts']
        installed=set()
        for part in config['parts']:
            asset=part.get('geometryAssetId',part['id'])
            if asset in installed:continue
            installed.add(asset)
            source=part.get('sourcePartId',part['id'])
            extract_front(directory/f'{source}-desktop.svg',stage/'assets'/asset/'front-view.svg')
    else:
        config['drawingLayouts']=layouts
        config['sheetFrontBox']=layouts['desktop']['frontBoxes'][ids[0]]
        extract_front(directory/f'{ids[0]}-desktop.svg',stage/'assets/front-view.svg')
    config_path.write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n')
    shutil.copy2(SKILL/'assets/drawing-motion/motion.mjs',stage/'drawing-motion.mjs')
    doc=(stage/'index.html').read_text()
    doc=doc.replace('</head>','<style>.drawing-reader-link{position:absolute;right:16px;top:16px;z-index:3;padding:12px;background:transparent;color:#35332f;font:12px Arial;border:0}</style></head>')
    doc=doc.replace('<div class="stage">','<div class="stage"><a class="drawing-reader-link" href="./dimensional-drawing/index.html">View drawing details</a>')
    (stage/'index.html').write_text(doc)
