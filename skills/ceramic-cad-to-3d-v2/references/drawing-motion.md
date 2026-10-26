# Dimensional drawing motion review

Adapt the pinned MIT scene renderer to existing verified drawing-review SVGs.
Use normalized solid stroke reveal, fade text/dashed/hatching, logarithmic camera
zoom and time-only state. Do not morph a ceramic solid into exploded UI layers.
Do not change CAD geometry, drawing coordinates or the existing 3D story.

`run.py --workspace ROOT drawing-motion --drawing REVIEW_DIR --output UNUSED_DIR`
creates a local review player. Optional `--duration` is 8–15 seconds (default 11).
Use `drawing-motion --verify DIR` for archive/output integrity. Output must be unused.
The input is a previously verified drawing-review output, even if its recorded runtime
is older. Preserve its SVG bytes and source manifest; motion has its own runtime hash.

Each source part is available through a selector with desktop/mobile SVG variants.
Playback starts only on user request. A range control and `window.__drawingMotion`
provide deterministic seeking through `render(seconds)` / `setProgress(0..1)`.
Geometry leads, dimensions follow, labels and hatch fill follow their views. Solid
strokes draw with pathLength; dashed geometry, text and patterned fills fade instead.
Start close to the principal front/plan view and finish on the complete sheet.
At the last frame restore original SVG element presentation, including attributes.
Responsive changes rebuild from the archived layout and restore the same progress.
Pause/seek/part changes cancel the animation loop; idle state uses no rAF loop.
Reduced motion shows the completed sheet and avoids animated playback/zoom.

This is an independent CAD-motion review, not installation into page-review or an
MP4 exporter. No sound, invented layers, 3D pose edits or automatic source adoption.
The vendor files document provenance; the maintained runtime is assets/drawing-motion.
Verify forward/reverse seek equivalence, final SVG parity, responsive and reduced-motion
behavior before adopting a result. Verification output does not imply visual approval.


Enable Scroll in the generated player to map document scroll position 0…1 to
render(progress × duration). A sticky viewport retains the drawing and controls;
reverse scrolling seeks backward, Play is disabled in scroll mode, and the range
control moves the scroll position. Only scroll/resize events request a render.
Reduced motion keeps the complete drawing and disables the mode toggle.
This connects scroll to the standalone drawing viewer, not to the 3D page story.

The maintained browser check captures 0%, 10%, 25%, 43%, 55%, 75%, 90%, 100%
for each selected part on desktop/mobile and lists these keyframes in report.json.
Inspect those PNGs for choreography defects; capture completion is not visual approval.


## Feature camera paths and reading

Use `--camera camera.json` with generation to select per-part target paths:
```json
{"schemaVersion":1,"parts":{"mug":[
  {"at":0,"target":"view:front","zoom":1.5},
  {"at":0.3,"target":"detail:A","zoom":2},
  {"at":0.65,"target":"detail:B","zoom":2},
  {"at":0.88,"target":"sheet","zoom":1},
  {"at":1,"target":"sheet","zoom":1}
]}}
```
Keys use normalized time 0…1, strictly increasing, with 2–12 keys and zoom 1…4.
The first key starts at 0; the last is exactly full sheet at 1 with zoom 1.
Targets must exist in both archived layouts: view:front/plan/side/section/isometric,
detail:A/B or sheet. Unknown parts/targets, nonfinite values and invalid endings
fail before output publication. Parts without keys retain the original camera.

Targets are resolved from each layout's actual clip rectangle, not a generic
feature icon or the unclipped curves' bounding box. Position uses ease-in-out;
zoom uses log interpolation. Requested feature groups start drawing early enough
for their visit, with geometry before labels. Keys are archived in motion.json
and covered by the output manifest. This is presentation targeting, not a CAD edit.
Review intermediate camera cropping and reading order in the saved frames.

Read drawing opens packaged reading.html with the same immutable SVGs and source
title block, at the selected part anchor. Back to motion returns to the player.
This separates full-size inspection from the moving camera without loading an
external project or site.


For the implemented opt-in full-page connection, read [dimensional page bridge](dimensional-page.md). Standalone commands still generate independent reviews; page integration requires the explicit dimensionalDrawing input and its source/whole-page checks.
