"""Generate the photo-only last viewport from reviewed photo metadata.

This is a gallery-stage contract, not a complete project-page renderer.
"""
from __future__ import annotations

from html import escape
from pathlib import PurePosixPath
from gallery_layout import layout_for


def render_gallery(photos: list[dict], *, label: str, layout=None) -> str:
    """Return no section for zero photos; otherwise keep all photos in one viewport."""
    if not isinstance(photos, list):
        raise ValueError('photos must be a list')
    presentation = layout_for(photos, layout)
    if not photos:
        return ''
    if not label or not isinstance(label, str):
        raise ValueError('gallery label is required')
    buttons = []
    for index, photo in enumerate(photos):
        if not isinstance(photo, dict) or photo.get('role') not in ('actual', 'process'):
            raise ValueError(f'photo {index} needs actual/process role')
        path = photo.get('publicPath')
        alt = photo.get('alt')
        source_hash = photo.get('sourceSha256')
        if not all(isinstance(value, str) and value for value in (path, alt, source_hash)):
            raise ValueError(f'photo {index} needs public path, alt, and source hash')
        parsed = PurePosixPath(path)
        if parsed.is_absolute() or '..' in parsed.parts or not path.startswith('./assets/'):
            raise ValueError(f'photo {index} has unsafe public path')
        if len(source_hash) != 64 or any(char not in '0123456789abcdef' for char in source_hash):
            raise ValueError(f'photo {index} has invalid source hash')
        kind = 'gallery-photo--hero' if index == 0 else 'gallery-photo--process'
        style = ''
        if presentation['mode'] == 'scatter':
            kind = 'gallery-photo--scatter'
            placement = presentation['placements'][index]
            values = ';'.join(f'--{prefix}-{key}:{value}%' for view,prefix in [('desktop','d'),('mobile','m')]
                              for key,value in placement[view].items())
            style = f' style="{values}"'
        button_label = '사진 확대'
        buttons.append(
            f'<button class="gallery-photo {kind}"{style} type="button" aria-label="{button_label}">'
            f'<img src="{escape(path, quote=True)}" alt="{escape(alt, quote=True)}"></button>'
        )
    return (
        f'<section class="gallery" id="gallery" aria-label="{escape(label, quote=True)}">'
        '<div class="gallery-first">'
        + ''.join(buttons)
        + '</div></section>'
        '<dialog class="photo-lightbox" id="photo-lightbox" aria-label="사진 확대 보기">'
        '<button class="lightbox-close" type="button" aria-label="확대 사진 닫기"></button>'
        '<img alt=""></dialog>'
    )
