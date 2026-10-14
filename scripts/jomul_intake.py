"""Connect reviewed P1 sketch evidence and replies to the common CAD input."""
from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'docs/artifacts/p1-sketch-structure'))
import workflow  # noqa: E402
import spec_handoff  # noqa: E402

PART_ID = re.compile(r'[a-z0-9]+(?:-[a-z0-9]+)*\Z')


def _read(path: Path) -> dict:
    return json.loads(path.read_text())


def _material(extraction: dict, state: dict) -> tuple[dict | None, list[str]]:
    observed = [o['value'] for o in extraction['observations']
                if o.get('kind') == 'material' and o.get('status') == 'user-confirmed'
                and isinstance(o.get('value'), dict)]
    result = {}
    missing = []
    for key in ('clay', 'glaze'):
        answer = state['confirmedFields'].get(key + '_name')
        values = {str(v[key]).strip() for v in observed if isinstance(v.get(key), str) and v[key].strip()}
        if answer:
            if values and values != {answer['value']}:
                raise ValueError(f'{key}: answer conflicts with confirmed sketch material')
            result[key] = {'name': answer['value'], 'source': {'answerId': answer['answerId']}}
        elif len(values) == 1:
            result[key] = {'name': values.pop(), 'source': 'user-confirmed sketch observation'}
        else:
            missing.append(key + '_name')
    return (result if not missing else None), missing



def _add_dimension_questions(extraction: dict) -> None:
    existing = {f['field'] for q in extraction['questions'] for f in q['fields']}
    fields = []
    for name, (aliases, feature) in spec_handoff.FIELDS.items():
        if any(alias in existing for alias in aliases):
            continue
        if name == 'height':
            confirmed = [c for c in extraction.get('userConfirmations', [])
                         if c.get('field') == 'target_fired_height']
            if any((bounds := spec_handoff.interval(c.get('value'))) and bounds[0] == bounds[1]
                   for c in confirmed):
                continue
        bounds = [spec_handoff.interval(o.get('value')) for o in extraction['observations']
                  if o.get('kind') == 'dimension' and o.get('feature') == feature
                  and o.get('status') in ('sketch-observed', 'user-confirmed')]
        if bounds and all(value is not None and value[0] == value[1] == bounds[0][0] for value in bounds):
            continue
        field = aliases[0]
        fields.append({'field': field, 'prompt': f'{name} 최종 치수(mm)를 알려주세요.',
                       'type': 'number', 'unit': 'mm', 'min': 1, 'max': 10000})
        extraction.setdefault('unresolved', []).append(
            {'field': field, 'reason': 'No unambiguous exact CAD dimension in reviewed sketch evidence'})
    if fields:
        qid = 'CAD-DIMENSIONS'
        if any(q['id'] == qid for q in extraction['questions']):
            raise ValueError('Reserved dimension question ID already used')
        extraction['questions'].append({'id': qid, 'priority': 'before-CAD', 'fields': fields})

def _add_material_questions(extraction: dict) -> None:
    observed = [o.get('value') for o in extraction.get('observations', [])
                if o.get('kind') == 'material' and o.get('status') == 'user-confirmed'
                and isinstance(o.get('value'), dict)]
    known = {f['field'] for q in extraction['questions'] for f in q['fields']}
    fields = []
    for key in ('clay', 'glaze'):
        values = {v[key].strip() for v in observed if isinstance(v.get(key), str) and v[key].strip()}
        field = key + '_name'
        if len(values) != 1 and field not in known:
            fields.append({'field': field, 'prompt': f'확정 {key} 이름을 알려주세요.', 'type': 'text'})
            extraction.setdefault('unresolved', []).append({'field': field, 'reason': 'material name is not confirmed'})
    if fields:
        qid = 'CAD-MATERIAL'
        if any(q['id'] == qid for q in extraction['questions']):
            raise ValueError('Reserved material question ID already used')
        extraction['questions'].append({'id': qid, 'priority': 'before-CAD', 'fields': fields})


