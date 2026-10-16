"""Selected hero/process gallery component; unapproved general layouts fail closed."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageOps
from ceramic_paths import ROOT, PROFILE
from gallery_markup import render_gallery
from gallery_layout import layout_for
from gallery_profile import write_gallery_assets

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def photo_input(path):
    value = json.loads(path.read_text())
    if isinstance(value, list): return value, {}
    if isinstance(value, dict) and isinstance(value.get('layout'), dict):
        return value.get('photos'), value['layout']
    raise ValueError('Use a photo list or {photos, layout} object')

def load_photos(path):
    photos, options = photo_input(path)
    if not isinstance(photos, list):
        raise ValueError('Photos must be an ordered list')
    layout_for(photos, options)
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
    _, options = photo_input(source)
    presentation = layout_for(photos, options)
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
    (out / 'gallery.html').write_text(render_gallery(rendered, label='사진 갤러리', layout=options))
    if photos:
        write_gallery_assets(out, json.loads(PROFILE.read_text())['gallery'])
    (out / 'sources.json').write_text(json.dumps({'photos': photos, 'layout': options}, ensure_ascii=False, indent=2)+'\n')
    (out / 'manifest.json').write_text(json.dumps({
        'scope':'gallery-component-only', 'photoCount':len(photos),
        'profileSha256':sha(PROFILE), 'photos':rendered, 'layout':presentation}, ensure_ascii=False, indent=2)+'\n')

    # Standalone component review; this is not a generated CAD-to-photo page.
    if photos:
        markup = (out / 'gallery.html').read_text()
        (out / 'index.html').write_text('<!doctype html><html><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>Gallery component review</title><link rel="stylesheet" href="./gallery.css">'
            '<style>*{box-sizing:border-box}body{margin:0}.gallery{margin-top:0}</style></head><body>'
            '<div id="story"></div>'+markup+'<script type="module">'
            'import {installGallery} from "./gallery.js";import {galleryProfile} from "./gallery-config.js";'
            'installGallery({gallery:document.querySelector("#gallery"),story:document.querySelector("#story"),'
            'isActive:()=>true,profile:galleryProfile,source:"component-review"});</script></body></html>')


def verify_sources(out):
    load_photos(out / 'sources.json')
