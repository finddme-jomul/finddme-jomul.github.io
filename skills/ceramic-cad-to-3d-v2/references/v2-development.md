# V2 development scope

This package starts from the tracked v1 skill at repository commit `3738255`.
The initial fork preserves generation code, accepted profile and reference assets.
Dimensional-drawing is now vendored at a pinned commit and its drawing kit is ported
to Python for the standalone drawing-review command. See [the active contract](dimensional-drawing.md).
Existing page generators and approved profile remain unchanged. Opt-in full-page integration is available through dimensionalDrawing; existing pages are not bulk regenerated.

## Entry and isolation

Use `skills/ceramic-cad-to-3d-v2/scripts/run.py --workspace <comparison-workspace>`.
Run `preflight` before generation. Outputs retain the inherited workspace layout;
use a separate workspace or unused project ID so v1 revisions are never overwritten.
The original package and selected moon/bowl fixtures remain unchanged. Install the
v2 environment using its own `environment --setup` before full generation; dependency
folders, Python caches and untracked v1 experiments were not copied.

## Intended drawing update

Keep reviewed sketch intake, confirmed dimensions, actual CAD geometry and provenance.
Adapt the dimensional-drawing drawing kit and composition rules to a reusable,
input-driven drawing stage: meaningful views, dimensions, details, callouts and tables.
Preserve CAD-to-wire frontBoxes, IDs and source geometry. Do not create new scripts
per project or part count. A successful custom sheet is feasibility evidence only.

The local design and TODO are in `docs/make-skill/v2/` of the host repository and
are intentionally Git-ignored; this package does not load them at runtime.
When implementing, maintain the operative contracts here, update the consuming
shared generator and selection coverage, then refresh `tests/update_lock.py --write`
and run affected regressions. Do not mark planned drawing behavior implemented.

V1 historical release notes and selected outputs remain references. New v2 outputs
need their own comparison evidence and visual adoption. Do not change the inherited
accepted profile until the new drawing direction is adopted. General release still
requires the entrypoint release evidence gate; package preflight is not a release.


For the implemented opt-in full-page connection, read [dimensional page bridge](dimensional-page.md). Standalone commands still generate independent reviews; page integration requires the explicit dimensionalDrawing input and its source/whole-page checks.
