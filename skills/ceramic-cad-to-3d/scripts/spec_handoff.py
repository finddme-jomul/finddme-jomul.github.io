"""Turn validated P1 evidence into a reviewed 02-stage dimension proposal.

A proposal can contain unknowns. Only --require-complete writes an input that
clay-shrinkage.mjs or a CAD generator may consume; it refuses pending CAD fields.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from workflow import load_extraction, save, summary

FIELDS = {
    'height': (('exact_fired_height', 'fired_height'), 'target_fired_height'),
    'maxDiameter': (('body_max_diameter', 'maximum_body_diameter'), 'maximum_body_diameter'),
    'openingDiameter': (('exact_opening_diameter', 'opening_diameter'), 'opening_diameter'),
    'footDiameter': (('exact_foot_diameter', 'foot_diameter'), 'foot_diameter'),
    'wallThickness': (('wall_thickness',), 'wall_thickness'),
    'baseThickness': (('base_thickness',), 'base_thickness'),
}
BLOCKING_PRIORITIES = {'before-CAD', 'before-final-CAD', 'before-confirmed-section', 'before-section-CAD'}


def interval(value: object) -> list[float] | None:
    if not isinstance(value, dict) or value.get('unit') != 'mm':
        return None
    low, high = value.get('min'), value.get('max')
    if not isinstance(low, (int, float)) or not isinstance(high, (int, float)) or not 0 < low <= high:
        return None
    return [low, high]


def candidate(state: dict, extraction: dict, answer_names: tuple[str, ...], feature: str,
              confirmation_name: str | None = None) -> dict:
    for name in answer_names:
        record = state['confirmedFields'].get(name)
        if record is not None:
            if record.get('status') != 'user-confirmed' or record.get('unit') != 'mm':
                raise ValueError(f'{name}: confirmed dimension has invalid unit or status')
            number = record['value']
            if isinstance(number, bool) or not isinstance(number, (int, float)) or number <= 0:
                raise ValueError(f'{name}: invalid confirmed dimension')
            return {'valueMm': number, 'rangeMm': [number, number], 'status': 'user-confirmed',
                    'evidence': [{'answerId': record['answerId'], 'field': name}]}

    if confirmation_name:
        matches = [c for c in extraction['userConfirmations'] if c['field'] == confirmation_name]
        if matches:
            bounds = interval(matches[-1]['value'])
            if bounds is None:
                raise ValueError(f'{confirmation_name}: invalid user-confirmed range')
            return {'valueMm': bounds[0] if bounds[0] == bounds[1] else None,
                    'rangeMm': bounds, 'status': matches[-1]['status'],
                    'evidence': [{'field': confirmation_name, 'source': matches[-1]['evidence']}]}

    observations = [o for o in extraction['observations'] if o.get('kind') == 'dimension'
                    and o.get('feature') == feature]
    with_values = [(o, interval(o.get('value'))) for o in observations]
    usable = [(o, bounds) for o, bounds in with_values if bounds is not None
              and o.get('status') in ('sketch-observed', 'user-confirmed')]
    if usable:
        bounds = usable[0][1]
        if any(other != bounds for _, other in usable[1:]):
            return {'valueMm': None, 'rangeMm': None, 'status': 'conflicting-observations',
                    'evidence': [{'observationId': o['id'], 'rawText': o.get('rawText')} for o, _ in usable]}
        return {'valueMm': bounds[0] if bounds[0] == bounds[1] else None,
                'rangeMm': bounds,
                'status': 'user-confirmed' if any(o['status'] == 'user-confirmed' for o, _ in usable) else 'sketch-observed',
                'evidence': [{'observationId': o['id'], 'rawText': o.get('rawText')} for o, _ in usable]}
    return {'valueMm': None, 'rangeMm': None, 'status': 'needs-user-answer',
            'evidence': [{'observationId': o['id'], 'rawText': o.get('rawText'),
                          'status': o.get('status')} for o in observations]}


def build_proposal(state: dict) -> dict:
    extraction = load_extraction(state)
    info = summary(state)
    fields = {name: candidate(state, extraction, answer_names, feature,
                              'target_fired_height' if name == 'height' else None)
              for name, (answer_names, feature) in FIELDS.items()}
    shrinkage = next((c for c in extraction['userConfirmations']
                      if c['field'] == 'example_total_shrinkage'), None)
    pending = [q for q in info['pending'] + info['deferred'] if q['priority'] in BLOCKING_PRIORITIES]
    missing = [name for name, data in fields.items() if data['valueMm'] is None]
    ready = not pending and not missing and shrinkage is not None
    return {'schemaVersion': 1, 'project': state['project'],
            'stage': '02-specification-proposal', 'sourceImageSha256': state['sourceImageSha256'],
            'sourceExtractionSha256': state['extractionSha256'],
            'confirmedP1Fields': state['confirmedFields'],
            'deferredP1Fields': state['deferredFields'],
            'dimensions': fields,
            'candidateTargetFiredMm': {name: data['valueMm'] for name, data in fields.items()},
            'shrinkage': None if shrinkage is None else {
                'totalPercent': shrinkage['value'], 'status': shrinkage['status'],
                'source': shrinkage['evidence']},
            'pendingBeforeCAD': pending, 'missingDimensionFields': missing,
            'readyForCalculatorInput': ready,
            'note': 'Unknown dimensions stay null. This proposal is not a runnable calculator/CAD input.'}


def calculator_input(proposal: dict) -> dict:
    if not proposal['readyForCalculatorInput']:
        raise ValueError('Calculator input blocked: unresolved CAD questions or dimensions: '
                         + ', '.join(proposal['missingDimensionFields']
                                     + [x['field'] for x in proposal['pendingBeforeCAD']]))
    return {'schemaVersion': 1, 'project': proposal['project'],
            'targetFiredMm': proposal['candidateTargetFiredMm'],
            'dimensionSources': {name: json.dumps(data['evidence'], ensure_ascii=False)
                                 for name, data in proposal['dimensions'].items()},
            'shrinkage': {'totalPercent': proposal['shrinkage']['totalPercent'],
                          'source': proposal['shrinkage']['source']},
            'sourceImageSha256': proposal['sourceImageSha256']}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('state', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--require-complete', action='store_true')
    args = parser.parse_args()
    state = json.loads(args.state.read_text())
    proposal = build_proposal(state)
    result = calculator_input(proposal) if args.require_complete else proposal
    save(args.output, result)
    print(json.dumps({'project': proposal['project'], 'readyForCalculatorInput': proposal['readyForCalculatorInput'],
                      'missingDimensionFields': proposal['missingDimensionFields'],
                      'pendingBeforeCAD': [x['field'] for x in proposal['pendingBeforeCAD']]}, ensure_ascii=False))


if __name__ == '__main__':
    main()
