"""Conservative input-based scheduling for implemented CAD consumers."""
import hashlib
import json
from ceramic_paths import ROOT, PROFILE, SKILL


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fingerprint(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True).encode()).hexdigest()


def inputs(config_path):
    config = json.loads(config_path.read_text())
    geometry, material = [], []
    drawing = json.loads(config_path.read_text())
    for part, normalized in zip(config['parts'], drawing['parts']):
        geometry.append({
            'id': part['id'], 'shapeKind': part.get('shapeKind', 'rotational-profile'),
            'dimensionsKey': part.get('dimensionsKey', 'valuesMm'),
            'sources': {kind: digest(ROOT / part[kind]) for kind in ('profile', 'dimensions', 'handle', 'shape') if kind in part}})
        material.append({'id': part['id'], 'source': digest(ROOT / part['material']),
                         'format': part.get('materialFormat')})
        for kind in ('profile', 'dimensions', 'handle', 'shape', 'material'):
            if kind in normalized:
                normalized[kind] = kind  # File location alone does not change the rendering.
    return {'geometry': fingerprint(geometry), 'material': fingerprint(material),
            'drawing': fingerprint([drawing, json.loads(PROFILE.read_text())['cad']]),
            'runtime': digest(SKILL / 'runtime-lock.json')}


def plan(previous, current, artifacts_match):
    changed = [key for key in current if not previous or previous.get(key) != current[key]]
    rebuild_sheet = bool(changed) or not artifacts_match
    rebuild_solid = not artifacts_match or any(k in changed for k in ('geometry', 'runtime'))
    return {'changedInputs': changed, 'sheet': 'build' if rebuild_sheet else 'reuse',
            'solid': 'build' if rebuild_solid else 'reuse',
            'motion': 'invalidate' if rebuild_sheet else 'preserve', 'gallery': 'preserve',
            'page': 'invalidate' if rebuild_sheet else 'preserve'}
