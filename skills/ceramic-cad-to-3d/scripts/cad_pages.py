"""Compose reviewed landscape CAD pages from archived BRep drawing views."""
import math,json,re,xml.etree.ElementTree as ET
from feature_drawing import draw_view
from shared_sheet_poc import esc,label,line
NS='{http://www.w3.org/2000/svg}'

def validate(presentation,ids):
    if presentation is None:return
    groups=presentation.get('groups')
    if not isinstance(groups,list) or not 1<=len(groups)<=3:raise ValueError('CAD presentation requires one to three groups')
    if presentation.get('clickToZoom') is not True:raise ValueError('Grouped CAD requires click-to-zoom')
    flat=[];names=[]
    for g in groups:
        if not isinstance(g.get('id'),str) or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',g['id']):raise ValueError('Invalid CAD group ID')
        if not isinstance(g.get('title'),str) or not g['title'].strip():raise ValueError('CAD group title required')
        if not isinstance(g.get('partIds'),list) or not 1<=len(g['partIds'])<=3:raise ValueError('CAD group requires one to three source parts')
        extra=g.get('extraScrollVh',0)
        if isinstance(extra,bool) or not isinstance(extra,(int,float)) or not math.isfinite(extra) or not 0<=extra<=500:raise ValueError('CAD extraScrollVh must be finite, between 0 and 500')
        flat.extend(g['partIds']);names.append(g['id'])
    if len(set(names))!=len(names) or len(flat)!=len(set(flat)) or set(flat)!=set(ids):raise ValueError('CAD groups must partition source parts exactly once')

def install(project,stage,presentation,parts):
    if presentation is None:return None
    manifest=json.loads((project/'geometry/drawing-manifest.json').read_text())
    ids=[p['id'] for p in manifest['parts']];validate(presentation,ids)
    sheet=ET.parse(project/'geometry'/manifest['layouts']['desktop']['file']).getroot()
    sources={g.get('data-part'):g for g in sheet if g.get('data-part')}
    pages=[]
    for group in presentation['groups']:
        width,height=1800,1000;pw=width/len(group['partIds']);boxes={}
        body=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">','<style>text{fill:#55514e;font-family:Arial,sans-serif}.fine{stroke:#55514e;stroke-width:.7}</style>',f'<rect width="{width}" height="{height}" fill="white"/>']
        for i,pid in enumerate(group['partIds']):
            x=i*pw;body.extend([f'<g data-part="{esc(pid)}">',label(x+24,35,pid.upper(),20)])
            cols=3 if len(group['partIds'])==1 else 2;rows=2 if cols==3 else 3;vw=(pw-40)/cols;vh=(height-120)/rows
            for j,key in enumerate(('front','plan','side','section','isometric','wire')):
                source=next(g for g in sources[pid] if g.get('data-view')==key);view={'visible':[],'hidden':[]}
                for path in source:
                    if path.tag!=NS+'polyline':continue
                    points=[[float(v) for v in pair.split(',')] for pair in path.get('points').split()]
                    view['hidden' if path.get('stroke-dasharray') else 'visible'].append([[a,-b,0] for a,b in points])
                drawing,box=draw_view(view,(x+20+j%cols*vw,55+j//cols*vh,vw,vh),{'section':'SECTION','wire':'CAD SECTION GUIDE'}.get(key,key.upper()))
                body.append(f'<g data-view="{key}">{drawing}</g>')
                if key=='front':
                    original=manifest['layouts']['desktop']['frontBoxes'][pid]
                    boxes[pid]={**original,**{k:v/(width if k in ('cx','width') else height) for k,v in box.items()}}
                    bounds=json.loads((project/'geometry'/pid/'manifest.json').read_text())['boundsMm'];w=bounds['max'][0]-bounds['min'][0];h=bounds['max'][2]-bounds['min'][2]
                    body.append(label(x+24,height-28,f'W {w:.2f} / H {h:.2f} mm',14))
            body.append('</g>')
        body.append('</svg>');filename=f'cad-group-{group["id"]}.svg';(stage/'assets'/filename).write_text(''.join(body))
        alias={p['id']:boxes[p.get('sourcePartId',p['id'])] for p in parts if p.get('sourcePartId',p['id']) in boxes}
        pages.append({**group,'file':filename,'pagePx':[width,height],'frontBoxes':alias})
    return {'pages':pages,'clickToZoom':True}
