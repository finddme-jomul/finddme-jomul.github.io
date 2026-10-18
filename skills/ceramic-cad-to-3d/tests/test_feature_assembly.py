import copy
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from build123d import Box, Vector, export_step
from feature_assembly import check
from assembly_geometry import position, landing_ease
from layered_review import assembly, apply_assembly_preset

class FeatureAssembly(unittest.TestCase):
    def test_adopted_preset_preserves_reference_and_rejects_regression(self):
        spec={'preset':'gentle-staggered','steps':[{'start':0,'duration':.22},{'start':.22,'duration':.60},{'start':.34,'duration':.60}]}
        review={'assembly':spec};original=copy.deepcopy(review)
        result=apply_assembly_preset(review)['assembly']
        self.assertEqual(original,review)
        self.assertEqual('direct-drop',result['mode']);self.assertEqual('soft-spin',result['landing']);self.assertTrue(result['overlap'])
        self.assertEqual(spec['steps'],result['steps'])
        bad=copy.deepcopy(review);bad['assembly']['steps'][2]['start']=.55
        with self.assertRaisesRegex(ValueError,'landing gap'):apply_assembly_preset(bad)
        bad=copy.deepcopy(review);bad['assembly']['overlap']=False
        with self.assertRaisesRegex(ValueError,'conflicts'):apply_assembly_preset(bad)
        legacy={'assembly':{'mode':'direct-drop'}}
        self.assertEqual(legacy,apply_assembly_preset(legacy))

    def test_soft_landing_has_zero_endpoint_velocity_and_acceleration(self):
        self.assertEqual(0,landing_ease(0));self.assertEqual(1,landing_ease(1))
        h=1e-4
        self.assertLess((landing_ease(1)-landing_ease(1-h))/h,1e-6)
        self.assertLess(abs((landing_ease(1)-2*landing_ease(1-h)+landing_ease(1-2*h))/h**2),.01)
        step={'start':0,'duration':1,'targetPositionMm':[0,0,0],'dropHeightMm':100}
        self.assertLess(position([0,0,0],step,.99,'direct-drop','soft-spin')[1],.002)

    def test_direct_drop_waits_above_target_and_descends_without_lift(self):
        step={'start':.3,'duration':.4,'targetPositionMm':[30,9,-10],'dropHeightMm':160}
        poses=[position([900,0,900],step,i/100,'direct-drop') for i in range(101)]
        self.assertEqual([30,169,-10],poses[0]);self.assertEqual([30,9,-10],poses[-1])
        self.assertTrue(all(p[0]==30 and p[2]==-10 for p in poses))
        self.assertTrue(all(a[1]>=b[1] for a,b in zip(poses,poses[1:])))
        self.assertEqual(poses[50],position([0,0,0],step,.5,'direct-drop'))

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
    def test_rotating_thin_instances_collide_only_between_endpoints(self):
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/'rod.step';export_step(Box(40,4,5),path)
            parts=[{'id':str(i),'step':path,'appearance':{'motion':{'finalXDesktop':0,'finalXMobile':0}}} for i in range(2)]
            spec={'mode':'direct-drop','landing':'soft-spin','start':0,'duration':1,'steps':[{'partId':str(i),'start':0,'duration':1,'targetPositionMm':[0,0,-10*i],'dropHeightMm':10} for i in range(2)]}
            motion={'timing':{'baseGlazeStart':0},'glaze':{'spinTurns':1,'axisPrecessionTurns':1}}
            with self.assertRaisesRegex(ValueError,'collision'):check(parts,spec,motion)
            spec['steps'][1]['targetPositionMm'][2]=-50
            report=check(parts,spec,motion)
            self.assertEqual(0,report['cadIntersections'])

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
                    layered=copy.deepcopy(review);layered['motion']['timing']['accentGlazeStart']=.6
                    region={'surface':'exterior','minHeightMm':0,'maxHeightMm':5}
                    layers=[{'order':1,'name':'black','application':'exterior-below-dashed-boundary'},{'order':2,'name':'clear','application':'full-coat'}]
                    (project/'input/material.json').write_text(json.dumps({'clay':{'name':'clay'},'glazeLayers':layers}))
                    for p in layered['parts']:
                        p['glazePreview'].update(baseName='black',accentName='clear')
                        p['coatings']={'status':'reviewed-provisional','provenance':'test','roughness':.5,'layers':[{'name':'black','region':region,'previewHex':'#222222'},{'name':'clear','region':{'surface':'all'},'previewHex':'#eeeeee'}],'fired':{'baseHex':'#eeeeee','region':region,'regionHex':'#777777'}}
                    self.assertEqual(count,len(adapter.prepare(project,layered)['parts']))
                    bad=copy.deepcopy(layered);bad['parts'][0]['coatings']['layers'].reverse()
                    with self.assertRaisesRegex(ValueError,'names/order'):adapter.prepare(project,bad)
                    bad=copy.deepcopy(layered);bad['parts'][0]['coatings']['layers'][0]['region']={'surface':'all'}
                    with self.assertRaisesRegex(ValueError,'interior'):adapter.prepare(project,bad)
                    (project/'input/material.json').write_text(json.dumps(material))


    def test_overlap_requires_opt_in_and_preserves_landing_order(self):
        timing={'baseGlazeStart':.4,'baseGlazeDuration':.2,'accentGlazeStart':None,'photoStart':.97}
        parts=[{'id':v,'motion':{'settledScale':1}} for v in ('base','one','two')]
        spec={'status':'reviewed-provisional','provenance':'test','mode':'direct-drop','overlap':True,'start':.63,'duration':.32,
              'steps':[{'partId':pid,'start':start,'duration':duration,'dropHeightMm':100,'targetPositionMm':[0,0,0]} for pid,start,duration in [('base',0,.22),('one',.22,.60),('two',.34,.60)]]}
        assembly(spec,parts,timing)
        bad=copy.deepcopy(spec);bad.pop('overlap')
        with self.assertRaises(ValueError):assembly(bad,parts,timing)
        bad=copy.deepcopy(spec);bad['steps'][2]['duration']=.1
        with self.assertRaises(ValueError):assembly(bad,parts,timing)
        a,b=spec['steps'][1:]
        self.assertLess(b['start'],a['start']+a['duration'])
        self.assertAlmostEqual((b['start']+b['duration']-a['start']-a['duration'])*spec['duration'],.0384)

    def test_single_coat_assembly_timing(self):
        p=[{'id':'a','motion':{'settledScale':1}}]
        spec={'status':'reviewed-provisional','provenance':'test','start':.7,'duration':.2,'steps':[{'partId':'a','start':0,'duration':1,'targetPositionMm':[0,0,0],'liftMm':10}]}
        timing={'baseGlazeStart':.4,'baseGlazeDuration':.2,'accentGlazeStart':None,'photoStart':.97}
        assembly(spec,p,timing)
        direct=copy.deepcopy(spec);direct['mode']='direct-drop';direct['steps'][0].pop('liftMm');direct['steps'][0]['dropHeightMm']=80
        assembly(direct,p,timing)
        for value in (0,-1,True,float('nan'),1001):
            direct['steps'][0]['dropHeightMm']=value
            with self.subTest(dropHeight=value),self.assertRaises(ValueError):assembly(direct,p,timing)
        spec['start']=.5
        with self.assertRaises(ValueError):assembly(spec,p,timing)

if __name__=='__main__':unittest.main()
