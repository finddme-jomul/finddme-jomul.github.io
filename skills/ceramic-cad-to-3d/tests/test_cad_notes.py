import sys, unittest, tempfile, json, xml.etree.ElementTree as ET
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from cad_pages import validate, install

class CadNotes(unittest.TestCase):
    def test_notes_are_validated(self):
        group={'id':'plate','title':'Plate','partIds':['plate']}
        config={'groups':[group],'clickToZoom':True}
        for bad in ['text',[''],['x']*4,['x'*181],[3]]:
            group['dimensionNotes']=bad
            with self.assertRaises(ValueError):validate(config,['plate'])
        group['dimensionNotes']=['GROOVE 2 mm','DEPTH 1 mm: PROVISIONAL']
        validate(config,['plate'])

    def test_notes_survive_group_composition_and_escape(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);geo=root/'geometry';(geo/'plate').mkdir(parents=True);(root/'assets').mkdir()
            views=''.join(f'<g data-view="{key}"><polyline points="0,0 20,10"/></g>' for key in ['front','plan','side','section','isometric','wire'])
            (geo/'sheet.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg"><g data-part="plate">'+views+'</g></svg>')
            (geo/'drawing-manifest.json').write_text(json.dumps({'parts':[{'id':'plate'}],'layouts':{'desktop':{'file':'sheet.svg','frontBoxes':{'plate':{}}}}}))
            (geo/'plate/manifest.json').write_text(json.dumps({'boundsMm':{'min':[0,0,0],'max':[20,20,10]}}))
            note='DEPTH < 2 mm & PROVISIONAL'
            config={'groups':[{'id':'plate','title':'Plate','partIds':['plate'],'dimensionNotes':[note]}],'clickToZoom':True}
            result=install(root,root,config,[{'id':'plate'}])
            svg=ET.parse(root/'assets'/result['pages'][0]['file']).getroot()
            self.assertIn(note,[e.text for e in svg.iter()])
            self.assertEqual(result['pages'][0]['dimensionNotes'],[note])
            self.assertEqual(len([e for e in svg.iter() if e.get('data-view')]),6)
