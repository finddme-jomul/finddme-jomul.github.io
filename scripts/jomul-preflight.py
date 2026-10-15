#!/usr/bin/env python3
"""Fail before generation when the selected design baseline or profile has drifted."""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROFILE = ROOT / 'scripts/jomul-design-profile.json'


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
        path = ROOT / expected['path']
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
    manifest_path = ROOT / selected['manifest']
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


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def check_full_page_fixture(profile: dict) -> None:
    """Check the published local fixture against its current sources and browser report."""
    base = ROOT / '.poc/full-page-study'
    manifest = json.loads((base / 'manifest.json').read_text())
    report_path = base / 'browser-review/report.json'
    report = json.loads(report_path.read_text())
    expected_names = {'single-one': ('single', 1), 'single-three': ('single', 3),
                      'multiple-zero': ('multiple', 0), 'multiple-one': ('multiple', 1)}
    layouts = {'desktop', 'short', 'mobile', 'mobile-short'}
    expected_cases = {(name, layout) for name in expected_names for layout in layouts}
    actual_cases = {(case['name'], case['layout']) for case in report['cases']}
    if (manifest.get('scope') != 'full-page-assembly-poc'
            or report.get('status') != 'passed'
            or report.get('scope') != 'full-page-assembly-poc'
            or actual_cases != expected_cases or len(report['cases']) != 16
            or manifest.get('browserReportSha256') != digest(report_path)):
        raise ValueError('Full-page browser evidence missing, incomplete, or changed')
    for case in report['cases']:
        if len(case['states']) != 6 or [state['stage'] for state in case['states']] != [
                'cad', 'wire', 'clay', 'glaze', 'exit', 'final']:
            raise ValueError('Full-page stage evidence incomplete')
        name = case['name']
        if case['mode'] != expected_names[name][0] or case['photoCount'] != expected_names[name][1]:
            raise ValueError('Full-page browser case differs from fixture contract')
    sources = {
        'single-one': ('moon-jar-skill-handoff.json', 'moon-jar'),
        'single-three': ('moon-jar-multi-photo-study.json', 'moon-jar'),
        'multiple-zero': ('bowl-set-skill-no-photo.json', 'bowl-set'),
        'multiple-one': ('bowl-set-skill-handoff.json', 'bowl-set'),
    }
    case_manifests = {item['case']: item for item in manifest['cases']}
    if set(case_manifests) != set(expected_names):
        raise ValueError('Full-page fixture cases differ from manifest')
    for name, (mode, photo_count) in expected_names.items():
        page = base / name
        record = json.loads((page / 'page-manifest.json').read_text())
        scene_path = page / 'assets/scene.json'
        scene = json.loads(scene_path.read_text())
        page_profile_path = page / 'assets/page-profile.json'
        page_profile = json.loads(page_profile_path.read_text())
        config_name, sheet_name = sources[name]
        source_config = ROOT / 'docs/artifacts/configured-scroll-poc/configs' / config_name
        sheet_manifest = base / '_sheets' / sheet_name / 'manifest.json'
        if (record['sourceConfigSha256'] != digest(source_config)
                or record['commonSheetSha256'] != digest(sheet_manifest)
                or any(digest(page / item['publicPath']) != item['publicSha256']
                       for item in record['photos'])):
            raise ValueError(f'{name}: source config, CAD sheet, or photo changed')
        if (record != case_manifests[name] or record['mode'] != mode
                or record['photoCount'] != photo_count
                or record['sceneSha256'] != digest(scene_path)
                or record['pageProfileSha256'] != digest(page_profile_path)
                or page_profile['sourceProfileSha256'] != digest(PROFILE)
                or digest(page / 'viewer.js') != digest(ROOT / 'docs/artifacts/full-page-study/viewer.js')):
            raise ValueError(f'{name}: generated page differs from its recorded source')
        if mode == 'single' and scene['motion'].get('singleFraming') != profile['motion']['singleFraming']:
            raise ValueError(f'{name}: selected moon framing is not consumed')
    print('CERAMIC_FIXTURE_OK 16 cases / local full-page-study')


def check_release_readiness(profile: dict) -> None:
    """Fail closed until distributable code and explicit visual approval exist."""
    import subprocess
    tracked = set(subprocess.check_output(['git', 'ls-files'], cwd=ROOT, text=True).splitlines())
    # Historical PoC targets are comparison tools, not release dependencies.
    # These are direct dependencies of the current project CLI; consolidation
    # must replace this local route with the selected skill-owned runtime.
    required = {
        'docs/artifacts/cad-style/shared_sheet_poc.py',
        'docs/artifacts/cad-style/check_shared_sheet_poc.py',
        'docs/artifacts/axis-motion-shared-study/build_project.py',
    }
    missing = sorted(required - tracked)
    reasons = []
    if not (ROOT / 'skills/ceramic-cad-to-3d/scripts/jomul-project-assets.py').is_file():
        reasons.append('selected project runtime is not consolidated inside the skill')
    skill = ROOT / 'skills/ceramic-cad-to-3d/SKILL.md'
    if ('skills/ceramic-cad-to-3d/SKILL.md' not in tracked
            or not skill.is_file()
            or not skill.read_text().startswith('---\nname: ceramic-cad-to-3d\n')):
        reasons.append('named skill entrypoint is missing, unversioned, or misnamed')
    if missing:
        reasons.append(f'{len(missing)} executable sources are not versioned (first: {missing[0]})')
    report_sha = digest(ROOT / '.poc/full-page-study/browser-review/report.json')
    for filename, label in (
            ('full-page-visual-approved.json', 'matched-point full-page visual approval'),
            ('multi-photo-layout-approved.json', 'varied-size multi-photo layout approval'),
            ('new-project-e2e-approved.json', 'new-project end-to-end approval')):
        relative = f'scripts/baselines/{filename}'
        evidence = ROOT / relative
        if not evidence.is_file() or relative not in tracked:
            reasons.append(f'{label} evidence is missing or not versioned')
            continue
        try:
            decision = json.loads(evidence.read_text())
        except (OSError, json.JSONDecodeError):
            reasons.append(f'{label} evidence is unreadable')
            continue
        if (decision.get('status') != 'adopted'
                or decision.get('profileSha256') != digest(PROFILE)
                or decision.get('browserReportSha256') != report_sha
                or not decision.get('decisionSource')):
            reasons.append(f'{label} evidence lacks current hashes or decision provenance')
    if "sub.add_parser('page')" not in (ROOT / 'scripts/jomul-project-assets.py').read_text():
        reasons.append('project CLI has no finished-page command')
    if reasons:
        raise SystemExit('CERAMIC_RELEASE_BLOCKED: ' + '; '.join(reasons))
    print('CERAMIC_RELEASE_READY')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--baseline', action='append', default=[], help='Baseline ID to require')
    parser.add_argument('--full-page-fixture', action='store_true', help='verify the published local full-page PoC')
    parser.add_argument('--release', action='store_true', help='fail unless the skill is reproducible and approved')
    args = parser.parse_args()
    profile = load_profile()
    check_baselines(profile, args.baseline or list(profile['baselines']))
    check_accepted_cad(profile)
    from jomul_common_cad_baseline import verify_reference
    verify_reference(profile)
    print(f"JOMUL_PREFLIGHT_OK {profile['profileId']}: {','.join(args.baseline or profile['baselines'])}")
    if args.full_page_fixture or args.release:
        check_full_page_fixture(profile)
    if args.release:
        check_release_readiness(profile)


if __name__ == '__main__':
    main()
