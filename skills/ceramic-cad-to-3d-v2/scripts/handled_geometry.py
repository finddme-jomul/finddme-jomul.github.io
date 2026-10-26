"""Reviewed 3D handle centreline contract for provisional vessel CAD guides."""
from __future__ import annotations

import math


def validate_handle(data: dict, profile: list, dims: dict) -> dict:
    if data.get("schemaVersion") != 1 or data.get("kind") not in ("centerline-round-section", "centerline-oval-section"):
        raise ValueError("handle needs schemaVersion 1 and a supported centerline section")
    default_path = "shape-preserving-bezier" if data.get("kind") == "centerline-oval-section" else "constrained-spline"
    if data.get("pathInterpolation", default_path) not in ("constrained-spline", "shape-preserving-bezier"):
        raise ValueError("unsupported handle path interpolation")
    points = data.get("centerlineMm")
    if not isinstance(points, list) or len(points) < 5:
        raise ValueError("handle needs at least five 3D centreline points")
    if any(not isinstance(p, list) or len(p) != 3 or
           any(not isinstance(v, (int, float)) or isinstance(v, bool) or not math.isfinite(v)
               for v in p) for p in points):
        raise ValueError("handle centreline must contain finite [x,y,z] mm points")
    section = data.get("sectionDiameterMm")
    if not isinstance(section, (int, float)) or isinstance(section, bool) or not 0 < section < dims["maxDiameter"] / 3:
        raise ValueError("invalid handle front section diameter")
    if data["kind"] == "centerline-oval-section":
        depth = data.get("depthDiameterMm")
        if not isinstance(depth, (int, float)) or isinstance(depth, bool) or not 0 < depth < dims["maxDiameter"] / 2:
            raise ValueError("invalid handle depth diameter")
    height = dims["height"]
    if any(not 0 < p[2] < height for p in points):
        raise ValueError("handle centreline must lie between foot and rim")
    side = data.get("side")
    if side not in ("right", "left"):
        raise ValueError("handle side must be right or left")
    sign = 1 if side == "right" else -1
    if any(sign * p[0] <= 0 for p in points):
        raise ValueError("handle centreline crosses vessel axis")
    if any(math.dist(a, b) < .01 for a, b in zip(points, points[1:])):
        raise ValueError("handle centreline has repeated points")

    def radius_at(z: float) -> float:
        for a, b in zip(profile, profile[1:]):
            if a[1] <= z <= b[1] and b[1] > a[1]:
                t = (z - a[1]) / (b[1] - a[1])
                return a[0] + (b[0] - a[0]) * t
        return profile[-1][0]

    for p in (points[0], points[-1]):
        if abs(math.hypot(p[0], p[1]) - radius_at(p[2])) > 1:
            raise ValueError("handle attachment centre must meet body profile within 1 mm")
    confirmed_centers = data.get("confirmedAttachmentCentersMm")
    if confirmed_centers is not None:
        if not isinstance(confirmed_centers, dict) or set(confirmed_centers) != {"upperZ", "lowerZ"}:
            raise ValueError("confirmed attachment centers need upperZ and lowerZ")
        if any(not isinstance(v, (int, float)) or isinstance(v, bool) or not math.isfinite(v)
               for v in confirmed_centers.values()):
            raise ValueError("confirmed attachment center heights must be finite")
        if abs(points[0][2] - confirmed_centers["upperZ"]) > .01 or abs(points[-1][2] - confirmed_centers["lowerZ"]) > .01:
            raise ValueError("handle path drifts from confirmed attachment centers")
    for p in points[1:-1]:
        if math.hypot(p[0], p[1]) < radius_at(p[2]) + section / 2 - 1:
            raise ValueError("handle centreline cuts through vessel body")
    outer_x = max(sign * p[0] for p in points) + section / 2
    if outer_x <= dims["maxDiameter"] / 2 + section / 2:
        raise ValueError("handle does not project outside vessel")
    overall = data.get("overallWidthMm")
    expected = dims["maxDiameter"] / 2 + outer_x
    if not isinstance(overall, (int, float)) or abs(overall - expected) > 1:
        raise ValueError(f"overallWidthMm must match body and handle projection ({expected:g} mm)")
    if data.get("status") not in ("synthetic-test", "reviewed-provisional", "user-confirmed"):
        raise ValueError("handle status must identify its evidence level")
    return data


def make_handle_path(handle: dict):
    """Build the same path for the STEP solid and all CAD guide views."""
    from build123d import Edge, Wire
    points = handle["centerlineMm"]
    default_path = "shape-preserving-bezier" if handle.get("kind") == "centerline-oval-section" else "constrained-spline"
    if handle.get("pathInterpolation", default_path) == "constrained-spline":
        start = tuple(points[1][axis] - points[0][axis] for axis in range(3))
        end = tuple(points[-1][axis] - points[-2][axis] for axis in range(3))
        return Edge.make_spline(points, tangents=[start, end])
    # Coordinatewise monotone Hermite tangents prevent the global interpolating
    # spline from reversing direction between closely spaced C-handle anchors.
    delta = [[b[axis] - a[axis] for axis in range(3)] for a, b in zip(points, points[1:])]
    slopes = [delta[0]]
    for left, right in zip(delta, delta[1:]):
        slopes.append([math.copysign(min(abs(a), abs(b)), b) if a * b > 0 else 0.0
                       for a, b in zip(left, right)])
    slopes.append(delta[-1])
    segments = []
    for i, (a, b) in enumerate(zip(points, points[1:])):
        c1 = [a[axis] + slopes[i][axis] / 3 for axis in range(3)]
        c2 = [b[axis] - slopes[i + 1][axis] / 3 for axis in range(3)]
        segments.append(Edge.make_bezier(a, c1, c2, b))
    combined = Wire.combine(segments)
    if len(combined) != 1:
        raise ValueError("handle Bezier path did not form one wire")
    return combined[0]


def sampled_centerline(handle: dict | list, count: int = 121) -> list[tuple[float, float, float]]:
    """Sample the actual CAD solid path for 2D and 3D guide geometry."""
    data = handle if isinstance(handle, dict) else {"centerlineMm": handle}
    path = make_handle_path(data)
    return [tuple(path.position_at(i / (count - 1))) for i in range(count)]
