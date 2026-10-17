"""CAD-derived exterior membership for complete GLB face primitives."""
import copy
import json
import struct
from pathlib import Path
from feature_shape import build
from photos import sha


def classify(shape_path, glb_path):
    from build123d import Vertex, GeomType
    from pygltflib import GLTF2
    data=json.loads(Path(shape_path).read_text())
    envelope=copy.deepcopy(data);envelope['construction']='solid';envelope.pop('hollowing',None)
    original,_=build(envelope)
    faces=list(original.faces())
    if data['construction']=='hollow':
        opening=data['hollowing']['opening'];axis='XYZ'.index(opening['axis'])
        extreme=list(getattr(original.bounding_box(),opening['side']))[axis]
        faces=[f for f in faces if not (f.geom_type==GeomType.PLANE and all(abs(list(v)[axis]-extreme)<1e-5 for v in (f.bounding_box().min,f.bounding_box().max)))]
    g=GLTF2().load(glb_path);blob=g.binary_blob()
    if len(g.nodes)!=1 or g.nodes[0].mesh!=0 or len(g.meshes)!=1:
        raise ValueError('Feature exterior classification requires the compiler GLB layout')
    flags=[];cache={}
    for primitive in g.meshes[0].primitives:
        accessor=g.accessors[primitive.attributes.POSITION];view=g.bufferViews[accessor.bufferView]
        if accessor.componentType!=5126 or accessor.type!='VEC3' or accessor.sparse:
            raise ValueError('Unsupported feature position encoding')
        exterior=True
        for i in range(accessor.count):
            offset=(view.byteOffset or 0)+(accessor.byteOffset or 0)+i*(view.byteStride or 12)
            point=tuple(v*1000 for v in struct.unpack_from('<fff',blob,offset))
            if point not in cache:cache[point]=min(f.distance_to(Vertex(*point)) for f in faces)<=1e-4
            if not cache[point]:exterior=False;break
        flags.append(exterior)
    if not any(flags):raise ValueError('No CAD exterior primitive found')
    if data['construction']=='hollow' and all(flags):raise ValueError('Hollow interior classification missing')
    return {'schemaVersion':1,'sourceGlbSha256':sha(glb_path),'sourceShapeSha256':sha(shape_path),
            'primitiveExterior':flags,'method':'all-primitive-vertices-on-pre-hollow-boundary-excluding-opening',
            'scope':'Original exterior including underside; hollow interior and opening rim excluded. Solid decorative cuts remain exterior. Not arbitrary imported mesh classification.'}
