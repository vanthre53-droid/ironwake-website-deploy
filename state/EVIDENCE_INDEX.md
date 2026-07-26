# Evidence Index

| Requirement | Phase | Evidence path | Test/readback | Result | UTC timestamp | Commit | Notes |
|---|---|---|---|---|---|---|---|
| Execution pack structure | PRE_P0 | `PACK_VALIDATION_REPORT.md` | `scripts/validate-execution-pack.sh` | PASS: 38 files, 30 routes, 7 phases | 2026-07-24 | pre-project | Controller validation only; production has not run |
| Cross-CLI state schema | PRE_P0 | `state/PROJECT_STATE.yaml` | `scripts/validate-state.sh` | PASS | 2026-07-24 | pre-project | Status remains `not_started` |
| Resume state gate and source integrity | P0 | `reports/STATE_DRIFT.md` | Controller-root and nested-worktree Git readback | BLOCKED: controller root not Git; nested source materially dirty | 2026-07-26T08:57:57Z | controller commit unknown; nested `f511259` | No app or provider claim accepted |
| Source archive inventory | P0 | `reports/SOURCE_INVENTORY.md` | SHA-256 and archive central-directory readback | PARTIAL: archive hashes recorded; source baseline unresolved | 2026-07-26T08:57:57Z | controller commit unknown | Stitch archive contains 30 screens, but remains an unextracted prototype input |
| Skill inventory | P0 | `reports/SKILL_INVENTORY.md` | Root and archive skill discovery | PASS: no skills invoked; candidates deferred | 2026-07-26T08:57:57Z | controller commit unknown | Compatibility review required before use |
| Resume checkpoint controller validation | P0 | `state/PROJECT_STATE.yaml` | `scripts/validate-state.sh`, `scripts/validate-execution-pack.sh`, Python YAML parse | PASS | 2026-07-26T08:57:57Z | controller commit unknown | Controller remains intentionally blocked pending source-root resolution |
| Controller-root Git initialization | P0 | `reports/STATE_DRIFT.md` | `git init`, `git status --short --branch`, `git rev-parse --show-toplevel` | PASS: empty repository, no commit | 2026-07-26T08:57:57Z | none | User approved initialization only; initial commit scope remains pending |
| Initial baseline staging and secret scan | P0 | `reports/SECRET_EXPOSURE.md` | Cached-path review and credential-pattern scan | PASS: nested source excluded; inline credential removed before staging | 2026-07-26T08:57:57Z | none | Commit blocked only by absent local Git author identity |

Only verified repository files, test output, provider readback, or approved public URLs count as evidence. A plan, generated UI, model statement, or screenshot without provenance does not prove a live integration or business result.
