#!/usr/bin/env python3
"""Visual review overlay: GLB mesh front silhouette against its CAD sheet."""
from __future__ import annotations

import argparse
import json
import struct
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageChops, ImageFilter
from pygltflib import GLTF2

FORMATS = {5121: 'B', 5123: 'H', 5125: 'I'}


def values(gltf: GLTF2, accessor_index: int) -> list:
    accessor = gltf.accessors[accessor_index]
    view = gltf.bufferViews[accessor.bufferView]
    blob = gltf.binary_blob()
    offset = (view.byteOffset or 0) + (accessor.byteOffset or 0)
    if accessor.type == 'VEC3' and accessor.componentType == 5126:
        size, fmt = 12, '<fff'
    elif accessor.type == 'SCALAR' and accessor.componentType in FORMATS:
        fmt = '<' + FORMATS[accessor.componentType]
        size = struct.calcsize(fmt)
    else:
        raise ValueError('unsupported GLB position/index accessor')
    stride = view.byteStride or size
    result = [struct.unpack_from(fmt, blob, offset + i * stride) for i in range(accessor.count)]
    return [item if len(item) > 1 else item[0] for item in result]


def render(sheet: Path, glb: Path, report: Path, layout: str, output: Path) -> int:
    data = json.loads(report.read_text())
    location = data['wirePlacement'][layout]
    doc = pymupdf.open(stream=sheet.read_bytes(), filetype='svg')
    pixmap = doc[0].get_pixmap(matrix=pymupdf.Matrix(1,1), alpha=False)
    image = Image.frombytes('RGB', (pixmap.width,pixmap.height), pixmap.samples)
    box = data['glbBoundsMm']
    left, top, _, _ = location['wireFrontBoundsPx']
    scale = location['scalePxPerMm']
    def project(point):
        return (left + (point[0] * 1000 - box['minX']) * scale,
                top + (box['maxZ'] - point[2] * 1000) * scale)
    gltf = GLTF2().load(glb)
    if len(gltf.nodes) != 1 or gltf.nodes[0].translation or gltf.nodes[0].scale or gltf.nodes[0].matrix:
        raise ValueError('GLB transform needs explicit handling')
    mask = Image.new('L', image.size, 0)
    fill = ImageDraw.Draw(mask)
    triangles = 0
    for mesh in gltf.meshes:
        for primitive in mesh.primitives:
            vertices = values(gltf, primitive.attributes.POSITION)
            indices = values(gltf, primitive.indices)
            for i in range(0, len(indices), 3):
                fill.polygon([project(vertices[indices[i+j]]) for j in range(3)], fill=255)
                triangles += 1
    # Union of projected triangles: its boundary is the visible front outline
    # and handle hole, without hidden back-face or joint tessellation edges.
    boundary = ImageChops.difference(mask, mask.filter(ImageFilter.MinFilter(3)))
    overlay = Image.new('RGBA', image.size, (201, 52, 38, 190))
    overlay.putalpha(boundary.point(lambda value: 190 if value else 0))
    result = Image.alpha_composite(image.convert('RGBA'),overlay)
    output.parent.mkdir(parents=True,exist_ok=True)
    result.save(output)
    return triangles


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('sheet',type=Path)
    parser.add_argument('glb',type=Path)
    parser.add_argument('report',type=Path)
    parser.add_argument('layout')
    parser.add_argument('output',type=Path)
    args=parser.parse_args()
    count=render(args.sheet,args.glb,args.report,args.layout,args.output)
    print(f'JOMUL_WIRE_OVERLAY_OK {args.layout}: {count} mesh triangles projected to the front silhouette')
