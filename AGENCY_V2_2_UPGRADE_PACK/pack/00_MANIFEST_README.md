# AGENCY v2.2 UPGRADE PACK — MANIFEST
Built 2026-07-10. Everything additive; nothing from your originals removed.

## THE CASE VERDICT (your question, answered)
**Partial CASE-1, executed as CASE-2.** Files from message 1 ARE upgrade modules for what you attached later — but incomplete:
- `V_01` = the **v2.2 upgrade module for 40b** (Voice v2.1) — additive append, not a merged file → merged here into 40c.
- `W_01` = the **v2.2 upgrade module for 42b** (WhatsApp v2.1) → merged here into 42c.
- `T1_01...md` is **mislabeled** — it contains the two-tier PORTFOLIO PLAN, not the fleet spec. The v7.2 §33 fleet orchestration module that T1_02/03/04/05 reference did not exist → **reconstructed in 39c §33** from every §33.x cross-reference + the 10 Track-1 gaps.
- ⚠ `40b-VOICE_v2_1_ADDENDUM.md` **never actually uploaded** (listed, not transferred). 40c contains a reconstructed v2.1 spine (§23–§32) flagged in-file — paste your original 40b over it if you still have it; §33–§39 are exact.

## INVENTORY (what's in each folder + what to use it for)

### 01_UPGRADED_MODULES — the upgraded prompts (append to base Files 39/40/42)
| File | = | Use when |
|---|---|---|
| `39c-V7_2_UPGRADE_MODULE.md` (40KB) | 39b verbatim + **§33 Fleet Orchestration** (new) + **§34 Web-Chat Widget** (new) | Any AI-employee/fleet build, grounding freshness, widget builds, universal projects |
| `40c-VOICE_v2_2_CONSOLIDATED.md` (19KB) | reconstructed v2.1 spine + V_01 verbatim + **§39 Demo-Clone Pipeline** (new) | Every voice agent build/upgrade/demo |
| `42c-WHATSAPP_v2_2_CONSOLIDATED.md` (45KB) | 42b verbatim + W_01 verbatim + **§38 Demo-Mode Playbook** (new) | Every WhatsApp bot build/upgrade/demo |

### 02_UPGRADED_KITS — drop-in replacements for your three kit zips
`AGENCY_KIT_V7_v7_2.zip` · `AGENCY_KIT_VOICE_v2_2.zip` · `AGENCY_KIT_WHATSAPP_v2_2.zip`
Each = your original kit UNCHANGED + `modules/<consolidated module>` + new skills + updated `INDEX.md` + a clearly-marked version section appended to `CLAUDE.md`.
New kit skills — **V7:** fleet_orchestration, grounding_freshness, script_generator, webchat_widget_build · **VOICE:** barge_in_setup, warm_transfer_handoff, carrier_failover, demo_clone_pipeline · **WHATSAPP:** stop_optout_setup, number_warmup_ramp, template_localization.

### 03_PORTFOLIO_BUILD_PROMPTS — runnable, phase-gated, costed
| File | Project | Days | ~Cost |
|---|---|---|---|
| P0 | Master plan: map, calendar, full cost model, global rules | — | portfolio total ≈ $18–45/mo (₹1.5–3.8k) |
| P1 | Rapid Response Plumbing (voice hero + WhatsApp + widget + site + 3 automations) | 1–5 | ~$8–18 build + base |
| P2 | Harbour Estates (voice qual + speed-to-lead UK + listing cards + CRM drip) | 6–9 | +$3–8/mo |
| P3 | DentaCare Pro shelf demo (site + widget + voice clone, HIPAA framing) | 10 | ~$1–3 |
| P4 | Aura Archives retail widget | 10 (½d) | ~$0 |
| P5 | Personalization pipeline (config→clone→Loom, <2h/prospect) | 11–13 | ~$0.5–2/prospect |
| P6 | **ADDED missing project:** Command Center + Script Generator app (internal) | dead time only | ~$0 |
All costs approximate — verify current pricing before committing.

### 04_HERMES_SKILLS — 7 skills, each self-contained (SKILL.md + references/)
Install: copy folders into `~/.hermes/skills/` (`/home/shadowlingo/.hermes/skills`).

### 05_ORIGINAL_REFERENCE_FILES — all 22 originals (19 msg-1 files deduped + 39b + 42b + your 3 original kit zips), untouched.

