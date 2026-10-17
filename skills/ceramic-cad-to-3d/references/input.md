# Supported input and P1 answer resume

Run the commands from the repository root:

```bash
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project new 01-moon-jar --sketch /path/to/sketch.jpg
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project resume 01-moon-jar --config /path/to/project.json
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project verify 01-moon-jar
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project revise 01-moon-jar --feedback 'height confirmed at 150 mm' --config /path/to/revised-project.json
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project rollback 01-moon-jar <snapshot-directory-name>
```

The sketch is required; `--photo` can be repeated and is stored for the future gallery stage. To continue from reviewed sketch evidence, use an intake manifest:

```json
{
  "schemaVersion": 1,
  "name": "Project display name",
  "parts": [
    {
      "id": "moon-jar",
      "name": "Moon jar",
      "extraction": "/path/to/reviewed-p1-extraction.json",
      "profile": "/path/to/reviewed-outer-profile.json"
    }
  ]
}
```

For a mug with a handle in P1, set `"shapeKind": "handled-vessel"` in its part and omit `profile`. This accepts sketch evidence and answer state and leaves `readyForCAD: false` while blocking answers or reviewed P2 body/handle files are missing. Use `resume --profile mug=/path/to/outer-profile.json --handle mug=/path/to/handle.json` for the reviewed P2 inputs; see [handle contract](handled-vessel.md). Pending answers still block CAD. A separate manual `--config` workspace supports a provisional comparison; do not override a P1 project's evidence with it. Pending P1 projects can run `verify` to check the copied sketch, extraction, answer archive, proposal, and question summary.

The extraction uses P1 schema 2, checked by the packaged `scripts/validate.py` and `scripts/workflow.py`. Every part must point to the same source sketch hash supplied to `new`, use its own stable `project`/part ID, and contain observed regions, uncertainty, and questions. The profile is a separately reviewed P2 silhouette; do not synthesize it by silently scaling another vessel. The manifest supports a nonempty list of rotational/handled parts; all file paths are relative to the manifest directory or absolute. Install [requirements.txt](../requirements.txt) into a project Python environment for P1 image/hash validation.

```bash
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project new 01-moon-jar --sketch /path/to/sketch.jpg --intake /path/to/intake.json
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project resume 01-moon-jar --answer /path/to/answer.json
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project resume 01-moon-jar --profile moon-jar=/path/to/reviewed-profile.json
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project verify 01-moon-jar
```

Answer JSON follows the P1 contract: `project`, stable `answerId`, `questionId`, `evidence: {"kind":"user-message","reference":"<message reference>"}`, `verbatim`, `updates: [{"field":"...","value":...}]`, and `deferFields: []`. Preserve actual replies; synthetic fixture answers belong only in tests. `pipeline-state.json.nextInput` and `intake/summary.json` list pending questions and missing dimensions. `intake/<part>/p1-state.json`, `answers/`, `spec-proposal.json` preserve provenance. If initial intake validation fails, correct the reviewed file and retry `resume --intake /path/to/intake.json` in the same project. CAD outputs are built only after blocking questions are answered and reviewed profile dimensions agree. Missing exact dimensions and material names receive explicit CAD-blocking questions. No inferred material name is inserted. The current CLI does not interpret sketch pixels or produce a page from photos.

The config uses the same schema as `tests/fixtures/single/config.json` and `tests/fixtures/multiple/config.json`: `name`, `style: technical-dense`, `compositionMode: single|multiple`, and a nonempty `parts` list. Every part has a stable lowercase hyphenated `id`, `name`, and JSON file paths for `profile`, `dimensions`, and `material`. Use `shapeKind: rotational-profile` when explicit. The renderer reads each profile as ordered `[radius_mm,height_mm]` points. The dimensions record supplies `targetFiredMm` or `valuesMm` with height, maximum/opening/foot diameter, and wall thickness; optional shrinkage and source fields retain their provenance. Material may be `single` or `composition`, as in the examples.

For manual rotational configs, optional `footHeight` (positive mm) raises the body underside above ground. `height` includes the foot; `baseThickness` is the actual body floor thickness, so the inner floor is at `footHeight + baseThickness`. The foot underside is open, with the same radial wall offset as the body. These are explicit preview assumptions; do not infer a foot from its diameter alone or substitute an 11 mm solid base for a 10 mm foot and 1 mm floor. Omit `footHeight` to preserve legacy geometry. CAD section and STEP/GLB use the same section; raised feet are not yet accepted for handled vessels or auto-assembled P1 inputs. Partial glaze/page proportions and stacking still need their own review support.