def initialize(project: Path, source: Path, sketch: Path) -> dict:
    manifest = _read(source.expanduser().resolve(strict=True))
    parts = manifest.get('parts')
    if manifest.get('schemaVersion') != 1 or not isinstance(parts, list) or len(parts) not in (1, 2):
        raise ValueError('Intake needs schemaVersion 1 and one or two parts')
    if len({p.get('id') for p in parts}) != len(parts):
        raise ValueError('Duplicate intake part ID')
    stage = project / 'intake.next'
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir()
    result = {'schemaVersion': 1, 'name': manifest.get('name'), 'parts': []}
    if not isinstance(result['name'], str) or not result['name'].strip():
        raise ValueError('Intake name is required')
    try:
        for part in parts:
            pid = part.get('id')
            if not isinstance(pid, str) or not PART_ID.fullmatch(pid):
                raise ValueError(f'Invalid part ID: {pid}')
            shape_kind = part.get('shapeKind', 'rotational-profile')
            if shape_kind not in ('rotational-profile', 'handled-vessel'):
                raise ValueError(f'{pid}: unsupported shapeKind {shape_kind}')
            name = part.get('name')
            if not isinstance(name, str) or not name.strip():
                raise ValueError(f'{pid}: part name required')
            folder = stage / pid
            folder.mkdir()
            extraction_path = Path(part['extraction']).expanduser()
            extraction_path = (extraction_path if extraction_path.is_absolute() else source.parent / extraction_path).resolve(strict=True)
            profile_path = None
            if shape_kind == 'rotational-profile':
                profile_path = Path(part['profile']).expanduser()
                profile_path = (profile_path if profile_path.is_absolute() else source.parent / profile_path).resolve(strict=True)
            extraction = _read(extraction_path)
            if extraction.get('project') != pid:
                raise ValueError(f'{pid}: P1 project does not match part ID')
            has_handle = any(o.get('kind') == 'shape' and o.get('feature') == 'handle'
                             for o in extraction.get('observations', []))
            other_nonrotational = any(o.get('kind') == 'shape' and o.get('feature') in
                                      {'non-rotational', 'asymmetric', 'spout'}
                                      for o in extraction.get('observations', []))
            if other_nonrotational or (shape_kind == 'rotational-profile' and has_handle):
                raise ValueError(f'{pid}: reviewed sketch includes a feature outside rotational-profile CAD')
            if shape_kind == 'handled-vessel' and not has_handle:
                raise ValueError(f'{pid}: handled-vessel needs an observed handle')
            if extraction.get('source', {}).get('sha256') != workflow.digest(sketch):
                raise ValueError(f'{pid}: P1 source sketch hash does not match imported sketch')
            extraction['source']['path'] = str(sketch.resolve())
            _add_dimension_questions(extraction)
            _add_material_questions(extraction)
            workflow.save(folder / 'extraction.json', extraction)
            if profile_path:
                shutil.copy2(profile_path, folder / 'profile.json')
                _read(folder / 'profile.json')
            result['parts'].append({'id': pid, 'name': name, 'shapeKind': shape_kind,
                                    'extractionSourceSha256': workflow.digest(extraction_path),
                                    'profileSourceSha256': workflow.digest(profile_path) if profile_path else None})
        workflow.save(stage / 'manifest.json', result)
        if (project / 'intake').exists():
            raise ValueError('Intake already exists')
        stage.rename(project / 'intake')
        for part in result['parts']:
            folder = project / 'intake' / part['id']
            workflow.initialize(folder / 'extraction.json', folder / 'p1-state.json')
    finally:
        if stage.exists():
            shutil.rmtree(stage)
    return result


def apply_answers(project: Path, answer_paths: list[Path]) -> None:
    manifest = _read(project / 'intake/manifest.json')
    states = {p['id']: _read(project / 'intake' / p['id'] / 'p1-state.json') for p in manifest['parts']}
    answers = []
    for path in answer_paths:
        answer = _read(path.expanduser().resolve(strict=True))
        pid = answer.get('project')
        if pid not in states:
            raise ValueError(f'Answer project does not belong to this intake: {pid}')
        states[pid] = workflow.apply_answer(states[pid], answer)
        destination = project / 'intake' / pid / 'answers'
        filename = re.sub(r'[^a-zA-Z0-9_-]', '_', answer['answerId']) + '.json'
        saved = destination / filename
        if saved.exists() and _read(saved) != answer:
            raise ValueError(f'Answer archive collision: {filename}')
        answers.append((saved, answer))
    for pid, state in states.items():
        _material(workflow.load_extraction(state), state)
    for pid, state in states.items():
        workflow.save(project / 'intake' / pid / 'p1-state.json', state)
    for saved, answer in answers:
        saved.parent.mkdir(exist_ok=True)
        workflow.save(saved, answer)


