"""Explicit, reproducible presentation independent of actual/process photo roles."""
import hashlib
import math
import random


def layout_for(photos, options=None):
    options=options or {}
    mode=options.get('mode','selected')
    if mode=='selected':
        pair=len(photos)==2 and [p.get('role') for p in photos]==['actual','process']
        if len(photos)>1 and not pair:
            raise ValueError('MULTI_PHOTO_LAYOUT_PENDING: choose explicit scatter layout for a review candidate')
        return {'mode':'selected','status':'selected-component','placements':[]}
    if mode!='scatter': raise ValueError('Unknown gallery layout mode')
    if not 2<=len(photos)<=8: raise ValueError('Scatter review supports 2–8 photos in one viewport')
    seed=options.get('seed')
    if not isinstance(seed,str) or not seed.strip(): raise ValueError('Scatter needs a stable nonempty seed')
    placements=[{} for _ in photos]
    for view,columns in [('desktop',min(3,len(photos))),('mobile',2)]:
        rows=math.ceil(len(photos)/columns)
        rng=random.Random(hashlib.sha256((seed+view).encode()).hexdigest())
        slots=list(range(columns*rows));rng.shuffle(slots)
        cell_w=88/columns;cell_h=82/rows
        for i,slot in enumerate(slots[:len(photos)]):
            scale=.46+.44*(i/(len(photos)-1))+rng.uniform(-.025,.025)
            w=cell_w*scale;h=cell_h*(.42+.25*rng.random())
            x=6+(slot%columns)*cell_w+(cell_w-w)*rng.random()
            y=9+(slot//columns)*cell_h+(cell_h-h)*(.08+.12*rng.random() if i%2==0 else .8+.12*rng.random())
            placements[i][view]={k:round(v,4) for k,v in dict(x=x,y=y,w=w,h=h).items()}
    return {'mode':'scatter','status':'candidate-not-visually-adopted',
            'algorithm':'bounded-scatter-v1','seed':seed,'placements':placements}
