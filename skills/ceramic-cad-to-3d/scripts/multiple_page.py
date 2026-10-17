"""Source-derived two-vessel review through the selected-page entrypoint."""
import copy
import json
import math
import re
import shutil
from ceramic_paths import ROOT, ASSETS
from photos import sha, load_photos, build_gallery
from selected_cad import front_svg, verify_inputs


def validate(review, ids):
    from page import validate as validate_scene
    validate_scene(review, ids)
    if len(ids) != 2 or len(set(ids)) != 2:
        raise ValueError('Multiple review requires two distinct CAD parts')
    def finite(value):
        if isinstance(value, (int, float)) and not math.isfinite(value):
            raise ValueError('Nonfinite multiple review input')
        if isinstance(value, dict):
            for item in value.values(): finite(item)
        if isinstance(value, list):
            for item in value: finite(item)
    finite(review)
    for p in review['parts']:
        if not re.fullmatch(r'[a-z0-9][a-z0-9-]*', p['id']): raise ValueError('Invalid part ID')
        if not isinstance(p['accentEnabled'], bool): raise ValueError('Explicit accentEnabled required')
        if not -math.pi <= p['accentCenterAngle'] <= math.pi or not .1 <= p['accentWidthScale'] <= 3:
            raise ValueError('Invalid partial glaze placement')
        m=p['motion']
        for key in ('entryXDesktop','entryXMobile','finalXDesktop','finalXMobile'):
            if not -2 <= m[key] <= 2: raise ValueError('Invalid part position')
        for key in ('axisTiltDegrees','axisDriftZDegrees','axisDriftXDegrees'):
            if not -90 <= m[key] <= 90: raise ValueError('Invalid part axis')
        if not 0 <= m['dropDelay'] <= .2: raise ValueError('Invalid drop delay')
        g=p['glazePreview']
        for key in ('baseWarmHex','accentWarmHex'):
            if key in g and not re.fullmatch(r'#[0-9a-fA-F]{6}',g[key]): raise ValueError('Invalid glaze colour')
        if not 0 <= g.get('accentWarmMix',0) <= 1: raise ValueError('Invalid warm glaze mix')
    m=review['motion'];t=m['timing'];g=m['glaze']
    if m['camera']['fov'] != 32:
        raise ValueError('Current multiple review uses the selected 32-degree camera')
    framing=m['framing']
    if not framing['enabled']: raise ValueError('Multiple review requires transformed bounds framing')
    for key in ('desktopWidthFraction','mobileWidthFraction','desktopHeightFraction','mobileHeightFraction'):
        if not .1<=framing[key]<=.98: raise ValueError('Invalid framing fraction')
    if not .01<=framing['minDistance']<=10: raise ValueError('Invalid minimum camera distance')
    for key in ('desktopEntryY','mobileEntryY','entryZ','dropBounceY'):
        if not -2<=m['layout'][key]<=2: raise ValueError('Invalid assembly position')
    if g['direction']!='bottom-up' or g['spinTurns']<1 or g['axisPrecessionTurns']<1:
        raise ValueError('Preserve bottom-up coating and body/axis rotation')
    if not 0<=g['axisRetainFraction']<=1 or not 0<=g['maxAxisTiltDegrees']<=90:
        raise ValueError('Invalid coating axis')
    if not 0<t['photoDuration']<=1-t['photoStart']: raise ValueError('Invalid scene exit')
    for screen in ('Desktop','Mobile'):
        if review['parts'][0]['motion']['finalX'+screen]>=review['parts'][1]['motion']['finalX'+screen]:
            raise ValueError('Preserve reviewed left-to-right part order')
    photo=(ROOT/review['photos']).resolve()
    if not photo.is_relative_to(ROOT): raise ValueError('Photos must be inside workspace')
    load_photos(photo)


def verify_layers(material, appearance, part_id):
    """Check preserved ordered CAD evidence before creating web material inputs."""
    matches=[p for p in material.get('composition',{}).get('parts',[]) if p['id']==part_id]
    if len(matches)!=1: raise ValueError('Two-part review requires per-part composition material evidence')
    layers=matches[0]['material']['glazeLayers']
    if len(layers)!=2 or [p['order'] for p in layers]!=[1,2]:
        raise ValueError('Current multiple review supports explicit two-layer material evidence')
    g=appearance['glazePreview']
    if not appearance['accentEnabled'] or layers[0]['name'] not in g['baseName'] or layers[1]['name'] not in g['accentName']:
        raise ValueError('Reviewed coating order disagrees with source CAD material evidence')


