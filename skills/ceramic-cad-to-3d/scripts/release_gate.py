"""Read-only, artifact-bound v1 release gate; attestations are not inferred approvals."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from ceramic_paths import ROOT, SKILL


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def artifact(ref):
    path = (ROOT / ref['path']).resolve()
    require(path.is_relative_to(ROOT.resolve()), 'Evidence must be inside workspace')
    require(path.is_file() and sha(path) == ref['sha256'], 'Missing or changed evidence: '+str(path))
    return path


def record(ref):
    return json.loads(artifact(ref).read_text())


def check(path):
    from decision_checks import source_hashes, SUITES
    from page_scheduler import current
    from stages import describe
    evidence = json.loads(Path(path).read_text())
    require(evidence['schemaVersion'] == 1, 'Unknown release evidence schema')
    runtime = sha(SKILL / 'runtime-lock.json')
    require(evidence['runtimeSha256'] == runtime, 'Release runtime is stale')
    # These known unresolved stages are discharged by the checks below, never by
    # deleting pending text. Any newly introduced pending stage still blocks.
    known = {'new-project finished-page assembly with approved scene parity',
             'multi-photo placement rule', 'new-project end-to-end evaluation'}
    selection = json.loads((SKILL / 'selection.json').read_text())
    require(set(selection['pending']) <= known, 'Unhandled pending release stage')
    report = record(evidence['decisions'])
    require(report['status'] == 'passed-within-scope', 'Decision checks did not pass')
    require(report['sourceSha256'] == source_hashes(), 'Decision report runtime/tests are stale')
    require(set(report['suites']) == set(SUITES) and
            all(r['status'] == 'passed' for r in report['suites'].values()), 'Incomplete decision checks')
    adoptions = {}
    for ref in evidence['visualDecisions']:
        decision = record(ref)
        require(decision['status'] == 'user-approved' and decision['quote'].strip() and
                decision['sourceMessage'].strip() and decision['outputs'], 'Missing scoped visual decision')
        require(decision['scope'] not in adoptions, 'Duplicate visual decision scope')
        for output_ref in decision['outputs']:
            artifact(output_ref)
        adoptions[decision['scope']] = decision
    require({'feature-cad-wire', 'direct-drop', 'gallery-scatter'} <= set(adoptions),
            'Missing feature CAD/wire, corrected landing or scatter adoption')
    cases = evidence['cases']
    require(len(cases) == 2 and {c['mode'] for c in cases} == {'single', 'multiple'},
            'Need single and multiple unused-input evaluations')
    outputs = []
    for case in cases:
        project = (ROOT / case['project']).resolve()
        require(project.is_relative_to(ROOT.resolve() / '.poc/jomul-project-assets-workspaces'),
                'Evaluation project must be in workspace project directory')
        state = json.loads((project / 'pipeline-state.json').read_text())
        require(state.get('pageJob', {}).get('status') == 'complete' and current(project, state),
                'Evaluation page is stale, incomplete or changed')
        require(describe(project, state)['page']['status'] == 'complete', 'Evaluation geometry is stale')
        config = json.loads((project / 'input/config.json').read_text())
        require(config['compositionMode'] == case['mode'] and
                ((len(config['parts']) == 1) if case['mode'] == 'single' else len(config['parts']) >= 2),
                'Evaluation mode/part count mismatch')
        output = project / state['pageReview']['output']
        require(case['revision'] == state['pageReview']['output'], 'Evaluation revision mismatch')
        browser = json.loads((output / 'browser-parity/report.json').read_text())
        require(browser['status'] == 'passed', 'Browser gate failed')
        for layout in ('desktop', 'short', 'mobile', 'mobile-short'):
            require({c['step'] for c in browser['checks'] if c['layout'] == layout} >= set(range(12)),
                    'Incomplete browser viewport/scene evidence')
        intake = record(case['evaluationAttestation'])
        require(intake['runtimeSha256'] == runtime and intake['unusedBeforeEvaluation'] is True,
                'Input was used for development or evaluated against another runtime')
        require(intake['sourceMessage'].strip() and intake['reviewer'].strip(), 'Missing evaluation provenance')
        source = artifact(intake['source'])
        require(sha(source) == sha(ROOT / state['sketch']), 'Evaluation sketch mismatch')
        approval = record(case['visualApproval'])
        require(approval['status'] == 'user-approved' and approval['quote'].strip() and
                approval['sourceMessage'].strip(), 'Missing real visual approval')
        require(approval['revision'] == case['revision'] and approval['project'] == case['project'],
                'Visual approval belongs to another output')
        require(approval['outputFilesSha256'] == state['pageReview']['filesSha256'],
                'Visual approval output changed')
        result = subprocess.run([sys.executable, str(SKILL/'scripts/run.py'), '--workspace', str(ROOT),
                                 'verify', project.name], capture_output=True, text=True, timeout=600)
        require(result.returncode == 0, 'Project geometry verification failed: '+result.stdout+result.stderr)
        outputs.append(str(output.relative_to(ROOT)))
    require(len(set(outputs)) == 2, 'Evaluation cases must be separate projects/revisions')
    return {'status': 'passed-within-v1-scope', 'runtimeSha256': runtime, 'outputs': outputs,
            'scope': 'Evaluated outputs and frozen v1 only; no site publication or universal input guarantee'}
