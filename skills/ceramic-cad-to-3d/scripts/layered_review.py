"""Explicit coating regions and optional sequential placement for reviewed vessels."""
import math
import re


def region(value, height):
    if value == {'surface': 'all'}:
        return
    if (set(value) != {'surface', 'minHeightMm', 'maxHeightMm'} or value['surface'] != 'exterior'
            or not 0 <= value['minHeightMm'] < value['maxHeightMm'] <= height):
        raise ValueError('Coating region needs all surfaces or an exterior height interval')


def coatings(spec, evidence, dims):
    if spec.get('status') != 'reviewed-provisional' or not spec.get('provenance'):
        raise ValueError('Coatings require reviewed preview provenance')
    layers = spec['layers']
    if len(layers) != 2 or [l['name'] for l in layers] != [l['name'] for l in evidence]:
        raise ValueError('Coating names/order must match archived material evidence')
    for layer, source in zip(layers, evidence):
        region(layer['region'], dims['height'])
        if source['application'] == 'exterior-below-dashed-boundary' and layer['region']['surface'] != 'exterior':
            raise ValueError('Exterior coating cannot paint the interior')
        if source['application'] == 'full-coat' and layer['region']['surface'] != 'all':
            raise ValueError('Full coat evidence requires all surfaces')
    region(spec['fired']['region'], dims['height'])
    for color in [l['previewHex'] for l in layers]+[spec['fired']['baseHex'], spec['fired']['regionHex']]:
        if not re.fullmatch(r'#[0-9a-fA-F]{6}',color): raise ValueError('Invalid coating preview colour')
    if not 0 <= spec['roughness'] <= 1: raise ValueError('Invalid coating roughness')


def assembly(spec, parts, timing):
    if spec is None: return
    if spec.get('status') != 'reviewed-provisional' or not spec.get('provenance'):
        raise ValueError('Assembly needs reviewed provenance')
    coat_end = (timing['baseGlazeStart'] + timing['baseGlazeDuration'] if timing['accentGlazeStart'] is None else timing['accentGlazeStart'] + timing['accentGlazeDuration'])
    if not coat_end < spec['start'] < spec['start']+spec['duration'] < timing['photoStart']:
        raise ValueError('Assembly must follow coatings and finish before handoff')
    if len(spec['steps']) != len(parts) or {s['partId'] for s in spec['steps']} != {p['id'] for p in parts}:
        raise ValueError('Assembly must reference each part exactly once')
    end = 0
    for step in spec['steps']:
        if not end <= step['start'] < step['start']+step['duration'] <= 1:
            raise ValueError('Assembly steps must be sequential within the stage')
        end = step['start']+step['duration']
        if len(step['targetPositionMm']) != 3 or any(not math.isfinite(v) or abs(v)>2000 for v in step['targetPositionMm']):
            raise ValueError('Assembly targets use finite millimetres, Y-up, foot-bottom origin')
        if not 0 <= step['liftMm'] <= 1000: raise ValueError('Invalid assembly lift')
    if any(p['motion']['settledScale'] != 1 for p in parts):
        raise ValueError('Assembly currently requires physical scale 1')
