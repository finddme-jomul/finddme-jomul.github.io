"""Source-derived multi-vessel review through the selected-page entrypoint."""
import copy
import json
import math
import re
import shutil
from ceramic_paths import ROOT, ASSETS
from photos import sha, load_photos, build_gallery
from selected_cad import front_svg, verify_inputs


def validate(review, ids):
    from page import validate as validate_scene
    validate_scene(review, ids)
    timing=review['motion']['timing']
    if review.get('cadPresentation',{}).get('handoffExtraScrollVh',0) and timing['frontFadeStart']+timing['frontFadeDuration']<=timing['frontMoveStart']:
        raise ValueError('Extended CAD handoff requires a positive transition interval')
    if len(ids) < (1 if review.get('renderer') == 'layered-vessels' or review.get('renderer')=='feature-solids' and all('coatings' in p for p in review['parts']) else 2) or len(set(ids)) != len(ids):
        raise ValueError('Multiple review requires at least two distinct CAD parts')
    def finite(value):
        if isinstance(value, (int, float)) and not math.isfinite(value):
            raise ValueError('Nonfinite multiple review input')
        if isinstance(value, dict):
            for item in value.values(): finite(item)
        if isinstance(value, list):
            for item in value: finite(item)
    finite(review)
    lighting=review['motion'].get('lighting',{})
    if not isinstance(lighting,dict) or set(lighting)-{'exposure','pointLightScale','softPartIds','softPointLightScale'}:raise ValueError('Invalid lighting options')
    for key,maximum in [('exposure',3),('pointLightScale',2),('softPointLightScale',1)]:
        value=lighting.get(key,1)
        if isinstance(value,bool) or not isinstance(value,(int,float)) or not 0<=value<=maximum:raise ValueError('Invalid lighting '+key)
    soft_ids=lighting.get('softPartIds',[])
    if not isinstance(soft_ids,list) or any(pid not in ids for pid in soft_ids):raise ValueError('Unknown soft-light part ID')
    if review.get('renderer') == 'layered-vessels' or any('coatings' in p for p in review['parts']):
        if any('coatings' not in p for p in review['parts']):
            raise ValueError('Layered vessel mode requires explicit coatings for every part')
        t=review['motion']['timing']
        if t['accentGlazeStart'] is None or t['baseGlazeStart']+t['baseGlazeDuration'] > t['accentGlazeStart']:
            raise ValueError('Reviewed coating passes must be sequential')
    from layered_review import assembly
    assembly(review.get('assembly'), review['parts'], review['motion']['timing'])
    if not 0 <= review['motion']['camera'].get('elevationDegrees',0) <= 35:
        raise ValueError('Invalid reviewed camera elevation')
    camera=review['motion']['camera']
    envelope=review['motion']['framing'].get('envelope','bounds')
    if envelope not in ('bounds','radial-drop'):
        raise ValueError('Unknown camera envelope')
    if not -180 <= camera.get('azimuthDegrees',0) <= 180:
        raise ValueError('Invalid reviewed camera azimuth')
    if (envelope=='radial-drop' or camera.get('azimuthDegrees',0)) and (envelope!='radial-drop' or (review.get('assembly') or {}).get('mode')!='direct-drop'):
        raise ValueError('Oriented radial framing requires direct-drop assembly')
    for p in review['parts']:
        if not re.fullmatch(r'[a-z0-9][a-z0-9-]*', p['id']): raise ValueError('Invalid part ID')
        if not isinstance(p['accentEnabled'], bool): raise ValueError('Explicit accentEnabled required')
        if not -math.pi <= p['accentCenterAngle'] <= math.pi or not .1 <= p['accentWidthScale'] <= 3:
            raise ValueError('Invalid partial glaze placement')
        m=p['motion']
        for key in ('entryXDesktop','entryXMobile','finalXDesktop','finalXMobile'):
            if not -2 <= m[key] <= 2: raise ValueError('Invalid part position')
        for key in ('axisTiltDegrees','axisDriftZDegrees','axisDriftXDegrees'):
            if not -90 <= m[key] <= 90: raise ValueError('Invalid part axis')
        if not 0 <= m['dropDelay'] <= .2: raise ValueError('Invalid drop delay')
        for key,lo,hi in [('dropDurationScale',.5,1.5),('entryYOffset',-2,2),('entryZ',-2,2),('spinPhaseDegrees',-360,360),('axisPhaseDegrees',-360,360)]:
            if key in m and (isinstance(m[key],bool) or not isinstance(m[key],(int,float)) or not lo<=m[key]<=hi):raise ValueError('Invalid part '+key)
        for key in ('fixedOrientation','varyingDropAxis'):
            if key in m and not isinstance(m[key],bool):raise ValueError('Invalid '+key)
        if (m.get('varyingDropAxis') or m.get('fixedOrientation')) and ((review.get('assembly') or {}).get('mode')!='direct-drop' or (review.get('assembly') or {}).get('landing')!='soft-spin'):raise ValueError('Drop pose options require soft-spin direct-drop')
        g=p['glazePreview']
        for key in ('baseWarmHex','accentWarmHex'):
            if key in g and not re.fullmatch(r'#[0-9a-fA-F]{6}',g[key]): raise ValueError('Invalid glaze colour')
        if not 0 <= g.get('accentWarmMix',0) <= 1: raise ValueError('Invalid warm glaze mix')
    m=review['motion'];t=m['timing'];g=m['glaze']
    if m['camera']['fov'] != 32:
        raise ValueError('Current multiple review uses the selected 32-degree camera')
    framing=m['framing']
    if 'focusY' in framing and (isinstance(framing['focusY'],bool) or not isinstance(framing['focusY'],(int,float)) or not -2<=framing['focusY']<=2):raise ValueError('Invalid framing focusY')
    if not framing['enabled']: raise ValueError('Multiple review requires transformed bounds framing')
    for key in ('desktopWidthFraction','mobileWidthFraction','desktopHeightFraction','mobileHeightFraction'):
        if not .1<=framing[key]<=.98: raise ValueError('Invalid framing fraction')
    if not .01<=framing['minDistance']<=10: raise ValueError('Invalid minimum camera distance')
    for key in ('desktopEntryY','mobileEntryY','entryZ','dropBounceY'):
        if not -2<=m['layout'][key]<=2: raise ValueError('Invalid assembly position')
    if g['direction']!='bottom-up' or g['spinTurns']<1 or g['axisPrecessionTurns']<1:
        raise ValueError('Preserve bottom-up coating and body/axis rotation')
    if not 0<=g['axisRetainFraction']<=1 or not 0<=g['maxAxisTiltDegrees']<=90:
        raise ValueError('Invalid coating axis')
    if not 0<t['photoDuration']<=1-t['photoStart']: raise ValueError('Invalid scene exit')
    for screen in ('Desktop','Mobile'):
        positions=[p['motion']['finalX'+screen] for p in review['parts']]
        if (review.get('assembly') or {}).get('mode')!='direct-drop' and any(a>=b for a,b in zip(positions,positions[1:])):
            raise ValueError('Preserve reviewed left-to-right part order')
    photo=(ROOT/review['photos']).resolve()
    if not photo.is_relative_to(ROOT): raise ValueError('Photos must be inside workspace')
    load_photos(photo)


