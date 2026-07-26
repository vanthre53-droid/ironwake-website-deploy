#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
state="$root/state/PROJECT_STATE.yaml"

required_files=(
  state/PROJECT_STATE.yaml
  state/WORK_LOG.md
  state/DECISION_QUEUE.md
  state/EVIDENCE_INDEX.md
  state/CLI_HANDOFF.md
  prompts/00_START_OR_RESUME.md
  docs/09_OPENCODE_CONTINUITY_PROTOCOL.md
  docs/10_PRIORITY_DECISION_AND_DATA_PROTOCOL.md
)

for path in "${required_files[@]}"; do
  [[ -s "$root/$path" ]] || { echo "MISSING_OR_EMPTY $path"; exit 1; }
done

for key in schema_version status active_stage required_role allowed_harness active_spec_version current_phase current_gate current_atomic_task last_verified_task phase_prompt next_exact_action blocked_by completed_evidence tests_passed tests_pending; do
  rg -q "^${key}:" "$state" || { echo "MISSING_STATE_KEY $key"; exit 1; }
done

status="$(sed -n 's/^status: //p' "$state")"
case "$status" in
  not_started|in_progress|blocked_real_data|blocked_user_approval|blocked_adult_or_legal_owner|blocked_provider|failed|verified_complete|deferred_approved) ;;
  *) echo "INVALID_STATUS $status"; exit 1 ;;
esac

role="$(sed -n 's/^required_role: //p' "$state")"
[[ "$(sed -n 's/^allowed_harness: //p' "$state")" == "OPENCODE" ]] || { echo "INVALID_HARNESS"; exit 1; }
case "$role" in
  C1|M1|C2|M2|C3) ;;
  *) echo "INVALID_ROLE $role"; exit 1 ;;
esac

stage="$(sed -n 's/^active_stage: //p' "$state")"
case "$stage" in
  C1|M1|C2|M2|C3|P6) ;;
  *) echo "INVALID_STAGE $stage"; exit 1 ;;
esac

[[ "$stage" == "$role" ]] || { echo "ROLE_STAGE_MISMATCH stage=$stage role=$role"; exit 1; }

echo "PASS state_schema=1 status=$status stage=$stage role=$role harness=OPENCODE"
