# JOMUL sketch-to-page pipeline and decision status

Use this as the maintained skill contract for the whole intended workflow. The current CLI implements only the supported subset below. Local design evidence lives in `docs/make-skill/`; that directory is excluded from Git, so this reference must carry the decisions needed to run and extend the skill without silently substituting an old PoC.

## V1 scope freeze — 2026-10-18

User instruction: “첫 버전 범위를 고정하고 마감 검증으로 넘어가자.”
The implementation at `300858e` is the feature ceiling for v1. During closure,
change code only to correct defects in this scope or implement release verification;
new capability requests go to the deferred list until explicitly reprioritized.
This freezes scope, not visual approval or a claim of release readiness.

| Included in v1 closure | Boundary |
| --- | --- |
| Reviewed input and project lifecycle | Common entrypoint, archived sources, revise/resume/verify/rollback; agent reviews the sketch and unresolved inputs. |
| Rotational single/multiple and single handled pages | List-driven CAD and CAD→wire→clay→glaze→photo page body; part-count performance is only measured at tested counts. |
| Homogeneous feature-solid single/multiple pages | Supported primitive/revolve/loft union/cut; uniform hollow offset with one planar opening; reviewed single-solid STEP import. |
| Materials | Existing rotational coating contracts; feature one full coat or exactly two reviewed coats/height regions. Imported STEP supports one full coat only. |
| Composition | Existing upright plate nesting and gentle staggered drop; reversible scroll. No physical fall simulation. |
| Photos | Existing zero/one/multiple photo paths; seeded scatter sizes/positions are user-adopted. |

Deferred, retained as uncompleted requests: mixed rotational/handled/feature
projects; shared instances and CAD groups; target-rotation assembly; STL/GLB
import and imported-model partial-coating surface identity. Arbitrary sculpting,
more-than-two feature coats, manufacturing certification and host-site publication
are outside v1. The generated page is the project body; host navigation/listing
and deployment remain external responsibilities.

Closure order:
1. Run package/decision regression checks against one unchanged runtime.
2. Feature CAD/wire, corrected landing and scatter sizes/positions are adopted (2026-10-18); preserve the scoped decisions and exact reviewed outputs.
3. Run unused reviewed input through single and multiple E2E. One multi-object
   sketch may supply both cases; record that they share a source. Existing plates,
   temporary knights and the high-difficulty knight image are development data.
4. Run the implemented release evidence gate: bind runtime, inputs, immutable output
   revisions, browser reports and real visual decisions; reject missing/stale/failed
   evidence. Emptying `selection.pending` alone must never certify a release.

Package/regression success is technical evidence only. `preflight --release`
remains blocked until closing evidence exists and the gate consumes it. Do not
restart completed count-generalization, plate nesting or knight feasibility work.

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
| 03 CAD shape | Confirmed geometry → STEP/mesh/profile from one source | Rotational/handled part-list CAD inputs generate source-derived STEP/GLB with roundtrip/bounds checks. Reviewed solid feature JSON supports revolve/loft/box/sphere and union/cut; arbitrary asymmetric production remains unsupported. Part-count validation is separate from shape support. |
| 04 Drawing and wire | Same CAD/profile → one technical sheet, part `frontBox`, CAD-sourced 3D wire | Adopted style: white, borderless, technical dense, front/plan/section/isometric/details/dimensions; English except clay/glaze names. `multiple` parts share one sheet and retain stable IDs. Do not use raw GLB tessellation as the intended wire drawing. |
| 05 Material | Verified clay/glaze evidence and CAD mesh → expected material/render | Separate clay and glaze states; unknown fired color or gloss stays provisional. Reusing a GLB does not prove material parity. |
| 06 Web 3D | Same shape/material → GLB and load/units/bounds check | CAD mm becomes web metres; inspect side/rear/handle joins. Single/multiple rotational and feature-solid page candidates, single handled pages, plus handled/feature motion previews are supported; general release remains pending. |
| 07 Real photos | `actual[]`, `process[]`, target association, order → metadata-safe web copies and role/order manifest | Keep cover, final-fired, and process roles distinct. A process photo may appear in the last gallery. Never duplicate one source as distinct final photos to claim real multi-photo validation. |
| 08 Page assembly | Reviewed sheet, wire, GLB, motion, photos, selected visual profile → CAD→wire→clay→glaze→final gallery | Preserve the selected whole-scene CAD placement/cropping. No visible page narration, title, caption, badge, progress line, or footer. Photo exists only in the final 100vh gallery after 3D exits; no photo-only scroll segment. The selected moon camera/framing stays fixed; new wide vessels use the shared viewer’s bounded fit. Equal-grid photo placement is rejected; explicit seeded scatter sizes/positions are user-adopted. |
| 09 Verify | Generated outputs and the same selected contract → hashes, geometry checks, browser captures and visual review | Compare the same scroll progress and viewport with the selected moon/bowl baseline; check object occupancy as well as clipping. Automated passing is not user visual approval. |
| 10 Feedback | User correction, prior state → minimal affected rebuild and exact rollback path | Record adopted feedback in the input/profile and consumer first, then regenerate and verify. Do not reverse-engineer a rollback from remembered values. |
| 11 Package/E2E | All stages and new project input → reusable skill release | Still incomplete. Moon is development, mug is single validation, bowls are multiple validation; reserve chess for final evaluation. |

