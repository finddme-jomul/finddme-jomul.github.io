"""Validate provenance and uncertainty in the local P1 sketch extraction PoC."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
STATES = {"sketch-observed", "user-confirmed", "assumed", "derived", "unresolved"}


def validate(data: dict) -> list[str]:
    errors: list[str] = []
    src = data.get("source", {})
    source_path = Path(src.get("path", ""))
    if not source_path.is_file():
        errors.append("source sketch is missing")
    else:
        digest = hashlib.sha256(source_path.read_bytes()).hexdigest()
        if digest != src.get("sha256"):
            errors.append("source sketch hash changed")
        with Image.open(source_path) as image:
            if list(ImageOps.exif_transpose(image).size) != src.get("orientedSizePx"):
                errors.append("oriented source dimensions changed")
    if not any(v.get("name") == "front" and v.get("status") == "observed" for v in data.get("views", [])):
        errors.append("no observed front view")
    ids: set[str] = set()
    for item in data.get("observations", []):
        ident = item.get("id")
        if not ident or ident in ids:
            errors.append(f"duplicate or missing observation ID: {ident}")
        ids.add(ident)
        state = item.get("status")
        if state not in STATES:
            errors.append(f"{ident}: invalid status")
        if state == "unresolved" and item.get("value") is not None:
            errors.append(f"{ident}: unresolved observation must not have a confirmed value")
        box = item.get("sourceRegion")
        if not isinstance(box, list) or len(box) != 4 or any(not isinstance(v, (int, float)) for v in box):
            errors.append(f"{ident}: missing normalized source region")
        elif not (0 <= box[0] < 1 and 0 <= box[1] < 1 and 0 < box[2] <= 1 - box[0] and 0 < box[3] <= 1 - box[1]):
            errors.append(f"{ident}: source region outside image")
        value = item.get("value")
        if item.get("kind") == "dimension" and value is not None:
            if value.get("unit") != "mm" or value.get("min", 0) <= 0 or value.get("max", 0) < value.get("min", 0):
                errors.append(f"{ident}: invalid dimension interval")
    if data.get("schemaVersion") != 2:
        errors.append("expected P1 schemaVersion 2")
    question_ids: set[str] = set()
    question_fields: set[str] = set()
    for question in data.get("questions", []):
        qid = question.get("id")
        if not qid or qid in question_ids or not question.get("priority") or not question.get("fields"):
            errors.append(f"incomplete or duplicate question: {qid}")
        question_ids.add(qid)
        for field in question.get("fields", []):
            key = field.get("field")
            if not key or key in question_fields or not field.get("prompt"):
                errors.append(f"incomplete or duplicate question field: {key}")
            question_fields.add(key)
            kind = field.get("type")
            if kind == "number":
                if field.get("unit") != "mm" or not 0 < field.get("min", 0) <= field.get("max", 0):
                    errors.append(f"{key}: invalid numeric question constraint")
            elif kind == "enum":
                if len(field.get("choices", [])) < 2:
                    errors.append(f"{key}: enum question needs choices")
            elif kind != "text":
                errors.append(f"{key}: invalid question type")
    unresolved_keys = {entry.get("field") for entry in data.get("unresolved", [])}
    if not unresolved_keys.issubset(question_fields):
        errors.append(f"unresolved fields without a question: {sorted(unresolved_keys - question_fields)}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    for name in ("moon-jar.json", "mug.json"):
        data = json.loads((ROOT / name).read_text())
        errors = validate(data)
        if errors:
            print(name, "FAIL:", "; ".join(errors))
            return 1
        print(name, "PASS:", len(data["observations"]), "observations,", len(data["questions"]), "questions")
        if args.self_test:
            import copy
            bad = copy.deepcopy(data)
            bad["observations"][0]["sourceRegion"] = [0.95, 0.95, 0.1, 0.1]
            assert any("outside image" in err for err in validate(bad))
            bad = copy.deepcopy(data)
            unresolved = next((o for o in bad["observations"] if o["status"] == "unresolved"), None)
            if unresolved:
                unresolved["value"] = {"min": 20, "max": 20, "unit": "mm"}
                assert any("must not have" in err for err in validate(bad))
    return 0
