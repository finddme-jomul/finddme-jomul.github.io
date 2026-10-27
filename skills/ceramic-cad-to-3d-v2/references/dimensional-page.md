# Dimensional drawing → complete page

Opt into the existing page-review lifecycle using an otherwise valid reviewed
scene input. Keep the supported renderer's material, placement, motion and photo
contracts. Add:

```json
"dimensionalDrawing": {
  "directory": ".poc/drawing-review/mug-r1",
  "extraScrollVh": 240,
  "camera": ".poc/drawing-review/mug-camera.json"
}
```

Run preflight, then:
```sh
skills/ceramic-cad-to-3d-v2/.venv/bin/python skills/ceramic-cad-to-3d-v2/scripts/run.py --workspace ROOT page-review PROJECT_ID --review scene-review.json
```

For a separate comparison without changing the original project's active page
revision, selected-page --cad-project ABS_PROJECT --review scene-review.json
--output ABS_UNUSED_OUTPUT uses the same installer and browser gates.

## Contract and real consumers

scripts/dimensional_page.py verifies the drawing manifest and exact source
project/config/STEP identities, supported archived profile/dimension/handle/material
inputs, part IDs and order. It registers source drawing files, source STEP and
optional camera input in inputsSha256, so edits invalidate the page revision.
Changing CAD requires a newly generated drawing and updated page-review input;
resume must not silently pair stale drawings with changed solids.

The installer copies the verified drawing into the page, extracts actual front
geometry from each part SVG, and installs the drawing manifest's normalized
frontBoxes into the appropriate single/multiple scene contract. It does not
replace GLB, material, assembly, glazing or gallery logic with UI example geometry.
The common drawing-motion renderer handles the opening; its camera ends at the
static sheet before the existing front-to-wire transition starts.

extraScrollVh (50–600, default 200) adds distance only to the opening drawing
interval. The old 3D timeline and all later scroll interval lengths remain
unchanged. Single and multiple scenes use reversible scroll mappings. All drawing
updates run inside the existing demand-render loop. There is no independent
continuous animation clock or forced scroll.

Optional camera uses the standalone drawing-motion camera JSON contract, currently
for one-part pages only. Multi-part pages animate one combined sheet, using the
default camera; custom per-part tours on a combined sheet remain unsupported.
Grouped legacy cadPresentation cannot be combined with this option. For source
instances, the combined sheet draws each source once; frontBoxes are aliased to
instance IDs and one representative front per source makes the handoff. All 3D
instances, materials and placements remain intact. To adopt this layout, explicitly
remove the legacy grouping from the new review; preserve any manufacturing notes
in the drawing input. Never silently drop a grouping or scene instance.

View drawing details opens the packaged minimum-width reader and source title blocks.
The borderless link is hidden on the completed-CAD entry preview and appears
after the initial scroll, within the existing drawing introduction interval.
The link disappears after the introduction and does not add any section after
the final photo gallery. Original drawing outputs and old page revisions remain
immutable.

## Evidence and limits

The existing complete-page technical gate (48 samples across four viewports) runs
before publication. An additional drawing gate checks desktop/mobile intro,
reverse seeking, restored static endpoint, idle render counts and the reader link.
These are candidate checks, not a preflight --release result or visual adoption.

Supported integration is exercised with the synthetic handled mug and the
reviewed three-plate scene, including layered glazing, assembly and photos.
Single rotational integration uses a separate archived moon-profile project.
Feature-solid multiple integration is exercised by the reviewed chess input:
seven source shapes, 32 pieces plus the board, archived material variants,
placement and photos. The shared page path passes 48 whole-page samples and two
drawing-intro viewport checks, including one visible front per source. This is
development/integration evidence, not held-out evidence or a general release.
Single feature-solid drawing handoff still needs its own scoped E2E.

The source model remains subject to its prior generation limits (for example,
rotational page surfaces and exact CAD solids have their existing distinct
generation paths). This integration validates source identity and drawing/front
placement; it does not claim new physical or manufacturing equivalence.

## What transfers to 3D motion

Already present: scroll-driven deterministic pose/coating, ordered wire/clay/glaze,
demand rendering and idle-frame suppression. Reuse these existing consumers.

Newly applied here: drawing choreography and camera easing before a source-matched
handoff; extra scroll restricted to the drawing phase.

Possible subsequent work: log interpolation of 3D camera distance and reviewed
feature-target camera keys. These require real projected-bounds/framing tests
through tilt/assembly and comparison against adopted motion. Do not apply SVG
pathLength tricks to a mesh or invent exploded ceramic layers. Keep material
states and placement unchanged unless their revision is explicitly requested.

For four or more source parts, the shared drawing renderer arranges one combined
sheet in up to three desktop columns and two mobile columns, with row heights
derived from the actual panels. Individual reading sheets remain full-sized.
Front boxes include both horizontal and vertical panel offsets.

## Connecting an existing host project

Before replacing a host page, compare its current scene settings and gallery with
the archived page-review input. Host-managed photographs and pacing changes can
postdate that input; copying the old review alone can silently remove photos.
Carry the actual existing gallery into explicit reviewed photo input, retaining
process/sketch roles rather than labelling every image as a finished fired work.
Preserve the previous host files and exact photo bytes. The host adapter must
include drawingBridge.extraScrollVh in its CAD pacing boundary and package the
standalone reader's HTML/SVG. Verify the real project URL, including the final
gallery and reader, after export. Generated-page checks alone do not validate
host-specific routing, photo discovery or scroll adapters.
