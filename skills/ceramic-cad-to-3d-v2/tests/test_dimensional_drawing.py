"""Actual solids, source preservation, reproducibility and input failure boundaries."""
import json
from pathlib import Path
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from build123d import Solid, Plane, export_step
import drawing_review as drawing


class DrawingReview(unittest.TestCase):
    def test_rotational_profile_removes_face_edge_density_without_inventing_shape(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);archive=root/'sources';archive.mkdir()
            (root/'profile.json').write_text(json.dumps([[10,z] for z in range(41)]))
            (root/'dimensions.json').write_text(json.dumps({'valuesMm':{'height':40,'maxDiameter':20,'openingDiameter':20,'footDiameter':20,'wallThickness':2,'baseThickness':4}}))
            (root/'material.json').write_text(json.dumps({'clay':{'name':'test'},'glaze':{'name':'test'}}))
            part={'id':'vessel','name':'Vessel','shapeKind':'rotational-profile','materialFormat':'single',**{k:str(root/f'{k}.json') for k in ('profile','dimensions','material')}}
            model=Solid.make_cylinder(10,40).cut(Solid.make_cylinder(8,37,Plane(origin=(0,0,4))))
            views=drawing.rotational_views(part,model,archive)
            self.assertEqual(len(views['front']['visible']),4)
            self.assertEqual(drawing.extent(views['front']),[-10,-20,10,20])
            self.assertLess(len(views['isometric']['visible']),20)
            self.assertEqual((archive/'vessel-profile.json').read_bytes(),(root/'profile.json').read_bytes())
            with self.assertRaisesRegex(ValueError,'bounds disagree'):
                drawing.rotational_views(part,Solid.make_cylinder(15,40),archive)

    def test_common_path_single_multiple_hollow_and_hashes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);project=root/'project';(project/'input').mkdir(parents=True)
            models={'box':Solid.make_box(20,30,40,Plane(origin=(8,2,5))),
                    'hollow':Solid.make_cylinder(12,30).cut(Solid.make_cylinder(9,28,Plane(origin=(0,0,3))))}
            config={'parts':[{'id':pid,'shapeKind':'feature-solid'} for pid in models]}
            (project/'input/config.json').write_text(json.dumps(config))
            sources={}
            for pid,model in models.items():
                directory=project/'geometry'/pid;directory.mkdir(parents=True)
                source=directory/'model.step';export_step(model,source);sources[pid]=drawing.sha(source)
            input_path=root/'review.json'
            def generate(name,ids):
                input_path.write_text(json.dumps({'schemaVersion':1,'status':'reviewed-provisional','sourceProject':str(project),'parts':[{'id':p} for p in ids]}))
                output=root/name;drawing.build(input_path,output);return output
            a=generate('a',['box']);b=generate('b',['box']);multi=generate('multi',['box','hollow'])
            self.assertEqual((a/'sheet-desktop.svg').read_bytes(),(b/'sheet-desktop.svg').read_bytes())
            plan=json.loads((multi/'drawing-plan.json').read_text())
            self.assertEqual(plan['parts'][0]['dimensionsMm'],{'W':20,'H':40,'D':30})
            self.assertTrue(all(abs(s['widthMm']-20)<1e-6 for s in plan['parts'][0]['stations']))
            self.assertTrue(plan['parts'][1]['views']['section']['regions'])
            # Empty cavity centre must not belong to any section face: verify actual
            # archived STEP solid independently of the SVG fill-rule implementation.
            from build123d import import_step
            hollow=import_step(multi/'sources/hollow.step')
            self.assertFalse(hollow.is_inside((0,0,10)))
            for pid,digest in sources.items():
                self.assertEqual(drawing.sha(project/'geometry'/pid/'model.step'),digest)
                self.assertEqual(drawing.sha(multi/f'sources/{pid}.step'),digest)
            manifest=drawing.verify(multi)
            for layout in manifest['layouts'].values():
                self.assertEqual(set(layout['frontBoxes']),set(models))
                svg=ET.parse(multi/layout['file']).getroot()
                ids=[e.get('id') for e in svg.iter() if e.get('id')]
                self.assertEqual(len(ids),len(set(ids)))
            with self.assertRaisesRegex(ValueError,'unused'):drawing.build(input_path,a)
            (multi/'box-desktop.svg').write_text('tampered')
            with self.assertRaisesRegex(ValueError,'changed'):drawing.verify(multi)

    def test_unknown_and_duplicate_input_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);(root/'input').mkdir();(root/'input/config.json').write_text('{"parts":[{"id":"box"}]}')
            path=root/'review.json'
            for parts in [[{'id':'unknown'}],[{'id':'box'},{'id':'box'}],[{'id':'box','details':[{'view':'front','label':'X','boundsMm':[0,0,float('nan'),1]}]}]]:
                path.write_text(json.dumps({'schemaVersion':1,'status':'reviewed-provisional','sourceProject':str(root),'parts':parts}))
                with self.assertRaises(ValueError):drawing.read_input(path)


if __name__=='__main__':unittest.main()
