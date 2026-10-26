"""Validated normalized camera keys referring to existing SVG views/details."""
import math
import xml.etree.ElementTree as ET

def validate_camera(data,source,ids):
    if not isinstance(data,dict) or set(data)!={'schemaVersion','parts'} or data['schemaVersion']!=1 or not isinstance(data['parts'],dict):
        raise ValueError('Camera requires schemaVersion 1 and parts')
    if set(data['parts'])-set(ids):raise ValueError('Unknown camera part')
    for pid,keys in data['parts'].items():
        if not isinstance(keys,list) or not 2<=len(keys)<=12:raise ValueError('Camera needs 2–12 keys')
        previous=-1
        for key in keys:
            if not isinstance(key,dict) or set(key)!={'at','target','zoom'}:raise ValueError('Camera key requires at/target/zoom')
            for field in ('at','zoom'):
                v=key[field]
                if isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v):raise ValueError('Camera values must be finite')
            if not previous<key['at']<=1 or key['at']<0:raise ValueError('Camera times must increase within 0–1')
            if not 1<=key['zoom']<=4:raise ValueError('Camera zoom must be 1–4')
            previous=key['at']
            target=key['target']
            if target=='sheet':continue
            if not isinstance(target,str) or ':' not in target:raise ValueError('Invalid camera target')
            kind,value=target.split(':',1)
            attr={'view':'data-view','detail':'data-detail'}.get(kind)
            if not attr:raise ValueError('Invalid camera target')
            for layout in ('desktop','mobile'):
                svg=ET.parse(source/f'{pid}-{layout}.svg')
                if not any(e.get(attr)==value for e in svg.iter()):raise ValueError('Camera target missing from '+layout)
        if keys[0]['at']!=0 or keys[-1]!={'at':1,'target':'sheet','zoom':1}:
            raise ValueError('Camera starts at 0 and ends at full sheet at 1')
    return data['parts']
