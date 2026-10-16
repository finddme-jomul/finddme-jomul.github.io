"""Check coverage failures and a behavior regression independently of runtime locks."""
import copy
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
K=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(K/'scripts'))
from decision_checks import validate, decision_results, SUITES
from browser_environment import node_command

class DecisionChecks(unittest.TestCase):
    def test_missing_mapping_and_failed_suite_cannot_pass(self):
        selection=json.loads((K/'selection.json').read_text())
        validate(selection)
        bad=copy.deepcopy(selection);bad['decisions'][0].pop('verification')
        with self.assertRaises(ValueError):validate(bad)
        results={name:{'status':'passed'} for name in SUITES}
        results['axis']['status']='failed'
        rows={row['id']:row for row in decision_results(selection,results)}
        self.assertEqual('failed',rows['axis-motion']['status'])
        self.assertEqual('not-run',rows['photo-handoff']['status'])

    def test_body_rotation_regression_fails_behavior_check(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);(root/'tests').mkdir();(root/'assets/motion').mkdir(parents=True)
            shutil.copy2(K/'tests/test-axis-motion.mjs',root/'tests/test-axis-motion.mjs')
            source=(K/'assets/motion/axis-motion.mjs').read_text()
            self.assertIn('spin.rotation.y=pose.bodyY;',source)
            (root/'assets/motion/axis-motion.mjs').write_text(source.replace('spin.rotation.y=pose.bodyY;','spin.rotation.y=0;'))
            result=subprocess.run(node_command(root/'tests/test-axis-motion.mjs', workspace=root),capture_output=True,text=True)
            self.assertNotEqual(0,result.returncode,'Frozen body spin must fail even without a hash gate')
            self.assertIn('AssertionError',result.stderr)

if __name__=='__main__':unittest.main()
