"""Feature adapters for the existing multi-part page and placement pipeline."""
import copy
import json
import math
import shutil
from ceramic_paths import ROOT
from photos import sha, load_photos
from multiple_page import validate


def prepare(project, review):
    config=json.loads((project/'input/config.json').read_text())
    if config['compositionMode']!='multiple' or any(p.get('shapeKind')!='feature-solid' for p in config['parts']):
        raise ValueError('Feature multiple pages require homogeneous feature-solid parts')
    if not review or review.get('renderer')!='feature-solids':
        raise ValueError('Explicit feature-solids renderer review required')
    validate(review,[p['id'] for p in config['parts']])
    if review['motion']['timing']['accentGlazeStart'] is not None:
        raise ValueError('Feature pages currently support one all-surface glaze')
    if review.get('assembly'):
        t=review['motion']['timing']
        if any(t['dropStart']+p['motion']['dropDelay']+t['dropDuration']>=review['assembly']['start'] for p in review['parts']):
            raise ValueError('Feature placement must settle before assembly')
    from project import verify
    verify(project,json.loads((project/'pipeline-state.json').read_text()))
    files={project/'input/config.json',*(p for p in (project/'geometry').rglob('*') if p.is_file())}
    parts=[]
    for part,appearance in zip(config['parts'],review['parts']):
        sources={k:(ROOT/part[k]).resolve() for k in ('shape','material')}
        if any(not p.is_relative_to(project/'input') for p in sources.values()):raise ValueError('Archived feature inputs required')
        files.update(sources.values());material=json.loads(sources['material'].read_text());g=appearance['glazePreview']
        if material.get('composition') or material.get('glazeLayers') or material.get('glaze',{}).get('layers') or appearance.get('coatings') or appearance['accentEnabled']:
            raise ValueError('Feature pages currently support one all-surface glaze')
        if g.get('clayName')!=material.get('clay',{}).get('name') or g.get('baseName')!=material.get('glaze',{}).get('name') or not g.get('clayName') or not g.get('baseName'):
            raise ValueError('Feature material names must match archived evidence')
        for key in ('roughness','clearcoat'):
            v=g.get(key)
            if isinstance(v,bool) or not isinstance(v,(float,int)) or not math.isfinite(v) or not 0<=v<=1:raise ValueError('Explicit feature surface roughness/clearcoat required')
        if review.get('assembly') and any(not float(v).is_integer() for v in (appearance['motion']['turns'],appearance['motion']['orbitTurns'],review['motion']['glaze']['spinTurns'],review['motion']['glaze']['axisPrecessionTurns'])):
            raise ValueError('Upright feature assembly requires whole turns; target rotations unsupported')
        manifest=json.loads((project/'geometry'/part['id']/'manifest.json').read_text())
        b={f'{side}{axis}':manifest['boundsMm'][side][i] for side in ('min','max') for i,axis in enumerate('XYZ')}
        parts.append({'id':part['id'],'appearance':appearance,'materialEvidence':material,'boundsMm':b,'dimensionsMm':{'height':b['maxZ']-b['minZ']},'step':project/'geometry'/part['id']/'model.step'})
    photo=(ROOT/review['photos']).resolve();files.add(photo)
    for item in load_photos(photo):files.add((ROOT/item['source']).resolve())
    from feature_assembly import check
    assembly_check=check(parts,review.get('assembly'),review['motion'])
    return {'mode':'multiple','featureSolids':True,'project':str(project.relative_to(ROOT)),'name':config['name'],'review':copy.deepcopy(review),'parts':parts,
            'sheetManifest':json.loads((project/'geometry/drawing-manifest.json').read_text()),'assemblyCheck':assembly_check,
            'inputsSha256':{str(p.relative_to(ROOT)):sha(p) for p in sorted(files)}}


def install_part(project,part,out):
    from prepare_feature_motion import prepare
    prepare(project/'geometry',out,{'partId':part['id']})
    for sheet in out.glob('sheet-*.svg'):sheet.unlink()
    # This page uses the parent shared sheet/spec; standalone motion metadata is unused.
    (out/'review-input.json').unlink()
    (out/'material-evidence.json').write_text(json.dumps(part['materialEvidence'],ensure_ascii=False,indent=2)+'\n')
    return {**part['appearance'],'shapeKind':'feature-solid','dimensionsMm':part['dimensionsMm'],'boundsMm':part['boundsMm'],
            'sourceStepSha256':sha(part['step'])}