`single` and `multiple` use one workflow selected by the number of finished vessel instances. A handle is a subcomponent of one vessel, not another `part`. Each independent part keeps its own evidence, CAD, material, and ID. Shared model-instance input is deferred beyond v1. Do not copy one part's uncertain values or one photograph to another.

## Selected visual baselines and current limits

`python3 /path/to/ceramic-cad-to-3d/scripts/run.py preflight` checks the selected moon and bowl files and CAD reference artifacts named in `assets/accepted-profile.json`. The skill executes only `scripts/run.py`; the old repository PoC dispatcher is historical development tooling. The accepted moon full-page baseline is `/.poc/moon-jar-gallery-type-study/`; the bowl photo handoff baseline is `/.poc/bowl-set-configured-photo-handoff/`. Both are local reference fixtures, not new-project E2E output.

The registered `full-page-study` joins existing reviewed assets for single/multiple with 0/1/3 photo cases. Its single-moon wire size now uses model-bound camera fitting and a browser occupancy gate. Full scene parity for rotation, lighting, material, and gallery composition remains unapproved. Its equal multi-photo grid is an unapproved candidate; the user's reference shows varied size and asymmetric positions, but the exact placement rule remains to be selected. The earlier rotational page candidate was withdrawn; the CLI can replay selected whole-page inputs, while new-sketch finished-page generation remains pending. The selected runtime is now packaged inside the skill and can run without docs/artifacts. `run.py preflight --release` still blocks on pending full-page parity, general multi-photo layout and E2E; the historical full-page-study remains comparison evidence only.

The selected hero plus smaller process-photo composition is supported by the internal gallery component; general multiple-photo placement is a separate pending decision. `selection.json` maps each adopted requirement to its active consumer or explicit pending stage. Runtime code and selected values are locked together by `runtime-lock.json`.

## Integration verification (2026-10-16)

- The copied-package runtime suite passes all seven cases without repository scripts or local docs: selected single/multiple CAD (six SVG hashes), snapshot restoration, role-checked gallery, runtime drift rejection, handled solid/STEP, and P1 evidence/question handling.
- Internal handled motion regeneration matches all 12 selected output files byte-for-byte; its browser gate passes four viewports at six progress points.
- The selected actual/process gallery component matches the reference screenshots pixel-for-pixel on desktop/mobile; pointer enlargement and lightbox/Escape pass. These checks establish component preservation, not full-page approval.
- Local comparison reports: `.poc/ceramic-integration-motion/browser-review/report.json` and `.poc/ceramic-integration-gallery/browser-parity/report.json`. Tests live in this skill; local reports and source studies remain ignored.

## Execution state contract

The current executable stages include rotational/handled/feature CAD, handled/feature motion preview, the gallery component and the supported page candidates listed in the v1 scope above. They retain their shared generators. The previous rotational page candidate was withdrawn after the user reconfirmed the entire selected scene. Separate `selected-page` commands generate selected-input replay and new single/multiple rotational and single handled page candidates; registered `page-review --review` inputs now call that same generator for project-page rebuild/recovery. These coarse execution boundaries do not claim implementation of every design stage 00–11.

`pipeline-state.json` keeps its existing schema version and evidence fields, with additive `stageContractVersion: 1` and `stages` fields on the next normal write. Each stage declares inputs, outputs, dependencies, completion conditions and a status/reason. `status PROJECT` derives fresh status from recorded and current hashes without writing files; old projects need no eager migration. Stored stage status is a snapshot, not a substitute for this check. `complete` means recorded stage artifacts match, not user visual approval or a freshly repeated geometry/browser test; use `verify` for the existing geometry checks.

- CAD changes affect CAD → motion → future page. The existing CAD builder invalidates the old motion preview; the independent gallery remains intact.
- Motion changes affect motion → future page.
- Photo changes affect gallery → future page. Gallery generation no longer requires CAD readiness and never invokes the CAD builder. Empty reviewed photo input is a completed omitted gallery, distinct from missing photo input.
- `status PROJECT --changed cad|motion|gallery` reports that transitive scope without regenerating or deleting anything. Stale inputs/outputs and blocked inputs are reported separately from unsupported page assembly.
- Exact snapshots/rollback remain unchanged. Geometry/material/drawing changes use the selective scheduler below. Registered selected-page reviews detect dependency drift and rebuild through the lifecycle below.

### Selective CAD rebuild

`status PROJECT --config FILE` previews the build plan without importing inputs. `resume --config` and `revise --config` execute that same plan. Recorded `cad.buildInputs` separates geometry source hashes (profile/dimensions/handle), material source hashes, drawing configuration, and runtime version. `lastBuildPlan` records the actions taken.

