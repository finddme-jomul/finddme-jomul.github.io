"""Install a checksum-pinned official Blender archive; execute in pinned browser OS."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile
import urllib.request
from ceramic_paths import SKILL


def digest(path):
    h=hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda:stream.read(1024*1024), b''): h.update(chunk)
    return h.hexdigest()


def install():
    settings=json.loads((SKILL/'assets/selected-surface.json').read_text())['distribution']
    root=SKILL/'.tools';root.mkdir(exist_ok=True)
    archive=root/'blender.tar.xz'
    if not archive.exists() or digest(archive)!=settings['sha256']:
        part=root/'blender.download'
        try:
            subprocess.run(['curl','--fail','--location','--retry','2','--silent','--show-error',
                            '--output',str(part),settings['url']],check=True)
            if digest(part)!=settings['sha256']: raise ValueError('Blender archive checksum mismatch')
            part.replace(archive)
        finally:
            part.unlink(missing_ok=True)
    target=root/'blender'
    staging=root/'blender.installing'
    if staging.exists(): shutil.rmtree(staging)
    staging.mkdir()
    try:
        with tarfile.open(archive) as tar: tar.extractall(staging,filter='data')
        folder=staging/settings['directory']
        hashes={str(p.relative_to(folder)):digest(p) for p in sorted(folder.rglob('*')) if p.is_file()}
        (folder/'installation.json').write_text(json.dumps({'archiveSha256':settings['sha256'],'files':hashes},indent=2)+'\n')
        if target.exists(): shutil.rmtree(target)
        folder.rename(target)
    finally: shutil.rmtree(staging)
    system=root/'system';system.mkdir(exist_ok=True)
    packages=json.loads((SKILL/'assets/selected-surface.json').read_text())['systemPackages']
    for package in packages:
        file=root/(package['name']+'.deb')
        subprocess.run(['curl','--fail','--location','--retry','2','--silent','--show-error',
                        '--output',str(file),package['url']],check=True)
        if digest(file)!=package['sha256']: raise ValueError('Blender system package checksum mismatch')
        subprocess.run(['dpkg-deb','--extract',str(file),str(system)],check=True)
    hashes={str(p.relative_to(system)):digest(p) for p in sorted(system.rglob('*')) if p.is_file() and p.name!='installation.json'}
    (system/'installation.json').write_text(json.dumps({'packages':packages,'files':hashes},indent=2)+'\n')
    verify()


def verify():
    root=SKILL/'.tools/blender'
    if not (root/'installation.json').exists(): raise ValueError('Blender missing: run environment --setup-blender')
    record=json.loads((root/'installation.json').read_text())
    expected=json.loads((SKILL/'assets/selected-surface.json').read_text())['distribution']['sha256']
    if record['archiveSha256']!=expected: raise ValueError('Blender installation archive drift')
    for name, value in record['files'].items():
        p=root/name
        if not p.is_file() or digest(p)!=value: raise ValueError('Blender installation drift: '+name)
    system=SKILL/'.tools/system'
    system_record=json.loads((system/'installation.json').read_text())
    packages=json.loads((SKILL/'assets/selected-surface.json').read_text())['systemPackages']
    if system_record['packages']!=packages: raise ValueError('Blender system package manifest drift')
    for name,value in system_record['files'].items():
        if digest(system/name)!=value: raise ValueError('Blender system library drift: '+name)
    return record['archiveSha256']


def command(output=None):
    verify()
    env=json.loads((SKILL/'environment.json').read_text())
    result=['docker','run','--rm','--pull=never','--network','none','--platform',env['platform'],
            '--user',f'{os.getuid()}:{os.getgid()}','--cap-drop','ALL',
            '--security-opt','no-new-privileges:true','-e','HOME=/tmp','-e','LD_LIBRARY_PATH=/ceramic-skill/.tools/system/usr/lib/x86_64-linux-gnu',
            '-v',f'{SKILL}:/ceramic-skill:ro',
            '--entrypoint','/ceramic-skill/.tools/blender/blender']
    if output is not None: result += ['-v',f'{output}:/output']
    return result+[env['browserImage'],'--background','--factory-startup','--python-exit-code','1']


def check():
    result=subprocess.run(command()+['--version'],check=True,capture_output=True,text=True)
    if not result.stdout.startswith('Blender 4.5.11'): raise ValueError('Blender runtime version differs')
    return {'version':'4.5.11','archiveSha256':verify(),'runtime':'pinned-browser-image'}
