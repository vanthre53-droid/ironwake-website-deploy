# Work Log

Append one entry after every atomic task. Never rewrite history to hide a failure.

## Initial state

- Status: `not_started`
- Verified: Stitch exists as a 30-screen prototype input; production execution has not run.
- Next: P0 source, truth, route, profile, portfolio-proof, and skill audit.

## Entry template

```text
### <UTC timestamp> — <phase/task>
- CLI:
- Starting commit:
- Files changed:
- Commands/tests:
- Result:
- Evidence:
- Approval/external action:
- Known limitation:
- Ending commit:
- Next exact action:
```

### 2026-07-26T08:57:57Z — P0/resume_state_gate_and_source_inventory
- CLI: OpenCode
- Starting commit: controller root has no Git commit; nested candidate worktree HEAD is `f511259` and materially dirty.
- Files changed: `reports/STATE_DRIFT.md`, `reports/SOURCE_INVENTORY.md`, `reports/SKILL_INVENTORY.md`, `reports/CONTRADICTIONS.md`, and controller continuity files.
- Commands/tests: controller-root `git status` and `git rev-parse`; nested `git status`, `git diff --stat`, and `git log`; archive central-directory listings; SHA-256 source/input hashing; `scripts/validate-state.sh` PASS; `scripts/validate-execution-pack.sh` PASS; Python YAML parse PASS. Ruby was unavailable, so it was not used for the YAML readback.
- Result: BLOCKED. Resume gate detected source-control and source-truth drift.
- Evidence: `reports/STATE_DRIFT.md`; `reports/SOURCE_INVENTORY.md`; `reports/SKILL_INVENTORY.md`; `reports/CONTRADICTIONS.md`.
- Approval/external action: none.
- Known limitation: no clean Git-backed IronWake baseline is available; no portfolio/provider claim was accepted.
- Ending commit: not applicable at controller root.
- Next exact action: human identifies the intended Git-backed root and a reproducible source baseline; OpenCode then re-verifies this evidence before resuming P0.

### 2026-07-26T08:57:57Z — P0/controller_git_root_initialization
- CLI: OpenCode
- Starting commit: none; controller root was not a Git repository.
- Files changed: controller `.git/` metadata and continuity/evidence records; `ironwakeportifolioprojects/` was not modified.
- Commands/tests: `git init`; `git status --short --branch`; `git rev-parse --show-toplevel`.
- Result: PASS. The controller root is now an empty Git repository on `master` with no commit.
- Evidence: `reports/STATE_DRIFT.md`; `reports/SOURCE_INVENTORY.md`; `state/PROJECT_STATE.yaml`.
- Approval/external action: user authorized Git initialization only.
- Known limitation: every controller item is untracked; committing any scope requires separate explicit approval. The nested portfolio workspace remains excluded.
- Ending commit: none.
- Next exact action: obtain explicit approval for an initial controller baseline commit excluding `ironwakeportifolioprojects/`.

### 2026-07-26T08:57:57Z — P0/initial_controller_baseline_commit
- CLI: OpenCode
- Starting commit: none; approved controller files staged, excluding `ironwakeportifolioprojects/`.
- Files changed: `.gitignore`, `opencode.json`, `reports/SECRET_EXPOSURE.md`, and continuity records; no nested-worktree file was changed.
- Commands/tests: staged scope readback; nested staged-path readback returned none; staged credential-pattern scan returned none; `git diff --cached --check` reported pre-existing Markdown whitespace warnings; `git commit -m "chore: establish IronWake controller baseline"` failed before creating a commit.
- Result: BLOCKED. Git requires a configured author name and email.
- Evidence: `reports/SECRET_EXPOSURE.md`; `state/PROJECT_STATE.yaml`.
- Approval/external action: user approved controller-only initial commit; no external action occurred.
- Known limitation: the credential owner must rotate the previously inline provider credential outside the repository. The controller baseline remains staged but uncommitted.
- Ending commit: none.
- Next exact action: human supplies public Git author name and email; OpenCode configures them locally only and reruns the staged checks before committing.
