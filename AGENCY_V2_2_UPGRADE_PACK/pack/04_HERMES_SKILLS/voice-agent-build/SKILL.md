---
name: voice-agent-build
description: Build, upgrade, script, or debug a production voice agent (Vapi/Retell) to the v2.2 standard — barge-in/interruption handling, warm transfer with context, carrier failover, STIR/SHAKEN, DTMF fallback, voicemail→callback loop, grounding lock, auto call-QA, TCPA-gated outbound. Use when the user says voice agent, AI receptionist, Vapi, Retell, phone agent, barge-in, caller interrupts, sounds robotic, warm transfer, call QA, latency budget, outbound calling, TCPA, voice demo, or a call/phone demo for a niche.
---

# Voice Agent Build (v2.2)

## Decision first (V_02 §0)
Inbound-only or inbound+outbound? **Client #1 = inbound-only** (no TCPA infra). Outbound only for a client who needs it and accepts the compliance burden. Write it in progress.md line 1.

## Build
Follow `references/V_02_HUMAN_BUILD_WORKFLOW.md` P1→P10 (single-client carve-out §5 for client #1: P1–P6-lite, ~3–4 days). Spec = `references/40c-VOICE_v2_2_CONSOLIDATED.md`:
- **Barge-in FIRST** (§33): yield-on-speech · acknowledge-and-continue for disclosures/price-confirms · backchannel tolerance · min-2-words · niche-tuned threshold. The Interrupter test (§33C) gates P2 — it decides whether the demo sounds human.
- Non-negotiables every build: disclosure first sentence · ≤200 tokens/turn · grounding lock + stale-block · confirm-before-commit · QA scoring (compliance <90 = P0) · voice-to-voice p95 <1000ms.
- Warm transfer whisper/screen-pop + scheduled callback (§34) · carrier failover automatic (§35) · US outbound requires STIR/SHAKEN A-attestation + branded CID (§36) · DTMF at high-stakes branch points only (§37) · AMD→callback/WhatsApp loop (§38).

## Scripting
Never write lines directly — run `references/V_05_PER_NICHE_SCRIPT_SUB_PROMPT.md`: market-analysis pass stated first, then Output A (agent script wired to guardrails) + Output B (your sales script; the demo weapon is "call it and try to interrupt it").

## Operate
Runbooks, operator's day, SLA sheet: `references/V_03_AGENT_OPERATIONAL_WORKFLOW.md`. Admin surface: `references/V_04_ADMIN_UIUX_BUILD_PROMPT.md`.

## Routing
Barge-in tuning, canDial()/TCPA, failover, QA rubric → **Opus/Claude Code**. Persona, tool routes, UI, CRM → **GLM/Hermes**.

## Chains with
- Triggers: **demo-personalization-pipeline** (clone this agent per prospect), **script-generator** (Output A/B), **webchat-widget** + **whatsapp-bot-build** (cross-channel handoff §28/§30)
- Consumes: **supabase-backend-pro** (voice_calls schema/RLS), your existing **demo generation (Vapi)** skill — this supersedes it for v2.2 builds
- Feeds: **outreach composition** (Output B lines), **proposal writing** (V_03 §5 SLA sheet + §6 outcome line), **security sweep** before deploy
