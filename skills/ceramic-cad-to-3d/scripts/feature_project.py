"""Feature-solid lifecycle adapter; CAD sheet/page readiness stays separate."""
import copy
import json
import shutil
from ceramic_paths import ROOT, SKILL
from feature_shape import generate, build as compile_shape
from rebuild import inputs


def uses_features(config):
    return any(p.get('shapeKind') == 'feature-solid' for p in config['parts'])


def validate_config(config):
    from feature_shape import validate
    if not all(p.get('shapeKind') == 'feature-solid' for p in config['parts']):
        raise ValueError('Mixed feature-solid/vessel projects await common sheet integration')
    for part in config['parts']:
        if any(key in part for key in ('profile', 'dimensions', 'handle')):
            raise ValueError('Feature dimensions belong to shape input; no vessel profile substitution')
        source = ROOT / part['shape']
        validate(json.loads(source.read_text()))
        material = json.loads((ROOT / part['material']).read_text())
        if not isinstance(material, dict): raise ValueError('Material evidence must be a JSON object')


def verify(project, state):
    from project import tree_hashes
    entry = state.get('featureGeometry')
    if not entry or state['status'] != 'geometry-ready':
        raise ValueError('No ready feature geometry')
    if tree_hashes(project/'input') != entry['inputSha256'] or tree_hashes(project/'geometry') != entry['filesSha256']:
        raise ValueError('Feature input/output drift; resume with reviewed config or rollback')
    from build123d import import_step
    from jomul_handled_solid import bounds, glb_bounds_mm
    config = json.loads((project/'input/config.json').read_text())
    if entry.get('drawingCandidate'):
        from feature_drawing import verify as verify_drawing
        verify_drawing(config,project/'geometry')
    for part in config['parts']:
        out = project/'geometry'/part['id']
        original, _ = compile_shape(json.loads((ROOT/part['shape']).read_text()),(ROOT/part['shape']).parent)
        restored = import_step(out/'model.step')
        if not restored.is_valid or len(restored.solids()) != 1 or abs(original.volume-restored.volume)/original.volume > 1e-6:
            raise ValueError('Feature STEP geometry differs from reviewed source')
        expected, actual, mesh = bounds(original), bounds(restored), glb_bounds_mm(out/'model.glb')
        if any(abs(expected[k]-actual[k]) > .1 or abs(expected[k]-mesh[k]) > .5 for k in expected):
            raise ValueError('Feature bounds differ from reviewed source')


def build(project, state):
    from project import tree_hashes, save, record
    from preflight import verify_package
    verify_package()
    config_path = project/'input/config.json'
    config = json.loads(config_path.read_text())
    validate_config(config)
    current = inputs(config_path)
    old = state.get('featureGeometry')
    out, stage, previous = (project/name for name in ('geometry', 'geometry.building', 'geometry.previous'))
    if previous.exists(): raise ValueError('Unresolved previous geometry publication')
    if old and current == old['buildInputs'] and tree_hashes(out) == old['filesSha256']:
        # Material metadata/input paths can change while producing identical geometry.
        state['status'] = 'geometry-ready'
        state['nextInput'] = 'Review feature drawing/curve guide; provide explicit material/motion input for page-review'
        old['inputSha256'] = tree_hashes(project/'input')
        verify(project,state)
        save(project/'pipeline-state.json',state)
        return
    if stage.exists(): shutil.rmtree(stage)
    prior = copy.deepcopy(state)
    stage.mkdir()
    try:
        rows = []
        for part in config['parts']:
            # Material/drawing edits do not require retessellating the shape.
            reuse = (old and all(current[k] == old['buildInputs'][k] for k in ('geometry','runtime'))
                     and tree_hashes(out) == old['filesSha256'])
            if reuse:
                shutil.copytree(out/part['id'],stage/part['id'])
                result = json.loads((stage/part['id']/'manifest.json').read_text())
            else:
                result = generate(ROOT/part['shape'],stage/part['id'])
            rows.append({'id':part['id'], 'shapeKind':'feature-solid', 'source':part['shape'],
                         'volumeMm3':result['volumeMm3'], 'boundsMm':result['boundsMm']})
        from feature_drawing import build as build_drawing
        build_drawing(config,stage)
        (stage/'manifest.json').write_text(json.dumps({'status':'geometry-stage-only','parts':rows},indent=2)+'\n')
        if out.exists(): out.rename(previous)
        try:
            stage.rename(out)
        except Exception:
            if previous.exists(): previous.rename(out)
            raise
        try:
            state['featureGeometry'] = {'filesSha256':tree_hashes(out), 'inputSha256':tree_hashes(project/'input'), 'buildInputs':current, 'drawingCandidate':True}
            state['status'] = 'geometry-ready'
            state['nextInput'] = 'Review feature drawing/curve guide; provide explicit material/motion input for page-review'
            state['unsupportedStages'] = ['feature drawing visual adoption', 'more than two feature coating layers', 'mesh import and imported partial coatings', 'publication']
            save(project/'pipeline-state.json',state)
        except Exception:
            shutil.rmtree(out)
            if previous.exists(): previous.rename(out)
            state.clear();state.update(prior)
            raise
        if previous.exists(): shutil.rmtree(previous)
        record(project,'Built feature geometry and BRep drawing/section-guide candidate; explicit page review remains required.')
    finally:
        if stage.exists(): shutil.rmtree(stage)
