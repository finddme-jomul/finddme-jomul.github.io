"""Fit the legacy full-sheet CAD on mobile without changing its 3D transition."""

MARKER = 'jomul-mobile-cad-fit'
STYLE = '''<style id="jomul-mobile-cad-fit">
@media(max-width:700px){
  .cad-sheet img{left:50%;width:auto;height:auto;max-width:calc(100vw - 24px);max-height:calc(100svh - 24px)}
}
</style>'''


def apply_mobile_cad_fit(page):
    text = page.read_text()
    # This renderer measures the image rectangle to align and enlarge cad-main.
    # Other renderer families own their responsive sheet layout.
    if 'id="cad-sheet-image"' not in text or 'id="cad-main"' not in text:
        return
    if MARKER in text:
        return
    if '</head>' not in text:
        raise ValueError('Exported CAD page has no closing head')
    page.write_text(text.replace('</head>', STYLE + '</head>', 1))
