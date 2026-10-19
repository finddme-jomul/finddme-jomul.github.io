"""Apply the common host photo dialog to pages with a final gallery."""
TAG = '<script type="module" src="/project-photo-dialog.mjs"></script>'

def apply_photo_dialog(page):
    text = page.read_text()
    if 'id="photo-lightbox"' not in text or TAG in text:
        return
    page.write_text(text.replace('</body>', TAG + '</body>', 1))
