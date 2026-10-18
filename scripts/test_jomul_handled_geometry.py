#!/usr/bin/env python3
"""Meaningful physical checks for the provisional handle input contract."""
import copy
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIX = ROOT / 'docs/artifacts/cad-style/fixtures/handled-vessel-synthetic'
sys.path.insert(0, str(ROOT / 'docs/artifacts/cad-style'))
from handled_geometry import validate_handle, sampled_centerline


class HandleContract(unittest.TestCase):
    def setUp(self):
        self.data = json.loads((FIX / 'handle.json').read_text())
        self.profile = json.loads((FIX / 'profile.json').read_text())
        self.dims = json.loads((FIX / 'dimensions.json').read_text())['valuesMm']

    def test_valid_centerline(self):
        self.assertEqual(validate_handle(self.data, self.profile, self.dims), self.data)

    def test_attachment_must_meet_body(self):
        data = copy.deepcopy(self.data)
        data['centerlineMm'][0][0] += 6
        with self.assertRaisesRegex(ValueError, 'attachment'):
            validate_handle(data, self.profile, self.dims)

    def test_confirmed_attachment_heights_cannot_drift(self):
        data = copy.deepcopy(self.data)
        upper = data['centerlineMm'][0][2]
        lower = data['centerlineMm'][-1][2]
        data['confirmedAttachmentCentersMm'] = {'upperZ': upper, 'lowerZ': lower}
        validate_handle(data, self.profile, self.dims)
        data['confirmedAttachmentCentersMm']['upperZ'] = upper + 1
        with self.assertRaisesRegex(ValueError, 'confirmed attachment'):
            validate_handle(data, self.profile, self.dims)

    def test_handle_must_not_cut_body(self):
        data = copy.deepcopy(self.data)
        data['centerlineMm'][3][0] = 20
        with self.assertRaisesRegex(ValueError, 'through vessel body'):
            validate_handle(data, self.profile, self.dims)

    def test_reviewed_mug_path_cannot_loop_below_lower_attachment(self):
        candidate = ROOT / 'docs/artifacts/mug-validation/review-candidate/handle.json'
        handle = json.loads(candidate.read_text())
        self.assertEqual(handle['pathInterpolation'], 'shape-preserving-bezier')
        samples = sampled_centerline(handle, 201)
        without_explicit_mode = dict(handle)
        without_explicit_mode.pop('pathInterpolation')
        self.assertEqual(sampled_centerline(without_explicit_mode, 201), samples)
        outer = max(range(len(samples)), key=lambda i: samples[i][0])
        self.assertTrue(all(b[0] <= a[0] + 1e-6 for a, b in
                            zip(samples[outer:], samples[outer + 1:])))
        self.assertGreaterEqual(min(point[2] for point in samples),
                                handle['confirmedAttachmentCentersMm']['lowerZ'] - 1e-6)

    def test_overall_width_must_match_shape(self):
        data = copy.deepcopy(self.data)
        data['overallWidthMm'] = 150
        with self.assertRaisesRegex(ValueError, 'overallWidthMm'):
            validate_handle(data, self.profile, self.dims)


if __name__ == '__main__':
    unittest.main()
