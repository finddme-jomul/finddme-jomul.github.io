"""Analytic volumes, unsupported construction and failed feature isolation."""
import copy
import math
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'scripts'))
from feature_shape import build, generate


def spec(features):
    return dict(schemaVersion=1, units='mm', upAxis='Z', status='reviewed-provisional',
                provenance={'source':'synthetic development input'}, assumptions=['Not a manufacturing model'],
                construction='solid', features=features)


class FeatureShape(unittest.TestCase):
    def test_cut_volume_and_cavity(self):
        data=spec([dict(id='base', operation='base', kind='box', originMm=[0,0,0], sizeMm=[20,20,20]),
                   dict(id='socket', operation='cut', kind='sphere', centerMm=[10,10,20], radiusMm=3)])
        model, checks=build(data)
        self.assertAlmostEqual(model.volume,8000-2*math.pi*27/3,places=5)
        self.assertFalse(model.is_inside((10,10,19)))
        self.assertLess(checks[-1]['changeMm3'],0)
        for update in ({'construction':'hollow'}, {'construction':None}):
            with self.assertRaises(ValueError):build({**data,**update})
        data['features'][-1]['centerMm']=[100,100,100]
        with self.assertRaisesRegex(ValueError,'ineffective cut'):build(data)

    def test_hollow_offset_and_rejections(self):
        data=spec([dict(id='base', operation='base', kind='box', originMm=[10,20,30], sizeMm=[20,30,40])])
        data.update(construction='hollow', hollowing=dict(thicknessMm=2, opening=dict(axis='Z',side='max'), cavityProbeMm=[20,35,50]))
        model, checks=build(data)
        self.assertAlmostEqual(model.volume,20*30*40-16*26*38,places=4)
        self.assertFalse(model.is_inside((20,35,69)))  # opening, not a sealed inner void
        self.assertTrue(model.is_inside((20,35,31)))  # bottom retained
        self.assertTrue(model.is_inside((11,35,50)))  # wall retained
        self.assertFalse(model.is_inside((13,35,50)))
        self.assertTrue(checks[-1]['cavityProbeEmpty'])
        for patch in ({'thicknessMm':0}, {'thicknessMm':11}, {'thicknessMm':float('nan')}, {'cavityProbeMm':[100,100,100]}, {'opening':{'axis':'Q','side':'max'}}):
            invalid=copy.deepcopy(data);invalid['hollowing'].update(patch)
            with self.assertRaises(ValueError):build(invalid)
        sphere=copy.deepcopy(data);sphere['features']=[dict(id='ball',operation='base',kind='sphere',centerMm=[20,35,50],radiusMm=10)]
        with self.assertRaisesRegex(ValueError,'planar face'):build(sphere)
        # A different input, curved wall and off-origin position use the same operation.
        oval=copy.deepcopy(data);oval['features']=[dict(id='oval',operation='base',kind='loft',ruled=False,sections=[
            dict(kind='ellipse',plane='XY',originMm=[20,35,z],radiusUMm=10,radiusVMm=15) for z in (30,70)])]
        curved,_=build(oval)
        self.assertTrue(curved.is_valid)
        self.assertFalse(curved.is_inside((20,35,69)))
        self.assertTrue(curved.is_inside((20,35,31)))

    def test_exterior_identity_excludes_hollow_inner_faces_and_rim(self):
        import json
        from build123d import export_gltf
        from feature_surface import classify
        data=spec([dict(id='body',operation='base',kind='box',originMm=[10,20,30],sizeMm=[20,30,40])])
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/'shape.json';mesh=Path(tmp)/'model.glb'
            for hollow in (False,True):
                if hollow:data.update(construction='hollow',hollowing=dict(thicknessMm=2,opening=dict(axis='Z',side='max'),cavityProbeMm=[20,35,50]))
                source.write_text(json.dumps(data));model,_=build(data)
                export_gltf(model,mesh,binary=True)
                result=classify(source,mesh)
                self.assertEqual(sum(result['primitiveExterior']),5 if hollow else 6)
                self.assertEqual(result['primitiveExterior'].count(False),6 if hollow else 0)

    def test_imported_step_bounds_hash_and_solid_count(self):
        import hashlib,json
        from build123d import Box,Compound,export_step
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);source=root/'original.step'
            box=Box(20,30,40);export_step(box,source)
            feature=dict(id='import',kind='step',operation='base',source=source.name,sha256=hashlib.sha256(source.read_bytes()).hexdigest(),modelIntent='solid',expectedBoundsMm={'min':[-10,-15,-20],'max':[10,15,20]})
            data=spec([feature]);data['construction']='imported'
            model,_=build(data,root);self.assertAlmostEqual(model.volume,24000,places=4)
            bad=copy.deepcopy(data);bad['features'][0]['expectedBoundsMm']['max'][0]=11
            with self.assertRaisesRegex(ValueError,'bounds'):build(bad,root)
            bad=copy.deepcopy(data);bad['features'][0].update(modelIntent='hollow',cavityProbeMm=[0,0,0])
            with self.assertRaisesRegex(ValueError,'probe'):build(bad,root)
            source.write_bytes(source.read_bytes()+b'\n')
            with self.assertRaisesRegex(ValueError,'hash'):build(data,root)
            hollow=box.cut(Box(16,26,40).translate((0,0,2)))
            export_step(hollow,source)
            feature.update(sha256=hashlib.sha256(source.read_bytes()).hexdigest(),modelIntent='hollow',cavityProbeMm=[0,0,0])
            restored,_=build(data,root)
            self.assertAlmostEqual(restored.volume,hollow.volume,places=4)
            self.assertFalse(restored.is_inside((0,0,19)))
            export_step(Compound(children=[box,box.translate((30,0,0))]),source)
            feature['sha256']=hashlib.sha256(source.read_bytes()).hexdigest()
            with self.assertRaisesRegex(ValueError,'one connected'):build(data,root)
            bad=copy.deepcopy(data);bad['features'][0]['source']='../original.step'
            with self.assertRaisesRegex(ValueError,'adjacent'):build(bad,root)

    def test_nonrotational_loft_and_union(self):
        data=spec([dict(id='base',operation='base',kind='box',originMm=[-10,-10,0],sizeMm=[20,20,10]),
          dict(id='leaning-neck',operation='union',kind='loft',ruled=True,sections=[
            dict(kind='ellipse',plane='XY',originMm=[0,0,8],radiusUMm=5,radiusVMm=3),
            dict(kind='ellipse',plane='XY',originMm=[4,0,25],radiusUMm=5,radiusVMm=3)])])
        model,checks=build(data)
        self.assertEqual(len(model.solids()),1)
        self.assertAlmostEqual(model.bounding_box().max.Z,25,places=5)
        self.assertGreater(model.volume,4000)
        detached=copy.deepcopy(data);detached['features'][1]['sections'][0]['originMm'][2]=15
        with self.assertRaisesRegex(ValueError,'connected'):build(detached)

    def test_revolved_closed_section(self):
        data=spec([dict(id='plinth',operation='base',kind='revolve',profileRzMm=[[0,0],[5,0],[5,10],[0,10]])])
        model,_=build(data)
        self.assertAlmostEqual(model.volume,math.pi*250,places=5)
        self.assertTrue(model.is_inside((0,0,5)))
        data['features'][0]['profileRzMm'][0][0]=float('nan')
        with self.assertRaisesRegex(ValueError,'finite'):build(data)


if __name__=='__main__':unittest.main()
