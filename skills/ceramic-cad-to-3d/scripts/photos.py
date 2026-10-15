"""Selected hero/process gallery component; unapproved general layouts fail closed."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps
from ceramic_paths import ROOT, PROFILE
from gallery_markup import render_gallery
from gallery_profile import write_gallery_assets

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def load_photos(path):
    photos = json.loads(path.read_text())
    if not isinstance(photos, list):
        raise ValueError('Photos must be an ordered list')
    selected_pair = len(photos) == 2 and [p.get('role') for p in photos] == ['actual', 'process']
    if len(photos) > 1 and not selected_pair:
        raise ValueError('MULTI_PHOTO_LAYOUT_PENDING: varied sizes/asymmetric placement must be selected; equal grid is excluded')
    if len({item.get('sha256') for item in photos}) != len(photos):
        raise ValueError('Duplicate photo sources cannot represent distinct photos')
    for item in photos:
        role = item.get('role')
        expected = {'actual': 'user-confirmed-final-fired', 'process': 'user-confirmed-process'}
        if role not in expected or item.get('status') != expected[role] or not item.get('alt'):
            raise ValueError('Photo needs a confirmed actual/process role and alt text')
        source = (ROOT / item['source']).resolve(strict=True)
        if sha(source) != item['sha256']:
            raise ValueError('Photo source hash drift')
        with Image.open(source) as image:
            image.verify()
    return photos

def build_gallery(source, out):
    photos = load_photos(source)
    out.mkdir(parents=True, exist_ok=True)
    assets = out / 'assets'
    assets.mkdir()
    rendered = []
    for index, item in enumerate(photos):
        dest = assets / f'photo-{index+1}.webp'
        with Image.open(ROOT / item['source']) as original:
            image = ImageOps.exif_transpose(original).convert('RGB')
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            image.save(dest, format='WEBP', quality=88, method=6)
        with Image.open(dest) as image:
            if image.getexif(): raise ValueError('Public photo retained EXIF')
        rendered.append({'role':item['role'], 'alt':item['alt'],
                         'publicPath':f'./assets/{dest.name}', 'sourceSha256':item['sha256']})
    (out / 'gallery.html').write_text(render_gallery(rendered, label='사진 갤러리'))
    if photos:
        write_gallery_assets(out, json.loads(PROFILE.read_text())['gallery'])
    (out / 'sources.json').write_text(json.dumps(photos, ensure_ascii=False, indent=2)+'\n')
    (out / 'manifest.json').write_text(json.dumps({
        'scope':'gallery-component-only', 'photoCount':len(photos),
        'profileSha256':sha(PROFILE), 'photos':rendered}, ensure_ascii=False, indent=2)+'\n')

def verify_sources(out):
    load_photos(out / 'sources.json')
