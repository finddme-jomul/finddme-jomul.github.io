"""Preserve both marked-up and auto-discovered host gallery assets."""
import re
import shutil
from html.parser import HTMLParser

def preserve_host_gallery(previous, target, root):
    previous = previous.resolve()
    if not previous.is_relative_to(root):
        raise ValueError('Gallery source must be inside the repository')
    pattern = r'<section\b[^>]*\bid="gallery"[^>]*>[\s\S]*?</section>'
    before = re.search(pattern, (previous / 'index.html').read_text())
    current = (target / 'index.html').read_text()
    after = re.search(pattern, current)
    if not before or not after:
        raise ValueError('Preserved photos require an existing and generated gallery')
    class GalleryImages(HTMLParser):
        def __init__(self, text):
            super().__init__(); self.sources=[]; self.feed(text)
        def handle_starttag(self, tag, attrs):
            if tag == 'img': self.sources.append(dict(attrs)['src'])
    retained = set(GalleryImages(before.group()).sources)
    for relative in set(GalleryImages(after.group()).sources) - retained:
        unused = (target / relative).resolve()
        if not unused.is_relative_to(target / 'assets'):
            raise ValueError('Generated gallery image must be a local asset')
        unused.unlink(missing_ok=True)
    for relative in retained:
        photo = (previous / relative).resolve()
        destination = (target / relative).resolve()
        if not photo.is_relative_to(previous / 'assets') or not destination.is_relative_to(target / 'assets'):
            raise ValueError('Gallery image must be a local asset')
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(photo, destination)
    # Numbered host-managed photos may not yet occur in stored HTML: the site
    # discovers them dynamically. Preserve the entire supported photo collection.
    for photo in (previous / 'assets').iterdir():
        if photo.is_file() and re.fullmatch(r'photo-\d+\.(webp|png|jpe?g|heic|heif)', photo.name, re.I):
            shutil.copy2(photo, target / 'assets' / photo.name)
    (target / 'index.html').write_text(current[:after.start()] + before.group() + current[after.end():])
