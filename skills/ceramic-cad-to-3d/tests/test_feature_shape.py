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
            with self.assertRaisesRegex(ValueError,'solid construction'):build({**data,**update})
        data['features'][-1]['centerMm']=[100,100,100]
        with self.assertRaisesRegex(ValueError,'ineffective cut'):build(data)

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