- Identical inputs and intact outputs: verify and reuse CAD; preserve motion and gallery.
- Material/drawing-only change: rebuild technical sheets, reuse rotational/handled STEP/GLB bytes, recompute CAD-to-wire placement metadata. Motion is invalidated because it embeds the sheet/material. Preserve its reviewed input in state and automatically run a new browser-gated build.
- Geometry/runtime change or changed CAD outputs: rebuild the sheet and supported solids. Legacy projects without fingerprints get one conservative full build.
- Photo updates remain independent. Changed reviewed provenance in geometry files conservatively rebuilds geometry, even if dimensions look unchanged.

This scheduler handles supported CAD consumers and automatically rebuilds an existing reviewed motion preview after invalidation. The withdrawn scene renderer remains blocked; registered supported page reviews rebuild through selected-page. A material update can affect drawing labels as well as appearance, so it cannot skip the sheet.

### Automatic motion and recovery

After a CAD build, the router reuses `reviewedMotionInput` only when it already exists. Missing motion input is never invented. Both explicit `motion-preview` and automatic rebuild use `build_motion`: build in staging, run the existing four-viewport/24-scene browser gate, then publish. A completed unchanged preview is not regenerated.

`motionJob` records running/complete/failed independently of CAD readiness. On failure, the reviewed input and valid CAD remain available; the command exits with an error and `verify` rejects an incomplete motion job. `resume PROJECT` retries once per invocation without rebuilding unchanged CAD. An explicit replacement keeps the previous preview until the new browser gate passes. `status` reports the latest requested job failure even when an older preview survives. Snapshots preserve the state before automatic motion work. These gates establish technical preview validity, not user visual approval.

## Decision-linked verification

Every selection decision carries `verification.suites` and `verification.scope`. Missing mappings, unknown suites and missing consumers fail validation. Decisions without automated coverage must give a pending reason. `run.py check-decisions` runs the linked suites and writes `.poc/decision-verification/report.json` by default. Use the locked Python environment and Docker; JavaScript suites use the image-pinned Node. The report records implementation state separately from test results, exact test/runtime-lock hashes, suite logs, and unverified scope. Checks changing during a run invalidate that run.

The suite covers generated CAD fixture equality and contracts, P1 evidence, solid roundtrip, rollback, stage/rebuild behavior, motion recovery, source-photo EXIF removal, axis pose/group rotations, background/glaze functions and shrinkage. A deliberately frozen body-spin implementation must fail the behavioral axis test even without a hash check. This is representative regression detection, not proof against every possible defect.

Browser evidence is separate: `check-motion.cjs` runs through the motion command; `tests/check-gallery-parity.cjs` compares selected desktop/mobile pages and checks actual image loading, frame limits, smaller asymmetric process placement, final viewport height, pointer enlargement and lightbox behavior. The decision runner does not silently reuse old browser reports as fresh success. Its gallery result covers generated markup/roles, while rendering requires the browser check. Full-page framing/composition, general multi-photo placement, assembled photo handoff and new-project evaluation remain explicitly unverified by this runner.

## Adopted scatter placement

`gallery_layout.py` separates presentation from photo roles. Legacy list input keeps the selected hero/process layout. Explicit `layout.mode=scatter` supports 2–8 photos, stable seed, bounded varied sizes and asymmetric positions, with separate desktop/mobile placement values in the generated manifest. Roles/statuses and source metadata are preserved independently. The public component preview is generated by the same gallery command. The user adopted the sizes/positions on 2026-10-18. This is gallery placement approval, not approval of every project page. The selected two-photo comparison must continue passing pixel parity.

## Reproducible execution environment

The verified platform is Linux x86_64, Python 3.14.3. Other platforms/Python versions are not yet verified. `environment.json` pins the browser image by digest (not a moving tag), Node 24.19.0, Puppeteer 25.9.0 and Chrome 152.0.7977.54. Python's 60 resolved dependencies are in `requirements-lock.txt`; npm transitive versions and integrity values are in `package-lock.json`. These files are included in the runtime lock.

From the skill directory, run `python3 scripts/run.py environment --setup` with the required Python version and Docker available. Setup creates `.venv` inside the skill, installs the Python lock, pulls the exact browser image, and runs `npm ci` inside that image. It does not install global Python/Node packages. Then use `.venv/bin/python scripts/run.py environment` to check Python package versions, direct JS dependency versions and image availability. Setup needs package-registry access; normal browser and JavaScript checks use `--pull=never` and `--network=none`.

Browser checks mount the workspace and the skill, start Vite inside the same container as Chrome, use a private loopback port, and put caches/configuration in container `/tmp`. The skill is mounted read-only. Existing host port 5173, repository node_modules and host Chrome cache are not used. The browser runner checks its Node/Puppeteer/Chrome versions before inspecting a page. Motion reports record the exact environment. JS behavior suites and the shrinkage CLI also use the pinned image's Node.

`tests/check_portable_browser.py --preview <generated-motion-folder> --report <local-report.json>` copies the skill and a motion output outside the repository, performs fresh `npm ci` there, and runs the same browser gate without host services. Python portability is exercised by `check-decisions` in a separate fresh virtual environment. This tests folder/environment independence on the supported platform, not cross-platform rendering equivalence. Do not regenerate visual baselines just because tooling changes.

