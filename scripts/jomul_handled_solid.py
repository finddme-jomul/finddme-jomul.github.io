"""Compatibility import/command; maintained code is inside ceramic-cad-to-3d."""
import os
import runpy
import sys
from pathlib import Path
_root = Path(__file__).resolve().parents[1]
_entry = _root / 'skills/ceramic-cad-to-3d/scripts/jomul_handled_solid.py'
os.environ.setdefault('CERAMIC_WORKSPACE', str(_root))
sys.path.insert(0, str(_entry.parent))
globals().update(runpy.run_path(str(_entry), run_name=__name__))
