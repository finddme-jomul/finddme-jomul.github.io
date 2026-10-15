"""Protect the user-selected common CAD fixtures without restricting new inputs."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path

from ceramic_paths import ROOT, SKILL, SCRIPTS, ASSETS, PROFILE

def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def verify_reference(profile: dict) -> dict:
    selected = profile["cad"].get("acceptedCommonSheet")
    if not selected or selected.get("role") != "fixed-reference-fixtures-only":
        raise ValueError("Selected common CAD fixture contract missing")
    path = SKILL / selected["manifest"].replace("scripts/baselines/", "assets/baselines/")
    if sha(path) != selected["sha256"]:
        raise ValueError("Selected common CAD manifest changed")
    manifest = json.loads(path.read_text())
    if manifest.get("schemaVersion") != 1 or manifest.get("selection") != selected["selection"]:
        raise ValueError("Selected common CAD identity mismatch")
    directory = path.with_suffix("")
    expected = manifest["files"]
    actual = {p.relative_to(directory).as_posix() for p in directory.rglob("*") if p.is_file()}
    if actual != set(expected):
        raise ValueError("Selected common CAD reference files missing or added")
    for relative, digest in expected.items():
        rel = Path(relative)
        if rel.is_absolute() or ".." in rel.parts or sha(directory / rel) != digest:
            raise ValueError(f"Selected common CAD reference changed: {relative}")
    return manifest

def verify_fixture_outputs(profile: dict, directory: Path) -> None:
    """Call only for the two canonical fixture builds, never for a new project."""
    manifest = verify_reference(profile)
    for relative, digest in manifest["files"].items():
        target = directory / relative
        if not target.is_file() or sha(target) != digest:
            raise ValueError(f"Selected common CAD fixture drift: {relative}")
