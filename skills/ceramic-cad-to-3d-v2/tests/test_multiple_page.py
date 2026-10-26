import copy
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from multiple_page import validate, verify_layers

class MultipleReview(unittest.TestCase):
    def test_layered_regions_preserve_source_order_and_exterior_scope(self):
        from layered_review import coatings, assembly
        region={'surface':'exterior','minHeightMm':10,'maxHeightMm':40}
        spec={'status':'reviewed-provisional','provenance':'synthetic test',
              'layers':[{'name':'black','region':region,'previewHex':'#222222'},
                        {'name':'clear','region':{'surface':'all'},'previewHex':'#eeeeee'}],
              'fired':{'region':region,'baseHex':'#eeeeee','regionHex':'#888888'},'roughness':.7}
        evidence=[{'name':'black','application':'exterior-below-dashed-boundary'},
                  {'name':'clear','application':'full-coat'}]
        coatings(spec,evidence,{'height':55})
        for edit in ('inside','order','height'):
            bad=copy.deepcopy(spec)
            if edit=='inside':bad['layers'][0]['region']={'surface':'all'}
            if edit=='order':bad['layers'].reverse()
            if edit=='height':bad['fired']['region']['maxHeightMm']=60
            with self.subTest(edit=edit),self.assertRaises(ValueError):coatings(bad,evidence,{'height':55})
        plan={'status':'reviewed-provisional','provenance':'synthetic test','start':.75,'duration':.15,
              'steps':[{'partId':'a','start':0,'duration':1,'targetPositionMm':[0,11.5,0],'liftMm':100}]}
        timing={'accentGlazeStart':.58,'accentGlazeDuration':.12,'photoStart':.97}
        assembly(plan,[{'id':'a','motion':{'settledScale':1}}],timing)
        bad=copy.deepcopy(plan);bad['start']=.6
        with self.assertRaises(ValueError):assembly(bad,[{'id':'a','motion':{'settledScale':1}}],timing)

    def test_extended_handoff_requires_forward_interval(self):
        self.review['cadPresentation']={'handoffExtraScrollVh':240}
        self.review['motion']['timing']['frontMoveStart']=.8
        with self.assertRaisesRegex(ValueError,'positive transition interval'):
            validate(self.review,self.ids)

    def test_lighting_limits(self):
        for value in [{'exposure':.9,'pointLightScale':.08},{'softPartIds':['rice-bowl'],'softPointLightScale':.08},{}]:
            self.review['motion']['lighting']=value
            with patch('multiple_page.load_photos',return_value=[]):validate(self.review,self.ids)
        for value in [{'exposure':-1},{'pointLightScale':3},{'exposure':True},{'unknown':1},{'softPartIds':['missing']},{'softPointLightScale':2}]:
            self.review['motion']['lighting']=value
            with self.assertRaises(ValueError):validate(self.review,[p['id'] for p in self.review['parts']])

    def test_variation_invalid_values(self):
        for field,value in [('dropDurationScale',0),('spinPhaseDegrees',361),('entryYOffset',3),('fixedOrientation','true'),('varyingDropAxis',True)]:
            r=copy.deepcopy(self.review);r['parts'][0]['motion'][field]=value
            with self.assertRaises(ValueError):validate(r,self.ids)

    def setUp(self):
        self.review=json.loads((Path(__file__).parent/'fixtures/multiple/scene.json').read_text())
        self.review['photos']='photos.json'
        self.ids=['rice-bowl','soup-bowl']

    def test_reviewed_order_layers_axes_and_empty_photos(self):
        with patch('multiple_page.load_photos',return_value=[]):
            validate(self.review,self.ids)
            for edit in ('order','axis','position','colour','nonfinite','turn'):
                r=copy.deepcopy(self.review)
                if edit=='order':r['parts'].reverse()
                if edit=='axis':r['parts'][0]['motion']['axisTiltDegrees']=91
                if edit=='position':r['parts'][0]['motion']['finalXMobile']=2
                if edit=='colour':r['parts'][0]['glazePreview']['baseWarmHex']='red'
                if edit=='nonfinite':r['parts'][0]['accentCenterAngle']=float('inf')
                if edit=='turn':r['motion']['glaze']['axisPrecessionTurns']=0
                with self.subTest(edit=edit),self.assertRaises(ValueError):validate(r,self.ids)

    def test_cad_coating_evidence_cannot_be_dropped_or_reordered(self):
        material=json.loads((Path(__file__).parent/'fixtures/multiple/rice-bowl-material.json').read_text())
        part=self.review['parts'][0]
        verify_layers(material,part,'rice-bowl')
        changed=copy.deepcopy(part);changed['accentEnabled']=False
        with self.assertRaises(ValueError):verify_layers(material,changed,'rice-bowl')
        changed=copy.deepcopy(part);g=changed['glazePreview'];g['baseName'],g['accentName']=g['accentName'],g['baseName']
        with self.assertRaises(ValueError):verify_layers(material,changed,'rice-bowl')

    def test_arbitrary_review_count_preserves_all_ids_and_order(self):
        for count in (3,5,8):
            review=copy.deepcopy(self.review)
            review['parts']=[copy.deepcopy(self.review['parts'][0]) for _ in range(count)]
            ids=[f'vessel-{i}' for i in range(count)]
            for i,part in enumerate(review['parts']):
                part['id']=ids[i]
                for screen in ('Desktop','Mobile'):
                    part['motion']['finalX'+screen]=(i-(count-1)/2)*.2
            with patch('multiple_page.load_photos',return_value=[]):
                validate(review,ids)
                bad=copy.deepcopy(review);bad['parts'][-1]['motion']['finalXDesktop']=-1
                with self.assertRaises(ValueError):validate(bad,ids)
                with self.assertRaises(ValueError):validate(review,ids[:-1])

if __name__=='__main__':unittest.main()