For a manually reviewed handled vessel, add `shapeKind: handled-vessel` and `handle` JSON path to the same part, alongside the body `profile`. The handle file is copied and hashed with other inputs. Manual handled-vessel builds require a Python environment with build123d ; the result includes STEP/GLB and a numeric CAD-to-wire placement report. The [synthetic fixture](../tests/fixtures/handled/config.json) demonstrates routing only; its dimensions do not describe the user mug.

The CLI copies the config and source JSONs into the project's ignored local workspace before generation. `pipeline-state.json` records input/output hashes. `review-log.md` records feedback. `cad/manifest.json` records one sheet per project, four layout choices, per-part source hashes and `frontBox` values. The sketch and photos remain local; they are not published by this entrypoint. `verify` detects direct edits to project inputs or CAD output, so use `revise` for a deliberate change.


## Motion input

Use `motion-preview PROJECT --motion FILE` after CAD verification. The JSON contains `schemaVersion: 1`, `status: reviewed-provisional|user-confirmed`, nonempty `provenance`, `tiltDirection: right|left|forward|backward|none`, `tiltDegrees` (0–90), and `bodySpinDegrees`/`axisPrecessionDegrees` (360–1440). Select values from project evidence; the moon's comparison angles are not automatic defaults.

## Gallery input

`gallery PROJECT --photos FILE` consumes an ordered JSON list. Each photo has `source` (absolute or workspace-relative), `sha256`, `role: actual|process`, `status: user-confirmed-final-fired|user-confirmed-process` matching its role, and `alt`. Empty input omits the gallery. One photo uses the selected hero frame. The selected two-photo composition is an actual hero followed by a distinct smaller process photo. Other multiple-photo layouts remain pending. The component manifest and all outputs are recorded in project state and checked by `verify`; this command does not assemble a finished page.

Test fixture JSON paths are fixture-directory-relative for portability. Resolve them to absolute paths before sending a fixture through the project CLI; normal project config paths are workspace-relative or absolute.

### Explicit scatter review input

The existing ordered photo list keeps the selected hero/process behavior. For a separate 2–8 photo review candidate, supply an object with `photos` (the same role/status/source/hash/alt records) and `layout: {"mode":"scatter", "seed":"project-review-1"}`. Photo order remains DOM/keyboard order; role does not control size or position. The stable seed and `bounded-scatter-v1` algorithm produce distinct bounded sizes/positions for desktop/mobile, recorded in `manifest.json`. Reusing the same input reproduces the layout; changing seed intentionally proposes another layout. Over eight photos is currently rejected, never silently dropped.

The generated `gallery/index.html` is a standalone component review, not a finished CAD-to-photo page. The scatter manifest is `candidate-not-visually-adopted`. Keep selected layout as default until a visual choice is adopted. Multiple image files can be crops of one source photograph: retain this provenance; do not count them as independent captures.

For CAD sheets with three or more parts, optional `cadLayout: {"partOrder": ["part-id", "..."], "lastRowAlignment": "center-front"}` sets drawing order separately from the source part list. List every ID exactly once. On desktop, a lone final-row vessel is centered by its frontBox; mobile keeps that order in one column. Omission preserves the existing layout. This is CAD placement only, not scene/assembly ordering.

### Shared wire colour

Optional `motion.wireColor` in the page-review JSON (single rotational, handled,
or multiple/layered) overrides `wire3d.defaultColor` in the accepted profile.
For `motion-preview --motion`, place `wireColor` at the root of that motion JSON.
Use a six-digit hex string, for example `"wireColor": "#334455"`; invalid or null
values are rejected. Omission uses the adopted warm grey `#6E6A68`. This is the
3D guide-line colour, independent of CAD drawing strokes and clay/glaze colours.
The resolved colour is frozen in each generated `wire-color.mjs`. Existing pages
and reference fixtures are not migrated; an explicit later regeneration uses
the current default unless the input specifies an override.

### Reviewed nonrotational feature geometry (stage only)

`run.py --workspace ROOT shape-build --input shape.json --output UNUSED_DIR`
consumes reviewed data and generates `model.step`, `model.glb`, the exact source
JSON and a hashed manifest. Outputs are created atomically in a new directory;
this standalone command is geometry-only; the project lifecycle route below also consumes the same compiler.

