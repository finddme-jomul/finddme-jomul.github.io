# Reviewed handled-vessel CAD guide

Use this only after reviewing both the vessel body silhouette and handle shape against the sketch and user answers. The manual config keeps one finished mug as one `parts[]` item with `shapeKind: "handled-vessel"`, a rotational body `profile`, and a `handle` JSON path. The P1 `new --intake` project can receive reviewed `resume --profile` and `resume --handle` files. It remains blocked while CAD questions are unresolved; its evidence cannot be silently replaced by `--config`.

The handle JSON schema is:

```json
{
  "schemaVersion": 1,
  "kind": "centerline-round-section",
  "side": "right",
  "sectionDiameterMm": 8,
  "centerlineMm": [[45, 0, 82], [61, 0, 83], [75, 0, 72], [79, 0, 55], [75, 0, 38], [61, 0, 28], [45, 0, 30]],
  "overallWidthMm": 128,
  "status": "synthetic-test"
}
```

Coordinates are fired-size millimetres: **x** is left/right from the body axis, **y** is front/back, and **z** is height above the foot. First and last centreline points attach to the body surface. The round section is a *guide* to visible width, not a manufacturing cross-section. Set `status` to `reviewed-provisional` or `user-confirmed` only with matching evidence; `synthetic-test` is for fixtures. `overallWidthMm` is the left body edge to the outer handle edge and must agree with the path and section. The renderer rejects wrong attachments, body intersections, axis crossings, nonfinite points, or width mismatch.

When the user confirms both attachment center heights, add `confirmedAttachmentCentersMm: {"upperZ": 125, "lowerZ": 47}` in the handle JSON using the project's own values. Validation rejects a centerline whose first/last z differs from those confirmed values. A partly answered attachment/depth question remains open; store the verbatim answer and keep unconfirmed front-back path and section as provisional. The handled SVG labels the full `overallWidthMm` dimension and includes the projected handle in its `frontBox`.

The SVG contains front, plan and isometric handle guides sourced from the same centreline, and its `frontBox` includes the projected handle. The sheet and manifest hash the body, dimensions, material, and handle separately. With build123d installed, `scripts/run.py new/resume --config` also creates a fused STEP and GLB under `cad/solid/<part-id>/`. `verify` checks the joint overlap volume, open interior, single valid solid, STEP reimport, GLB mesh bounds, and numeric front projection of that GLB against every sheet `frontBox`. The GLB stores metres; reports and input use millimetres. This does **not** validate unseen backside shape, ceramic join strength, browser camera/scroll placement, or a finished 3D page. Review these before presenting a real handled vessel as finished. The sample under `tests/fixtures/handled/` is deliberately synthetic and must not be treated as the user's mug measurements.

A reviewed `centerline-oval-section` handle may use `sectionDiameterMm` for its front-visible thickness and `depthDiameterMm` for its front-back thickness. The solid generator sweeps that elliptical section continuously along the same constrained spline used by the CAD views. The photo-backed mug comparison uses this mode because its smooth bisque handle exposed the round section's bulbous joins and a tapered loft's twisted lower join. These section dimensions and its front-back route remain provisional until the user confirms them.
 The reviewed mug path keeps its first and last centerline segments horizontal at the body, avoiding a spline that curls through the thin inner wall. The generator rejects any cavity intrusion.

Oval-section handles default to `"pathInterpolation": "shape-preserving-bezier"`; store it explicitly in a reviewed smooth C handle JSON for provenance. The shared `make_handle_path()` produces piecewise monotone cubic segments used by both the STEP sweep and CAD views; the previous `constrained-spline` remains supported for older reviewed paths but can curl between anchors. Check sampled path direction and the lower attachment, then inspect front, side, and rear GLB renders. A valid single solid and matching `frontBox` are necessary but do not prove a visually smooth join. Browser wire lines should come from this CAD profile/path, never all tessellation edges of the exported GLB. The mug's section depth and centreline between confirmed attachment points remain provisional.

3D body wire density follows `assets/accepted-profile.json:wire3d`: every fourth CAD profile sample (plus the last), 72 segments per ring and 12 complete meridians, matching the selected moon/bowl body treatment. This is separate from technical CAD sheet information density. Preserve the two CAD handle silhouette rails and exact handle path; GLB triangulation is not a wire design. The previous stride20/two-meridian handled body is superseded by the user’s 2026-10-17 dense-wire request.

**Spatial motion criterion (user feedback, 2026-10-17):** The wire itself must remain clearly visible long enough for its turning volume to read: ring curvature/foreshortening, near/far relationships and changing orientation should be apparent. A dense front-facing spreadsheet-like grid fails even when the later clay model rotates correctly. Review the wire-dominant interval in motion on desktop/mobile against the selected moon reference. Preserve CAD geometry; investigate visibility/rotation overlap, view and depth cues before changing line density again. `page-dense-wire-final` passed technical checks but the user rejected its flat-grid impression; spatial readability is still pending. Current stride/segment/meridian values are density settings, not proof of visual acceptance.
