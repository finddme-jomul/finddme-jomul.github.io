# JOMUL sketch-to-page pipeline and decision status

Use this as the maintained skill contract for the whole intended workflow. The current CLI implements only the supported subset below. Local design evidence lives in `docs/make-skill/`; that directory is excluded from Git, so this reference must carry the decisions needed to run and extend the skill without silently substituting an old PoC.

## Decision rule

- Package one maintained generation path inside this skill, with shared modules and input-driven single/multiple behavior. Select adopted behavior from the PoCs; do not bulk-import historical builders or rejected variants. The PoC target registry is not the skill dependency list. Keep historical evidence outside the active runtime.

- Resolve inputs in this order: the user's current explicit instruction, that project's confirmed answer or approved presentation, cross-project adopted defaults, then labeled PoC assumptions. Keep physical manufacturing facts separate from visual approval.
- Mark each new design result `candidate`, `fixture-verified`, `adopted`, or `rejected`, with its project scope, evidence, and source. Passing a technical fixture does not make a visual choice adopted. Do not load rejected values as defaults. Keep rejected rationale in the local study record, outside the active execution profile.
- When a decision is adopted, update the project input or `assets/accepted-profile.json`, the generator that consumes it, and a browser/asset check of the affected output in the same change. Preserve the previous selected fixture. If the generator still uses a different rule, report the stage as incomplete.
- Begin at the earliest stage invalidated by a changed input. Snapshot before replacing accepted output; regenerate only downstream outputs. Verify at the actual URL the user opens, including reverse scroll and relevant desktop/mobile sizes. A new comparison URL does not update an existing review URL.

## Stage contract

| Stage | Input → output | Current execution boundary |
| --- | --- | --- |
| 00 Start/resume | Project ID, original files, hashes → workspace and stage state | `new`, `resume`, `verify`, `revise`, `rollback` exist; general dependency router and full `pipeline-state.json` remain incomplete. |
| 01 Sketch intake | Sketch/source regions → P1 observations, uncertainty, targeted questions | Agent-reviewed extraction and evidence-backed answers are supported. Unsupervised sketch interpretation is not. |
| 02 Specification | Confirmed answers, clay/firing/shrinkage evidence, presentation choices → dimensions/material/motion with provenance | Do not invent missing size, shrinkage, glaze color, or production claims. Preserve ranges until selected. |
| 03 CAD shape | Confirmed geometry → STEP/mesh/profile from one source | Rotational one/two-part and handled CAD inputs generate source-derived STEP/GLB with roundtrip/bounds checks. General asymmetric and 3+ part production is unsupported. |
| 04 Drawing and wire | Same CAD/profile → one technical sheet, part `frontBox`, CAD-sourced 3D wire | Adopted style: white, borderless, technical dense, front/plan/section/isometric/details/dimensions; English except clay/glaze names. `multiple` parts share one sheet and retain stable IDs. Do not use raw GLB tessellation as the intended wire drawing. |
| 05 Material | Verified clay/glaze evidence and CAD mesh → expected material/render | Separate clay and glaze states; unknown fired color or gloss stays provisional. Reusing a GLB does not prove material parity. |
| 06 Web 3D | Same shape/material → GLB and load/units/bounds check | CAD mm becomes web metres; inspect side/rear/handle joins. The current skill CLI has a single handled-vessel motion preview, not a general finished page. |
| 07 Real photos | `actual[]`, `process[]`, target association, order → metadata-safe web copies and role/order manifest | Keep cover, final-fired, and process roles distinct. A process photo may appear in the last gallery. Never duplicate one source as distinct final photos to claim real multi-photo validation. |
| 08 Page assembly | Reviewed sheet, wire, GLB, motion, photos, selected visual profile → CAD→wire→clay→glaze→final gallery | First CAD sheet fills the viewport within its bounds. No visible page narration, title, caption, badge, progress line, or footer. Photo exists only in the final 100vh gallery after 3D exits; no photo-only scroll segment. Single moon sizing consumes `motion.singleFraming`. The multi-photo equal grid is a candidate, not an adopted layout. |
| 09 Verify | Generated outputs and the same selected contract → hashes, geometry checks, browser captures and visual review | Compare the same scroll progress and viewport with the selected moon/bowl baseline; check object occupancy as well as clipping. Automated passing is not user visual approval. |
| 10 Feedback | User correction, prior state → minimal affected rebuild and exact rollback path | Record adopted feedback in the input/profile and consumer first, then regenerate and verify. Do not reverse-engineer a rollback from remembered values. |
| 11 Package/E2E | All stages and new project input → reusable skill release | Still incomplete. Moon is development, mug is single validation, bowls are multiple validation; reserve chess for final evaluation. |