## Full-page prerequisite: source-derived rotational solids

`new/resume/revise` now generate rotational STEP/GLB under `cad/solid/<part-id>/` from the same profile/dimension input as the sheet. The existing solid exporter also continues handling the mug; no historical publisher or prebuilt GLB is required. Each part uses its own `frontBox`, including multiple projects. `verify` re-creates source geometry and checks STEP volume/bounds, GLB bounds, hashes and per-part placement. Drawing/material-only rebuilds retain the model bytes. Older CAD-only snapshots remain verifiable; their next rebuild adds solids.

The rotational model uses the reviewed piecewise linear outer profile, radial wall offset and a flat cavity floor exactly at explicit `baseThickness` (interpolated between profile samples). Missing/invalid thickness fails. Source uncertainty remains attached by hashes; output is `provisional-geometry-preview-not-for-making`. This does not adopt new surface appearance or replace selected moon/bowl scene assets. Whole-page motion, wire rendering, material and visual parity remain pending. The next integration must consume these generated solids and current gallery output, preserving the selected framing and handoff gates.

## Selected whole-page restoration

User confirmation on 2026-10-17 makes `http://localhost:5173/.poc/ceramic-integration-gallery/index.html#gallery` authoritative for **the whole page**, including CAD→3D. Earlier integration had verified only the gallery and incorrectly used the unrelated full-page-study renderer for the earlier stages. That candidate renderer is withdrawn and removed from the active assets; `page --scene` fails with `CERAMIC_PAGE_BASELINE_REQUIRED`.

`assets/selected-page.json` pins the actual referenced HTML, JS and required input assets. `assets/selected-page/` contains only that selected version. `selected-page --output DIR` verifies the hashes, stages an exact replay, and compares four viewport sizes at 12 timeline positions (CAD, detached front, wire, turn, clay, glaze, scene exit, gallery and reverse scroll). Scene state and rendered PNG bytes must match before publication. The selected snapshot deliberately preserves its own CAD display/camera/wire/timing/material values; earlier candidate `singleFraming` and sheet-fit approximations must not override this explicit project selection.

Without `--cad-project`, this command preserves the original PNG drawing and reviewed GLB/material, so it is **input replay rather than CAD generation**. The compatible CAD regeneration mode is described below. New geometry generation must first reproduce the selected CAD extraction, model material and scene appearance; never substitute a new SVG/mesh and call a function-only browser check preservation. The source snapshots are not manufacturing confirmations. Existing CAD, motion and gallery commands remain independently available. Release remains blocked on general generation, handled/multiple adaptation and new-project E2E.

### CAD front and wire bridge

`selected-page --output DIR --cad-project PROJECT_DIR` verifies the archived CAD inputs and outputs, regenerates the selected sheet PNG/PDF and front SVG from the CAD radius/height samples, and supplies those samples to the unchanged selected wire renderer. It requires the same 48 full-scene comparisons. `cad-bridge.json` records source hashes and explicitly distinguishes generated sheet/front/profile/surface from retained motion and photos. Changed geometry, material labels/finish or multiple/handled parts fail before publication because pairing those with reference assets would be incorrect. This restriction is temporary until new-project layouts and materials are verified; it is not general new-CAD support.

The selected sheet renderer uses the packaged Gowun Batang and Outfit fonts (with OFL licenses), ReportLab 5.0.1 and PyMuPDF 1.28.2. It rebuilds the 1190×842 drawing and rasterizes at 1.4×; the compatible moon fixture reproduces the selected PNG bytes and front box exactly. Only the selected drawing functions were retained, using the existing shared isometric geometry. The general technical-dense CAD sheets remain unchanged.


### Selected surface regeneration

The compatible moon bridge regenerates STL and GLB from the reviewed CAD profile using the shared rotational-solid function with an explicit `selected-visual-sampled` floor policy. This preserves the selected model’s sampled inner ring (8.25 mm for the moon) connected to its nominal 8 mm centre floor. Ordinary CAD export still defaults to the exact, flat 8 mm floor; its geometry is not silently replaced. The exact-floor surface with the same PBR material failed pixel comparison at desktop time 650, so it was not published as the selected visual output.

`selected_surface.py` invokes `selected_surface_blender.py` with the official Blender archive pinned by SHA256 in `assets/selected-surface.json`, inside the existing digest-pinned browser container, offline. Blender 4.5.11 imports the entire STL into one mesh, smooths polygon normals, converts the glaze colour to linear RGB, and exports roughness .66 / clearcoat .08. The selected fixture GLB must match the reference bytes before whole-scene publication; it is generated, not copied. Surface inputs, STL and Blender report remain in `surface-generation/`. `environment --setup-blender` installs Blender and three checksum-pinned Debian GL packages under ignored `.tools/`; full `environment --setup` includes it. curl and dpkg-deb are required on the supported Linux x86_64 host. Both the archive and installed files are verified; no host Blender or private Blender image is used. Multiple/handled page review contracts are below; registered automatic page regeneration is described below; final real-project E2E remains pending.


### New single-page review