def verify_layers(material, appearance, part_id, dims=None):
    """Check preserved ordered CAD evidence before creating web material inputs."""
    matches=[p for p in material.get('composition',{}).get('parts',[]) if p['id']==part_id]
    if len(matches)!=1: raise ValueError('Multiple review requires per-part composition material evidence')
    layers=matches[0]['material']['glazeLayers']
    if len(layers)!=2 or [p['order'] for p in layers]!=[1,2]:
        raise ValueError('Current multiple review supports explicit two-layer material evidence')
    if 'coatings' in appearance:
        from layered_review import coatings
        coatings(appearance['coatings'],layers,dims)
        return
    g=appearance['glazePreview']
    if not appearance['accentEnabled'] or layers[0]['name'] not in g['baseName'] or layers[1]['name'] not in g['accentName']:
        raise ValueError('Reviewed coating order disagrees with source CAD material evidence')


def prepare(project, review):
    if review is None: raise ValueError('Multiple pages require explicit reviewed scene input')
    config=json.loads((project/'input/config.json').read_text())
    if (config['compositionMode']!='multiple' and review.get('renderer')!='layered-vessels') or any(p.get('shapeKind','rotational-profile')!='rotational-profile' for p in config['parts']):
        raise ValueError('Multiple page requires rotational vessels')
    ids=[p['id'] for p in config['parts']];validate(review,ids)
    from project import verify
    verify(project,json.loads((project/'pipeline-state.json').read_text()))
    files={project/'input/config.json',project/'cad/manifest.json'}
    manifest=json.loads((project/'cad/manifest.json').read_text())
    parts=[]
    for part,appearance in zip(config['parts'],review['parts']):
        sources={key:(ROOT/part[key]).resolve() for key in ('profile','dimensions','material')}
        if any(not p.is_relative_to(project/'input') for p in sources.values()): raise ValueError('Archived CAD inputs required')
        files.update(sources.values())
        profile=json.loads(sources['profile'].read_text());dims=json.loads(sources['dimensions'].read_text())[part.get('dimensionsKey','valuesMm')]
        limit=4 if review.get('renderer')=='layered-vessels' else 3
        if not 30<=dims['height']<=300 or not .5<=dims['maxDiameter']/dims['height']<=limit: raise ValueError('Unsupported multiple vessel proportions')
        # Keep full ordered material evidence; never collapse two coats into one colour.
        material=json.loads(sources['material'].read_text())
        verify_layers(material,appearance,part['id'],dims)
        parts.append({'id':part['id'],'profile':profile,'dimensionsMm':dims,'frontSvg':front_svg(profile,dims),'materialEvidence':material,'appearance':appearance})
    for entry in manifest['layouts'].values(): files.add(project/'cad'/entry['file'])
    photo=(ROOT/review['photos']).resolve();files.add(photo)
    for item in load_photos(photo): files.add((ROOT/item['source']).resolve())
    if (review.get('assembly') or {}).get('mode')=='direct-drop':
        from feature_assembly import check as check_assembly
        solid_parts=[]
        for p in parts:
            step=project/'cad/solid'/p['id']/'model.step'
            if not step.is_file():raise ValueError('Direct-drop requires archived STEP for every rotational part')
            files.add(step);solid_parts.append({**p,'step':step})
        assembly_check=check_assembly(solid_parts,review['assembly'],review['motion'])
    else:
        from assembly_geometry import check as check_assembly
        assembly_check=check_assembly(parts,review.get('assembly'))
    return {'mode':'multiple','project':str(project.relative_to(ROOT)),'name':config['name'],'review':copy.deepcopy(review),'parts':parts,'sheetManifest':manifest,'assemblyCheck':assembly_check,
            'inputsSha256':{str(p.relative_to(ROOT)):sha(p) for p in sorted(files)}}


