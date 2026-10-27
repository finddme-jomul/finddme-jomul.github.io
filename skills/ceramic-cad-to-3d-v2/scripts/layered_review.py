"""Explicit coating regions and optional sequential placement for reviewed vessels."""
import math
import re


def region(value, height, bounds=None):
    if value.get('surface') == 'planar-xy':
        finite = lambda v: isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v)
        if bounds is None or set(value) != {'surface', 'planeZMm', 'rectanglesMm'}:
            raise ValueError('Planar XY coatings require feature bounds, planeZMm and rectanglesMm')
        z, rects = value['planeZMm'], value['rectanglesMm']
        if not finite(z) or not bounds['minZ'] <= z <= bounds['maxZ'] or not isinstance(rects, list) or not 1 <= len(rects) <= 256:
            raise ValueError('Invalid planar coating plane or rectangle count')
        for rect in rects:
            if (not isinstance(rect, list) or len(rect) != 4 or not all(finite(v) for v in rect)
                    or not bounds['minX'] <= rect[0] < rect[2] <= bounds['maxX']
                    or not bounds['minY'] <= rect[1] < rect[3] <= bounds['maxY']):
                raise ValueError('Planar rectangles use CAD [minX,minY,maxX,maxY] within part bounds')
        return
    if value == {'surface': 'all'}:

        return
    if (set(value) != {'surface', 'minHeightMm', 'maxHeightMm'} or value['surface'] != 'exterior'
            or not 0 <= value['minHeightMm'] < value['maxHeightMm'] <= height):
        raise ValueError('Coating region needs all surfaces or an exterior height interval')


def coatings(spec, evidence, dims):
    if spec.get('status') != 'reviewed-provisional' or not spec.get('provenance'):
        raise ValueError('Coatings require reviewed preview provenance')
    layers = spec['layers']
    if len(layers) not in ((1,2) if dims.get('bounds') else (2,)) or [l['name'] for l in layers] != [l['name'] for l in evidence]:
        raise ValueError('Coating names/order must match archived material evidence')
    for layer, source in zip(layers, evidence):
        region(layer['region'], dims['height'], dims.get('bounds'))
        if source['application'] == 'exterior-below-dashed-boundary' and layer['region']['surface'] != 'exterior':
            raise ValueError('Exterior coating cannot paint the interior')
        if source['application'] == 'planar-regions' and layer['region']['surface'] != 'planar-xy':
            raise ValueError('Planar application requires explicit planar regions')
        if layer['region']['surface'] == 'planar-xy' and source['application'] != 'planar-regions':
            raise ValueError('Planar region requires matching material evidence')
        if source['application'] == 'full-coat' and layer['region']['surface'] != 'all':
            raise ValueError('Full coat evidence requires all surfaces')
    region(spec['fired']['region'], dims['height'], dims.get('bounds'))
    if len(layers)==1 and (layers[0]['region']!={'surface':'all'} or spec['fired']['region']!={'surface':'all'}):
        raise ValueError('Single feature coating currently requires all surfaces')
    for color in [l['previewHex'] for l in layers]+[spec['fired']['baseHex'], spec['fired']['regionHex']]:
        if not re.fullmatch(r'#[0-9a-fA-F]{6}',color): raise ValueError('Invalid coating preview colour')
    if not 0 <= spec['roughness'] <= 1: raise ValueError('Invalid coating roughness')


