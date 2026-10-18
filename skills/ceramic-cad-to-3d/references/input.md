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

`gallery PROJECT --photos FILE` consumes an ordered JSON list. Each photo has `source` (absolute or workspace-relative), `sha256`, `role: actual|process`, `status: user-confirmed-final-fired|user-confirmed-process` matching its role, and `alt`. Empty input omits the gallery. One photo uses the selected hero frame. The selected two-photo composition is an actual hero followed by a distinct smaller process photo. Other combinations use explicit adopted scatter input below. The component manifest and all outputs are recorded in project state and checked by `verify`; this command does not assemble a finished page.

Test fixture JSON paths are fixture-directory-relative for portability. Resolve them to absolute paths before sending a fixture through the project CLI; normal project config paths are workspace-relative or absolute.

### Explicit scatter input

The existing ordered photo list keeps the selected hero/process behavior. For a 2–8 photo scatter layout, supply an object with `photos` (the same role/status/source/hash/alt records) and `layout: {"mode":"scatter", "seed":"project-review-1"}`. Photo order remains DOM/keyboard order; role does not control size or position. The stable seed and `bounded-scatter-v1` algorithm produce distinct bounded sizes/positions for desktop/mobile, recorded in `manifest.json`. Reusing the same input reproduces the layout; changing seed intentionally proposes another layout. Over eight photos is currently rejected, never silently dropped.

The generated `gallery/index.html` is a standalone component review, not a finished CAD-to-photo page. The scatter manifest is `user-adopted` for the sizes/positions adopted on 2026-10-18; individual photo content and CAD/motion approval remain separate. Existing selected-pair input stays unchanged. Multiple image files can be crops of one source photograph: retain this provenance; do not count them as independent captures.

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
`assumptions` array, `construction: "solid" | "hollow" | "imported"`, nonempty ordered `features`.
Record the evidence and unseen depth/back assumptions; the compiler does not
infer features from a sketch. For `hollow`, supply `hollowing: {thicknessMm: 2, opening: {axis: "Z", side: "max"}, cavityProbeMm: [0,0,20]}` with reviewed values. After all features, the compiler offsets inward by that positive thickness and removes exactly one extremal planar face on X/Y/Z min/max. Ambiguous or curved opening faces fail; no face index is guessed. The probe must be inside the original solid and empty afterward. Valid connected remaining material, reduced positive volume and unchanged outer bounds are checked. This supports a uniform-offset open cavity, not arbitrary cavity cutters, closed voids, varying thickness or a global minimum-wall/manufacturing guarantee. Kernel offset failure requires revised input, never silent solid fallback. `solid` rejects stray hollowing input. A decorative cut alone does not declare hollow intent. No shrinkage, recentering or scale conversion of input dimensions is inferred.

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
fidelity. Sweep, arbitrary transforms and external mesh import remain pending. Reviewed STEP input is described below; project material/motion/page routes are described in their sections. The project route below adds candidate CAD views/curve guides and lifecycle tracking.

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

Only one all-surface glaze is supported here. This schema rejects multiple feature parts; use the multiple schema below. For partial/two-layer feature coatings use the explicit list schema below, including for a single part. Use
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
to null for one full-surface coat. Two-layer input follows the opt-in contract below.
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

#### Foundation-first vertical descent

For feature-solids, optional `assembly.mode: "direct-drop"` replaces the final
floor lineup/lift-place stage. Each step supplies `dropHeightMm` (0 < value ≤ 1000)
instead of `liftMm`. During the initial CAD/wire descent, each part moves toward
its target X/Z and waits at target Y + dropHeightMm. After coating and rotation
finish, steps descend vertically in their explicit sequential order. Put the
foundation first and upper parts afterward. Heights must keep waiting parts clear
of lower parts; the existing sampled CAD collision gate checks this trajectory.
Reverse scroll uses the same pure progress function. Omitted mode retains
`lift-place`; this new route is currently feature-solid only. Drop heights/timing
are reviewed scene inputs, not gravity or physical settling simulation.

For continued rotation and a soft touchdown, set `assembly.landing: "soft-spin"`
with `direct-drop`. Body and upright-axis yaw continue from the glaze stage until
each part's own step ends, smoothly reaching zero angular velocity at landing.
The axis tilt still releases before assembly, so placement stays upright. Vertical
motion uses quintic smootherstep (zero endpoint velocity and acceleration). CAD
collision samples apply the same time-dependent yaw, rather than checking only
unrotated solids. Whole-turn constraints preserve the final orientation. Drop
heights and step durations remain reviewed inputs; shorten the distance and allow
more scroll for landing when the previous descent reads as abrupt. Omitted
`landing` preserves the earlier direct-drop behavior.