`single` and `multiple` use one workflow selected by the number of finished vessel instances. A handle is a subcomponent of one vessel, not another `part`. Each independent part keeps its own evidence, CAD, material, and ID; instances can reuse a model. Do not copy one part's uncertain values or one photograph to another.

## Selected visual baselines and current limits

`python3 /path/to/ceramic-cad-to-3d/scripts/run.py preflight` checks the selected moon and bowl files and CAD reference artifacts named in `assets/accepted-profile.json`. The skill executes only `scripts/run.py`; the old repository PoC dispatcher is historical development tooling. The accepted moon full-page baseline is `/.poc/moon-jar-gallery-type-study/`; the bowl photo handoff baseline is `/.poc/bowl-set-configured-photo-handoff/`. Both are local reference fixtures, not new-project E2E output.

The registered `full-page-study` joins existing reviewed assets for single/multiple with 0/1/3 photo cases. Its single-moon wire size now uses model-bound camera fitting and a browser occupancy gate. Full scene parity for rotation, lighting, material, and gallery composition remains unapproved. Its equal multi-photo grid is an unapproved candidate; the user's reference shows varied size and asymmetric positions, but the exact placement rule remains to be selected. The CLI can assemble an explicit rotational page candidate; new-sketch finished-page validation remains pending. The selected runtime is now packaged inside the skill and can run without docs/artifacts. `run.py preflight --release` still blocks on pending full-page parity, general multi-photo layout and E2E; the historical full-page-study remains comparison evidence only.

The selected hero plus smaller process-photo composition is supported by the internal gallery component; general multiple-photo placement is a separate pending decision. `selection.json` maps each adopted requirement to its active consumer or explicit pending stage. Runtime code and selected values are locked together by `runtime-lock.json`.

## Integration verification (2026-10-16)

- The copied-package runtime suite passes all seven cases without repository scripts or local docs: selected single/multiple CAD (six SVG hashes), snapshot restoration, role-checked gallery, runtime drift rejection, handled solid/STEP, and P1 evidence/question handling.
- Internal handled motion regeneration matches all 12 selected output files byte-for-byte; its browser gate passes four viewports at six progress points.
- The selected actual/process gallery component matches the reference screenshots pixel-for-pixel on desktop/mobile; pointer enlargement and lightbox/Escape pass. These checks establish component preservation, not full-page approval.
- Local comparison reports: `.poc/ceramic-integration-motion/browser-review/report.json` and `.poc/ceramic-integration-gallery/browser-parity/report.json`. Tests live in this skill; local reports and source studies remain ignored.

## Execution state contract

The current executable stages are CAD (including rotational and handled solids), handled motion preview, and the gallery component. They retain their existing generators. Rotational page assembly is available as an explicit browser-gated candidate; see the page review section below. These coarse execution boundaries do not claim implementation of every design stage 00–11.

`pipeline-state.json` keeps its existing schema version and evidence fields, with additive `stageContractVersion: 1` and `stages` fields on the next normal write. Each stage declares inputs, outputs, dependencies, completion conditions and a status/reason. `status PROJECT` derives fresh status from recorded and current hashes without writing files; old projects need no eager migration. Stored stage status is a snapshot, not a substitute for this check. `complete` means recorded stage artifacts match, not user visual approval or a freshly repeated geometry/browser test; use `verify` for the existing geometry checks.

- CAD changes affect CAD → motion → future page. The existing CAD builder invalidates the old motion preview; the independent gallery remains intact.
- Motion changes affect motion → future page.
- Photo changes affect gallery → future page. Gallery generation no longer requires CAD readiness and never invokes the CAD builder. Empty reviewed photo input is a completed omitted gallery, distinct from missing photo input.
- `status PROJECT --changed cad|motion|gallery` reports that transitive scope without regenerating or deleting anything. Stale inputs/outputs and blocked inputs are reported separately from unsupported page assembly.
- Exact snapshots/rollback remain unchanged. Geometry/material/drawing changes use the selective scheduler below. Page dependency drift is detected; automatic page rebuilding remains future work.

