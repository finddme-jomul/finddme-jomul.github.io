"""Compose reviewed landscape CAD pages from archived BRep drawing views."""
import math,json,re,xml.etree.ElementTree as ET
from collections import Counter
from feature_drawing import draw_view
from shared_sheet_poc import esc,label,line
NS='{http://www.w3.org/2000/svg}'

def validate(presentation,ids):
    if presentation is None:return
    if presentation.get('handoff', 'last-page') not in ('last-page','retain-fronts'):raise ValueError('Unsupported CAD handoff')
    participating=presentation.get('handoffPartIds',ids)
    if not isinstance(participating,list) or any(p not in ids for p in participating) or len(participating)!=len(set(participating)):raise ValueError('Invalid handoff source parts')
    refresh=presentation.get('refreshOrthographicParts',[])
    if not isinstance(refresh,list) or any(p not in ids for p in refresh):raise ValueError('Unknown orthographic source part')
    groups=presentation.get('groups')
    if not isinstance(groups,list) or not 1<=len(groups)<=3:raise ValueError('CAD presentation requires one to three groups')
    if presentation.get('clickToZoom') is not True:raise ValueError('Grouped CAD requires click-to-zoom')
    flat=[];names=[]
    for g in groups:
        if not isinstance(g.get('id'),str) or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',g['id']):raise ValueError('Invalid CAD group ID')
        if not isinstance(g.get('title'),str) or not g['title'].strip():raise ValueError('CAD group title required')
        if not isinstance(g.get('partIds'),list) or not 1<=len(g['partIds'])<=3:raise ValueError('CAD group requires one to three source parts')
        notes=g.get('dimensionNotes',[])
        if not isinstance(notes,list) or len(notes)>3 or any(not isinstance(n,str) or not n.strip() or len(n)>180 for n in notes):raise ValueError('CAD dimensionNotes requires up to three nonempty lines (180 characters each)')
        sections=g.get('sections')
        if sections is not None:
            if not isinstance(sections,dict) or set(sections)!=set(g['partIds']):raise ValueError('CAD sections must cover every source part')
            rectangles=[]
            for rect in sections.values():
                if not isinstance(rect,list) or len(rect)!=4 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) for v in rect):raise ValueError('CAD section requires normalized x/y/width/height')
                x,y,w,h=rect
                if min(x,y)<0 or w<.25 or h<.45 or x+w>1.000001 or y+h>1.000001:raise ValueError('CAD section outside sheet or too small')
                for a,b,c,d in rectangles:
                    if x<a+c-1e-6 and a<x+w-1e-6 and y<b+d-1e-6 and b<y+h-1e-6:raise ValueError('CAD sections overlap')
                rectangles.append(rect)
        extra=g.get('extraScrollVh',0)
        if isinstance(extra,bool) or not isinstance(extra,(int,float)) or not math.isfinite(extra) or not 0<=extra<=500:raise ValueError('CAD extraScrollVh must be finite, between 0 and 500')
        flat.extend(g['partIds']);names.append(g['id'])
    if len(set(names))!=len(names) or len(flat)!=len(set(flat)) or set(flat)!=set(ids):raise ValueError('CAD groups must partition source parts exactly once')

def production_notes(pid,parts):
    instances=[p for p in parts if p.get('sourcePartId',p['id'])==pid]
    appearances=[p.get('appearance',p) for p in instances]
    clay=list(dict.fromkeys(a.get('glazePreview',{}).get('clayName','') for a in appearances))
    counts=Counter()
    for a in appearances:
        g=a.get('glazePreview',{})
        names=list(dict.fromkeys(n for n in (g.get('baseName'),g.get('accentName') if a.get('accentEnabled') or a.get('coatings') else None) if n))
        if names:counts[' + '.join(names)]+=1
    notes=[f'QTY {len(instances)} TOTAL']
    if any(clay):notes.append('CLAY  '+' / '.join(n for n in clay if n))
    notes.extend(f'GLAZE  {name}  |  QTY {qty}' for name,qty in counts.items())
    return notes

