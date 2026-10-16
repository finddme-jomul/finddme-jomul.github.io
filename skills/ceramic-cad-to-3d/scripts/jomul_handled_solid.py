#!/usr/bin/env python3
"""Build source-derived rotational/handled solids and CAD-front placement data.

This consumes an existing reviewed CAD config; it never guesses missing
real sketch dimensions or modifies a P1 answer archive.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import sys
from pathlib import Path

from build123d import Axis, Edge, Face, Plane, Solid, Wire, export_gltf, export_step, import_step
from pygltflib import GLTF2

from ceramic_paths import ROOT, SKILL, SCRIPTS, ASSETS, PROFILE

from handled_geometry import validate_handle, make_handle_path


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def volume_of_intersection(a: Solid, b: Solid) -> float:
    pieces = a.intersect(b)
    return sum(piece.volume for piece in pieces) if pieces else 0.0


def bounds(shape: Solid) -> dict:
    box = shape.bounding_box()
    return {'minX': box.min.X, 'maxX': box.max.X,
            'minY': box.min.Y, 'maxY': box.max.Y,
            'minZ': box.min.Z, 'maxZ': box.max.Z}


def make_solid(profile: list, dims: dict, handle: dict) -> tuple[Solid, dict]:
    validate_handle(handle, profile, dims)
    height, wall, floor = (float(dims[key]) for key in ('height', 'wallThickness', 'baseThickness'))
    if abs(profile[0][1]) > .001 or abs(profile[0][0] * 2 - dims['footDiameter']) > .05:
        raise ValueError('body profile foot does not match footDiameter at z=0')
    if not 0 < floor < height or not 0 < wall < min(p[0] for p in profile):
        raise ValueError('wall or floor thickness exceeds body')
    outer = [(r, 0, z) for r, z in profile]
    inner = [(r - wall, 0, z) for r, z in reversed(profile) if z >= floor]
    section = Face(Wire.make_polygon([(0, 0, 0)] + outer + inner + [(0, 0, floor)], close=True))
    body = Solid.revolve(section, 360, Axis.Z)
    if not body.is_valid or len(body.solids()) != 1:
        raise ValueError('body is not one valid hollow solid')
    cavity_section = Face(Wire.make_polygon(
        [(0, 0, floor)] + [(r - wall, 0, z) for r, z in profile if z >= floor] +
        [(0, 0, height)], close=True))
    cavity = Solid.revolve(cavity_section, 360, Axis.Z)
    points = handle['centerlineMm']
    tangent = tuple(points[1][axis] - points[0][axis] for axis in range(3))
    path = make_handle_path(handle)
    if handle['kind'] == 'centerline-oval-section':
        ring = Wire.make_ellipse(handle['depthDiameterMm'] / 2,
                                 handle['sectionDiameterMm'] / 2,
                                 Plane(origin=points[0], x_dir=(0, 1, 0), z_dir=tangent))
    else:
        ring = Wire.make_circle(handle['sectionDiameterMm'] / 2,
                                Plane(origin=points[0], z_dir=tangent))
    handle_solid = Solid.sweep(Face(ring), path)
    if not handle_solid.is_valid or len(handle_solid.solids()) != 1:
        raise ValueError('handle sweep is not one valid solid')
    joint_pieces = body.intersect(handle_solid) or []
    overlap = sum(piece.volume for piece in joint_pieces)
    midpoint = (points[0][2] + points[-1][2]) / 2
    span = max(1000, dims['maxDiameter'] * 5)
    upper_half = Solid.make_box(2 * span, 2 * span, height - midpoint + span,
                                Plane(origin=(-span, -span, midpoint)))
    lower_half = Solid.make_box(2 * span, 2 * span, midpoint + span,
                                Plane(origin=(-span, -span, -span)))
    upper_joint = sum(volume_of_intersection(piece, upper_half) for piece in joint_pieces)
    lower_joint = sum(volume_of_intersection(piece, lower_half) for piece in joint_pieces)
    intrusion = volume_of_intersection(cavity, handle_solid)
    if upper_joint <= .01 or lower_joint <= .01:
        raise ValueError('both upper and lower handle attachments need solid-volume overlap')
    if intrusion > .05:
        raise ValueError(f'handle intrudes into inner cavity by {intrusion:.3f} mm^3')
    fused = body.fuse(handle_solid)
    if not fused.is_valid or len(fused.solids()) != 1:
        raise ValueError('body and handle do not fuse into one valid solid')
    box = fused.bounding_box()
    if abs(box.size.Z - height) > .1:
        raise ValueError('fused height differs from dimensions')
    if abs(box.size.X - handle['overallWidthMm']) > 1:
        raise ValueError('fused width differs from handle overallWidthMm')
    return fused, {'bodyVolumeMm3': body.volume, 'handleVolumeMm3': handle_solid.volume,
                   'joinedVolumeMm3': fused.volume, 'jointOverlapMm3': overlap,
                   'upperJointOverlapMm3': upper_joint, 'lowerJointOverlapMm3': lower_joint,
                   'innerCavityIntrusionMm3': intrusion, 'bodySolidCount': len(body.solids()),
                   'handleSolidCount': len(handle_solid.solids()),
                   'joinedSolidCount': len(fused.solids())}


def make_rotational_solid(profile: list, dims: dict) -> tuple[Solid, dict]:
    """Revolve the reviewed polyline; radial wall offset is a preview model."""
    required = ('height', 'maxDiameter', 'openingDiameter', 'footDiameter',
                'wallThickness', 'baseThickness')
    if any(isinstance(dims.get(k), bool) or not isinstance(dims.get(k), (int, float))
           or not math.isfinite(dims[k]) or dims[k] <= 0 for k in required):
        raise ValueError('Rotational solid requires explicit positive dimensions including baseThickness')
    if (len(profile) < 2 or any(len(p) != 2 or any(not math.isfinite(v) for v in p) for p in profile)
            or any(b[1] <= a[1] for a, b in zip(profile, profile[1:]))):
        raise ValueError('Rotational solid requires a finite strictly ascending radius/height profile')
    height, wall, floor = (dims[k] for k in ('height', 'wallThickness', 'baseThickness'))
    if not 0 < floor < height or wall >= min(p[0] for p in profile):
        raise ValueError('Rotational wall or floor thickness exceeds body')
    if any(abs(a-b) > .05 for a,b in (
            (profile[0][1], 0), (profile[-1][1], height),
            (profile[0][0]*2, dims['footDiameter']),
            (profile[-1][0]*2, dims['openingDiameter']),
            (max(p[0] for p in profile)*2, dims['maxDiameter']))):
        raise ValueError('Rotational profile and dimensions disagree')
    a,b = next((a,b) for a,b in zip(profile, profile[1:]) if a[1] <= floor <= b[1])
    floor_radius = a[0] + (b[0]-a[0])*(floor-a[1])/(b[1]-a[1]) - wall
    outer = [(r,0,z) for r,z in profile]
    inner = [(r-wall,0,z) for r,z in reversed(profile) if z > floor]
    section = Face(Wire.make_polygon([(0,0,0)] + outer + inner +
                                    [(floor_radius,0,floor),(0,0,floor)], close=True))
    solid = Solid.revolve(section, 360, Axis.Z)
    if not solid.is_valid or len(solid.solids()) != 1 or solid.volume <= 0:
        raise ValueError('Rotational profile did not produce one valid hollow solid')
    return solid, {'joinedVolumeMm3': solid.volume, 'joinedSolidCount': 1,
                   'floorHeightMm': floor, 'radialWallMm': wall}


def source_paths(raw):
    kinds = ('profile', 'dimensions', 'handle') if raw.get('shapeKind') == 'handled-vessel' else ('profile', 'dimensions')
    return {kind: ROOT / raw[kind] for kind in kinds}


def source_solid(raw):
    if raw.get('shapeKind', 'rotational-profile') not in ('rotational-profile', 'handled-vessel'):
        raise ValueError('Unsupported solid shape kind')
    paths = source_paths(raw)
    profile = json.loads(paths['profile'].read_text())
    dims = json.loads(paths['dimensions'].read_text())[raw.get('dimensionsKey', 'valuesMm')]
    if 'handle' in paths:
        handle = json.loads(paths['handle'].read_text())
        solid, checks = make_solid(profile, dims, handle)
        status = handle['status']
    else:
        solid, checks = make_rotational_solid(profile, dims)
        status = 'provisional-geometry-preview-not-for-making'
    return paths, dims, solid, checks, status


def glb_bounds_mm(path: Path) -> dict:
    gltf = GLTF2().load(path)
    if len(gltf.nodes) != 1 or gltf.nodes[0].translation or gltf.nodes[0].scale or gltf.nodes[0].matrix:
        raise ValueError('GLB node transforms need explicit handling')
    positions = [gltf.accessors[primitive.attributes.POSITION]
                 for mesh in gltf.meshes for primitive in mesh.primitives]
    if not positions or any(accessor.min is None or accessor.max is None for accessor in positions):
        raise ValueError('GLB has no position bounds')
    low = [min(accessor.min[i] for accessor in positions) * 1000 for i in range(3)]
    high = [max(accessor.max[i] for accessor in positions) * 1000 for i in range(3)]
    return dict(zip(('minX', 'minY', 'minZ', 'maxX', 'maxY', 'maxZ'),
                    (low[0], low[1], low[2], high[0], high[1], high[2])))


def placement(layout: dict, solid_bounds: dict, dims: dict, part_id=None) -> dict:
    width, height = layout['pagePx']
    box = layout['frontBoxes'][part_id] if part_id else next(iter(layout['frontBoxes'].values()))
    scale = box['height'] * height / dims['height']
    cad_left = (box['cx'] - box['width'] / 2) * width
    cad_top = (box['cy'] - box['height'] / 2) * height
    expected_left_mm = -dims['maxDiameter'] / 2
    left = cad_left + (solid_bounds['minX'] - expected_left_mm) * scale
    right = cad_left + (solid_bounds['maxX'] - expected_left_mm) * scale
    top = cad_top + (dims['height'] - solid_bounds['maxZ']) * scale
    bottom = cad_top + (dims['height'] - solid_bounds['minZ']) * scale
    expected_right = (box['cx'] + box['width'] / 2) * width
    expected_bottom = (box['cy'] + box['height'] / 2) * height
    errors = [abs(left - cad_left), abs(right - expected_right),
              abs(top - cad_top), abs(bottom - expected_bottom)]
    error_mm = max(errors) / scale
    if error_mm > 1:
        raise ValueError(f'CAD-to-wire projected bounds differ by {error_mm:.2f} mm')
    return {'pagePx': [width, height], 'wireFrontBoundsPx': [left, top, right, bottom],
            'sheetFrontBoundsPx': [cad_left, cad_top, expected_right, expected_bottom],
            'maxEdgeErrorMm': error_mm, 'scalePxPerMm': scale}


def build(config_path: Path, sheet_manifest_path: Path, out: Path) -> dict:
    config = json.loads(config_path.read_text())
    sheet = json.loads(sheet_manifest_path.read_text())
    rows = []
    for raw in config['parts']:
        pid = raw['id']
        paths, dims, solid, checks, status = source_solid(raw)
        dest = out / pid
        dest.mkdir(parents=True, exist_ok=True)
        step, glb = dest / 'model.step', dest / 'model.glb'
        if not export_step(solid, step) or not export_gltf(solid, glb, binary=True,
                                                             linear_deflection=.1,
                                                             angular_deflection=.12):
            raise ValueError('STEP or GLB export failed')
        imported = import_step(step)
        if not imported.is_valid or len(imported.solids()) != 1:
            raise ValueError('STEP reimport is not one valid solid')
        step_bounds = bounds(imported)
        original = bounds(solid)
        if any(abs(step_bounds[k] - original[k]) > .1 for k in original):
            raise ValueError('STEP round-trip bounding box changed')
        if abs(imported.volume - solid.volume) > max(.1, solid.volume * .0001):
            raise ValueError('STEP round-trip volume changed')
        mesh_bounds = glb_bounds_mm(glb)
        if any(abs(mesh_bounds[k] - step_bounds[k]) > .5 for k in step_bounds):
            raise ValueError('GLB mesh bounds differ from STEP by more than 0.5 mm')
        positions = {key: placement(layout, mesh_bounds, dims, pid)
                     for key, layout in sheet['layouts'].items()}
        row = {'id': pid, 'unit': 'mm', 'glbUnit': 'm', 'axis': 'Z-up', 'status': status,
               'sourceSha256': {kind: sha(path) for kind, path in paths.items()},
               'stepSha256': sha(step), 'glbSha256': sha(glb),
               'boundsMm': step_bounds, 'glbBoundsMm': mesh_bounds, 'checks': checks, 'wirePlacement': positions,
               'stepRoundTrip': True}
        (dest / 'solid-report.json').write_text(json.dumps(row, indent=2) + '\n')
        rows.append(row)
    if not rows:
        raise ValueError('no supported part in config')
    report = {'schemaVersion': 1, 'project': config['name'], 'parts': rows}
    (out / 'manifest.json').write_text(json.dumps(report, indent=2) + '\n')
    return report


def refresh_placement(config_path: Path, sheet_manifest_path: Path, out: Path) -> None:
    """Keep checked STEP/GLB bytes while updating sheet-dependent placement metadata."""
    config = json.loads(config_path.read_text())
    sheet = json.loads(sheet_manifest_path.read_text())
    report = json.loads((out / 'manifest.json').read_text())
    for row in report['parts']:
        raw = next(part for part in config['parts'] if part['id'] == row['id'])
        paths = source_paths(raw)
        if row['sourceSha256'] != {kind: sha(path) for kind, path in paths.items()}:
            raise ValueError('Cannot reuse solid with changed geometry evidence')
        dest = out / row['id']
        if sha(dest / 'model.step') != row['stepSha256'] or sha(dest / 'model.glb') != row['glbSha256']:
            raise ValueError('Cannot reuse changed solid output')
        dims = json.loads(paths['dimensions'].read_text())[raw.get('dimensionsKey', 'valuesMm')]
        row['wirePlacement'] = {key: placement(layout, row['glbBoundsMm'], dims, row['id'])
                                for key, layout in sheet['layouts'].items()}
        (dest / 'solid-report.json').write_text(json.dumps(row, indent=2) + '\n')
    report['project'] = config['name']
    (out / 'manifest.json').write_text(json.dumps(report, indent=2) + '\n')


def verify(config_path: Path, sheet_manifest_path: Path, out: Path) -> None:
    config = json.loads(config_path.read_text())
    sheet = json.loads(sheet_manifest_path.read_text())
    report = json.loads((out / 'manifest.json').read_text())
    expected_ids = {part['id'] for part in config['parts']}
    if {row['id'] for row in report['parts']} != expected_ids:
        raise ValueError('solid report parts differ from input parts')
    for raw in config['parts']:
        pid = raw['id']
        row = next(row for row in report['parts'] if row['id'] == pid)
        paths = source_paths(raw)
        if row['sourceSha256'] != {kind: sha(path) for kind, path in paths.items()}:
            raise ValueError('solid source input hash drift')
        _, dims, recreated, checks, _ = source_solid(raw)
        dest = out / pid
        step, glb = dest / 'model.step', dest / 'model.glb'
        if row['stepSha256'] != sha(step) or row['glbSha256'] != sha(glb):
            raise ValueError('solid output hash drift')
        imported = import_step(step)
        if not imported.is_valid or len(imported.solids()) != 1:
            raise ValueError('STEP is not one valid solid')
        if abs(imported.volume - recreated.volume) > max(.1, recreated.volume*.0001):
            raise ValueError('STEP volume differs from regenerated solid')
        actual_bounds = bounds(imported)
        expected_bounds = bounds(recreated)
        if any(abs(actual_bounds[k] - expected_bounds[k]) > .1 for k in actual_bounds):
            raise ValueError('STEP differs from regenerated source solid')
        if any(abs(actual_bounds[k] - row['boundsMm'][k]) > .1 for k in actual_bounds):
            raise ValueError('solid report STEP bounds drift')
        if any(abs(checks[k] - row['checks'][k]) > .1 for k in checks):
            raise ValueError('joint or cavity report drift')
        mesh_bounds = glb_bounds_mm(glb)
        if any(abs(mesh_bounds[k] - actual_bounds[k]) > .5 for k in actual_bounds):
            raise ValueError('GLB mesh differs from STEP')
        if any(abs(mesh_bounds[k] - row['glbBoundsMm'][k]) > .1 for k in mesh_bounds):
            raise ValueError('solid report GLB bounds drift')
        positions = {key: placement(layout, mesh_bounds, dims, pid)
                     for key, layout in sheet['layouts'].items()}
        for layout_name, placement_data in positions.items():
            saved = row['wirePlacement'][layout_name]
            if saved['pagePx'] != placement_data['pagePx'] or any(
                    abs(a-b) > .05 for a,b in zip(saved['wireFrontBoundsPx'],
                                                   placement_data['wireFrontBoundsPx'])):
                raise ValueError('CAD-to-wire placement drift')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('config', type=Path)
    parser.add_argument('sheet_manifest', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--verify', action='store_true')
    args = parser.parse_args()
    if args.verify:
        verify(args.config, args.sheet_manifest, args.output)
        print('JOMUL_HANDLED_SOLID_VERIFY_OK')
    else:
        result = build(args.config, args.sheet_manifest, args.output)
        print(f'JOMUL_HANDLED_SOLID_OK {result["project"]}: {len(result["parts"])} part(s)')