### Selective CAD rebuild

`status PROJECT --config FILE` previews the build plan without importing inputs. `resume --config` and `revise --config` execute that same plan. Recorded `cad.buildInputs` separates geometry source hashes (profile/dimensions/handle), material source hashes, drawing configuration, and runtime version. `lastBuildPlan` records the actions taken.

- Identical inputs and intact outputs: verify and reuse CAD; preserve motion and gallery.
- Material/drawing-only change: rebuild technical sheets, reuse rotational/handled STEP/GLB bytes, recompute CAD-to-wire placement metadata. Motion is invalidated because it embeds the sheet/material. Preserve its reviewed input in state and automatically run a new browser-gated build.
- Geometry/runtime change or changed CAD outputs: rebuild the sheet and supported solids. Legacy projects without fingerprints get one conservative full build.
- Photo updates remain independent. Changed reviewed provenance in geometry files conservatively rebuilds geometry, even if dimensions look unchanged.

This scheduler handles supported CAD consumers and automatically rebuilds an existing reviewed motion preview after invalidation. Rotational page assembly is an explicit candidate command; automatic page scheduling remains pending. A material update can affect drawing labels as well as appearance, so it cannot skip the sheet.

### Automatic motion and recovery

After a CAD build, the router reuses `reviewedMotionInput` only when it already exists. Missing motion input is never invented. Both explicit `motion-preview` and automatic rebuild use `build_motion`: build in staging, run the existing four-viewport/24-scene browser gate, then publish. A completed unchanged preview is not regenerated.

`motionJob` records running/complete/failed independently of CAD readiness. On failure, the reviewed input and valid CAD remain available; the command exits with an error and `verify` rejects an incomplete motion job. `resume PROJECT` retries once per invocation without rebuilding unchanged CAD. An explicit replacement keeps the previous preview until the new browser gate passes. `status` reports the latest requested job failure even when an older preview survives. Snapshots preserve the state before automatic motion work. These gates establish technical preview validity, not user visual approval.

## Decision-linked verification

Every selection decision carries `verification.suites` and `verification.scope`. Missing mappings, unknown suites and missing consumers fail validation. Decisions without automated coverage must give a pending reason. `run.py check-decisions` runs nine suites and writes `.poc/decision-verification/report.json` by default. Use the locked Python environment and Docker; JavaScript suites use the image-pinned Node. The report records implementation state separately from test results, exact test/runtime-lock hashes, suite logs, and unverified scope. Checks changing during a run invalidate that run.

The suite covers generated CAD fixture equality and contracts, P1 evidence, solid roundtrip, rollback, stage/rebuild behavior, motion recovery, source-photo EXIF removal, axis pose/group rotations, background/glaze functions and shrinkage. A deliberately frozen body-spin implementation must fail the behavioral axis test even without a hash check. This is representative regression detection, not proof against every possible defect.

Browser evidence is separate: `check-motion.cjs` runs through the motion command; `tests/check-gallery-parity.cjs` compares selected desktop/mobile pages and checks actual image loading, frame limits, smaller asymmetric process placement, final viewport height, pointer enlargement and lightbox behavior. The decision runner does not silently reuse old browser reports as fresh success. Its gallery result covers generated markup/roles, while rendering requires the browser check. Full-page framing/composition, general multi-photo placement, assembled photo handoff and new-project evaluation remain explicitly unverified by this runner.

## Scatter review candidate

`gallery_layout.py` separates presentation from photo roles. Legacy list input keeps the selected hero/process layout. Explicit `layout.mode=scatter` supports 2–8 photos, stable seed, bounded varied sizes and asymmetric positions, with separate desktop/mobile placement values in the generated manifest. Roles/statuses and source metadata are preserved independently. The public component preview is generated by the same gallery command. This is a technically checked candidate, not visual adoption or full-page assembly. The selected two-photo comparison must continue passing pixel parity. General multiple-photo visual adoption remains pending.

## Reproducible execution environment

The verified platform is Linux x86_64, Python 3.14.3. Other platforms/Python versions are not yet verified. `environment.json` pins the browser image by digest (not a moving tag), Node 24.19.0, Puppeteer 25.9.0 and Chrome 152.0.7977.54. Python's 58 resolved dependencies are in `requirements-lock.txt`; npm transitive versions and integrity values are in `package-lock.json`. These files are included in the runtime lock.

