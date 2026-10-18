"""Validate the selected packaged runtime without historical PoC dependencies."""
from __future__ import annotations
import argparse
import hashlib
import json
import subprocess
from pathlib import Path
from ceramic_paths import ROOT, SKILL, SCRIPTS, ASSETS, PROFILE

def load_profile() -> dict:
    profile = json.loads(PROFILE.read_text(encoding='utf-8'))
    if profile.get('schemaVersion') != 1:
        raise ValueError('Unknown design profile schema')
    cad = profile['cad']
    gallery = profile['gallery']
    if (cad['style'] != 'technical-dense'
            or cad['sheetComposition']['multiple'] != 'all-parts-one-sheet'
            or cad['responsiveFit'] != 'contain-entire-sheet'
            or len(cad['isometricRingFractions']) < 8
            or not {'front-elevation', 'plan', 'hatched-section', 'profile-isometric'} <= set(cad['requiredViews'])):
        raise ValueError('Incomplete CAD generation profile')
    if (gallery['photoOnlyScrollVh'] != 0 or gallery['visibleHeading']
            or gallery['visibleCaption'] or gallery['contentAfterGallery']
            or gallery['lastSectionHeightVh'] != 100):
        raise ValueError('Gallery profile conflicts with the current accepted layout')
    single = profile.get('motion', {}).get('singleFraming', {})
    if (single.get('sourceBaseline') != 'moonGalleryJs'
            or single.get('method') != 'transformed-mesh-bounds'
            or not 0.65 <= single.get('viewportFraction', 0) <= 0.8
            or single.get('minimumWireHeightFraction') != {'desktop': 0.5, 'short': 0.5, 'mobile': 0.3, 'mobile-short': 0.32}):
        raise ValueError('Approved single-vessel framing decision is missing')
    page = profile.get('page', {})
    if (page.get('cadSheetFit') != 'contain-entire-sheet-at-viewport-maximum'
            or any(page.get(key) is not False for key in
                   ('visibleNarration', 'visibleBadge', 'visibleHeader', 'visibleFooter'))
            or page.get('preserveCadInternalAnnotations') is not True):
        raise ValueError('Project page visual profile conflicts with the selected direction')
    return profile

def check_baselines(profile: dict, names: list[str]) -> None:
    for name in names:
        if name not in profile['baselines']:
            raise ValueError(f'Unknown baseline: {name}')
        expected = profile['baselines'][name]
        path = SKILL / expected['path']
        if not path.is_file():
            raise FileNotFoundError(f'Baseline missing: {path}')
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual != expected['sha256']:
            raise ValueError(f'Baseline changed: {name}: {path}; choose and record a new baseline explicitly')

def check_accepted_cad(profile: dict) -> None:
    selected = profile['cad'].get('acceptedDensityStudy')
    if not selected:
        raise ValueError('Accepted CAD density study missing from profile')
    if selected.get('role') != 'fixed-reference-artifacts-only':
        raise ValueError('Accepted CAD files may only be pinned as reference artifacts')
    manifest_path = SKILL / selected['manifest']
    if not manifest_path.is_file():
        raise FileNotFoundError(f'Accepted CAD manifest missing: {manifest_path}')
    if hashlib.sha256(manifest_path.read_bytes()).hexdigest() != selected['sha256']:
        raise ValueError('Accepted CAD manifest changed')
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    if manifest.get('schemaVersion') != 1 or manifest.get('selection') != selected['selection']:
        raise ValueError('Accepted CAD selection mismatch')
    directory = manifest_path.with_suffix('')
    expected = manifest['files']
    actual_files = {p.relative_to(directory).as_posix() for p in directory.rglob('*') if p.is_file()}
    if actual_files != set(expected):
        raise ValueError('Accepted CAD files added or missing')
    for relative, sha in expected.items():
        if Path(relative).is_absolute() or '..' in Path(relative).parts:
            raise ValueError(f'Unsafe accepted CAD path: {relative}')
        if hashlib.sha256((directory / relative).read_bytes()).hexdigest() != sha:
            raise ValueError(f'Accepted CAD artifact changed: {relative}')

def check_runtime() -> None:
    lock = json.loads((SKILL / 'runtime-lock.json').read_text())
    actual = {p.relative_to(SKILL).as_posix() for base in (SCRIPTS, ASSETS)
              for p in base.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
    actual.update({'selection.json', 'requirements.txt', 'requirements-lock.txt', 'package.json', 'package-lock.json', 'environment.json'})
    if actual != set(lock['files']):
        raise ValueError('Runtime files added or missing; review selection before updating its lock')
    for relative, expected in lock['files'].items():
        path = SKILL / relative
        if not path.resolve().is_relative_to(SKILL.resolve()):
            raise ValueError('Runtime points outside this skill: ' + relative)
        if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise ValueError('Selected runtime changed: ' + relative)


def verify_package(names=None):
    profile = load_profile()
    check_baselines(profile, names or list(profile['baselines']))
    check_accepted_cad(profile)
    from jomul_common_cad_baseline import verify_reference
    verify_reference(profile)
    check_runtime()
    return profile


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--release', action='store_true')
    parser.add_argument('--technical', action='store_true', help='Verify release evidence without declaring visual approval or release')
    parser.add_argument('--evidence', type=Path)
    parser.add_argument('--baseline', action='append', default=[])
    args = parser.parse_args()
    profile = verify_package(args.baseline)
    print('CERAMIC_PACKAGE_OK ' + profile['profileId'])
    if args.technical and not args.release:
        parser.error('--technical requires --release')
    if args.evidence and not args.release:
        parser.error('--evidence requires --release')
    if args.release:
        if not args.evidence:
            raise SystemExit('CERAMIC_RELEASE_BLOCKED: supply --evidence with current regression, single/multiple E2E and real visual approvals')
        try:
            from release_gate import check
            result = check(args.evidence, technical=args.technical)
        except (ValueError, OSError, KeyError, TypeError, subprocess.TimeoutExpired) as error:
            raise SystemExit('CERAMIC_RELEASE_BLOCKED: ' + str(error)) from error
        print(('CERAMIC_TECHNICAL_OK ' if args.technical else 'CERAMIC_RELEASE_OK ') + json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
