"""BRep-derived feature drawing candidates and section-curve wire guides."""
import hashlib
import json
import math
from build123d import Plane, import_step, section
from ceramic_paths import PROFILE
from shared_sheet_poc import esc, label, line


def sample(edges, segments=48):
    return [[[p.X,p.Y,p.Z] for p in edge.positions([i/segments for i in range(segments+1)])]
            for edge in edges if edge.length > 1e-7]


def curves(model, policy):
    box=model.bounding_box()
    groups=[{'kind':'brep-edge','lines':sample(model.edges(),policy['curveSegments'])}]
    for axis,count in [('Z',policy['horizontalSections']),('X',policy['verticalSections']),('Y',policy['verticalSections'])]:
        lo,hi=getattr(box.min,axis),getattr(box.max,axis)
        normal={'X':(1,0,0),'Y':(0,1,0),'Z':(0,0,1)}[axis]
        for i in range(1,count+1):
            at=lo+(hi-lo)*i/(count+1)
            origin=[0,0,0];origin['XYZ'.index(axis)]=at
            cut=section(model,Plane(origin=origin,z_dir=normal))
            lines=sample(cut.edges(),policy['curveSegments'])
            if lines: groups.append({'kind':'section','axis':axis,'coordinateMm':at,'lines':lines})
    return groups


def extent(lines):
    points=[p for curve in lines for p in curve]
    if not points: raise ValueError('Empty CAD view')
    return [min(p[0] for p in points),min(p[1] for p in points),max(p[0] for p in points),max(p[1] for p in points)]


def project(model,direction,up=(0,0,1)):
    center=list(model.bounding_box().center())
    distance=model.bounding_box().diagonal*4+1
    eye=tuple(center[i]+direction[i]*distance for i in range(3))
    visible,hidden=model.project_to_viewport(eye,viewport_up=up,look_at=center)
    return {'visible':sample(visible),'hidden':sample(hidden)}


def draw_view(view,rect,title):
    x,y,w,h=rect
    all_lines=view['visible']+view.get('hidden',[])
    a,b,c,d=extent(all_lines)
    scale=min((w-48)/max(c-a,1e-6),(h-65)/max(d-b,1e-6))
    cx,cy=x+w/2,y+(h-25)/2
    ox,oy=(a+c)/2,(b+d)/2
    body=[label(x+w/2,y+h-8,title,12,'middle')]
    for key in ('hidden','visible'):
        for points in view.get(key,[]):
            coords=' '.join(f'{cx+(p[0]-ox)*scale:.5f},{cy-(p[1]-oy)*scale:.5f}' for p in points)
            attrs=' stroke-dasharray="3 3" opacity=".3"' if key=='hidden' else ''
            body.append(f'<polyline points="{coords}" fill="none" stroke="#55514e" stroke-width=".75"{attrs}/>')
    box={'cx':cx,'cy':cy,'width':(c-a)*scale,'height':(d-b)*scale}
    return ''.join(body),box


def prepare(part,out,policy):
    path=out/part['id'];model=import_step(path/'model.step')
    groups=curves(model,policy)
    positions=[]
    for group in groups:
        for points in group['lines']:
            for a,b in zip(points,points[1:]):
                for x,y,z in (a,b):positions.extend([x/1000,z/1000,-y/1000])
    digest=hashlib.sha256((path/'model.step').read_bytes()).hexdigest()
    guide={'schemaVersion':1,'partId':part['id'],'status':'candidate','sourceStepSha256':digest,
           'source':'BRep edges and plane/solid section boundaries; no mesh tessellation',
           'policy':policy,'coordinates':'CAD mm Z-up; browser metres Y-up [x,z,-y]',
           'groups':groups,'positionsYUpMetres':positions}
    (path/'wire-guide.json').write_text(json.dumps(guide,separators=(',',':'))+'\n')
    box=model.bounding_box();center=box.center()
    section_curves=sample(section(model,Plane(origin=(0,center.Y,0),z_dir=(0,1,0))).edges())
    views={'front':project(model,(0,-1,0)), 'plan':project(model,(0,0,1),up=(0,1,0)),
           'side':project(model,(1,0,0)), 'isometric':project(model,(1,-1,1)),
           'section':{'visible':[[[x,z,0] for x,y,z in points] for points in section_curves]}}
    # A static axonometric guide drawing lets reviewers inspect actual section curves.
    views['wire']={'visible':[[[(x+y)/math.sqrt(2),z-(y-x)/math.sqrt(6),0] for x,y,z in points]
                               for group in groups for points in group['lines']]}
    return {'part':part,'views':views,'bounds':box,'sourceStepSha256':digest}


