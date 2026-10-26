import sys,json,tempfile,unittest
from pathlib import Path
import xml.etree.ElementTree as ET
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from drawing_presentation import reading_page
from drawing_camera import validate_camera
from dimensional_kit import callout,detail_ref
from drawing_annotations import validate

class Presentation(unittest.TestCase):
    def test_direction_and_provenance(self):
        for markup in [callout(30,30,10,10,'HD'),detail_ref(30,30,5,'A',10,10)]:
            t=ET.fromstring('<svg>'+markup+'</svg>').find('text')
            self.assertEqual(t.get('text-anchor'),'end');self.assertLess(float(t.get('x')),10)
        self.assertIn('text-anchor="start"',callout(10,10,30,30,'HD'))
        validate({'leaderSides':{'A':'left','B':'right','handle':'left'}})
        with self.assertRaises(ValueError):validate({'leaderSides':{'A':'top'}})
        page=reading_page({'status':'reviewed-provisional','sourceProject':'some/project'},[{'id':'mug','sourceStepSha256':'a'*64}],'<review>')
        self.assertIn('&lt;review&gt;',page);self.assertIn('a'*64,page)
        self.assertNotIn('<review>',page);self.assertIn('aria-controls="sheet-mug"',page)

    def test_camera_references_time_and_endpoint(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            for layout in ('desktop','mobile'):
                (root/f'mug-{layout}.svg').write_text('<svg><g data-view="front"/><g data-detail="A"/></svg>')
            keys=[{'at':0,'target':'view:front','zoom':1.5},{'at':.5,'target':'detail:A','zoom':2},{'at':1,'target':'sheet','zoom':1}]
            data={'schemaVersion':1,'parts':{'mug':keys}}
            self.assertEqual(validate_camera(data,root,['mug']),data['parts'])
            for field,value in [('at',0),('at',float('nan')),('zoom',9),('target','detail:B')]:
                bad=json.loads(json.dumps(data));bad['parts']['mug'][1][field]=value
                with self.assertRaises(ValueError):validate_camera(bad,root,['mug'])
            bad=json.loads(json.dumps(data));bad['parts']['mug'][-1]['zoom']=2
            with self.assertRaises(ValueError):validate_camera(bad,root,['mug'])
            (root/'mug-mobile.svg').write_text('<svg/>')
            with self.assertRaisesRegex(ValueError,'mobile'):validate_camera(data,root,['mug'])
if __name__=='__main__':unittest.main()
