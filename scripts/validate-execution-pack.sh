#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
failed=0

required=(
  README_USE_THIS_FIRST.md
  CURRENT_STATUS_EXECUTION_MAP.md
  AGENTS.md
  MASTER_OPENCODE_EXECUTION_PROMPT.md
  opencode.json
  .opencode/agents/ironwake-controller.md
  PACK_VALIDATION_REPORT.md
  ironwake.execution.yaml
  inputs/REAL_DATA_INTAKE.md
  inputs/APPROVALS.md
  inputs/SOCIAL_SETUP_REAL_DATA.md
  docs/00_WHAT_EXISTS_AND_WHATS_LEFT.md
  docs/01_SOURCE_TRUTH_AND_SKILL_PROTOCOL.md
  docs/02_STITCH_ROUTE_COMPONENT_MAP.md
  docs/03_RESEARCH_UX_AND_PRICING_PROTOCOL.md
  docs/04_ARCHITECTURE_CRM_AND_INTEGRATIONS.md
  docs/05_SECURITY_PRIVACY_COMPLIANCE.md
  docs/06_SEO_PERFORMANCE_ACCESSIBILITY.md
  docs/07_TEST_RELEASE_AND_HANDOFF_GATES.md
  docs/08_SOCIAL_MEDIA_BRAND_AND_ACQUISITION.md
  docs/09_OPENCODE_CONTINUITY_PROTOCOL.md
  docs/10_PRIORITY_DECISION_AND_DATA_PROTOCOL.md
  docs/11_OPENCODE_ROLE_AND_MODEL_OWNERSHIP_PROTOCOL.md
  docs/12_FULL_PROGRAM_SCOPE_REGISTRY.md
  state/PROJECT_STATE.yaml
  state/WORK_LOG.md
  state/DECISION_QUEUE.md
  state/EVIDENCE_INDEX.md
  state/CLI_HANDOFF.md
  state/SCOPE_COVERAGE.md
  state/SEALED_TASK_QUEUE.yaml
  state/SEALED_REMEDIATION_QUEUE.yaml
  prompts/00_START_OR_RESUME.md
  prompts/01_PHASE_0_AUDIT.md
  prompts/02_PHASE_1_RESEARCH_AND_APPROVAL.md
  prompts/02A_PHASE_1_5_PORTFOLIO_PROOF.md
  prompts/03_PHASE_2_FOUNDATION.md
  prompts/04_PHASE_3_FRONTEND.md
  prompts/05_PHASE_4_OPERATING_SYSTEM.md
  prompts/06_PHASE_5_RELEASE.md
  prompts/07_PHASE_6_DEPLOY_AND_HANDOVER.md
  prompts/08_SOCIAL_MEDIA_PROFILE_CONTENT_WORKSTREAM.md
  prompts/10_OPENCODE_STAGE_C1_ARCHITECT.md
  prompts/11_OPENCODE_STAGE_M1_IMPLEMENT.md
  prompts/12_OPENCODE_STAGE_C2_AUDIT.md
  prompts/13_OPENCODE_STAGE_M2_REMEDIATE.md
  prompts/14_OPENCODE_STAGE_C3_FINAL_GATE.md
  scripts/audit-stitch-export.sh
  scripts/validate-state.sh
  scripts/validate-execution-pack.sh
)

for path in "${required[@]}"; do
  if [[ ! -s "$root/$path" ]]; then
    echo "MISSING_OR_EMPTY $path"
    failed=1
  fi
done

for phrase in \
  'OpenCode Role and Model Ownership Protocol' \
  'Full IronWake Program Scope Registry' \
  'required_role' \
  'SEALED_TASK_QUEUE.yaml' \
  'SEALED_REMEDIATION_QUEUE.yaml' \
  'GC1_ARCHITECTURE_APPROVED' \
  'GM1_IMPLEMENTATION_COMPLETE' \
  'GC2_REMEDIATION_APPROVED' \
  'GM2_REMEDIATION_COMPLETE' \
  'GC3_RELEASE_CANDIDATE_PASS'; do
  if ! rg -q --fixed-strings "$phrase" "$root"; then
    echo "MISSING_V4_PIPELINE_GUARDRAIL $phrase"
    failed=1
  fi
done

for scope_id in $(seq -w 0 22); do
  if ! rg -q --fixed-strings "W$scope_id" "$root/docs/12_FULL_PROGRAM_SCOPE_REGISTRY.md"; then
    echo "MISSING_SCOPE_ID W$scope_id"
    failed=1
  fi
done

for phrase in \
  'Social profile setup' \
  'Nine truthful source assets' \
  'Social operations' \
  'Social acquisition and CRM attribution' \
  'Proposals, contracts, invoices, and payments' \
  'Revenue Command and sales intelligence' \
  'Client delivery and retainers'; do
  if ! rg -q --fixed-strings "$phrase" "$root/docs/12_FULL_PROGRAM_SCOPE_REGISTRY.md"; then
    echo "MISSING_FULL_SCOPE $phrase"
    failed=1
  fi
done

route_count="$(rg -c '^\| `ironwake_.*_desktop` \|' "$root/docs/02_STITCH_ROUTE_COMPONENT_MAP.md" || true)"
if [[ "$route_count" != "30" ]]; then
  echo "ROUTE_COUNT expected=30 actual=$route_count"
  failed=1
fi

for phrase in \
  'No-invention law' \
  'Skill discovery' \
  'OWASP ASVS Level 2' \
  'Never call a slot “booked”' \
  'Do not promise the highest rank' \
  'adult/legal-owner KYC'; do
  if ! rg -q --fixed-strings "$phrase" "$root"; then
    echo "MISSING_GUARDRAIL $phrase"
    failed=1
  fi
done

for phrase in \
  'OpenCode Continuity Protocol' \
  'Atomic checkpoint contract' \
  'next_exact_action' \
  'must not rerun completed work' \
  'Portfolio truth and launch-proof gate' \
  'minimum social foundation' \
  'customers_never_compare_prices: false'; do
  if ! rg -q --fixed-strings "$phrase" "$root"; then
    echo "MISSING_V3_GUARDRAIL $phrase"
    failed=1
  fi
done

for phrase in \
  'Social media and public-profile law' \
  'nine truthful source assets' \
  'SOCIAL_PLATFORM_MATRIX.md' \
  'GS1_SOCIAL_FOUNDATION_APPROVAL' \
  'Do not automate unsolicited'; do
  if ! rg -q --fixed-strings "$phrase" "$root"; then
    echo "MISSING_SOCIAL_GUARDRAIL $phrase"
    failed=1
  fi
done

phase_count="$(rg -c '^  - id: P[0-6]$' "$root/ironwake.execution.yaml" || true)"
if [[ "$phase_count" != "7" ]]; then
  echo "PHASE_COUNT expected=7 actual=$phase_count"
  failed=1
fi

if ((failed)); then
  echo "FAIL"
  exit 1
fi

"$root/scripts/validate-state.sh"

echo "PASS files=${#required[@]} routes=$route_count phases=$phase_count scopes=23 pipeline_stages=5 version=5-opencode-only"
