"""Publication/failure recovery tests; renderer boundary explicitly simulated."""
import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import project
import page_scheduler as scheduler
import selected_page
from photos import sha
from stages import describe

class Scheduling(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name);self.p=self.root/'01-test';self.p.mkdir()
        (self.p/'cad').mkdir();(self.p/'cad/manifest.json').write_text('{}');(self.p/'input').mkdir()
        self.photo=self.root/'photos.json';self.photo.write_text('[]')
        self.state={'schemaVersion':1,'projectId':'01-test','status':'cad-ready','pageGenerator':'selected-page','cad':{'filesSha256':project.tree_hashes(self.p/'cad'),'inputSha256':{}},'reviewedPageInput':{'photos':'photos.json','motion':'reviewed'}}
        for module,name,value in [(project,'ROOT',self.root),(project,'WORK',self.root),(project,'SNAP',self.root/'snapshots'),(scheduler,'ROOT',self.root)]:
            patcher=patch.object(module,name,value);patcher.start();self.addCleanup(patcher.stop)
        self.calls=0
    def renderer(self,target,cad_project,review):
        self.calls+=1;target.mkdir()
        (target/'index.html').write_text('verified-'+str(self.calls))
        (target/'cad-bridge.json').write_text(json.dumps({'inputsSha256':{'photos.json':sha(self.photo),'01-test/cad/manifest.json':sha(self.p/'cad/manifest.json')}}))
    def test_failure_retains_old_revision_retry_and_noop(self):
        with patch.object(selected_page,'restore',side_effect=self.renderer):scheduler.resume(self.p,self.state)
        old=copy.deepcopy(self.state['pageReview']);old_path=self.p/old['output'];before=project.tree_hashes(old_path)
        self.assertEqual('complete',describe(self.p,self.state)['page']['status'])
        with patch.object(selected_page,'restore') as render:scheduler.resume(self.p,self.state);render.assert_not_called()
        self.photo.write_text('["changed"]')
        self.assertEqual('stale',describe(self.p,self.state)['page']['status'])
        with patch.object(selected_page,'restore',side_effect=RuntimeError('browser failed')):
            with self.assertRaisesRegex(RuntimeError,'browser failed'):scheduler.resume(self.p,self.state)
        self.assertEqual(old,self.state['pageReview']);self.assertEqual(before,project.tree_hashes(old_path))
        self.assertEqual('failed',describe(self.p,self.state)['page']['status'])
        with patch.object(selected_page,'restore',side_effect=self.renderer):scheduler.resume(self.p,self.state)
        self.assertNotEqual(old['output'],self.state['pageReview']['output']);self.assertEqual(before,project.tree_hashes(old_path))
        self.assertTrue(scheduler.current(self.p,self.state))
    def test_feature_failure_retry_noop_and_geometry_dependency(self):
        geometry=self.p/'geometry';geometry.mkdir();(geometry/'manifest.json').write_text('{}')
        self.state['status']='geometry-ready';self.state['cad']=None
        self.state['featureGeometry']={'inputSha256':project.tree_hashes(self.p/'input'),'filesSha256':project.tree_hashes(geometry)}
        original=self.renderer
        def feature_renderer(target,cad_project,review):
            original(target,cad_project,review)
            bridge=target/'cad-bridge.json';data=json.loads(bridge.read_text())
            data['inputsSha256']['01-test/geometry/manifest.json']=sha(geometry/'manifest.json')
            bridge.write_text(json.dumps(data))
        self.renderer=feature_renderer
        self.test_failure_retains_old_revision_retry_and_noop()
        previous=self.state['pageReview']['output']
        (geometry/'manifest.json').write_text('{"changed":true}')
        with patch.object(selected_page,'restore') as render:
            scheduler.resume(self.p,self.state);render.assert_not_called()
        self.state['featureGeometry']['filesSha256']=project.tree_hashes(geometry)
        with patch.object(selected_page,'restore',side_effect=self.renderer):scheduler.resume(self.p,self.state)
        self.assertNotEqual(previous,self.state['pageReview']['output'])
        self.assertEqual('complete',describe(self.p,self.state)['page']['status'])

    def test_cli_resume_and_gallery_use_registered_generator(self):
        with patch.object(selected_page,'restore',side_effect=self.renderer):scheduler.resume(self.p,self.state)
        self.photo.write_text('["changed source marker"]')
        with patch.object(project,'verify'),patch.object(selected_page,'restore',side_effect=self.renderer) as render,patch.object(sys,'argv',['run.py','resume','01-test']):
            project.main();self.assertEqual(render.call_count,1)
        source=self.root/'new-photos.json';source.write_text('[]')
        with patch.object(project,'verify'),patch.object(selected_page,'restore',side_effect=self.renderer) as render,patch.object(sys,'argv',['run.py','gallery','01-test','--photos',str(source)]):
            project.main();self.assertEqual(render.call_count,1)
            self.assertEqual('new-photos.json',render.call_args.kwargs['review']['photos'])
        disk=json.loads((self.p/'pipeline-state.json').read_text());self.assertEqual('complete',disk['pageJob']['status'])

    def test_cli_cad_rebuild_schedules_page_after_success(self):
        with patch.object(selected_page,'restore',side_effect=self.renderer):scheduler.resume(self.p,self.state)
        previous=self.state['pageReview']['output']
        def cad_build(path,state):
            (path/'cad/manifest.json').write_text('{"revision":2}')
            state['cad']['filesSha256']=project.tree_hashes(path/'cad')
            project.save(path/'pipeline-state.json',state)
        with patch.object(project,'import_config'),patch.object(project,'build',side_effect=cad_build),patch.object(selected_page,'restore',side_effect=self.renderer) as render,patch.object(sys,'argv',['run.py','resume','01-test','--config','reviewed-config.json']):
            project.main();self.assertEqual(render.call_count,1)
        disk=json.loads((self.p/'pipeline-state.json').read_text())
        self.assertNotEqual(previous,disk['pageReview']['output']);self.assertTrue((self.p/previous/'index.html').is_file())

    def test_interrupted_job_never_promotes_partial_output(self):
        with patch.object(selected_page,'restore',side_effect=self.renderer):scheduler.resume(self.p,self.state)
        orphan=self.p/'page-revisions/interrupted';orphan.mkdir();(orphan/'index.html').write_text('partial')
        self.state['pageJob']={'status':'running','target':'page-revisions/interrupted'}
        with patch.object(selected_page,'restore',side_effect=self.renderer):scheduler.resume(self.p,self.state)
        self.assertNotEqual('page-revisions/interrupted',self.state['pageReview']['output'])
        self.assertEqual('partial',(orphan/'index.html').read_text())
        self.assertEqual('complete',self.state['pageJob']['status'])
    def test_state_commit_failure_retains_previous_page_and_review(self):
        with patch.object(selected_page,'restore',side_effect=self.renderer):scheduler.resume(self.p,self.state)
        old=copy.deepcopy(self.state['pageReview']);save=project.save
        def fail_commit(path,state):
            if state.get('pageJob',{}).get('status')=='complete':raise OSError('state commit failure')
            save(path,state)
        new={'photos':'photos.json','motion':'new reviewed setting'}
        with patch.object(selected_page,'restore',side_effect=self.renderer),patch.object(project,'save',side_effect=fail_commit):
            with self.assertRaises(OSError):scheduler.build(self.p,self.state,new)
        disk=json.loads((self.p/'pipeline-state.json').read_text())
        self.assertEqual(old,disk['pageReview']);self.assertEqual(new,disk['reviewedPageInput']);self.assertEqual('failed',disk['pageJob']['status'])
    def test_legacy_does_not_autorun_and_review_output_runtime_drift(self):
        self.state.pop('pageGenerator')
        with patch.object(selected_page,'restore') as render:scheduler.resume(self.p,self.state);render.assert_not_called()
        self.state['pageGenerator']='selected-page'
        with patch.object(selected_page,'restore',side_effect=self.renderer):scheduler.resume(self.p,self.state)
        self.state['reviewedPageInput']['motion']='changed';self.assertFalse(scheduler.current(self.p,self.state))
        self.state['reviewedPageInput']=copy.deepcopy(self.state['pageReview']['reviewedInput'])
        self.state['pageReview']['runtimeSha256']='wrong';self.assertFalse(scheduler.current(self.p,self.state))
        self.state['pageReview']['runtimeSha256']=sha(scheduler.SKILL/'runtime-lock.json')
        (self.p/self.state['pageReview']['output']/'index.html').write_text('tampered');self.assertFalse(scheduler.current(self.p,self.state))

if __name__=='__main__':unittest.main()
