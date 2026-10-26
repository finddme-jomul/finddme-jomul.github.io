# Upstream instruction adaptation and review

Pinned source: enesozturk/dimensional-drawing commit
5c457437c8c83524308aad3b7443e81adcc13153, both drawing and motion SKILL.md.
This maps instructions to ceramic work; retained vendor text is evidence, not an
instruction to use Claude artifacts or manufacture UI layers.

## Before generating

Read the reviewed CAD/profile sources. Identify units, source status, overall
dimensions, actual cut material, meaningful rim/foot/handle regions and unresolved
values. Preserve conflicts as conflicts; do not silently choose a more attractive
number. Unknown optional explanations may say [TBD]; missing required CAD input
must be resolved through intake. Do not convert an illustrative proportion into
a measured radius or thickness.

Use monochrome line weights, hidden lines and actual material hatching. Keep
ceramic clay/glaze names from user evidence; other labels are English. Use neutral
identifiers unless a name was supplied. CAD coordinates and source provenance take
precedence over reproducing an upstream example's arrangement.

Overall dimension labels W/H/D and ceramic codes refer to the mm table. Derived
dimensions keep formulas and operand certainty. Explicit radiusAnnotations refer
only to analytic STEP section-circle indices exposed in drawing-plan.cadRadii.
Do not fit circles to arbitrary splines. Numbered feature notes attach reviewed
text to an actual visible-curve anchor; notes do not certify manufacturing advice.

## Layout and review

Prefer a shared sheet for multiple parts, with per-part panels and source IDs.
Keep view/detail names and SCALE captions consistent. SVG units/mm describes
drawing coordinates, never a physical print scale. Resize and browser zoom change
screen size; readers must use table values. The upstream third-angle layout is
not implemented as a standards-certified projection arrangement here.

Use dimensionOptions to move crowded labels, then inspect screenshots at the
same desktop/mobile size as the reference. Check code-table correspondence,
number-marker correspondence, no label crossings or sheet overflow, legible
details, and actual hollow regions. Boundary tests alone do not prove readability.
The reader now uses minimum-width sheets in a native scroll region with a Fit toggle; inspect both the readable and overview modes.

## Motion

Use a deterministic render(t); geometry leads, dimensions follow, labels follow
leaders. Fade dashed paths, text and hatch; draw solid outlines before fills.
Ease camera/strokes without bounce, and use logarithmic zoom. Keep monochrome,
no audio by default, and preserve reduced-motion static access.

Inspect 0%, 10%, 25%, 43%, 55%, 75%, 90% and 100% as well as reverse seeking.
Look for popping, fill flashes, accidental clipped annotations during camera
moves, and an overloaded opening. Tests verify endpoint parity, not artistic
approval. Scroll mode drives the same normalized time and stops autonomous
playback; reverse scroll must reproduce the same frame. Finishing restores the
original static drawing.

## Deliberately not adopted

UI slots/HUG/FLEX, shadow envelopes, scrims and invented exploded layers do not
describe a ceramic body. Claude-specific artifact publishing is not our runtime.
The reference film's exact camera positions and final drift are not ceramic
requirements; static endpoint identity and idle behavior take priority.
MP4/PNG export, automatic manufacturing dimensions and universal
collision-free label layout remain separate capabilities. Do not describe them
as implemented because these instructions mention them.

## Execution workflow for the agent

### 1. Establish source authority before composing

Use the existing sketch-intake contract for image observations and user answers;
the upstream browser-measurement workflow is for UI source, not a way to measure
physical millimetres from a hand sketch. Inspect each distinct part definition,
not only the first part or the nicest-looking example. Count requested parts and
views against the source config, and keep repeated instances distinct from source
definitions. Do not replace this shared path with a script for each specimen.

When two sources disagree, identify the field, both values/ranges and their
source references. Mark it CONFLICT in the review explanation. A conflict affecting
shape or a required dimension must be resolved through the existing intake/revise
path before generating dependent CAD. Do not average values, choose a range
midpoint or silently promote provisional input to confirmed. Optional unknown
manufacturing information remains [TBD] in notes, with the missing evidence named;
do not create a numeric dimension or draw an invented schematic solid for it.

For example, a sketch marked 100 mm and a confirmed source marked 95 mm require
an explicit source decision; a drawing table must not present either as an
unqualified new measurement. A CAD-derived W and a provisional RM have different
evidence even if their numbers happen to match.

### 2. Establish identity and sheet intent

Carry the neutral part ID, source project, review revision/output directory,
source STEP hash, units, scale meaning and selected part count into the review
summary. Obtain them from input.json, source-config.json, drawing-plan.json and
drawing-manifest.json; do not invent a drawing number, revision label or date
from an example. Distinguish the combined sheet from individual part sheets;
do not call the part count a sheet count.

The generated reader now presents a source-backed title block per part with ID,
review revision, part index/count, units, scale meaning and review-input status.
Source project and STEP hash are disclosed in Source and evidence. Use the output
directory as review revision; do not invent manufacturing drawing numbers or dates.
This adapts upstream metadata layout while retaining the archived source contract.

### 3. Choose ceramic views and details

Keep front/plan/side, actual section and profile-derived isometric views.
Upright vessels use the front silhouette as the principal view; shallow plates
use the plan. The maintained layout uses H/min(W,D) < 0.3 for the latter.
For handled vessels, inspect both the body and attachment region: a generic upper
crop is not evidence of joint clearance. Rim/wall and foot/floor crops are useful
when supported by dimensions; handles may replace the foot detail. Explicit
reviewed details override defaults. Read drawing-plan view bounds before setting
crops, radius indices or note anchors.

