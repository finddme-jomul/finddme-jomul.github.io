import sys, unittest, copy
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from layered_review import region, coatings
class PlanarTests(unittest.TestCase):
    def test_contract(self):
        b=dict(minX=-290,maxX=290,minY=-290,maxY=290,minZ=0,maxZ=22)
        r=dict(surface='planar-xy',planeZMm=22,rectanglesMm=[[-247,-247,-187,-187]])
        region(r,22,b)
        for key,value in [('planeZMm',float('nan')),('planeZMm',23),('rectanglesMm',[]),('rectanglesMm',[[-300,0,0,1]]),('rectanglesMm',[[0,0,True,1]])]:
            bad=copy.deepcopy(r);bad[key]=value
            with self.assertRaises(ValueError):region(bad,22,b)
        with self.assertRaises(ValueError):region(r,22)
        spec=dict(status='reviewed-provisional',provenance='test',roughness=.5,layers=[dict(name='clear',region={'surface':'all'},previewHex='#ffffff'),dict(name='brown',region=r,previewHex='#654321')],fired=dict(region=r,baseHex='#ffffff',regionHex='#654321'))
        evidence=[dict(name='clear',application='full-coat'),dict(name='brown',application='planar-regions')]
        coatings(spec,evidence,dict(height=22,bounds=b))
        evidence[1]['application']='full-coat'
        with self.assertRaises(ValueError):coatings(spec,evidence,dict(height=22,bounds=b))
if __name__=='__main__':unittest.main()
