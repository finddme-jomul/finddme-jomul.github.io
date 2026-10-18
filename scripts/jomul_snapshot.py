#!/usr/bin/env python3
"""Exact local snapshots for generated JOMUL comparison pages.

Snapshots live under ignored .poc/_snapshots. They are local safety copies,
not Git history or a substitute for a private backup.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STORE = ROOT / '.poc/_snapshots'
ALLOWED = {
    'full-page-study': ROOT / '.poc/full-page-study',
    'gallery-cardinality-study': ROOT / '.poc/gallery-cardinality-study',
    'bowl-set-gallery-comparison': ROOT / '.poc/bowl-set-gallery-comparison',
    'moon-jar-gallery-shared-study': ROOT / '.poc/moon-jar-gallery-shared-study',
    'cad-shared-sheet-study': ROOT / '.poc/cad-shared-sheet-study',
    'cad-density-study': ROOT / '.poc/cad-density-study',
    'cad-responsive-density-study': ROOT / '.poc/cad-responsive-density-study',
    'cad-common-handoff-study': ROOT / '.poc/cad-common-handoff-study',
}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def manifest_for(directory: Path) -> dict[str, str]:
    return {str(path.relative_to(directory)): digest(path) for path in sorted(directory.rglob('*')) if path.is_file()}


def snapshot_dir(name: str) -> Path:
    source = ALLOWED[name]
    if not source.is_dir():
        raise FileNotFoundError(source)
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    target = STORE / name / f'{stamp}-{uuid.uuid4().hex[:8]}'
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source, target / 'files')
    files = manifest_for(target / 'files')
    (target / 'manifest.json').write_text(json.dumps({
        'schemaVersion': 1, 'target': name, 'createdUtc': stamp,
        'files': files,
    }, indent=2) + '\n')
    if files != manifest_for(source):
        shutil.rmtree(target)
        raise RuntimeError('Source changed during snapshot')
    return target


def verify_snapshot(path: Path, name: str) -> None:
    data = json.loads((path / 'manifest.json').read_text())
    if data.get('target') != name or data.get('schemaVersion') != 1:
        raise ValueError('Snapshot target/schema mismatch')
    if data['files'] != manifest_for(path / 'files'):
        raise ValueError('Snapshot contents changed')


def restore_snapshot(name: str, snapshot: Path, into: Path | None = None) -> Path:
    snapshot = snapshot.resolve()
    parent = (STORE / name).resolve()
    if parent not in snapshot.parents:
        raise ValueError('Snapshot must belong to the requested target')
    verify_snapshot(snapshot, name)
    target = into or ALLOWED[name]
    if into is None and target.exists():
        preserved = snapshot_dir(name)
        print(f'Current page preserved as {preserved}')
    staging = target.with_name(target.name + '.restoring')
    if staging.exists():
        shutil.rmtree(staging)
    shutil.copytree(snapshot / 'files', staging)
    if manifest_for(staging) != json.loads((snapshot / 'manifest.json').read_text())['files']:
        raise RuntimeError('Restore copy failed checksum')
    backup = target.with_name(target.name + '.before-restore')
    if backup.exists():
        shutil.rmtree(backup)
    if target.exists():
        target.rename(backup)
    try:
        staging.rename(target)
    except Exception:
        if backup.exists():
            backup.rename(target)
        raise
    if backup.exists():
        shutil.rmtree(backup)
    return target


def main() -> None:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest='action', required=True)
    for action in ('create', 'list'):
        command = sub.add_parser(action)
        command.add_argument('target', choices=sorted(ALLOWED))
    restore = sub.add_parser('restore')
    restore.add_argument('target', choices=sorted(ALLOWED))
    restore.add_argument('snapshot', type=Path)
    restore.add_argument('--into', type=Path, help='Safe comparison destination instead of replacing the live page')
    args = parser.parse_args()
    if args.action == 'create':
        print(snapshot_dir(args.target))
    elif args.action == 'list':
        for path in sorted((STORE / args.target).glob('*/manifest.json')):
            print(path.parent)
    else:
        print(restore_snapshot(args.target, args.snapshot, args.into))


if __name__ == '__main__':
    main()
