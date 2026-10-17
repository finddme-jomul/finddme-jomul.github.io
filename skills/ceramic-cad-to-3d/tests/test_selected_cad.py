"""Protect the selected silhouette and reject incompatible reference/model pairings."""
import copy
import json
import shutil
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'scripts'))
import selected_cad as bridge


class SelectedCAD(unittest.TestCase):
    def setUp(self):
        source = bridge.ASSETS/'selected-page/assets'
        self.profile = json.loads((source/'outer-profile.json').read_text())
        self.dimensions = json.loads((source/'project.json').read_text())['dimensionsMm']
        self.expected = (source/'front-view.svg').read_text()

    def test_front_exact_and_source_sensitive(self):
        self.assertEqual(bridge.front_svg(self.profile, self.dimensions), self.expected)
        changed = copy.deepcopy(self.profile)
        changed[20][0] += .1
        self.assertNotEqual(bridge.front_svg(changed, self.dimensions), self.expected)
        with self.assertRaises(ValueError):
            bridge.front_svg(self.profile, {**self.dimensions, 'height': 151})
        with self.assertRaises(ValueError):
            bridge.front_svg(list(reversed(self.profile)), self.dimensions)

    def test_changed_shape_and_multiple_rejected_before_reference_reuse(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); project = root/'project'; inputs = project/'input'; inputs.mkdir(parents=True)
            part = {'id':'test','profile':'project/input/profile.json','dimensions':'project/input/dimensions.json',
                    'material':'project/input/material.json','dimensionsKey':'valuesMm','materialFormat':'single'}
            config = {'compositionMode':'single','parts':[part]}
            (inputs/'config.json').write_text(json.dumps(config))
            changed = copy.deepcopy(self.profile); changed[20][0] += .1
            (inputs/'profile.json').write_text(json.dumps(changed))
            (inputs/'dimensions.json').write_text(json.dumps({'valuesMm':self.dimensions}))
            (inputs/'material.json').write_text('{}')
            with patch.object(bridge,'ROOT',root):
                with self.assertRaisesRegex(ValueError,'changed geometry'):
                    bridge.prepare(project)
                (inputs/'profile.json').write_text(json.dumps(self.profile))
                material={'clay':{'name':'백토','product':None,'wetPreviewHex':'#BDB9B1'},
                          'glaze':{'name':'무광투명유약','product':None,'optical':'clear','finish':'glossy','firedAppearancePreviewHex':'#E7E6E1'}}
                (inputs/'material.json').write_text(json.dumps(material))
                with self.assertRaisesRegex(ValueError,'changed material labels/finish'):
                    bridge.prepare(project)
                config['compositionMode']='multiple'; config['parts'] *= 2
                (inputs/'config.json').write_text(json.dumps(config))
                with self.assertRaisesRegex(ValueError,'one rotational part'):
                    bridge.prepare(project)
            self.assertFalse((project/'page-review').exists())

    def test_compatible_inputs_and_changed_sheet_notes(self):
        fixture = Path(__file__).resolve().parent/'fixtures/single'
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder); project=root/'project'; inputs=project/'input'
            shutil.copytree(fixture, inputs)
            config=json.loads((inputs/'config.json').read_text())
            for key in ('profile','dimensions','material'):
                config['parts'][0][key]='project/input/'+config['parts'][0][key]
            (inputs/'config.json').write_text(json.dumps(config))
            (project/'pipeline-state.json').write_text('{}')
            stage=root/'output'; (stage/'assets').mkdir(parents=True)
            shutil.copy2(bridge.ASSETS/'selected-page/assets/project.json',stage/'assets/project.json')
            # Real CAD verification is exercised by the CLI/browser integration.
            with patch.object(bridge,'ROOT',root), patch('project.verify') as verify:
                prepared=bridge.prepare(project)
                verify.assert_called_once()
                bridge.install(prepared,stage)
                self.assertEqual((stage/'assets/front-view.svg').read_text(),self.expected)
                self.assertEqual((stage/'assets/cad-sheet.png').read_bytes(),(bridge.ASSETS/'selected-page/assets/cad-sheet.png').read_bytes())
                dimension_file=inputs/'moon-jar-dimensions.json'
                dimensions=json.loads(dimension_file.read_text())
                dimensions['shrinkage']['totalPercent']=10
                dimension_file.write_text(json.dumps(dimensions))
                with self.assertRaisesRegex(ValueError,'changed dimension/material record'):
                    bridge.prepare(project)

    def test_sheet_uses_profile_dimensions_and_material(self):
        from selected_sheet import render
        fixture = Path(__file__).resolve().parent/'fixtures/single'
        calc=json.loads((fixture/'moon-jar-dimensions.json').read_text())
        material=json.loads((fixture/'moon-jar-material.json').read_text())
        expected=(bridge.ASSETS/'selected-page/assets/cad-sheet.png').read_bytes()
        with tempfile.TemporaryDirectory() as folder:
            output=Path(folder)
            for change in ('profile','dimensions','material'):
                profile=copy.deepcopy(self.profile); dims=copy.deepcopy(calc); mat=copy.deepcopy(material)
                if change=='profile': profile[20][0] += 2
                if change=='dimensions': dims['targetFiredMm']['height'] += 1
                if change=='material': mat['clay']['wetPreviewHex']='#ff0000'
                box=render(profile,dims,mat,output/change)
                self.assertNotEqual((output/change/'cad-sheet.png').read_bytes(),expected,change)
                if change=='dimensions':
                    selected=json.loads((bridge.ASSETS/'selected-page/assets/project.json').read_text())['sheetFrontBox']
                    self.assertNotEqual(box,selected)

    def test_input_drift_rejected_before_install(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder); source=root/'profile.json';source.write_text('old')
            prepared={'inputsSha256':{'profile.json':bridge.sha(source)},'profile':self.profile,'frontSvg':self.expected}
            source.write_text('changed')
            with patch.object(bridge,'ROOT',root), self.assertRaisesRegex(ValueError,'changed during'):
                bridge.install(prepared, root/'output')
            self.assertFalse((root/'output').exists())


if __name__ == '__main__': unittest.main()
