"""Generate a review surface from current CAD; publication requires scene parity."""
import json
import os
from pathlib import Path
import subprocess
from build123d import export_stl
from ceramic_paths import SKILL
from jomul_handled_solid import make_rotational_solid


def render(profile, dimensions, material, output, surface=None):
    output = Path(output).resolve()
    output.mkdir(parents=True, exist_ok=True)
    settings=json.loads((SKILL/'assets/selected-surface.json').read_text())
    if surface is not None:
        settings.update(surface)
    solid, checks = make_rotational_solid(profile, dimensions, floor_policy=settings['floorPolicy'])
    checks['nominalFloorHeightMm'] = checks.pop('floorHeightMm')
    checks['firstInnerRingHeightMm'] = next(z for r,z in profile if z >= checks['nominalFloorHeightMm'])
    if not export_stl(solid, output/'surface.stl', tolerance=settings['stlTolerance'], angular_tolerance=settings['stlAngularTolerance']):
        raise ValueError('Selected surface STL export failed')
    (output/'surface-input.json').write_text(json.dumps({
        'dimensionsMm':dimensions, 'finishColor':material['glaze']['firedAppearancePreviewHex'],
        'cadChecks':checks, 'surfaceSettings':settings}, indent=2)+'\n')
    from blender_environment import command
    subprocess.run(command(output)+['--python','/ceramic-skill/scripts/selected_surface_blender.py','--','/output'],check=True)
    return json.loads((output/'blender-report.json').read_text())
