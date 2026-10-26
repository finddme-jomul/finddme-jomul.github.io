"""Install the same early loading contract in every maintained page path."""
import shutil
from ceramic_paths import ASSETS


def document_with_runtime(document):
    entry = '<script type="module" src="./viewer.js"></script>'
    if document.count(entry) != 1 or document.count('</head>') != 1:
        raise ValueError('Expected one viewer entrypoint and head in generated page')
    bootstrap = (ASSETS / 'viewer-lifecycle.js').read_text()
    document = document.replace('</head>', '<script>' + bootstrap + '</script></head>', 1)
    document = document.replace(
        '<script type="module" src="./viewer.js"></script>',
        '<script type="module">import("./viewer.js")'
        '.then(() => window.__jomulViewerLifecycle.ready())'
        '.catch(error => window.__jomulViewerLifecycle.fail(error));</script>')
    return document


def install(output):
    html = output / 'index.html'
    html.write_text(document_with_runtime(html.read_text()))
    shutil.copy2(ASSETS / 'render-loop.mjs', output / 'render-loop.mjs')


def refresh_lifecycle(document):
    """Refresh only the early lifecycle UI in an already-generated host export."""
    import re
    pattern = r'<script>// Inlined in the head by the generator,[\s\S]*?</script>'
    matches = list(re.finditer(pattern, document))
    if len(matches) != 1:
        raise ValueError('Expected one existing viewer lifecycle bootstrap')
    match = matches[0]
    return document[:match.start()] + '<script>' + (ASSETS / 'viewer-lifecycle.js').read_text() + '</script>' + document[match.end():]


if __name__ == '__main__':
    import argparse
    from pathlib import Path
    parser = argparse.ArgumentParser()
    parser.add_argument('--refresh-lifecycle', type=Path, required=True)
    page = parser.parse_args().refresh_lifecycle
    page.write_text(refresh_lifecycle(page.read_text()))
