# JOMUL project-asset work

The user's goal is a reusable sketch → CAD → 3D → photo skill. The documents in `docs/make-skill/` are design records, not proof that a generator consumes a rule. `docs/` and `.poc/` are intentionally excluded from Git; do not mistake an untracked artifact for a committed implementation.

Before changing a project-asset PoC, read `scripts/jomul-design-profile.json`, `docs/make-skill/00-orchestration/90-repeated-omissions-audit.md`, and the responsible stage README. Run `python3 scripts/jomul-preflight.py`. Use `python3 scripts/jomul-build.py <target>` for registered builds. Register a new target against the accepted profile before creating another review URL. Preserve the selected moon-jar page and bowl handoff page as baselines; do not copy a historical `bowl-set` or photo-pacing experiment as the current design.

A registered build reports PoC execution only. Run `python3 scripts/jomul-preflight.py --full-page-fixture` to check the assembled local fixtures and `python3 scripts/jomul-preflight.py --release` before describing the skill as reproducible or complete; a blocked release gate is a blocker, not a warning.

The current CAD contract is technical-dense for single and multiple projects. Multiple parts share one sheet. Isometric guide rings come from the CAD profile, never a generic bowl icon. CAD labels are English except the user's clay/glaze names. The last gallery has no visible title/caption or later section; it uses the accepted photo frame and pointer profile. Prefer shared source code and profile input to re-creating a similar-looking implementation. If a component is not shared yet, state that limitation; do not report a documented rule as implemented.

For changes to shape, material, motion, or gallery behavior, preserve unaffected approved assets, work in a separate comparison target, and compare the same viewport/scroll points. Do not use an approximate manual rollback: restore the exact previous code/assets or state that the snapshot is unavailable. Record adopted feedback in the stage's generation rule first, then add regression coverage. The chess fixture is reserved for final evaluation, not intermediate tuning.
