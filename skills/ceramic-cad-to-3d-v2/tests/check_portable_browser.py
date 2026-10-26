"""Run copied skill/output outside the repository with no host server or browser cache."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

parser=argparse.ArgumentParser()
parser.add_argument('--preview',type=Path,required=True)
parser.add_argument('--report',type=Path,required=True)
args=parser.parse_args()
skill=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='ceramic-portable-browser-') as tmp:
    root=Path(tmp); package=root/'skill'; workspace=root/'workspace';workspace.mkdir()
    shutil.copytree(skill,package,ignore=shutil.ignore_patterns('__pycache__','.venv','node_modules'))
    config=json.loads((package/'environment.json').read_text())
    # Reinstall JS dependencies from the copied lock, rather than sharing repository node_modules.
    subprocess.run(['docker','run','--rm','--platform',config['platform'],'--user',f'{os.getuid()}:{os.getgid()}',
                    '--entrypoint','npm','-e','npm_config_cache=/tmp/npm-cache','-v',f'{package}:/skill','-w','/skill',
                    config['browserImage'],'ci','--no-audit','--no-fund'],check=True)
    preview=workspace/'preview';shutil.copytree(args.preview.resolve(),preview)
    env=dict(os.environ,CERAMIC_WORKSPACE=str(workspace),PYTHONPATH=str(package/'scripts'))
    subprocess.run([sys.executable,'-c','from pathlib import Path; import motion; motion.browser_check(Path("preview").resolve())'],
                   cwd=workspace,env=env,check=True)
    report=json.loads((preview/'browser-review/report.json').read_text())
    report['isolation']={'outsideRepository':True,'freshNpmCi':True,'hostServer':False,'hostBrowserCache':False}
    args.report.parent.mkdir(parents=True,exist_ok=True)
    args.report.write_text(json.dumps(report,indent=2)+'\n')
    print('PORTABLE_BROWSER_OK',args.report)
