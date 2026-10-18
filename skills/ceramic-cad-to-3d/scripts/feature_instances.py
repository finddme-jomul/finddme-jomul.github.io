"""Expand reviewed scene instances while retaining source CAD/material identity."""
import copy
import re


def expand(config, review):
    config, review = copy.deepcopy(config), copy.deepcopy(review)
    instances = review.pop('instances', None)
    if instances is None:
        return config, review
    if not isinstance(instances, list) or not instances or not review.get('assembly'):
        raise ValueError('Feature instances require a nonempty list and explicit assembly')
    definitions = {p['id']: p for p in config['parts']}
    appearances = {p['id']: p for p in review['parts']}
    if len(appearances) != len(review['parts']) or set(appearances) != set(definitions):
        raise ValueError('Instance review must describe each source CAD part once')
    parts, rendered, used, ids = [], [], set(), set()
    for instance in instances:
        if set(instance) != {'id', 'sourcePartId', 'appearance'}:
            raise ValueError('Instance requires id, sourcePartId and appearance overrides')
        iid, source = instance['id'], instance['sourcePartId']
        if not isinstance(iid, str) or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', iid) or iid in ids or source not in definitions:
            raise ValueError('Unknown source or duplicate/invalid instance ID')
        overrides = instance['appearance']
        if not isinstance(overrides, dict) or set(overrides) - {'motion', 'glazePreview', 'coatings', 'materialVariant', 'provenance'}:
            raise ValueError('Unsupported instance appearance override')
        part = {**definitions[source], 'id': iid, 'sourcePartId': source}
        appearance = copy.deepcopy(appearances[source])
        for key, value in overrides.items():
            if key in ('motion', 'glazePreview'):
                if not isinstance(value, dict):raise ValueError('Instance appearance requires objects')
                appearance[key].update(copy.deepcopy(value))
            else:appearance[key] = copy.deepcopy(value)
        appearance.update(id=iid, sourcePartId=source)
        parts.append(part);rendered.append(appearance);used.add(source);ids.add(iid)
    if used != set(definitions):raise ValueError('Every source CAD part must have an instance')
    config['parts'],review['parts'] = parts,rendered
    return config,review


def material_variant(material, appearance):
    key = appearance.get('materialVariant')
    if key is None:return material
    variants = material.get('variants', {})
    if not isinstance(key, str) or key not in variants or not material.get('provenance'):
        raise ValueError('Material variant must reference archived reviewed evidence')
    return variants[key]


def alias_sheet(manifest, parts):
    result=copy.deepcopy(manifest)
    if all(p.get('sourcePartId',p['id'])==p['id'] for p in parts):return result
    for layout in result['layouts'].values():
        boxes=layout['frontBoxes']
        layout['frontBoxes']={p['id']:copy.deepcopy(boxes[p.get('sourcePartId',p['id'])]) for p in parts}
    return result