def install(project,stage,presentation,parts):
    if presentation is None:return None
    manifest=json.loads((project/'geometry/drawing-manifest.json').read_text())
    ids=[p['id'] for p in manifest['parts']];validate(presentation,ids)
    sheet=ET.parse(project/'geometry'/manifest['layouts']['desktop']['file']).getroot()
    sources={g.get('data-part'):g for g in sheet if g.get('data-part')}
    fresh={}
    for pid in presentation.get('refreshOrthographicParts',[]):
        from build123d import import_step
        from feature_drawing import project as project_view,axisymmetric_input
        from ceramic_paths import ROOT
        solid=import_step(project/'geometry'/pid/'model.step')
        config=json.loads((project/'input/config.json').read_text())
        part=next(part for part in config['parts'] if part['id']==pid)
        symmetric=axisymmetric_input(json.loads((ROOT/part['shape']).read_text()))
        fresh[pid]={key:project_view(solid,direction,axisymmetric=symmetric) for key,direction in [('front',(0,-1,0)),('side',(1,0,0))]}
    pages=[]
    for group in presentation['groups']:
        width,height=1800,1000;boxes={}
        body=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">','<style>text{fill:#55514e;font-family:Arial,sans-serif}.fine{stroke:#55514e;stroke-width:.7}</style>',f'<rect width="{width}" height="{height}" fill="white"/>']
        for i,pid in enumerate(group['partIds']):
            rect=group.get('sections',{}).get(pid,[i/len(group['partIds']),0,1/len(group['partIds']),1])
            x,y,rw,rh=[v*scale for v,scale in zip(rect,(width,height,width,height))]
            notes=production_notes(pid,parts)
            body.extend([f'<g data-part="{esc(pid)}">',label(x+24,y+35,pid.upper(),20)])
            note_space=80 if group.get('dimensionNotes') else 0
            cols=3 if len(group['partIds'])==1 or rw/rh>1.5 else 2;rows=2 if cols==3 else 3;vw=(rw-40)/cols;vh=(rh-120-note_space-len(notes)*23)/rows
            for j,key in enumerate(('front','plan','side','section','isometric','wire')):
                source=next(g for g in sources[pid] if g.get('data-view')==key);view={'visible':[],'hidden':[]}
                for path in source:
                    if path.tag!=NS+'polyline':continue
                    points=[[float(v) for v in pair.split(',')] for pair in path.get('points').split()]
                    view['hidden' if path.get('stroke-dasharray') else 'visible'].append([[a,-b,0] for a,b in points])
                if key in fresh.get(pid,{}):view=fresh[pid][key]
                view_rect=(x+20+j%cols*vw,y+55+note_space+j//cols*vh,vw,vh)
                if group.get('sections') and rw/rh>1.5:
                    area_w,area_h=rw-40,rh-120-note_space-len(notes)*23
                    if j==0:view_rect=(x+20,y+55+note_space,area_w*.30,area_h)
                    else:view_rect=(x+20+area_w*.30+(j-1)%3*area_w*.70/3,y+55+note_space+(j-1)//3*area_h/2,area_w*.70/3,area_h/2)
                drawing,box=draw_view(view,view_rect,{'section':'SECTION','wire':'CAD SECTION GUIDE'}.get(key,key.upper()))
                body.append(f'<g data-view="{key}">{drawing}</g>')
                if key=='front':
                    if pid in fresh:
                        first=next(p for p in parts if p.get('sourcePartId',p['id'])==pid)
                        asset=stage/'assets'/first.get('geometryAssetId',first['id']);asset.mkdir(exist_ok=True)
                        crop=[box['cx']-box['width']/2,box['cy']-box['height']/2,box['width'],box['height']]
                        root=ET.fromstring(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(map(str,crop))}">{drawing}</svg>')
                        for text in list(root):
                            if text.tag==NS+'text':root.remove(text)
                        ET.ElementTree(root).write(asset/'front-view.svg',encoding='unicode')
                    original=manifest['layouts']['desktop']['frontBoxes'][pid]
                    boxes[pid]={**original,**{k:v/(width if k in ('cx','width') else height) for k,v in box.items()}}
                    bounds=json.loads((project/'geometry'/pid/'manifest.json').read_text())['boundsMm'];w=bounds['max'][0]-bounds['min'][0];h=bounds['max'][2]-bounds['min'][2]
                    body.append(label(x+24,y+rh-28-len(notes)*23,f'W {w:.2f} / H {h:.2f} mm',14))
            for n,note in enumerate(notes):body.append(label(x+24,y+rh-28-(len(notes)-1-n)*23,note,16))
            body.append('</g>')
        for n,note in enumerate(group.get('dimensionNotes',[])):
            body.append(label(24,76+n*20,note,16))
        body.append('</svg>');filename=f'cad-group-{group["id"]}.svg';(stage/'assets'/filename).write_text(''.join(body))
        alias={p['id']:boxes[p.get('sourcePartId',p['id'])] for p in parts if p.get('sourcePartId',p['id']) in boxes}
        pages.append({**group,'file':filename,'pagePx':[width,height],'frontBoxes':alias})
    return {'pages':pages,'clickToZoom':True,'handoff':presentation.get('handoff','last-page'),'handoffPartIds':presentation.get('handoffPartIds',ids),'refreshOrthographicParts':presentation.get('refreshOrthographicParts',[])}
