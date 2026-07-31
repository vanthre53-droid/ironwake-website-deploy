#!/usr/bin/env bash
# Validates pack STRUCTURE only. Does not claim the program is complete.
set -uo pipefail
fail=0
req_files=(
  AGENTS.md CLI-SETUP.md MASTER_EXECUTION_PROMPT.md README_USE_THIS_FIRST.md
  ironwake.execution.yaml opencode.json .claude/settings.json
  state/PROJECT_STATE.yaml state/SEALED_TASK_QUEUE.yaml state/SEALED_REMEDIATION_QUEUE.yaml
  state/WORK_LOG.md state/EVIDENCE_INDEX.md state/CLI_HANDOFF.md
  prompts/00_START_OR_RESUME.md prompts/10_STAGE_C1_ARCHITECT.md
  prompts/11_STAGE_M1_IMPLEMENT.md prompts/12_STAGE_C2_AUDIT.md
  prompts/13_STAGE_M2_REMEDIATE.md prompts/14_STAGE_C3_FINAL_GATE.md
  docs/11_ROLE_AND_MODEL_OWNERSHIP_PROTOCOL.md docs/12_FULL_PROGRAM_SCOPE_REGISTRY.md
  docs/09_CONTINUITY_PROTOCOL.md
  inputs/APPROVALS.md inputs/REAL_DATA_INTAKE.md
)
for f in "${req_files[@]}"; do
  if [ -f "$f" ]; then echo "OK   $f"; else echo "MISS $f"; fail=1; fi
done
# every prompt referenced by the yaml must exist
while read -r p; do
  [ -z "$p" ] && continue
  if [ -f "$p" ]; then echo "OK   (ref) $p"; else echo "MISS (ref) $p"; fail=1; fi
done < <(grep -oE 'prompts/[A-Za-z0-9_]+\.md' ironwake.execution.yaml | sort -u)
echo "---"
[ $fail -eq 0 ] && echo "PACK STRUCTURE: PASS" || echo "PACK STRUCTURE: FAIL"
exit $fail
