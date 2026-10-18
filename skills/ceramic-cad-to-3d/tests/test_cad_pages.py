import json,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from cad_pages import validate,install
class CadPages(unittest.TestCase):
 def presentation(self):return {'clickToZoom':True,'groups':[{'id':'first','title':'First','partIds':['a']},{'id':'second','title':'Second','partIds':['b','c','d']},{'id':'third','title':'Third','partIds':['e','f','g']}]}
 def test_scroll_extension_validation(self):
  for value in [-1,501,float('nan'),float('inf'),True,'80']:
   p=self.presentation();p['groups'][1]['extraScrollVh']=value
   with self.assertRaises(ValueError):validate(p,list('abcdefg'))
  p=self.presentation();p['groups'][1]['extraScrollVh']=80;validate(p,list('abcdefg'))
 def test_partition_rejects_duplicates_missing_and_unknown(self):
  p=self.presentation();validate(p,list('abcdefg'))
  for ids in [['a','b'],['x'],[]]:
   p=self.presentation();p['groups'][0]['partIds']=ids
   with self.assertRaises(ValueError):validate(p,list('abcdefg'))
 def test_pages_preserve_views_and_alias_source_fronts(self):
  import xml.etree.ElementTree as ET
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);geometry=root/'geometry';geometry.mkdir();stage=root/'page';(stage/'assets').mkdir(parents=True)
   manifest={'parts':[{'id':s} for s in 'abcdefg'],'layouts':{'desktop':{'file':'sheet.svg','frontBoxes':{s:{'cx':.5,'cy':.5,'width':.1,'height':.1,'sourceStepSha256':s} for s in 'abcdefg'}}}}
   (geometry/'drawing-manifest.json').write_text(json.dumps(manifest))
   groups=[]
   for s in 'abcdefg':
    (geometry/s).mkdir();(geometry/s/'manifest.json').write_text(json.dumps({'boundsMm':{'min':[0,0,0],'max':[10,10,20]}}))
    groups.append('<g data-part="'+s+'">'+''.join('<g data-view="'+v+'"><polyline points="0,0 10,0 10,20 0,20"/></g>' for v in ['front','plan','side','section','isometric','wire'])+'</g>')
   (geometry/'sheet.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg">'+''.join(groups)+'</svg>')
   parts=[{'id':s,'sourcePartId':s} for s in 'abcdefg']+[{'id':'repeat','sourcePartId':'b'}]
   output=install(root,stage,self.presentation(),parts)
   self.assertEqual(len(output['pages']),3)
   for page in output['pages']:
    self.assertGreater(page['pagePx'][0],page['pagePx'][1]);svg=ET.parse(stage/'assets'/page['file']).getroot()
    self.assertEqual([g.get('data-part') for g in svg if g.get('data-part')],page['partIds'])
    self.assertEqual(len(svg.findall('.//*[@data-view]')),6*len(page['partIds']))
    for box in page['frontBoxes'].values():self.assertTrue(0<box['width']<1 and 0<box['height']<1 and box['width']/2<=box['cx']<=1-box['width']/2)
   self.assertEqual(output['pages'][1]['frontBoxes']['b'],output['pages'][1]['frontBoxes']['repeat'])
if __name__=='__main__':unittest.main()
