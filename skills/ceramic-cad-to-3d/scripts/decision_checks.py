"""Run decision-linked checks; never infer behavioral success from package hashes."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from ceramic_paths import SKILL, ROOT
from browser_environment import node_command

SUITES = {
    'blender-install': [sys.executable, str(SKILL/'tests/test_blender_environment.py')],
    'handled-page-input': [sys.executable, str(SKILL/'tests/test_handled_page.py')],
    'multiple-page-input': [sys.executable, str(SKILL/'tests/test_multiple_page.py')],
    'new-page-input': [sys.executable, str(SKILL/'tests/test_page_review.py')],
    'selected-cad': [sys.executable, str(SKILL/'tests/test_selected_cad.py')],
    'rotational-solid': [sys.executable, str(SKILL/'tests/test_rotational_solid.py')],
    'gallery-layout': [sys.executable, str(SKILL/'tests/test_gallery_layout.py')],
    'gate-contract': [sys.executable, str(SKILL/'tests/test_decision_checks.py')],
    'runtime': [sys.executable, str(SKILL/'tests/test_runtime.py')],
    'motion-recovery': [sys.executable, str(SKILL/'tests/test_motion_scheduler.py')],
    'axis': node_command(SKILL/'tests/test-axis-motion.mjs'),
    'background': node_command(SKILL/'tests/test-background.mjs'),
    'glaze': node_command(SKILL/'tests/test-glaze-motion.mjs'),
    'shrinkage': node_command(SKILL/'tests/clay-shrinkage.test.mjs'),
}


def validate(selection):
    ids = set()
    for decision in selection['decisions']:
        if decision['id'] in ids:
            raise ValueError('Duplicate decision: '+decision['id'])
        ids.add(decision['id'])
        for consumer in decision.get('consumer', []):
            if not (SKILL / consumer).is_file():
                raise ValueError('Missing decision consumer: '+consumer)
        check = decision.get('verification')
        if not check or not check.get('scope') or not isinstance(check.get('suites'), list):
            raise ValueError('Missing verification scope: '+decision['id'])
        if any(name not in SUITES for name in check['suites']):
            raise ValueError('Unknown verification suite: '+decision['id'])
        if not check['suites'] and not check.get('pendingReason'):
            raise ValueError('Unverified decision needs pending reason: '+decision['id'])


def decision_results(selection, results):
    rows=[]
    for decision in selection['decisions']:
        v=decision['verification']; suites=v['suites']
        status=('not-run' if not suites else
                'failed' if any(results[x]['status']=='failed' for x in suites) else 'passed-within-scope')
        rows.append({'id':decision['id'], 'implementationState':decision['state'],
                     'status':status, **v})
    return rows


def source_hashes():
    files=[SKILL/'runtime-lock.json',*sorted((SKILL/'tests').rglob('*'))]
    return {p.relative_to(SKILL).as_posix():hashlib.sha256(p.read_bytes()).hexdigest()
            for p in files if p.is_file() and '__pycache__' not in p.parts}


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',type=Path,default=ROOT/'.poc/decision-verification/report.json')
    args=parser.parse_args()
    from preflight import verify_package
    selection=json.loads((SKILL/'selection.json').read_text())
    output=args.output.expanduser().resolve()
    output.parent.mkdir(parents=True,exist_ok=True)
    report={'schemaVersion':1, 'startedAt':datetime.now(timezone.utc).isoformat(),
            'status':'running', 'finishedPageApproved':False,
            'sourceSha256':source_hashes(),
            'suites':{}}
    output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    try:
        verify_package()
        validate(selection)
    except (ValueError, OSError, KeyError) as error:
        report.update(status='failed', error=str(error))
        output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        raise SystemExit(str(error))
    for name, command in SUITES.items():
        try:
            run=subprocess.run(command,cwd=SKILL,text=True,capture_output=True,timeout=600)
            result={'status':'passed' if run.returncode==0 else 'failed',
                    'exitCode':run.returncode,'log':run.stdout+run.stderr}
        except (OSError, subprocess.TimeoutExpired) as error:
            result={'status':'failed','log':str(error)}
        report['suites'][name]=result
        print(f'DECISION_CHECK {name} {result["status"]}',flush=True)
        output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    report['decisions']=decision_results(selection,report['suites'])
    report['status']='failed' if any(x['status']=='failed' for x in report['suites'].values()) else 'passed-within-scope'
    if source_hashes() != report['sourceSha256']:
        report['status']='failed'
        report['error']='Runtime lock or checks changed while verification was running; rerun against one version'
    report['finishedAt']=datetime.now(timezone.utc).isoformat()
    output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(output)
    if report['status']=='failed': raise SystemExit(1)
