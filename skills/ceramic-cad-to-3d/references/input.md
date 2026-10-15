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

The extraction uses P1 schema 2, checked by the packaged `scripts/validate.py` and `scripts/workflow.py`. Every part must point to the same source sketch hash supplied to `new`, use its own stable `project`/part ID, and contain observed regions, uncertainty, and questions. The profile is a separately reviewed P2 silhouette; do not synthesize it by silently scaling another vessel. The manifest supports one or two rotational parts; all file paths are relative to the manifest directory or absolute. Install [requirements.txt](../requirements.txt) into a project Python environment for P1 image/hash validation.

```bash
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project new 01-moon-jar --sketch /path/to/sketch.jpg --intake /path/to/intake.json
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project resume 01-moon-jar --answer /path/to/answer.json
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project resume 01-moon-jar --profile moon-jar=/path/to/reviewed-profile.json
python3 /path/to/ceramic-cad-to-3d/scripts/run.py --workspace /path/to/project verify 01-moon-jar
```

Answer JSON follows the P1 contract: `project`, stable `answerId`, `questionId`, `evidence: {"kind":"user-message","reference":"<message reference>"}`, `verbatim`, `updates: [{"field":"...","value":...}]`, and `deferFields: []`. Preserve actual replies; synthetic fixture answers belong only in tests. `pipeline-state.json.nextInput` and `intake/summary.json` list pending questions and missing dimensions. `intake/<part>/p1-state.json`, `answers/`, `spec-proposal.json` preserve provenance. If initial intake validation fails, correct the reviewed file and retry `resume --intake /path/to/intake.json` in the same project. CAD outputs are built only after blocking questions are answered and reviewed profile dimensions agree. Missing exact dimensions and material names receive explicit CAD-blocking questions. No inferred material name is inserted. The current CLI does not interpret sketch pixels or produce a page from photos.

The config uses the same schema as `tests/fixtures/single/config.json` and `tests/fixtures/multiple/config.json`: `name`, `style: technical-dense`, `compositionMode: single|multiple`, and one or two `parts`. Every part has a stable lowercase hyphenated `id`, `name`, and JSON file paths for `profile`, `dimensions`, and `material`. Use `shapeKind: rotational-profile` when explicit. The renderer reads each profile as ordered `[radius_mm,height_mm]` points. The dimensions record supplies `targetFiredMm` or `valuesMm` with height, maximum/opening/foot diameter, and wall thickness; optional shrinkage and source fields retain their provenance. Material may be `single` or `composition`, as in the examples.

For a manually reviewed handled vessel, add `shapeKind: handled-vessel` and `handle` JSON path to the same part, alongside the body `profile`. The handle file is copied and hashed with other inputs. Manual handled-vessel builds require a Python environment with build123d ; the result includes STEP/GLB and a numeric CAD-to-wire placement report. The [synthetic fixture](../tests/fixtures/handled/config.json) demonstrates routing only; its dimensions do not describe the user mug.

The CLI copies the config and source JSONs into the project's ignored local workspace before generation. `pipeline-state.json` records input/output hashes. `review-log.md` records feedback. `cad/manifest.json` records one sheet per project, four layout choices, per-part source hashes and `frontBox` values. The sketch and photos remain local; they are not published by this entrypoint. `verify` detects direct edits to project inputs or CAD output, so use `revise` for a deliberate change.


## Motion input

Use `motion-preview PROJECT --motion FILE` after CAD verification. The JSON contains `schemaVersion: 1`, `status: reviewed-provisional|user-confirmed`, nonempty `provenance`, `tiltDirection: right|left|forward|backward|none`, `tiltDegrees` (0–90), and `bodySpinDegrees`/`axisPrecessionDegrees` (360–1440). Select values from project evidence; the moon's comparison angles are not automatic defaults.

## Gallery input

`gallery PROJECT --photos FILE` consumes an ordered JSON list. Each photo has `source` (absolute or workspace-relative), `sha256`, `role: actual|process`, `status: user-confirmed-final-fired|user-confirmed-process` matching its role, and `alt`. Empty input omits the gallery. One photo uses the selected hero frame. The selected two-photo composition is an actual hero followed by a distinct smaller process photo. Other multiple-photo layouts remain pending. The component manifest and all outputs are recorded in project state and checked by `verify`; this command does not assemble a finished page.

Test fixture JSON paths are fixture-directory-relative for portability. Resolve them to absolute paths before sending a fixture through the project CLI; normal project config paths are workspace-relative or absolute.
