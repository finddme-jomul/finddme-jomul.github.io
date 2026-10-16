"""Restore the selected whole-page inputs exactly; do not claim new-CAD generation."""
import argparse
import json
import shutil
from pathlib import Path
from ceramic_paths import ROOT, SKILL, ASSETS
from photos import sha


def restore(output):
    manifest=json.loads((ASSETS/'selected-page.json').read_text())
    source=ASSETS/'selected-page'
    for name,expected in manifest['files'].items():
        if sha(source/name)!=expected: raise ValueError('Selected whole-page source drift: '+name)
    if output.exists(): raise ValueError('Choose an unused output directory; selected restoration never overwrites existing work')
    if not output.is_relative_to(ROOT) or output.is_relative_to(SKILL): raise ValueError('Output must be in the workspace outside the skill')
    stage=output.with_name(output.name+'.building')
    if stage.exists(): raise ValueError('Unresolved selected-page staging directory')
    try:
        shutil.copytree(source,stage)
        report_dir=output.with_name(output.name+'.verification')
        from browser_environment import run_browser
        run_browser('tests/check-selected-page.cjs',{
            'CERAMIC_BASELINE':'http://127.0.0.1:5173/@fs/ceramic-skill/assets/selected-page/index.html',
            'CERAMIC_CANDIDATE':'http://127.0.0.1:5173/'+stage.relative_to(ROOT).as_posix()+'/index.html',
            'CERAMIC_REPORT':'/workspace/'+report_dir.relative_to(ROOT).as_posix()})
        report=json.loads((report_dir/'report.json').read_text())
        if report['status']!='passed' or len(report['comparisons'])!=48: raise ValueError('Incomplete whole-page parity evidence')
        shutil.copytree(report_dir,stage/'browser-parity')
        for name,expected in manifest['files'].items():
            if sha(stage/name)!=expected: raise ValueError('Restored output drift: '+name)
        (stage/'restoration.json').write_text(json.dumps({'status':'selected-input-replay-verified','newCadGeneration':False,'reference':manifest,'browserReportSha256':sha(stage/'browser-parity/report.json')},ensure_ascii=False,indent=2)+'\n')
        stage.rename(output)
    finally:
        if stage.exists(): shutil.rmtree(stage)
    print('CERAMIC_SELECTED_PAGE_RESTORED',output)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    restore(args.output.expanduser().resolve())
