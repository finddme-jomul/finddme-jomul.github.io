"""Source-derived dimensional drawing reviews; no per-project geometry scripts."""
import argparse
import hashlib
import json
import math
import re
import shutil
import tempfile
from pathlib import Path
from html import escape

from ceramic_paths import ROOT, SKILL
import dimensional_kit as kit


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def extent(view):
    points=[p for key in ('visible','hidden') for curve in view.get(key,[]) for p in curve]
    if not points: raise ValueError('Empty drawing view')
    return [min(p[0] for p in points),min(p[1] for p in points),max(p[0] for p in points),max(p[1] for p in points)]


def read_input(path):
    data=json.loads(path.read_text())
    if data.get('schemaVersion')!=1 or data.get('status') not in ('reviewed-provisional','user-confirmed'):
        raise ValueError('Drawing review requires schemaVersion 1 and reviewed status')
    project=(ROOT/data['sourceProject']).resolve()
    config=json.loads((project/'input/config.json').read_text())
    known={p['id']:p for p in config['parts']}
    parts=data.get('parts')
    if not isinstance(parts,list) or not parts: raise ValueError('Nonempty drawing parts required')
    ids=[]
    for p in parts:
        pid=p.get('id','')
        if pid not in known or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',pid) or pid in ids:
            raise ValueError('Unknown, duplicate or invalid drawing part')
        ids.append(pid)
        if set(p)-{'id','notes','details'}: raise ValueError('Unknown drawing part fields')
        notes=p.get('notes',[])
        if not isinstance(notes,list) or len(notes)>4 or any(not isinstance(n,str) or len(n)>150 for n in notes):
            raise ValueError('At most four notes of 150 characters')
        details=p.get('details',[])
        if not isinstance(details,list) or len(details)>2: raise ValueError('At most two detail regions per part')
        for d in details:
            if d.get('view') not in ('front','section'): raise ValueError('Detail view must be front or section')
            b=d.get('boundsMm')
            if not isinstance(b,list) or len(b)!=4 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) for v in b) or b[2]<=b[0] or b[3]<=b[1]:
                raise ValueError('Detail requires finite increasing boundsMm [minX,minY,maxX,maxY]')
            if not isinstance(d.get('label'),str) or not 1<=len(d['label'])<=36: raise ValueError('Detail label required (36 characters max)')
    return data,project,config


def rotational_views(part,model,archive):
    """Use the maintained CAD profile, not tessellated face edges, for vessel views."""
    from shared_sheet_poc import load_part
    from isometric_geometry import geometry
    data=load_part(part);profile=data['profile'];dims=data['dimensions']
    bounds=model.bounding_box();centre=bounds.center()
    if (abs(bounds.size.Z-dims['height'])>.15 or abs(bounds.size.X-dims['maxDiameter'])>.15
            or abs(centre.X)>.15 or abs(centre.Y)>.15 or abs(bounds.min.Z)>.15):
        raise ValueError('Archived rotational STEP and reviewed profile bounds disagree')
    for key in ('profile','dimensions','material'):
        shutil.copy2(ROOT/part[key],archive/f'{part["id"]}-{key}.json')
    left=[[-r,z-centre.Z,0] for r,z in profile]
    right=[[r,z-centre.Z,0] for r,z in profile]
    front={'visible':[left,right,[left[0],right[0]],[left[-1],right[-1]]],'hidden':[]}
    def ring(r):return [[r*math.cos(i*math.pi/64),r*math.sin(i*math.pi/64),0] for i in range(129)]
    radii=sorted(set([dims['maxDiameter']/2,dims['openingDiameter']/2,max(.01,dims['openingDiameter']/2-dims['wallThickness'])]))
    plan={'visible':[ring(r) for r in radii],'hidden':[ring(dims['footDiameter']/2)]}
    iso=geometry(profile,dims,0,0,1)
    visible=[[[x,y,0] for x,y in line] for line in iso['sides']+iso['rims']]
    hidden=[]
    for row in iso['rings']:
        visible.append([[x,y,0] for x,y in row['front']])
        hidden.append([[x,y,0] for x,y in row['back']])
    return {'front':front,'side':front,'plan':plan,'isometric':{'visible':visible,'hidden':hidden}}