def prepare(project, review):
    if review is None: raise ValueError('Two-part pages require explicit reviewed scene input')
    config=json.loads((project/'input/config.json').read_text())
    if config['compositionMode']!='multiple' or any(p.get('shapeKind','rotational-profile')!='rotational-profile' for p in config['parts']):
        raise ValueError('Multiple page currently supports two rotational vessels')
    ids=[p['id'] for p in config['parts']];validate(review,ids)
    from project import verify
    verify(project,json.loads((project/'pipeline-state.json').read_text()))
    files={project/'input/config.json',project/'cad/manifest.json'}
    manifest=json.loads((project/'cad/manifest.json').read_text())
    parts=[]
    for part,appearance in zip(config['parts'],review['parts']):
        sources={key:(ROOT/part[key]).resolve() for key in ('profile','dimensions','material')}
        if any(not p.is_relative_to(project/'input') for p in sources.values()): raise ValueError('Archived CAD inputs required')
        files.update(sources.values())
        profile=json.loads(sources['profile'].read_text());dims=json.loads(sources['dimensions'].read_text())[part.get('dimensionsKey','valuesMm')]
        if not 30<=dims['height']<=300 or not .5<=dims['maxDiameter']/dims['height']<=3: raise ValueError('Unsupported multiple vessel proportions')
        # Keep full ordered material evidence; never collapse two coats into one colour.
        material=json.loads(sources['material'].read_text())
        verify_layers(material,appearance,part['id'])
        parts.append({'id':part['id'],'profile':profile,'dimensionsMm':dims,'frontSvg':front_svg(profile,dims),'materialEvidence':material,'appearance':appearance})
    for entry in manifest['layouts'].values(): files.add(project/'cad'/entry['file'])
    photo=(ROOT/review['photos']).resolve();files.add(photo)
    for item in load_photos(photo): files.add((ROOT/item['source']).resolve())
    return {'mode':'multiple','project':str(project.relative_to(ROOT)),'name':config['name'],'review':copy.deepcopy(review),'parts':parts,'sheetManifest':manifest,
            'inputsSha256':{str(p.relative_to(ROOT)):sha(p) for p in sorted(files)}}


def install(prepared,stage):
    verify_inputs(prepared)
    project=ROOT/prepared['project'];review=prepared['review']
    for entry in prepared['sheetManifest']['layouts'].values():
        shutil.copy2(project/'cad'/entry['file'],stage/'assets'/entry['file'])
    from selected_surface import render
    rendered=[]
    for p in prepared['parts']:
        out=stage/'assets'/p['id'];out.mkdir()
        (out/'outer-profile.json').write_text(json.dumps(p['profile'])+'\n')
        (out/'front-view.svg').write_text(p['frontSvg'])
        (out/'material-evidence.json').write_text(json.dumps(p['materialEvidence'],ensure_ascii=False,indent=2)+'\n')
        surface=stage/'surface-generation'/p['id']
        render(p['profile'],p['dimensionsMm'],{'glaze':{'firedAppearancePreviewHex':p['appearance']['glazePreview']['baseHex']}},surface,
               surface={'floorPolicy':'exact','roughness':.33,'clearcoat':0})
        shutil.copy2(surface/'model.glb',out/'model.glb')
        rendered.append({**p['appearance'],'dimensionsMm':p['dimensionsMm']})
    photos=ROOT/review['photos'];gallery=stage/'gallery-source';build_gallery(photos,gallery)
    for file in (gallery/'assets').iterdir():shutil.copy2(file,stage/'assets'/file.name)
    for name in ('gallery.js','gallery.css','gallery-config.js'):
        if (gallery/name).exists():shutil.copy2(gallery/name,stage/name)
    spec={**review,'compositionMode':'multiple','name':prepared['name'],'parts':rendered,'sheets':prepared['sheetManifest']['layouts'],
          'ending':'photos' if load_photos(photos) else 'glaze'}
    (stage/'assets/project.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n')
    document=(stage/'index.html').read_text();a=document.index('<section class="gallery"');b=document.index('<script type="module"',a)
    document=document[:a]+(gallery/'gallery.html').read_text()+document[b:]
    import html
    document=re.sub(r'<title>.*?</title>','<title>'+html.escape(prepared['name'])+'</title>',document)
    document=document.replace('달항아리',html.escape(prepared['name'],quote=True))
    document=re.sub(r'alt="[^"]*기술 도면:[^"]*"','alt="CAD technical drawing"',document)
    document=document.replace('./assets/cad-sheet.png','./assets/sheet-desktop.svg')
    a=document.index('<div class="cad-main"');b=document.index('</div>',a)+6
    document=document[:a]+''.join(f'<div class="cad-main" data-part="{p["id"]}" aria-hidden="true"><img src="./assets/{p["id"]}/front-view.svg" alt=""></div>' for p in prepared['parts'])+document[b:]
    document=document.replace('</style>','.cad-sheet img{left:50%;top:50%;width:100%;height:100%;object-fit:contain;transform:translate(-50%,-50%)}\n</style>')
    (stage/'index.html').write_text(document)
    for name in ('model.glb','front-view.svg','outer-profile.json','cad-sheet.png','actual-photo.webp','process-photo.webp'):
        (stage/'assets'/name).unlink(missing_ok=True)
    return {'mode':'multiple','review':review,'inputsSha256':prepared['inputsSha256'],'scope':'Two rotational vessels; provisional materials and scene; visual review pending'}
