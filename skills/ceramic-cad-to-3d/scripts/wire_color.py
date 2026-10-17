"""Resolve and freeze the common wire colour in each newly generated output."""
import json
import re
from ceramic_paths import PROFILE


def resolve(motion=None):
    motion = {} if motion is None else motion
    value = motion.get('wireColor', json.loads(PROFILE.read_text())['wire3d']['defaultColor'])
    if not isinstance(value, str) or not re.fullmatch(r'#[0-9a-fA-F]{6}', value):
        raise ValueError('motion.wireColor must be a six-digit #RRGGBB colour')
    return value.upper()


def install(output, motion=None):
    (output/'wire-color.mjs').write_text('export const wireColor = '+json.dumps(resolve(motion))+';\n')