def prepare(project,part,record,archive):
    from build123d import import_step, Plane, section
    from feature_drawing import project as project_view, sample, axisymmetric_input
    pid=part['id']
    candidates=[project/'geometry'/pid/'model.step',project/'cad/solid'/pid/'model.step']
    source=next((p for p in candidates if p.is_file()),None)
    if source is None: raise ValueError(f'No generated STEP for {pid}')
    target=archive/f'{pid}.step';shutil.copy2(source,target)
    model=import_step(target)
    b=model.bounding_box();c=b.center()
    symmetric=part.get('shapeKind','rotational-profile')=='rotational-profile'
    if 'shape' in part:
        shape=ROOT/part['shape']
        symmetric=axisymmetric_input(json.loads(shape.read_text())) if shape.is_file() else False
    if part.get('shapeKind','rotational-profile')=='rotational-profile' and 'profile' in part:
        views=rotational_views(part,model,archive)
    else:
        views={key:project_view(model,direction,up=up,axisymmetric=symmetric)
               for key,direction,up in [('front',(0,-1,0),(0,0,1)),('plan',(0,0,1),(0,1,0)),('side',(1,0,0),(0,0,1)),('isometric',(1,-1,1),(0,0,1))]}
    cut=section(model,Plane(origin=(0,c.Y,0),z_dir=(0,1,0)))
    views['section']={'visible':[[[x,z,0] for x,y,z in line] for line in sample(cut.edges(),96)]}
    # Ordered closed face wires supply actual material regions, including holes.
    regions=[]
    for face in cut.faces():
        loops=[]
        for wire in [face.outer_wire(),*face.inner_wires()]:
            points=wire.positions([i/256 for i in range(257)])
            loops.append([[p.X,p.Z] for p in points])
        regions.append(loops)
    views['section']['regions']=regions
    stations=[]
    for fraction in (.25,.5,.75):
        z=b.min.Z+b.size.Z*fraction
        slice_shape=section(model,Plane(origin=(0,0,z),z_dir=(0,0,1)))
        if not slice_shape.edges():continue
        bounds=slice_shape.bounding_box()
        stations.append({'code':f'W{round(fraction*100)}','heightMm':z-b.min.Z,
                         'widthMm':bounds.size.X,'endpoints':[[bounds.min.X-c.X,z-c.Z],[bounds.max.X-c.X,z-c.Z]]})
    details=record.get('details',[])
    if not details:
        if b.size.Z/min(b.size.X,b.size.Y)<.3:
            a,y,z,t=extent(views['section']);crop=min((z-a)*.4,(t-y)*2)
            details=[{'view':'section','label':'LEFT SECTION EDGE','boundsMm':[a,y,a+crop,t]},
                     {'view':'section','label':'RIGHT SECTION EDGE','boundsMm':[z-crop,y,z,t]}]
        else:
            a,y,z,t=extent(views['front']);h=t-y
            details=[{'view':'front','label':'UPPER PROFILE','boundsMm':[a,y+h*.72,z,t]},
                     {'view':'front','label':'LOWER PROFILE','boundsMm':[a,y,z,y+h*.28]}]
    for d in details:
        lo,bo,hi,to=d['boundsMm'];a,y,z,t=extent(views[d['view']])
        if lo<a-1e-5 or bo<y-1e-5 or hi>z+1e-5 or to>t+1e-5: raise ValueError(f'{pid}: detail outside source view')
        if not any(lo<=p[0]<=hi and bo<=p[1]<=to for curve in views[d['view']]['visible'] for p in curve):
            raise ValueError(f'{pid}: detail contains no source geometry')
    return {'id':pid,'sourceStepSha256':sha(target),'sourcePath':str(source),
            'boundsMm':{'min':list(b.min),'max':list(b.max)},'cameraLookAtMm':list(c),
            'dimensionsMm':{'W':b.size.X,'H':b.size.Z,'D':b.size.Y},
            'views':views,'details':details,'stations':stations,'notes':record.get('notes',[])}


def draw_view(view,rect,title,uid,bounds=None,dimensions=None):
    x,y,w,h=rect;a,b,c,d=bounds or extent(view)
    scale=min((w-100)/max(c-a,1e-8),(h-90)/max(d-b,1e-8))
    cx,cy=x+w/2,y+(h-30)/2
    def point(p):return (cx+(p[0]-(a+c)/2)*scale,cy-(p[1]-(b+d)/2)*scale)
    left,top=point((a,d));right,bottom=point((c,b))
    clip=f'{uid}-clip'
    out=[f'<defs><clipPath id="{clip}"><rect x="{left:.5f}" y="{top:.5f}" width="{right-left:.5f}" height="{bottom-top:.5f}"/></clipPath></defs>']
    out.append(f'<g clip-path="url(#{clip})" data-geometry="{uid}">')
    for loops in view.get('regions',[]):
        commands=[]
        for loop in loops:
            coords=[point(p) for p in loop]
            commands.append('M'+' L'.join(f'{px:.5f},{py:.5f}' for px,py in coords)+' Z')
        out.append(f'<path d="{" ".join(commands)}" fill="url(#dd-hatch)" fill-rule="evenodd"/>')
    for key in ('hidden','visible'):
        for curve in view.get(key,[]):
            coords=' '.join(f'{px:.5f},{py:.5f}' for px,py in map(point,curve))
            out.append(f'<polyline points="{coords}" class="{"outline" if key=="visible" else "hidden"}"/>')
    out.append('</g>')
    out.extend([kit.text(cx,y+h-12,title,'title','middle'),kit.text(cx,y+h+5,f'{scale:.2f} sheet units / mm','small','middle')])
    if dimensions:
        out.extend([kit.dim_h(left,right,top-24,top,dimensions[0]),kit.dim_v(top,bottom,left-25,left,dimensions[1])])
    return ''.join(out),{'cx':cx,'cy':cy,'width':right-left,'height':bottom-top},point