`selected-page --cad-project PROJECT_DIR --review REVIEW.json --output UNUSED_DIR` uses the same selected viewer. It verifies project CAD, regenerates the adaptive sheet/front/profile/GLB, applies explicit motion and surface inputs, and uses `photos.build_gallery` for the supplied photo input. The original moon photos and labels are removed. New input changes are not compared for pixel equality with a differently shaped moon; the shared runtime viewer is integrity-checked, and the four-viewport/12-point gate checks actual mesh projection, CAD/model height, timeline states, loaded photos, final handoff, lightbox and reverse scroll. Outputs remain `new-input-review-candidate`. The default command without `--review` keeps exact selected-input parity requirements.

The review JSON requires `schemaVersion: 1`, `status: reviewed-provisional`, nonempty `provenance`, `motion: {tiltDirection, tiltDegrees, storyHeightVh}`, `surface: {floorPolicy: exact, roughness, clearcoat}`, and a workspace-relative `photos` JSON path using the existing gallery input contract. Tilt is 0–30 degrees, story height 300–1500 vh, roughness/clearcoat 0–1. The supported initial geometry range is height 30–300 mm and diameter/height 0.5–3. Material names must fit the sheet (1–12 characters), colours must be explicit hex previews, and glaze optical/finish labels must be supplied. Source dimensions must include forming-size/shrinkage fields for the sheet. An explicit empty photo list is supported: the page ends at timeline 1000 with the fully glazed vessel and completed body/axis turns, without a gallery, dialog, scene fade or extra scroll section. This is a review candidate, not an adopted new ending. A process-only image is allowed without pretending it is the finished new work. Source hashes and generated artifact hashes are recorded in `cad-bridge.json`. New geometry uses the exact-floor policy; the sampled-floor policy remains only for exact selected-moon reproduction.

The single active page renderer is `assets/page-viewer.js`; `assets/selected-page/viewer.js` remains immutable baseline evidence only. Both selected replay and new-input generation publish the shared renderer. Its photo branch must retain four-viewport/12-point exact pixel and scene parity with the selected snapshot. The empty-photo branch uses the same CAD/wire/clay/glaze timeline through 1000 and skips only the subsequent photo exit. `check-new-page.cjs` verifies the real document bottom, visible fully glazed model, completed turns, absence of photos/dialog, and reverse scroll.

Wide single inputs (diameter greater than height) use a 90%-viewport-width cap for the detached front and a CAD-bound enclosing sphere for camera distance, covering body/tilt/orbit poses. Narrow selected inputs retain the original framing arithmetic. This is a new-input review rule; it does not replace selected moon or bowl presentation approval. For these wide inputs, glaze clipping also spans the rotation bounds so a tilted top cannot remain clay-coloured at the endpoint. The browser gate projects actual vertices through the runtime camera rather than assuming the old camera distance, and checks that the final glaze plane covers the transformed surface vertices.


### Two-part page review

This existing section/anchor now covers multiple-part lists. Part IDs/order, per-part positions and material evidence are mandatory for every element; all adjacent final positions must preserve reviewed order. The renderer already iterates the full list and frames all transformed bounds. No automatic stacking/assembly or new glaze-mask capability is implied by count generalization.

The `selected-page` entrypoint dispatches on the verified CAD composition: single uses the preserved scene, multiple rotational parts use `assets/multiple-scene.mjs` via that same viewer entrypoint. No historical publisher or withdrawn `page --scene` renderer is invoked. The multiple-part output is a review candidate, not pixel-equivalent bowl adoption. Single selected replay retains its 48-pair pixel gate.

Use the explicit scene contract illustrated in `tests/fixtures/multiple/scene.json`, adding workspace-relative `photos` (an empty list or role-verified photo input). The schema records part IDs/order, provenance, per-part entry/final positions and scales, drop delays, initial/drifting axes, body/axis turns, and ordered full/partial coating colours and placement. Current support is a list of at least two rotational parts, each with two ordered coats in the archived composition material evidence, height 30–300mm and diameter/height 0.5–3. Review base/accent names must preserve those CAD layer names/order; dropping an accent or reversing material order is rejected. Colour, partial coating region and timing remain provisional where the source says so.

The selected bowl evidence establishes rice on the left and soup on the right, initial left15°/right45° falling axes, continuously changing axes until landing, continuing body/axis turns through both bottom-up coats, rice sky-barley then left-side celadon, and soup black then partial sky-barley. Exact intermediate drift, spacing, colour and soup second-coat coverage are reviewed assumptions, not manufacturing facts. The current review camera is 32° and fits the transformed composition using the explicit framing fractions; old fixed camera position/focus fields are retained only as source provenance, not used as a second framing rule. Lighting and per-vertex partial-coating calculations come from the bowl study; these are isolated from the selected moon renderer.

`multiple_page.py` verifies current project CAD/solids and hashes each archived profile/dimension/material, sheet, photo input and source image. It consumes the single common sheet with responsive part-specific front boxes, derives separate fronts/wires from those profiles, and runs the existing exact-floor CAD→STL→Blender surface exporter per vessel. Each original ordered material record accompanies the result. The shared glaze/axis helpers preserve falling/coating continuity; `photos.build_gallery` supplies the current final-gallery component. Empty photos end with the settled glazed composition; photos follow the scene exit without an additional photo-only scroll interval. No visible title, narration or footer is added.

