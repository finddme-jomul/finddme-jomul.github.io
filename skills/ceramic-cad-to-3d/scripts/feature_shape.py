"""Reviewed feature data → connected BRep; geometry stage, not a project page."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import re
import shutil

from ceramic_paths import ROOT, SKILL


def number(value, positive=False):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError('Feature coordinates must be finite numbers')
    if positive and value <= 0:
        raise ValueError('Feature sizes must be positive')
    return value


def vector(value):
    if not isinstance(value, list) or len(value) != 3:
        raise ValueError('Expected a three-component mm vector')
    return [number(v) for v in value]


def validate(data):
    if data.get('schemaVersion') != 1 or data.get('units') != 'mm' or data.get('upAxis') != 'Z':
        raise ValueError('Feature input requires schemaVersion 1, units mm and upAxis Z')
    if data.get('status') not in ('reviewed-provisional', 'user-confirmed') or not data.get('provenance'):
        raise ValueError('Reviewed feature provenance required')
    if not isinstance(data.get('assumptions'), list):
        raise ValueError('Record assumptions explicitly, including unseen depth')
    if data.get('construction') not in ('solid', 'hollow'):
        raise ValueError('Explicit solid or hollow construction required')
    if data['construction'] == 'hollow':
        shell = data.get('hollowing', {})
        if not isinstance(shell, dict) or set(shell) != {'thicknessMm', 'opening', 'cavityProbeMm'}:
            raise ValueError('Hollow construction requires thicknessMm, opening and cavityProbeMm')
        number(shell['thicknessMm'], True)
        vector(shell['cavityProbeMm'])
        opening = shell['opening']
        if not isinstance(opening, dict) or set(opening) != {'axis', 'side'} or opening['axis'] not in ('X','Y','Z') or opening['side'] not in ('min','max'):
            raise ValueError('Opening requires axis X/Y/Z and side min/max')
    elif 'hollowing' in data:
        raise ValueError('Solid construction must not carry hollowing input')
    features = data.get('features')
    if not isinstance(features, list) or not features:
        raise ValueError('A nonempty ordered feature list is required')
    ids = set()
    for i, feature in enumerate(features):
        fid = feature.get('id', '')
        if not isinstance(fid, str) or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', fid) or fid in ids:
            raise ValueError('Feature IDs must be unique slugs')
        ids.add(fid)
        if feature.get('operation') not in (('base',) if i == 0 else ('union', 'cut')):
            raise ValueError('First feature must be base; later features union or cut')
        kind = feature.get('kind')
        if kind == 'box':
            vector(feature['originMm'])
            for v in vector(feature['sizeMm']): number(v, True)
        elif kind == 'sphere':
            vector(feature['centerMm']); number(feature['radiusMm'], True)
        elif kind == 'revolve':
            points = feature['profileRzMm']
            if not isinstance(points, list) or len(points) < 3: raise ValueError('Revolve needs a closed section with >=3 points')
            for point in points:
                if not isinstance(point, list) or len(point) != 2: raise ValueError('Expected radius/height pair')
                if number(point[0]) < 0: raise ValueError('Negative radius')
                number(point[1])
        elif kind == 'loft':
            sections = feature['sections']
            if not isinstance(sections, list) or len(sections) < 2: raise ValueError('Loft needs at least two sections')
            if type(feature.get('ruled')) is not bool: raise ValueError('Explicit loft ruled boolean required')
            for section in sections:
                if section.get('kind') == 'polygon':
                    points = section['pointsMm']
                    if not isinstance(points, list) or len(points) < 3: raise ValueError('Polygon needs >=3 points')
                    for point in points: vector(point)
                elif section.get('kind') == 'ellipse':
                    vector(section['originMm'])
                    if section.get('plane') not in ('XY', 'YZ', 'XZ'): raise ValueError('Unsupported section plane')
                    number(section['radiusUMm'], True); number(section['radiusVMm'], True)
                else: raise ValueError('Unsupported loft section')
        else: raise ValueError('Unsupported feature kind: '+str(kind))
    return data


def build(data):
    validate(data)
    from build123d import Axis, Face, Plane, Solid, Wire
    model = None
    checks = []
    for feature in data['features']:
        kind = feature['kind']
        if kind == 'box':
            tool = Solid.make_box(*feature['sizeMm'], Plane(origin=feature['originMm']))
        elif kind == 'sphere':
            tool = Solid.make_sphere(feature['radiusMm'], Plane(origin=feature['centerMm']))
        elif kind == 'revolve':
            section = Wire.make_polygon([(r, 0, z) for r, z in feature['profileRzMm']], close=True)
            tool = Solid.revolve(Face(section), 360, Axis.Z)
        else:
            wires = []
            for section in feature['sections']:
                if section['kind'] == 'polygon':
                    wires.append(Wire.make_polygon(section['pointsMm'], close=True))
                else:
                    x, normal = {'XY':((1,0,0),(0,0,1)), 'YZ':((0,1,0),(1,0,0)), 'XZ':((1,0,0),(0,-1,0))}[section['plane']]
                    wires.append(Wire.make_ellipse(section['radiusUMm'], section['radiusVMm'], Plane(origin=section['originMm'], x_dir=x, z_dir=normal)))
            tool = Solid.make_loft(wires, ruled=feature['ruled'])
        if not tool.is_valid or len(tool.solids()) != 1 or tool.volume <= 0:
            raise ValueError(feature['id']+': invalid feature solid')
        before = model.volume if model is not None else 0
        if feature['operation'] == 'base': model = tool
        elif feature['operation'] == 'union': model = model.fuse(tool)
        else: model = model.cut(tool)
        if not model.is_valid or len(model.solids()) != 1 or model.volume <= 0:
            raise ValueError(feature['id']+': expected one connected valid solid')
        change = model.volume - before
        if feature['operation'] == 'cut' and change >= -1e-7:
            raise ValueError(feature['id']+': ineffective cut')
        if feature['operation'] == 'union' and change <= 1e-7:
            raise ValueError(feature['id']+': ineffective union')
        checks.append({'id':feature['id'], 'operation':feature['operation'], 'volumeMm3':model.volume, 'changeMm3':change})
    if data['construction'] == 'hollow':
        model, shell_check = hollow(model, data['hollowing'])
        checks.append(shell_check)
    return model, checks


def hollow(model, spec):
    """Inward uniform offset with one explicitly selected extremal planar opening."""
    from build123d import GeomType, Kind
    axis = 'XYZ'.index(spec['opening']['axis'])
    side = spec['opening']['side']
    box = model.bounding_box()
    extreme = list(getattr(box, side))[axis]
    faces = []
    for face in model.faces():
        fb = face.bounding_box()
        if face.geom_type == GeomType.PLANE and all(abs(list(v)[axis]-extreme) < 1e-5 for v in (fb.min, fb.max)):
            faces.append(face)
    if len(faces) != 1:
        raise ValueError('Opening must select exactly one extremal planar face')
    probe = spec['cavityProbeMm']
    if not model.is_inside(probe):
        raise ValueError('Cavity probe must be inside the original solid')
    try:
        result = model.solids()[0].offset_3d(faces, -spec['thicknessMm'], kind=Kind.INTERSECTION)
    except Exception as exc:
        raise ValueError('Hollow offset failed; review geometry, opening and thickness') from exc
    if not result.is_valid or len(result.solids()) != 1 or not 0 < result.volume < model.volume:
        raise ValueError('Hollow offset must leave one connected positive-volume solid')
    rb = result.bounding_box()
    if any(abs(a-b) > 1e-4 for x,y in ((box.min,rb.min),(box.max,rb.max)) for a,b in zip(x,y)):
        raise ValueError('Hollow offset changed outer bounds')
    if result.is_inside(probe):
        raise ValueError('Cavity probe remains filled; review thickness or probe')
    return result, {'operation':'hollow', 'method':'inward-uniform-offset',
                    'thicknessMm':spec['thicknessMm'], 'opening':spec['opening'],
                    'cavityProbeMm':probe, 'cavityProbeEmpty':True,
                    'volumeMm3':result.volume, 'changeMm3':result.volume-model.volume}


def generate(source, output):
    from build123d import export_step, export_gltf, import_step
    from jomul_handled_solid import bounds, glb_bounds_mm
    source, output = source.resolve(), output.resolve()
    if not output.is_relative_to(ROOT) or output.is_relative_to(SKILL):
        raise ValueError('Output must be in workspace outside skill')
    stage = output.with_name(output.name+'.building')
    if output.exists() or stage.exists(): raise ValueError('Choose an unused output directory')
    raw = source.read_bytes()
    data = json.loads(raw)
    model, checks = build(data)
    stage.mkdir(parents=True)
    try:
        (stage/'shape-input.json').write_bytes(raw)
        export_step(model, stage/'model.step')
        export_gltf(model, stage/'model.glb', binary=True, linear_deflection=.08, angular_deflection=.15)
        restored = import_step(stage/'model.step')
        error = abs(restored.volume-model.volume)/model.volume
        if not restored.is_valid or len(restored.solids()) != 1 or error > 1e-6:
            raise ValueError('STEP roundtrip failed')
        mesh_bounds = glb_bounds_mm(stage/'model.glb')
        cad_bounds = bounds(model)
        if any(abs(mesh_bounds[key]-cad_bounds[key]) > .5 for key in cad_bounds):
            raise ValueError('GLB bounds differ from CAD by more than 0.5 mm')
        box = model.bounding_box()
        result = {'schemaVersion':1, 'status':'geometry-stage-only', 'construction':data['construction'],
                  'units':'mm', 'upAxis':'Z', 'manufacturingValidated':False,
                  'glbUnit':'m', 'glbBoundsMm':mesh_bounds,
                  'volumeMm3':model.volume, 'boundsMm':{'min':list(box.min), 'max':list(box.max)},
                  'features':checks, 'stepRoundTripRelativeVolumeError':error,
                  'limitations':['Standalone geometry export; use project commands for drawings, motion and pages', 'Hollow offset supports one extremal planar opening; no manufacturing or global minimum-wall certification', 'External-model input unsupported'],
                  'sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in stage.iterdir()}}
        (stage/'manifest.json').write_text(json.dumps(result, indent=2)+'\n')
        stage.rename(output)
    finally:
        if stage.exists(): shutil.rmtree(stage)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    result = generate(ROOT/args.input, ROOT/args.output)
    print(json.dumps(result, indent=2))
