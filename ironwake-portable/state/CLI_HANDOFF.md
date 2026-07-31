# CLI HANDOFF — read this when picking the repo up in a different CLI.

## Current handoff
last_harness: none
last_commit: none
stage_in_progress: none
safe_to_switch: yes
what_the_next_cli_must_know: "Nothing yet - project not started. Run prompts/00_START_OR_RESUME.md."

## Rules
1. Only switch CLI at a committed safe boundary. Uncommitted work is invisible to the next tool.
2. The next CLI re-verifies evidence before continuing. It never assumes a claim in this file.
3. Audit roles (C2/C3) SHOULD switch CLI - cross-tool audit cannot inherit builder assumptions.
4. Never run two CLIs against this repo at once.