Choose only dimensions that answer the review question and have source evidence.
Do not fill space with repetitive dimensions. Retain actual circular radii only;
do not substitute a quarter-circle for a spline. Keep curved wall construction
offsets distinct from normal wall thickness. General notes explain conventions;
boxed numbered notes identify a specific feature. Avoid introducing redundant
letters or codes without a table entry or an explicit detail/section meaning.

Upstream packed/deployed/removed-part diagrams and size-range strips apply only
when reviewed placement states or variants exist. Current drawing-review does not
render those layouts or a standards-certified third-angle arrangement. Do not
invent configurations or imply compliance; keep these as explicit unsupported
requests until the shared contract/generator is extended.

### 4. Compose, inspect and revise

Run preflight, generate to an unused comparison directory, then run --verify.
Reuse the generated SVG, source geometry and existing drawing kit. The all-part
sheet remains the common output; individual sheets provide additional reading
access. Do not independently redraw parts or shrink a crowded sheet until text
becomes unreadable.

Wait for fonts in the pinned browser, inspect both the sheet-coordinate bounds
and actual desktop/mobile display size, then check:
- Every displayed dimension code resolves to one table value; formulas match the
  archived operands and retain certainty. Detail letters and note numbers resolve.
- Outlines, hidden lines, dimensions and hatching remain distinguishable in
  grayscale. Hatch fills show cut material and leave cavities clear.
- Extension lines begin off the feature, short dimensions use external arrows,
  and text does not cover geometry, another label or a detail reference.
- The complete sheet fits its bounds, while its text is actually readable at the
  chosen viewing size. A passing boundary test alone is insufficient.

Fix the source rule or reviewed presentation input, regenerate into another
unused directory, and compare the same viewport/scroll points. Use dx/dy or side
options for local label clashes; reduce redundant notes or adjust supported crop
choices where appropriate. If the supported layout cannot remain legible, report
the limit and extend the shared layout/reading controls. Automatic repagination and collision solving are not implemented;
do not promise them as the effect of this instruction.

When editing SVG primitives, avoid a CSS fill rule that masks a hatch attribute,
keep marker/clip/pattern references scoped to their sheet, and test transformed
strokes and label knockouts at the real viewport. Non-scaling strokes and CSS
variables require a deliberate renderer change and comparison; do not alter
approved line weights merely to mirror the UI template.

### 5. Review motion against the same drawing

Use the verified drawing output as motion input and retain its exact SVG bytes.
Without camera input the shared camera opens on the largest principal front/plan
geometry. Use the documented --camera input to visit actual views/details such as
rim A and handle B. Resolve targets in both layouts and end on the full sheet.
Do not patch a generated project by hand or imply automatic semantic focus selection.

Use the key-frame checklist above with the maintained browser checker and inspect
the saved frames. Check that dimensions do not appear to measure an absent edge,
a leader precedes its label, fills do not flash, and camera cropping is deliberate.
A frozen set of screenshots cannot establish smoothness: also play through the
sequence and reverse scroll. Keep the final exact static sheet and reduced-motion
path. Do not add the upstream decorative end drift or fictitious ceramic layers.

### 6. Deliver the actual result and its limits

Report the candidate link, what changed, evidence/source revision, unresolved
[TBD]/CONFLICT items if present, and checks actually performed. For motion, include
duration/control mode when useful. Separate automated checks, your visual review
and the user's adoption; none implies the others or finished-page release.
Do not ask for an extra confirmation merely because upstream says “before
publishing”; existing user authorization and this repository's release contract
control publishing. Export and site publication remain outside drawing review.

## Coverage of the pinned source instructions

| Upstream section | Ceramic handling | Remaining implementation boundary |
| --- | --- | --- |
| House rules / code system | Monochrome, neutral identity, source evidence, code-table/formula correspondence | Agent checks brand authorization/conflicts; no general conflict classifier |
| Title block / page structure | Identity, revision, units, scale, provenance in review summary; shared sheet and part sheets | Source-backed title block implemented; manufacturing numbering, custom footer and automatic pagination absent |
| Sheet layout / component views | Front/plan priority, real section, rim/foot/handle details, tables and numbered feature notes | Packed/deployed states, range strips, third-angle arrangement absent |
| Measuring source / surveying instances | Reviewed sketch intake and all selected CAD definitions; real browser rendering for presentation | No physical dimension inference from screenshot pixels |
| Drawing kit / pitfalls | Shared Python primitives, offsets, analytic radii, note markers, hatch and source IDs | Arbitrary per-project patches prohibited; no collision solver |
| Before publishing / reply | Font-ready screenshots, code/value and visual checks, honest result/unknowns | Existing release gate; no automatic publication |
| Motion template / time / performance | Archived SVG, pure render(t), log camera, draw/fade, quantized updates | Explicit view/detail camera keys implemented; no layer morph or automatic feature selection |
| Choreography / adaptation / style | Geometry-first review, eight normalized beats, playback/reverse check, static endpoint | Reference UI coordinates and decorative drift intentionally not adopted |
| Runtime adapters / export | Existing pinned browser and local player | Claude artifact runtime and film export not adopted |


For the implemented opt-in full-page connection, read [dimensional page bridge](dimensional-page.md). Standalone commands still generate independent reviews; page integration requires the explicit dimensionalDrawing input and its source/whole-page checks.
