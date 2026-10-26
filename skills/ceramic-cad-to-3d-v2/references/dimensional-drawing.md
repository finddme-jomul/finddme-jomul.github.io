# CAD dimensional drawing review

Status: implemented standalone candidate drawing stage; no visual adoption or full-page replacement.

## Run

Use the v2 local environment and maintained entrypoint:

```sh
skills/ceramic-cad-to-3d-v2/.venv/bin/python skills/ceramic-cad-to-3d-v2/scripts/run.py --workspace /path/to/workspace preflight
skills/ceramic-cad-to-3d-v2/.venv/bin/python skills/ceramic-cad-to-3d-v2/scripts/run.py --workspace /path/to/workspace drawing-review --input review.json --output comparison/unused-revision
skills/ceramic-cad-to-3d-v2/.venv/bin/python skills/ceramic-cad-to-3d-v2/scripts/run.py --workspace /path/to/workspace drawing-review --verify comparison/unused-revision
```

The output must not exist. Generation is staged in a temporary directory then published
as one review folder. Revisions use another unused output directory; no existing
project state, geometry, page, photo, or v1 baseline is overwritten.

## Input

```json
{
  "schemaVersion": 1,
  "status": "reviewed-provisional",
  "sourceProject": ".poc/jomul-project-assets-workspaces/99-chess-usability",
  "parts": [
    {"id": "knight", "notes": ["Review the upper profile against the source sketch."]},
    {"id": "board"}
  ]
}
```

`sourceProject` is relative to --workspace (absolute paths also supported). It must
contain input/config.json and archived STEP geometry for every selected source part:
`geometry/<id>/model.step` for feature solids, `cad/solid/<id>/model.step` for vessels.
The list selects and orders distinct source definitions, not replicated scene instances.
Part count is not hardcoded. Status is reviewed-provisional or user-confirmed; it
records input review, never final drawing adoption. Upstream UI components are not
used to invent ceramic geometry. Parts must already have reviewed CAD.

Up to four 150-character notes and two detail crops may be supplied per part.
Each detail has `view` (front or section), `label` (1–36 characters), and
`boundsMm: [minX,minY,maxX,maxY]` in that view's coordinates. Inspect drawing-plan.json
before defining explicit crops. Front is projected about the CAD bounds centre;
section coordinates are source CAD X/Z. Crops must lie within the source view and
contain sampled source curves. Unknown parts, duplicates, nonfinite/inverted bounds,
unknown part fields and over-capacity annotations fail rather than silently drop data.

Without explicit crops, upright parts show upper/lower front regions. Shallow parts
(H/min(W,D) < 0.3) use a plan-led composition and left/right section-edge crops.
These are deterministic review defaults, not inferred manufacturing feature names.

## Actual behavior

- Feature/handled solids use the same BRep projector as v1. Rotational vessels use
  the maintained reviewed profile and isometric ring generator, with archived profile/
  dimension/material inputs and a STEP bounds agreement check. This avoids exposing
  hundreds of faceted surface edges as drawing lines. It does not certify full profile/
  STEP equivalence beyond those bounds; keep the source project verified.
- Five views: front, plan, side, isometric, and actual CAD centre-Y section.
- Actual closed section face wires create even-odd hatch paths; holes stay empty.
- W/H/D come from source CAD bounds. W25/W50/W75 come from actual horizontal
  sections at 25/50/75% of height; table Z is measured from the CAD bottom.
- Station dimensions are omitted from the front when their spacing is below 25 sheet
  units, while values remain in the table. This prevents overlap on thin plates.
- Drawing primitives are a Python adaptation of the vendored MIT SVG kit. Source
  and modification description are in assets/vendor/dimensional-drawing/provenance.json.
- Desktop/mobile sheet compositions, individual part sheets and one all-part sheet.
  Physical screen readability for very large sets still requires scoped review.
- Actual final projected placement supplies normalized frontBoxes. They are exported
  for later page handoff integration, not automatically installed into existing pages.
- sources/*.step, source-config.json, input.json and drawing-plan.json preserve evidence.
  drawing-manifest.json records source/runtime hashes, output hashes and limitations.
  --verify checks output integrity and normalized placement. It does not certify source
  manufacturing validity, user adoption or current-runtime equality for historical output.

## Scope and checks

`tests/test_dimensional_drawing.py` covers offset solids, hollow sections, source
preservation, deterministic rendering, single/multiple lists, tampering and rejected
inputs. `tests/check-dimensional-drawing.cjs` renders candidate SVGs in the pinned
browser at desktop/mobile sizes and checks text stays within the sheet.

Unsupported here: automatic semantic feature annotations, tolerance/GD&T inference,
new sketch extraction, arbitrary imported mesh, page-review installation, scroll
handoff validation, film export and finished-page release. Auto upper/lower crops
can be less informative than reviewed feature-specific crops. Mobile whole-sheet
fit can require zoom; the SVG files retain vector detail. Do not call this a finished
replacement for the current page drawing stage until handoff integration and its
browser regressions pass and the actual output is visually adopted.