def build(config,out):
    policy=json.loads(PROFILE.read_text())['wire3d']['featureSections']
    prepared=[prepare(p,out,policy) for p in config['parts']]
    manifest={'schemaVersion':1,'status':'candidate','units':'mm','parts':[{'id':p['part']['id'],'sourceStepSha256':p['sourceStepSha256']} for p in prepared],
              'frontView':{'cameraDirection':[0,-1,0],'upAxis':[0,0,1],'projection':'orthographic'},'layouts':{},
              'limitations':['Section edges shown without material hatching','Wire density and drawing composition await visual adoption','No page/renderer integration']}
    for layout in ('desktop','mobile','mobile-short'):
        panel_w,panel_h=(960,760) if layout=='desktop' else (720,1050 if layout=='mobile' else 900)
        columns=min(2,len(prepared)) if layout=='desktop' else 1
        width,height=columns*panel_w,math.ceil(len(prepared)/columns)*panel_h
        body=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" style="max-width:100%;height:auto" role="img" aria-label="Feature CAD drawing candidate">',
              '<style>text{fill:#55514e;font-family:Arial,sans-serif}.fine{stroke:#55514e;stroke-width:.7}</style>',f'<rect width="{width}" height="{height}" fill="white"/>']
        boxes={}
        for i,item in enumerate(prepared):
            x,y=i%columns*panel_w,i//columns*panel_h
            pid=item['part']['id'];b=item['bounds']
            body.append(f'<g data-part="{esc(pid)}">')
            body.append(label(x+24,y+30,pid.upper(),17))
            body.append(label(x+24,y+50,'INPUT mm / SOLID / REVIEW CANDIDATE',11))
            # Front occupies left upper panel; other views use independent fit.
            vw,vh=(panel_w-40)/2,(panel_h-130)/3
            for j,(key,title) in enumerate([('front','FRONT'),('plan','PLAN'),('side','SIDE'),('section','SECTION AT CENTRE Y'),('isometric','ISOMETRIC'),('wire','CAD SECTION GUIDE')]):
                drawing,box=draw_view(item['views'][key],(x+20+(j%2)*vw,y+62+(j//2)*vh,vw,vh),title)
                body.append(f'<g data-view="{key}">{drawing}</g>')
                if key=='front':
                    boxes[pid]={**{k:box[k]/(width if k in ('cx','width') else height) for k in box},'sourceStepSha256':item['sourceStepSha256'], 'cameraLookAtMm':list(b.center())}
                    # Overall source dimensions, not manufacturing claims.
                    left,right=box['cx']-box['width']/2,box['cx']+box['width']/2
                    bottom=box['cy']+box['height']/2
                    body.extend([line(left,bottom+10,right,bottom+10),label(box['cx'],bottom+23,f'W {b.size.X:.2f}',10,'middle'),
                                 label(right+5,box['cy'],f'H {b.size.Z:.2f}',10)])
            body.append(label(x+24,y+panel_h-27,f'BOUNDING SIZE {b.size.X:.2f} x {b.size.Y:.2f} x {b.size.Z:.2f} mm',11))
            body.append('</g>')
        body.append('</svg>')
        filename=f'sheet-{layout}.svg';(out/filename).write_text(''.join(body))
        manifest['layouts'][layout]={'file':filename,'pagePx':[width,height],'frontBoxes':boxes}
    manifest['layouts']['short']=manifest['layouts']['desktop']
    (out/'drawing-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    verify(config,out)
    return manifest


def verify(config,out):
    import xml.etree.ElementTree as ET
    manifest=json.loads((out/'drawing-manifest.json').read_text())
    ids=[p['id'] for p in config['parts']]
    if [p['id'] for p in manifest['parts']]!=ids: raise ValueError('Drawing part mapping drift')
    for part in config['parts']:
        path=out/part['id'];guide=json.loads((path/'wire-guide.json').read_text())
        if guide['partId']!=part['id'] or guide['sourceStepSha256']!=hashlib.sha256((path/'model.step').read_bytes()).hexdigest():
            raise ValueError('Wire guide source drift')
        values=guide['positionsYUpMetres']
        if not values or len(values)%6 or any(not math.isfinite(v) for v in values): raise ValueError('Invalid wire guide')
    for layout in manifest['layouts'].values():
        svg=ET.parse(out/layout['file']).getroot()
        if [g.get('data-part') for g in svg if g.get('data-part')]!=ids: raise ValueError('SVG part mapping drift')
        if set(layout['frontBoxes'])!=set(ids): raise ValueError('FrontBox IDs drift')
        for box in layout['frontBoxes'].values():
            if not (0<box['width']<=1 and 0<box['height']<=1 and box['width']/2<=box['cx']<=1-box['width']/2 and box['height']/2<=box['cy']<=1-box['height']/2):
                raise ValueError('FrontBox outside sheet')
