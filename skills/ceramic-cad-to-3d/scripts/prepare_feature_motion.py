"""Adapt one reviewed feature part to the existing CAD/wire/axis motion renderer."""
import hashlib
import json
import shutil
import xml.etree.ElementTree as ET
from ceramic_paths import PROFILE
NS='{http://www.w3.org/2000/svg}'


def prepare(source,out,data):
    manifest=json.loads((source/'manifest.json').read_text())
    ids=[p['id'] for p in manifest['parts']]
    pid=data.get('partId',ids[0] if len(ids)==1 else None)
    if pid not in ids: raise ValueError('Feature motion requires a valid partId when multiple parts exist')
    part=source/pid;solid=json.loads((part/'manifest.json').read_text())
    drawing=json.loads((source/'drawing-manifest.json').read_text())
    guide=json.loads((part/'wire-guide.json').read_text())
    step_hash=hashlib.sha256((part/'model.step').read_bytes()).hexdigest()
    if guide['sourceStepSha256']!=step_hash: raise ValueError('Feature guide/STEP mismatch')
    guide['visibility']=json.loads(PROFILE.read_text())['wire3d']['featureVisibility']
    out.mkdir(parents=True,exist_ok=True)
    (out/'wire-guide.json').write_text(json.dumps(guide)+'\n')
    for layout in ('desktop','mobile','mobile-short'):
        shutil.copy2(source/drawing['layouts'][layout]['file'],out/drawing['layouts'][layout]['file'])
    shutil.copy2(part/'model.glb',out/'model.glb')
    layout=drawing['layouts']['desktop'];box=layout['frontBoxes'][pid];w,h=layout['pagePx']
    crop=[(box['cx']-box['width']/2)*w,(box['cy']-box['height']/2)*h,box['width']*w,box['height']*h]
    root=ET.Element(NS+'svg',{'viewBox':' '.join(map(str,crop))})
    sheet=ET.parse(source/layout['file']).getroot()
    part_group=next(g for g in sheet if g.get('data-part')==pid)
    front=next(g for g in part_group if g.get('data-view')=='front')
    for element in front:
        if element.tag==NS+'polyline':root.append(element)
    ET.ElementTree(root).write(out/'front-view.svg',encoding='unicode')
    settings={'schemaVersion':1,'shapeKind':'feature-solid','partId':pid,'status':'reviewed-provisional',
              'layouts':{key:{'file':v['file'],'frontBox':v['frontBoxes'][pid]} for key,v in drawing['layouts'].items()},
              'boundsMm':solid['glbBoundsMm'],'glbSha256':solid['sha256']['model.glb'],
              'sourceSha256':{'step':step_hash},'wireSource':guide['source']}
    (out/'review-input.json').write_text(json.dumps(settings,indent=2)+'\n')
    return settings
