import json,sys,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from build123d import Solid,export_step
import drawing_review as drawing
import dimensional_page as bridge

class PageBinding(unittest.TestCase):
 def test_sources_dependency_tracking_front_and_stale_rejection(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);project=root/'source';(project/'input').mkdir(parents=True)
   for count in (1,2):
    ids=['one','two'][:count]
    (project/'input/config.json').write_text(json.dumps({'parts':[{'id':pid,'shapeKind':'feature-solid'} for pid in ids]}))
    for i,pid in enumerate(ids):
     folder=project/'geometry'/pid;folder.mkdir(parents=True,exist_ok=True)
     export_step(Solid.make_cylinder(10+i,20+i),folder/'model.step')
    input_file=root/'input.json';input_file.write_text(json.dumps({'schemaVersion':1,'status':'reviewed-provisional','sourceProject':str(project),'parts':[{'id':pid} for pid in ids]}))
    source=root/f'drawing{count}';drawing.build(input_file,source)
    review={'dimensionalDrawing':{'directory':str(source)},'motion':{'timing':{'frontMoveStart':.1,'sheetFadeStart':.1}}}
    prepared={'mode':'multiple' if count>1 else 'feature','inputsSha256':{}}
    with patch.object(bridge,'ROOT',root):
     binding=bridge.prepare(project,prepared,review)
     self.assertEqual(len(binding['plan']['parts']),count)
     self.assertIn(str((source/'drawing-manifest.json').relative_to(root)),prepared['inputsSha256'])
     target=root/f'front{count}.svg';bridge.extract_front(source/'one-desktop.svg',target)
     self.assertIn('data-geometry',target.read_text());self.assertNotIn('>W<',target.read_text())
     bad=json.loads(json.dumps(review));bad['dimensionalDrawing']['extraScrollVh']=float('nan')
     with self.assertRaises(ValueError):bridge.prepare(project,prepared,bad)
     if count==2:
      prepared['parts']=[{'id':'copy-a','sourcePartId':'one'},{'id':'copy-b','sourcePartId':'one'},{'id':'copy-c','sourcePartId':'two'}]
      binding=bridge.prepare(project,prepared,review)
      stage=root/'stage';(stage/'assets').mkdir(parents=True)
      config={'parts':[{'id':'copy-a','sourcePartId':'one','geometryAssetId':'copy-a'},{'id':'copy-b','sourcePartId':'one','geometryAssetId':'copy-a'},{'id':'copy-c','sourcePartId':'two','geometryAssetId':'copy-c'}]}
      for pid in ('copy-a','copy-c'):(stage/'assets'/pid).mkdir()
      (stage/'assets/project.json').write_text(json.dumps(config))
      (stage/'index.html').write_text('<head></head><div class="stage"></div>')
      bridge.install(binding,prepared,stage)
      installed=json.loads((stage/'assets/project.json').read_text())
      boxes=installed['sheets']['desktop']['frontBoxes']
      self.assertEqual(set(boxes),{'copy-a','copy-b','copy-c'})
      self.assertEqual(boxes['copy-a'],boxes['copy-b'])
      self.assertNotEqual(boxes['copy-a'],boxes['copy-c'])
      self.assertTrue((stage/'assets/copy-a/front-view.svg').is_file())
      prepared['parts'].append({'id':'bad','sourcePartId':'missing'})
      with self.assertRaisesRegex(ValueError,'cover every'):bridge.prepare(project,prepared,review)
      prepared.pop('parts')
     (project/'geometry/one/model.step').write_text('modified')
     with self.assertRaisesRegex(ValueError,'stale'):bridge.prepare(project,prepared,review)
if __name__=='__main__':unittest.main()
