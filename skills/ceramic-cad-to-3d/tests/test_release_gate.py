"""Synthetic gate contract fixtures; these are never final E2E evidence."""
import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'scripts'))
import release_gate as gate
import page_scheduler
from stages import hashes
from decision_checks import source_hashes, SUITES


class ReleaseGate(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for module in (gate, page_scheduler):
            p = patch.object(module, 'ROOT', self.root); p.start(); self.addCleanup(p.stop)
        self.verify = patch.object(gate.subprocess, 'run', return_value=SimpleNamespace(returncode=0,stdout='',stderr='')).start()
        self.addCleanup(patch.stopall)
        runtime = gate.sha(gate.SKILL/'runtime-lock.json')
        self.data = {'schemaVersion':1, 'runtimeSha256':runtime,
                     'decisions':self.write('decisions.json',{'status':'passed-within-scope','sourceSha256':source_hashes(),
                                                            'suites':{s:{'status':'passed'} for s in SUITES}}), 'cases':[]}
        self.data['visualDecisions'] = []
        for scope in ('feature-cad-wire','direct-drop','gallery-scatter'):
            output=self.write(scope+'-output.json',{'synthetic':True})
            self.data['visualDecisions'].append(self.write(scope+'-decision.json',{
                'scope':scope,'status':'user-approved','quote':'Synthetic test only',
                'sourceMessage':'unit test','outputs':[output]}))
        for mode, count in [('single',1),('multiple',3)]:
            project = '.poc/jomul-project-assets-workspaces/01-'+mode
            p = self.root/project
            self.write(project+'/input/config.json',{'compositionMode':mode,'parts':[{}]*count})
            self.write(project+'/input/sketch.png',{'synthetic':True})
            self.write(project+'/cad/model.step',{'synthetic':True})
            revision = 'page-revisions/test'
            self.write(project+'/'+revision+'/browser-parity/report.json',{'status':'passed', 'checks':[
                {'layout':v,'step':s} for v in ('desktop','short','mobile','mobile-short') for s in range(12)]})
            files = hashes(p/revision)
            state = {'status':'cad-ready', 'sketch':project+'/input/sketch.png', 'photos':[],
                     'cad':{'inputSha256':hashes(p/'input'),'filesSha256':hashes(p/'cad')},
                     'reviewedPageInput':{},'pageJob':{'status':'complete'},
                     'pageReview':{'generator':'selected-page','output':revision,'reviewedInput':{},
                                   'runtimeSha256':runtime,'filesSha256':files,'inputsSha256':{}}}
            self.write(project+'/pipeline-state.json',state)
            attestation = self.write(mode+'-input.json',{'runtimeSha256':runtime,'unusedBeforeEvaluation':True,
                'reviewer':'synthetic test','sourceMessage':'synthetic test only',
                'source':{'path':project+'/input/sketch.png','sha256':gate.sha(p/'input/sketch.png')}})
            approval = self.write(mode+'-approval.json',{'status':'user-approved','quote':'Synthetic test, not a real approval',
                'sourceMessage':'unit test','project':project,'revision':revision,'outputFilesSha256':files})
            self.data['cases'].append({'mode':mode,'project':project,'revision':revision,
                                      'evaluationAttestation':attestation,'visualApproval':approval})

    def write(self, name, data):
        path=self.root/name;path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(json.dumps(data))
        return {'path':name,'sha256':gate.sha(path)}

    def run_gate(self):
        self.write('release.json',self.data)
        return gate.check(self.root/'release.json')

    def change_record(self, ref, **changes):
        data=json.loads((self.root/ref['path']).read_text());data.update(changes)
        return self.write(ref['path'],data)

    def test_valid_fixture_runs_project_verification(self):
        self.assertEqual(self.run_gate()['status'],'passed-within-v1-scope')
        self.assertEqual(self.verify.call_count,2)

    def test_stale_runtime_and_missing_mode(self):
        original=copy.deepcopy(self.data)
        self.data['runtimeSha256']='0'*64
        with self.assertRaisesRegex(ValueError,'runtime is stale'):self.run_gate()
        self.data=original;self.data['cases'].pop()
        with self.assertRaisesRegex(ValueError,'single and multiple'):self.run_gate()

    def test_tampered_and_stale_decision_reports(self):
        (self.root/'decisions.json').write_text('{}')
        with self.assertRaisesRegex(ValueError,'changed evidence'):self.run_gate()
        self.data['decisions']=self.write('decisions.json',{'status':'passed-within-scope','sourceSha256':{}})
        with self.assertRaisesRegex(ValueError,'runtime/tests are stale'):self.run_gate()

    def test_development_input_and_wrong_approval(self):
        case=self.data['cases'][0];original=copy.deepcopy(case)
        case['evaluationAttestation']=self.change_record(case['evaluationAttestation'],unusedBeforeEvaluation=False)
        with self.assertRaisesRegex(ValueError,'used for development'):self.run_gate()
        case['evaluationAttestation']=self.change_record(case['evaluationAttestation'],unusedBeforeEvaluation=True)
        case['visualApproval']=self.change_record(case['visualApproval'],revision='other')
        with self.assertRaisesRegex(ValueError,'another output'):self.run_gate()

    def test_changed_page_and_failed_geometry(self):
        path=self.root/self.data['cases'][0]['project']/'page-revisions/test/extra.txt';path.write_text('drift')
        with self.assertRaisesRegex(ValueError,'stale, incomplete'):self.run_gate()
        path.unlink();self.verify.return_value=SimpleNamespace(returncode=1,stdout='',stderr='invalid solid')
        with self.assertRaisesRegex(ValueError,'geometry verification failed'):self.run_gate()

    def test_missing_visual_scope_and_incomplete_browser(self):
        decisions=self.data['visualDecisions'];self.data['visualDecisions']=decisions[:2]
        with self.assertRaisesRegex(ValueError,'Missing feature CAD'):self.run_gate()
        self.data['visualDecisions']=decisions
        case=self.data['cases'][0];project=self.root/case['project']
        report=project/case['revision']/'browser-parity/report.json'
        report.write_text(json.dumps({'status':'passed','checks':[]}))
        state=json.loads((project/'pipeline-state.json').read_text())
        state['pageReview']['filesSha256']=hashes(project/case['revision'])
        (project/'pipeline-state.json').write_text(json.dumps(state))
        with self.assertRaisesRegex(ValueError,'Incomplete browser'):self.run_gate()

    def test_evidence_cannot_escape_workspace(self):
        self.data['decisions']={'path':'../outside.json','sha256':'0'*64}
        with self.assertRaisesRegex(ValueError,'inside workspace'):self.run_gate()

if __name__=='__main__':unittest.main()
