"""CAD-derived front/wire inputs for the selected scene, with honest partial scope.

Until its sheet and surface generators are connected, this bridge accepts only
CAD inputs compatible with the retained selected sheet/model/material assets.
"""
import json
import math
from pathlib import Path
from ceramic_paths import ASSETS, ROOT
from photos import sha


def front_svg(profile, dimensions):
    height, diameter = dimensions['height'], dimensions['maxDiameter']
    if not all(math.isfinite(v) and v > 0 for v in (height, diameter)):
        raise ValueError('Invalid front dimensions')
    if len(profile) < 2 or any(len(p) != 2 or not all(math.isfinite(v) for v in p) for p in profile):
        raise ValueError('Invalid CAD profile')
    if any(r < 0 for r, z in profile) or any(b[1] <= a[1] for a, b in zip(profile, profile[1:])):
        raise ValueError('CAD profile must have nonnegative radii and increasing heights')
    if abs(profile[0][1]) > 1e-6 or abs(profile[-1][1] - height) > .05 or abs(max(r for r, z in profile)*2-diameter) > .05:
        raise ValueError('CAD profile and front dimensions disagree')
    points = [(diameter/2-r, height-z) for r, z in profile]
    points += [(diameter/2+r, height-z) for r, z in reversed(profile)]
    path = ' '.join(('M' if i == 0 else 'L') + f'{x:.3f},{y:.3f}' for i, (x, y) in enumerate(points)) + ' Z'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {diameter:.3f} {height:.3f}" '
            f'role="img" aria-label="CAD 정면 윤곽">'
            f'<path d="{path}" fill="none" stroke="#56636b" stroke-width="0.7" '
            f'stroke-linejoin="round" stroke-linecap="round"/></svg>\n')


def prepare(project):
    project = Path(project).resolve()
    if not project.is_relative_to(ROOT):
        raise ValueError('CAD project must be in the workspace')
    config_file = project/'input/config.json'
    config = json.loads(config_file.read_text())
    parts = config['parts']
    if config['compositionMode'] != 'single' or len(parts) != 1 or parts[0].get('shapeKind', 'rotational-profile') != 'rotational-profile':
        raise ValueError('Selected CAD bridge currently supports one rotational part only')
    part = parts[0]
    files = {'config': config_file}
    for key in ('profile', 'dimensions', 'material'):
        files[key] = (ROOT/part[key]).resolve()
        if not files[key].is_relative_to(project/'input'):
            raise ValueError('CAD bridge requires archived project input: '+key)
    profile = json.loads(files['profile'].read_text())
    dims = json.loads(files['dimensions'].read_text())[part.get('dimensionsKey', 'valuesMm')]
    material = json.loads(files['material'].read_text())
    reference = ASSETS/'selected-page/assets'
    settings = json.loads((reference/'project.json').read_text())
    if profile != json.loads((reference/'outer-profile.json').read_text()) or dims != settings['dimensionsMm']:
        raise ValueError('CERAMIC_SELECTED_CAD_PENDING: changed geometry needs the selected sheet/model generation bridge; refusing to pair it with reference assets')
    if part['materialFormat'] != 'single' or material['clay']['wetPreviewHex'] != settings['clayColor'] or material['glaze']['firedAppearancePreviewHex'] != settings['finishColor']:
        raise ValueError('CERAMIC_SELECTED_CAD_PENDING: changed material needs the selected surface generation bridge')
    expected_material = json.loads((ASSETS/'selected-page.json').read_text())['cadBridgeMaterial']
    if any(material[group].get(key) != value for group, fields in expected_material.items() for key, value in fields.items()):
        raise ValueError('CERAMIC_SELECTED_CAD_PENDING: changed material labels/finish cannot use the retained sheet/model')
    # Retained sheet labels include forming sizes and provisional-source notes.
    expected_inputs = json.loads((ASSETS/'selected-page.json').read_text())['cadBridgeInputSha256']
    if any(sha(files[key]) != value for key, value in expected_inputs.items()):
        raise ValueError('CERAMIC_SELECTED_CAD_PENDING: changed dimension/material record cannot use the retained reference sheet')
    # Also check actual CAD and solid outputs, not just the input shape.
    from project import verify
    verify(project, json.loads((project/'pipeline-state.json').read_text()))
    svg = front_svg(profile, dims)
    if svg != (reference/'front-view.svg').read_text():
        raise ValueError('Selected CAD front extraction differs from the reference')
    return {'project': str(project.relative_to(ROOT)), 'part': part['id'],
            'inputsSha256': {str(p.relative_to(ROOT)): sha(p) for p in files.values()},
            'profile': profile, 'frontSvg': svg}


def verify_inputs(prepared):
    for name, expected in prepared['inputsSha256'].items():
        if sha(ROOT/name) != expected:
            raise ValueError('CAD input changed during selected-page verification: '+name)


def install(prepared, stage):
    verify_inputs(prepared)
    # Preserve the original profile serialization as well as numeric values.
    (stage/'assets/outer-profile.json').write_text(json.dumps(prepared['profile'])+'\n')
    (stage/'assets/front-view.svg').write_text(prepared['frontSvg'])
    return {k: v for k, v in prepared.items() if k not in ('profile', 'frontSvg')}
