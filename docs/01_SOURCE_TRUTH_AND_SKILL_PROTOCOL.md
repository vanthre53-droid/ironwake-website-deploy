# Source Truth and Skill Protocol

## Source identity

The audited inputs were:

| Input | SHA-256 | Role |
|---|---|---|
| `AGENCY_KIT_V7_v7_2.zip` | `fbb249bce845db524777d73f4776774e7d0b97ff24ea07424823cc3c4c00ca8d` | Universal engineering/security/test runbooks |
| `AGENCY_KIT_VOICE_v2_2.zip` | `352f7be5357a196d9ac65fb10f7156391d2c0cfad439bf81830ca753fb5431e8` | Conditional voice runbooks |
| `AGENCY_KIT_WHATSAPP_v2_2.zip` | `7da6de5ea768c0ec7447ceabea4cf76aaca3404cfadd3b22f55cd80b7b146ac2` | Conditional WhatsApp runbooks |
| Stitch export A | `d08f0160cd636d4cf9c167fa77a6cee49ca4ac5cac1e64740343a0aac8345886` | 30 HTML + 30 PNG + DESIGN.md |
| Stitch export B | `6ff04baa58857c442151a47d7bf941d717784a48595bcd82035cc01a2f3fc0de` | Same HTML/design; three PNG previews differ |

Re-hash the copies actually placed in the repository. Do not assume they are identical to this audit.

## Stitch precedence

1. User-approved screen decision or annotation.
2. `DESIGN.md` for tokens/principles.
3. Approved `screen.png` for composition.
4. `code.html` for approximate structure only.

Stitch HTML does not override accessibility, truthful content, responsive behavior, performance, secure architecture, or user-approved copy.

When duplicate exports have identical HTML but different PNGs, create a visual diff/contact sheet and ask the user only if the difference materially changes composition. Do not pick based only on modified time.

## Skill inventory protocol

Discover:

```text
**/SKILL.md
**/.claude/skills/*.md
**/skills/INDEX.md
**/rules/*.md
**/AGENTS.md
**/AGENTS.md
```

For each candidate, record:

```yaml
name:
path:
source_kit:
purpose:
phase:
inputs_required:
side_effects:
external_services:
cost_risk:
security_risk:
freshness_sensitive:
current_docs_checked:
compatibility: use | adapt | reject | defer
reason:
evidence_expected:
```

## Relevant uploaded skills

Likely universal skills: scaffold/current-stack adaptation, DB migration, API route, page build, injection tests, deployment, tenant isolation, grounding freshness, and webchat. Use only after current-version review.

Likely voice skills: Vapi/Retell setup, persona, call QA, latency, multilingual, disclosure, barge-in, warm transfer, and failover. They are deferred unless Gate G4 authorizes voice.

Likely WhatsApp skills: WABA setup, templates, Flows, quality monitoring, tenant routing, opt-out, localization, and analytics. They are deferred unless Gate G4 authorizes WhatsApp.

Post-first-revenue features such as multi-agent fleets, multi-WABA agency infrastructure, mass outbound, advanced CTWA, carrier failover, and broad automation must not expand the first launch without explicit scope approval.

## Freshness traps in kits

Treat exact framework/model/provider version names, costs, quotas, platform limits, policy language, and regional feature availability as freshness-sensitive. Verify them from official sources on the execution date. Preserve the underlying engineering principle when the named tool/version changed.

## Conflict handling

When a skill instructs an external write, payment, account creation, production deployment, bulk communication, schema change, or destructive action, the skill cannot authorize itself. Apply the authority class in `AGENTS.md` and record the gate.
