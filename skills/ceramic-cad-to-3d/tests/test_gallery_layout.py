import sys
from pathlib import Path
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from gallery_layout import layout_for

class Layout(unittest.TestCase):
    def test_supported_counts_bounds_and_role_independence(self):
        for n in range(2,9):
            photos=[{'role':'actual'} for _ in range(n)]
            options={'mode':'scatter','seed':'stable-review'}
            a=layout_for(photos,options)
            self.assertEqual(a,layout_for([{'role':'process'} for _ in photos],options))
            self.assertEqual(a,layout_for(photos,options))
            for view in ('desktop','mobile'):
                boxes=[p[view] for p in a['placements']]
                self.assertGreater(len({b['w'] for b in boxes}),1)
                for b in boxes:
                    self.assertGreaterEqual(b['x'],0);self.assertGreaterEqual(b['y'],0)
                    self.assertLessEqual(b['x']+b['w'],100);self.assertLessEqual(b['y']+b['h'],100)
                for i,box in enumerate(boxes):
                    for b in boxes[i+1:]:
                        self.assertTrue(box['x']+box['w']<=b['x'] or b['x']+b['w']<=box['x'] or box['y']+box['h']<=b['y'] or b['y']+b['h']<=box['y'])
    def test_selection_requires_explicit_candidate(self):
        self.assertEqual('selected',layout_for([{'role':'actual'},{'role':'process'}])['mode'])
        with self.assertRaises(ValueError):layout_for([{'role':'actual'}]*3)
        with self.assertRaises(ValueError):layout_for([{'role':'actual'}]*3,{'mode':'scatter'})
        with self.assertRaises(ValueError):layout_for([{'role':'actual'}]*9,{'mode':'scatter','seed':'x'})

if __name__=='__main__':unittest.main()