Publication requires `check-multiple-page.cjs`: four viewports ×12 points, including reverse scroll, actual transformed-vertex clipping, part height/order, settling without overlap, both coating phases and continued rotations, and the 0/1-photo ending/lightbox branch. The browser gate establishes technical behaviour for the tested inputs, not whole-scene pixel parity with a prior bowl page. Registered review inputs use the project status/retry scheduling described below; standalone selected-page outputs still require explicit regeneration.

### Handled page review

`selected-page --cad-project PROJECT --review REVIEW.json --output UNUSED_DIR` also accepts one verified `handled-vessel`. It consumes the complete archived CAD solid (all GLB meshes), CAD sheet/front boxes and exact body/handle wire guides. It does not regenerate a rotational body as a substitute for the handle. The shared `assets/motion/handled-scene.mjs` also drives `motion-preview`; its CAD-to-clay orthographic framing and vessel-axis pivot remain the existing handled review. This is a new full-page candidate, not pixel-equivalent to the selected moon page.

Use schemaVersion 1, status `reviewed-provisional`, provenance and workspace-relative `photos` (explicit empty list allowed). `motion` is the existing handled motion contract including schema/status/provenance, tiltDirection/tiltDegrees/bodySpinDegrees/axisPrecessionDegrees, plus `storyHeightVh` (300–1500). `surface` requires `clayName`/`glazeName` matching the archived CAD material exactly, `clayHex`/`glazeHex`, `roughness`/`clearcoat` (0–1), and provenance. Only one glaze layer is supported. Do not infer a fired colour from a bisque photo; provisional colour/gloss must be identified in the input.

The existing CAD→wire→clay sequence occupies the first 72% of the story. Bottom-up glaze then covers every mesh, including the handle; body and axis each continue another full turn while tilt returns upright. Framing fits transformed complete solid bounds. Empty photos end at fully glazed 100%; photo-bearing pages exit through 110%, then use the current gallery. Timing and new glaze appearance are provisional. `tests/check-handled-page.cjs` checks four viewports × twelve points, including front/solid alignment, intermediate handle bounds, complete coating, both continuing rotations, 0/1-photo endings and reverse scrolling. `scripts/check-motion.cjs` separately checks the unchanged motion preview. Retain provisional handle section/depth and the original P1 unanswered questions; successful page generation never promotes these to manufacturing confirmation.

### Registered page lifecycle

`page-review PROJECT --review FILE` registers explicit single rotational, two-part rotational, or handled review input and calls the existing `selected_page.restore` implementation. No new renderer is involved. The review object is stored as `reviewedPageInput`; source photo-list/image paths stay workspace-relative and are hashed from `cad-bridge.json`. Keep those source files available. A separate gallery component is not required to build a page; `gallery --photos` on an already registered project updates its photo-list reference and rebuilds the page after the gallery succeeds.

Page output is immutable under `PROJECT/page-revisions/<id>/`; `pageReview.output` is the current published local revision. Only the atomic pipeline-state save selects a successful revision. The previous output is never removed during generation. `pageJob` records running/failed/complete and the target; failed generation or a failed state commit retains the old output pointer and requested review. An interrupted running job is retried once by `resume`, using a new unused directory. It never promotes partial or orphan outputs; these can remain on disk for inspection. This is local page generation, not site deployment or whole-skill release.

`status` is read-only and checks current CAD readiness, reviewed input, source hashes, runtime lock and output hashes. `resume` rebuilds stale or failed registered pages after motion recovery; unchanged complete pages are reused. CAD changes through resume/revise also schedule the page after CAD succeeds. Gallery photo updates schedule the registered page without rebuilding CAD. Changing a source image without updating its reviewed SHA correctly fails validation; do not silently accept new bytes. Snapshots/rollback preserve project-local revision directories and state, but do not restore external photo sources.

Legacy scene records are reported withdrawn/stale and never automatically regenerated. Use an explicit supported `page-review --review` to replace them. Tests in `test_page_scheduler.py` simulate the renderer/browser boundary to cover failure/retry, state-commit failure, interruption, stale sources/runtime/output, no-op reuse and CLI resume/gallery dispatch. Actual browser gates remain required for real generated outputs.


## Explicit layered vessels and optional assembly

Opt in with `renderer: layered-vessels` in the existing `page-review` / `selected-page --review` scene review schema. Both a single rotational part and a multiple list use the same maintained renderer. Existing single-moon, handled and two-coat spray modes keep their prior dispatch and defaults. This mode accepts height30–300mm and diameter/height0.5–4; browser framing verification remains mandatory. Optional `motion.camera.elevationDegrees` (0–35) reveals the interior; transformed bounds constrain the camera.

Each part adds `coatings`:

