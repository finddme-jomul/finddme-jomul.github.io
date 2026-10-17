"""Full handled review assembled from the verified CAD/solid motion path."""
import copy
import html
import json
import math
import re
import shutil
from ceramic_paths import ROOT, ASSETS
from photos import sha, load_photos, build_gallery
from selected_cad import verify_inputs
from motion import motion_input


def validate(review, material):
    if not review or review.get('schemaVersion') != 1 or review.get('status') != 'reviewed-provisional' or not review.get('provenance'):
        raise ValueError('Handled page requires an explicit provisional review and provenance')
    motion_input(review['motion'])
    surface=review['surface']
    for value,low,high in [(review['motion'].get('surfaceElevationDegrees',0),0,35),(review['motion']['storyHeightVh'],300,1500),(surface['roughness'],0,1),(surface['clearcoat'],0,1)]:
        if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) or not low<=value<=high:
            raise ValueError('Invalid handled story/material value')
    for key in ('clayHex','glazeHex'):
        if not re.fullmatch(r'#[0-9a-fA-F]{6}',surface[key]): raise ValueError('Explicit preview colour required')
    if surface['clayName']!=material['clay']['name'] or surface['glazeName']!=material['glaze']['name']:
        raise ValueError('Preview material names disagree with archived CAD evidence')
    if material.get('composition') or material['glaze'].get('layers') or material.get('glazeLayers'):
        raise ValueError('Handled page currently supports one explicit glaze layer')
    if not surface.get('provenance'): raise ValueError('Surface preview provenance required')
    photos=(ROOT/review['photos']).resolve()
    if not photos.is_relative_to(ROOT): raise ValueError('Photos must be inside workspace')
    load_photos(photos)


def prepare(project, review):
    config=json.loads((project/'input/config.json').read_text())
    if config['compositionMode']!='single' or len(config['parts'])!=1 or config['parts'][0].get('shapeKind')!='handled-vessel':
        raise ValueError('Handled page requires one complete handled vessel')
    part=config['parts'][0]
    sources={key:(ROOT/part[key]).resolve() for key in ('profile','dimensions','material','handle')}
    if any(not p.is_relative_to(project/'input') for p in sources.values()): raise ValueError('Archived CAD inputs required')
    material=json.loads(sources['material'].read_text());validate(review,material)
    from project import verify
    verify(project,json.loads((project/'pipeline-state.json').read_text()))
    manifest=json.loads((project/'cad/manifest.json').read_text())
    solid=json.loads((project/'cad/solid/manifest.json').read_text())
    if len(solid['parts'])!=1 or solid['parts'][0]['id']!=part['id']: raise ValueError('CAD/solid part mismatch')
    files={project/'input/config.json',project/'cad/manifest.json',project/'cad/solid/manifest.json',*sources.values()}
    files.add(project/'cad/solid'/part['id']/'model.glb')
    for entry in manifest['layouts'].values(): files.add(project/'cad'/entry['file'])
    photo=(ROOT/review['photos']).resolve();files.add(photo)
    for item in load_photos(photo): files.add((ROOT/item['source']).resolve())
    return {'mode':'handled','project':str(project.relative_to(ROOT)),'name':config['name'],'part':part['id'],'review':copy.deepcopy(review),'materialEvidence':material,
            'inputsSha256':{str(p.relative_to(ROOT)):sha(p) for p in sorted(files)}}


def install(prepared, stage):
    verify_inputs(prepared)
    feature=prepared.get('mode')=='feature'
    if feature:
        from prepare_feature_motion import prepare as prepare_feature
        prepare_feature(ROOT/prepared['project']/'geometry',stage,prepared['review']['motion'])
    else:
        from prepare_handled import main
        main(ROOT/prepared['project']/'cad',stage)
    review=prepared['review']
    (stage/'motion-config.json').write_text(json.dumps(review['motion'],ensure_ascii=False,indent=2)+'\n')
    (stage/'material-evidence.json').write_text(json.dumps(prepared['materialEvidence'],ensure_ascii=False,indent=2)+'\n')
    gallery=stage/'gallery-source';build_gallery(ROOT/review['photos'],gallery)
    for file in (gallery/'assets').iterdir(): shutil.copy2(file,stage/'assets'/file.name)
    for name in ('gallery.js','gallery.css','gallery-config.js'):
        if (gallery/name).exists(): shutil.copy2(gallery/name,stage/name)
    spec={**review,'shapeKind':'feature-solid' if feature else 'handled-vessel','compositionMode':'single','name':prepared['name'],
          'ending':'photos' if load_photos(ROOT/review['photos']) else 'glaze'}
    (stage/'assets/project.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n')
    document=(ASSETS/'motion/index.html').read_text()
    document=re.sub(r'<title>.*?</title>','<title>'+html.escape(prepared['name'])+'</title>',document)
    document=document.replace('</head>','<link rel="stylesheet" href="./gallery.css"></head>')
    document=document.replace('<script type="module"',(gallery/'gallery.html').read_text()+'\n<script type="module"')
    document=document.replace('머그의 임시 CAD 정면이 3D 선으로 전환되고, 달항아리 기준으로 기울어진 축과 기물이 회전하는 비교 화면','CAD to wire, clay and glaze review')
    (stage/'index.html').write_text(document)
    for name in ('model.glb','front-view.svg','outer-profile.json','cad-sheet.png','actual-photo.webp','process-photo.webp'):
        (stage/'assets'/name).unlink(missing_ok=True)
    return {'mode':prepared['mode'],'review':review,'inputsSha256':prepared['inputsSha256'],
            'generated':['front-view.svg','wire-guide.json','index.html','assets/project.json','gallery-source'],
            'retainedReference':['verified complete CAD solid model.glb and common CAD sheets; shared handled motion'],
            'scope':'One complete solid, one reviewed all-surface glaze; provisional appearance, visual adoption pending'}
