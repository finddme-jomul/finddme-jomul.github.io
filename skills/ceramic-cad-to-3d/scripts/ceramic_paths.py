"""Resolve packaged code separately from user project inputs and output."""
import os
from pathlib import Path
SKILL = Path(__file__).resolve().parents[1]
SCRIPTS = SKILL / 'scripts'
ASSETS = SKILL / 'assets'
PROFILE = ASSETS / 'accepted-profile.json'
ROOT = Path(os.environ.get('CERAMIC_WORKSPACE', os.getcwd())).expanduser().resolve()
