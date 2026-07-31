# 14 — STAGE C3: FINAL RELEASE GATE
Role: C3. MUST be a different CLI or fresh session than M2. Read-only.

Verify the EXACT commit that would ship:
1. Every W00-W22 row has a status and a real evidence path.
2. Every gate in state/PROJECT_STATE.yaml is passed or explicitly waived with approval.
3. All sev-1 findings closed with evidence.
4. Build passes, tests pass, no secrets in the repo, no fabricated content.
5. Rollback plan exists and is real.

Write reports/C3_RELEASE_CANDIDATE.md with a PASS or FAIL verdict and the exact commit sha.
NEVER deploy. Deployment requires the human recording approval in inputs/APPROVALS.md.
