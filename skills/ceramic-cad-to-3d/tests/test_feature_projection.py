"""Regression: connected loft foot must retain both outer contours in CAD views."""
import json,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from feature_shape import build
from feature_drawing import project,extent
class Projection(unittest.TestCase):
 def test_connected_loft_foot_outline(self):
  model,_=build(json.loads((Path(__file__).parent/'fixtures/loft-foot-projection.json').read_text()))
  self.assertEqual(len(model.solids()),1)
  self.assertTrue(model.is_valid)
  for direction in [(0,-1,0),(1,0,0)]:
   view=project(model,direction,axisymmetric=True)
   for sign in [-1,1]:
    points=[p for line in view['visible'] for p in line if -11.8<p[1]<-10.2 and p[0]*sign>9]
    self.assertGreater(len(points),2,'Missing outer connection contour')
   a,b,c,d=extent(view['visible']+view['hidden'])
   # Sampled SVG polylines may miss the analytic maximum between samples.
   self.assertAlmostEqual(model.bounding_box().size.X,42,delta=.001)
   self.assertAlmostEqual(c-a,42,delta=.05)
   self.assertAlmostEqual(d-b,30,delta=.01)
if __name__=='__main__':unittest.main()
