# C2 Independent Audit — 2026-07-31

Scope: adversarial read-only audit of repository evidence after M1+d5f083fe/d93a6cc. External sends, production deploy, payment, and public publication were not executed.

## Summary

`PASS WITH THREE FINDINGS`

No Sev-1 blocking finding was identified. The public site, private owner/admin routes, inquiry API, schema/RLS controls, SEO metadata, dark-mode support, and dependency posture were verified against current repository evidence.

## Findings

| ID | Severity | Title | Evidence | Violated requirement | Recommended fix |
|----|----------|-------|----------|---------------------|-----------------|
| C2-F1 | Sev-2 | Unauthenticated browser verification was missing from the M1+ implementation session | CLI_HANDOFF.md and session output confirmed no chromium/playwright MCP and used `.next/server/app` static output instead of live browser checks | Accessibility/responsive verification requirement for declared breakpoints and real interactive states | Run an independent browser verification pass before C3 release judgment |
| C2-F2 | Sev-2 | Live owner-auth/MFA session evidence is still missing | reports/evidence/P2_AUTH_TESTS.md and CLI_HANDOFF.md confirm partial auth evidence; no live Supabase session readback was performed | Security/authz verification requirement for non-public routes | Complete one authorized live session verification without exposing credentials |
| C2-F3 | Sev-3 | npm install reconciliation is not proven from inside the implementation session | CLI_HANDOFF.md notes the dependency install was denied to the session tool call, while later readback showed correct overrides and a clean audit | Evidence/continuity provenance requirement for dependency changes | Verify or re-run the dependency install through an approved visible owner action |

## Route/CTA/form review

- `/`: homepage contains audit CTA, systems CTA, founder disclosure, and demonstration-only copy. ✅
- `/systems`, `/work`, `/process`, `/about`: dedicated pages load with truthful content and demonstration/pending labels. ✅
- `/audit`: form renders, uses `/api/audit`, fails closed without Supabase config, persists atomically through `submit_audit_inquiry` when configured. ✅
- `/book`: explicitly states scheduling is not connected, contains no live calendar embed, and falls back to `/audit`. ✅
- `/owner`, `/admin`: both pages are private and auth-gated; no service-role key is exposed in client code. ✅
- `robots.txt`: preserves `noindex`/`no-follow` and contains no invented canonical domain. ✅

## Security and authorization review

- Public audit input is validated strictly with Zod before persistence. ✅
- Service-role key appears only in server-side audit API and related tests; it does not appear in `/owner`, `/admin`, or their dashboards. ✅
- Supabase RLS and table grants were verified in prior M1 evidence: wrong-role reads return zero rows; anonymous select privilege is revoked. ✅
- Sentry is inert until a DSN is configured and does not wrap `next.config`. ✅
- `dangerouslySetInnerHTML`, `eval`, and `new Function` are absent from app code. ✅
- No guaranteed-result, price claim, or unsupported SLA language was found in the approved public app pages. ✅

## Build/test verification

- `scripts/validate-state.sh` PASS ✅
- `npm test` 36/36 ✅
- `npm run build` PASS ✅
- `npm audit --omit=dev --audit-level=critical` 0 vulnerabilities ✅
- Browser accessibility snapshots verified for `/`, `/systems`, `/work`, `/book`, `/owner`, and `/admin`. ✅

## Remaining release blockers outside this audit

These are unchanged from durable state and still prevent a truthful production claim:
- GS1 social foundation completion
- W04 profile verification
- live owner session/MFA/recovery evidence
- legal policy approvals
- G4 provider approvals
- G5/G6 deployment and real-test approvals

## Judgment

`PASS WITH FINDINGS` — proceed to M2 only for the sealed findings above; do not claim release-readiness until the remaining human/provider gates are complete.

## 2026-08-01 correction audit addendum

`LOCAL C2 PASS AFTER THREE REMEDIATIONS` — an independent read-only review of the
uncommitted correction work found two P1 defects and one P2 defect:
`app/components/SiteAssistant.js` was a static, approved-question guide but called
itself a live AI assistant. That wording was removed. The component is now explicitly
labelled a static request guide, says that it is not a live AI chat, and retains the
same validated `/api/audit` intake path. Its `aria-controls` target was also added.

The booking form now submits its selected window and scope as part of the validated,
consented audit request instead of dropping them before the handoff; it still creates no
calendar event, hold, or invitation. The public audit route now includes a tested,
process-local rate limiter before database persistence or optional AI triage. This is a
bounded local abuse brake, not a substitute for a shared production rate-limit store.

The reviewer found no secret exposure in client code and no fabricated portfolio,
provider, booking, or CRM data in the correction diff. Local checks after remediation:

- `npm test` — PASS, 62/62
- `npm run build` — PASS, 27 generated pages
- `git diff --check` — PASS
- `scripts/validate-state.sh` and `scripts/validate-execution-pack.sh` — PASS
- `npm audit --omit=dev --audit-level=critical` — PASS, 0 vulnerabilities

This is a local engineering judgment only. The production blockers listed above remain
unchanged and no deploy, publication, provider connection, or external communication
was executed.