Set `assembly.overlap: true` only with `direct-drop` when successive upper parts
should descend together. Steps must retain nondecreasing departure and landing
times, but a later departure may precede an earlier landing. Omitted/false keeps
nonoverlapping steps. Keep the foundation landing before the upper parts in the
reviewed timing. The same per-part soft-spin, reversible trajectory and rotating
CAD collision samples apply to simultaneous movement.

#### Adopted gentle-staggered preset

New sequential direct-drop reviews should name `assembly.preset:
"gentle-staggered"`. The feature multiple adapter resolves mode=direct-drop,
landing=soft-spin and overlap=true from `accepted-profile.json`; explicit
conflicts are rejected. Timing and geometry remain reviewed input. For upper
pieces after the foundation, the landing gap must not exceed 0.2 times the
shorter of the adjacent fall durations. The selected three-part reference is
foundation [0,.22], upper pieces [.22,.82] and [.34,.94] within assembly [.63,.95].
Those are scroll progress values, not seconds. Preserve sufficient fall duration
and adjust overall scroll budget for larger compositions. The reference heights
65/100/135mm are specimen-specific, not global defaults. Previously explicit
reviews without a preset retain their existing behavior; do not use their older
motion as the default when creating a new review.

### Single solid page surface camera

Single handled/feature page reviews optionally accept `motion.surfaceElevationDegrees` (finite 0–35, default 0). The camera transitions to this elevation as clay appears and retains it through glazing, making a reviewed hollow opening visible. It does not change the adopted wire entry view. Existing omitted-value reviews retain the original front-facing finish. Inspect desktop/mobile framing and the opening; 22° is the hollow development fixture value, not a universal adopted default.

### Feature partial and two-layer coatings

Use `renderer: feature-solids`, the existing list-based motion/camera schema, and a `coatings` object on **every** part. This explicit route supports both single (one part) and multiple projects; it uses the common multiple renderer even for one part. The older single whole-solid review schema remains one-coat and retains its motion.

Archive each part's `material.clay.name` and `material.glazeLayers` with exactly two `{order: 1|2, name, application}` entries. Applications are `full-coat` or `exterior-below-dashed-boundary`. The latter requires a reviewed exterior height interval, not an automatically inferred dashed line. Match `glazePreview.clayName/baseName/accentName` to those names, keep `accentEnabled: false`, and supply the existing colours/roughness/clearcoat. Preview/fired colours are not chemical simulation.

`coatings` reuses the layered-vessel contract: status/provenance/roughness, ordered `layers[{name, region, previewHex}]`, and `fired{baseHex, region, regionHex}`. Regions are `{surface: all}` or `{surface: exterior, minHeightMm, maxHeightMm}` measured from the CAD bottom. Use sequential base/accent time intervals, both ending before assembly/photos. For a full coat followed by a partial coat, unpainted areas retain the first preview colour; make that consistent with the reviewed fired base appearance.

`surface-regions.json` binds primitive membership to source shape/GLB hashes. Each exterior primitive's vertices must lie on the original pre-hollow CAD boundary (0.0001mm tolerance); the removed opening face is excluded. Thus hollow inner walls/floor and opening rim are excluded from exterior coats, while original underside surfaces are included. A solid's decorative cut surfaces remain exterior; hidden cavities are not inferred. Only compiler-produced GLB layout is supported. Verify classification on new geometry; no external mesh or arbitrary face-ID selection is implied.

Coarse feature triangles are subdivided in height without changing their surface or CAD wire guides. Vertex colour interpolation across a region boundary is bounded to 1/80 of the object's height; it is a visual approximation, not a physical coating edge. Existing rotational and one-coat outputs do not use this subdivision. The same browser gate checks both layer orders, inside/outside colour, rotation, framing and reverse scrolling. User visual adoption remains separate.

### Reviewed STEP input

Keep the existing `shapeKind: feature-solid` project part and reviewed shape JSON metadata. Set `construction: imported`, with exactly one feature:

```json
{"id":"source","operation":"base","kind":"step","source":"reviewed-model.step","sha256":"<64 lowercase hexadecimal digits>","modelIntent":"solid","expectedBoundsMm":{"min":[-16,-11,-21],"max":[16,11,21]}}
```

The STEP/STP filename must be adjacent to the source shape JSON. Preserve exact source SHA256 and explicitly reviewed post-import mm/Z-up bounds. OCCT reads STEP units; the importer checks the resulting bounds within0.1mm and never guesses orientation, scale or missing dimensions. Supply a reviewed `modelIntent: solid|hollow`; hollow additionally requires `cavityProbeMm` inside the bounds and outside the material. That probe is a sanity check, not proof of every cavity or opening. No hollowing/Boolean feature steps are added in this imported mode.

