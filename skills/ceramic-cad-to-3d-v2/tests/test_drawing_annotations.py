import json
from pathlib import Path
import sys,tempfile,unittest
import xml.etree.ElementTree as ET
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from build123d import Solid,export_step
import drawing_review as drawing
import dimensional_kit as kit
from drawing_annotations import validate

class AnnotationTests(unittest.TestCase):
    def test_dimension_position_options(self):
        def label(markup):
            return ET.fromstring('<svg>'+markup+'</svg>').find('text')
        a=label(kit.dim_h(0,100,20,30,'W'))
        b=label(kit.dim_h(0,100,20,30,'W',below=True,dx=8,dy=2))
        self.assertEqual(float(b.get('x'))-float(a.get('x')),8)
        self.assertEqual(float(b.get('y'))-float(a.get('y')),24)
        for side,anchor in [('left','end'),('right','start')]:
            t=label(kit.dim_v(0,100,20,30,'H',side=side))
            self.assertEqual(t.get('text-anchor'),anchor);self.assertIsNone(t.get('transform'))
        for record in [{'dimensionOptions':{'front':{'horizontal':{'dx':float('nan')}}}},
                       {'radiusAnnotations':[0,0]}, {'radiusAnnotations':[True]},
                       {'numberedNotes':[{'view':'section','pointMm':[0,0],'text':''}]}]:
            with self.assertRaises(ValueError):validate(record)

    def test_actual_circle_and_note_binding(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);project=root/'source';(project/'input').mkdir(parents=True)
            (project/'geometry/orb').mkdir(parents=True)
            export_step(Solid.make_sphere(20),project/'geometry/orb/model.step')
            (project/'input/config.json').write_text(json.dumps({'parts':[{'id':'orb','shapeKind':'feature-solid'}]}))
            path=root/'input.json'
            data={'schemaVersion':1,'status':'reviewed-provisional','sourceProject':str(project),'parts':[{'id':'orb'}]}
            path.write_text(json.dumps(data));drawing.build(path,root/'catalog')
            item=json.loads((root/'catalog/drawing-plan.json').read_text())['parts'][0]
            arc=item['cadRadii'][0]
            self.assertAlmostEqual(arc['radiusMm'],20)
            data['parts'][0].update(radiusAnnotations=[arc['edgeIndex']],numberedNotes=[{'view':'section','pointMm':arc['pointMm'],'text':'Review this section edge.'}],
                                   dimensionOptions={'front':{'horizontal':{'below':True,'dx':8},'vertical':{'side':'right'}}})
            path.write_text(json.dumps(data));drawing.build(path,root/'annotated')
            plan=json.loads((root/'annotated/drawing-plan.json').read_text())['parts'][0]
            self.assertEqual(plan['radiusAnnotations'][0]['sourceStepSha256'],drawing.sha(project/'geometry/orb/model.step'))
            svg=ET.parse(root/'annotated/orb-desktop.svg')
            self.assertEqual(len(svg.findall(".//*[@data-radius-code='R1']")),1)
            self.assertEqual(len(svg.findall(".//*[@data-note-ref='1']")),1)
            self.assertIn('Section radius',(root/'annotated/orb-desktop.svg').read_text())
            data['parts'][0]['radiusAnnotations']=[999]
            path.write_text(json.dumps(data))
            with self.assertRaisesRegex(ValueError,'analytic circle'):drawing.build(path,root/'invalid')
            data['parts'][0]['radiusAnnotations']=[]
            data['parts'][0]['numberedNotes'][0]['pointMm']=[1000,1000]
            path.write_text(json.dumps(data))
            with self.assertRaisesRegex(ValueError,'anchor'):drawing.build(path,root/'invalid-note')
if __name__=='__main__':unittest.main()
