"""Exercise feature data through the maintained project CLI and exact snapshots."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from PIL import Image
K=Path(__file__).resolve().parents[1]


def hashes(path):
    return {str(p.relative_to(path)):hashlib.sha256(p.read_bytes()).hexdigest() for p in path.rglob('*') if p.is_file()}


class FeatureProject(unittest.TestCase):
    def test_lifecycle(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            sketch=root/'sketch.png';Image.new('RGB',(100,100),'white').save(sketch)
            shape=root/'shape.json'
            data=dict(schemaVersion=1,units='mm',upAxis='Z',status='reviewed-provisional',provenance={'source':'synthetic fixture'},assumptions=[],construction='solid',features=[dict(id='base',kind='box',operation='base',originMm=[0,0,0],sizeMm=[20,10,30])])
            shape.write_text(json.dumps(data));material=root/'material.json';material.write_text('{"status":"unknown"}')
            config=root/'config.json';value=dict(name='Feature development',style='technical-dense',compositionMode='single',parts=[dict(id='form',name='Form',shapeKind='feature-solid',shape=str(shape),material=str(material))]);config.write_text(json.dumps(value))
            def cli(*args,ok=True):
                result=subprocess.run([sys.executable,str(K/'scripts/run.py'),'--workspace',str(root),*map(str,args)],capture_output=True,text=True,env={**os.environ,'PYTHONWARNINGS':'ignore'})
                self.assertEqual(result.returncode==0,ok,result.stdout+result.stderr)
                return result.stdout+result.stderr
            pid='91-feature-test';project=root/'.poc/jomul-project-assets-workspaces'/pid
            cli('new',pid,'--sketch',sketch,'--config',config)
            state=json.loads((project/'pipeline-state.json').read_text())
            self.assertEqual(state['status'],'geometry-ready');self.assertIsNone(state['cad'])
            report=json.loads(cli('status',pid));self.assertEqual(report['stages']['geometry']['status'],'complete');self.assertEqual(report['stages']['cad']['status'],'blocked')
            cli('verify',pid)
            baseline=hashes(project);cli('resume',pid);self.assertEqual(baseline,hashes(project))
            data['features'][0]['sizeMm'][2]=40;shape.write_text(json.dumps(data))
            proposed=json.loads(cli('status',pid,'--config',config));self.assertEqual(proposed['buildPlan']['solid'],'build')
            cli('revise',pid,'--feedback','Raise synthetic feature','--config',config)
            revised=hashes(project/'geometry');self.assertNotEqual(revised,state['featureGeometry']['filesSha256'])
            cli('verify',pid)
            snap=root/'.poc/jomul-project-assets-snapshots'/pid
            original=next(p for p in snap.iterdir() if p.is_dir() and hashes(p/'files')==baseline)
            cli('rollback',pid,original.name);self.assertEqual(baseline,hashes(project))
            # Invalid feature compilation keeps the last verified output for recovery.
            data['features'].append(dict(id='detached',kind='box',operation='union',originMm=[100,100,100],sizeMm=[2,2,2]));shape.write_text(json.dumps(data))
            cli('revise',pid,'--feedback','Invalid disconnected shape','--config',config,ok=False)
            self.assertEqual(state['featureGeometry']['filesSha256'],hashes(project/'geometry'))
            self.assertEqual(json.loads(cli('status',pid))['stages']['geometry']['status'],'stale')
            data['features'].pop();shape.write_text(json.dumps(data));cli('resume',pid,'--config',config);cli('verify',pid)
            review=root/'review.json';review.write_text('{}')
            from unittest.mock import patch
            sys.path.insert(0,str(K/'scripts'))
            import feature_page
            with patch.object(feature_page,'ROOT',root), self.assertRaisesRegex(ValueError,'explicit clay/glaze'):
                feature_page.prepare(project,{})
            previous_models=hashes(project/'geometry/form')
            material.write_text('{"status":"unknown","note":"updated evidence"}')
            cli('revise',pid,'--feedback','Material evidence only','--config',config)
            self.assertEqual(previous_models,hashes(project/'geometry/form'))
            value['compositionMode']='multiple'
            value['parts'].append({**value['parts'][0],'id':'second-form'})
            config.write_text(json.dumps(value))
            cli('revise',pid,'--feedback','Second independent part','--config',config)
            self.assertTrue((project/'geometry/second-form/model.step').is_file())
            cli('verify',pid)
            current=hashes(project);cli('resume',pid);self.assertEqual(current,hashes(project))
            # Same lifecycle switches reviewed construction, retaining part IDs.
            data.update(construction='hollow', hollowing=dict(thicknessMm=1, opening=dict(axis='Z',side='max'), cavityProbeMm=[10,5,20]))
            shape.write_text(json.dumps(data))
            cli('revise',pid,'--feedback','Reviewed open hollow forms','--config',config)
            cli('verify',pid)
            for part in ('form','second-form'):
                manifest=json.loads((project/'geometry'/part/'manifest.json').read_text())
                self.assertEqual(manifest['construction'],'hollow')
                self.assertAlmostEqual(manifest['volumeMm3'],20*10*40-18*8*39,places=4)
                self.assertTrue((project/'geometry'/part/'wire-guide.json').is_file())
            current=hashes(project);cli('resume',pid);self.assertEqual(current,hashes(project))
            # Imported STEP is archived, fingerprinted and survives removal of its source.
            from build123d import Box,export_step
            model=root/'external.step';export_step(Box(20,10,30),model)
            raw_step=model.read_bytes()
            data.update(construction='imported');data.pop('hollowing')
            data['features']=[dict(id='source',operation='base',kind='step',source=model.name,sha256=hashlib.sha256(raw_step).hexdigest(),modelIntent='solid',expectedBoundsMm={'min':[-10,-5,-15],'max':[10,5,15]})]
            shape.write_text(json.dumps(data))
            cli('revise',pid,'--feedback','Reviewed external STEP','--config',config);cli('verify',pid)
            self.assertEqual(raw_step,(project/'input/form-source-model.step').read_bytes())
            self.assertEqual(data,json.loads((project/'input/form-source-shape.json').read_text()))
            self.assertEqual(raw_step,(project/'geometry/form/imported-source.step').read_bytes())
            model.unlink();current=hashes(project);cli('resume',pid);self.assertEqual(current,hashes(project))
            old_geometry=hashes(project/'geometry')
            export_step(Box(20,10,32),model)
            cli('revise',pid,'--feedback','Unreviewed changed source hash','--config',config,ok=False)
            self.assertEqual(old_geometry,hashes(project/'geometry'))
            data['features'][0].update(sha256=hashlib.sha256(model.read_bytes()).hexdigest(),expectedBoundsMm={'min':[-10,-5,-16],'max':[10,5,16]})
            shape.write_text(json.dumps(data));cli('resume',pid,'--config',config);cli('verify',pid)
            self.assertNotEqual(old_geometry,hashes(project/'geometry'))
            (project/'geometry/form/model.step').write_text('tampered')
            self.assertIn('drift',cli('verify',pid,ok=False))


if __name__=='__main__':unittest.main()
