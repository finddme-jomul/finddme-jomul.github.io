"""Sample shared upright placement with actual feature CAD solids; no physics claim."""
import math
from build123d import import_step, Vector, Axis
from assembly_geometry import position, smooth


def check(parts,spec,motion=None):
    if spec is None:return None
    steps={s['partId']:s for s in spec['steps']}
    solids=[];dimensions=[];cache={}
    for p in parts:
        key=str(p['step'])
        if key not in cache:
            solid=import_step(p['step']);b=solid.bounding_box()
            cache[key]=(solid.translate(Vector(-b.center().X,-b.center().Y,-b.min.Z)),(b.size.X,b.size.Y,b.size.Z))
        solid,size=cache[key];solids.append(solid);dimensions.append(size)
    checks=0;intersections=0;final=[]
    # Include motion knots as well as uniform samples. Broad phase only skips
    # disjoint bounds; overlapping bounds require an exact CAD intersection.
    samples=sorted({i/120 for i in range(121)}|{s['start']+s['duration']*f for s in spec['steps'] for f in (0,1/3,2/3,1)})
    for screen in ('Desktop','Mobile'):
        for t in samples:
            poses=[];boxes=[];moved={}
            for p,(width,depth,height) in zip(parts,dimensions):
                x,y,z=position([p['appearance']['motion']['finalX'+screen]*1000,0,0],steps[p['id']],t,spec.get('mode','lift-place'),spec.get('landing'))
                angle=0
                if spec.get('landing')=='soft-spin':
                    if motion is None:raise ValueError('Soft spin collision check requires motion')
                    step=steps[p['id']];now=spec['start']+spec['duration']*t
                    end=spec['start']+spec['duration']*(step['start']+step['duration']);start=motion['timing']['baseGlazeStart']
                    angle=360*smooth((now-start)/(end-start))*(motion['glaze']['spinTurns']+motion['glaze']['axisPrecessionTurns'])
                c,s=abs(math.cos(math.radians(angle))),abs(math.sin(math.radians(angle)))
                rx,ry=(width*c+depth*s)/2,(width*s+depth*c)/2
                # Rotated source AABB encloses the CAD solid at every upright yaw.
                # No kernel transforms are needed when these conservative boxes separate.
                poses.append((x,-z,y,angle));boxes.append(((x-rx,-z-ry,y),(x+rx,-z+ry,y+height)))
            def posed(index):
                if index not in moved:
                    x,y,z,angle=poses[index]
                    moved[index]=solids[index].rotate(Axis.Z,angle).translate(Vector(x,y,z))
                return moved[index]
            for i in range(len(parts)):
                for j in range(i+1,len(parts)):
                    checks+=1;aa,bb=boxes[i],boxes[j]
                    overlap=all(min(aa[1][k],bb[1][k])-max(aa[0][k],bb[0][k])>1e-7 for k in range(3))
                    volume=0
                    if overlap:
                        common=posed(i).intersect(posed(j));volume=0 if common is None else (common.volume if hasattr(common,"volume") else sum(s.volume for s in common));intersections+=1
                    if volume>1e-5:raise ValueError(f'Feature assembly collision {parts[i]["id"]}/{parts[j]["id"]} {screen} progress={t:g}')
                    if t==1 and screen=='Desktop':final.append({'parts':[parts[i]['id'],parts[j]['id']],'intersectionMm3':volume})
    return {'scope':'Upright placement (including configured soft spin); sampled CAD intersections with disjoint-bounds broad phase, not continuous collision/manufacturing proof',
            'posesPerLayout':len(samples),'pairChecks':checks,'cadIntersections':intersections,'finalIntersections':final,'targets':spec['steps']}
