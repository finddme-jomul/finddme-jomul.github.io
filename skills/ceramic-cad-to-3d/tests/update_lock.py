"""Refresh the lock only after reviewing the selection and intended code changes."""
import argparse
import hashlib
import json
from pathlib import Path
K=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--write',action='store_true')
args=parser.parse_args()
files={p.relative_to(K).as_posix():hashlib.sha256(p.read_bytes()).hexdigest()
       for name in ('scripts','assets') for p in sorted((K/name).rglob('*'))
       if p.is_file() and '__pycache__' not in p.parts}
files.update({name:hashlib.sha256((K/name).read_bytes()).hexdigest()
              for name in ('selection.json','requirements.txt','requirements-lock.txt','package.json','package-lock.json','environment.json')})
target=K/'runtime-lock.json'
before=json.loads(target.read_text())['files'] if target.exists() else {}
changed=sorted(p for p in set(before)|set(files) if before.get(p)!=files.get(p))
print(json.dumps({'changed':changed},indent=2))
if args.write:
    target.write_text(json.dumps({'schemaVersion':1,'files':files},indent=2)+'\n')
elif changed:
    raise SystemExit('Selection lock differs; review changes before using --write')
