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

For supported vessel inputs, [ceramic structure mapping](ceramic-drawing-rules.md) supplies rim and foot/floor details, or rim and upper handle attachment. Tables retain source status, with * for non-confirmed construction dimensions. HI = RM - 2 x WT uses the existing radial wall-offset construction. `annotationMode: "profile-stations"` explicitly retains the previous generic presentation.

For feature solids (or profile-stations mode), without explicit crops, upright parts show upper/lower front regions. Shallow parts
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
- W/H/D come from source CAD bounds. Supported ceramic annotations replace generic station labels with source-backed dimensions and section details. W25/W50/W75 in generic mode come from actual horizontal
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

Unsupported here: semantic feature-solid annotations, arbitrary joint-clearance/radius inference, tolerance/GD&T inference,
new sketch extraction, arbitrary imported mesh, film export and finished-page release. Opt-in page-review installation and scroll handoff checks use the dimensional page bridge. Auto upper/lower crops
can be less informative than reviewed feature-specific crops. Mobile whole-sheet
fit can require zoom; the SVG files retain vector detail. Do not call this a finished
replacement for the current page drawing stage until handoff integration and its
browser regressions pass and the actual output is visually adopted.


## Annotation options

Each reviewed part may include:
```json
{
  "id": "vessel",
  "dimensionOptions": {
    "front": {"horizontal": {"below": true, "dx": 8, "dy": 0},
              "vertical": {"side": "right", "dx": 0, "dy": 0}}
  },
  "radiusAnnotations": [0],
  "numberedNotes": [{"view": "section", "pointMm": [0, 20],
                    "text": "Reviewed fabrication note."}]
}
```
Coordinates above are illustrative, not valid for every vessel. Dimension options
support front/plan; offsets are sheet units within ±40, side left/right selects
unrotated vertical text. Omitting side preserves rotated text. These move labels,
not CAD or measured endpoints.

Generate an initial review and read each part's cadRadii catalog. Only listed
analytic STEP section-circle edgeIndex values may be requested; the new review
rechecks the current archived STEP. R1… codes follow request order and their mm
values appear in the table. Section edge indices are local to that source revision,
not persistent identities after CAD edits. No spline fitting or radius estimation.

Up to four numberedNotes use the same view coordinates as drawing-plan views:
front/plan/side are projection coordinates, section uses CAD X/Z. The anchor must
be within 0.25 mm of a sampled visible curve. A boxed number/leader on the view
links to the same number in FEATURE NOTES. Text is reviewed user input; the
generator does not invent fabrication instructions. Up to four radii per part.

SCALE captions report SVG units/mm, not paper scale. General notes explain this;
overall W/H/D labels now use codes and the mm table supplies their values.
Inspect collisions after moving labels; automatic collision resolution is absent.


## Reading surface, title block and leader direction

Generated index.html includes a title block per part: Drawing (source part ID),
Revision (output directory name), Part (selected part index/count), mm units,
per-view SVG scale and the original review-input status. Source project basename
and exact archived STEP SHA-256 are available in Source and evidence. This is a
review revision, not an invented manufacturing drawing number or approval.
Semantic value asterisks continue to retain their source certainty.

The default reader preserves at least 1700 CSS px desktop / 1100 CSS px mobile.
Its bounded region scrolls horizontally and vertically with touch or keyboard.
Fit whole sheet switches to an overview; Read at full size restores readable
scale. Native browser zoom remains available. Individual SVGs and combined sheet
coordinates remain unchanged by these HTML controls.

Optional per-part `leaderSides: {"A":"left","B":"right","handle":"left"}` places
detail-reference A/B labels and the handle detail callout on the requested side.
Omitted directions preserve the existing right-side arrangement. The common
callout helper otherwise infers side from its elbow; text aligns to the shoulder.
Inspect both layouts when changing sides; this is explicit placement, not an
automatic label collision solver.


For the implemented opt-in full-page connection, read [dimensional page bridge](dimensional-page.md). Standalone commands still generate independent reviews; page integration requires the explicit dimensionalDrawing input and its source/whole-page checks.

## Compact multi-part sheet placement

Optional `sheetLayout: {"columns": {"desktop": 2, "mobile": 2}, "alignLastRow": "center"}` arranges complete part panels in rows and centers an incomplete final row. Columns must be integers 1–3 on desktop and 1–2 on mobile; omitted layouts keep the existing automatic placement. `alignLastRow` is `start` (default) or `center`. Individual readable sheets and geometry remain unchanged. The combined SVG and normalized frontBoxes use the same offsets so the CAD→3D handoff follows placement. Use a separate drawing and page revision for comparison; never change existing approved outputs implicitly.