- `status: reviewed-provisional`, `provenance`, `roughness` in0–1.
- `layers`: exactly two ordered records `{name, region, previewHex}` whose names/order match archived composition material evidence. `region` is `{surface: all}` or `{surface: exterior, minHeightMm, maxHeightMm}` measured upward from the foot bottom. Exterior means proximity to the actual CAD outer profile, not camera-facing triangles. Inner walls/floor remain distinct.
- `fired: {baseHex, region, regionHex}` describes the fired appearance independently of application order. The first pass reveals the first preview colour in its own region. The second pass reveals the reviewed fired result in the second coat region. This is a qualitative visualization, not a firing/chemical simulation or a physical wet-transparent shader. Colors and boundary heights need their own provenance.
- Source `exterior-below-dashed-boundary` cannot become an all-surface coat; source `full-coat` cannot become a partial coat. Two coating time intervals must be sequential.

Optional `assembly` contains `status`, `provenance`, normalized motion `start/duration`, and `steps`. Each step has `partId`, stage-relative `start/duration`, `targetPositionMm: [x,y,z]`, `liftMm`. Include each part once; steps must be sequential. Coordinates are Y-up with the vessel foot bottom as origin, physical scale1, upright rotational vessels. Body/axis rotations finish and settle before assembly. A step lifts vertically, translates above the others, then lowers. Reverse scroll evaluates the same input without accumulated state. The assembly finishes before the photo transition; an empty photo list holds the assembled state.

The common geometry gate checks121 movement poses for desktop/mobile starting positions and0.25mm horizontal CAD slices, plus exact CAD intersections at final poses, recording `assembly-check.json`. This is sampled collision evidence, not continuous-path or manufacturing certification; explicit clearance/targets remain reviewed inputs. Browser checks separately verify all vertices in frame, both surface classes and coating order, final target positions, and photo/empty ending. Do not infer nesting from overlapping bounding boxes alone. Arbitrary rotations, dynamic physics, automated packing and nonrotational instances are outside this assembly contract.

Plate development uses user-described two glaze orders, provisional lower70% exterior-body boundaries (foot excluded), illustrative gray/black/ivory colors, and0.5mm nested clearance. The bisque photo is process evidence only. These values are input records, never shared defaults. Visual acceptance of prior CAD does not approve new glaze/assembly appearance.

### Nonrotational feature stage

