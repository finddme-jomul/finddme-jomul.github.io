"""Reuse the host homepage's favicon declarations in exported pages."""
from html.parser import HTMLParser
from pathlib import Path


class IconLinks(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if tag == 'link' and bool({'icon', 'apple-touch-icon'} & set(dict(attrs).get('rel', '').lower().split())):
            self.tags.append(self.get_starttag_text())


def apply_site_favicon(page):
    homepage = Path(__file__).resolve().parents[1] / 'index.html'
    icons = IconLinks(homepage.read_text()).tags
    if not icons:
        raise ValueError('Homepage has no favicon declarations')
    text = page.read_text()
    if '</head>' not in text:
        raise ValueError('Exported page has no closing head')
    for tag in IconLinks(text).tags:
        text = text.replace(tag, '')
    page.write_text(text.replace('</head>', ''.join(icons) + '</head>', 1))
