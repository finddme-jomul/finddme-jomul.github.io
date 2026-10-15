#!/usr/bin/env python3
"""Build an isolated, provisional mug CAD-to-GLB browser review."""
from __future__ import annotations

import hashlib
import json
import math
import sys
import shutil
import xml.etree.ElementTree as ET
from pathlib import Path

from ceramic_paths import ROOT, SKILL, SCRIPTS, ASSETS, PROFILE
NS = '{http://www.w3.org/2000/svg}'

from handled_geometry import sampled_centerline  # noqa: E402


def main(source: Path, out: Path) -> None:
    manifest = json.loads((source / 'manifest.json').read_text())
    solid = json.loads((source / 'solid/manifest.json').read_text())
    if len(manifest['parts']) != 1 or len(solid['parts']) != 1:
        raise ValueError('Handled motion preview supports one part')
    part_id = manifest['parts'][0]['id']
    if part_id != solid['parts'][0]['id'] or manifest['parts'][0]['shapeKind'] != 'handled-vessel':
        raise ValueError('CAD and solid handled-part IDs disagree')
    if solid['parts'][0]['status'] not in ('reviewed-provisional', 'synthetic-test'):
        raise ValueError('Solid must have an explicit review status')
    source_files = manifest['parts'][0]['sourceFiles']
    profile_path = ROOT / source_files['profile']
    handle_path = ROOT / source_files['handle']
    expected = solid['parts'][0]['sourceSha256']
    for kind, source_file in (('profile', profile_path), ('handle', handle_path)):
        if hashlib.sha256(source_file.read_bytes()).hexdigest() != expected[kind]:
            raise ValueError(f'{kind} differs from the STEP/GLB source')
    profile = json.loads(profile_path.read_text())
    handle = json.loads(handle_path.read_text())
    wire_segments = []
    def add_line(points, closed=False):
        pairs = list(zip(points, points[1:] + ([points[0]] if closed else [])))
        for a, b in pairs:
            # The GLB loader has already applied its Z-up to Y-up node rotation.
            for x, y, z in (a, b):
                wire_segments.extend((x / 1000, z / 1000, -y / 1000))
    for index, (radius, z) in enumerate(profile):
        if index % 20 == 0 or index == len(profile) - 1:
            add_line([(radius * math.cos(i * math.tau / 72),
                       radius * math.sin(i * math.tau / 72), z)
                      for i in range(72)], closed=True)
    for side in (-1, 1):
        add_line([(side * radius, 0, z) for radius, z in profile])
    centerline = sampled_centerline(handle)
    half = handle['sectionDiameterMm'] / 2
    for side in (-1, 1):
        rail = []
        for i, (x, y, z) in enumerate(centerline):
            prev = centerline[max(0, i - 1)]
            next_ = centerline[min(len(centerline) - 1, i + 1)]
            dx, dz = next_[0] - prev[0], next_[2] - prev[2]
            length = math.hypot(dx, dz)
            rail.append((x + side * dz / length * half, y,
                         z - side * dx / length * half))
        add_line(rail)
    out.mkdir(parents=True, exist_ok=True)
    (out / 'wire-guide.json').write_text(json.dumps({
        'schemaVersion': 1, 'source': 'CAD profile and exact handle solid path',
        'sourceSha256': {'profile': expected['profile'], 'handle': expected['handle']},
        'positionsYUpMetres': wire_segments
    }) + '\n')
    for layout in ('desktop', 'mobile', 'mobile-short'):
        shutil.copy2(source / ('sheet-' + layout + '.svg'), out / ('sheet-' + layout + '.svg'))
    shutil.copy2(source / 'solid' / part_id / 'model.glb', out / 'model.glb')
    box = manifest['layouts']['desktop']['frontBoxes'][part_id]
    page_width, page_height = manifest['layouts']['desktop']['pagePx']
    x = (box['cx'] - box['width'] / 2) * page_width
    y = (box['cy'] - box['height'] / 2) * page_height
    w = box['width'] * page_width
    h = box['height'] * page_height
    original = ET.parse(source / 'sheet-desktop.svg').getroot()
    drawing = ET.Element(NS + 'svg', {'viewBox': f'{x:.4f} {y:.4f} {w:.4f} {h:.4f}'})
    ET.SubElement(drawing, NS + 'style').text = '.heavy{fill:none;stroke:#34393b;stroke-width:1.35}.fine{fill:none;stroke:#34393b;stroke-width:.8}'
    for element in original.iter():
        if any(element.get('data-' + name) == part_id for name in
               ('front-part', 'front-handle', 'front-handle-interior')):
            drawing.append(ET.fromstring(ET.tostring(element)))
    assert len(drawing) == 4, 'Expected body path and two handle paths'
    ET.ElementTree(drawing).write(out / 'front-view.svg', encoding='unicode', xml_declaration=True)
    (out / 'review-input.json').write_text(json.dumps({
        'schemaVersion': 1, 'status': solid['parts'][0]['status'],
        'handleReviewStatus': solid['parts'][0]['status'],
        'layouts': {key: {'file': value['file'], 'frontBox': value['frontBoxes'][part_id]}
                    for key, value in manifest['layouts'].items()},
        'boundsMm': solid['parts'][0]['glbBoundsMm'],
        'glbSha256': solid['parts'][0]['glbSha256'],
        'wireSource': 'CAD profile and exact handle solid path; GLB mesh bounds checked separately',
        'sourceSha256': solid['parts'][0]['sourceSha256'],
    }, indent=2) + '\n')
    print('CERAMIC_HANDLED_ASSETS_OK', out)
