# Skill verification status — 2026-10-14

This audits the current repository state. It is not visual approval or a release claim. Read [pipeline.md](pipeline.md) for the intended stages and decision rule.

## Verified locally

- The skill entrypoint, selected design profile, preflight, project CLI, and registered PoC dispatcher are tracked on feat/make-skill.
- The preflight passes for four selected moon/bowl HTML/JS baselines and accepted CAD reference artifacts. It protects exact local fixtures, not visual equivalence of a newly generated page.
- The local full-page-study report passes 16 cases: single-one, single-three, multiple-zero, multiple-one at desktop, short, mobile, and mobile-short sizes, with six stages each. Generated manifests point to the current profile hash, generated viewers match the local shared viewer, and both single scenes contain transformed-mesh-bounds framing. This checks assembly and the size regression gate for these fixtures.
- The selected one-photo gallery, final 100vh gallery after 3D exit, no visible page narration, one-sheet CAD composition, and separate single/multiple fixtures have profile or generation checks. The project CLI still ends before a finished page.

## Gaps

- This skill is partial v0. A new sketch cannot be taken through the complete CAD, web 3D, glaze, verified photo, and page pipeline with one supported CLI run. Full-page-study assembles existing reviewed assets.
- All 13 registered PoC target entry scripts are under Git-ignored docs/artifacts. The project CLI imports CAD and motion builders there too. Selected moon/bowl page baselines and generated .poc pages are untracked local files. Committing only skills/ and scripts/ does not produce a runnable, reproducible fresh checkout.
- The corrected single-moon size is in the local full-page renderer, which is ignored by Git. The older moon-jar-skill-handoff input still says study-only-no-zoom; it is not the adopted full-page result. Rotation, lighting, material, timing, and gallery framing lack matched-point visual parity against the selected moon page.
- The equal multi-photo grid is an unadopted technical candidate. The user reference has varied sizes and asymmetric positions. The exact placement rule and whether positions vary between loads remain undecided. The three-photo fixture repeats one final-photo source.
- Browser checks cover loading, structure, bounds, occupancy, and interactions for named fixtures. They do not establish visual approval, general new-project behavior, reduced-motion behavior, or asset-failure fallback.

## Cause and next gate

Earlier PoCs used separate builders and viewers. Recreating a scene from a prior candidate carried stale camera and gallery settings into the common full page. Baseline hashes guarded the old reference files, while the first browser gate checked clipping without checking the moon's minimum size. The later shared profile, registered dispatcher, size gate, and decision-status contract reduce this risk, but leave the ignored-source and visual-parity gaps.

Before declaring a release, put executable dependencies and required selected evidence in a versioned distribution path consistent with the user's remote policy; connect verified project state to the shared page renderer; retire or explicitly label stale candidate inputs; compare generated single/multiple pages with selected baselines at matched viewports and scroll points; and approve a multi-photo layout using distinct verified photos. Update this record only when the consuming generator and its output provide evidence.
