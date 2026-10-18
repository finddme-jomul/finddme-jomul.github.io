#!/usr/bin/env python3
"""Integration checks for P1 answer resume; all replies are synthetic test data."""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLI = ROOT / 'scripts/jomul-project-assets.py'
WORK = ROOT / '.poc/jomul-project-assets-workspaces'
SNAP = ROOT / '.poc/jomul-project-assets-snapshots'
SKETCH = Path('/home/ayaan/clay-orbit-samples/스케치샘플/달항아리-스케치.jpg')
EXTRACTION = ROOT / 'docs/artifacts/p1-sketch-structure/moon-jar.json'
PROFILE = ROOT / 'docs/artifacts/generic-vessel-poc/outputs/moon-jar/generated/outer-profile.json'


def run(*args: str, ok: bool = True) -> str:
    result = subprocess.run([sys.executable, str(CLI), *args], cwd=ROOT, text=True, capture_output=True)
    if (result.returncode == 0) != ok:
        raise AssertionError(f'{args}: {result.stdout}\n{result.stderr}')
    return result.stdout + result.stderr


def write(path: Path, data: dict) -> Path:
    path.write_text(json.dumps(data, ensure_ascii=False))
    return path


def reply(path: Path, qid: str, updates: list[dict]) -> Path:
    return write(path, {'project': 'moon-jar', 'answerId': path.stem, 'questionId': qid,
                        'evidence': {'kind': 'user-message', 'reference': 'synthetic-integration-test'},
                        'verbatim': 'Synthetic test response, not a real user confirmation',
                        'updates': updates, 'deferFields': []})


