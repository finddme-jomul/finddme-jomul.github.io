#!/usr/bin/env python3
"""Check profile provenance, required views, and frontBox geometry in PoC sheets."""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from pathlib import Path
from ceramic_paths import ROOT, PROFILE
from xml.etree import ElementTree as ET

from isometric_geometry import RING_FRACTIONS, sample_rings, point as iso_point
from cad_density_geometry import diameter_stations
from handled_geometry import sampled_centerline

COORD = re.compile(r"(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)")


def check(out: Path, config: Path) -> None:
    manifest = json.loads((out / "manifest.json").read_text())
    project = json.loads(config.read_text())
    assert manifest["sheetCount"] == 1
    profile_id = json.loads((PROFILE).read_text())["profileId"]
    assert manifest["profileId"] == profile_id
    assert manifest["compositionMode"] == project["compositionMode"]
    assert len(manifest["parts"]) == len(project["parts"])
    expected_ids = {part["id"] for part in project["parts"]}
    assert len(manifest["layouts"]) == 4
    assert manifest["layouts"]["short"]["reuseOf"] == "desktop"
    assert manifest["layouts"]["short"]["file"] == manifest["layouts"]["desktop"]["file"]
    assert manifest["layouts"]["short"]["frontBoxes"] == manifest["layouts"]["desktop"]["frontBoxes"]
    assert not (out / "sheet-short.svg").exists()
    for name, layout in manifest["layouts"].items():
        page_w, page_h = layout["pagePx"]
        root = ET.parse(out / layout["file"]).getroot()
        assert root.attrib["width"] == str(page_w)
        assert root.attrib["height"] == str(page_h)
        groups = {node.attrib["data-part"]: node for node in root.iter()
                  if "data-part" in node.attrib}
        assert set(groups) == expected_ids, (name, "part groups")
        assert set(layout["frontBoxes"]) == expected_ids, (name, "front boxes")
        sheet_text = " ".join(node.text or "" for node in root.iter()
                              if node.tag.endswith("text"))
        if project["compositionMode"] == "multiple" and len(project['parts']) <= 2:
            assert "WET H" not in sheet_text, (name, "unverified forming size leaked")
            if name in ("desktop", "short"):
                assert all(token in sheet_text for token in ("PART", "HEIGHT", "SOURCE")), (name, "part table")
            else:
                assert sheet_text.count("PROFILE OUTER Ø") == len(project["parts"]), (name, "per-part stations")
        elif project['compositionMode'] == 'single':
            record = json.loads((ROOT /
                                 project["parts"][0]["dimensions"]).read_text())
            shrink = record.get("shrinkage")
            expected = (f'SHRINKAGE {shrink["totalPercent"]:g}% ASSUMED'
                        if shrink and record.get("wetBuildMm") else "SHRINKAGE UNRESOLVED")
            if name == "desktop":
                assert expected in sheet_text, (name, "forming size provenance")
        for raw in project["parts"]:
            pid = raw["id"]
            group = groups[pid]
            nodes = list(group.iter())
            front = [node for node in nodes if node.attrib.get("data-front-part") == pid]
            iso = [node for node in nodes if node.attrib.get("data-iso-part") == pid]
            assert len(front) == len(iso) == 1, (name, pid, "front/isometric")
            assert len([node for node in nodes if node.tag.endswith("circle")]) >= 2, (name, pid, "plan")
            assert len([node for node in nodes if node.attrib.get("class") == "section"]) == 1, (name, pid, "section")
            assert len([node for node in nodes if node.attrib.get("data-iso-ring") is not None]) == 2 * len(RING_FRACTIONS), (name, pid, "rings")
            assert len([node for node in nodes if node.attrib.get("data-iso-side") is not None]) == 2, (name, pid, "sides")
            assert len([node for node in nodes if node.attrib.get("data-iso-rim") is not None]) == 2, (name, pid, "rims")
            profile_path = ROOT / raw["profile"]
            profile = json.loads(profile_path.read_text())
            dims_path = ROOT / raw["dimensions"]
            record = json.loads(dims_path.read_text())
            dims = record[raw.get("dimensionsKey", "valuesMm")]
            source_sha = hashlib.sha256(profile_path.read_bytes()).hexdigest()
            source_meta = next(p for p in manifest["parts"] if p["id"] == pid)
            assert iso[0].attrib["data-profile-sha256"] == source_sha
            assert source_meta["profileSha256"] == source_sha
            assert source_meta["stationsMm"] == [list(pair) for pair in diameter_stations(profile, dims["height"])]
            assert source_meta["dimensionsSha256"] == hashlib.sha256(dims_path.read_bytes()).hexdigest()
            material_path = ROOT / raw["material"]
            assert source_meta["materialSha256"] == hashlib.sha256(material_path.read_bytes()).hexdigest()
            handle_path = (ROOT / raw["handle"]
                           if raw.get("shapeKind") == "handled-vessel" else None)
            assert source_meta.get("shapeKind", "rotational-profile") == raw.get("shapeKind", "rotational-profile")
            assert source_meta.get("handleSha256") == (hashlib.sha256(handle_path.read_bytes()).hexdigest()
                                                   if handle_path else None)
            assert source_meta["sourceFiles"] == {"profile": raw["profile"],
                                                  "dimensions": raw["dimensions"],
                                                  "material": raw["material"],
                                                  **({"handle": raw["handle"]} if handle_path else {})}
            rings = [node for node in nodes if node.attrib.get("data-iso-ring") is not None]
            for fraction, _, radius in sample_rings(profile, dims["height"]):
                pair = [r for r in rings if abs(float(r.attrib["data-iso-ring"]) - fraction) < 1e-8]
                assert len(pair) == 2 and all(abs(float(r.attrib["data-radius-mm"]) - radius) < 1e-5 for r in pair), (name, pid, fraction)
            coords = [(float(x), float(y)) for x, y in COORD.findall(front[0].attrib["d"])]
            assert len(coords) > 10, (name, pid, "front profile points")
            actual = {"cx": (min(x for x, _ in coords) + max(x for x, _ in coords)) / 2 / page_w,
                      "cy": (min(y for _, y in coords) + max(y for _, y in coords)) / 2 / page_h,
                      "width": (max(x for x, _ in coords) - min(x for x, _ in coords)) / page_w,
                      "height": (max(y for _, y in coords) - min(y for _, y in coords)) / page_h}
            box = layout["frontBoxes"][pid]
            if handle_path:
                handle = json.loads(handle_path.read_text())
                strokes = [node for node in nodes if node.attrib.get("data-front-handle") == pid]
                plans = [node for node in nodes if node.attrib.get("data-plan-handle") == pid]
                isos = [node for node in nodes if node.attrib.get("data-iso-handle") == pid]
                assert len(strokes) == len(plans) == len(isos) == 1, (name, pid, "handle views")
                coords_h = [(float(x), float(y)) for x, y in COORD.findall(strokes[0].attrib["d"])]
                centerline = sampled_centerline(handle)
                body_x = [x for x, _ in coords]
                body_y = [y for _, y in coords]
                front_cx = (min(body_x) + max(body_x)) / 2
                front_base = max(body_y)
                front_scale = (max(body_y) - min(body_y)) / dims["height"]
                expected_front = [(front_cx + x * front_scale, front_base - z * front_scale)
                                  for x, _, z in centerline]
                assert len(coords_h) == len(expected_front)
                assert all(math.dist(a, b) < .035 for a, b in zip(coords_h, expected_front)), (name, pid, "front handle projection")
                circles = [node for node in nodes if node.tag.endswith("circle")]
                plan_cx, plan_cy, plan_r = (float(circles[0].attrib[key]) for key in ("cx", "cy", "r"))
                plan_scale = plan_r / (dims["maxDiameter"] / 2)
                plan_coords = [(float(x), float(y)) for x, y in COORD.findall(plans[0].attrib["d"])]
                expected_plan = [(plan_cx + x * plan_scale, plan_cy + y * plan_scale)
                                 for x, y, _ in centerline]
                assert len(plan_coords) == len(expected_plan)
                assert all(math.dist(a, b) < .035 for a, b in zip(plan_coords, expected_plan)), (name, pid, "plan handle projection")
                sides = [node for node in iso[0].iter() if node.attrib.get("data-iso-side") is not None]
                left_side = [(float(x), float(y)) for x, y in COORD.findall(sides[0].attrib["d"])]
                right_side = [(float(x), float(y)) for x, y in COORD.findall(sides[1].attrib["d"])]
                index = max(range(len(profile)), key=lambda i: profile[i][0])
                iso_cx = (left_side[index][0] + right_side[index][0]) / 2
                iso_scale = (right_side[index][0] - left_side[index][0]) / (2 * profile[index][0])
                iso_base = left_side[index][1] + profile[index][1] * iso_scale * math.sqrt(2 / 3)
                iso_coords = [(float(x), float(y)) for x, y in COORD.findall(isos[0].attrib["d"])]
                expected_iso = [iso_point(math.hypot(x, y), z, math.atan2(y, x),
                                          iso_cx, iso_base, iso_scale, y_down=True)
                                for x, y, z in centerline]
                assert len(iso_coords) == len(expected_iso)
                assert all(math.dist(a, b) < .05 for a, b in zip(iso_coords, expected_iso)), (name, pid, "iso handle projection")
                half_stroke = float(strokes[0].attrib["stroke-width"]) / 2
                min_x = min(min(x for x, _ in coords), min(x for x, _ in coords_h) - half_stroke)
                max_x = max(max(x for x, _ in coords), max(x for x, _ in coords_h) + half_stroke)
                actual["cx"] = (min_x + max_x) / 2 / page_w
                actual["width"] = (max_x - min_x) / page_w
                assert handle["status"] in ("synthetic-test", "reviewed-provisional", "user-confirmed")
            else:
                assert not any(node.attrib.get("data-front-handle") == pid for node in nodes)
            actual['cx'] += float(group.attrib.get('data-layout-x',0)) / page_w
            actual['cy'] += float(group.attrib.get('data-layout-y',0)) / page_h
            if 'data-layout-x' in group.attrib:
                assert group.attrib['transform'] == f"translate({group.attrib['data-layout-x']},{group.attrib['data-layout-y']})"
            assert all(abs(actual[key] - box[key]) < .0001 for key in actual), (name, pid, "frontBox/profile mismatch")
            assert 0 < box["cx"] - box["width"] / 2 < box["cx"] + box["width"] / 2 < 1
            assert 0 < box["cy"] - box["height"] / 2 < box["cy"] + box["height"] / 2 < 1
            visible = [node.text or "" for node in nodes if node.tag.endswith("text")]
            labels = " ".join(visible)
            if name in ('desktop', 'short'):
                station_title = 'CAD PROFILE STATIONS / ' + ('INPUT' if 'footHeight' in dims else 'FIRED')
                assert labels.count(station_title) == 1, (name, pid, 'dimension stage label')
            assert all(token in labels for token in ("FRONT ELEVATION", "PLAN", "SECTION", "ISOMETRIC", "CLAY", "GLAZE")), (name, pid, "view labels")
            if handle_path:
                assert f'OVERALL {handle["overallWidthMm"]:g} mm' in labels, (name, pid, "overall width dimension")
            assert all(not re.search(r"[가-힣]", item) or item.startswith("CLAY /") or re.match(r"GLAZE \d+ /", item)
                       for item in visible), (name, pid, "Korean outside material names")
    text = (out / manifest["layouts"]["desktop"]["file"]).read_text()
    assert text.count("CAD PROFILE STATIONS / ") == len(project["parts"])
    for source_part in manifest["parts"]:
        for _, diameter in source_part["stationsMm"]:
            assert f"≈{diameter:.1f}" in text
    colors = []
    for raw in project["parts"]:
        material_data = json.loads((ROOT / raw["material"]).read_text())
        if raw["materialFormat"] == "single":
            material = material_data
            layers = [material["glaze"]]
        else:
            material = next(p["material"] for p in material_data["composition"]["parts"]
                            if p["id"] == raw["id"])
            layers = material["glazeLayers"]
        colors += [color for color in [material["clay"].get("wetPreviewHex"),
                                       *[layer.get("firedAppearancePreviewHex") for layer in layers]] if color]
    for color in colors:
        assert f'data-preview-color="{color}"' in text, ("preview color missing", color)
    if not colors:
        assert "data-preview-color" not in text, "unverified material swatch leaked"
    print(f'SHARED_SHEET_CONTRACT_OK {manifest["project"]}: four layout choices, {len(expected_ids)} part(s)')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("config", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    check(args.output, args.config)


if __name__ == "__main__":
    main()
