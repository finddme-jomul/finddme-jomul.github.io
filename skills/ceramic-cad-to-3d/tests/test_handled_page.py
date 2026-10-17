import copy
import json
import math
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from handled_page import validate

class HandledReview(unittest.TestCase):
    def test_body_wire_has_dense_cad_rings_and_full_meridians(self):
        from prepare_handled import body_wire_lines
        density=json.loads((Path(__file__).resolve().parents[1]/'assets/accepted-profile.json').read_text())['wire3d']
        profile=[(30+i, i*5) for i in range(10)]
        lines=body_wire_lines(profile,density)
        rings=[p for p,closed in lines if closed];meridians=[p for p,closed in lines if not closed]
        self.assertEqual([p[0][2] for p in rings],[0,20,40,45])
        self.assertEqual(len(meridians),12)
        self.assertEqual(len({round(math.atan2(p[0][1],p[0][0]),8) for p in meridians}),12)
        for p in rings:self.assertEqual(len(p),72)
        for p in meridians:
            self.assertEqual(len(p),len(profile))
            for (x,y,z),(radius,height) in zip(p,profile):
                self.assertAlmostEqual(math.hypot(x,y),radius);self.assertEqual(z,height)

    def test_explicit_material_and_motion_evidence(self):
        material={'clay':{'name':'잡토'},'glaze':{'name':'하늘보리 유약'}}
        review={'schemaVersion':1,'status':'reviewed-provisional','provenance':'test only',
                'motion':{'schemaVersion':1,'status':'reviewed-provisional','provenance':'review','tiltDirection':'right','tiltDegrees':14,'bodySpinDegrees':390,'axisPrecessionDegrees':360,'storyHeightVh':900},
                'surface':{'clayName':'잡토','glazeName':'하늘보리 유약','clayHex':'#d7d2ca','glazeHex':'#b9d5d9','roughness':.33,'clearcoat':.08,'provenance':'provisional colour'},'photos':'photos.json'}
        with patch('handled_page.load_photos',return_value=[]):
            validate(review,material)
            elevated=copy.deepcopy(review);elevated['motion']['surfaceElevationDegrees']=22
            validate(elevated,material)
            for value in (-1,36,True,float('nan')):
                elevated['motion']['surfaceElevationDegrees']=value
                with self.assertRaises(ValueError):validate(elevated,material)
            for field,value in [('glazeName','wrong'),('glazeHex','red'),('roughness',float('nan')),('clearcoat',True),('provenance','')]:
                changed=copy.deepcopy(review);changed['surface'][field]=value
                with self.subTest(field=field),self.assertRaises(ValueError):validate(changed,material)
            changed=copy.deepcopy(review);changed['motion']['axisPrecessionDegrees']=180
            with self.assertRaises(ValueError):validate(changed,material)
            changed=copy.deepcopy(material);changed['glazeLayers']=[{},{}]
            with self.assertRaises(ValueError):validate(review,changed)

class FeatureReview(unittest.TestCase):
    def test_feature_dispatch_guards_and_complete_geometry_dependency(self):
        import tempfile
        import feature_page
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);project=root/'project';(project/'input').mkdir(parents=True);(project/'geometry').mkdir()
            material={'clay':{'name':'Test clay'},'glaze':{'name':'Test glaze'}}
            (project/'input/material.json').write_text(json.dumps(material))
            (project/'input/shape.json').write_text('{}');(project/'pipeline-state.json').write_text('{}')
            (project/'geometry/wire-guide.json').write_text('{}');(project/'geometry/model.glb').write_bytes(b'fixture')
            (root/'photos.json').write_text('[]')
            part={'id':'form','shapeKind':'feature-solid','material':'project/input/material.json','shape':'project/input/shape.json'}
            config={'compositionMode':'single','name':'Test','parts':[part]}
            path=project/'input/config.json';path.write_text(json.dumps(config))
            review={'motion':{'partId':'form'},'photos':'photos.json'}
            with patch.object(feature_page,'ROOT',root),patch('project.verify'),patch('feature_page.validate') as validate:
                prepared=feature_page.prepare(project,review)
                validate.assert_called_once_with(review,material)
                self.assertEqual('feature',prepared['mode'])
                self.assertIn('project/geometry/wire-guide.json',prepared['inputsSha256'])
                self.assertIn('project/geometry/model.glb',prepared['inputsSha256'])
                changed=copy.deepcopy(review);changed['motion']['partId']='wrong'
                with self.assertRaisesRegex(ValueError,'partId'):feature_page.prepare(project,changed)
                config['compositionMode']='multiple';config['parts'].append({**part,'id':'second'})
                path.write_text(json.dumps(config))
                with self.assertRaisesRegex(ValueError,'feature-solids renderer'):feature_page.prepare(project,review)

if __name__=='__main__':unittest.main()
