"""Package deterministic SVG motion from an immutable dimensional drawing review."""
import argparse
import json
import math
import re
import shutil
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path
from ceramic_paths import ROOT,SKILL
from drawing_review import sha,verify as verify_drawing


def build(source,output,duration=11,camera=None):
    if output.exists():raise ValueError('Motion output must be unused')
    if not math.isfinite(duration) or not 8<=duration<=15:raise ValueError('Duration must be 8–15 seconds')
    manifest=verify_drawing(source)
    from drawing_camera import validate_camera
    paths=validate_camera(camera,source,[p['id'] for p in manifest['parts']]) if camera is not None else {}
    output.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(dir=output.parent,prefix='.drawing-motion-') as tmp:
        stage=Path(tmp)/'motion';shutil.copytree(SKILL/'assets/drawing-motion',stage)
        shutil.copy2(SKILL/'assets/vendor/dimensional-drawing/LICENSE',stage/'vendor-license.txt')
        shutil.copy2(source/'drawing-manifest.json',stage/'source-drawing-manifest.json')
        from drawing_presentation import reading_page
        plan=json.loads((source/'drawing-plan.json').read_text())
        data=json.loads((source/'input.json').read_text())
        (stage/'reading.html').write_text(reading_page(data,plan['parts'],source.name,back='index.html'))
        parts=[]
        for part in manifest['parts']:
            pid=part['id']
            if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',pid):raise ValueError('Invalid motion part ID')
            row={'id':pid,'cameraKeys':paths.get(pid)}
            for layout in ('desktop','mobile'):
                name=f'{pid}-{layout}.svg';path=source/name
                svg=ET.parse(path).getroot()
                for e in svg.iter():
                    tag=e.tag.split('}')[-1]
                    if tag in ('script','foreignObject','image','use') or any(k.lower().startswith('on') for k in e.attrib):
                        raise ValueError('Motion accepts generated static drawing SVG only')
                if name not in manifest['files']:raise ValueError('Missing archived layout')
                shutil.copy2(path,stage/name);row[layout]=name
            parts.append(row)
        (stage/'motion.json').write_text(json.dumps({'schemaVersion':1,'durationSeconds':duration,'parts':parts},indent=2)+'\n')
        record={'schemaVersion':1,'status':'candidate','runtimeLockSha256':sha(SKILL/'runtime-lock.json'),'sourceDrawingManifestSha256':sha(source/'drawing-manifest.json'),
                'limitations':['Independent drawing motion review; no 3D handoff or video export.','No exploded ceramic layers or geometry morphing.'],
                'files':{p.name:sha(p) for p in stage.iterdir() if p.is_file()}}
        (stage/'motion-manifest.json').write_text(json.dumps(record,indent=2)+'\n');verify(stage);stage.rename(output)


def verify(output):
    manifest=json.loads((output/'motion-manifest.json').read_text())
    actual={p.relative_to(output).as_posix() for p in output.rglob('*') if p.is_file() and p.name!='motion-manifest.json'}
    if actual!=set(manifest['files']):raise ValueError('Motion output file set changed')
    for name,digest in manifest['files'].items():
        p=output/name
        if not p.resolve().is_relative_to(output.resolve()) or sha(p)!=digest:raise ValueError('Motion output changed: '+name)
    return manifest


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--drawing',type=Path);parser.add_argument('--output',type=Path)
    parser.add_argument('--camera',type=Path,help='Reviewed per-part camera key JSON')
    parser.add_argument('--duration',type=float,default=11);parser.add_argument('--verify',type=Path)
    args=parser.parse_args()
    if args.verify:
        if args.drawing or args.output or args.camera:parser.error('--verify cannot be combined with generation')
        verify(ROOT/args.verify);print('CERAMIC_DRAWING_MOTION_VERIFIED');return
    if not args.drawing or not args.output:parser.error('--drawing and --output required')
    build(ROOT/args.drawing,ROOT/args.output,args.duration,json.loads((ROOT/args.camera).read_text()) if args.camera else None);print('CERAMIC_DRAWING_MOTION',ROOT/args.output)