## SKILL TRIGGER WORDS
| Skill | Fires on |
|---|---|
| **fleet-orchestration** | fleet, orchestration, AI employees, multi-agent, planner, critic, task graph, agent_tasks, needs_human, approval queue, kill switch, grounding freshness, single-agent carve-out |
| **voice-agent-build** | voice agent, AI receptionist, Vapi, Retell, phone agent, barge-in, sounds robotic, caller interrupts, warm transfer, call QA, latency, TCPA, outbound calling, voice demo |
| **whatsapp-bot-build** | WhatsApp bot, WABA, Cloud API, template, Flow, quality rating, throttled, STOP, opt-out, warm-up, Hindi/Telugu templates, 24-hour window, WhatsApp demo |
| **script-generator** | script, cold DM, cold email, outreach message, sales pitch, objection handling, "what should the agent say", template copy, opener, lines for Dheeraj |
| **webchat-widget** | website chatbot, web widget, embed chat, RAG chatbot, chat bubble, site assistant, recommendation bot |
| **demo-personalization-pipeline** | clone a demo, personalize demo, demo for [business/URL], prospect demo, deploy-demo, teardown, demo registry, "get a Loom out" |
| **portfolio-demo-factory** | portfolio, build the demos, P1…P6, flagship demo, plumbing demo, real estate demo, shelf demo, 13-day sprint, "what do I build next" |

## SKILL CHAINING MAP (incl. your existing installed skills)
- **lead harvesting → lead qualification → demo-personalization-pipeline → outreach composition → proposal writing → client onboarding** — the revenue spine; the new pipeline slots between qualification and outreach.
- **script-generator** is upstream of: outreach composition, voice-agent-build (Output A), whatsapp-bot-build (Outputs A+C), webchat-widget copy, content-autopilot hooks, proposal writing ("why this works" section).
- **voice-agent-build ↔ whatsapp-bot-build ↔ webchat-widget** share one intent brain + cross-channel handoff; all three consume **supabase-backend-pro** and end with **security sweep**.
- **fleet-orchestration** consumes supabase-backend-pro; feeds client onboarding (SLA sheet), retention ops (Analyst weekly report), self-annealing (Critic defect patterns → prompt registry).
- **portfolio-demo-factory** orchestrates all of the above; registry/progress rows land in **company-os**.
- **voice-agent-build + demo-personalization-pipeline supersede the old demo-generation skill** for v2.2 work; **GLM failure recovery** applies inside any GLM-routed phase.
(Names are best-match to your installed set — if a folder name differs, edit the "Chains with" line in that SKILL.md.)

## ORDER OF OPERATIONS FROM HERE
1. Drop the 3 upgraded kit zips over your old kits · install the 7 skills into Hermes.
2. Run P0 → start P1 Day 1 **with Dheeraj's list building in parallel** — Day 3 the first ten Looms go out, Day 14 building stops.
3. P6 and the full fleet stay in dead time until a client pays. The gap analysis's last line still grades everything: the pipeline, not this pack, decides the 90 days.

## HARDENING PASS (2026-07-10 — Master Audit Protocol executed)
The full 15-phase audit ran against this pack; every file was read in full. Additions (all additive, propagated per G1):
- **39c gained U§35** (retention / GDPR-DPDP erasure / backup+restore drill) and **U§36** (uniform retries, dead-letter queue + replay, outbox pattern, Gate R resilience matrix R1–R7).
- **40c gained V§40** (silence/no-input ladder, spoken recording notice, concurrency & busy policy, per-caller velocity caps + transfer allowlist, STT repair thresholds).
- **42c gained W§39** (webhook ordering & exactly-once worker, long-conversation context compression + human-takeover pack, per-contact flood coalescing with STOP bypass, media intake specifics completing §W4).
- **06_GOVERNANCE/**: GOVERNANCE.md (SSOT + propagation + checksums, U§/V§/W§ citation namespace, reference-resolution map, contradiction rulings, deprecations, rotation cadence, dual-runtime policy) · CHANGELOG.md (every change + justification) · CHECKSUMS.sha256 (drift detector: `sha256sum -c`).
- **07_AUDIT/AUDIT_REPORT.md**: module findings, consistency report, remaining risks, backlog, readiness + scalability assessments, quality score 8.7/10 with justification.
Kit zips and skill references were regenerated from canonical after the appends — copies are byte-identical to `01_UPGRADED_MODULES/`.
