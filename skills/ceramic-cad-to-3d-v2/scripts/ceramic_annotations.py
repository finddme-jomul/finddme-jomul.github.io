"""Map reviewed vessel construction evidence to dimensional-drawing semantics."""
import hashlib
import json
import math
import shutil
from ceramic_paths import ROOT


def adapt(part, archive, bounds, section_extent):
    if part.get('shapeKind','rotational-profile') not in ('rotational-profile','handled-vessel') or 'dimensions' not in part:
        return None
    path=ROOT/part['dimensions'];record=json.loads(path.read_text())
    dims=record[part.get('dimensionsKey','valuesMm')];sources=record.get(part.get('sourcesKey','sources'),{})
    height=dims['height']
    if abs(height-(bounds['max'][2]-bounds['min'][2]))>.15 or abs(bounds['min'][2])>.15:
        raise ValueError('Ceramic dimensions and STEP height/origin disagree')
    rows=[]
    def add(code,name,value,field,status,path=path,formula=None):
        if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) or value<0 or (value==0 and code not in ('J1','J2')):
            raise ValueError('Invalid ceramic dimension '+code)
        rows.append({'code':code,'name':name,'valueMm':value,'field':field,'status':status,
                     'sourceFile':f'{part["id"]}-{path.name}',
                     'sourceSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'formula':formula})
        shutil.copy2(path,archive/f'{part["id"]}-{path.name}')
    for code,name,key in [('RM','Rim outer','openingDiameter'),('WT','Radial wall','wallThickness'),('FD','Foot dia.','footDiameter'),('BT','Floor','baseThickness'),('FH','Foot height','footHeight')]:
        if key in dims:add(code,name,dims[key],key,sources.get(key,'unconfirmed'))
    if 'openingDiameter' in dims and 'wallThickness' in dims:
        status='user-confirmed' if all(sources.get(k)=='user-confirmed' for k in ('openingDiameter','wallThickness')) else 'derived-provisional'
        add('HI','Inner rim',dims['openingDiameter']-2*dims['wallThickness'],'openingDiameter,wallThickness',status,formula='RM - 2 * WT')
    a,b,c,d=section_extent
    def crop(x,z,span,label,kind):
        return {'view':'section','label':label,'semantic':kind,
                'boundsMm':[max(a,x-span),max(b,z-span),min(c,x+span),min(d,z+span)]}
    rim=dims['openingDiameter']/2;wall=dims['wallThickness']
    span=max(wall*4,height*.10)
    details=[crop(rim-wall/2,height,span,'RIM / WALL','rim')]
    handle=None
    if part.get('shapeKind')=='handled-vessel' and 'handle' in part:
        hp=ROOT/part['handle'];handle=json.loads(hp.read_text())
        if handle.get('kind')=='centerline-round-section':
            diameter=handle['sectionDiameterMm'];points=handle['centerlineMm']
            upper,lower=sorted((points[0],points[-1]),key=lambda p:p[2],reverse=True)
            status=handle.get('status','unconfirmed')
            for code,name,value,field in [('HD','Handle dia.',diameter,'sectionDiameterMm'),('J1','Upper anchor',upper[2],'centerlineMm endpoint Z'),('J2','Lower anchor',lower[2],'centerlineMm endpoint Z')]:
                add(code,name,value,field,status,hp)
            details.append(crop(upper[0],upper[2],max(diameter*2.5,height*.12),'HANDLE ATTACHMENT','handle'))
            handle={'upper':upper,'diameter':diameter}
        else:handle=None
    if len(details)==1:
        foot=dims.get('footHeight',0);base=dims.get('baseThickness',0)
        details.append(crop(dims['footDiameter']/2,foot,max(foot+base,wall*4,height*.12),'FOOT / FLOOR','foot'))
    return {'rows':rows,'details':details,'dimensions':dims,'handle':handle,
            'legend':'* = provisional / unconfirmed input. W/H/D = CAD bounds.',
            'formula':'HI = RM - 2 x WT (radial construction).'}
