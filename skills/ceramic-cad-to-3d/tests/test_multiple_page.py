import copy
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from multiple_page import validate, verify_layers

class MultipleReview(unittest.TestCase):
    def setUp(self):
        self.review=json.loads((Path(__file__).parent/'fixtures/multiple/scene.json').read_text())
        self.review['photos']='photos.json'
        self.ids=['rice-bowl','soup-bowl']

    def test_reviewed_order_layers_axes_and_empty_photos(self):
        with patch('multiple_page.load_photos',return_value=[]):
            validate(self.review,self.ids)
            for edit in ('order','axis','position','colour','nonfinite','turn'):
                r=copy.deepcopy(self.review)
                if edit=='order':r['parts'].reverse()
                if edit=='axis':r['parts'][0]['motion']['axisTiltDegrees']=91
                if edit=='position':r['parts'][0]['motion']['finalXMobile']=2
                if edit=='colour':r['parts'][0]['glazePreview']['baseWarmHex']='red'
                if edit=='nonfinite':r['parts'][0]['accentCenterAngle']=float('inf')
                if edit=='turn':r['motion']['glaze']['axisPrecessionTurns']=0
                with self.subTest(edit=edit),self.assertRaises(ValueError):validate(r,self.ids)

    def test_cad_coating_evidence_cannot_be_dropped_or_reordered(self):
        material=json.loads((Path(__file__).parent/'fixtures/multiple/rice-bowl-material.json').read_text())
        part=self.review['parts'][0]
        verify_layers(material,part,'rice-bowl')
        changed=copy.deepcopy(part);changed['accentEnabled']=False
        with self.assertRaises(ValueError):verify_layers(material,changed,'rice-bowl')
        changed=copy.deepcopy(part);g=changed['glazePreview'];g['baseName'],g['accentName']=g['accentName'],g['baseName']
        with self.assertRaises(ValueError):verify_layers(material,changed,'rice-bowl')

if __name__=='__main__':unittest.main()
