"""Numerical shape checks independent of fixture report wording."""
import math
from pathlib import Path
import sys
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'scripts'))
from jomul_handled_solid import make_rotational_solid

class RotationalSolid(unittest.TestCase):
    def test_assembly_checks_real_sections_not_overlapping_bounds_only(self):
        from assembly_geometry import check
        dims=dict(height=55,maxDiameter=180,openingDiameter=180,footDiameter=80,
                  wallThickness=1,baseThickness=1,footHeight=10)
        profile=[[40,0],[40,10],[60,20],[80,40],[90,55]]
        smaller=[[r*.8,z] for r,z in profile]
        small={**dims,'maxDiameter':144,'openingDiameter':144,'footDiameter':64}
        parts=[{'id':'a','dimensionsMm':dims,'profile':profile,'appearance':{'motion':{'finalXDesktop':0,'finalXMobile':0}}},
               {'id':'b','dimensionsMm':small,'profile':smaller,'appearance':{'motion':{'finalXDesktop':.25,'finalXMobile':.25}}}]
        plan={'steps':[{'partId':'a','start':0,'duration':.1,'targetPositionMm':[0,0,0],'liftMm':0},
                       {'partId':'b','start':.1,'duration':.9,'targetPositionMm':[0,11.5,0],'liftMm':100}]}
        result=check(parts,plan)
        self.assertEqual(0,result['finalIntersections'][0]['intersectionMm3'])
        plan['steps'][1]['targetPositionMm']=[0,0,0]
        with self.assertRaisesRegex(ValueError,'collision'):check(parts,plan)

    def test_raised_foot_has_open_underside_and_one_mm_floor(self):
        dims=dict(height=55,maxDiameter=80,openingDiameter=80,footDiameter=80,
                  wallThickness=1,baseThickness=1,footHeight=10)
        profile=[[40,0],[40,10],[40,55]]
        solid,checks=make_rotational_solid(profile,dims)
        self.assertEqual(11,checks['floorHeightMm'])
        self.assertFalse(solid.is_inside((0,0,5)))
        self.assertTrue(solid.is_inside((39.5,0,5)))
        self.assertTrue(solid.is_inside((0,0,10.5)))
        self.assertFalse(solid.is_inside((0,0,11.5)))
        expected=math.pi*(40**2*55-39**2*54)
        self.assertAlmostEqual(solid.volume,expected,places=5)
        for foot in (0,-1,54,True,float('nan')):
            with self.subTest(foot=foot),self.assertRaises(ValueError):
                make_rotational_solid(profile,{**dims,'footHeight':foot})
        with self.assertRaises(ValueError):
            make_rotational_solid(profile,dims,floor_policy='selected-visual-sampled')

    def test_flared_raised_foot_stays_connected_and_draws_same_section(self):
        from rotational_section import raised_foot_section
        from shared_sheet_poc import section
        dims=dict(height=55,maxDiameter=180,openingDiameter=180,footDiameter=80,
                  wallThickness=1,baseThickness=1,footHeight=10)
        profile=[[40,0],[40,10],[60,20],[80,40],[90,55]]
        solid,_=make_rotational_solid(profile,dims)
        self.assertTrue(solid.is_valid)
        self.assertEqual(1,len(solid.solids()))
        self.assertFalse(solid.is_inside((0,0,5)))
        self.assertTrue(solid.is_inside((0,0,10.5)))
        self.assertFalse(solid.is_inside((0,0,12)))
        points=raised_foot_section(profile,dims)
        self.assertIn((0,10),points)
        self.assertIn((0,11),points)
        svg=section({'id':'synthetic-foot','dimensions':dims,'profile':profile},0,100,1)
        self.assertIn('0.00,90.00',svg)
        self.assertIn('0.00,89.00',svg)

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
