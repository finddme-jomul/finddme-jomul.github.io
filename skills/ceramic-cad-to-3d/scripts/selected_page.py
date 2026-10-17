"""Restore the selected whole-page inputs exactly; do not claim new-CAD generation."""
import argparse
import json
import shutil
from pathlib import Path
from ceramic_paths import ROOT, SKILL, ASSETS
from photos import sha


def restore(output, cad_project=None, review=None):
    manifest=json.loads((ASSETS/'selected-page.json').read_text())
    source=ASSETS/'selected-page'
    for name,expected in manifest['files'].items():
        if sha(source/name)!=expected: raise ValueError('Selected whole-page source drift: '+name)
    if output.exists(): raise ValueError('Choose an unused output directory; selected restoration never overwrites existing work')
    if not output.is_relative_to(ROOT) or output.is_relative_to(SKILL): raise ValueError('Output must be in the workspace outside the skill')
    stage=output.with_name(output.name+'.building')
    if stage.exists(): raise ValueError('Unresolved selected-page staging directory')
    prepared = None
    if cad_project is not None:
        from selected_cad import prepare
        prepared = prepare(cad_project, review=review)
    try:
        shutil.copytree(source,stage)
        cad_inputs = None
        if prepared is not None:
            from selected_cad import install
            cad_inputs = install(prepared, stage)
        report_dir=output.with_name(output.name+'.verification')
        from browser_environment import run_browser
        run_browser('tests/check-new-page.cjs' if review is not None else 'tests/check-selected-page.cjs',{
            'CERAMIC_BASELINE':'http://127.0.0.1:5173/@fs/ceramic-skill/assets/selected-page/index.html',
            'CERAMIC_CANDIDATE':'http://127.0.0.1:5173/'+stage.relative_to(ROOT).as_posix()+'/index.html',
            'CERAMIC_SCOPE':'selected-CAD-and-surface-regeneration' if prepared is not None else 'selected-input-replay',
            'CERAMIC_REPORT':'/workspace/'+report_dir.relative_to(ROOT).as_posix()})
        report=json.loads((report_dir/'report.json').read_text())
        if report['status']!='passed' or len(report.get('comparisons',report.get('checks',[])))!=48: raise ValueError('Incomplete whole-page parity evidence')
        shutil.copytree(report_dir,stage/'browser-parity')
        for name,expected in manifest['files'].items():
            if review is not None and name!='viewer.js': continue
            if sha(stage/name)!=expected: raise ValueError('Restored output drift: '+name)
        (stage/'restoration.json').write_text(json.dumps({'status':'new-input-review-candidate' if review is not None else ('selected-cad-regeneration-verified' if prepared is not None else 'selected-input-replay-verified'),'newCadGeneration':prepared is not None,'reference':manifest,'browserReportSha256':sha(stage/'browser-parity/report.json')},ensure_ascii=False,indent=2)+'\n')
        if prepared is not None:
            from selected_cad import verify_inputs
            verify_inputs(prepared)
            (stage/'cad-bridge.json').write_text(json.dumps({
                'status':'new-input-review-candidate' if review is not None else 'selected-cad-surface-verified', 'newCadGeneration':True,
                'generated':['assets/front-view.svg','assets/outer-profile.json','assets/cad-sheet.png','assets/cad-sheet.pdf','assets/model.glb'],
                'retainedReference':['scene renderer/timeline'] if review is not None else ['motion','photos'],
                'scope':'New single rotational review; visual adoption pending' if review is not None else 'Compatible selected moon inputs only; visual sampled-floor model, not the exact-floor CAD solid; general inputs pending',
                'outputsSha256':{str(p.relative_to(stage)):sha(p) for p in sorted(stage.rglob('*')) if p.is_file() and 'browser-parity' not in p.relative_to(stage).parts},
                **cad_inputs}, ensure_ascii=False, indent=2)+'\n')
        stage.rename(output)
    finally:
        if stage.exists(): shutil.rmtree(stage)
    print('CERAMIC_SELECTED_PAGE_RESTORED',output)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--cad-project',type=Path,help='Regenerate compatible selected CAD sheet/front/wire/surface; requires the pinned local Blender image')
    parser.add_argument('--review',type=Path,help='Explicit new-input single-vessel review JSON; requires --cad-project')
    args=parser.parse_args()
    if args.review and not args.cad_project: raise ValueError('--review requires --cad-project')
    restore(args.output.expanduser().resolve(), args.cad_project, json.loads(args.review.read_text()) if args.review else None)
