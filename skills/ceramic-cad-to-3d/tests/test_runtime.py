"""Exercise the skill from a copied folder and a workspace without docs/artifacts."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from PIL import Image

SOURCE = Path(__file__).resolve().parents[1]

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

class PortableRuntime(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory(prefix='ceramic-package-')
        cls.base = Path(cls.tmp.name)
        cls.skill = cls.base / 'skill'
        shutil.copytree(SOURCE, cls.skill, ignore=shutil.ignore_patterns('__pycache__'))
        cls.workspace = cls.base / 'workspace'
        cls.workspace.mkdir()
        cls.cli = cls.skill / 'scripts/run.py'
        cls.sketch = cls.workspace / 'synthetic-sketch.png'
        Image.new('RGB', (200, 300), 'white').save(cls.sketch)
        cls.configs = {}
        for name in ('single', 'multiple', 'handled'):
            source = cls.skill / 'tests/fixtures' / name
            config = json.loads((source / 'config.json').read_text())
            for part in config['parts']:
                for key in ('profile', 'dimensions', 'material', 'handle'):
                    if key in part:
                        part[key] = str(source / part[key])
            path = cls.workspace / f'{name}.json'
            path.write_text(json.dumps(config))
            cls.configs[name] = path

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def run_cli(self, *args, ok=True):
        env = {k:v for k,v in os.environ.items() if k not in ('PYTHONPATH','CERAMIC_WORKSPACE')}
        result = subprocess.run([sys.executable,str(self.cli),'--workspace',str(self.workspace),*map(str,args)],
                                cwd=self.base, env=env, text=True,capture_output=True)
        self.assertEqual(result.returncode == 0, ok, result.stdout+'\n'+result.stderr)
        return result.stdout + result.stderr

    def project(self, pid):
        return self.workspace / '.poc/jomul-project-assets-workspaces' / pid

    def new(self, pid, name):
        self.run_cli('new',pid,'--sketch',self.sketch,'--config',self.configs[name])
        return self.project(pid)

    def test_01_package_without_repository(self):
        self.assertFalse((self.workspace/'docs').exists())
        self.assertFalse((self.workspace/'scripts').exists())
        self.assertIn('CERAMIC_PACKAGE_OK',self.run_cli('preflight'))
        self.assertIn('CERAMIC_RELEASE_BLOCKED',self.run_cli('preflight','--release',ok=False))
        self.assertIn('CERAMIC_PAGE_PENDING',self.run_cli('page',ok=False))

    def test_02_single_and_multiple_match_selected_sheets(self):
        for name,pid,reference in [('single','91-single','moon-jar'),('multiple','92-multiple','bowl-set')]:
            project=self.new(pid,name)
            self.run_cli('verify',pid)
            for layout in ('desktop','mobile','mobile-short'):
                filename=f'sheet-{layout}.svg'
                self.assertEqual(sha(project/'cad'/filename),
                    sha(self.skill/'assets/baselines/cad-common-accepted'/reference/filename),
                    f'{name}/{layout} selected CAD drift')

    def test_03_rollback_restores_exact_outputs(self):
        pid='93-rollback'; project=self.new(pid,'single')
        before={p.name:sha(p) for p in (project/'cad').iterdir() if p.is_file()}
        self.run_cli('revise',pid,'--feedback','synthetic feedback without new dimensions')
        snapshots=self.workspace/'.poc/jomul-project-assets-snapshots'/pid
        snapshot=next(p.name for p in snapshots.iterdir() if p.is_dir())
        self.run_cli('rollback',pid,snapshot)
        self.run_cli('verify',pid)
        self.assertEqual(before,{p.name:sha(p) for p in (project/'cad').iterdir() if p.is_file()})

    def test_04_gallery_roles_and_unadopted_layout(self):
        pid='94-gallery';project=self.new(pid,'single')
        photo=self.workspace/'synthetic-photo.jpg'
        exif=Image.Exif();exif[315]='synthetic private metadata'
        Image.new('RGB',(600,400),'blue').save(photo,exif=exif)
        photos=self.workspace/'photos.json'
        item={'source':str(photo),'sha256':sha(photo),'role':'actual',
              'status':'user-confirmed-final-fired','alt':'Synthetic test photograph'}
        photos.write_text(json.dumps([item]))
        self.run_cli('gallery',pid,'--photos',photos)
        self.run_cli('verify',pid)
        with Image.open(project/'gallery/assets/photo-1.webp') as exported:
            self.assertFalse(exported.getexif(), 'Public photo leaked source EXIF')
        markup=(project/'gallery/gallery.html').read_text()
        self.assertIn('gallery-photo--hero',markup)
        self.assertNotIn('gallery-first--multiple',markup)
        before=sha(project/'gallery/manifest.json')
        photos.write_text(json.dumps([item,item]))
        self.assertIn('MULTI_PHOTO_LAYOUT_PENDING',self.run_cli('gallery',pid,'--photos',photos,ok=False))
        self.assertEqual(before,sha(project/'gallery/manifest.json'))
        process_photo=self.workspace/'synthetic-process.jpg'
        Image.new('RGB',(400,600),'red').save(process_photo)
        process={'source':str(process_photo),'sha256':sha(process_photo),'role':'process',
                 'status':'user-confirmed-process','alt':'Synthetic process photograph'}
        photos.write_text(json.dumps([item,process]))
        self.run_cli('gallery',pid,'--photos',photos)
        self.assertIn('gallery-photo--process',(project/'gallery/gallery.html').read_text())
        self.run_cli('verify',pid)
        item['status']='assumed';photos.write_text(json.dumps([item]))
        self.assertIn('confirmed',self.run_cli('gallery',pid,'--photos',photos,ok=False))
        photos.write_text('[]')
        self.run_cli('gallery',pid,'--photos',photos)
        self.assertEqual('',(project/'gallery/gallery.html').read_text())
        self.run_cli('verify',pid)

    def test_05_changed_code_is_rejected(self):
        p=self.skill/'assets/gallery/gallery.js'
        before=p.read_bytes()
        try:
            p.write_bytes(before+b'\n// unexpected edit\n')
            self.assertIn('Selected runtime changed',self.run_cli('preflight',ok=False))
        finally:
            p.write_bytes(before)

    def test_06_handled_solid_and_motion_assets(self):
        pid='95-handled';project=self.new(pid,'handled')
        self.run_cli('verify',pid)
        source=json.loads((project/'cad/solid/manifest.json').read_text())
        self.assertTrue(source['parts'][0]['stepRoundTrip'])
        self.assertEqual(1,source['parts'][0]['checks']['joinedSolidCount'])


    def test_07_p1_answers_preserve_ranges_and_provenance(self):
        pid='96-intake'
        fixture=self.skill/'tests/fixtures/single'
        extraction=json.loads((fixture/'p1.json').read_text())
        extraction['source'].update({'path':str(self.sketch),'sha256':sha(self.sketch)})
        observed=self.workspace/'p1.json';observed.write_text(json.dumps(extraction))
        intake=self.workspace/'intake.json'
        intake.write_text(json.dumps({'schemaVersion':1,'name':'Synthetic intake regression',
            'parts':[{'id':'moon-jar','name':'Moon jar','extraction':str(observed),
                      'profile':str(fixture/'moon-jar-profile.json')}]}))
        self.assertIn('AWAITING_SKETCH_ANSWERS',self.run_cli('new',pid,'--sketch',self.sketch,'--intake',intake))
        def answer(name,qid,updates):
            path=self.workspace/(name+'.json')
            path.write_text(json.dumps({'project':'moon-jar','answerId':name,'questionId':qid,
                'evidence':{'kind':'user-message','reference':'synthetic-test'},
                'verbatim':'Synthetic regression input, not a user confirmation',
                'updates':[{'field':k,'value':v} for k,v in updates.items()],'deferFields':[]}))
            return path
        bad=answer('bad','MJ-Q1',{'exact_fired_height':500})
        self.assertIn('outside',self.run_cli('resume',pid,'--answer',bad,ok=False))
        state=self.project(pid)/'intake/moon-jar/p1-state.json'
        self.assertEqual([],json.loads(state.read_text())['answers'])
        q1=answer('q1','MJ-Q1',{'exact_fired_height':150,'exact_opening_diameter':45,'exact_foot_diameter':55})
        q2=answer('q2','MJ-Q2',{'wall_thickness':5,'base_thickness':8,'rim_foot_section':'reviewed test','hidden_surfaces':'reviewed test'})
        q3=answer('q3','MJ-Q3',{'opening_reference_priority':'written-dimension-range'})
        self.run_cli('resume',pid,'--answer',q1)
        self.assertIn('CAD_READY',self.run_cli('resume',pid,'--answer',q2,'--answer',q3))
        self.run_cli('verify',pid)
        dims=json.loads((self.project(pid)/'input/moon-jar-dimensions.json').read_text())
        self.assertEqual(150,dims['targetFiredMm']['height'])
        self.assertEqual('user-confirmed',dims['dimensionSources']['height']['status'])
        repeat=answer('repeat','MJ-Q1',{'exact_fired_height':155})
        self.assertIn('already confirmed',self.run_cli('resume',pid,'--answer',repeat,ok=False))
        self.run_cli('verify',pid)

    def test_08_stage_dependencies_and_independent_photos(self):
        pid='97-stages'
        self.run_cli('new',pid,'--sketch',self.sketch)
        project=self.project(pid)
        photos=self.workspace/'empty-stage-photos.json'; photos.write_text('[]')
        self.run_cli('gallery',pid,'--photos',photos)
        state_path=project/'pipeline-state.json'
        initial=sha(state_path)
        report=json.loads(self.run_cli('status',pid,'--changed','gallery'))
        self.assertEqual(initial,sha(state_path), 'Status must not mutate projects')
        self.assertEqual('blocked',report['stages']['cad']['status'])
        self.assertEqual('complete',report['stages']['gallery']['status'])
        self.assertEqual(['gallery','page'],report['affectedStages'])
        self.assertFalse((project/'cad').exists())
        gallery_before={p.relative_to(project/'gallery').as_posix():sha(p)
                        for p in (project/'gallery').rglob('*') if p.is_file()}
        self.run_cli('resume',pid,'--config',self.configs['single'])
        self.assertEqual(gallery_before,{p.relative_to(project/'gallery').as_posix():sha(p)
                        for p in (project/'gallery').rglob('*') if p.is_file()})
        cad_before=sha(project/'cad/manifest.json')
        self.run_cli('gallery',pid,'--photos',photos)
        self.assertEqual(cad_before,sha(project/'cad/manifest.json'))
        self.run_cli('verify',pid)
        # Legacy projects remain readable without an eager state migration.
        legacy=json.loads(state_path.read_text())
        legacy.pop('stages');legacy.pop('stageContractVersion')
        state_path.write_text(json.dumps(legacy))
        initial=sha(state_path)
        report=json.loads(self.run_cli('status',pid,'--changed','cad'))
        self.assertEqual(initial,sha(state_path))
        self.assertEqual(['cad','motion','page'],report['affectedStages'])
        self.assertEqual('complete',report['stages']['cad']['status'])
        # An edited input must not retain the recorded complete status.
        config=project/'input/config.json'
        config.write_text(config.read_text()+'\n')
        report=json.loads(self.run_cli('status',pid))
        self.assertEqual('stale',report['stages']['cad']['status'])
        self.assertEqual('complete',report['stages']['gallery']['status'])
        self.assertEqual('unsupported',report['stages']['page']['status'])
        self.assertIn('drift',self.run_cli('verify',pid,ok=False))

    def test_09_selective_cad_rebuild(self):
        pid='98-selective';project=self.new(pid,'handled')
        def state():
            return json.loads((project/'pipeline-state.json').read_text())
        def models():
            return {p.relative_to(project/'cad').as_posix():sha(p)
                    for p in (project/'cad/solid').rglob('model.*')}
        before=models()
        sheet=sha(project/'cad/sheet-desktop.svg')
        self.run_cli('revise',pid,'--feedback','same reviewed input','--config',self.configs['handled'])
        self.assertEqual('reuse',state()['lastBuildPlan']['sheet'])
        self.assertEqual('preserve',state()['lastBuildPlan']['motion'])
        self.assertEqual(before,models())
        config=json.loads(self.configs['handled'].read_text())
        material=json.loads(Path(config['parts'][0]['material']).read_text())
        material['clay']['name']='UPDATED TEST CLAY'
        changed=self.workspace/'changed-material.json';changed.write_text(json.dumps(material))
        config['parts'][0]['material']=str(changed)
        cfg=self.workspace/'changed-handled.json';cfg.write_text(json.dumps(config))
        before_state=sha(project/'pipeline-state.json')
        proposed=json.loads(self.run_cli('status',pid,'--config',cfg))
        self.assertEqual(['material'],proposed['buildPlan']['changedInputs'])
        self.assertEqual(before_state,sha(project/'pipeline-state.json'))
        self.run_cli('revise',pid,'--feedback','material name only','--config',cfg)
        self.assertEqual(['material'],state()['lastBuildPlan']['changedInputs'])
        self.assertEqual('reuse',state()['lastBuildPlan']['solid'])
        self.assertEqual(before,models())
        self.assertNotEqual(sheet,sha(project/'cad/sheet-desktop.svg'))
        self.run_cli('verify',pid)
        config['name']='Updated drawing project name'
        cfg.write_text(json.dumps(config))
        self.run_cli('revise',pid,'--feedback','drawing metadata only','--config',cfg)
        self.assertEqual(['drawing'],state()['lastBuildPlan']['changedInputs'])
        self.assertEqual(before,models())
        self.run_cli('verify',pid)
        dims=json.loads(Path(config['parts'][0]['dimensions']).read_text())
        dims['valuesMm']['wallThickness']=5
        changed=self.workspace/'changed-dimensions.json';changed.write_text(json.dumps(dims))
        config['parts'][0]['dimensions']=str(changed);cfg.write_text(json.dumps(config))
        self.run_cli('revise',pid,'--feedback','wall thickness change','--config',cfg)
        self.assertEqual(['geometry'],state()['lastBuildPlan']['changedInputs'])
        self.assertEqual('build',state()['lastBuildPlan']['solid'])
        self.assertNotEqual(before,models())
        self.run_cli('verify',pid)

    def test_10_explicit_scatter_preserves_roles_and_repeats(self):
        pid='99-scatter'
        self.run_cli('new',pid,'--sketch',self.sketch)
        photos=[]
        for i,role in enumerate(['actual','actual','process']):
            source=self.workspace/f'scatter-{i}.jpg'
            Image.new('RGB',[(400,600),(700,400),(400,400)][i],['red','green','blue'][i]).save(source)
            photos.append({'source':str(source),'sha256':sha(source),'role':role,
                           'status':'user-confirmed-final-fired' if role=='actual' else 'user-confirmed-process',
                           'alt':f'Synthetic layout test {i}'})
        manifest=self.workspace/'scatter.json'
        data={'photos':photos,'layout':{'mode':'scatter','seed':'review-1'}}
        manifest.write_text(json.dumps(data))
        self.run_cli('gallery',pid,'--photos',manifest)
        out=self.project(pid)/'gallery'
        before={p.name:sha(p) for p in out.iterdir() if p.is_file()}
        result=json.loads((out/'manifest.json').read_text())
        self.assertEqual('candidate-not-visually-adopted',result['layout']['status'])
        self.assertEqual(['actual','actual','process'],[p['role'] for p in result['photos']])
        self.assertEqual(3,(out/'gallery.html').read_text().count('gallery-photo--scatter'))
        self.run_cli('gallery',pid,'--photos',manifest)
        self.assertEqual(before,{p.name:sha(p) for p in out.iterdir() if p.is_file()})
        data['layout']['seed']='review-2';manifest.write_text(json.dumps(data))
        self.run_cli('gallery',pid,'--photos',manifest)
        self.assertNotEqual(before['gallery.html'],sha(out/'gallery.html'))
        data['photos'][1]=data['photos'][0];manifest.write_text(json.dumps(data))
        self.assertIn('Duplicate',self.run_cli('gallery',pid,'--photos',manifest,ok=False))

if __name__=='__main__':
    unittest.main()