Required root fields: `schemaVersion: 1`, `units: "mm"`, `upAxis: "Z"`,
`status: "reviewed-provisional" | "user-confirmed"`, nonempty `provenance`,
`assumptions` array, `construction: "solid"`, nonempty ordered `features`.
Record the evidence and unseen depth/back assumptions; the compiler does not
infer features from a sketch. `hollow` is rejected until cavity/opening/thickness
contracts and checks exist. A decorative cut is not a manufacturing hollowing
operation. No shrinkage, recentering or scale conversion of input dimensions is inferred.

Each feature has a unique slug `id`, `operation` (`base` for the first, then
`union` or `cut`), and one of these `kind` definitions:

| kind | fields |
|---|---|
| `box` | `originMm: [x,y,z]` at minimum corner, `sizeMm: [dx,dy,dz]` |
| `sphere` | `centerMm: [x,y,z]`, `radiusMm` |
| `revolve` | `profileRzMm: [[r,z], ...]`, closed solid section revolved 360° about Z |
| `loft` | explicit `ruled: true/false`, `sections` in order |

Loft sections are closed `polygon` with 3D `pointsMm`, or `ellipse` with
`originMm`, `plane: XY/YZ/XZ`, `radiusUMm`, `radiusVMm`. Plane axes are respectively
X/Y, Y/Z, X/Z. Coordinates are absolute in the common local part frame.
The kernel checks valid, connected, positive-volume solids after every operation;
no-op unions/cuts fail. STEP roundtrip and GLB/CAD bounds are checked before promotion.
This finite operation vocabulary is not arbitrary CAD scripting or sculptural
fidelity. Sweep, arbitrary transforms, external STEP/mesh, materials, motion and assembly remain pending. The project route below adds candidate CAD views/curve guides and lifecycle tracking.

#### Feature-solid project lifecycle

Manual configs may use `shapeKind: "feature-solid"` with `id`, `name`, `shape`
(path to the reviewed feature JSON) and `material` (JSON evidence object).
Dimensions are inside the feature data, not a vessel `dimensions/profile` pair.
Use the usual `style: "technical-dense"` as the target drawing style and
`compositionMode: "single" | "multiple"` consistent with part count; this does
not claim a technical sheet has already been generated.

`new --sketch --config`, `revise --feedback --config`, `resume [--config]`,
`status [--config]`, `verify`, and `rollback` now preserve part IDs, archived
shape/material inputs, fingerprints and snapshots. Outputs live in
`geometry/<part-id>/`; state is `geometry-ready`, with `cad` still blocked.
Same-input resume preserves output/state; material-only edits reuse geometry.
Failed generation retains the preceding output, marks readiness stale/blocked,
and permits corrected-config resume. Verify rebuilds the BRep in memory and
compares STEP volume/bounds and GLB bounds with the reviewed source.

All parts in this initial route must be feature-solid. Mixing vessel and feature
parts, switching an existing vessel project into feature mode, P1 feature
extraction and visually adopted feature CAD layout remain unsupported. Candidate views and section guides are generated as described below. Motion previews accept a reviewed feature part; single-feature page candidates require the explicit material review below.
Do not reclassify it as cad-ready or attach a substitute rotational model.

#### Feature CAD and wire candidates

Project builds generate `geometry/sheet-{desktop,mobile,mobile-short}.svg`,
`drawing-manifest.json`, and `<part-id>/wire-guide.json` alongside the solid.
`short` reuses desktop. All parts share a sheet; desktop uses up to two columns,
mobile uses one. Six views: front, plan, side, centre-Y section, isometric and
axonometric CAD section-guide preview. Overall dimensions are input CAD bounds,
not shrinkage-adjusted manufacturing measurements. Material hatching and a
visually adopted technical-detail arrangement remain pending.

Front view looks from negative Y with Z up. `frontBoxes` are normalized against
the whole sheet and include the source STEP hash and `cameraLookAtMm`. These
coordinates describe the drawn front extent, not an already browser-verified
CAD-to-3D transition. Guide groups preserve CAD mm/Z-up; line segments are also
exported as `positionsYUpMetres`, mapping `[x,y,z]` to `[x,z,-y]/1000`.

