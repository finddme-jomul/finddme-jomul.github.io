"""Apply the host site's shared pacing adapter to an exported viewer bundle."""
import re

MARKER = '// JOMUL shared mobile pacing\n'

def apply_mobile_pacing(viewer):
    text = viewer.read_text()
    if text.startswith(MARKER):
        return
    # These are the physical-scroll reads in the reviewed renderer families.
    text, reads = re.subn(r'scrollY/innerHeight\*100', '__jomulScrollVh()', text)
    text, _ = re.subn(r'scrollY/\(innerHeight\*([\w$]+)/100\)', r'(__jomulScrollVh()/\1)', text)
    # Preserve document-end checks as physical scroll reads.
    text, heights = re.subn(r'([\w$]+)\.style\.height=`\$\{100\+([^{}]+)\}vh`', r'__jomulStoryHeight(\1,\2)', text)
    if not reads or not heights:
        raise ValueError('Unsupported exported viewer: no recognized scroll/height contract')
    viewer.write_text(MARKER + 'import {timelineScrollVh as __jomulScrollVh,setStoryHeight as __jomulStoryHeight} from "/project-scroll.mjs";\n' + text)
