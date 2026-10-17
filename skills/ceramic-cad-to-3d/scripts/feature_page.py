"""Reviewed single feature input adapter for the existing solid-page pipeline."""
import copy
import json
from ceramic_paths import ROOT
from photos import sha, load_photos
from handled_page import validate


def prepare(project, review):
    config=json.loads((project/'input/config.json').read_text())
    if config['compositionMode']=='multiple' or (review or {}).get('renderer')=='feature-solids':
        from feature_multiple import prepare as multiple
        return multiple(project,review)
    if config['compositionMode']!='single' or len(config['parts'])!=1 or config['parts'][0].get('shapeKind')!='feature-solid':
        raise ValueError('Feature full-page review currently requires one feature-solid; simultaneous feature pages remain pending')
    part=config['parts'][0]
    if review and review.get('motion',{}).get('partId',part['id'])!=part['id']:
        raise ValueError('Feature page partId differs from archived project')
    sources={key:(ROOT/part[key]).resolve() for key in ('shape','material')}
    if any(not p.is_relative_to(project/'input') for p in sources.values()):
        raise ValueError('Archived feature inputs required')
    material=json.loads(sources['material'].read_text())
    if not all(isinstance(material.get(k),dict) and material[k].get('name') for k in ('clay','glaze')):
        raise ValueError('Feature page needs explicit clay/glaze material names and reviewed preview evidence')
    validate(review,material)
    from project import verify
    verify(project,json.loads((project/'pipeline-state.json').read_text()))
    # The complete geometry/drawing bundle is the page dependency, not just its GLB.
    files={project/'input/config.json',*sources.values(),*(p for p in (project/'geometry').rglob('*') if p.is_file())}
    shape=json.loads(sources['shape'].read_text())
    if shape.get('construction')=='imported':
        from feature_step import source_path
        files.add(source_path(shape['features'][0],sources['shape'].parent))
    photo=(ROOT/review['photos']).resolve();files.add(photo)
    for item in load_photos(photo):files.add((ROOT/item['source']).resolve())
    return {'mode':'feature','project':str(project.relative_to(ROOT)),'name':config['name'],'part':part['id'],
            'review':copy.deepcopy(review),'materialEvidence':material,
            'inputsSha256':{str(p.relative_to(ROOT)):sha(p) for p in sorted(files)}}
