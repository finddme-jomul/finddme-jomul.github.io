"""Install/check the supported Linux x86_64 skill toolchain without global installs."""
import argparse
import importlib.metadata
import json
import platform
import subprocess
import sys
from ceramic_paths import SKILL


def python_check():
    config=json.loads((SKILL/'environment.json').read_text())
    if platform.python_version()!=config['python']:
        raise RuntimeError(f"Use Python {config['python']}; found {platform.python_version()}")
    if platform.system()!='Linux' or platform.machine() not in ('x86_64','AMD64'):
        raise RuntimeError('The currently verified environment is Linux x86_64')
    return config


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--setup',action='store_true')
    args=parser.parse_args()
    config=python_check()
    if args.setup:
        target=SKILL/'.venv'
        if not target.exists():subprocess.run([sys.executable,'-m','venv',str(target)],check=True)
        subprocess.run([str(target/'bin/python'),'-m','pip','install','-r',str(SKILL/'requirements-lock.txt')],check=True)
        subprocess.run(['docker','pull','--platform',config['platform'],config['browserImage']],check=True)
        import os
        subprocess.run(['docker','run','--rm','--platform',config['platform'],'--user',f'{os.getuid()}:{os.getgid()}',
                        '--entrypoint','npm','-e','npm_config_cache=/tmp/npm-cache','-v',f'{SKILL}:/skill','-w','/skill',
                        config['browserImage'],'ci','--no-audit','--no-fund'],check=True)
        subprocess.run([str(target/'bin/python'),str(SKILL/'scripts/run.py'),'environment'],check=True)
        return
    errors=[]
    for line in (SKILL/'requirements-lock.txt').read_text().splitlines():
        name,version=line.split('==')
        try: actual=importlib.metadata.version(name)
        except importlib.metadata.PackageNotFoundError:actual='missing'
        if actual!=version:errors.append(f'{name}: expected {version}, found {actual}')
    packages=json.loads((SKILL/'package-lock.json').read_text())['packages']
    # npm lock includes optional packages for other platforms; verify the runtime's direct dependencies.
    for name in ('three','vite','animejs'):
        p=SKILL/'node_modules'/name/'package.json'
        expected=packages['node_modules/'+name]['version']
        if not p.exists() or json.loads(p.read_text())['version']!=expected:errors.append(f'{name}: run environment --setup')
    subprocess.run(['docker','image','inspect',config['browserImage']],check=True,stdout=subprocess.DEVNULL)
    if errors:raise RuntimeError('Environment mismatch:\n'+'\n'.join(errors))
    print(json.dumps({'status':'ready','environment':config,'pythonPackages':len((SKILL/'requirements-lock.txt').read_text().splitlines())},indent=2))