def progress(project: Path, *, write: bool = True) -> dict:
    manifest = _read(project / 'intake/manifest.json')
    parts = []
    for part in manifest['parts']:
        folder = project / 'intake' / part['id']
        state = _read(folder / 'p1-state.json')
        proposal = spec_handoff.build_proposal(state)
        material, missing_material = _material(workflow.load_extraction(state), state)
        if write:
            workflow.save(folder / 'spec-proposal.json', proposal)
        parts.append({'id': part['id'], 'name': part['name'], 'shapeKind': part['shapeKind'],
                      'proposal': proposal, 'material': material,
                      'missingMaterialFields': missing_material})
    pending = [{'part': p['id'], **q} for p in parts for q in p['proposal']['pendingBeforeCAD']]
    missing = [{'part': p['id'], 'field': f} for p in parts
               for f in p['proposal']['missingDimensionFields'] + p['missingMaterialFields']]
    reviewed = {part['id']: part for part in manifest['parts']}
    unsupported = [{'part': p['id'], 'shapeKind': p['shapeKind'],
                    'reason': 'handled-vessel CAD and profile renderer are not implemented'}
                   for p in parts if p['shapeKind'] == 'handled-vessel'
                   and not (reviewed[p['id']].get('profileSourceSha256')
                            and reviewed[p['id']].get('handleSourceSha256'))]
    ready = not pending and not missing and not unsupported
    summary = {'schemaVersion': 1, 'readyForCAD': ready, 'pendingBeforeCAD': pending,
               'missingFields': missing, 'unsupportedShapes': unsupported,
               'parts': [p['id'] for p in parts]}
    if write:
        workflow.save(project / 'intake/summary.json', summary)
        if ready:
            _write_cad_input(project, manifest, parts)
    return summary


def _write_cad_input(project: Path, manifest: dict, parts: list[dict]) -> None:
    stage = project / 'input.next'
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir()
    config = {'name': manifest['name'], 'style': 'technical-dense',
              'compositionMode': 'single' if len(parts) == 1 else 'multiple', 'parts': []}
    for p in parts:
        pid = p['id']
        proposal = p['proposal']
        folder = project / 'intake' / pid
        shutil.copy2(folder / 'profile.json', stage / f'{pid}-profile.json')
        if p['shapeKind'] == 'handled-vessel':
            shutil.copy2(folder / 'handle.json', stage / f'{pid}-handle.json')
        dimensions = {'schemaVersion': 1, 'project': pid,
                      'targetFiredMm': proposal['candidateTargetFiredMm'],
                      'dimensionSources': {key: {'status': item['status'], 'evidence': item['evidence']}
                                           for key, item in proposal['dimensions'].items()},
                      'sourceImageSha256': proposal['sourceImageSha256']}
        if proposal['shrinkage']:
            dimensions['shrinkage'] = proposal['shrinkage']
        workflow.save(stage / f'{pid}-dimensions.json', dimensions)
        workflow.save(stage / f'{pid}-material.json', p['material'])
        kinds = ('profile', 'dimensions', 'material') + (('handle',) if p['shapeKind'] == 'handled-vessel' else ())
        refs = {key: (project / 'input' / f'{pid}-{key}.json').relative_to(ROOT).as_posix()
                for key in kinds}
        config['parts'].append({'id': pid, 'name': p['name'], 'shapeKind': p['shapeKind'],
                                'dimensionsKey': 'targetFiredMm', 'sourcesKey': 'dimensionSources',
                                'materialFormat': 'single', **refs})
    workflow.save(stage / 'config.json', config)
    old = project / 'input'
    if old.exists():
        for image in old.iterdir():
            if image.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.heif'}:
                shutil.copy2(image, stage / image.name)
        shutil.rmtree(old)
    stage.rename(old)