def install(prepared,stage):
    verify_inputs(prepared)
    if prepared.get('assemblyCheck'):
        (stage/'assembly-check.json').write_text(json.dumps(prepared['assemblyCheck'],indent=2)+'\n')
    project=ROOT/prepared['project'];review=prepared['review']
    feature=prepared.get('featureSolids',False)
    for entry in prepared['sheetManifest']['layouts'].values():
        shutil.copy2(project/('geometry' if feature else 'cad')/entry['file'],stage/'assets'/entry['file'])
    from selected_surface import render
    rendered=[];geometry_assets={}
    for p in prepared['parts']:
        out=stage/'assets'/p['id'];out.mkdir()
        if feature:
            from feature_multiple import install_part
            asset_id=geometry_assets.setdefault(p.get('sourcePartId',p['id']),p['id'])
            rendered.append(install_part(project,p,out,stage/'assets'/asset_id))
            continue
        (out/'outer-profile.json').write_text(json.dumps(p['profile'])+'\n')
        (out/'front-view.svg').write_text(p['frontSvg'])
        (out/'material-evidence.json').write_text(json.dumps(p['materialEvidence'],ensure_ascii=False,indent=2)+'\n')
        surface=stage/'surface-generation'/p['id']
        render(p['profile'],p['dimensionsMm'],{'glaze':{'firedAppearancePreviewHex':p['appearance']['glazePreview']['baseHex']}},surface,
               surface={'floorPolicy':'exact','roughness':.33,'clearcoat':0})
        shutil.copy2(surface/'model.glb',out/'model.glb')
        rendered.append({**p['appearance'],'dimensionsMm':p['dimensionsMm']})
    photos=ROOT/review['photos'];gallery=stage/'gallery-source';build_gallery(photos,gallery)
    for file in (gallery/'assets').iterdir():shutil.copy2(file,stage/'assets'/file.name)
    for name in ('gallery.js','gallery.css','gallery-config.js'):
        if (gallery/name).exists():shutil.copy2(gallery/name,stage/name)
    spec={**review,'compositionMode':'single' if len(rendered)==1 else 'multiple','name':prepared['name'],'parts':rendered,'sheets':prepared['sheetManifest']['layouts'],
          'ending':'photos' if load_photos(photos) else 'glaze'}
    if feature and review.get('cadPresentation'):
        from cad_pages import install as install_cad_pages
        spec['cadPresentation']=install_cad_pages(project,stage,review['cadPresentation'],prepared['parts'])
    (stage/'assets/project.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n')
    document=(stage/'index.html').read_text();a=document.index('<section class="gallery"');b=document.index('<script type="module"',a)
    document=document[:a]+(gallery/'gallery.html').read_text()+document[b:]
    import html
    document=re.sub(r'<title>.*?</title>','<title>'+html.escape(prepared['name'])+'</title>',document)
    document=document.replace('달항아리',html.escape(prepared['name'],quote=True))
    document=re.sub(r'alt="[^"]*기술 도면:[^"]*"','alt="CAD technical drawing"',document)
    initial_sheet=spec['cadPresentation']['pages'][0]['file'] if feature and review.get('cadPresentation') else 'sheet-desktop.svg'
    document=document.replace('./assets/cad-sheet.png','./assets/'+initial_sheet)
    a=document.index('<div class="cad-main"');b=document.index('</div>',a)+6
    document=document[:a]+''.join(f'<div class="cad-main" data-part="{p["id"]}" aria-hidden="true"><img src="./assets/{p.get("geometryAssetId",p["id"])}/front-view.svg" alt=""></div>' for p in rendered)+document[b:]
    document=document.replace('</style>','.cad-sheet img{left:50%;top:50%;width:100%;height:100%;object-fit:contain;transform:translate(-50%,-50%)}\n</style>')
    (stage/'index.html').write_text(document)
    for name in ('model.glb','front-view.svg','outer-profile.json','cad-sheet.png','actual-photo.webp','process-photo.webp'):
        (stage/'assets'/name).unlink(missing_ok=True)
    return {'mode':'multiple','review':review,'inputsSha256':prepared['inputsSha256'],
            **({'generated':[f'assets/{p["id"]}/{name}' for p in prepared['parts'] for name in ('front-view.svg','wire-guide.json','model.glb','material-evidence.json','surface-regions.json') if (stage/'assets'/p['id']/name).is_file()],
                'retainedReference':['shared multiple scene, per-part complete CAD solids and BRep guides']} if feature else {}),
            'scope':'Multiple feature solids; upright assembly candidate; visual adoption pending' if feature else 'Multiple rotational vessels; provisional materials and scene; visual review pending'}