def assembly(spec, parts, timing):
    if spec is None: return
    if spec.get('status') != 'reviewed-provisional' or not spec.get('provenance'):
        raise ValueError('Assembly needs reviewed provenance')
    mode=spec.get('mode','lift-place')
    if mode not in ('lift-place','direct-drop'):raise ValueError('Unsupported assembly mode')
    if spec.get('landing') not in (None,'soft-spin') or spec.get('landing') and mode!='direct-drop':raise ValueError('Soft spin requires direct-drop')
    coat_end = (timing['baseGlazeStart'] + timing['baseGlazeDuration'] if timing['accentGlazeStart'] is None else timing['accentGlazeStart'] + timing['accentGlazeDuration'])
    phase=spec.get('phase','after-glaze')
    if phase not in ('after-glaze','during-glaze'):raise ValueError('Unsupported assembly phase')
    if phase=='during-glaze':
        if mode!='direct-drop' or spec.get('landing')!='soft-spin':raise ValueError('Glaze overlap requires direct-drop soft-spin')
        if any(not (p['motion'].get('varyingDropAxis') or p['motion'].get('fixedOrientation')) for p in parts):
            raise ValueError('Glaze overlap requires varyingDropAxis or fixedOrientation for every part')
        entry_end=max(timing['dropStart']+p['motion']['dropDelay']+timing['dropDuration']*p['motion'].get('dropDurationScale',1) for p in parts)
        if not max(entry_end,timing['baseGlazeStart']) <= spec['start'] < coat_end:
            raise ValueError('Glaze overlap must start after entry drops and during coating')
    lower=timing['baseGlazeStart'] if phase=='during-glaze' else coat_end
    if not lower < spec['start'] < spec['start']+spec['duration'] < timing['photoStart']:
        raise ValueError('Assembly must follow coatings and finish before handoff')
    if len(spec['steps']) != len(parts) or {s['partId'] for s in spec['steps']} != {p['id'] for p in parts}:
        raise ValueError('Assembly must reference each part exactly once')
    overlap=spec.get('overlap',False)
    if not isinstance(overlap,bool) or overlap and mode!='direct-drop':raise ValueError('Overlap requires direct-drop')
    end = 0
    previous_start = 0
    for step in spec['steps']:
        if step.get('landingProfile') not in (None,'extended-deceleration') or step.get('landingProfile') and spec.get('landing')!='soft-spin':
            raise ValueError('Extended deceleration requires soft-spin')
        if phase=='during-glaze':
            part=next(p for p in parts if p['id']==step['partId'])
            layers=part.get('coatings',{}).get('layers',[])
            part_end=coat_end if len(layers)>1 or not layers and part.get('accentEnabled',False) else timing['baseGlazeStart']+timing['baseGlazeDuration']
            if 'glazeFinishBeforeContact' in step:
                lead=step['glazeFinishBeforeContact']
                if len(layers)!=1 or isinstance(lead,bool) or not isinstance(lead,(int,float)) or not math.isfinite(lead) or lead<=0:raise ValueError('Contact-linked glaze requires one layer and a positive lead')
                part_end=spec['start']+spec['duration']*(step['start']+step['duration'])-lead
                if part_end<=timing['baseGlazeStart']:raise ValueError('Contact-linked glaze must start before completion')
            if spec['start']+spec['duration']*step['start']>=part_end:
                raise ValueError('Descent must overlap each part actual coating, including single-layer parts')
        elif 'glazeFinishBeforeContact' in step:raise ValueError('Contact-linked glaze requires during-glaze phase')
        if not (previous_start if overlap else end) <= step['start'] < step['start']+step['duration'] <= 1 or (overlap and step['start']+step['duration']<end):
            raise ValueError('Assembly steps must preserve departure and landing order within the stage')
        previous_start = step['start']
        end = step['start']+step['duration']
        if len(step['targetPositionMm']) != 3 or any(not math.isfinite(v) or abs(v)>2000 for v in step['targetPositionMm']):
            raise ValueError('Assembly targets use finite millimetres, Y-up, foot-bottom origin')
        if 'approachOffsetMm' in step:
            offset=step['approachOffsetMm']
            if mode!='direct-drop' or not isinstance(offset,list) or len(offset)!=2 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) or abs(v)>1000 for v in offset):raise ValueError('approachOffsetMm requires finite [X,Z] millimetres for direct-drop')
        if mode=='direct-drop':
            v=step.get('dropHeightMm')
            if isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) or not 0<v<=1000:raise ValueError('Explicit positive dropHeightMm required')
        elif not 0 <= step['liftMm'] <= 1000: raise ValueError('Invalid assembly lift')
    if any(p['motion']['settledScale'] != 1 for p in parts):
        raise ValueError('Assembly currently requires physical scale 1')


def apply_assembly_preset(review):
    """Resolve the adopted motion preset without mutating archived review inputs."""
    import copy
    import json
    from ceramic_paths import PROFILE
    result=copy.deepcopy(review)
    spec=result.get('assembly') if result else None
    if not spec or not spec.get('preset'):return result
    profile=json.loads(PROFILE.read_text())['assembly']['gentleStaggeredDrop']
    if spec['preset']!=profile['preset']:raise ValueError('Unknown assembly preset')
    for key in ('mode','landing','overlap'):
        if key in spec and spec[key]!=profile[key]:raise ValueError('Assembly preset conflicts with '+key)
        spec[key]=profile[key]
    # The foundation is deliberately allowed to land before the upper pieces.
    # Subsequent landings should closely follow one another without rushed falls.
    upper=spec['steps'][1:]
    limit=profile['maxUpperLandingGapToFallDurationRatio']
    for a,b in zip(upper,upper[1:]):
        gap=(b['start']+b['duration'])-(a['start']+a['duration'])
        if gap<0 or gap>limit*min(a['duration'],b['duration'])+1e-9:
            raise ValueError('Adopted gentle-staggered landing gap exceeded; overlap falls instead of rushing descent')
    return result
