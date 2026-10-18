"""Guide curves follow CAD surfaces; frontBox matches emitted projected geometry."""
import json
import math
from pathlib import Path
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from build123d import Solid, Plane, export_step
from feature_drawing import curves, build


class FeatureDrawing(unittest.TestCase):
    def test_sections_on_sphere_surface_not_mesh_edges(self):
        model=Solid.make_sphere(10,Plane(origin=(3,4,12)))
        groups=curves(model,{'horizontalSections':6,'verticalSections':4,'curveSegments':24})
        self.assertEqual({g.get('axis') for g in groups[1:]},{'X','Y','Z'})
        for group in groups:
            for curve in group['lines']:
                for x,y,z in curve:
                    self.assertAlmostEqual(math.dist((x,y,z),(3,4,12)),10,places=5)
                    if group['kind']=='section':
                        self.assertAlmostEqual((x,y,z)['XYZ'.index(group['axis'])],group['coordinateMm'],places=5)

    def test_all_part_views_and_exact_front_boxes(self):
        with tempfile.TemporaryDirectory() as tmp:
            out=Path(tmp);parts=[{'id':'sphere'},{'id':'offset-box'}]
            models=[Solid.make_sphere(10,Plane(origin=(3,4,12))),Solid.make_box(12,8,18,Plane(origin=(20,-8,4)))]
            for part,model in zip(parts,models):
                p=out/part['id'];p.mkdir();export_step(model,p/'model.step')
            manifest=build({'parts':parts},out)
            for layout in manifest['layouts'].values():
                w,h=layout['pagePx'];svg=ET.parse(out/layout['file']).getroot()
                for group in [g for g in svg if g.get('data-part')]:
                    views={v.get('data-view'):v for v in group if v.get('data-view')}
                    self.assertEqual(set(views),{'front','plan','side','section','isometric','wire'})
                    points=[list(map(float,p.split(','))) for e in views['front'] if e.tag.endswith('polyline') for p in e.get('points').split()]
                    xs,ys=zip(*points);box=layout['frontBoxes'][group.get('data-part')]
                    self.assertAlmostEqual((min(xs)+max(xs))/2/w,box['cx'],places=6)
                    self.assertAlmostEqual((min(ys)+max(ys))/2/h,box['cy'],places=6)
                    self.assertAlmostEqual((max(xs)-min(xs))/w,box['width'],places=6)
                    self.assertAlmostEqual((max(ys)-min(ys))/h,box['height'],places=6)
            guide=json.loads((out/'sphere/wire-guide.json').read_text())
            a,b=guide['groups'][0]['lines'][0][:2]
            self.assertEqual(guide['positionsYUpMetres'][:6],[a[0]/1000,a[2]/1000,-a[1]/1000,b[0]/1000,b[2]/1000,-b[1]/1000])


if __name__=='__main__':unittest.main()
