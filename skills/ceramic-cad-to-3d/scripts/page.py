"""Assemble an explicit scene review from verified project outputs, never old GLBs."""
import copy
import json
import math
import shutil
import xml.etree.ElementTree as ET
from pathlib import Path
from ceramic_paths import ROOT, SKILL, ASSETS, PROFILE
from stages import hashes, describe
from photos import sha, verify_sources
from gallery_profile import write_gallery_assets


def validate(data, ids):
    if data.get('schemaVersion') != 1 or data.get('status') != 'reviewed-provisional' or not data.get('provenance'):
        raise ValueError('Page input needs schemaVersion 1, reviewed-provisional status and provenance')
    if [p['id'] for p in data['parts']] != ids:
        raise ValueError('Page part order/IDs must match CAD')
    def finite(value):
        if isinstance(value, float) and not math.isfinite(value): raise ValueError('Nonfinite scene value')
        if isinstance(value, dict):
            for v in value.values(): finite(v)
        if isinstance(value, list):
            for v in value: finite(v)
    finite(data)
    m=data['motion']; t=m['timing']
    if not m.get('provenance') or not 200 <= m['storyHeightVh'] <= 2000:
        raise ValueError('Explicit reviewed timing/camera/layout are required')
    for k in ('cadEnd','sheetFadeStart','frontMoveStart','frontFadeStart','wireFadeStart','axisFadeStart',
              'dropStart','clayStart','baseGlazeStart','settleStart','cameraFocusStart','photoStart'):
        if not 0 <= t[k] < 1: raise ValueError('Invalid timing '+k)
    for k in ('sheetFadeDuration','frontMoveDuration','frontFadeDuration','wireFadeDuration',
              'axisFadeDuration','dropDuration','clayDuration','baseGlazeDuration','settleDuration',
              'cameraFocusDuration','surfaceSweepWidth'):
        if not 0 < t[k] <= 1: raise ValueError('Invalid duration '+k)
    if not t['baseGlazeStart']+t['baseGlazeDuration'] < t['photoStart']:
        raise ValueError('Glaze must finish before photo handoff')
    if t['accentGlazeStart'] is not None and not (0 < t['accentGlazeDuration'] and
            t['baseGlazeStart'] <= t['accentGlazeStart'] < t['accentGlazeStart']+t['accentGlazeDuration'] < t['photoStart']):
        raise ValueError('Accent glaze timing is invalid')
    for part in data['parts']:
        if not part.get('provenance') or not part['motion'].get('provenance'):
            raise ValueError('Each appearance and motion needs provenance')
        if part['motion']['turns'] < 1 or part['motion']['orbitTurns'] < 1:
            raise ValueError('Body and axis must both complete a full turn')
        for k in ('settledScale','cadToWireScale','cadToWireScaleMobile'):
            if not 0 < part['motion'][k] <= 10: raise ValueError('Invalid scale')
        import re
        for k in ('clayHex','baseHex','accentHex'):
            if not re.fullmatch(r'#[0-9a-fA-F]{6}',part['glazePreview'][k]): raise ValueError('Explicit preview colours required')


