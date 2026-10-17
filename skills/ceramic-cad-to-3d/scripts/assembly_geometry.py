"""Check upright rotational assembly paths against CAD radial sections.

Samples motion and horizontal slices; not a continuous collision proof or a
manufacturing tolerance analysis. Final poses additionally use exact CAD solids.
"""
import bisect
import math
from jomul_handled_solid import make_rotational_solid
from build123d import Vector


def smooth(t):
    t=max(0,min(1,t));return t*t*(3-2*t)


def position(start, step, progress, mode='lift-place'):
    p=max(0,min(1,(progress-step['start'])/step['duration']))
    target=step['targetPositionMm']
    if mode=='direct-drop':return [target[0],target[1]+step['dropHeightMm']*(1-smooth(p)),target[2]]
    top=max(start[1],target[1])+step['liftMm']
    if p<1/3:return [start[0],start[1]+(top-start[1])*smooth(p*3),start[2]]
    if p<2/3:
        t=smooth(p*3-1);return [start[0]+(target[0]-start[0])*t,top,start[2]+(target[2]-start[2])*t]
    return [target[0],top+(target[1]-top)*smooth(p*3-2),target[2]]


def check(parts, spec):
    if spec is None:return None
    steps={s['partId']:s for s in spec['steps']}
    def section(part,z):
        d=part['dimensionsMm'];profile=part['profile']
        if z<=0 or z>=d['height']:return None
        i=max(1,bisect.bisect_left(part['_heights'],z))
        (ra,za),(rb,zb)=profile[i-1:i+1];outer=ra+(rb-ra)*(z-za)/(zb-za)
        foot=d.get('footHeight',0)
        inner=0 if foot<=z<=foot+d['baseThickness'] else outer-d['wallThickness']
        return inner,outer
    prepared=[{**p,'_heights':[v[1] for v in p['profile']]} for p in parts]
    samples=0
    for screen in ('Desktop','Mobile'):
        for frame in range(121):
            poses=[position([p['appearance']['motion']['finalX'+screen]*1000,0,0],steps[p['id']],frame/120) for p in parts]
            for i,a in enumerate(prepared):
                for j in range(i+1,len(parts)):
                    b=prepared[j];pa,pb=poses[i],poses[j]
                    low=max(pa[1],pb[1]);high=min(pa[1]+a['dimensionsMm']['height'],pb[1]+b['dimensionsMm']['height'])
                    distance=math.hypot(pa[0]-pb[0],pa[2]-pb[2])
                    if low>=high:continue
                    for k in range(math.ceil((high-low)/.25)):
                        y=low+(k+.5)*.25
                        sa,sb=section(a,y-pa[1]),section(b,y-pb[1]);samples+=1
                        if not sa or not sb:continue
                        ia,oa=sa;ib,ob=sb
                        if distance<oa+ob-1e-5 and distance+oa>ib+1e-5 and distance+ob>ia+1e-5:
                            raise ValueError(f'Assembly section collision: {a["id"]}/{b["id"]} {screen} progress={frame/120:g}')
    solids=[]
    for p in parts:
        solid,_=make_rotational_solid(p['profile'],p['dimensionsMm'])
        x,y,z=steps[p['id']]['targetPositionMm']
        solids.append(solid.translate(Vector(x,-z,y))) # CAD Z-up -> scene Y-up.
    overlaps=[]
    for i,a in enumerate(solids):
        for j in range(i+1,len(solids)):
            common=a.intersect(solids[j]);volume=0 if common is None else common.volume
            if volume>1e-5:raise ValueError('Final assembly CAD solids overlap')
            overlaps.append({'parts':[parts[i]['id'],parts[j]['id']],'intersectionMm3':volume})
    return {'scope':'121 path poses per viewport layout / 0.25mm slices; exact final CAD intersections; not continuous or manufacturing proof',
            'sliceChecks':samples,'finalIntersections':overlaps,'targets':spec['steps']}