From the skill directory, run `python3 scripts/run.py environment --setup` with the required Python version and Docker available. Setup creates `.venv` inside the skill, installs the Python lock, pulls the exact browser image, and runs `npm ci` inside that image. It does not install global Python/Node packages. Then use `.venv/bin/python scripts/run.py environment` to check Python package versions, direct JS dependency versions and image availability. Setup needs package-registry access; normal browser and JavaScript checks use `--pull=never` and `--network=none`.

Browser checks mount the workspace and the skill, start Vite inside the same container as Chrome, use a private loopback port, and put caches/configuration in container `/tmp`. The skill is mounted read-only. Existing host port 5173, repository node_modules and host Chrome cache are not used. The browser runner checks its Node/Puppeteer/Chrome versions before inspecting a page. Motion reports record the exact environment. JS behavior suites and the shrinkage CLI also use the pinned image's Node.

`tests/check_portable_browser.py --preview <generated-motion-folder> --report <local-report.json>` copies the skill and a motion output outside the repository, performs fresh `npm ci` there, and runs the same browser gate without host services. Python portability is exercised by `check-decisions` in a separate fresh virtual environment. This tests folder/environment independence on the supported platform, not cross-platform rendering equivalence. Do not regenerate visual baselines just because tooling changes.

## Full-page prerequisite: source-derived rotational solids

`new/resume/revise` now generate rotational STEP/GLB under `cad/solid/<part-id>/` from the same profile/dimension input as the sheet. The existing solid exporter also continues handling the mug; no historical publisher or prebuilt GLB is required. Each part uses its own `frontBox`, including multiple projects. `verify` re-creates source geometry and checks STEP volume/bounds, GLB bounds, hashes and per-part placement. Drawing/material-only rebuilds retain the model bytes. Older CAD-only snapshots remain verifiable; their next rebuild adds solids.

The rotational model uses the reviewed piecewise linear outer profile, radial wall offset and a flat cavity floor exactly at explicit `baseThickness` (interpolated between profile samples). Missing/invalid thickness fails. Source uncertainty remains attached by hashes; output is `provisional-geometry-preview-not-for-making`. This does not adopt new surface appearance or replace selected moon/bowl scene assets. Whole-page motion, wire rendering, material and visual parity remain pending. The next integration must consume these generated solids and current gallery output, preserving the selected framing and handoff gates.

## Rotational page review

`page PROJECT --scene FILE` connects CAD → CAD-derived wire → clay → glaze → the existing gallery component for one/two rotational parts. It reads the project's generated GLB and CAD source profiles, not historical model assets. The internal page renderer is a candidate adapted from the assembly study; historical camera, axis and appearance tuning are not adopted defaults. The accepted single framing, common axis/glaze functions and existing gallery markup are consumed directly. The selected baseline pages remain unchanged.

Scene JSON requires `schemaVersion: 1`, `status: reviewed-provisional`, `provenance`, a complete `motion` object and ordered `parts` matching CAD IDs. Each part has explicit `motion` (including provenance, at least one body and axis turn) and `glazePreview` colours, accent settings and appearance provenance. See `tests/fixtures/single/scene.json` and `multiple/scene.json` for **test-only** examples, not default project values. Unknown colours remain provisional. Page photo count/layout come exclusively from the project's gallery output; explicit scatter keeps its candidate status.

The command checks current CAD/gallery, snapshots, generates in staging, runs four browser layouts, and only then publishes `page-review/`. Failed requests retain the previous output and record `pageJob: failed`; rerun `page --scene` after correction. Page state tracks CAD/gallery/runtime/output hashes and preserves the explicit scene input. `status` reports stale output when dependencies change; `verify` rejects it. Full-page motion input is independent of the handled `motion-preview` stage. Automatic downstream page rebuild, handled-page integration, reduced-motion/loading-failure behavior, comparison with adopted full-scene baselines and new-project E2E are still pending.

The browser gate checks CAD containment, minimum single wire occupancy, 3D clipping, glaze progress, last-gallery entry after scene exit, image loading, lightbox/Escape and reverse scroll. This is technical candidate evidence, not visual adoption or release approval.