def build(project, out, data):
    state=json.loads((project/'pipeline-state.json').read_text())
    status=describe(project,state)
    if any(status[k]['status']!='complete' for k in ('cad','gallery')):
        raise ValueError('Page needs current CAD and explicit gallery input (empty list is allowed)')
    verify_sources(project/'gallery')
    config=json.loads((project/'input/config.json').read_text())
    sheet=json.loads((project/'cad/manifest.json').read_text())
    ids=[p['id'] for p in config['parts']]
    validate(data,ids)
    if any(p.get('shapeKind','rotational-profile')!='rotational-profile' for p in config['parts']):
        raise ValueError('Full-page review currently supports rotational parts; handled motion retains its own verified preview')
    solid=json.loads((project/'cad/solid/manifest.json').read_text())
    if [r['id'] for r in solid['parts']]!=ids: raise ValueError('CAD/solid parts disagree')
    profile=json.loads(PROFILE.read_text());out.mkdir(parents=True)
    assets=out/'assets';assets.mkdir()
    manifest=[]
    for raw,row in zip(config['parts'],solid['parts']):
        pid=raw['id'];dest=assets/pid;dest.mkdir()
        points=json.loads((ROOT/raw['profile']).read_text())
        if sha(ROOT/raw['profile'])!=row['sourceSha256']['profile']: raise ValueError('Solid profile drift')
        shutil.copy2(ROOT/raw['profile'],dest/'outer-profile.json')
        shutil.copy2(project/'cad/solid'/pid/'model.glb',dest/'model.glb')
        # CAD-derived rings and meridians; no tessellation edges or sample-index density.
        segments=[]
        def line(points):
            for a,b in zip(points,points[1:]):
                for r in (a,b): segments.extend(r)
        height=points[-1][1]
        for fraction in profile['cad']['isometricRingFractions']:
            z=height*fraction
            a,b=next((a,b) for a,b in zip(points,points[1:]) if a[1]<=z<=b[1])
            radius=a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1])
            line([(radius*math.cos(i*math.tau/96)/1000,z/1000,radius*math.sin(i*math.tau/96)/1000) for i in range(97)])
        for i in range(8):
            a=i*math.tau/8
            line([(r*math.cos(a)/1000,z/1000,r*math.sin(a)/1000) for r,z in points])
        (dest/'wire-guide.json').write_text(json.dumps({'sourceSha256':row['sourceSha256'],'positionsYUpMetres':segments}))
        layout=sheet['layouts']['desktop'];box=layout['frontBoxes'][pid];w,h=layout['pagePx']
        ns='{http://www.w3.org/2000/svg}'
        svg=ET.Element(ns+'svg',{'viewBox':f"{(box['cx']-box['width']/2)*w} {(box['cy']-box['height']/2)*h} {box['width']*w} {box['height']*h}"})
        original=ET.parse(project/'cad'/layout['file']).getroot()
        for element in original.iter():
            if element.get('data-front-part')==pid: svg.append(copy.deepcopy(element))
        if not len(svg): raise ValueError('CAD front outline missing')
        ET.ElementTree(svg).write(dest/'front.svg',encoding='unicode')
        manifest.append({'id':pid,'front':f'{pid}/front.svg','boundsMm':{'width':max(p[0] for p in points)*2,'height':height}})
    for layout in sheet['layouts'].values(): shutil.copy2(project/'cad'/layout['file'],assets/layout['file'])
    (assets/'common-sheet-manifest.json').write_text(json.dumps(sheet))
    (assets/'sheets-manifest.json').write_text(json.dumps({'schemaVersion':2,'parts':manifest}))
    gallery=json.loads((project/'gallery/manifest.json').read_text())
    for f in (project/'gallery/assets').iterdir(): shutil.copy2(f,assets/f.name)
    scene=copy.deepcopy(data);scene.update(schemaVersion=3,mode=config['compositionMode'],display={'header':config['name']},finalPhotos=gallery['photos'])
    scene['motion']['singleFraming']=profile['motion']['singleFraming']
    # Shared selected glaze/axis logic owns these constants, not old scene input overrides.
    scene['motion'].pop('glaze',None)
    (assets/'scene.json').write_text(json.dumps(scene))
    (assets/'page-profile.json').write_text(json.dumps(profile))
    markup=(ASSETS/'page/index.html').read_text().replace('<!-- The generator inserts a photo gallery only when reviewed photos exist. -->',(project/'gallery/gallery.html').read_text())
    (out/'index.html').write_text(markup)
    shutil.copy2(ASSETS/'page/viewer.js',out/'viewer.js')
    for p in (ASSETS/'scene').glob('*.mjs'): shutil.copy2(p,out/p.name)
    shutil.copy2(ASSETS/'motion/axis-motion.mjs',out/'axis-motion.mjs')
    write_gallery_assets(out,profile['gallery'])
    (out/'page-manifest.json').write_text(json.dumps({'status':'candidate','mode':scene['mode'],'partCount':len(ids),'photoCount':len(gallery['photos']),
        'sourceCadSha256':sha(project/'cad/manifest.json'),'sourceGallerySha256':sha(project/'gallery/manifest.json'),
        'sourceScene':data,'profileSha256':sha(PROFILE),'scope':'rotational-full-page-review;visual-parity-and-new-project-E2E-pending'},indent=2))


def browser_check(out):
    from browser_environment import run_browser
    run_browser('tests/check-page.cjs',{'JOMUL_PAGE_BASE':'http://127.0.0.1:5173/'+out.relative_to(ROOT).as_posix(),
        'JOMUL_PAGE_OUTPUT':'/workspace/'+(out/'browser-review').relative_to(ROOT).as_posix()})
    report=json.loads((out/'browser-review/report.json').read_text())
    if report.get('status')!='passed' or len(report['cases'])!=4: raise ValueError('Incomplete page browser gate')
