#!/usr/bin/env python3
"""Render source-derived CAD sheets from the shared profile contract.

This is an isolated comparison PoC. It does not replace the accepted PDF or
the bowl gallery's current SVG sheets.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import math
from pathlib import Path

from isometric_geometry import RING_FRACTIONS, geometry, point as iso_point
from handled_geometry import validate_handle, sampled_centerline
from cad_density_geometry import diameter_stations

from ceramic_paths import ROOT, SKILL, SCRIPTS, ASSETS, PROFILE
SIZES = {
    "single": {"desktop": (1600, 1000), "mobile": (900, 1272), "mobile-short": (900, 1122)},
    "multiple": {"desktop": (1600, 1000), "mobile": (900, 1900), "mobile-short": (900, 1500)},
}
INK, PALE = "#34393b", "#a9b0b0"


def sheet_size(mode: str, count: int, size_name: str) -> tuple[int, int]:
    if count <= 2:
        return SIZES[mode][size_name]
    panel_w, panel_h = SIZES['single'][size_name]
    columns = 2 if size_name == 'desktop' else 1
    return panel_w * columns, 140 + math.ceil(count / columns) * panel_h


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def path(points: list[tuple[float, float]], kind: str = "fine", attrs: str = "") -> str:
    coords = " L".join(f"{x:.2f},{y:.2f}" for x, y in points)
    primary = kind.split()[0]
    stroke = PALE if primary in ("pale", "axis") else INK
    width = {"heavy": 1.35, "fine": .8, "pale": .5, "axis": .5, "section": .9}[primary]
    fill = "none"
    dash = (' stroke-dasharray="7 5 1 5"' if primary == "axis" else
            ' stroke-dasharray="2 2"' if "dashed" in kind else "")
    return (f'<path class="{kind}" d="M{coords}" fill="{fill}" stroke="{stroke}" '
            f'stroke-width="{width}"{dash} {attrs}/>')


def line(x1: float, y1: float, x2: float, y2: float, kind: str = "fine") -> str:
    return path([(x1, y1), (x2, y2)], kind)


def label(x: float, y: float, value: object, size: int = 14, anchor: str = "start") -> str:
    return f'<text x="{x:.2f}" y="{y:.2f}" font-size="{size}" text-anchor="{anchor}">{esc(value)}</text>'


def circle(x: float, y: float, radius: float, kind: str = "fine") -> str:
    width = 1.35 if kind == "heavy" else .8
    return (f'<circle class="{kind}" cx="{x:.2f}" cy="{y:.2f}" r="{radius:.2f}" '
            f'fill="none" stroke="{INK}" stroke-width="{width}"/>')


def arrowhead(x: float, y: float, direction: str) -> str:
    if direction == "right":
        points = f"{x:.2f},{y:.2f} {x+7:.2f},{y-2.5:.2f} {x+7:.2f},{y+2.5:.2f}"
    elif direction == "left":
        points = f"{x:.2f},{y:.2f} {x-7:.2f},{y-2.5:.2f} {x-7:.2f},{y+2.5:.2f}"
    elif direction == "down":
        points = f"{x:.2f},{y:.2f} {x-2.5:.2f},{y+7:.2f} {x+2.5:.2f},{y+7:.2f}"
    else:
        points = f"{x:.2f},{y:.2f} {x-2.5:.2f},{y-7:.2f} {x+2.5:.2f},{y-7:.2f}"
    return f'<polygon points="{points}" fill="{INK}"/>'


def dimension_h(x1: float, x2: float, y: float, feature_y: float, text: str) -> str:
    return "".join((
        line(x1, feature_y, x1, y + 8, "pale"), line(x2, feature_y, x2, y + 8, "pale"),
        line(x1, y, x2, y), arrowhead(x1, y, "left"), arrowhead(x2, y, "right"),
        label((x1 + x2) / 2, y - 7, text, 13, "middle"),
    ))


def dimension_v(x: float, y1: float, y2: float, feature_x: float, text: str) -> str:
    return "".join((
        line(feature_x, y1, x - 8, y1, "pale"), line(feature_x, y2, x - 8, y2, "pale"),
        line(x, y1, x, y2), arrowhead(x, y1, "up"), arrowhead(x, y2, "down"),
        label(x - 10, (y1 + y2) / 2, text, 13, "end"),
    ))


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def load_part(raw: dict) -> dict:
    part_id = raw["id"]
    require(part_id.replace("-", "").isalnum(), f"invalid part ID: {part_id}")
    profile_path = ROOT / raw["profile"]
    dims_path = ROOT / raw["dimensions"]
    require(profile_path.is_file() and dims_path.is_file(), f"missing CAD input for {part_id}")
    points = json.loads(profile_path.read_text())
    record = json.loads(dims_path.read_text())
    dims = record[raw.get("dimensionsKey", "valuesMm")]
    sources = record.get(raw.get("sourcesKey", "sources"), {})
    material_path = ROOT / raw["material"]
    material_record = json.loads(material_path.read_text())
    if raw["materialFormat"] == "single":
        material = material_record
        clay = material["clay"]["name"]
        glazes = [material["glaze"]["name"]]
        clay_hex = material["clay"].get("wetPreviewHex")
        glaze_hexes = [material["glaze"].get("firedAppearancePreviewHex")]
    elif raw["materialFormat"] == "composition":
        material = next(p["material"] for p in material_record["composition"]["parts"]
                        if p["id"] == part_id)
        clay = material["clay"]["name"]
        glaze_layers = sorted(material["glazeLayers"], key=lambda layer: layer["order"])
        glazes = [layer["name"] for layer in glaze_layers]
        clay_hex = material["clay"].get("wetPreviewHex")
        glaze_hexes = [layer.get("firedAppearancePreviewHex") for layer in glaze_layers]
    else:
        raise ValueError(f'{part_id}: unsupported material format')
    for key in ("height", "maxDiameter", "openingDiameter", "footDiameter", "wallThickness"):
        require(math.isfinite(float(dims[key])) and float(dims[key]) > 0, f"{part_id}: invalid {key}")
    require(len(points) > 8 and all(len(p) == 2 for p in points), f"{part_id}: invalid profile")
    require(all(b[1] >= a[1] for a, b in zip(points, points[1:])), f"{part_id}: unordered profile")
    require(abs(points[-1][1] - dims["height"]) < .05, f"{part_id}: profile height mismatch")
    require(abs(max(p[0] for p in points) * 2 - dims["maxDiameter"]) < .05,
            f"{part_id}: profile diameter mismatch")
    require(abs(points[-1][0] * 2 - dims["openingDiameter"]) < .05,
            f"{part_id}: profile opening mismatch")
    shape_kind = raw.get("shapeKind", "rotational-profile")
    require(shape_kind in ("rotational-profile", "handled-vessel"), f"{part_id}: unsupported shapeKind")
    handle_path = ROOT / raw["handle"] if shape_kind == "handled-vessel" and "handle" in raw else None
    require((shape_kind == "handled-vessel") == (handle_path is not None),
            f"{part_id}: handled-vessel requires handle input")
    handle = validate_handle(json.loads(handle_path.read_text()), points, dims) if handle_path else None
    return {
        "stationsMm": diameter_stations(points, dims["height"]),
        "id": part_id, "name": raw["name"], "profile": points, "dimensions": dims,
        "sources": sources, "clay": clay, "glazes": glazes,
        "clayPreviewHex": clay_hex, "glazePreviewHexes": glaze_hexes,
        "wetBuildMm": record.get("wetBuildMm"), "shrinkage": record.get("shrinkage"),
        "profileSha256": hashlib.sha256(profile_path.read_bytes()).hexdigest(),
        "dimensionsSha256": hashlib.sha256(dims_path.read_bytes()).hexdigest(),
        "materialSha256": hashlib.sha256(material_path.read_bytes()).hexdigest(),
        "shapeKind": shape_kind, "handle": handle,
        "handleSha256": hashlib.sha256(handle_path.read_bytes()).hexdigest() if handle_path else None,
    }


def qualified(part: dict, key: str) -> str:
    source = part["sources"].get(key, "unresolved")
    if isinstance(source, dict):
        provisional = source.get("status") != "user-confirmed"
    else:
        provisional = (source in ("visual-assumption", "unresolved")
                       or any(word in source for word in ("가정", "중간값", "미확인")))
    return ("≈" if provisional else "") + f'{part["dimensions"][key]:g}'


def profile_outline(part: dict, cx: float, base: float, scale: float) -> str:
    p = part["profile"]
    left = [(cx - r * scale, base - z * scale) for r, z in p]
    right = [(cx + r * scale, base - z * scale) for r, z in reversed(p)]
    return path(left + right + [left[0]], "heavy", f'data-front-part="{esc(part["id"])}"')


def handle_path(part: dict, cx: float, base: float, scale: float, view: str) -> str:
    handle = part["handle"]
    if not handle:
        return ""
    points = handle["centerlineMm"]
    # Use the same constrained spline as the swept solid at every view.
    points = sampled_centerline(handle)
    if view == "front":
        projected = [(cx + x * scale, base - z * scale) for x, _, z in points]
    elif view == "plan":
        projected = [(cx + x * scale, base + y * scale) for x, y, _ in points]
    else:
        projected = [iso_point(math.hypot(x, y), z, math.atan2(y, x), cx, base, scale, y_down=True)
                     for x, y, z in points]
    coords = " L".join(f"{x:.2f},{y:.2f}" for x, y in projected)
    width = handle["sectionDiameterMm"] * scale
    if handle["kind"] == "centerline-oval-section":
        width = (handle["depthDiameterMm"] if view == "plan"
                 else handle["sectionDiameterMm"]) * scale
        caps = "butt"
    else:
        caps = "round"
    common = f'd="M{coords}" fill="none" stroke-linecap="{caps}" stroke-linejoin="round"'
    # Two concentric strokes show a tube's boundaries without turning its
    # projected area into a solid black mass. The outer stroke owns the bounds.
    return (f'<path {common} stroke="{INK}" stroke-width="{width:.2f}" '
            f'data-{view}-handle="{esc(part["id"])}"/>'
            f'<path {common} stroke="#ffffff" stroke-width="{max(.1, width - 2.4):.2f}" '
            f'data-{view}-handle-interior="{esc(part["id"])}"/>')


def section(part: dict, cx: float, base: float, scale: float) -> str:
    wall = part["dimensions"]["wallThickness"]
    profile = part["profile"]
    outer = [(cx + r * scale, base - z * scale) for r, z in profile]
    inner = [(cx + max(0, r - wall) * scale, base - z * scale)
             for r, z in reversed(profile)]
    result = [path(outer + inner + [outer[0]], "section")]
    # Actual hatch strokes remain visible in PDF previews that ignore SVG patterns.
    for z in range(5, int(part["dimensions"]["height"]), 5):
        for (r0, z0), (r1, z1) in zip(profile, profile[1:]):
            if z0 <= z <= z1 and z1 > z0:
                radius = r0 + (r1 - r0) * (z - z0) / (z1 - z0)
                y = base - z * scale
                result.append(line(cx + max(0, radius - wall) * scale, y + 2,
                                   cx + radius * scale, y - 2, "pale"))
                break
    return "".join(result)


def isometric(part: dict, cx: float, base: float, scale: float) -> str:
    shape = geometry(part["profile"], part["dimensions"], cx, base, scale, y_down=True)
    result = [f'<g data-iso-part="{esc(part["id"])}" data-profile-sha256="{part["profileSha256"]}">']
    for i, side in enumerate(shape["sides"]):
        result.append(path(side, "fine", f'data-iso-side="{i}"'))
    for ring in shape["rings"]:
        attrs = f'data-iso-ring="{ring["fraction"]:g}" data-radius-mm="{ring["radius"]:.6f}"'
        result.append(path(ring["back"], "pale dashed", attrs))
        result.append(path(ring["front"], "fine", attrs))
    for i, rim in enumerate(shape["rims"]):
        result.append(path(rim, "fine", f'data-iso-rim="{i}"'))
    result.append(handle_path(part, cx, base, scale, "iso"))
    result.append("</g>")
    return "".join(result)


def detail(part: dict, cx: float, y: float, top: bool) -> str:
    points = part["profile"][-15:] if top else part["profile"][:15]
    center_r = points[-1][0] if top else points[0][0]
    z0 = points[0][1]
    scale = 2.1
    outer = [(cx + (r - center_r) * scale, y - (z - z0) * scale) for r, z in points]
    wall = part["dimensions"]["wallThickness"]
    inner = [(x - wall * scale, yy) for x, yy in outer]
    return path(outer, "heavy") + path(inner) + label(cx - 60, y + 35,
                                                         "RIM DETAIL" if top else "FOOT DETAIL", 12)


def front_view(part: dict, cx: float, base: float, scale: float, page: tuple[int, int],
               single_hero: bool = False, show_heading: bool = True) -> tuple[str, dict]:
    d = part["dimensions"]
    top = base - d["height"] * scale
    half = d["maxDiameter"] * scale / 2
    mouth_half = d["openingDiameter"] * scale / 2
    foot_half = d["footDiameter"] * scale / 2
    items = ([label(cx, top - 98, part["name"].upper(), 21, "middle"),
              label(cx, top - 75, "FRONT ELEVATION  /  mm", 12, "middle")]
             if show_heading else [])
    items += [profile_outline(part, cx, base, scale), handle_path(part, cx, base, scale, "front"),
             line(cx, top - 24, cx, base + 20, "axis"),
             dimension_h(cx - mouth_half, cx + mouth_half, top - 17, top,
                         f'Ø {qualified(part, "openingDiameter")} mm'),
             dimension_h(cx - foot_half, cx + foot_half, base + 31, base,
                         f'Ø {qualified(part, "footDiameter")} mm'),
             dimension_v(cx - half - 33, top, base, cx - half,
                         f'{qualified(part, "height")} mm')]
    if single_hero:
        widest = max(part["profile"], key=lambda point: point[0])
        belly_y = base - widest[1] * scale
        items += [line(cx - half, belly_y, cx + half, belly_y, "pale"),
                  label(cx + half + 12, belly_y - 5,
                        f'Ø {qualified(part, "maxDiameter")} mm', 13)]
    else:
        items.append(dimension_h(cx - half, cx + half, top - 43, top + 10,
                                 f'Ø {qualified(part, "maxDiameter")} mm'))
    left, right = cx - half, cx + half
    if part["handle"]:
        section_half = part["handle"]["sectionDiameterMm"] * scale / 2
        handle_x = [cx + p[0] * scale for p in sampled_centerline(part["handle"])]
        left, right = min(left, min(handle_x) - section_half), max(right, max(handle_x) + section_half)
        items.append(dimension_h(left, right, top - 53, top,
                                 f'OVERALL {part["handle"]["overallWidthMm"]:g} mm'))
    box = {"cx": (left + right) / 2 / page[0], "cy": (top + base) / 2 / page[1],
           "width": (right - left) / page[0], "height": (base - top) / page[1]}
    return "".join(items), box


def plan_view(part: dict, cx: float, cy: float, radius: float,
              compact: bool = False) -> str:
    d = part["dimensions"]
    drawing = [circle(cx, cy, radius),
               circle(cx, cy, radius * d["openingDiameter"] / d["maxDiameter"], "heavy"),
               line(cx - radius - 10, cy, cx + radius + 10, cy, "axis"),
               line(cx, cy - radius - 10, cx, cy + radius + 10, "axis")]
    drawing.append(handle_path(part, cx, cy, radius / (d["maxDiameter"] / 2), "plan"))
    if compact:
        drawing += [label(cx + radius + 15, cy - 5, "PLAN / RIM", 11),
                    label(cx + radius + 15, cy + 13,
                          f'OUTER Ø {qualified(part, "maxDiameter")}', 10)]
    else:
        drawing += [label(cx, cy - radius - 32, "PLAN / RIM + MAXIMUM OUTLINE", 11, "middle"),
                    label(cx, cy + radius + 24,
                          f'OUTER Ø {qualified(part, "maxDiameter")} / RIM Ø {qualified(part, "openingDiameter")}', 11, "middle")]
    return "".join(drawing)


def iso_view(part: dict, cx: float, base: float, scale: float) -> str:
    return (label(cx, base - part["dimensions"]["height"] * scale - 45,
                  "ISOMETRIC / CAD PROFILE", 12, "middle")
            + isometric(part, cx, base, scale))


def section_view(part: dict, cx: float, base: float, scale: float) -> str:
    d = part["dimensions"]
    return "".join((
        label(cx + 15, base - d["height"] * scale - 24, "SECTION A-A / HATCHED", 11),
        section(part, cx, base, scale),
        label(cx + d["maxDiameter"] * scale / 2 + 15,
              base - d["height"] * scale * .5, f'WALL {qualified(part, "wallThickness")} mm', 11),
        label(cx + d["maxDiameter"] * scale / 2 + 15,
              base - d["height"] * scale * .5 + 20,
              f'BASE {qualified(part, "baseThickness")} mm', 11),
    ))


def detail_view(part: dict, cx: float, y: float, top: bool) -> str:
    d = part["dimensions"]
    z_limit = max(10, d["height"] * .09)
    points = ([point for point in part["profile"] if point[1] >= d["height"] - z_limit]
              if top else [point for point in part["profile"] if point[1] <= z_limit])
    if len(points) < 2:
        return ""
    first_z = points[0][1]
    center_r = points[0][0]
    scale = min(6.0, 74 / max(points[-1][1] - first_z, 1))
    outer = [(cx + (r - center_r) * scale, y - (z - first_z) * scale) for r, z in points]
    wall = d["wallThickness"]
    inner = [(x - wall * scale, yy) for x, yy in outer]
    title = "RIM DETAIL / INNER WALL ASSUMED" if top else "FOOT DETAIL / INNER WALL ASSUMED"
    return (label(cx - 64, y - 96, title, 10) + path(outer, "heavy") + path(inner))


def preview_square(x: float, y: float, color: str | None) -> str:
    if not color:
        return ""
    require(len(color) == 7 and color.startswith("#") and
            all(ch in "0123456789abcdefABCDEF" for ch in color[1:]),
            "invalid material preview color")
    return (f'<rect x="{x:.2f}" y="{y:.2f}" width="14" height="14" '
            f'fill="{color}" stroke="{PALE}" stroke-width=".5" '
            f'data-preview-color="{color}"/>')


def materials_view(part: dict, x: float, y: float, compact: bool = False,
                   show_heading: bool = True) -> str:
    step = 21 if compact else 27
    items = ([label(x, y, "MATERIALS", 13)] if show_heading else []) + [
             label(x, y + step, f'CLAY / {part["clay"]}', 13),
             preview_square(x + 190, y + step - 13, part["clayPreviewHex"])]
    for index, glaze in enumerate(part["glazes"], 1):
        items.append(label(x, y + (index + 1) * step,
                           f'GLAZE {index} / {glaze}', 13))
        items.append(preview_square(x + 190, y + (index + 1) * step - 13,
                                    part["glazePreviewHexes"][index - 1]))
    return "".join(items)


def source_view(part: dict, x: float, y: float, compact: bool = False) -> str:
    wet = part["wetBuildMm"]
    shrink = part["shrinkage"]
    if wet and shrink:
        rate = shrink["totalPercent"]
        lines = [f'FORMING SIZE / SHRINKAGE {rate:g}% ASSUMED',
                 f'WET H {wet["height"]:.1f} mm · MAX Ø {wet["maxDiameter"]:.1f} mm']
    else:
        lines = ["FORMING SIZE / SHRINKAGE UNRESOLVED",
                 "NO CONFIRMED WET-BUILD DIMENSIONS"]
    return "".join(label(x, y + i * (18 if compact else 23), text, 11)
                   for i, text in enumerate(lines))


def dimension_table(parts: list[dict], x: float, y: float, width: float, compact: bool = False) -> str:
    columns = [("PART", .00), ("HEIGHT", .24), ("MAX Ø", .40),
               ("RIM Ø", .55), ("FOOT Ø", .69), ("WALL", .82), ("SOURCE", .92)]
    step = 18 if compact else 24
    items = [line(x, y - 16, x + width, y - 16), line(x, y + 5, x + width, y + 5)]
    for heading, fraction in columns:
        items.append(label(x + width * fraction + 5, y, heading, 10))
    for index, part in enumerate(parts, 1):
        row_y = y + 5 + step * index
        d = part["dimensions"]
        values = [f'{index:02d} {part["name"].upper()}',
                  f'{qualified(part, "height")}', f'{qualified(part, "maxDiameter")}',
                  f'{qualified(part, "openingDiameter")}', f'{qualified(part, "footDiameter")}',
                  f'{qualified(part, "wallThickness")}', "MIXED"]
        for (_, fraction), value in zip(columns, values):
            items.append(label(x + width * fraction + 5, row_y, value, 10))
        items.append(line(x, row_y + 6, x + width, row_y + 6, "pale"))
    return "".join(items)


def station_table(part: dict, x: float, y: float) -> str:
    rows = [label(x, y, "CAD PROFILE STATIONS / FIRED", 10),
            label(x, y + 21, "Z mm", 10), label(x + 91, y + 21, "OUTER Ø mm", 10),
            line(x, y + 27, x + 215, y + 27, "pale")]
    for index, (z, diameter) in enumerate(part["stationsMm"]):
        row_y = y + 45 + index * 21
        rows += [label(x, row_y, f"{z:g}", 11),
                 label(x + 91, row_y, f"≈{diameter:.1f}", 11),
                 line(x, row_y + 6, x + 215, row_y + 6, "pale")]
    rows.append(label(x, y + 113, "PROFILE DERIVED / PROVISIONAL", 9))
    return "".join(rows)


def render_single_landscape(part: dict, page: tuple[int, int], fit_width=False) -> tuple[str, dict]:
    w, h = page
    short = False
    scale = min(4.1, (h - (300 if short else 220)) / part["dimensions"]["height"])
    if fit_width:
        scale = min(scale, 640 / part['dimensions'].get('overallWidth', part['dimensions']['maxDiameter']))
    base = h - (95 if short else 165)
    cx = 510
    front, box = front_view(part, cx, base, scale, page, single_hero=True)
    divider = 1010
    iso_scale = 1.05 if short else 1.43
    body = [front, line(divider, 120, divider, h - 70, "pale"),
            iso_view(part, 1180, h * (.44 if short else .42), iso_scale),
            materials_view(part, 1350, 150 if short else 175, compact=short),
            line(1050, h * .50, 1535, h * .50, "pale"),
            plan_view(part, 1190, h * .765, 60),
            section_marks(1190, h * .765, 60),
            section_view(part, 1405, h * .80, .8 if short else 1.1),
            *([detail_view(part, 1410, 350, True),
               detail_view(part, 1410, 480, False)] if part["handle"] else [
               line(cx + part["dimensions"]["openingDiameter"] * scale / 2 + 7,
                    base - part["dimensions"]["height"] * scale + 5, 760, h * .33, "pale"),
               detail_view(part, 830, h * .40, True),
               line(cx + part["dimensions"]["footDiameter"] * scale / 2 + 7,
                    base - 5, 760, h * .70, "pale"),
               detail_view(part, 830, h * .73, False)]),
            station_table(part, 1055, 525),
            source_view(part, 1080, h - (80 if short else 105), compact=short)]
    return f'<g data-part="{esc(part["id"])}">{"".join(body)}</g>', {part["id"]: box}


def render_multiple_landscape(parts: list[dict], page: tuple[int, int]) -> tuple[str, dict]:
    w, h = page
    short = False
    centers = [650, 950] if not short else [620, 980]
    base = 652 if not short else 450
    scale = 1.9 if not short else 1.65
    body: list[str] = []
    boxes = {}
    for index, (part, cx) in enumerate(zip(parts, centers)):
        drawing, box = front_view(part, cx, base, scale, page, show_heading=not short)
        iso_x = 225 if index == 0 else 1380
        detail_x = 180 if index == 0 else 1340
        material_x = 85 if index == 0 else 1130
        short_heading = ([label(370 if index == 0 else 760, 245, part["name"].upper(), 15),
                          label(370 if index == 0 else 760, 266, "FRONT ELEVATION / mm", 10)]
                         if short else [])
        views = [drawing, *short_heading, plan_view(part, cx, 235 if not short else 170,
                                    57 if not short else 44, compact=short),
                 section_marks(cx, 235, 57),
                 section_view(part, cx - 42, 815 if not short else 585,
                              .95 if not short else .72),
                 iso_view(part, iso_x, 340 if not short else 315,
                          1.1 if not short else .95),
                 detail_view(part, detail_x, 520 if not short else 455,
                             top=index == 0),
                 station_table(part, 85 if index == 0 else 1130, 565),
                 materials_view(part, material_x, 730 if not short else 515,
                                compact=short)]
        body.append(f'<g data-part="{esc(part["id"])}">{"".join(views)}</g>')
        boxes[part["id"]] = box
    body.append(dimension_table(parts, 350, 875 if not short else 613,
                                900, compact=short))
    return "".join(body), boxes


def portrait_plan(part: dict, cx: float, cy: float, radius: float,
                  marked: bool = False) -> str:
    d = part["dimensions"]
    items = [circle(cx, cy, radius),
             circle(cx, cy, radius * d["openingDiameter"] / d["maxDiameter"], "heavy"),
             line(cx - radius - 10, cy, cx + radius + 10, cy, "axis"),
             line(cx, cy - radius - 10, cx, cy + radius + 10, "axis"),
             label(cx, cy + radius + 29, "PLAN / RIM", 11, "middle")]
    items.append(handle_path(part, cx, cy, radius / (d["maxDiameter"] / 2), "plan"))
    if marked:
        items.append(section_marks(cx, cy, radius))
    return "".join(items)


def section_marks(cx: float, cy: float, radius: float) -> str:
    return "".join((label(cx + 11, cy - radius - 13, "A", 10),
                    label(cx + 11, cy + radius + 45, "A", 10),
                    line(cx, cy - radius - 22, cx, cy - radius - 9, "fine"),
                    line(cx, cy + radius + 9, cx, cy + radius + 22, "fine")))


def portrait_station_line(part: dict, x: float, y: float) -> str:
    values = " · ".join(f"Z{z:g} ≈Ø{diameter:.1f}" for z, diameter in part["stationsMm"])
    return label(x, y, f"PROFILE OUTER Ø / {values} mm / PROVISIONAL", 11)


def portrait_material_line(part: dict, x: float, y: float) -> str:
    glazes = " → ".join(part["glazes"])
    return (label(x, y, f'CLAY / {part["clay"]}', 12) +
            label(x + 155, y, f'GLAZE 1 / {glazes}', 12))


def render_single_portrait(part: dict, page: tuple[int, int]) -> tuple[str, dict]:
    w, h = page
    short = h < 1200
    cx = 270 if part["handle"] else 345
    base = 600 if short else 690
    scale = min(3.4, (base - 180) / part["dimensions"]["height"],
                490 / part["dimensions"]["maxDiameter"])
    front, box = front_view(part, cx, base, scale, page,
                            single_hero=True, show_heading=False)
    divider = 645 if short else 730
    secondary = 930 if short else 1060
    rim_y = 310 if short else 315
    foot_y = 620 if short else 675
    plan_y = 765 if short else 900
    plan_r = 53 if short else 60
    body = [label(70, 45, "01 / TARGET FIRED FORM", 17),
            label(70, 70, "FRONT ELEVATION / DIMENSIONS mm", 11),
            front,
            ("" if part["handle"] else line(
                cx + part["dimensions"]["openingDiameter"] * scale / 2 + 12,
                base - part["dimensions"]["height"] * scale + 8,
                615, rim_y - 34, "pale")),
            detail_view(part, 690, rim_y, True),
            station_table(part, 635, 365 if short else 420),
            ("" if part["handle"] else line(
                cx + part["dimensions"]["footDiameter"] * scale / 2 + 12,
                base - 8, 615, foot_y - 20, "pale")),
            detail_view(part, 690, foot_y, False),
            line(70, divider, 830, divider, "pale"),
            label(75, divider + 26, "02 / PROFILE ISOMETRIC", 14),
            label(470, divider + 26, "03 / PLAN / SECTION A-A", 14),
            isometric(part, 240, 840 if short else 980, .95 if short else 1.15),
            portrait_plan(part, 555, plan_y, plan_r, marked=True),
            section(part, 690, 885 if short else 1020, .48 if short else .63),
            label(753, (820 if short else 950),
                  f'WALL {qualified(part, "wallThickness")} mm', 11),
            label(753, (845 if short else 975),
                  f'BASE {qualified(part, "baseThickness")} mm', 11),
            line(70, secondary, 830, secondary, "pale"),
            label(75, secondary + 27, "04 / MATERIALS", 13),
            materials_view(part, 75, secondary + 37, compact=True, show_heading=False),
            (label(75, secondary + 119, "PREVIEW COLORS / SUBJECT TO FINAL FIRING", 9)
             if part["clayPreviewHex"] or any(part["glazePreviewHexes"]) else ""),
            label(480, secondary + 27, "05 / FORMING SIZE", 13),
            source_view(part, 480, secondary + 51, compact=True)]
    return f'<g data-part="{esc(part["id"])}">{"".join(body)}</g>', {part["id"]: box}


def render_multiple_portrait(parts: list[dict], page: tuple[int, int]) -> tuple[str, dict]:
    w, h = page
    tall = h > 1700
    separation = 820 if tall else 610
    body: list[str] = [line(450, 110, 450, h - 75, "pale dashed")]
    boxes = {}
    for index, part in enumerate(parts):
        offset = index * separation
        plan_y = (215 if tall else 180) + offset
        iso_base = (290 if tall else 235) + offset
        base = (690 if tall else 560) + offset
        scale = min(3.0 if tall else 2.4,
                    (base - offset - (405 if tall else 350)) / part["dimensions"]["height"],
                    (350 if tall else 300) / part["dimensions"]["maxDiameter"])
        drawing, box = front_view(part, 450, base, scale, page)
        boxes[part["id"]] = box
        material_y = (790 if tall else 630) + offset
        views = [portrait_plan(part, 220, plan_y, 65 if tall else 55),
                 isometric(part, 675, iso_base, 1.15 if tall else .85),
                 label(675, iso_base + 25, "ISOMETRIC / CAD PROFILE", 11, "middle"),
                 drawing,
                 detail_view(part, 145, (610 if tall else 510) + offset,
                             top=index == 0),
                 section_view(part, 680, (680 if tall else 550) + offset,
                              .8 if tall else .65),
                 portrait_material_line(part, 105, material_y)]
        views.append(portrait_station_line(part, 105, material_y + (39 if tall else 30)))
        body.append(f'<g data-part="{esc(part["id"])}">{"".join(views)}</g>')
        if index == 0:
            body.append(line(80, (900 if tall else 720), 820,
                             (900 if tall else 720), "pale"))
    return "".join(body), boxes


def render_part_panels(parts: list[dict], size_name: str, page: tuple[int, int]) -> tuple[str, dict]:
    panel_w, panel_h = SIZES['single'][size_name]
    columns = 2 if size_name == 'desktop' else 1
    w, h = page
    drawings, boxes = [], {}
    for index, part in enumerate(parts):
        x, y = (index % columns) * panel_w, 100 + (index // columns) * panel_h
        drawing, local = (render_single_landscape(part, (panel_w, panel_h), fit_width=True)
                          if size_name == 'desktop' else render_single_portrait(part, (panel_w, panel_h)))
        drawing = drawing.replace('<g data-part=',
            f'<g transform="translate({x},{y})" data-layout-x="{x}" data-layout-y="{y}" data-part=', 1)
        drawings.append(drawing)
        box = local[part['id']]
        boxes[part['id']] = {**box, 'cx': (box['cx']*panel_w+x)/w,
                            'cy': (box['cy']*panel_h+y)/h,
                            'width':box['width']*panel_w/w,'height':box['height']*panel_h/h}
    return ''.join(drawings), boxes


def render(project: dict, parts: list[dict], size_name: str) -> tuple[str, dict]:
    require(bool(parts), 'CAD sheet needs at least one part')
    w, h = sheet_size(project['compositionMode'],len(parts),size_name)
    body = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{esc(project["name"])} technical CAD sheet">',
            f'<style>.heavy{{fill:none;stroke:{INK};stroke-width:1.35}}.fine{{fill:none;stroke:{INK};stroke-width:.8}}.pale,.axis{{fill:none;stroke:{PALE};stroke-width:.5}}.dashed{{stroke-dasharray:2 2}}.section{{fill:none;stroke:{INK};stroke-width:.9}}text{{fill:{INK};font-family:Arial,"Noto Sans CJK KR",sans-serif;letter-spacing:.15px}}</style>',
            f'<rect width="{w}" height="{h}" fill="{project["cadProfile"]["background"]}"/>',
            *([] if len(parts) == 1 and w < h else [
                label(55, 45, f'{project["name"].upper()}  /  TECHNICAL CAD', 22),
                label(55, 70, "FRONT · PLAN · SECTION · PROFILE ISOMETRIC / mm", 12)]),
            line(55, 92, w - 55, 92)]
    if len(parts) > 2:
        drawing, boxes = render_part_panels(parts, size_name, (w,h))
    elif w > h:
        drawing, boxes = (render_single_landscape(parts[0], (w, h)) if len(parts) == 1
                          else render_multiple_landscape(parts, (w, h)))
    else:
        drawing, boxes = (render_single_portrait(parts[0], (w, h)) if len(parts) == 1
                          else render_multiple_portrait(parts, (w, h)))
    # Group by source vessel for provenance checks; the composition remains one SVG sheet.
    # Every view carries its own part ID for the checker and for future CSS transitions.
    body.append(drawing)
    body += [line(55, h - 48, w - 55, h - 48),
             label(55, h - 23, "Ø DIAMETER / ≈ PROVISIONAL / FORMING SIZE NEEDS VERIFIED SHRINKAGE", 11),
             label(w - 55, h - 23, "SHEET 1/1", 11, "end"), "</svg>"]
    return "".join(body), boxes


def build(config_path: Path, out: Path) -> dict:
    project = json.loads(config_path.read_text())
    adopted_file = json.loads(PROFILE.read_text())
    adopted = adopted_file["cad"]
    require(project["style"] == adopted["style"] == "technical-dense", "unapproved CAD style")
    require(adopted["background"] == "#ffffff" and adopted["outerBorder"] is False,
            "CAD paper style changed")
    require(adopted["sheetComposition"] == {"single": "one-sheet", "multiple": "all-parts-one-sheet"},
            "CAD sheet composition changed")
    require(set(adopted["requiredViews"]) == {"front-elevation", "plan", "hatched-section",
                                             "profile-isometric", "rim-detail", "foot-detail"},
            "required CAD views changed")
    require(adopted["isometricRingFractions"] == list(RING_FRACTIONS), "CAD ring profile changed")
    require(adopted["labelLanguage"] == "en-except-clay-glaze-names"
            and adopted["responsiveFit"] == "contain-entire-sheet", "CAD presentation rule changed")
    project["cadProfile"] = adopted
    parts = [load_part(raw) for raw in project["parts"]]
    require(len({p["id"] for p in parts}) == len(parts), "duplicate part ID")
    require(project["compositionMode"] == ("single" if len(parts) == 1 else "multiple"),
            "composition mode does not match parts")
    out.mkdir(parents=True, exist_ok=True)
    manifest = {"schemaVersion": 1, "project": project["name"],
                "profileId": adopted_file["profileId"], "style": adopted["style"],
                "compositionMode": project["compositionMode"], "sheetCount": 1,
                "scope": "user-selected common CAD visual direction; handled-vessel is a provisional centreline guide, not a manufacturable solid or full project page",
                "parts": [{"id": p["id"], "profileSha256": p["profileSha256"],
                           "dimensionsSha256": p["dimensionsSha256"],
                           "materialSha256": p["materialSha256"],
                           "shapeKind": p["shapeKind"], "handleSha256": p["handleSha256"],
                           "sourceFiles": {"profile": raw["profile"],
                                           "dimensions": raw["dimensions"],
                                           "material": raw["material"],
                                           **({"handle": raw["handle"]} if p["handle"] else {})},
                           "sources": p["sources"], "stationsMm": p["stationsMm"]}
                          for raw, p in zip(project["parts"], parts)], "layouts": {}}
    for size_name in SIZES[project["compositionMode"]]:
        size = sheet_size(project['compositionMode'],len(parts),size_name)
        svg, boxes = render(project, parts, size_name)
        filename = f"sheet-{size_name}.svg"
        (out / filename).write_text(svg, encoding="utf-8")
        manifest["layouts"][size_name] = {"file": filename, "pagePx": size,
                                          "frontBoxes": boxes}
    manifest["layouts"]["short"] = {
        "file": manifest["layouts"]["desktop"]["file"],
        "pagePx": manifest['layouts']['desktop']['pagePx'],
        "frontBoxes": manifest["layouts"]["desktop"]["frontBoxes"],
        "reuseOf": "desktop",
    }
    (out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("config", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    manifest = build(args.config, args.output)
    print(f'SHARED_SHEET_POC_OK {manifest["project"]}: {args.output}')


if __name__ == "__main__":
    main()
