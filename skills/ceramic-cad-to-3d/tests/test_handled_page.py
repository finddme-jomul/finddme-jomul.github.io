import copy
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from handled_page import validate

class HandledReview(unittest.TestCase):
    def test_explicit_material_and_motion_evidence(self):
        material={'clay':{'name':'잡토'},'glaze':{'name':'하늘보리 유약'}}
        review={'schemaVersion':1,'status':'reviewed-provisional','provenance':'test only',
                'motion':{'schemaVersion':1,'status':'reviewed-provisional','provenance':'review','tiltDirection':'right','tiltDegrees':14,'bodySpinDegrees':390,'axisPrecessionDegrees':360,'storyHeightVh':900},
                'surface':{'clayName':'잡토','glazeName':'하늘보리 유약','clayHex':'#d7d2ca','glazeHex':'#b9d5d9','roughness':.33,'clearcoat':.08,'provenance':'provisional colour'},'photos':'photos.json'}
        with patch('handled_page.load_photos',return_value=[]):
            validate(review,material)
            for field,value in [('glazeName','wrong'),('glazeHex','red'),('roughness',float('nan')),('clearcoat',True),('provenance','')]:
                changed=copy.deepcopy(review);changed['surface'][field]=value
                with self.subTest(field=field),self.assertRaises(ValueError):validate(changed,material)
            changed=copy.deepcopy(review);changed['motion']['axisPrecessionDegrees']=180
            with self.assertRaises(ValueError):validate(changed,material)
            changed=copy.deepcopy(material);changed['glazeLayers']=[{},{}]
            with self.assertRaises(ValueError):validate(review,changed)

if __name__=='__main__':unittest.main()
