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