def main() -> None:
    project_id = '99-intake-' + uuid.uuid4().hex[:8]
    project = WORK / project_id
    snapshot_dir = SNAP / project_id
    with tempfile.TemporaryDirectory(prefix='jomul-intake-test-') as temporary:
        temp = Path(temporary)
        observed_extraction = json.loads(EXTRACTION.read_text())
        for observation in observed_extraction['observations']:
            if observation.get('feature') == 'maximum_body_diameter':
                observation['status'] = 'sketch-observed'
        observed_path = write(temp / 'observed-diameter-p1.json', observed_extraction)
        intake = write(temp / 'intake.json', {
            'schemaVersion': 1, 'name': 'Moon jar synthetic intake test',
            'parts': [{'id': 'moon-jar', 'name': 'Moon jar', 'extraction': str(observed_path),
                       'profile': str(PROFILE)}]})
        q1 = reply(temp / 'q1.json', 'MJ-Q1', [
            {'field': 'exact_fired_height', 'value': 150},
            {'field': 'exact_opening_diameter', 'value': 45},
            {'field': 'exact_foot_diameter', 'value': 55}])
        q2 = reply(temp / 'q2.json', 'MJ-Q2', [
            {'field': 'wall_thickness', 'value': 5},
            {'field': 'base_thickness', 'value': 8},
            {'field': 'rim_foot_section', 'value': 'reviewed fixture section'},
            {'field': 'hidden_surfaces', 'value': 'reviewed fixture inside'}])
        q3 = reply(temp / 'q3.json', 'MJ-Q3', [
            {'field': 'opening_reference_priority', 'value': 'written-dimension-range'}])
        bad = reply(temp / 'bad.json', 'MJ-Q1', [{'field': 'exact_fired_height', 'value': 500}])
        try:
            assert 'AWAITING_SKETCH_ANSWERS' in run('new', project_id, '--sketch', str(SKETCH),
                                                    '--intake', str(intake))
            assert 'exact_fired_height' in json.loads((project / 'intake/summary.json').read_text())['pendingBeforeCAD'][0]['field']
            assert 'outside' in run('resume', project_id, '--answer', str(bad), ok=False)
            assert not json.loads((project / 'intake/moon-jar/p1-state.json').read_text())['answers']
            assert 'AWAITING_SKETCH_ANSWERS' in run('resume', project_id, '--answer', str(q1))
            assert 'CAD_READY' in run('resume', project_id, '--answer', str(q2), '--answer', str(q3))
            assert 'VERIFY_OK' in run('verify', project_id)
            dims = json.loads((project / 'input/moon-jar-dimensions.json').read_text())
            assert dims['targetFiredMm']['height'] == 150
            assert dims['dimensionSources']['height']['status'] == 'user-confirmed'
            material = json.loads((project / 'input/moon-jar-material.json').read_text())
            assert material['clay']['name'] == '백토'
            assert material['glaze']['name'] == '무광투명유약'
            sheet = (project / 'cad/sheet-desktop.svg').read_text()
            assert '≈140' in sheet  # exact sketch observation, still not user-confirmed
            assert '≈150' not in sheet  # answered height
            assert 'already confirmed' in run('resume', project_id, '--answer',
                                              str(reply(temp / 'repeat.json', 'MJ-Q1',
                                                        [{'field': 'exact_fired_height', 'value': 155}])), ok=False)
            assert 'VERIFY_OK' in run('verify', project_id)
            bad_profile = json.loads(PROFILE.read_text())
            bad_profile[-1][1] = bad_profile[-1][1] + 1
            bad_profile_path = write(temp / 'bad-profile.json', bad_profile)
            run('resume', project_id, '--profile', f'moon-jar={bad_profile_path}', ok=False)
            assert json.loads((project / 'pipeline-state.json').read_text())['status'] == 'blocked'
            assert 'CAD_READY' in run('resume', project_id, '--profile', f'moon-jar={PROFILE}')
            assert 'VERIFY_OK' in run('verify', project_id)
            print('JOMUL_INTAKE_TEST_OK pending, invalid, partial, resume, CAD, profile recovery, provenance, verify')
        finally:
            shutil.rmtree(project, ignore_errors=True)
            shutil.rmtree(snapshot_dir, ignore_errors=True)

        material_project_id = '99-material-' + uuid.uuid4().hex[:8]
        material_project = WORK / material_project_id
        extraction = json.loads(EXTRACTION.read_text())
        extraction['observations'] = [o for o in extraction['observations'] if o.get('kind') != 'material']
        extraction_path = write(temp / 'missing-material-p1.json', extraction)
        material_intake = write(temp / 'material-intake.json', {
            'schemaVersion': 1, 'name': 'Material question synthetic test',
            'parts': [{'id': 'moon-jar', 'name': 'Moon jar',
                       'extraction': str(extraction_path), 'profile': str(PROFILE)}]})
        material_answer = reply(temp / 'material-answer.json', 'CAD-MATERIAL', [
            {'field': 'clay_name', 'value': '백토'},
            {'field': 'glaze_name', 'value': '무광투명유약'}])
        try:
            assert 'AWAITING_SKETCH_ANSWERS' in run('new', material_project_id,
                                                    '--sketch', str(SKETCH), '--intake', str(material_intake))
            assert 'clay_name' in [q['field'] for q in json.loads(
                (material_project / 'intake/summary.json').read_text())['pendingBeforeCAD']]
            assert 'AWAITING_SKETCH_ANSWERS' in run('resume', material_project_id, '--answer', str(q1),
                                                    '--answer', str(q2), '--answer', str(q3))
            assert 'CAD_READY' in run('resume', material_project_id, '--answer', str(material_answer))
            assert 'VERIFY_OK' in run('verify', material_project_id)
            print('JOMUL_MATERIAL_QUESTION_TEST_OK')
        finally:
            shutil.rmtree(material_project, ignore_errors=True)
            shutil.rmtree(SNAP / material_project_id, ignore_errors=True)

        bowl_project_id = '99-bowls-' + uuid.uuid4().hex[:8]
        bowl_project = WORK / bowl_project_id
        bowl_sketch = Path('/home/ayaan/clay-orbit-samples/스케치샘플/국밥그릇세트/국-밥그릇-스케치.jpg')
        bowl_intake = write(temp / 'bowl-intake.json', {
            'schemaVersion': 1, 'name': 'Rice and soup bowls synthetic intake test',
            'parts': [
                {'id': pid, 'name': pid, 'extraction': str(ROOT / f'docs/artifacts/bowl-set-validation/{pid}-p1.json'),
                 'profile': str(ROOT / f'docs/artifacts/bowl-set-validation/output/{pid}/outer-profile.json')}
                for pid in ('rice-bowl', 'soup-bowl')]})
        try:
            assert 'AWAITING_SKETCH_ANSWERS' in run('new', bowl_project_id,
                                                    '--sketch', str(bowl_sketch), '--intake', str(bowl_intake))
            summary = json.loads((bowl_project / 'intake/summary.json').read_text())
            assert summary['parts'] == ['rice-bowl', 'soup-bowl']
            assert {'rice-bowl', 'soup-bowl'} == {q['part'] for q in summary['pendingBeforeCAD']}
            assert 'AWAITING_SKETCH_ANSWERS' in run('resume', bowl_project_id)
            print('JOMUL_TWO_PART_INTAKE_TEST_OK')
        finally:
            shutil.rmtree(bowl_project, ignore_errors=True)
            shutil.rmtree(SNAP / bowl_project_id, ignore_errors=True)

        dimension_project_id = '99-dimension-' + uuid.uuid4().hex[:8]
        dimension_project = WORK / dimension_project_id
        incomplete = json.loads(EXTRACTION.read_text())
        for question in incomplete['questions']:
            question['fields'] = [field for field in question['fields'] if field['field'] != 'base_thickness']
        incomplete['unresolved'] = [field for field in incomplete['unresolved']
                                    if field['field'] != 'base_thickness']
        incomplete_extraction = write(temp / 'missing-dimension-p1.json', incomplete)
        dimension_intake = write(temp / 'dimension-intake.json', {
            'schemaVersion': 1, 'name': 'Missing dimension question test',
            'parts': [{'id': 'moon-jar', 'name': 'Moon jar',
                       'extraction': str(incomplete_extraction), 'profile': str(PROFILE)}]})
        try:
            assert 'AWAITING_SKETCH_ANSWERS' in run('new', dimension_project_id,
                                                    '--sketch', str(SKETCH), '--intake', str(dimension_intake))
            pending = json.loads((dimension_project / 'intake/summary.json').read_text())['pendingBeforeCAD']
            assert any(q['questionId'] == 'CAD-DIMENSIONS' and q['field'] == 'base_thickness'
                       for q in pending)
            print('JOMUL_MISSING_DIMENSION_QUESTION_TEST_OK')
        finally:
            shutil.rmtree(dimension_project, ignore_errors=True)
            shutil.rmtree(SNAP / dimension_project_id, ignore_errors=True)

        retry_project_id = '99-retry-' + uuid.uuid4().hex[:8]
        retry_project = WORK / retry_project_id
        wrong_source = json.loads(EXTRACTION.read_text())
        wrong_source['source']['sha256'] = '0' * 64
        wrong_extraction = write(temp / 'wrong-source-p1.json', wrong_source)
        wrong_intake = write(temp / 'wrong-intake.json', {
            'schemaVersion': 1, 'name': 'Source retry test',
            'parts': [{'id': 'moon-jar', 'name': 'Moon jar',
                       'extraction': str(wrong_extraction), 'profile': str(PROFILE)}]})
        try:
            assert 'does not match' in run('new', retry_project_id, '--sketch', str(SKETCH),
                                           '--intake', str(wrong_intake), ok=False)
            assert json.loads((retry_project / 'pipeline-state.json').read_text())['status'] == 'blocked'
            assert 'AWAITING_SKETCH_ANSWERS' in run('resume', retry_project_id,
                                                    '--intake', str(intake))
            print('JOMUL_INITIAL_INTAKE_RETRY_TEST_OK')
        finally:
            shutil.rmtree(retry_project, ignore_errors=True)
            shutil.rmtree(SNAP / retry_project_id, ignore_errors=True)

        mug_project_id = '99-mug-' + uuid.uuid4().hex[:8]
        mug_project = WORK / mug_project_id
        mug_sketch = Path('/home/ayaan/clay-orbit-samples/스케치샘플/머그컵-스케치.jpg')
        mug_intake = ROOT / 'docs/artifacts/mug-validation/intake.json'
        reply_dir = ROOT / 'docs/artifacts/p1-sketch-structure'
        try:
            assert 'AWAITING_SKETCH_ANSWERS' in run('new', mug_project_id,
                                                    '--sketch', str(mug_sketch), '--intake', str(mug_intake))
            assert 'AWAITING_SKETCH_ANSWERS' in run(
                'resume', mug_project_id, '--answer', str(reply_dir / 'mug-reply-label-meanings.json'),
                '--answer', str(reply_dir / 'mug-reply-overall-width.json'))
            assert 'INTAKE_VERIFY_OK' in run('verify', mug_project_id)
            summary = json.loads((mug_project / 'intake/summary.json').read_text())
            assert summary['unsupportedShapes'][0]['shapeKind'] == 'handled-vessel'
            assert summary['readyForCAD'] is False and not (mug_project / 'cad').exists()
            state = json.loads((mug_project / 'intake/mug/p1-state.json').read_text())
            assert state['confirmedFields']['handle_2cm_meaning']['value'] == 'handle-width'
            assert state['deferredFields']['overall_width_and_handle_projection']['status'] == 'deferred'
            candidate = ROOT / 'docs/artifacts/mug-validation/review-candidate'
            assert 'AWAITING_SKETCH_ANSWERS' in run(
                'resume', mug_project_id,
                '--profile', f'mug={candidate / "outer-profile.json"}',
                '--handle', f'mug={candidate / "handle.json"}')
            summary = json.loads((mug_project / 'intake/summary.json').read_text())
            assert summary['unsupportedShapes'] == [] and not summary['readyForCAD']
            assert not (mug_project / 'cad').exists()
            assert 'INTAKE_VERIFY_OK' in run('verify', mug_project_id)
            imported_handle = mug_project / 'intake/mug/handle.json'
            changed_handle = json.loads(imported_handle.read_text())
            changed_handle['overallWidthMm'] += 3
            write(imported_handle, changed_handle)
            assert 'reviewed handle drift' in run('verify', mug_project_id, ok=False)
            shutil.copy2(candidate / 'handle.json', imported_handle)
            answer_file = mug_project / 'intake/mug/answers/mug-2026-10-11-label-meanings.json'
            changed = json.loads(answer_file.read_text())
            changed['verbatim'] = 'tampered answer'
            write(answer_file, changed)
            assert 'archived answer changed' in run('verify', mug_project_id, ok=False)
            print('JOMUL_HANDLED_MUG_INTAKE_TEST_OK')
        finally:
            shutil.rmtree(mug_project, ignore_errors=True)
            shutil.rmtree(SNAP / mug_project_id, ignore_errors=True)


if __name__ == '__main__':
    main()
