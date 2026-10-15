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
    for name in ('index.html','viewer.js'):
        shutil.copy2(MOTION_VIEWER/name,output/name)
    html=output/'index.html'
    html.write_text(html.read_text().replace('머그',cad['project']))
    shutil.copy2(AXIS_MODULE,output/'axis-motion.mjs')
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
    import os
    import subprocess
    import time
    import urllib.request
    if shutil.which('docker') is None:
        raise RuntimeError('Docker/Puppeteer is required for the motion browser gate')
    if not output.is_relative_to(ROOT):
        raise ValueError('Motion output must stay inside the project repository')
    url='http://127.0.0.1:5173/'+output.relative_to(ROOT).as_posix()+'/index.html'
    server=None
    try:
        try:
            urllib.request.urlopen(url,timeout=2).close()
        except Exception:
            vite=ROOT/'node_modules/.bin/vite'
            if not vite.is_file():
                raise RuntimeError('Vite is required to serve the motion browser gate')
            server=subprocess.Popen([str(vite),'--host','127.0.0.1','--port','5173','--strictPort'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
            for _ in range(40):
                if server.poll() is not None: raise RuntimeError('Vite exited before browser check')
                try:
                    urllib.request.urlopen(url,timeout=1).close()
                    break
                except Exception:
                    time.sleep(.25)
            else: raise RuntimeError('Vite did not serve the motion preview')
        review=output/'browser-review'
        if review.exists(): shutil.rmtree(review)
        repo_mount=f'{ROOT}:/workspace'
        cache=Path.home()/'.cache/puppeteer'
        if not cache.is_dir(): raise RuntimeError('Puppeteer Chrome cache is unavailable')
        command=['docker','run','--rm','--network','host','--user',f'{os.getuid()}:{os.getgid()}',
                 '--entrypoint','node','-e',f'JOMUL_MOTION_BASE={url}',
                 '-e',f'JOMUL_MOTION_OUTPUT=/workspace/{review.relative_to(ROOT).as_posix()}',
                 '-e',f'JOMUL_MOTION_INPUT=/workspace/{(output/"review-input.json").relative_to(ROOT).as_posix()}',
                 '-v',repo_mount,'-v',f'{SKILL}:/ceramic-skill:ro','-v',f'{cache}:/browser:ro','ghcr.io/puppeteer/puppeteer:latest',
                 '/ceramic-skill/scripts/check-motion.cjs']
        subprocess.run(command,cwd=ROOT,check=True)
        report=review/'report.json'
        data=json.loads(report.read_text())
        if len(data.get('cases',[]))!=4 or sum(len(c.get('results',[])) for c in data['cases'])!=24:
            raise RuntimeError('Motion browser report lacks four viewports and 24 scenes')
        return report
    finally:
        if server:
            server.terminate()
            try: server.wait(timeout=5)
            except subprocess.TimeoutExpired: server.kill()
