"""Prevent empty CAD image placeholders flashing before runtime initialization."""
MARKER = 'jomul-cad-loading'
STYLE = '<style id="jomul-cad-loading">#sheet-image:not([data-loaded]){visibility:hidden}</style>'
PATCH = '''<script>
(() => {
  const image = document.getElementById('sheet-image');
  const reveal = () => { if (image.naturalWidth) image.dataset.loaded = ''; };
  image.addEventListener('load', reveal);
  if (image.complete) reveal();
})();
</script>'''

def apply_cad_loading(page):
    text = page.read_text()
    if 'id="sheet-image"' not in text or MARKER in text:
        return
    text = text.replace('alt="머그 임시 기술 CAD 시트"', 'alt="머그 기술 도면"')
    text = text.replace('</head>', STYLE + '</head>', 1)
    page.write_text(text.replace('<script type="module"', PATCH + '\n<script type="module"', 1))
