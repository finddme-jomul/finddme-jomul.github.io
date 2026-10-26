"""Reviewed presentation options and CAD-backed annotations for drawing-review."""
import math

def finite(v):
    return not isinstance(v,bool) and isinstance(v,(int,float)) and math.isfinite(v)

def validate(record):
    sides=record.get('leaderSides',{})
    if not isinstance(sides,dict) or set(sides)-{'A','B','handle'} or any(v not in ('left','right') for v in sides.values()):
        raise ValueError('leaderSides supports A/B/handle and left/right')
    options=record.get('dimensionOptions',{})
    if not isinstance(options,dict) or set(options)-{'front','plan'}:raise ValueError('dimensionOptions supports front/plan')
    for view,axes in options.items():
        if not isinstance(axes,dict) or set(axes)-{'horizontal','vertical'}:raise ValueError('Invalid dimension axes')
        for axis,opts in axes.items():
            allowed={'dx','dy','below'} if axis=='horizontal' else {'dx','dy','side'}
            if not isinstance(opts,dict) or set(opts)-allowed:raise ValueError('Invalid dimension options')
            for key in ('dx','dy'):
                if key in opts and (not finite(opts[key]) or abs(opts[key])>40):raise ValueError('Dimension label offset must be within 40 sheet units')
            if 'below' in opts and not isinstance(opts['below'],bool):raise ValueError('below must be boolean')
            if 'side' in opts and opts['side'] not in ('left','right'):raise ValueError('side must be left/right')
    radii=record.get('radiusAnnotations',[])
    if not isinstance(radii,list) or len(radii)>4 or any(type(i) is not int or i<0 for i in radii) or len(set(radii))!=len(radii):
        raise ValueError('radiusAnnotations must contain up to four unique section edge indices')
    notes=record.get('numberedNotes',[])
    if not isinstance(notes,list) or len(notes)>4:raise ValueError('At most four numberedNotes')
    for note in notes:
        if not isinstance(note,dict) or set(note)!={'view','pointMm','text'}:raise ValueError('Numbered note needs view, pointMm, text')
        if note['view'] not in ('front','plan','side','section'):raise ValueError('Invalid numbered note view')
        point=note['pointMm']
        if not isinstance(point,list) or len(point)!=2 or not all(finite(v) for v in point):raise ValueError('Invalid numbered note point')
        if not isinstance(note['text'],str) or not 1<=len(note['text'])<=150:raise ValueError('Invalid numbered note text')

def catalog(cut,source_hash):
    from build123d import GeomType
    rows=[]
    for index,edge in enumerate(cut.edges()):
        if edge.geom_type!=GeomType.CIRCLE:continue
        point=edge.position_at(.25);centre=edge.arc_center
        rows.append({'edgeIndex':index,'radiusMm':edge.radius,'centerMm':[centre.X,centre.Z],
                     'pointMm':[point.X,point.Z],'sourceStepSha256':source_hash,'evidence':'analytic-circle-section-edge'})
    return rows

def bind(record,views,circles):
    selected=[]
    for i,index in enumerate(record.get('radiusAnnotations',[])):
        row=next((r for r in circles if r['edgeIndex']==index),None)
        if row is None:raise ValueError('Requested radius is not an analytic circle in the archived STEP section')
        selected.append(dict(row,code=f'R{i+1}'))
    for note in record.get('numberedNotes',[]):
        px,py=note['pointMm'];distance=float('inf')
        for curve in views[note['view']]['visible']:
            for a,b in zip(curve,curve[1:]):
                dx,dy=b[0]-a[0],b[1]-a[1];length=dx*dx+dy*dy
                t=max(0,min(1,((px-a[0])*dx+(py-a[1])*dy)/length)) if length else 0
                distance=min(distance,math.hypot(px-a[0]-t*dx,py-a[1]-t*dy))
        if distance>.25:raise ValueError('Numbered note anchor must be within 0.25 mm of visible CAD geometry')
    return selected