def update_profiles(project: Path, updates: list[str]) -> None:
    """Replace reviewed P2 profiles while retaining all P1 answers and provenance."""
    manifest_path = project / 'intake/manifest.json'
    manifest = _read(manifest_path)
    known = {part['id']: part for part in manifest['parts']}
    changes = []
    for raw in updates:
        pid, separator, filename = raw.partition('=')
        if not separator or pid not in known:
            raise ValueError('Profile update must be part-id=/path/to/reviewed-profile.json')
        source = Path(filename).expanduser().resolve(strict=True)
        if source.suffix.lower() != '.json':
            raise ValueError(f'{pid}: reviewed profile must be JSON')
        _read(source)
        changes.append((pid, source))
    if len({pid for pid, _ in changes}) != len(changes):
        raise ValueError('Duplicate profile update for one part')
    for pid, source in changes:
        destination = project / 'intake' / pid / 'profile.json'
        if source != destination:
            shutil.copy2(source, destination)
        known[pid]['profileSourceSha256'] = workflow.digest(source)
    workflow.save(manifest_path, manifest)


def update_handles(project: Path, updates: list[str]) -> None:
    """Attach separately reviewed 3D handle paths without changing P1 answers."""
    manifest_path = project / 'intake/manifest.json'
    manifest = _read(manifest_path)
    known = {part['id']: part for part in manifest['parts']}
    changes = []
    for raw in updates:
        pid, separator, filename = raw.partition('=')
        if not separator or pid not in known or known[pid]['shapeKind'] != 'handled-vessel':
            raise ValueError('Handle update must be handled-part-id=/path/to/reviewed-handle.json')
        source = Path(filename).expanduser().resolve(strict=True)
        if source.suffix.lower() != '.json':
            raise ValueError(f'{pid}: reviewed handle must be JSON')
        data = _read(source)
        if data.get('schemaVersion') != 1 or data.get('kind') not in ('centerline-round-section', 'centerline-oval-section'):
            raise ValueError(f'{pid}: handle contract mismatch')
        changes.append((pid, source))
    if len({pid for pid, _ in changes}) != len(changes):
        raise ValueError('Duplicate handle update for one part')
    for pid, source in changes:
        destination = project / 'intake' / pid / 'handle.json'
        if source != destination:
            shutil.copy2(source, destination)
        known[pid]['handleSourceSha256'] = workflow.digest(source)
    workflow.save(manifest_path, manifest)


def verify_pending(project: Path, sketch: Path) -> dict:
    """Validate archived evidence and derived P1 state without requiring CAD output."""
    manifest = _read(project / 'intake/manifest.json')
    if manifest.get('schemaVersion') != 1 or not manifest.get('parts'):
        raise ValueError('Invalid intake manifest')
    source_hash = workflow.digest(sketch)
    for part in manifest['parts']:
        folder = project / 'intake' / part['id']
        state = _read(folder / 'p1-state.json')
        extraction = workflow.load_extraction(state)
        if state['project'] != part['id'] or source_hash != state['sourceImageSha256']:
            raise ValueError(f'{part["id"]}: source sketch or project mismatch')
        if extraction['source']['path'] != str(sketch.resolve()):
            raise ValueError(f'{part["id"]}: source sketch path mismatch')
        for event in state['answers']:
            answer = event['answer']
            filename = re.sub(r'[^a-zA-Z0-9_-]', '_', event['answerId']) + '.json'
            if _read(folder / 'answers' / filename) != answer:
                raise ValueError(f'{part["id"]}: archived answer changed')
        if _read(folder / 'spec-proposal.json') != spec_handoff.build_proposal(state):
            raise ValueError(f'{part["id"]}: P1 specification proposal drift')
        if part.get('profileSourceSha256'):
            profile = folder / 'profile.json'
            if not profile.is_file() or workflow.digest(profile) != part['profileSourceSha256']:
                raise ValueError(f'{part["id"]}: reviewed profile drift')
        if part.get('handleSourceSha256'):
            handle = folder / 'handle.json'
            if not handle.is_file() or workflow.digest(handle) != part['handleSourceSha256']:
                raise ValueError(f'{part["id"]}: reviewed handle drift')
    current = progress(project, write=False)
    if _read(project / 'intake/summary.json') != current:
        raise ValueError('P1 question summary drift')
    return current
