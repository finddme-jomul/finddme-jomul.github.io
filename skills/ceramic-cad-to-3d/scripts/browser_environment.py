"""Pinned browser tooling independent of a host server, port or Chrome cache."""
import json
import os
from pathlib import Path
import subprocess
from ceramic_paths import SKILL, ROOT


def run_browser(checker, variables):
    config=json.loads((SKILL/'environment.json').read_text())
    if not (SKILL/'node_modules/vite/bin/vite.js').is_file():
        raise RuntimeError('Skill dependencies missing; run environment --setup')
    command=['docker','run','--rm','--pull=never','--platform',config['platform'],
             '--network','none','--user',f'{os.getuid()}:{os.getgid()}',
             '--entrypoint','node','-e','HOME=/tmp','-e','XDG_CONFIG_HOME=/tmp/chrome-config',
             '-e','PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer',
             '-v',f'{ROOT}:/workspace','-v',f'{SKILL}:/ceramic-skill:ro']
    for key,value in variables.items():command += ['-e',f'{key}={value}']
    command += [config['browserImage'],'/ceramic-skill/scripts/browser-runner.cjs',
                '/ceramic-skill/'+checker]
    subprocess.run(command,cwd=ROOT,check=True)


def node_command(script, arguments=(), workspace=None):
    """Use the same pinned Node for CLI helpers and JavaScript behavioral tests."""
    config=json.loads((SKILL/'environment.json').read_text())
    cwd=Path(workspace or ROOT).resolve()
    return ['docker','run','--rm','--pull=never','--platform',config['platform'],
            '--network','none','--user',f'{os.getuid()}:{os.getgid()}',
            '--entrypoint','node','-v',f'{cwd}:{cwd}','-v',f'{SKILL}:{SKILL}:ro','-w',str(cwd),
            config['browserImage'],str(script),*map(str,arguments)]