Wire curves come from BRep edges and actual XY/YZ/XZ sections. Candidate density
is in `wire3d.featureSections` (16 horizontal, 9 per vertical axis, 48 intervals
per curve). Internal trim holes remain section boundaries; no triangle mesh edge
fallback is used. Curves may be dense on planar parts; this new policy is not a
replacement for adopted rotational/handled wire rules. These static candidates
need visual review and connection to the existing motion/material/page renderer.
The project stays geometry-ready; drawing status is candidate, not complete CAD
or page approval. Changing shape/runtime rebuilds the dependent drawing/guide;
material-only revisions reuse solid files and regenerate the sheet deterministically.

#### Feature motion review

Use the existing motion input fields (review status/provenance, direction/tilt,
body spin, axis precession, optional wireColor). For multiple feature parts,
add `partId` naming the one part to inspect; a single part is selected implicitly.
`motion-preview`, `resume`, `revise`, `verify` and failed-browser recovery share
the existing motion lifecycle, with an explicit geometry hash dependency.
The complete feature sheet is the starting view; only the selected front drawing
transitions into that part's CAD-derived wire and neutral-clay review.

Model and guide use the same centred X/depth frame. Vertical origin is preserved.
Feature framing measures transformed bounds in camera space to include camera
elevation; handled framing stays unchanged. Feature entry/visibility values live
under `wire3d.featureVisibility` as a candidate, separately from adopted mug
visibility. The browser gate checks four sizes, six points, source-front/mesh
alignment, depth-view entry, wire visibility during the first half turn, full
axis/body turn, clipping and reverse-scroll state. It does not establish visual
adoption, material fidelity, whole-page or simultaneous multi-part scene support.

### Single-feature page review

A `single` config with one `feature-solid` uses the existing handled review schema
through `page-review`. Archived material evidence must contain `clay.name` and
`glaze.name`. Review fields: `schemaVersion: 1`, `status: reviewed-provisional`,
`provenance`, `motion` (reviewed motion fields plus `storyHeightVh: 300..1500`),
`surface` (`clayName`, `glazeName`, `clayHex`, `glazeHex`, `roughness`, `clearcoat`,
`provenance`), and workspace-relative `photos` JSON path. Names must match material
evidence, colours are explicit #RRGGBB, roughness/clearcoat are in [0,1]. Optional
`motion.partId` must match the single archived part. An empty photo list ends on
glaze; photo roles follow the existing actual/process evidence contract.

Only one all-surface glaze is supported here. This schema rejects multiple feature parts; use the multiple schema below. Layered or partial feature coatings remain unsupported. Use
`resume`, `revise`, and `gallery` for dependency-driven regeneration; failed jobs
retain the previous verified revision. `geometry-ready` and candidate drawing
status remain separate from a browser-verified page and user visual adoption.

### Multiple feature page and upright assembly

Use a homogeneous `compositionMode: "multiple"` feature-solid config with the
existing multiple page review schema and `renderer: "feature-solids"`. Preserve
config part order/IDs. Each part supplies reviewed `motion`, `provenance`,
`accentEnabled: false`, the schema's accent placement fields (inactive), and
`glazePreview`: `clayName`, `baseName`, `clayHex`, `baseHex`, `accentHex` (inactive),
`roughness`, `clearcoat`. Names must match archived clay/glaze evidence; surface
values are explicit provisional previews. Set `motion.timing.accentGlazeStart`
to null: this route supports one full-surface coat, not vessel exterior bands.
The existing reviewed timing/camera/framing/background/photo-list fields apply.

Optional `assembly` uses the existing ordered steps, part IDs, start/duration,
`targetPositionMm` and `liftMm`. Coordinates are scene Y-up mm, relative to each
CAD bounding centre in X/depth and its lowest CAD Z as bottom zero. All parts
must settle before assembly; physical scale must be 1 and all body/axis turns
must be integers so final orientation is the original upright CAD orientation.
No target rotation is supported. Steps are sequential lift/translate/lower.

Geometry is centred consistently using CAD bounds, including off-origin inputs.
The same renderer loads all GLB mesh primitives and actual BRep section guides.
CAD collision verification samples 121 uniform poses plus phase boundaries for
both layouts. Disjoint bounding boxes skip exact intersection; overlapping boxes
use actual CAD common volume. Positive overlap rejects generation. This is not a
continuous collision guarantee, stability/contact simulation or manufacturing
clearance proof. Unreviewed arbitrary packing and shared-instance/group expansion
are not implemented. Larger counts use the same lists; visual readability and
performance still need review for that composition.