Only one connected valid positive-volume BRep solid with no extra faces/edges is supported per part. Assemblies/disconnected solids, open shells and mesh formats are rejected. Use separate reviewed parts for multiple objects. The original geometry is tessellated/exported through the common compiler and gains the same drawing/frontBox/wire, lifecycle and one-coat page path. Imported partial/two-layer coatings are explicitly rejected because no pre-hollow exterior identity has been supplied; never classify the inner wall as exterior by guessing.

`new/revise/resume --config` archives the exact STEP and original source JSON, plus a normalized shape JSON referencing the archived STEP. Model bytes are included in rebuild/page dependencies. Source-file changes require a newly reviewed hash and bounds; mismatches fail without replacing prior geometry. Existing projects remain reproducible after the original external file is removed. Standalone shape-build also preserves raw source bytes as `imported-source.step` and records the original source JSON; it does not rewrite the original filename in that JSON. To replay a standalone bundle, place those preserved STEP bytes beside its source JSON under the declared filename.

### Planar XY glaze regions (feature solids)

User-authorized v1 scope extension. In the explicit `feature-solids` two-pass review,
`region: {"surface":"planar-xy","planeZMm":22,"rectanglesMm":[[-30,-20,30,20]]}`
selects the union of 1–256 rectangles `[minX,minY,maxX,maxY]` in original CAD
coordinates (millimetres, Z-up), on exterior horizontal upward-facing faces at
the specified CAD Z plane. Regions and plane must lie within part bounds.
Layer material evidence uses `application: planar-regions`; names and pass order
still match the archived evidence. `fired.region` accepts the same mask.

This supports flat painted areas and grooved slabs without creating separate
tiles. Triangle clipping preserves hard boundaries; centered web coordinates
are converted back to CAD coordinates. Side walls, lower groove floors and
undersides are excluded. Existing all-surface and exterior-height inputs retain
their behavior. Imported STEP, rotational-vessel planar masks, arbitrary curved
UV painting and inclined planes remain unsupported. Palette, pass order and
glaze application outside the mask require reviewed project inputs. Two passes
are a visualization, not a chemical firing simulation.

### Repeated feature instances and material variants

For a feature-solid project, config parts remain unique CAD definitions. An
optional page review `instances` list contains `{id, sourcePartId, appearance}`.
The review's `parts` still describes each CAD definition once; instances expand
those defaults without mutation. Model/front/wire files and browser load promises are shared per source, while material evidence and mutable mesh colors remain per instance. Each source must be used; IDs must be unique.
An explicit assembly must reference every instance ID exactly once. CAD views
and frontBox coordinates retain the source identity; the scene uses instance IDs.
Appearance overrides accept motion, glazePreview, coatings, materialVariant and
provenance. Existing dimension/material/motion checks apply after expansion.

An archived material can contain `provenance` and `variants: {key: material}`;
`materialVariant` chooses that complete evidence record before validating names
and glaze order. It cannot invent unarchived material names. Feature coatings
may have one all-surface layer or two layers. One-layer fired appearance uses
that first pass and requires an all-surface fired region. A page containing
layered feature appearances retains the existing two time intervals, with
one-layer instances inactive in the second pass. Rotational one-layer inputs
and imported partial surfaces remain outside this extension.

Direct-drop targets specify actual placement; the old left-to-right lineup
constraint does not apply to unused finalX fields in that mode. Shared collision
checks analytically rotate cached source bounds before pair testing; they still use actual CAD
intersection for overlapping bounds. Repetition does not imply automatic
packing, arbitrary target rotations or manufacturing approval.


## Landscape CAD pages and enlargement (feature multiple pages)

Optional `cadPresentation` in the feature page review partitions **source CAD IDs**, not repeated instance IDs, into one to three groups with up to three sources each:

```json
{"cadPresentation":{"clickToZoom":true,"groups":[
  {"id":"board","title":"체스판","partIds":["board"]},
  {"id":"small-pieces","title":"폰 · 나이트 · 비숍","partIds":["pawn","knight","bishop"]},
  {"id":"tall-pieces","title":"룩 · 퀸 · 킹","partIds":["rook","queen","king"]}
]}}
```

Each source must appear exactly once. The generator recomposes the archived BRep views into 1800×1000 SVG pages with retained source front boxes; it does not infer a new shape. Scroll distributes pages through the initial fully visible CAD interval (`sheetFadeStart`), and navigation buttons jump to the corresponding interval. The last page supplies visible front cutouts during the existing transition. Parts absent from that page do not invent front cutouts; all reviewed scene instances still enter the 3D stage. No extra clay or landing time is added.

Click or Enter/Space opens the currently visible SVG in a modal with fit/enlarge, scrollable detail, close and Esc. Closing restores focus and page scroll position. Grouped presentation is opt-in; existing review inputs retain their original sheet layout.
