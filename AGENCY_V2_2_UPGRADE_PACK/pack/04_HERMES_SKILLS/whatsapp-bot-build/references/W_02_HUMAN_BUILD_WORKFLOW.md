# W_02 — HUMAN BUILD WORKFLOW (WhatsApp Bot)
**"The perfect workflow for ME to build the WhatsApp bot in my env."**
Your operating procedure for building a WhatsApp bot on your stack, phase-gated, tool-routed. Mirrors T1_02's structure. Single-client carve-out included so client #1 ships fast.

---

## 0. THE ONE DECISION FIRST
**How many clients on this codebase?**
- **1–3 →** deploy independent instances (v2.1 §24A). **Skip multi-WABA (W1/§33) entirely.** Simpler, faster, no cross-tenant risk to engineer around.
- **4+ →** enable multi-WABA; W1/§33 tenant isolation is mandatory and is your hardest phase.

Write it in `progress.md` line 1.

## 1. ENVIRONMENT PREFLIGHT
| Work | Tool |
|------|------|
| WABA setup, message pipeline, templates, buttons/lists, dashboard | **GLM-5.2 / Hermes** |
| W1 webhook tenant-isolation (if 4+), Flows asymmetric crypto (§22C), payment webhook idempotency, injection hardening | **Opus 4.8 / Claude Code** |

- [ ] `AGENCY_KIT_WHATSAPP` installed (CLAUDE.md + skills: `waba_setup`, `template_submission`, `flows_design`, `quality_monitoring`, `multi_tenant_routing`, `ctwa_attribution_setup`, `payments_integration_upi`, `conversation_analytics_setup`)
- [ ] Meta WABA + phone number ID + permanent access token in Infisical
- [ ] Webhook verify token set; callback URL reachable
- [ ] `.env` validated

## 2. BUILD ORDER
```
WABA + WEBHOOK → MESSAGE PIPELINE → GROUNDING → TEMPLATES → FLOWS →
QUALITY MONITOR + WARM-UP → STOP/OPT-OUT → [PAY/CATALOG if scope] →
ANALYTICS/CSAT → CTWA → OBSERVABILITY
```

## 3. PHASES (each ends in a Gate with evidence)

### P1 — WABA + Webhook  [GLM; Opus if 4+ for W1]
Skill: `waba_setup`. Verify webhook signature (HMAC) on every request. If 4+: implement W1/§33 tenant isolation NOW (resolve tenant from `phone_number_id`, assert on every write, restricted DB role, mismatch trigger).
**Gate P1:** signed webhook accepted, unsigned rejected; if multi-tenant, paste the §33C cross-tenant-write rejection.
Commit: `feat: waba webhook + (tenant isolation)`.

### P2 — Message Pipeline  [GLM]
Inbound → parse → intent (Haiku) → grounded response (Sonnet) → send. Interactive buttons/lists from v2.0. Store every message with `correlation_id`.
**Gate P2:** a real inbound message gets a grounded reply; conversation + message rows written; no invented facts.
Commit: `feat: message pipeline`.

### P3 — Grounding  [GLM, Opus reviews stale-block]
The one from T1 §33.5 applies here too: bot quotes only grounded prices/hours/policies; stale values re-ground before answering. **Build this even for a single client.**
**Gate P3:** change a source price → bot re-grounds. Paste before/after.
Commit: `feat: grounding freshness`.

### P4 — Templates  [GLM]
Skill: `template_submission`. Ship the §28 niche library; if IN client, localize per W4/§36 (Hindi/Telugu). Correct category per template.
**Gate P4:** templates submitted, categories correct, per-language variants where needed; paste approval statuses.
Commit: `feat: niche templates (+ localization)`.

### P5 — Flows  [Opus for crypto, GLM for JSON]
Skill: `flows_design`. Ship the 4 Flow templates (v2.1 §22D). Implement the encrypted data-exchange endpoint using Meta's reference crypto — do not roll your own (§22C). Wire W5/§37 rotation into the runbook.
**Gate P5:** a booking Flow completes end-to-end, submission decrypted, row created; fallback for Flow-incapable devices works (§22E).
Commit: `feat: whatsapp flows`.

### P6 — Quality Monitor + Warm-up  [GLM]
Skill: `quality_monitoring`. Subscribe to `phone_number_quality_update`; daily poll fallback. Implement W3/§35 warm-up ramp gated on GREEN.
**Gate P6:** quality reading stored; ramp state advances only on GREEN; YELLOW freezes the ramp.
Commit: `feat: quality monitoring + warm-up ramp`.

### P7 — STOP / Opt-out  [GLM]
Implement W2/§34: keyword detection (per language), suppression write, halt non-service messaging, confirmation, START to reverse. Every send checks suppression first.
**Gate P7:** STOP → suppressed + confirmed; a subsequent template send to that contact is blocked. Paste.
Commit: `feat: global opt-out`.

### P8 — Pay / Catalog  [Opus for payment webhook; only if in scope]
Skills: `payments_integration_upi` (§25), catalog+cart (§26). Idempotency on `reference_id`; strict state transitions.
**Gate P8:** a UPI payment success webhook (fired twice) processes once; order marked paid.
Commit: `feat: whatsapp pay + catalog`.

### P9 — Analytics / CSAT  [GLM]
Skill: `conversation_analytics_setup`. Auto-CSAT per conversation (v2.1 §29) via the `conversation-critic` agent. Weekly digest.
**Gate P9:** a completed conversation gets scored; low score flagged.
Commit: `feat: conversation analytics + csat`.

### P10 — CTWA + Observability  [GLM]
Skill: `ctwa_attribution_setup` (§27) if the client runs ads; Conversions API events back to Meta. Langfuse + alerts (§32).
**Gate P10:** a CTWA-originated message captures `referral`; a resolved conversation produces a Langfuse trace.
Commit: `feat: ctwa + observability`.

## 4. TOOL-ROUTING RULE
Anything that (a) writes across tenants, (b) handles money, or (c) does crypto → **Opus/Claude Code**. That's P1 (if 4+), P5 crypto, P8. Everything else → **GLM/Hermes**.

## 5. SINGLE-CLIENT CARVE-OUT (build THIS for client #1)
Skip P1 tenant-isolation (single instance), P8 (unless they sell products), P10 CTWA (unless they run ads). Build: **P1-lite webhook · P2 pipeline · P3 grounding · P4 templates (localized if IN) · P6 quality+warm-up · P7 STOP · P9 CSAT.** That's a compliant, sellable WhatsApp bot in **~3–4 days**. Everything slots into multi-tenant later with no rework.

**progress.md line:** *"1 client = single instance. No multi-WABA until 4+. Warm-up + STOP + grounding are non-negotiable even solo."*