def panel(item,layout):
    mobile=layout!='desktop'
    w,h=(900,1900) if mobile else (1700,1060)
    if mobile:
        rects={'front':(20,150,530,610),'isometric':(540,170,340,300),'plan':(540,490,340,250),'side':(20,800,280,310),'section':(310,800,280,310)}
        detail_rects=[(20,1510,420,340),(460,1510,420,340)]
        tx,ty,tw=620,820,250
    else:
        rects={'front':(390,110,620,580),'isometric':(20,330,350,340),'plan':(1030,85,280,270),'side':(1030,390,280,300),'section':(20,710,350,290)}
        detail_rects=[(390,735,460,270),(880,735,460,270)]
        tx,ty,tw=1370,100,290
    shallow=item['dimensionsMm']['H']/min(item['dimensionsMm']['W'],item['dimensionsMm']['D'])<.3
    if shallow:
        rects['front'],rects['plan']=rects['plan'],rects['front']
    out=[f'<g data-part="{item["id"]}">',kit.text(30,40,item['id'].replace('-',' ').upper(),'head'),kit.text(30,64,'CAD-DERIVED / mm / REVIEW CANDIDATE','small')]
    front=None;transforms={}
    for key,rect in rects.items():
        dims=None
        if key=='front':dims=(f'W  {item["dimensionsMm"]["W"]:.2f}',f'H  {item["dimensionsMm"]["H"]:.2f}')
        if key=='plan':dims=(f'W  {item["dimensionsMm"]["W"]:.2f}',f'D  {item["dimensionsMm"]["D"]:.2f}')
        drawing,box,transform=draw_view(item['views'][key],rect,'SECTION A–A' if key=='section' else key.upper(),item['id']+'-'+key,dimensions=dims)
        out.append(f'<g data-view="{key}">{drawing}</g>');transforms[key]=transform
        if key=='front':front=box
    for i,detail in enumerate(item['details']):
        code=chr(65+i);key=detail['view'];a,b,c,d=detail['boundsMm']
        drawing,box,_=draw_view(item['views'][key],detail_rects[i],f'DETAIL {code} · {detail["label"]}',item['id']+'-detail-'+code,bounds=detail['boundsMm'])
        out.append(f'<g data-detail="{code}" data-source-view="{key}">{drawing}</g>')
        transform=transforms[key];cx,cy=transform(((a+c)/2,(b+d)/2));left,top=transform((a,d));right,bottom=transform((c,b))
        out.append(kit.detail_ref(cx,cy,min(math.hypot(right-left,bottom-top)/2,60),f'DETAIL {code}',right+18,cy))
    transform=transforms['front']
    for station in item['stations'] if front['height']/4>=25 else []:
        (left,y),(right,_)=map(transform,station['endpoints'])
        out.append(kit.dim_h(left,right,y,y,station['code']))
    rows=[(k,{'W':'Width','H':'Height','D':'Depth'}[k],f'{v:.2f}') for k,v in item['dimensionsMm'].items()]
    rows.extend((s['code'],f'Z {s["heightMm"]:.2f}',f'{s["widthMm"]:.2f}') for s in item['stations'])
    out.append(kit.table(tx,ty,'DIMENSIONS',rows,tw))
    out.append(kit.notes(tx,ty+250,['W/H/D are archived STEP bounds. W25/50/75 are section widths at 25/50/75% height. Z is height from the CAD bottom.','Read dimensions; do not scale from screen.','Detail crops preserve the actual CAD curves.',*item['notes']],width=34 if mobile else 40))
    if not mobile:
        out.append(kit.notes(30,110,['Front and side are orthographic views.','Section A–A cuts the CAD centre Y plane.','Hatching marks cut material; openings remain clear.','Dashed lines indicate hidden edges.'],width=43))
    out.append('</g>')
    return ''.join(out),front,(w,h)


