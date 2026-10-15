"""Selected isometric CAD profile rings shared by PDF and SVG sheet renderers.

These are sparse shape guides derived from the real revolved outer profile,
not a full hidden-line projection of a STEP solid.
"""
from __future__ import annotations

import json
import math
from pathlib import Path
from ceramic_paths import ROOT, PROFILE

_PROFILE = json.loads((PROFILE).read_text())
RING_FRACTIONS = tuple(_PROFILE['cad']['isometricRingFractions'])


def sample_rings(profile, height):
    """Return (height fraction, elevation mm, outer radius mm) tuples."""
    if not profile or height <= 0:
        raise ValueError('A non-empty CAD profile and positive height are required')
    return [(fraction, fraction * height,
             min(profile, key=lambda point: abs(point[1] - fraction * height))[0])
            for fraction in RING_FRACTIONS]


def point(radius, elevation, angle, cx, base, scale, y_down=False):
    x = cx + scale * radius * math.cos(angle)
    y = base + scale * (elevation * math.sqrt(2 / 3)
                        + radius * math.sin(angle) / math.sqrt(3))
    return x, (2 * base - y if y_down else y)


def geometry(profile, dims, cx, base, scale, y_down=False):
    """Project side contours, eight sampled rings, and outer/inner mouth rims."""
    project = lambda radius, elevation, angle: point(
        radius, elevation, angle, cx, base, scale, y_down)
    sides = [[project(radius, z, angle) for radius, z in profile]
             for angle in (math.pi, 0)]
    rings = []
    for fraction, z, radius in sample_rings(profile, dims['height']):
        rings.append({
            'fraction': fraction, 'elevation': z, 'radius': radius,
            'back': [project(radius, z, math.pi * i / 32) for i in range(33)],
            'front': [project(radius, z, math.pi + math.pi * i / 32) for i in range(33)],
        })
    mouth = dims['openingDiameter'] / 2
    rims = [[project(radius, dims['height'], 2 * math.pi * i / 64)
             for i in range(65)]
            for radius in (mouth, max(0, mouth - dims['wallThickness']))]
    return {'sides': sides, 'rings': rings, 'rims': rims}
