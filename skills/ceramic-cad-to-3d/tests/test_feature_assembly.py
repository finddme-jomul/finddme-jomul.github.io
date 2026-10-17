import copy
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from build123d import Box, Vector, export_step
from feature_assembly import check
from layered_review import assembly

class FeatureAssembly(unittest.TestCase):
    def test_actual_solids_paths_final_overlap_and_offset_origin(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);parts=[]
            for i,x in enumerate((-30,30)):
                path=root/f'{i}.step';export_step(Box(10,10,10).translate(Vector(100+i*25,42,20)),path)
                parts.append({'id':str(i),'step':path,'appearance':{'motion':{'finalXDesktop':x/1000,'finalXMobile':x/1000}}})
            spec={'steps':[{'partId':'0','start':0,'duration':.5,'targetPositionMm':[0,0,0],'liftMm':30},{'partId':'1','start':.5,'duration':.5,'targetPositionMm':[0,11,0],'liftMm':30}]}
            report=check(parts,spec)
            self.assertTrue(all(v['intersectionMm3']==0 for v in report['finalIntersections']))
            bad=copy.deepcopy(spec);bad['steps'][1]['targetPositionMm']=[0,5,0]
            with self.assertRaisesRegex(ValueError,'collision'):check(parts,bad)
            # Both endpoints are disjoint, but the second object crosses the first.
            bad=copy.deepcopy(spec);bad['steps'][1].update(targetPositionMm=[-30,0,0],liftMm=0)
            with self.assertRaisesRegex(ValueError,'collision'):check(parts,bad)
    def test_feature_adapter_material_identity_and_count(self):
        import json
        from unittest.mock import patch
        import feature_multiple as adapter
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);project=root/'project';(project/'input').mkdir(parents=True);(project/'geometry').mkdir()
            (project/'pipeline-state.json').write_text('{}');(project/'geometry/drawing-manifest.json').write_text('{}')
            (root/'photos.json').write_text('[]')
            material={'clay':{'name':'clay'},'glaze':{'name':'glaze'}}
            (project/'input/material.json').write_text(json.dumps(material));(project/'input/shape.json').write_text('{}')
            for count in (3,5):
                parts=[];appearance=[]
                for i in range(count):
                    pid=f'part-{i}';partdir=project/'geometry'/pid;partdir.mkdir(exist_ok=True)
                    (partdir/'manifest.json').write_text(json.dumps({'boundsMm':{'min':[10,20,30],'max':[20,30,40]}}))
                    (partdir/'model.step').write_text('test stub; no assembly requested')
                    parts.append({'id':pid,'shapeKind':'feature-solid','material':'project/input/material.json','shape':'project/input/shape.json'})
                    appearance.append({'id':pid,'accentEnabled':False,'glazePreview':{'clayName':'clay','baseName':'glaze','roughness':.4,'clearcoat':.2}})
                (project/'input/config.json').write_text(json.dumps({'name':'test','compositionMode':'multiple','parts':parts}))
                review={'renderer':'feature-solids','parts':appearance,'photos':'photos.json','motion':{'timing':{'accentGlazeStart':None}}}
                with patch.object(adapter,'ROOT',root),patch.object(adapter,'validate'),patch('project.verify'):
                    output=adapter.prepare(project,review)
                    self.assertEqual(count,len(output['parts']))
                    self.assertEqual(10,output['parts'][0]['dimensionsMm']['height'])
                    bad=copy.deepcopy(review);bad['parts'][0]['glazePreview']['baseName']='wrong'
                    with self.assertRaisesRegex(ValueError,'names'):adapter.prepare(project,bad)
                    bad=copy.deepcopy(review);bad['parts'][0]['accentEnabled']=True
                    with self.assertRaisesRegex(ValueError,'one all-surface'):adapter.prepare(project,bad)
                    bad=copy.deepcopy(review);bad['parts'][0]['glazePreview']['clearcoat']=True
                    with self.assertRaisesRegex(ValueError,'roughness/clearcoat'):adapter.prepare(project,bad)

    def test_single_coat_assembly_timing(self):
        p=[{'id':'a','motion':{'settledScale':1}}]
        spec={'status':'reviewed-provisional','provenance':'test','start':.7,'duration':.2,'steps':[{'partId':'a','start':0,'duration':1,'targetPositionMm':[0,0,0],'liftMm':10}]}
        timing={'baseGlazeStart':.4,'baseGlazeDuration':.2,'accentGlazeStart':None,'photoStart':.97}
        assembly(spec,p,timing)
        spec['start']=.5
        with self.assertRaises(ValueError):assembly(spec,p,timing)

if __name__=='__main__':unittest.main()
