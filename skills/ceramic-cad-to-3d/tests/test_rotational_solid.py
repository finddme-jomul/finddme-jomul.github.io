"""Numerical shape checks independent of fixture report wording."""
import math
from pathlib import Path
import sys
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'scripts'))
from jomul_handled_solid import make_rotational_solid

class RotationalSolid(unittest.TestCase):
    def test_selected_visual_floor_does_not_replace_default_cad(self):
        dims=dict(height=100,maxDiameter=80,openingDiameter=80,footDiameter=80,
                  wallThickness=4,baseThickness=7)
        profile=[[40,0],[40,20],[40,100]]
        exact,_=make_rotational_solid(profile,dims)
        visual,_=make_rotational_solid(profile,dims,floor_policy='selected-visual-sampled')
        self.assertFalse(exact.is_inside((30,0,10)))
        self.assertTrue(visual.is_inside((30,0,10)))
        self.assertGreater(visual.volume,exact.volume)
        with self.assertRaises(ValueError):
            make_rotational_solid(profile,dims,floor_policy='unknown')

    def test_open_cavity_and_exact_unsampled_floor(self):
        dims=dict(height=100,maxDiameter=80,openingDiameter=80,footDiameter=80,
                  wallThickness=4,baseThickness=7)
        solid,_=make_rotational_solid([[40,0],[40,20],[40,100]],dims)
        expected=math.pi*(40**2*100-36**2*93)
        self.assertAlmostEqual(solid.volume,expected,places=5)
        self.assertTrue(solid.is_inside((0,0,6)))
        self.assertFalse(solid.is_inside((0,0,8)))
        self.assertFalse(solid.is_inside((0,0,99)))
        self.assertTrue(solid.is_inside((38,0,50)))
        for change in ({'baseThickness':0},{'baseThickness':100},{'wallThickness':40},
                       {'height':99},{'maxDiameter':81},{'baseThickness':True}):
            with self.subTest(change=change),self.assertRaises(ValueError):
                make_rotational_solid([[40,0],[40,20],[40,100]],dict(dims,**change))
        del dims['baseThickness']
        with self.assertRaises(ValueError):
            make_rotational_solid([[40,0],[40,20],[40,100]],dims)

if __name__=='__main__':
    unittest.main()
