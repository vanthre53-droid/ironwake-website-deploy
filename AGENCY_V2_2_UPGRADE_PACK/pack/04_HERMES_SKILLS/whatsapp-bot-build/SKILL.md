---
name: whatsapp-bot-build
description: Build, upgrade, script, or operate a Meta Cloud API WhatsApp bot to the v2.2 standard — Flows, quality-rating protection, warm-up ramp, global STOP/opt-out, template localization (Hindi/Telugu/etc.), multi-WABA tenant isolation, WhatsApp Pay/catalog, CTWA attribution, 24h-window economics. Use when the user says WhatsApp bot, WABA, Cloud API, template, Flow, quality rating, number throttled, STOP keyword, opt-out, warm-up, Hindi or Telugu templates, WhatsApp demo, message bot, or 24-hour window.
---

# WhatsApp Bot Build (v2.2)

## Decision first (W_02 §0)
How many clients on this codebase? **1–3 → independent instances, skip multi-WABA entirely.** 4+ → W1/§33 tenant isolation is mandatory (webhook path ≠ JWT RLS — service role needs the trigger+assert+restricted-role fix). progress.md line 1.

## Build
Follow `references/W_02_HUMAN_BUILD_WORKFLOW.md` P1→P10 (single-client carve-out §5: webhook · pipeline · grounding · templates · quality+warm-up · STOP · CSAT ≈ 3–4 days). Spec = `references/42c-WHATSAPP_v2_2_CONSOLIDATED.md`:
- Ship-blockers: **W1 tenant isolation** (if 4+) and **W2 global STOP/START** (§34 — per-language keywords incl. Telugu ఆపు; every send suppression-checked; bypass = P0).
- Sales-blockers: **W3 warm-up ramp** (§35 — 50→100→250→500/day gated on GREEN; YELLOW freezes) and **W4 per-language templates** (§36 — EN+HI always for IN, Telugu for AP clients; same category + variables across languages; native-quality copy).
- Always: grounding lock · disclosure · Flow when ≥3 structured inputs (§22A) · free-window-first economics (§31 is margin) · quality banner is the operator's first morning look.
- Demo builds: §38 playbook (test number = 5 verified recipients max — register the prospect BEFORE the pitch).

## Scripting
Run `references/W_05_PER_NICHE_SCRIPT_SUB_PROMPT.md` — three outputs: bot script, **template copy as its own per-language artifact**, human sales script.

## Operate
Daily loop, runbooks, SLA: `references/W_03_BOT_OPERATIONAL_WORKFLOW.md`. Console: `references/W_04_ADMIN_UIUX_BUILD_PROMPT.md` (Health Bar first).

## Routing
Tenant isolation, Flows crypto, payment webhooks → **Opus/Claude Code**. Everything else → **GLM/Hermes**.

## Chains with
- Triggers: **script-generator** (Outputs A/B/C), **voice-agent-build** (cross-channel §30), **demo-personalization-pipeline** (prospect-branded WhatsApp demos)
- Consumes: **supabase-backend-pro** (webhook write-path hardening maps 1:1 to its deny-by-default RLS + HMAC patterns), **lead qualification** (CTWA/inbound leads scored HOT/WARM/COLD)
- Feeds: **client onboarding** (W_03 §5 SLA + demo→prod checklist §38D), **retention ops** (weekly template/cost/CSAT digest), **security sweep**
