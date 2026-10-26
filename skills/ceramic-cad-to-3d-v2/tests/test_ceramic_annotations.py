"""Ceramic codes retain source certainty; derived values and crops share input."""
import hashlib,json,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from ceramic_annotations import adapt


class CeramicAnnotations(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
        self.archive=self.root/'archive';self.archive.mkdir()
        self.path=self.root/'dimensions.json'
        self.record={'valuesMm':{'height':100,'openingDiameter':90,'footDiameter':70,'wallThickness':4,'baseThickness':6},'sources':{'openingDiameter':'user-confirmed','wallThickness':'visual-assumption'}}
        self.path.write_text(json.dumps(self.record))
        self.part={'id':'cup','shapeKind':'rotational-profile','dimensions':str(self.path)}
        self.bounds={'min':[-45,-45,0],'max':[45,45,100]}

    def tearDown(self):self.tmp.cleanup()

    def test_formula_uncertainty_and_actual_crops(self):
        result=adapt(self.part,self.archive,self.bounds,[-45,0,45,100])
        rows={r['code']:r for r in result['rows']}
        self.assertEqual(rows['HI']['valueMm'],82)
        self.assertEqual(rows['HI']['status'],'derived-provisional')
        self.assertEqual(rows['RM']['status'],'user-confirmed')
        self.assertNotIn('FH',rows)
        self.assertEqual([d['semantic'] for d in result['details']],['rim','foot'])
        for row in rows.values():self.assertEqual(hashlib.sha256((self.archive/row['sourceFile']).read_bytes()).hexdigest(),row['sourceSha256'])
        self.record['sources']['wallThickness']='user-confirmed';self.path.write_text(json.dumps(self.record))
        result=adapt(self.part,self.archive,self.bounds,[-45,0,45,100])
        self.assertEqual(next(r for r in result['rows'] if r['code']=='HI')['status'],'user-confirmed')

    def test_handle_construction_evidence_and_no_feature_guessing(self):
        hp=self.root/'handle.json';hp.write_text(json.dumps({'kind':'centerline-round-section','sectionDiameterMm':8,'centerlineMm':[[44,0,30],[70,0,50],[44,0,82]],'status':'synthetic-test'}))
        self.part.update(shapeKind='handled-vessel',handle=str(hp))
        result=adapt(self.part,self.archive,self.bounds,[-45,0,80,100]);rows={r['code']:r for r in result['rows']}
        self.assertEqual(rows['J1']['valueMm'],82);self.assertEqual(rows['J2']['valueMm'],30)
        self.assertEqual(rows['HD']['status'],'synthetic-test')
        self.assertEqual(result['details'][1]['semantic'],'handle')
        self.assertIsNone(adapt({'shapeKind':'feature-solid'},self.archive,self.bounds,[-45,0,80,100]))

    def test_contradictions_rejected(self):
        with self.assertRaisesRegex(ValueError,'height/origin'):
            adapt(self.part,self.archive,{'min':[0,0,0],'max':[90,90,60]},[-45,0,45,100])
        self.record['valuesMm']['wallThickness']=50;self.path.write_text(json.dumps(self.record))
        with self.assertRaisesRegex(ValueError,'HI'):adapt(self.part,self.archive,self.bounds,[-45,0,45,100])


if __name__=='__main__':unittest.main()