`shape-build` now compiles reviewed feature JSON through the maintained entrypoint
into a connected solid STEP/GLB with source hashes and geometry checks; see the
[feature input contract](input.md#reviewed-nonrotational-feature-geometry-stage-only).
Synthetic smooth and faceted inputs exercise the same compiler. This completes
the initial solid feature compiler, not the general nonrotational project pipeline.
Part/source identity and lifecycle now use manual feature-solid configs and
geometry-ready state. Candidate CAD sheet/frontBox and BRep section-curve guides are now generated
with the project; static mapping and section geometry are checked. Single-feature material/motion/page candidates now use the existing solid renderer; review the feature-specific visual result before adopting its layout or wire density. Reviewed uniform-offset hollow construction with one extremal planar opening now uses the same compiler/lifecycle; see the feature input contract. Reviewed single-solid STEP input now uses this lifecycle; mesh import, imported partial-coating identity and manufacturing verification remain unsupported. Top-opening box/oval hollow development inputs passed single/multiple page checks (four viewports each); other hollow shapes still require scoped browser review. Supplemental `tests/check-hollow-page.cjs` checks the loaded mesh opening, inner-floor normal and wire with explicit `CERAMIC_HOLLOW_FLOOR_MM`, plus desktop/mobile screenshots. This gate is for centred top openings and is not a general cavity or minimum-wall certificate. Single-page `motion.surfaceElevationDegrees` is an optional reviewed framing input; omitted values preserve the original finish.

### Feature motion and shared defaults

Feature parts now consume the existing handled-scene/axis renderer through an
input adapter. This is per-part CAD→wire→neutral-clay motion review; single-feature whole pages can additionally consume explicit materials/glaze/photos through page-review. Homogeneous multiple feature pages now use the common multiple renderer and optional upright sequential assembly; mixed families/instances and target rotations remain pending.
Geometry-dependent state/recovery uses the existing project commands. Smooth and
offset faceted development inputs exercise actual browser alignment/framing and
reverse scroll; numerical success is not user visual adoption.

`accepted-profile.json` is the maintained defaults source, not a second config
tree. `sceneDefaults` centralizes the three renderers' principal lighting/camera
settings and the shared handled/feature transition timing; wire colour remains
`wire3d.defaultColor` with project override. Values are copied to each generated
output so a global config edit cannot silently alter old pages. Original baseline
assets remain immutable. Formula-specific constants still live with their
algorithms; this change is not a claim that every numeric literal is configurable.

### Feature layered page integration

The explicit `feature-solids` list schema now supports one or multiple parts with two reviewed coating passes, consuming the same `coatingWeights`/fired-region code as layered vessels. `feature_surface.py` derives exterior membership from source CAD rather than radial profiles; the rendered mesh is subdivided only for feature coatings. See the [input contract](input.md#feature-partial-and-two-layer-coatings) for scope, material evidence, masks and approximation limits. Old one-coat review routes remain available.

### Reviewed STEP dependencies

External STEP uses the common feature compiler with an explicit imported construction mode. Intake archives both the source model and the original review JSON; normalized input references the archived bytes. Geometry/page fingerprints include the model itself, so changed bytes cannot hide behind an unchanged wrapper JSON. Import preserves shape and uses existing CAD/wire/page adapters, not a per-project model script. See the [STEP contract](input.md#reviewed-step-input).

## Closure feedback — 2026-10-18

User adopted the existing multiple-photo sizes/positions (bounded-scatter-v1). This does not adopt feature CAD/wire or landing. The same user reported apparent re-ascent during final direct-drop landing. Keep the approved soft spin and short gaps; use a deterministic full-path camera envelope during landing so per-frame reframing cannot lift stationary/descending pieces on screen. Inspect forward/reverse desktop/mobile trajectories. Chess sketches do not exist yet; unused final evaluation input remains unavailable.

## V1 release evidence gate

Run `scripts/run.py --workspace ROOT preflight --release --evidence FILE.json`.
This read-only command verifies existing artifacts and invokes project `verify`;
it never generates pages, clears pending stages or publishes a site. It reports
`CERAMIC_RELEASE_OK` only for the frozen scope and named evaluation outputs.
Missing evidence returns `CERAMIC_RELEASE_BLOCKED` with a nonzero exit code.

The evidence JSON has `schemaVersion: 1`, `runtimeSha256` (runtime-lock.json hash),
`decisions`, `visualDecisions`, and `cases`. Every artifact reference is
`{"path":"workspace-relative/file", "sha256":"file SHA256"}`; refs must resolve
inside the workspace and match real bytes, including symlink resolution.

- `decisions`: artifact ref to a complete `check-decisions` report. All registered
  suites must pass and its runtime/test hash inventory must equal the current one.
- `visualDecisions`: artifact refs to scoped decision records. Required scopes are
  `feature-cad-wire`, `direct-drop`, `gallery-scatter`. Each record contains `scope`,
  `status: user-approved`, the user's actual `quote`, `sourceMessage` identifying
  that reply, and nonempty `outputs` artifact refs. Do not infer approval from a
  technical check, a request to continue or an approval of another scope.
- `cases`: exactly one `single` and one `multiple`, each with `mode`, `project`
  (workspace-relative project directory), `revision` (project-relative
  `page-revisions/ID`), `evaluationAttestation`, and `visualApproval` artifact refs.
  Mode must match archived config and part count. The current page must have a
  completed job, matching geometry/input/output hashes, and browser checks for
  all 12 scenes at desktop/short/mobile/mobile-short. Project geometry `verify`
  must pass. Cases use separate projects; a shared sketch is permitted.
- The evaluation attestation contains current `runtimeSha256`,
  `unusedBeforeEvaluation: true`, `reviewer`, `sourceMessage`, and a `source`
  artifact ref matching the archived sketch. This is an audited human/agent
  provenance statement, not a machine proof of historical non-use. Never label
  existing development inputs held-out; if evaluation drives code tuning, record
  that change and obtain unused input before claiming held-out success.
- Each case's visual approval contains `status: user-approved`, actual `quote`,
  `sourceMessage`, matching `project`/`revision`, and `outputFilesSha256` copied
  from that reviewed revision. Approval cannot be transferred to altered output.

Known pending stages are discharged only by this evidence; deleting pending
strings does not bypass the checks. A new unknown pending stage still blocks.
Unit fixtures for the gate are synthetic and do not count as release evidence.
Changing runtime/tests makes older decision reports stale; runtime changes also
require evaluated pages to be regenerated and reviewed. Historical approvals
remain scoped to their byte-preserved outputs.

### Pre-landing camera correction

User rejected the post-glaze camera rise in revision d6edb399b56341009949559e75ccce57. Fixing only the assembly interval was insufficient: the late camera-envelope blend also caused visible ascent. Complete that blend with initial CAD-to-3D descent, before coating; keep it fixed from glaze completion through landing. `check-direct-drop.cjs` now samples this entire interval and reverse scroll. This correction is a candidate until visually reviewed; do not record the rejection as approval.

## Adopted closure presentation — 2026-10-18

User reply: “응 이걸로 가자. 다음 작업으로 넘어가자”. Applies to the corrected CAD→wire presentation and final landing at `90-feature-assembly/page-revisions/1ba00fb8db46437ba9c318edc6250376`. Initial camera staging finishes before glazing; the camera stays fixed through final landing, preserving soft spin and short landing gaps. Earlier `d6edb399b56341009949559e75ccce57` remains rejected for pre-landing re-ascent. This accepts presentation of the reviewed output, not synthetic material/shape manufacturing facts or held-out E2E. Preserve its exact files rather than regenerating it for approval metadata changes. Scatter sizes/positions were adopted separately. New unused-input evaluation and release remain pending.

## Authorized planar-region extension

User approved “평면 유약 영역을 공통 기능으로 추가한 뒤 체스판까지 검증”. This overrides the v1 freeze only for planar glaze regions; see input.md#planar-xy-glaze-regions-feature-solids. Actual chess inputs now exercise feature development/integration and cannot be attested unused for the changed runtime. Preserve previous approved presentation and the final release evidence gate.
