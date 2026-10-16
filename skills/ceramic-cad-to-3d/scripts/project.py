#!/usr/bin/env python3
"""Minimal local project router for sketch intake and supported CAD sheets."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

from ceramic_paths import ROOT, SKILL, SCRIPTS, ASSETS, PROFILE
WORK = ROOT / '.poc/jomul-project-assets-workspaces'
SNAP = ROOT / '.poc/jomul-project-assets-snapshots'
CAD = SCRIPTS
ID = re.compile(r'^[0-9]{2}-[a-z0-9]+(?:-[a-z0-9]+)*$')


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def tree_hashes(path: Path) -> dict[str, str]:
    return {p.relative_to(path).as_posix(): digest(p) for p in sorted(path.rglob('*')) if p.is_file()}


def save(path: Path, data: dict) -> None:
    if path.name == 'pipeline-state.json':
        from stages import describe
        data['stageContractVersion'] = 1
        data['stages'] = describe(path.parent, data)
    temporary = path.with_name(path.name + '.writing')
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(path)


def stamp() -> str:
    return datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')


def state_for(project: Path) -> dict:
    path = project / 'pipeline-state.json'
    if not path.is_file():
        raise ValueError(f'Project state missing: {path}')
    state = json.loads(path.read_text())
    if state.get('schemaVersion') != 1:
        raise ValueError('Unsupported project state')
    return state


def record(project: Path, line: str) -> None:
    with (project / 'review-log.md').open('a') as log:
        log.write(f'- {datetime.now(timezone.utc).isoformat()} {line}\n')


def snapshot(project: Path) -> Path:
    if not project.is_dir():
        raise ValueError('Project missing for snapshot')
    target = SNAP / project.name / f'{stamp()}-{uuid.uuid4().hex[:8]}'
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(project, target / 'files')
    files = tree_hashes(target / 'files')
    save(target / 'manifest.json', {'schemaVersion': 1, 'project': project.name, 'files': files})
    if tree_hashes(project) != files:
        raise RuntimeError('Project changed during snapshot')
    return target


def copy_image(path: Path, into: Path, label: str) -> str:
    source = path.expanduser().resolve(strict=True)
    if not source.is_file() or source.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp', '.heif'}:
        raise ValueError(f'{label} must be an image file')
    into.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, into.with_suffix(source.suffix.lower()))
    return into.with_suffix(source.suffix.lower()).relative_to(ROOT).as_posix()


def import_config(project: Path, source: Path) -> None:
    data = json.loads(source.expanduser().resolve(strict=True).read_text())
    parts = data.get('parts')
    if data.get('style') != 'technical-dense' or not isinstance(parts, list) or len(parts) not in (1, 2):
        raise ValueError('Only technical-dense one/two-part CAD is supported')
    if data.get('compositionMode') != ('single' if len(parts) == 1 else 'multiple'):
        raise ValueError('compositionMode does not match parts')
    if len({p.get('id') for p in parts}) != len(parts):
        raise ValueError('Duplicate part IDs')
    stage = project / 'input.next'
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir()
    for part in parts:
        pid = part['id']
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', pid) or part.get('shapeKind', 'rotational-profile') not in ('rotational-profile', 'handled-vessel'):
            raise ValueError(f'Unsupported part shape or ID: {pid}')
        required = ('profile', 'dimensions', 'material') + (('handle',) if part.get('shapeKind') == 'handled-vessel' else ())
        if part.get('shapeKind', 'rotational-profile') == 'rotational-profile' and 'handle' in part:
            raise ValueError(f'{pid}: rotational part cannot have handle input')
        for kind in required:
            raw = Path(part[kind]).expanduser()
            original = (raw if raw.is_absolute() else ROOT / raw).resolve(strict=True)
            if not original.is_file() or original.suffix.lower() != '.json':
                raise ValueError(f'{pid}: {kind} must be a JSON file')
            dest = stage / f'{pid}-{kind}.json'
            shutil.copy2(original, dest)
            json.loads(dest.read_text())
            part[kind] = (project / 'input' / dest.name).relative_to(ROOT).as_posix()
    save(stage / 'config.json', data)
    current = project / 'input'
    previous = project / 'input.previous'
    if previous.exists():
        shutil.rmtree(previous)
    if current.exists():
        current.rename(previous)
    stage.rename(current)
    if previous.exists():
        # Keep intake images across a config revision.
        for image in previous.iterdir():
            if image.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.heif'} and not (current / image.name).exists():
                shutil.copy2(image, current / image.name)
        shutil.rmtree(previous)


def intake_status(info: dict) -> str:
    return ('awaiting-sketch-answers' if info['pendingBeforeCAD'] or info['missingFields']
            else 'awaiting-cad-shape-support')


def build(project: Path, state: dict) -> None:
    config = project / 'input/config.json'
    if not config.is_file():
        state['status'] = 'awaiting-cad-specification'
        state['nextInput'] = 'Provide a reviewed technical-dense config with one or two parts and source JSON files.'
        save(project / 'pipeline-state.json', state)
        return
    subprocess.run([sys.executable, str(SCRIPTS / 'preflight.py')], cwd=ROOT, check=True)
    from rebuild import inputs, plan
    current_inputs = inputs(config)
    previous_cad = state.get('cad') or {}
    schedule = plan(previous_cad.get('buildInputs'), current_inputs,
                    bool(previous_cad) and tree_hashes(project / 'cad') == previous_cad.get('filesSha256'))
    state['lastBuildPlan'] = schedule
    if schedule['sheet'] == 'reuse':
        state['status'] = 'cad-ready'
        state['nextInput'] = None
        state['cad']['inputSha256'] = tree_hashes(project / 'input')
        if (project / 'intake').exists():
            state['cad']['intakeSha256'] = tree_hashes(project / 'intake')
        verify(project, state)
        save(project / 'pipeline-state.json', state)
        record(project, 'Unchanged generation inputs: reused CAD and preserved downstream artifacts.')
        return
    stage = project / 'cad.building'
    if stage.exists():
        shutil.rmtree(stage)
    try:
        subprocess.run([sys.executable, str(CAD / 'shared_sheet_poc.py'), str(config), str(stage)], cwd=ROOT, check=True)
        subprocess.run([sys.executable, str(CAD / 'check_shared_sheet_poc.py'), str(config), str(stage)], cwd=ROOT, check=True)
        handled = any(part.get('shapeKind') == 'handled-vessel'
                      for part in json.loads(config.read_text())['parts'])
        if schedule['solid'] == 'reuse':
            from jomul_handled_solid import refresh_placement
            shutil.copytree(project / 'cad/solid', stage / 'solid')
            refresh_placement(config, stage / 'manifest.json', stage / 'solid')
        else:
            subprocess.run([sys.executable, str(SCRIPTS / 'jomul_handled_solid.py'),
                            str(config), str(stage / 'manifest.json'), str(stage / 'solid')],
                           cwd=ROOT, check=True)
        output = project / 'cad'
        if output.exists():
            shutil.rmtree(output)
        stage.rename(output)
        # A new CAD/GLB invalidates any motion preview built from the prior geometry.
        old_motion = project / 'motion-preview'
        # Keep reviewed motion evidence available after downstream invalidation.
        old_entry = state.get('motionPreview')
        old_input = old_motion / 'motion-config.json'
        if (old_entry and old_input.is_file()
                and tree_hashes(old_motion) == old_entry['filesSha256']):
            state['reviewedMotionInput'] = json.loads(old_input.read_text())
        if old_motion.exists(): shutil.rmtree(old_motion)
        state.pop('motionPreview', None)
        state['status'] = 'cad-ready'
        state['cad'] = {'manifest': (output / 'manifest.json').relative_to(ROOT).as_posix(),
                        'filesSha256': tree_hashes(output), 'inputSha256': tree_hashes(project / 'input'),
                        'buildInputs': current_inputs}
        if (project / 'intake').exists():
            state['cad']['intakeSha256'] = tree_hashes(project / 'intake')
        state['nextInput'] = None
        state['unsupportedStages'] = ['independent sketch interpretation',
                                      'rotational motion, glaze and full page assembly' if not handled else 'glaze and full page assembly',
                                      'complete 3D scene and gallery assembly', 'publication']
        state['cad']['solidManifest'] = (output / 'solid/manifest.json').relative_to(ROOT).as_posix()
        save(project / 'pipeline-state.json', state)
    finally:
        if stage.exists():
            shutil.rmtree(stage)


def verify(project: Path, state: dict) -> None:
    if state['status'] != 'cad-ready':
        if (project / 'intake/manifest.json').is_file():
            import jomul_intake
            summary = jomul_intake.verify_pending(project, ROOT / state['sketch'])
            print(f'JOMUL_INTAKE_VERIFY_OK {project.name} pending={len(summary["pendingBeforeCAD"])}')
            return
        raise ValueError(f'No CAD output to verify; status={state["status"]}')
    if tree_hashes(project / 'input') != state['cad']['inputSha256']:
        raise ValueError('CAD input drift; use revise to record a new version')
    if tree_hashes(project / 'cad') != state['cad']['filesSha256']:
        raise ValueError('CAD output drift; use revise or rollback')
    if 'intakeSha256' in state['cad'] and tree_hashes(project / 'intake') != state['cad']['intakeSha256']:
        raise ValueError('P1 intake drift; restore or revise the recorded intake')
    subprocess.run([sys.executable, str(SCRIPTS / 'preflight.py')], cwd=ROOT, check=True)
    subprocess.run([sys.executable, str(CAD / 'check_shared_sheet_poc.py'),
                    str(project / 'input/config.json'), str(project / 'cad')], cwd=ROOT, check=True)
    config = project / 'input/config.json'
    if state['cad'].get('solidManifest'):
        subprocess.run([sys.executable, str(SCRIPTS / 'jomul_handled_solid.py'),
                        str(config), str(project / 'cad/manifest.json'), str(project / 'cad/solid'),
                        '--verify'], cwd=ROOT, check=True)
    print(f'JOMUL_PROJECT_VERIFY_OK {project.name}')


def build_motion(project: Path, state: dict, motion_data: dict) -> None:
    """Publish only after the browser gate; retain reviewed input on failure."""
    import motion
    old_entry = state.get('motionPreview')
    verify(project, state)
    state['reviewedMotionInput'] = motion_data
    state['motionJob'] = {'status': 'running'}
    save(project / 'pipeline-state.json', state)
    stage = project / 'motion-preview.building'
    output = project / 'motion-preview'
    previous = project / 'motion-preview.previous'
    if stage.exists(): shutil.rmtree(stage)
    try:
        motion.motion_input(motion_data)
        motion.build(project, stage, motion_data)
        motion.browser_check(stage)
        if previous.exists():
            raise ValueError('Unresolved previous motion publication exists')
        if output.exists(): output.rename(previous)
        try:
            stage.rename(output)
            state['motionPreview'] = {
                'manifest': (output / 'motion-preview-manifest.json').relative_to(ROOT).as_posix(),
                'filesSha256': tree_hashes(output),
                'cadManifestSha256': digest(project / 'cad/manifest.json')}
            state['motionJob'] = {'status': 'complete'}
            save(project / 'pipeline-state.json', state)
        except Exception:
            if output.exists(): shutil.rmtree(output)
            if previous.exists(): previous.rename(output)
            raise
        if previous.exists(): shutil.rmtree(previous)
        record(project, 'Motion rebuilt and passed four-viewport browser gate.')
    except Exception as error:
        if old_entry is None:
            state.pop('motionPreview', None)
        else:
            state['motionPreview'] = old_entry
        state['motionJob'] = {'status': 'failed', 'error': str(error),
                              'retry': f'resume {project.name}'}
        save(project / 'pipeline-state.json', state)
        record(project, f'Motion failed; CAD retained and reviewed input saved: {error}')
        raise
    finally:
        if stage.exists(): shutil.rmtree(stage)
    print(f'JOMUL_MOTION_PREVIEW_READY {project.name} {output / "index.html"}')


def resume_motion(project: Path, state: dict) -> None:
    if not state.get('reviewedMotionInput'):
        return  # Never invent motion parameters for a new project.
    from stages import describe
    job = state.get('motionJob', {})
    if describe(project, state)['motion']['status'] == 'complete' and job.get('status') not in ('failed', 'running'):
        return
    snapshot(project)
    build_motion(project, state, state['reviewedMotionInput'])


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='action', required=True)
    new = sub.add_parser('new'); new.add_argument('project'); new.add_argument('--sketch', required=True, type=Path)
    new.add_argument('--config', type=Path); new.add_argument('--intake', type=Path)
    new.add_argument('--photo', type=Path, action='append', default=[])
    resume = sub.add_parser('resume'); resume.add_argument('project'); resume.add_argument('--config', type=Path)
    resume.add_argument('--answer', type=Path, action='append', default=[])
    resume.add_argument('--profile', action='append', default=[], metavar='PART=FILE')
    resume.add_argument('--handle', action='append', default=[], metavar='PART=FILE')
    resume.add_argument('--intake', type=Path, help='retry failed initial P1 intake only')
    revise = sub.add_parser('revise'); revise.add_argument('project'); revise.add_argument('--feedback', required=True)
    revise.add_argument('--config', type=Path)
    motion = sub.add_parser('motion-preview'); motion.add_argument('project'); motion.add_argument('--motion', required=True, type=Path)
    gallery = sub.add_parser('gallery'); gallery.add_argument('project'); gallery.add_argument('--photos', required=True, type=Path)
    status = sub.add_parser('status'); status.add_argument('project')
    status.add_argument('--config', type=Path, help='inspect a proposed CAD config without importing it')
    status.add_argument('--changed', choices=('cad', 'motion', 'gallery'))
    check = sub.add_parser('verify'); check.add_argument('project')
    rollback = sub.add_parser('rollback'); rollback.add_argument('project'); rollback.add_argument('snapshot')
    args = parser.parse_args()
    if not ID.fullmatch(args.project):
        raise ValueError('Project ID must look like 01-moon-jar')
    project = WORK / args.project
    if ((args.action == 'new' and args.intake)
            or (args.action == 'resume' and (args.answer or args.profile or args.handle or args.intake
                or (project / 'intake/manifest.json').is_file()))):
        import jomul_intake  # P1 image validation needs Pillow; manual CAD commands do not.
    if args.action == 'new':
        if args.config and args.intake:
            raise ValueError('Choose --config or --intake, not both')
        if project.exists():
            raise ValueError('Project already exists; use resume or revise')
        project.mkdir(parents=True)
        try:
            sketch = copy_image(args.sketch, project / 'input/sketch', 'Sketch')
            photos = [copy_image(p, project / f'input/photo-{i+1}', 'Photo') for i, p in enumerate(args.photo)]
            state = {'schemaVersion': 1, 'projectId': args.project, 'status': 'awaiting-cad-specification',
                     'sketch': sketch, 'photos': photos, 'cad': None,
                     'unsupportedStages': ['independent sketch interpretation', 'STEP/GLB generation',
                                           '3D scene and gallery assembly', 'publication']}
            save(project / 'pipeline-state.json', state)
            (project / 'review-log.md').write_text('# Project review log\n\n')
            record(project, 'Created from sketch; CAD specification remains separate from image interpretation.')
            if args.intake:
                jomul_intake.initialize(project, args.intake, ROOT / sketch)
                intake = jomul_intake.progress(project)
                state['intake'] = 'intake/manifest.json'
                if intake['readyForCAD']:
                    build(project, state)
                else:
                    state['status'] = intake_status(intake)
                    state['nextInput'] = intake
                    save(project / 'pipeline-state.json', state)
            elif args.config:
                import_config(project, args.config)
                build(project, state)
            else:
                build(project, state)
        except Exception as error:
            if (project / 'pipeline-state.json').exists():
                failed = state_for(project)
                failed['status'] = 'blocked'
                failed['nextInput'] = f'Fix the reported input or generator error, then use resume: {error}'
                save(project / 'pipeline-state.json', failed)
                record(project, f'Build stopped: {error}')
            else:
                shutil.rmtree(project)
            raise
    else:
        state = state_for(project)
        if args.action == 'status':
            from stages import describe, affected
            report = {'projectId': args.project, 'stageContractVersion': 1,
                      'stages': describe(project, state),
                      'affectedStages': affected(args.changed) if args.changed else []}
            if args.config:
                from rebuild import inputs, plan
                proposed = args.config.expanduser().resolve(strict=True)
                previous = state.get('cad') or {}
                report['buildPlan'] = plan(previous.get('buildInputs'), inputs(proposed),
                    bool(previous) and tree_hashes(project / 'cad') == previous.get('filesSha256'))
            print(json.dumps(report, ensure_ascii=False, indent=2))
            return
        if args.action == 'verify':
            verify(project, state)
            if state.get('motionJob', {}).get('status') in ('failed', 'running'):
                raise ValueError('Motion browser gate is incomplete; use resume to retry')
            if state.get('gallery'):
                if tree_hashes(project / 'gallery') != state['gallery']['filesSha256']:
                    raise ValueError('Gallery output drift')
                from photos import verify_sources
                verify_sources(project / 'gallery')

            if state.get('motionPreview'):
                entry=state['motionPreview']
                if digest(project / 'cad/manifest.json') != entry['cadManifestSha256']:
                    raise ValueError('Motion preview CAD source drift; rebuild the preview')
                if tree_hashes(project / 'motion-preview') != entry['filesSha256']:
                    raise ValueError('Motion preview drift; rebuild from reviewed motion input')
                print(f'JOMUL_MOTION_PREVIEW_VERIFY_OK {project.name}')
            return
        if args.action == 'gallery':
            # Photo preparation is independent of CAD readiness and does not rebuild CAD.
            from photos import build_gallery
            source = args.photos.expanduser().resolve(strict=True)
            stage = project / 'gallery.building'
            # Validate cardinality/roles before snapshotting or replacing output.
            from photos import load_photos
            load_photos(source)
            snapshot(project)
            if stage.exists(): shutil.rmtree(stage)
            try:
                build_gallery(source, stage)
                output = project / 'gallery'
                if output.exists(): shutil.rmtree(output)
                stage.rename(output)
                state['gallery'] = {'filesSha256': tree_hashes(output)}
                save(project / 'pipeline-state.json', state)
                record(project, 'Built selected final-gallery component; finished-page assembly remains pending.')
            finally:
                if stage.exists(): shutil.rmtree(stage)
            print(f'CERAMIC_GALLERY_COMPONENT_READY {project.name}')
            return
        if args.action == 'motion-preview':
            import motion
            motion_data = motion.motion_input(json.loads(args.motion.expanduser().resolve(strict=True).read_text()))
            snapshot(project)
            build_motion(project, state, motion_data)
            return
        if args.action == 'rollback':
            source = (SNAP / args.project / args.snapshot).resolve()
            if source.parent != (SNAP / args.project).resolve():
                raise ValueError('Snapshot must belong to this project')
            manifest = json.loads((source / 'manifest.json').read_text())
            if manifest.get('project') != args.project or tree_hashes(source / 'files') != manifest['files']:
                raise ValueError('Snapshot is invalid or changed')
            preserved = snapshot(project)
            stage = WORK / (args.project + '.restoring')
            if stage.exists():
                shutil.rmtree(stage)
            shutil.copytree(source / 'files', stage)
            previous = WORK / (args.project + '.before-restore')
            if previous.exists():
                raise ValueError('Unresolved previous restore exists')
            project.rename(previous)
            try:
                stage.rename(project)
            except Exception:
                previous.rename(project)
                raise
            shutil.rmtree(previous)
            with (SNAP / args.project / 'rollback-log.md').open('a') as log:
                log.write(f'- {stamp()} restored {args.snapshot}; previous current saved as {preserved.name}\n')
            print(f'JOMUL_PROJECT_ROLLBACK_OK {args.project} {args.snapshot}')
            return
        if args.action == 'revise':
            preserved = snapshot(project)
            record(project, f'Feedback: {args.feedback} (snapshot {preserved.name}).')
            if not args.config:
                if (project / 'intake/manifest.json').exists():
                    state['status'] = 'awaiting-sketch-answers'
                    state['nextInput'] = 'Provide a new unanswered P1 answer or reviewed --profile; confirmed answer corrections require a reviewed intake revision.'
                else:
                    state['status'] = 'awaiting-revised-cad-specification'
                    state['nextInput'] = 'Provide --config for the revised CAD inputs; no visual values were guessed.'
                save(project / 'pipeline-state.json', state)
                print(f'JOMUL_PROJECT_AWAITING_INPUT {args.project} {preserved.name}')
                return
            if (project / 'intake/manifest.json').exists():
                raise ValueError('P1 intake revisions need reviewed extraction/profile inputs; manual config override is unsupported')
            import_config(project, args.config)
        elif args.intake:
            if args.answer or args.profile or args.handle or args.config:
                raise ValueError('Retry --intake separately before answers or profiles')
            if (project / 'intake').exists():
                raise ValueError('P1 intake already exists; preserve its answer history')
            snapshot(project)
            jomul_intake.initialize(project, args.intake, ROOT / state['sketch'])
            state['intake'] = 'intake/manifest.json'
            intake = jomul_intake.progress(project)
            if not intake['readyForCAD']:
                state['status'] = intake_status(intake)
                state['nextInput'] = intake
                save(project / 'pipeline-state.json', state)
                print(f'JOMUL_PROJECT_{state["status"].upper().replace("-", "_")} {args.project} {project}')
                return
        elif args.answer or args.profile or args.handle:
            if args.config:
                raise ValueError('Use P1 answers/profiles or --config in one resume, not both')
            if not (project / 'intake/manifest.json').is_file():
                raise ValueError('This project has no P1 intake; use --config')
            snapshot(project)
            if args.answer:
                jomul_intake.apply_answers(project, args.answer)
                record(project, 'Applied P1 answers: ' + ', '.join(str(p) for p in args.answer))
            if args.profile:
                jomul_intake.update_profiles(project, args.profile)
                record(project, 'Updated reviewed profiles: ' + ', '.join(args.profile))
            if args.handle:
                jomul_intake.update_handles(project, args.handle)
                record(project, 'Updated reviewed handles: ' + ', '.join(args.handle))
            intake = jomul_intake.progress(project)
            if not intake['readyForCAD']:
                state['status'] = intake_status(intake)
                state['nextInput'] = intake
                state['cad'] = None
                save(project / 'pipeline-state.json', state)
                final = state_for(project)
                print(f'JOMUL_PROJECT_{final["status"].upper().replace("-", "_")} {args.project} {project}')
                return
        elif args.config:
            if (project / 'intake/manifest.json').exists():
                raise ValueError('P1 intake owns this CAD config; answer P1 questions or revise the intake explicitly')
            if state['status'] == 'cad-ready':
                snapshot(project)
            import_config(project, args.config)
        elif state['status'] == 'awaiting-revised-cad-specification':
            raise ValueError('Revised CAD config is required for this resume')
        elif state['status'] == 'cad-ready':
            verify(project, state)
            resume_motion(project, state)
            return
        elif (project / 'intake/manifest.json').is_file():
            intake = jomul_intake.progress(project)
            if not intake['readyForCAD']:
                state['status'] = intake_status(intake)
                state['nextInput'] = intake
                save(project / 'pipeline-state.json', state)
                print(f'JOMUL_PROJECT_{state["status"].upper().replace("-", "_")} {args.project} {project}')
                return
        try:
            build(project, state)
        except (ValueError, KeyError, subprocess.CalledProcessError) as error:
            state['status'] = 'blocked'
            state['nextInput'] = f'Review the answered CAD dimensions and profile, then revise the reviewed source: {error}'
            save(project / 'pipeline-state.json', state)
            record(project, f'CAD build stopped after intake or config update: {error}')
            raise
    if state.get('status') == 'cad-ready':
        resume_motion(project, state)
    final = state_for(project)
    print(f'JOMUL_PROJECT_{final["status"].upper().replace("-", "_")} {args.project} {project}')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, FileNotFoundError, KeyError, subprocess.CalledProcessError) as error:
        raise SystemExit(f'JOMUL_PROJECT_ERROR {error}')
