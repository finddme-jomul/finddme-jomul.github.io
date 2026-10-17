import copy
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import page_review
from selected_sheet import sheet_layout

class NewReview(unittest.TestCase):
    def setUp(self):
        fixtures=Path(__file__).parent/'fixtures/single'
        self.profile=json.loads((fixtures/'moon-jar-profile.json').read_text())
        self.dims=json.loads((fixtures/'moon-jar-dimensions.json').read_text())['targetFiredMm']
        self.material=json.loads((fixtures/'moon-jar-material.json').read_text())
        self.review={'schemaVersion':1,'status':'reviewed-provisional','provenance':'synthetic check',
                     'motion':{'tiltDirection':'left','tiltDegrees':11,'storyHeightVh':900},
                     'surface':{'floorPolicy':'exact','roughness':.5,'clearcoat':.1},'photos':'photos.json'}

    def test_explicit_inputs_and_forbidden_surface_override(self):
        with patch.object(page_review,'load_photos',return_value=[{'role':'process'}]):
            page_review.validate(self.review,self.profile,self.dims,self.material)
            with self.assertRaises(ValueError):
                page_review.validate(self.review,self.profile,{**self.dims,'maxDiameter':self.dims['height']*1.1},self.material)
            for field,value in [('roughness',float('nan')),('clearcoat',2),('floorPolicy','selected-visual-sampled'),('imageId','unreviewed')]:
                r=copy.deepcopy(self.review);r['surface'][field]=value
                with self.assertRaises(ValueError):page_review.validate(r,self.profile,self.dims,self.material)
            r=copy.deepcopy(self.review);r['provenance']=''
            with self.assertRaises(ValueError):page_review.validate(r,self.profile,self.dims,self.material)
        with patch.object(page_review,'load_photos',return_value=[]),self.assertRaises(ValueError):
            page_review.validate(self.review,self.profile,self.dims,self.material)

    def test_adaptive_sheet_preserves_reference_and_fits_new_dimensions(self):
        self.assertEqual(sheet_layout(self.dims,True),sheet_layout(self.dims,False))
        for h,d in [(165,154),(80,120),(240,120)]:
            cx,base,scale=sheet_layout({'height':h,'maxDiameter':d},True)
            self.assertLessEqual(h*scale,510.00001);self.assertLessEqual(d*scale,476.00001)
            self.assertAlmostEqual(base+h*scale/2,412)

if __name__=='__main__':unittest.main()