def render(items,out):
    layouts={}
    for layout in ('desktop','mobile'):
        panels=[panel(item,layout) for item in items]
        width,height=panels[0][2];total=height*len(items)
        body=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{total}" viewBox="0 0 {width} {total}" role="img" aria-label="CAD dimensional drawing review">',f'<style>{kit.CSS}</style>',kit.defs(),f'<rect width="{width}" height="{total}" fill="white"/>']
        boxes={}
        for i,(item,(content,box,size)) in enumerate(zip(items,panels)):
            body.append(f'<g transform="translate(0 {i*height})">{content}</g>')
            boxes[item['id']]={**{k:box[k]/(width if k in ('cx','width') else total) for k in box},'cy':(box['cy']+i*height)/total,'sourceStepSha256':item['sourceStepSha256'],'cameraLookAtMm':item['cameraLookAtMm']}
            # Individual sheets make large collections reviewable without shrinking labels.
            single=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}"><style>{kit.CSS}</style>{kit.defs()}<rect width="{width}" height="{height}" fill="white"/>{content}</svg>'
            (out/f'{item["id"]}-{layout}.svg').write_text(single)
        body.append('</svg>');filename=f'sheet-{layout}.svg';(out/filename).write_text(''.join(body))
        layouts[layout]={'file':filename,'pagePx':[width,total],'frontBoxes':boxes}
    return layouts


def build(input_path,output):
    if output.exists(): raise ValueError('Drawing output must be unused; preserve prior review revisions')
    data,project,config=read_input(input_path)
    output.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(dir=output.parent,prefix='.drawing-') as temporary:
        out=Path(temporary)/'review';out.mkdir();archive=out/'sources';archive.mkdir()
        shutil.copy2(input_path,out/'input.json');shutil.copy2(project/'input/config.json',out/'source-config.json')
        known={p['id']:p for p in config['parts']}
        items=[prepare(project,known[p['id']],p,archive) for p in data['parts']]
        (out/'drawing-plan.json').write_text(json.dumps({'schemaVersion':1,'units':'mm','status':'candidate','parts':items},indent=2)+'\n')
        layouts=render(items,out)
        html=['<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>CAD drawing review</title><style>body{margin:0;background:white}picture,img{display:block;width:100%;height:auto}</style>']
        for item in items:
            pid=item['id'];html.append(f'<picture><source media="(max-width:700px)" srcset="{pid}-mobile.svg"><img src="{pid}-desktop.svg" alt="{escape(pid)} CAD drawing"></picture>')
        (out/'index.html').write_text(''.join(html))
        manifest={'schemaVersion':1,'status':'candidate','renderer':'dimensional-drawing-v2','inputSha256':sha(input_path),'runtimeLockSha256':sha(SKILL/'runtime-lock.json'),'layouts':layouts,'parts':[{'id':p['id'],'sourceStepSha256':p['sourceStepSha256']} for p in items],
                  'limitations':['Standalone drawing review; existing page revisions are not replaced.','Default details are upper/lower profile crops, not inferred manufacturing features.','Dimensions cover CAD bounds and three horizontal section widths; feature-specific manufacturing annotations remain unsupported.'],
                  'files':{p.relative_to(out).as_posix():sha(p) for p in out.rglob('*') if p.is_file()}}
        (out/'drawing-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
        verify(out)
        out.rename(output)
    return manifest


def verify(output):
    manifest=json.loads((output/'drawing-manifest.json').read_text())
    actual={p.relative_to(output).as_posix() for p in output.rglob('*') if p.is_file() and p.name!='drawing-manifest.json'}
    if actual!=set(manifest['files']): raise ValueError('Drawing output file set changed')
    for name,digest in manifest['files'].items():
        p=output/name
        if not p.resolve().is_relative_to(output.resolve()) or sha(p)!=digest: raise ValueError('Drawing output changed: '+name)
    for layout in manifest['layouts'].values():
        for b in layout['frontBoxes'].values():
            if not (0<b['width']<=1 and 0<b['height']<=1 and b['width']/2<=b['cx']<=1-b['width']/2 and b['height']/2<=b['cy']<=1-b['height']/2):raise ValueError('Drawing frontBox outside sheet')
    return manifest


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input',type=Path);parser.add_argument('--output',type=Path);parser.add_argument('--verify',type=Path)
    args=parser.parse_args()
    if args.verify:
        if args.input or args.output:parser.error('--verify cannot be combined with generation')
        verify(ROOT/args.verify);print('CERAMIC_DRAWING_VERIFIED');return
    if not args.input or not args.output:parser.error('--input and --output are required')
    build(ROOT/args.input,ROOT/args.output);print('CERAMIC_DRAWING_REVIEW',ROOT/args.output)
