#!/usr/bin/env python3
"""Single entrypoint for the selected ceramic pipeline."""
import argparse
import os
from pathlib import Path
import sys
import subprocess

def main():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('--workspace', type=Path, default=Path.cwd())
    options, remaining = parser.parse_known_args()
    os.environ['CERAMIC_WORKSPACE'] = str(options.workspace.expanduser().resolve())
    sys.argv = [sys.argv[0]] + remaining
    if remaining and remaining[0] == 'preflight':
        sys.argv.pop(1)
        import preflight
        preflight.main()
        return
    import preflight
    preflight.verify_package()
    if remaining and remaining[0] == 'shrinkage':
        script = Path(__file__).with_name('clay-shrinkage.mjs')
        subprocess.run(['node', str(script), *remaining[1:]], cwd=options.workspace, check=True)
        return
    if remaining and remaining[0] == 'page':
        raise SystemExit('CERAMIC_PAGE_PENDING: selected full-scene parity is not established; no candidate viewer will be substituted')
    import project
    project.main()

if __name__ == '__main__':
    try:
        main()
    except (ValueError, RuntimeError, OSError, KeyError, subprocess.CalledProcessError) as error:
        raise SystemExit('CERAMIC_ERROR ' + str(error))
