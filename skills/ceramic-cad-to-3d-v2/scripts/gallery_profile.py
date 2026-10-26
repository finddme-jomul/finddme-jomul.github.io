"""Render the same final-gallery CSS/JS assets for each project PoC."""
from __future__ import annotations
import json
import shutil
from pathlib import Path

from ceramic_paths import ASSETS
HERE = ASSETS / 'gallery'


def write_gallery_assets(target: Path, gallery: dict) -> None:
    target.mkdir(parents=True, exist_ok=True)
    css = (HERE / 'gallery.css').read_text()
    values = {
        '__PHOTO_BORDER__': gallery['photoBorderWidthPx'],
        '__DIALOG_WIDTH__': gallery['lightbox']['widthVw'],
        '__DIALOG_MAX_WIDTH__': gallery['lightbox']['maxWidthPx'],
        '__DIALOG_HEIGHT__': gallery['lightbox']['heightVh'],
        '__GALLERY_HEIGHT__': gallery['lastSectionHeightVh'],
        '__ARRIVE_SECONDS__': gallery['photoArriveSeconds'],
        '__HERO_WIDTH__': gallery['heroMaxWidthPx'],
        '__HERO_HEIGHT__': gallery['heroMaxHeightVh'],
        '__MOBILE_HERO_HEIGHT__': gallery['mobileHeroMaxHeightVh'],
    }
    for token, value in values.items():
        if css.count(token) != 1:
            raise ValueError(f'Gallery style token missing or repeated: {token}')
        css = css.replace(token, str(value))
    (target / 'gallery.css').write_text(css)
    shutil.copy2(HERE / 'gallery.js', target / 'gallery.js')
    (target / 'gallery-config.js').write_text('export const galleryProfile = '+json.dumps(gallery, ensure_ascii=False)+';\n')
