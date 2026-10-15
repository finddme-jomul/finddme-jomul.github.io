#!/usr/bin/env python3
"""Compatibility entrypoint; the maintained implementation lives inside the skill."""
import runpy
import sys
from pathlib import Path
root = Path(__file__).resolve().parents[1]
entry = root / 'skills/ceramic-cad-to-3d/scripts/run.py'
sys.path.insert(0, str(entry.parent))
if '--workspace' not in sys.argv:
    sys.argv[1:1] = ['--workspace', str(root)]
runpy.run_path(str(entry), run_name='__main__')
