# Ceramic adaptation of dimensional-drawing

This is the generation rule for the ceramic annotation adapter, not a manufacturing
standard. Source: the pinned MIT dimensional-drawing SKILL.md in assets/vendor.

## Mapping

- Source measurement → archived reviewed vessel dimensions/profile/handle. Never
  infer wall thickness, shrinkage, glaze or corner radii from a picture or silhouette.
- Component-specific details → actual section crops at the rim and foot/floor;
  handled vessels use rim and upper handle attachment. Explicit detail crops win.
- Variable codes/tables → RM rim outer diameter (the existing openingDiameter field),
  WT radial wall construction offset, FD foot diameter, BT floor thickness, optional
  FH foot height. HI = RM − 2·WT is a derived inner rim diameter, not a new measurement.
- Handle structure → HD round section diameter, J1/J2 upper/lower endpoint heights
  from the archived centreline. These are construction anchors, not fused-joint sizes.
- Dimension references → dimension codes on the relevant view/detail and in the table;
  explanation keeps source status and formula separate from geometry-derived bounds.
- Unknown values → [TBD] only in explanatory notes. Missing required geometry remains
  blocked by the existing intake/CAD contract. Do not turn unknowns into numeric zero.
- Physical units → mm. Values are CAD/input values; wet/fired state is not inferred.

## Evidence and precedence

Supported automatic semantics: rotational-profile and handled-vessel with archived
profile and dimensions. Feature-solid inputs retain generic CAD measurements until a
reviewed feature-identity contract is added. Existing explicit detail crops take priority.
`annotationMode: "profile-stations"` preserves the prior generic review presentation;
omission or `"ceramic"` selects supported ceramic semantics.

Every semantic row records source file/hash, field, status and optional formula in
drawing-plan.json. Only an explicit `user-confirmed` dimension source is marked
confirmed; all other/absent source statuses retain `*` in the displayed value. Derived
status follows all operands. Handle rows retain their original source status and are
not promoted by the review input's status. Tables distinguish CAD bounds from input
construction dimensions; discrepancies are not silently replaced by another value.

RM/FD are annotated on the front; WT on the actual rim section detail; BT/FH in the
foot/floor detail when present. Handle HD uses a leader at the reviewed attachment
region, described as handle section input. J1/J2 remain table construction dimensions.
Do not add R dimensions for arbitrary spline profiles, arbitrary automatic fits,
manufacturing tolerances or firing predictions.

## Preserved scope

Keep the actual CAD model, source-derived curves, hatching, normalized frontBoxes,
legacy v1 files and prior immutable drawing revisions unchanged. This change is to
the standalone drawing-review stage. Page handoff and visual adoption remain separate.

Numbered feature references now use boxed markers linked to reviewed FEATURE NOTES;
general explanatory notes are unnumbered. Explicit section-circle radii use the
CAD-backed radiusAnnotations contract in dimensional-drawing.md. This does not
add fitted radii for arbitrary profiles.
