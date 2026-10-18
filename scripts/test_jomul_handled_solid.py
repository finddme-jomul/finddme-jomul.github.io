#!/usr/bin/env python3
"""Physical failure cases for the reviewed handled-vessel solid path."""
import copy
import json
import unittest
from pathlib import Path

from jomul_handled_solid import make_solid

FIX = Path(__file__).resolve().parents[1] / 'docs/artifacts/cad-style/fixtures/handled-vessel-synthetic'


class HandledSolid(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.profile = json.loads((FIX / 'profile.json').read_text())
        cls.dims = json.loads((FIX / 'dimensions.json').read_text())['valuesMm']
        cls.handle = json.loads((FIX / 'handle.json').read_text())

    def test_one_joint_solid_with_open_cavity(self):
        solid, report = make_solid(self.profile, self.dims, self.handle)
        self.assertTrue(solid.is_valid)
        self.assertEqual(report['joinedSolidCount'], 1)
        self.assertGreater(report['upperJointOverlapMm3'], 0)
        self.assertGreater(report['lowerJointOverlapMm3'], 0)
        self.assertEqual(report['innerCavityIntrusionMm3'], 0)

    def test_photo_based_oval_handle_is_one_smooth_joined_solid(self):
        candidate = FIX.parents[2] / 'mug-validation/review-candidate'
        profile = json.loads((candidate / 'outer-profile.json').read_text())
        dims = json.loads((candidate / 'dimensions.json').read_text())['valuesMm']
        handle = json.loads((candidate / 'handle.json').read_text())
        self.assertEqual(handle['kind'], 'centerline-oval-section')
        self.assertEqual(handle['confirmedAttachmentCentersMm'], {'upperZ': 110, 'lowerZ': 32})
        solid, report = make_solid(profile, dims, handle)
        self.assertTrue(solid.is_valid)
        self.assertEqual(report['joinedSolidCount'], 1)
        self.assertGreater(report['upperJointOverlapMm3'], 0)
        self.assertGreater(report['lowerJointOverlapMm3'], 0)
        self.assertEqual(report['innerCavityIntrusionMm3'], 0)
        self.assertLess(abs(solid.bounding_box().size.X - 125), 1)

    def test_surface_only_contact_is_not_a_joint(self):
        candidate = FIX.parents[2] / 'mug-validation/review-candidate'
        profile = json.loads((candidate / 'outer-profile.json').read_text())
        dims = json.loads((candidate / 'dimensions.json').read_text())['valuesMm']
        handle = json.loads((candidate / 'handle.json').read_text())
        handle['centerlineMm'][0][0] = 45
        handle['centerlineMm'][-1][0] = 45
        with self.assertRaisesRegex(ValueError, 'both upper and lower handle attachments'):
            make_solid(profile, dims, handle)

    def test_foot_source_mismatch(self):
        dims = dict(self.dims, footDiameter=60)
        with self.assertRaisesRegex(ValueError, 'foot'):
            make_solid(self.profile, dims, self.handle)


if __name__ == '__main__':
    unittest.main()
