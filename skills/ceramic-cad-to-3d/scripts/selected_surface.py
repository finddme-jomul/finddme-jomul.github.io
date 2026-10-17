"""Generate a review surface from current CAD; publication requires scene parity."""
import json
import os
from pathlib import Path
import subprocess
from build123d import export_stl
from ceramic_paths import SKILL
from jomul_handled_solid import make_rotational_solid


def render(profile, dimensions, material, output):
    output = Path(output).resolve()
    output.mkdir(parents=True, exist_ok=True)
    settings=json.loads((SKILL/'assets/selected-surface.json').read_text())
    solid, checks = make_rotational_solid(profile, dimensions, floor_policy=settings['floorPolicy'])
    checks['nominalFloorHeightMm'] = checks.pop('floorHeightMm')
    checks['firstInnerRingHeightMm'] = next(z for r,z in profile if z >= dimensions['baseThickness'])
    if not export_stl(solid, output/'surface.stl', tolerance=settings['stlTolerance'], angular_tolerance=settings['stlAngularTolerance']):
        raise ValueError('Selected surface STL export failed')
    (output/'surface-input.json').write_text(json.dumps({
        'dimensionsMm':dimensions, 'finishColor':material['glaze']['firedAppearancePreviewHex'],
        'cadChecks':checks, 'surfaceSettings':settings}, indent=2)+'\n')
    image=settings['imageId']
    subprocess.run(['docker','run','--rm','--pull=never','--network','none',
        '--user',f'{os.getuid()}:{os.getgid()}', '--cap-drop','ALL',
        '--security-opt','no-new-privileges:true', '-e','HOME=/tmp',
        '-v',f'{SKILL}:/ceramic-skill:ro','-v',f'{output}:/output',
        image,'--python','/ceramic-skill/scripts/selected_surface_blender.py','--','/output'],check=True)
    return json.loads((output/'blender-report.json').read_text())
