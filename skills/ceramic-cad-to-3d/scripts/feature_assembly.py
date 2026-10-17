"""Sample shared upright placement with actual feature CAD solids; no physics claim."""
from build123d import import_step, Vector
from assembly_geometry import position


def check(parts,spec):
    if spec is None:return None
    steps={s['partId']:s for s in spec['steps']}
    solids=[]
    for p in parts:
        solid=import_step(p['step']);b=solid.bounding_box()
        solids.append(solid.translate(Vector(-b.center().X,-b.center().Y,-b.min.Z)))
    checks=0;intersections=0;final=[]
    # Include motion knots as well as uniform samples. Broad phase only skips
    # disjoint bounds; overlapping bounds require an exact CAD intersection.
    samples=sorted({i/120 for i in range(121)}|{s['start']+s['duration']*f for s in spec['steps'] for f in (0,1/3,2/3,1)})
    for screen in ('Desktop','Mobile'):
        for t in samples:
            moved=[]
            for p,solid in zip(parts,solids):
                x,y,z=position([p['appearance']['motion']['finalX'+screen]*1000,0,0],steps[p['id']],t,spec.get('mode','lift-place'))
                moved.append(solid.translate(Vector(x,-z,y)))
            for i,a in enumerate(moved):
                for j in range(i+1,len(moved)):
                    checks+=1;b=moved[j];aa,bb=a.bounding_box(),b.bounding_box()
                    overlap=all(min(getattr(aa.max,k),getattr(bb.max,k))-max(getattr(aa.min,k),getattr(bb.min,k))>1e-7 for k in ('X','Y','Z'))
                    volume=0
                    if overlap:
                        common=a.intersect(b);volume=0 if common is None else (common.volume if hasattr(common,"volume") else sum(s.volume for s in common));intersections+=1
                    if volume>1e-5:raise ValueError(f'Feature assembly collision {parts[i]["id"]}/{parts[j]["id"]} {screen} progress={t:g}')
                    if t==1 and screen=='Desktop':final.append({'parts':[parts[i]['id'],parts[j]['id']],'intersectionMm3':volume})
    return {'scope':'Upright translation only; sampled CAD intersections with disjoint-bounds broad phase, not continuous collision/manufacturing proof',
            'posesPerLayout':len(samples),'pairChecks':checks,'cadIntersections':intersections,'finalIntersections':final,'targets':spec['steps']}
