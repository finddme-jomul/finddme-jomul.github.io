"""Explicit new-input single-vessel review, sharing the selected scene renderer."""
import html
import json
import math
from pathlib import Path
import re
import shutil
from ceramic_paths import ROOT
from photos import load_photos, build_gallery, sha


def validate(review, profile, dims, material):
    if review.get('schemaVersion')!=1 or review.get('status')!='reviewed-provisional' or not review.get('provenance'):
        raise ValueError('New page review requires schemaVersion 1, reviewed-provisional status and provenance')
    motion=review['motion'];surface=review['surface']
    if motion['tiltDirection'] not in ('right','left','forward','backward','none'):
        raise ValueError('Invalid reviewed tilt direction')
    for value,low,high in ((motion['tiltDegrees'],0,30),(motion['storyHeightVh'],300,1500),
                           (surface['roughness'],0,1),(surface['clearcoat'],0,1)):
        if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) or not low<=value<=high:
            raise ValueError('Invalid reviewed motion/surface value')
    if set(surface)!={'floorPolicy','roughness','clearcoat'} or surface['floorPolicy']!='exact':
        raise ValueError('New inputs use the exact-floor CAD policy and explicit roughness/clearcoat only')
    if not 30<=dims['height']<=300 or not .5<=dims['maxDiameter']/dims['height']<=1:
        raise ValueError('New single review currently supports height 30–300mm and diameter/height 0.5–1')
    for group,key in (('clay','wetPreviewHex'),('glaze','firedAppearancePreviewHex')):
        if not re.fullmatch(r'#[0-9a-fA-F]{6}',material[group][key]): raise ValueError('Explicit preview colours required')
        if not material[group]['name'] or len(material[group]['name'])>12: raise ValueError('Material display name must be 1–12 characters')
    if material['glaze']['optical'] not in ('clear','opaque','translucent') or material['glaze']['finish'] not in ('matte','glossy','satin'):
        raise ValueError('Explicit optical/finish labels required')
    photos=(ROOT/review['photos']).resolve()
    if not photos.is_relative_to(ROOT): raise ValueError('Photo input must be inside the workspace')
    if not load_photos(photos): raise ValueError('New page review currently requires at least one reviewed photo')


def configure(prepared, stage, config, front_box):
    review=prepared['review'];material=prepared['material']
    config.update(id=prepared['part'],status='new-input-review-candidate',
                  dimensionsMm=prepared['calculation']['targetFiredMm'],sheetFrontBox=front_box,
                  clayColor=material['clay']['wetPreviewHex'],finishColor=material['glaze']['firedAppearancePreviewHex'],
                  motion=review['motion'])
    config.pop('photoSubject',None);config.pop('photoStatus',None)
    (stage/'assets/project.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n')
    gallery=stage/'gallery-source';build_gallery(ROOT/review['photos'],gallery)
    for file in (gallery/'assets').iterdir(): shutil.copy2(file,stage/'assets'/file.name)
    for name in ('gallery.js','gallery.css','gallery-config.js'):shutil.copy2(gallery/name,stage/name)
    for name in ('actual-photo.webp','process-photo.webp'):(stage/'assets'/name).unlink(missing_ok=True)
    document=(stage/'index.html').read_text();begin=document.index('<section class="gallery"');end=document.index('<script type="module"',begin)
    document=document[:begin]+(gallery/'gallery.html').read_text()+document[end:]
    document=re.sub(r'<title>.*?</title>','<title>'+html.escape(prepared['name'])+'</title>',document)
    document=document.replace('달항아리',html.escape(prepared['name'],quote=True))
    document=re.sub(r'alt="[^"]*기술 도면:[^"]*"','alt="CAD technical drawing"',document)
    (stage/'index.html').write_text(document)
