import sys, unittest,copy
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from feature_instances import expand,alias_sheet,material_variant
from layered_review import coatings
class Instances(unittest.TestCase):
 def fixture(self):
  c={'parts':[{'id':'pawn','shape':'same.json'}]};r={'parts':[{'id':'pawn','motion':{'turns':1},'glazePreview':{'baseName':'clear'}}],'assembly':{'steps':[]},'instances':[{'id':f'pawn-{i}','sourcePartId':'pawn','appearance':{'motion':{'finalXDesktop':i/100},'materialVariant':'brown'}} for i in range(32)]};return c,r
 def test_identity_and_independence(self):
  c,r=self.fixture();before=copy.deepcopy(r);cc,rr=expand(c,r);self.assertEqual(r,before);self.assertEqual(len(cc['parts']),32);self.assertEqual({p['shape'] for p in cc['parts']},{'same.json'});rr['parts'][0]['motion']['turns']=2;self.assertEqual(rr['parts'][1]['motion']['turns'],1)
  m=alias_sheet({'layouts':{'desktop':{'frontBoxes':{'pawn':{'cx':.5}}}}},cc['parts']);self.assertEqual(len(m['layouts']['desktop']['frontBoxes']),32)
 def test_invalid_sources_ids_and_overrides(self):
  for update in [{'id':'pawn-1'},{'sourcePartId':'missing'},{'appearance':{'shape':'other.json'}}]:
   c,r=self.fixture();r['instances'][0].update(update)
   with self.assertRaises(ValueError):expand(c,r)
 def test_geometry_bundle_shared_but_material_evidence_is_per_instance(self):
  import tempfile,json
  from unittest.mock import patch
  from feature_multiple import install_part
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);a=root/'first';b=root/'second';a.mkdir();b.mkdir();step=root/'source.step';step.write_bytes(b'source')
   def prepare(source,out,data):
    for name in ['model.glb','front-view.svg','wire-guide.json','review-input.json']:(out/name).write_text('{}')
   part={'id':'first','sourcePartId':'pawn','appearance':{'id':'first','coatings':{'layers':[{'region':{'surface':'all'}}],'fired':{'region':{'surface':'all'}}}},'materialEvidence':{'name':'white'},'step':step,'dimensionsMm':{'height':30},'boundsMm':{}}
   with patch('prepare_feature_motion.prepare',side_effect=prepare) as build:
    first=install_part(root,part,a,a);other=copy.deepcopy(part);other['id']='second';other['appearance']['id']='second';other['materialEvidence']={'name':'brown'};second=install_part(root,other,b,a)
   self.assertEqual(1,build.call_count);self.assertEqual(first['geometryAssetId'],second['geometryAssetId']);self.assertFalse((b/'model.glb').exists());self.assertEqual('brown',json.loads((b/'material-evidence.json').read_text())['name']);self.assertEqual('white',json.loads((a/'material-evidence.json').read_text())['name'])

 def test_material_evidence(self):
  m={'provenance':'review','variants':{'brown':{'glazeLayers':[{'name':'brown'}]}}};self.assertEqual(material_variant(m,{'materialVariant':'brown'}),m['variants']['brown'])
  with self.assertRaises(ValueError):material_variant(m,{'materialVariant':'missing'})
 def test_one_coat_only_on_feature_all_surface(self):
  spec={'status':'reviewed-provisional','provenance':'review','layers':[{'name':'clear','region':{'surface':'all'},'previewHex':'#dddddd'}],'fired':{'region':{'surface':'all'},'baseHex':'#eeeeee','regionHex':'#eeeeee'},'roughness':.5};e=[{'name':'clear','application':'full-coat'}]
  coatings(spec,e,{'height':50,'bounds':{'minZ':0,'maxZ':50}})
  with self.assertRaises(ValueError):coatings(spec,e,{'height':50})
if __name__=='__main__':unittest.main()
