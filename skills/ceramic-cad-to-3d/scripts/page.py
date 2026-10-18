"""Validate prior scene inputs, but prevent publication of the rejected renderer."""
import json
import math


def validate(data, ids):
    if data.get('schemaVersion') != 1 or data.get('status') != 'reviewed-provisional' or not data.get('provenance'):
        raise ValueError('Page input needs schemaVersion 1, reviewed-provisional status and provenance')
    if [p['id'] for p in data['parts']] != ids:
        raise ValueError('Page part order/IDs must match CAD')
    def finite(value):
        if isinstance(value, float) and not math.isfinite(value): raise ValueError('Nonfinite scene value')
        if isinstance(value, dict):
            for v in value.values(): finite(v)
        if isinstance(value, list):
            for v in value: finite(v)
    finite(data)
    m=data['motion']; t=m['timing']
    if not m.get('provenance') or not 200 <= m['storyHeightVh'] <= 2000:
        raise ValueError('Explicit reviewed timing/camera/layout are required')
    for k in ('cadEnd','sheetFadeStart','frontMoveStart','frontFadeStart','wireFadeStart','axisFadeStart',
              'dropStart','clayStart','baseGlazeStart','settleStart','cameraFocusStart','photoStart'):
        if not 0 <= t[k] < 1: raise ValueError('Invalid timing '+k)
    for k in ('sheetFadeDuration','frontMoveDuration','frontFadeDuration','wireFadeDuration',
              'axisFadeDuration','dropDuration','clayDuration','baseGlazeDuration','settleDuration',
              'cameraFocusDuration','surfaceSweepWidth'):
        if not 0 < t[k] <= 1: raise ValueError('Invalid duration '+k)
    if not t['baseGlazeStart']+t['baseGlazeDuration'] < t['photoStart']:
        raise ValueError('Glaze must finish before photo handoff')
    if t['accentGlazeStart'] is not None and not (0 < t['accentGlazeDuration'] and
            t['baseGlazeStart'] <= t['accentGlazeStart'] < t['accentGlazeStart']+t['accentGlazeDuration'] < t['photoStart']):
        raise ValueError('Accent glaze timing is invalid')
    for part in data['parts']:
        if not part.get('provenance') or not part['motion'].get('provenance'):
            raise ValueError('Each appearance and motion needs provenance')
        if part['motion']['turns'] < 1 or part['motion']['orbitTurns'] < 1:
            raise ValueError('Body and axis must both complete a full turn')
        for k in ('settledScale','cadToWireScale','cadToWireScaleMobile'):
            if not 0 < part['motion'][k] <= 10: raise ValueError('Invalid scale')
        import re
        for k in ('clayHex','baseHex','accentHex'):
            if not re.fullmatch(r'#[0-9a-fA-F]{6}',part['glazePreview'][k]): raise ValueError('Explicit preview colours required')


def build(project, out, data):
    validate(data, [p['id'] for p in json.loads((project/'input/config.json').read_text())['parts']])
    raise ValueError('CERAMIC_PAGE_BASELINE_REQUIRED: the previous candidate renderer differs from the user-selected entire page. Use selected-page for exact reviewed-input restoration; new-CAD page adaptation is pending.')


def browser_check(out):
    raise ValueError('Whole-page baseline parity is required before enabling new-CAD page publication')
