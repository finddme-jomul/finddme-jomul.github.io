#!/usr/bin/env python3
"""Build a CAD→wire→clay axis-motion review for one handled skill project."""
from __future__ import annotations
import hashlib
import importlib.util
import json
import math
import shutil
from pathlib import Path

from ceramic_paths import ROOT, SKILL, SCRIPTS, ASSETS, PROFILE
HERE=Path(__file__).resolve().parent
MOTION_VIEWER=ASSETS/'motion'
AXIS_MODULE=ASSETS/'motion/axis-motion.mjs'
HANDOFF_BUILDER=SCRIPTS/'prepare_handled.py'



def motion_input(data: dict) -> dict:
    from wire_color import resolve
    resolve(data)
    accepted=json.loads(PROFILE.read_text())['motion']['axisRig']
    if accepted['order']!='body-spin-under-tilt-under-axis-precession' or accepted['framing']!='transformed-mesh-bounds':
        raise ValueError('Unsupported accepted axis rig profile')
    if data.get('schemaVersion') != 1 or data.get('status') not in ('reviewed-provisional','user-confirmed'):
        raise ValueError('Motion schemaVersion 1 and explicit review status are required')
    if data.get('tiltDirection') not in ('right','left','forward','backward','none') or not data.get('provenance'):
        raise ValueError('Motion direction and provenance are required')
    for key,maximum in [('tiltDegrees',90),('bodySpinDegrees',1440),('axisPrecessionDegrees',1440)]:
        value=data.get(key)
        if isinstance(value,bool) or not isinstance(value,(float,int)) or not math.isfinite(value) or not 0<=value<=maximum:
            raise ValueError(f'Invalid motion {key}')
    if any(data[key]<accepted['minimumBodyAndAxisTurnDegrees'] for key in ('axisPrecessionDegrees','bodySpinDegrees')):
        raise ValueError('Visible full axis and body rotation is required')
    return data


def build(project: Path, output: Path, data: dict) -> None:
    motion_input(data)
    source=project/'cad'
    cad=json.loads((source/'manifest.json').read_text())
    if len(cad['parts'])!=1 or cad['parts'][0]['shapeKind']!='handled-vessel':
        raise ValueError('Motion preview currently requires one handled part with a skill GLB')
    if not (source/'solid/manifest.json').is_file():
        raise ValueError('CAD project lacks a verified GLB solid')
    spec=importlib.util.spec_from_file_location('jomul_handoff_builder',HANDOFF_BUILDER)
    module=importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    module.main(source=source,out=output)
    for name in ('index.html','viewer.js','handled-scene.mjs'):
        shutil.copy2(MOTION_VIEWER/name,output/name)
    html=output/'index.html'
    html.write_text(html.read_text().replace('머그',cad['project']))
    shutil.copy2(AXIS_MODULE,output/'axis-motion.mjs')
    from wire_color import install as install_wire_color
    install_wire_color(output, data)
    (output/'motion-config.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    (output/'motion-preview-manifest.json').write_text(json.dumps({
        'schemaVersion':1,'partId':cad['parts'][0]['id'],'status':'motion-review-only',
        'axisRig':json.loads(PROFILE.read_text())['motion']['axisRig'],
        'cadManifestSha256':hashlib.sha256((source/'manifest.json').read_bytes()).hexdigest(),
        'glbSha256':json.loads((source/'solid/manifest.json').read_text())['parts'][0]['glbSha256'],
        'motionSha256':hashlib.sha256((output/'motion-config.json').read_bytes()).hexdigest(),
        'axisModuleSha256':hashlib.sha256(AXIS_MODULE.read_bytes()).hexdigest(),
        'unsupported':'glaze/photo/final page assembly and multi-part or rotational GLB generation'
    },indent=2)+'\n')


def browser_check(output: Path) -> Path:
    """Gate a generated preview on four actual browser viewport/scroll reviews."""
    from browser_environment import run_browser
    if not output.is_relative_to(ROOT):
        raise ValueError('Motion output must stay inside the workspace')
    review=output/'browser-review'
    if review.exists(): shutil.rmtree(review)
    run_browser('scripts/check-motion.cjs', {
        'JOMUL_MOTION_BASE':'http://127.0.0.1:5173/'+output.relative_to(ROOT).as_posix()+'/index.html',
        'JOMUL_MOTION_OUTPUT':'/workspace/'+review.relative_to(ROOT).as_posix(),
        'JOMUL_MOTION_INPUT':'/workspace/'+(output/'review-input.json').relative_to(ROOT).as_posix(),
    })
    report=review/'report.json'
    data=json.loads(report.read_text())
    if len(data.get('cases',[]))!=4 or sum(len(c.get('results',[])) for c in data['cases'])!=24:
        raise RuntimeError('Motion browser report lacks four viewports and 24 scenes')
    data['environment']=json.loads((SKILL/'environment.json').read_text())
    report.write_text(json.dumps(data,indent=2)+'\n')
    return report
