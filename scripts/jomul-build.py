#!/usr/bin/env python3
"""Only supported entry points for approved project-asset PoCs.

A new fixture must be registered here against the accepted profile. This
prevents a new standalone generator from silently taking over the review URL.
"""
from __future__ import annotations
import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROFILE = ROOT / 'scripts/jomul-design-profile.json'

TARGETS = {
    'full-page-study': {
        'command': ['docs/artifacts/full-page-study/build.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/full-page-study/index.html',
        'coverage': 'common CAD-to-wire-to-clay-to-glaze-to-gallery pages for single/multiple fixtures',
    },
    'gallery-cardinality-study': {
        'command': ['docs/artifacts/page-components/build-gallery-cardinality-study.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/gallery-cardinality-study/one/index.html',
        'coverage': 'gallery-stage zero/one/three photo cardinality technical fixture',
    },
    'axis-motion-shared-study': {
        'command': ['docs/artifacts/axis-motion-shared-study/build.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/axis-motion-shared-study/index.html',
        'coverage': 'moon and bowl isolated page copies using one shared axis transform',
    },
    'mug-moon-motion-study': {
        'command': ['docs/artifacts/mug-validation/moon-motion/build.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/mug-moon-motion-study/index.html',
        'coverage': 'provisional mug CAD handoff with moon-derived axis tilt and full rotation',
    },
    'mug-provisional-handoff-study': {
        'command': ['docs/artifacts/mug-validation/moon-motion/build_current.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/mug-provisional-handoff-study/index.html',
        'coverage': 'current provisional mug CAD handoff with axis tilt and full rotation',
    },
    'mug-shape-inspection-study': {
        'command': ['docs/artifacts/mug-validation/browser-handoff/build.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/mug-shape-inspection-study/index.html',
        'coverage': 'isolated camera-orbit inspection of provisional mug side and rear shape',
    },
    'bowl-set-comparison': {
        'command': ['docs/artifacts/bowl-gallery-generalization/build.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/bowl-set-gallery-comparison/index.html',
        'coverage': 'combined CAD + approved gallery settings over preserved bowl scene',
    },
    'moon-jar-gallery-shared-study': {
        'command': ['docs/artifacts/page-components/build-moon-shared-study.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs'],
        'output': '.poc/moon-jar-gallery-shared-study/index.html',
        'coverage': 'approved moon page preserved; shared final-gallery component comparison',
    },
    'cad-shared-sheet-study': {
        'command': ['docs/artifacts/cad-style/build_shared_sheet_study.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/cad-shared-sheet-study/index.html',
        'coverage': 'user-selected rotational single/multiple CAD fixture with generated frontBoxes',
    },
    'cad-density-study': {
        'command': ['docs/artifacts/cad-style/build_density_study.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/cad-density-study/index.html',
        'coverage': 'current CAD sheets with profile-sourced detail comparison; visual review pending',
    },
    'cad-common-handoff-study': {
        'command': ['docs/artifacts/cad-style/build_common_handoff_study.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/cad-common-handoff-study/index.html',
        'coverage': 'selected common CAD and frontBoxes in quiet full-sheet viewer copies',
    },
    'cad-responsive-density-study': {
        'command': ['docs/artifacts/cad-style/build_responsive_density_study.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs', 'bowlHandoffHtml', 'bowlHandoffJs'],
        'output': '.poc/cad-responsive-density-study/index.html',
        'coverage': 'portrait moon and bowl density variants; desktop sheet reused on short landscape',
    },
    'moon-jar-cad': {
        'command': ['docs/artifacts/moon-jar-sheet-study/build.py'],
        'baselines': ['moonGalleryHtml', 'moonGalleryJs'],
        'output': 'docs/artifacts/moon-jar-sheet-study/output/moon-jar-atelier-sheet.pdf',
        'coverage': 'CAD sheet only; not a full project page build',
    },
}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('target', choices=sorted(TARGETS))
    parser.add_argument('--force', action='store_true')
    parser.add_argument('--python', default=sys.executable, help='Python interpreter with target dependencies installed')
    args = parser.parse_args()
    profile = json.loads(PROFILE.read_text())
    target = TARGETS[args.target]
    preflight = [sys.executable, str(ROOT / 'scripts/jomul-preflight.py')]
    for name in target['baselines']:
        preflight += ['--baseline', name]
    subprocess.run(preflight, cwd=ROOT, check=True)
    command = [args.python, str(ROOT / target['command'][0])]
    if args.force and args.target in ('bowl-set-comparison', 'cad-shared-sheet-study', 'cad-density-study', 'cad-responsive-density-study', 'cad-common-handoff-study'):
        command.append('--force')
    subprocess.run(command, cwd=ROOT, check=True)
    output = ROOT / target['output']
    if not output.is_file():
        raise SystemExit(f'Expected output missing: {output}')
    if args.target == 'mug-provisional-handoff-study':
        import hashlib
        source = ROOT / 'docs/artifacts/mug-validation/moon-motion'
        for name in ('index.html', 'viewer.js'):
            actual = (output.parent / name).read_bytes()
            expected = (source / name).read_bytes()
            if hashlib.sha256(actual).digest() != hashlib.sha256(expected).digest():
                raise SystemExit(f'Current mug review URL reverted to a non-motion {name}')
        if not (output.parent / 'motion-config.json').is_file() or not (output.parent / 'browser-review/report.json').is_file():
            raise SystemExit('Current mug review URL lacks axis settings or browser gate report')
    print(f"JOMUL_BUILD_OK {profile['profileId']} / {args.target} / {target['coverage']} / {output}")


if __name__ == '__main__':
    main()
