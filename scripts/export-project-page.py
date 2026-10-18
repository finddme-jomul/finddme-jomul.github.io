"""Copy one reviewed runtime page into the host site; omit local verification records."""
import os
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
from project_mobile_pacing import apply_mobile_pacing

p = argparse.ArgumentParser()
p.add_argument('source', type=Path)
p.add_argument('slug')
p.add_argument('--dependencies', type=Path, required=True)
a = p.parse_args()
root = Path(__file__).resolve().parents[1]
source = a.source.resolve()
target = root / 'public' / 'projects' / a.slug
if not a.slug.replace('-', '').isalnum():
    p.error('Use an alphanumeric project slug')
if target.exists():
    p.error('Export into an unused project directory')
target.mkdir(parents=True)
for file in source.iterdir():
    if file.is_file() and (file.suffix in ('.html', '.js', '.mjs', '.css', '.svg', '.glb') or file.name in ('review-input.json', 'wire-guide.json', 'motion-config.json')):
        shutil.copy2(file, target / file.name)
for name in ('assets', 'scene'):
    if (source / name).is_dir():
        shutil.copytree(source / name, target / name)
# Keep local input records out of the host export; gallery runtime has its own config.
for evidence in target.rglob('material-evidence.json'):
    evidence.unlink()
project = target / 'assets/project.json'
if project.exists():
    data = json.loads(project.read_text())
    if isinstance(data.get('photos'), str):
        data.pop('photos')
    project.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
# Resolve dependencies at export time; browsers receive a self-contained module.
subprocess.run([str(a.dependencies / '.bin/esbuild'), str(source / 'viewer.js'),
    '--bundle', '--format=esm', '--target=es2022', '--minify',
    '--outfile=' + str(target / 'viewer.js')], check=True, env={**os.environ, 'NODE_PATH': str(a.dependencies)})
apply_mobile_pacing(target / 'viewer.js')
manifest = {'hostPacing': {'module': '/project-scroll.mjs', 'policy': '/project-scroll-map.mjs', 'scope': 'site export only; original approval evidence unchanged'}, 'sourceRevision': source.name, 'files': {
    str(f.relative_to(target)): hashlib.sha256(f.read_bytes()).hexdigest()
    for f in sorted(target.rglob('*')) if f.is_file()}}
(target / 'export-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(target)
