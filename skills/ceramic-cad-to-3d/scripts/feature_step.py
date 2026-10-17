"""Reviewed STEP interchange: preserve one solid, explicit bounds and intent."""
import hashlib
from pathlib import Path
import re


def validate(feature):
    from feature_shape import vector
    source=feature.get('source')
    if not isinstance(source,str) or Path(source).name!=source or Path(source).suffix.lower() not in ('.step','.stp'):
        raise ValueError('STEP source must be an adjacent .step/.stp filename')
    if not re.fullmatch('[0-9a-f]{64}',str(feature.get('sha256',''))):
        raise ValueError('Reviewed STEP SHA256 required')
    b=feature.get('expectedBoundsMm',{})
    if set(b)!={'min','max'} or any(a>=z for a,z in zip(vector(b['min']),vector(b['max']))):
        raise ValueError('Explicit expected STEP min/max bounds in mm required')
    if feature.get('modelIntent') not in ('solid','hollow'):
        raise ValueError('Explicit imported modelIntent solid/hollow required')
    if feature['modelIntent']=='hollow':vector(feature.get('cavityProbeMm'))
    elif 'cavityProbeMm' in feature:raise ValueError('Cavity probe requires hollow modelIntent')


def source_path(feature, base_dir):
    validate(feature)
    if base_dir is None:raise ValueError('STEP requires a source JSON directory')
    source=(Path(base_dir)/feature['source']).resolve(strict=True)
    if not source.is_file() or hashlib.sha256(source.read_bytes()).hexdigest()!=feature['sha256']:
        raise ValueError('STEP source hash differs from reviewed input')
    return source


def load(feature, base_dir):
    from build123d import import_step
    model=import_step(source_path(feature,base_dir))
    solids=model.solids()
    if len(solids)!=1 or not model.is_valid or solids[0].volume<=0 or len(model.faces())!=len(solids[0].faces()) or len(model.edges())!=len(solids[0].edges()):
        raise ValueError('STEP must contain exactly one connected valid solid without extra geometry')
    solid=solids[0];b=solid.bounding_box()
    for side in ('min','max'):
        if any(abs(a-z)>.1 for a,z in zip(getattr(b,side),feature['expectedBoundsMm'][side])):
            raise ValueError('Imported STEP bounds disagree with reviewed mm dimensions/orientation')
    if feature['modelIntent']=='hollow':
        probe=feature['cavityProbeMm']
        if not all(a<v<z for a,v,z in zip(b.min,probe,b.max)) or solid.is_inside(probe):
            raise ValueError('Imported hollow probe must be empty inside the bounding box')
    return solid
