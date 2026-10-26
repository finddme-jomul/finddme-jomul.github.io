"""Copy one reviewed runtime page into the host site; omit local verification records."""
import os
import sys
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
from project_mobile_pacing import apply_mobile_pacing
from project_mobile_cad import apply_mobile_cad_fit
from project_cad_loading import apply_cad_loading
from project_favicon import apply_site_favicon
from project_photo_dialog import apply_photo_dialog

p = argparse.ArgumentParser()
p.add_argument('source', type=Path)
p.add_argument('slug')
p.add_argument('--dependencies', type=Path, required=True)
p.add_argument('--output', type=Path, help='Unused local comparison directory inside the repository; defaults to projects/NN-slug/page')
p.add_argument('--preserve-gallery-from', type=Path, help='Existing host page whose approved gallery markup and photo bytes should be preserved')
p.add_argument('--runtime-skill', type=Path, help='Refresh only the shared lifecycle presentation from this skill; geometry and viewer timeline stay source-derived')
a = p.parse_args()
root = Path(__file__).resolve().parents[1]
source = a.source.resolve()
matches = [file.parent for file in (root / 'projects').glob('*/project.json')
           if json.loads(file.read_text()).get('slug') == a.slug]
if not a.output and len(matches) != 1:
    p.error('Register a unique projects/NN-slug/project.json before exporting')
target = a.output.resolve() if a.output else matches[0] / 'page'
if not target.is_relative_to(root):
    p.error('Comparison output must be inside the repository')
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
# The dimensional reader uses only HTML/SVG; source CAD and local evidence stay local.
if (source / 'dimensional-drawing').is_dir():
    drawing = target / 'dimensional-drawing'
    drawing.mkdir()
    for file in (source / 'dimensional-drawing').iterdir():
        if file.is_file() and file.suffix in ('.html', '.svg'):
            shutil.copy2(file, drawing / file.name)
# Keep local input records out of the host export; gallery runtime has its own config.
for evidence in target.rglob('material-evidence.json'):
    evidence.unlink()
project = target / 'assets/project.json'
if project.exists():
    data = json.loads(project.read_text())
    if isinstance(data.get('photos'), str):
        data.pop('photos')
    project.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
# Host-managed photos may postdate the skill input. Require a gallery-enabled
# generated scene, then retain the existing host presentation without changing 3D.
if a.preserve_gallery_from:
    from project_gallery_export import preserve_host_gallery
    preserve_host_gallery(a.preserve_gallery_from, target, root)

# Resolve dependencies at export time; browsers receive a self-contained module.
subprocess.run([str(a.dependencies / '.bin/esbuild'), str(source / 'viewer.js'),
    '--bundle', '--format=esm', '--target=es2022', '--minify',
    '--outfile=' + str(target / 'viewer.js')], check=True, env={**os.environ, 'NODE_PATH': str(a.dependencies)})
if a.runtime_skill:
    runtime = a.runtime_skill.resolve()
    if not runtime.is_relative_to(root / 'skills'):
        raise ValueError('Runtime skill must be a repository skill')
    subprocess.run([sys.executable, str(runtime / 'scripts/page_runtime.py'), '--refresh-lifecycle', str(target / 'index.html')], check=True)
apply_mobile_pacing(target / 'viewer.js')
apply_mobile_cad_fit(target / 'index.html')
apply_cad_loading(target / 'index.html')
for page in target.rglob('*.html'):
    # Standalone readers may use HTML's optional head/body tags.
    if '</head>' in page.read_text():
        apply_site_favicon(page)
    apply_photo_dialog(page)
manifest = {'hostPacing': {'module': '/project-scroll.mjs', 'policy': '/project-scroll-map.mjs', 'scope': 'site export only; original approval evidence unchanged'}, 'sourceRevision': source.name, 'files': {
    str(f.relative_to(target)): hashlib.sha256(f.read_bytes()).hexdigest()
    for f in sorted(target.rglob('*')) if f.is_file()}}
if a.runtime_skill:
    lifecycle = a.runtime_skill.resolve() / 'assets/viewer-lifecycle.js'
    manifest['lifecyclePresentation'] = {'source': str(lifecycle.relative_to(root)), 'sha256': hashlib.sha256(lifecycle.read_bytes()).hexdigest()}
(target / 'export-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(target)
