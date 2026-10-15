"""Failure/retry scheduling tests with an explicitly mocked browser boundary."""
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import project
import motion

class MotionScheduling(unittest.TestCase):
    def test_failure_retry_and_no_redundant_build(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); workspace=root/'01-test'; workspace.mkdir()
            (workspace/'cad').mkdir(); (workspace/'cad/manifest.json').write_text('{}')
            (workspace/'input').mkdir()
            state={'schemaVersion':1,'projectId':'01-test','status':'cad-ready',
                   'cad':{'filesSha256':project.tree_hashes(workspace/'cad'),
                          'inputSha256':{}},'reviewedMotionInput':{'test':'reviewed'}}
            def fake_build(source, out, data):
                out.mkdir(); (out/'index.html').write_text('synthetic new output')
                (out/'motion-preview-manifest.json').write_text('{}')
            with patch.object(project,'ROOT',root), patch.object(project,'SNAP',root/'snapshots'), patch.object(project,'WORK',root), \
                 patch.object(project,'verify'), patch.object(motion,'motion_input'), \
                 patch.object(motion,'build',side_effect=fake_build) as build, \
                 patch.object(motion,'browser_check',side_effect=RuntimeError('synthetic browser failure')) as gate:
                project.save(workspace/'pipeline-state.json',state)
                with self.assertRaisesRegex(RuntimeError,'synthetic browser failure'):
                    project.resume_motion(workspace,state)
                saved=json.loads((workspace/'pipeline-state.json').read_text())
                self.assertEqual('cad-ready',saved['status'])
                self.assertEqual('failed',saved['motionJob']['status'])
                self.assertEqual({'test':'reviewed'},saved['reviewedMotionInput'])
                self.assertNotIn('motionPreview',saved)
                self.assertFalse((workspace/'motion-preview').exists())
                self.assertFalse((workspace/'motion-preview.building').exists())
                with patch.object(sys, 'argv', ['project.py', 'verify', '01-test']):
                    with self.assertRaisesRegex(ValueError, 'Motion browser gate is incomplete'):
                        project.main()
                gate.side_effect=None
                project.resume_motion(workspace,state)
                self.assertEqual('complete',state['motionJob']['status'])
                self.assertTrue((workspace/'motion-preview/index.html').exists())
                self.assertEqual(2,build.call_count)
                project.resume_motion(workspace,state)
                self.assertEqual(2,build.call_count)
                # An explicit replacement failure leaves the previous output usable,
                # but reports the requested new job as failed, never complete.
                gate.side_effect=RuntimeError('replacement failure')
                with self.assertRaises(RuntimeError):
                    project.build_motion(workspace,state,{'test':'new reviewed'})
                self.assertEqual('synthetic new output',(workspace/'motion-preview/index.html').read_text())
                self.assertEqual('failed',state['motionJob']['status'])

if __name__ == '__main__': unittest.main()
