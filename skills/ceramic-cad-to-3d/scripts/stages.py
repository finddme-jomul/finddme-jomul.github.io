"""Operational stage contract, derived from recorded artifacts; no silent rebuilds."""
import hashlib

CONTRACT = {
    'cad': {'dependsOn': [], 'inputs': ['input/config.json', 'input/*', 'intake/*'],
            'outputs': ['cad/*'], 'completion': 'recorded input/output hashes; CAD geometry gate at build/verify'},
    'motion': {'dependsOn': ['cad'], 'inputs': ['cad/*', 'reviewed motion JSON'],
               'outputs': ['motion-preview/*'], 'completion': 'CAD dependency, output hashes; four-viewport gate at build'},
    'gallery': {'dependsOn': [], 'inputs': ['reviewed photo list and source images'],
                'outputs': ['gallery/*'], 'completion': 'source roles/hashes and exported output hashes'},
    'page': {'dependsOn': ['cad', 'gallery'], 'inputs': ['registered selected-page review and hashed CAD/photo inputs'],
             'outputs': ['page-revisions/*'], 'completion': 'selected-page browser gate and current dependency/output hashes; visual acceptance remains separately scoped'},
}


def hashes(path):
    return {p.relative_to(path).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(path.rglob('*')) if p.is_file()}


def describe(project, state):
    """Read-only compatibility view for old states as well as newly saved states."""
    result = {name: dict(contract, status='pending', reason='No recorded output')
              for name, contract in CONTRACT.items()}
    cad = state.get('cad')
    if cad:
        valid = (hashes(project/'input') == cad['inputSha256']
                 and hashes(project/'cad') == cad['filesSha256']
                 and ('intakeSha256' not in cad or hashes(project/'intake') == cad['intakeSha256']))
        ready = valid and state['status'] == 'cad-ready'
        result['cad'].update(status='complete' if ready else 'stale',
                             reason='Recorded artifacts match' if ready else 'CAD inputs/output changed or revision awaits input')
    else:
        result['cad'].update(status='blocked', reason=str(state.get('nextInput') or state['status']))
    motion = state.get('motionPreview')
    if motion:
        manifest = project/'cad/manifest.json'
        valid = (result['cad']['status'] == 'complete' and manifest.is_file()
                 and hashlib.sha256(manifest.read_bytes()).hexdigest() == motion['cadManifestSha256']
                 and hashes(project/'motion-preview') == motion['filesSha256'])
        result['motion'].update(status='complete' if valid else 'stale',
                                reason='Recorded artifacts match' if valid else 'CAD dependency or motion output changed')
    else:
        result['motion'].update(status='blocked', reason='Needs supported handled CAD and reviewed motion input')
    if state.get('motionJob', {}).get('status') in ('failed', 'running'):
        result['motion'].update(status=state['motionJob']['status'], reason=state['motionJob'].get('error', 'Browser gate is pending'))
    gallery = state.get('gallery')
    if gallery:
        valid = hashes(project/'gallery') == gallery['filesSha256']
        reason = 'Recorded artifacts match'
        try:
            from photos import verify_sources
            verify_sources(project/'gallery')
        except (ValueError, OSError, KeyError, TypeError) as error:
            valid = False
            reason = str(error)
        result['gallery'].update(status='complete' if valid else 'stale',
                                 reason=reason if valid or reason != 'Recorded artifacts match' else 'Gallery output changed')
    if (not motion and state.get('reviewedMotionInput')
            and state.get('motionJob', {}).get('status') not in ('failed', 'running')):
        result['motion']['reason'] = 'CAD changed; reviewedMotionInput is preserved; rebuild motion-preview and pass its browser gate'
    result['page'].update(status='pending', reason='Register explicit page-review --review input')
    page=state.get('pageReview')
    if page:
        if page.get('generator')=='selected-page':
            from page_scheduler import current
            valid=result['cad']['status']=='complete' and current(project,state)
            result['page'].update(status='complete' if valid else 'stale',
                                  reason='Browser-verified selected-page revision' if valid else 'Page inputs/runtime/output changed; use resume',
                                  output=page['output'])
        else:
            result['page'].update(status='stale',reason='Withdrawn legacy scene; register page-review --review explicitly')
    if state.get('pageJob',{}).get('status') in ('failed','running'):
        result['page'].update(status=state['pageJob']['status'],reason=state['pageJob'].get('error','Browser gate pending'))
    if state.get('featureGeometry'):
        entry=state['featureGeometry']
        valid=(state['status']=='geometry-ready' and hashes(project/'input')==entry['inputSha256']
               and hashes(project/'geometry')==entry['filesSha256'])
        result['geometry']={'status':'complete' if valid else 'stale', 'outputs':['geometry/*'],
                            'reason':'Feature solid geometry; drawing and renderer readiness tracked separately'}
        if entry.get('drawingCandidate'):
            result['drawing']={'status':'candidate' if valid else 'stale',
                               'outputs':['geometry/sheet-*.svg','geometry/drawing-manifest.json','geometry/*/wire-guide.json'],
                               'reason':'BRep drawing and section guides; visual adoption pending'}
        result['cad'].update(status='blocked',reason='Feature drawing visual adoption pending')
        result['page'].update(status='pending',reason='Register a single-feature page review with explicit materials')
        if page and page.get('generator')=='selected-page':
            from page_scheduler import current
            result['page'].update(status='complete' if valid and current(project,state) else 'stale',
                                  reason='Single-feature page candidate; visual adoption pending',output=page['output'])
        if state.get('pageJob',{}).get('status') in ('failed','running'):
            result['page'].update(status=state['pageJob']['status'],reason=state['pageJob'].get('error','Browser gate pending'))
        result['motion'].update(status='blocked',reason='Provide reviewed motion input for a feature part')
        if motion:
            motion_valid=(valid and motion.get('geometrySha256')==hashes(project/'geometry')
                          and hashes(project/'motion-preview')==motion['filesSha256'])
            result['motion'].update(status='complete' if motion_valid else 'stale',reason='Feature motion preview; page tracked separately')
        if state.get('motionJob',{}).get('status') in ('failed','running'):
            result['motion'].update(status=state['motionJob']['status'],reason=state['motionJob'].get('error','Browser gate pending'))
    return result


def affected(stage):
    """Transitive consumers, used by status planning and future stage builders."""
    found = {stage}
    for _ in CONTRACT:
        found.update(name for name, spec in CONTRACT.items() if found.intersection(spec['dependsOn']))
    return [name for name in CONTRACT if name in found]
