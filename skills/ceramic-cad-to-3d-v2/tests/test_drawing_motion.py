"""Exercise shared drawing-to-motion packaging with different CAD part counts."""
import json
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from build123d import Solid,export_step
import drawing_review as drawing
import drawing_motion as motion

class DrawingMotion(unittest.TestCase):
    def test_shared_path_preserves_sources_and_rejects_changes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);project=root/'project';(project/'input').mkdir(parents=True)
            ids=['cup','base']
            (project/'input/config.json').write_text(json.dumps({'parts':[{'id':p,'shapeKind':'feature-solid'} for p in ids]}))
            for i,pid in enumerate(ids):
                folder=project/'geometry'/pid;folder.mkdir(parents=True)
                export_step(Solid.make_cylinder(10+i*5,20+i*10),folder/'model.step')
            for count in (1,2):
                review=root/f'review-{count}.json'
                review.write_text(json.dumps({'schemaVersion':1,'status':'reviewed-provisional','sourceProject':str(project),'parts':[{'id':p} for p in ids[:count]]}))
                source=root/f'drawing-{count}';drawing.build(review,source)
                before={p.name:drawing.sha(p) for p in source.iterdir() if p.is_file()}
                output=root/f'motion-{count}';motion.build(source,output)
                record=motion.verify(output)
                self.assertEqual(record['sourceDrawingManifestSha256'],drawing.sha(source/'drawing-manifest.json'))
                config=json.loads((output/'motion.json').read_text())
                self.assertEqual([p['id'] for p in config['parts']],ids[:count])
                for part in config['parts']:
                    for layout in ('desktop','mobile'):
                        self.assertEqual((output/part[layout]).read_bytes(),(source/part[layout]).read_bytes())
                self.assertEqual(before,{p.name:drawing.sha(p) for p in source.iterdir() if p.is_file()})
                with self.assertRaisesRegex(ValueError,'unused'):motion.build(source,output)
                for duration in (0,16,float('nan')):
                    with self.assertRaisesRegex(ValueError,'Duration'):motion.build(source,root/'invalid',duration)
                (output/'player.mjs').write_text('changed')
                with self.assertRaisesRegex(ValueError,'changed'):motion.verify(output)
                (source/f'{ids[0]}-desktop.svg').write_text('changed')
                with self.assertRaisesRegex(ValueError,'changed'):motion.build(source,root/'tampered')
                self.assertFalse((root/'tampered').exists())

if __name__=='__main__':unittest.main()
