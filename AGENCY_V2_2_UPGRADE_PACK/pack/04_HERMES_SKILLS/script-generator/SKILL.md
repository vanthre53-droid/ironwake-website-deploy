---
name: script-generator
description: Generate grounded, compliant, conversion-shaped scripts for ANY channel — voice agent lines, WhatsApp bot + template copy, web-widget copy, cold DMs, cold emails, cold-call frames, and the human sales/demo script. Runs the mandatory 7-point market-analysis pass first (buyer emotional state, objection ladder to the ROOT, winning axis, market calibration, channel physics, compliance overlay, one-CTA conversion spine). Use when the user says script, outreach message, cold DM, cold email, sales pitch, demo pitch, objection handling, what should the agent say, template copy, opener, or wants lines for Dheeraj.
---

# Script Generator Engine (X_01)

## THE REFUSE RULE (enforce literally)
No output until (a) the 7-finding analysis pass is run AND STATED, and (b) a grounded data source is provided. Missing either → ask, don't generate. A script without analysis is a template, and templates get ignored.

## Run
Full engine: `references/X_01_SCRIPT_GENERATOR_ENGINE.md` (§2 analysis → §3 channel adapter → §4 outputs → §5 quality gates). Channel deep-dives when the channel is known:
- Voice → `references/V_05_...md` (≤200 tokens/turn; barge-in notes; disclosure-first; pronunciation/TTS)
- WhatsApp → `references/W_05_...md` (three outputs — templates are a separate per-language artifact)
- AI-employee/general → `references/T1_05_...md`

## Outputs
- **A — agent/bot script:** grounded, disclosure, discovery, ROOT-objection lines, confirm-before-commit, escalation. Must be testable by the channel critic + injection/hallucination tests.
- **B — human outreach/sales script:** pain-first open · the preview-first demo line ("I already built a working version for your business") · OWNER objections (not customer objections) · close = outcome framing + price + **parent as signing entity**.
- **C — artifacts:** WhatsApp template copy (categorized, per-language), email subject variants, DM openers.

## Hard gates before returning anything
All 7 findings stated · objections answered at the ROOT · exactly ONE CTA · every fact grounded with source · market-calibrated (never a US script relabeled IN) · compliance overlay present (disclosure, TCPA/PECR, template categories, no medical/legal advice, opt-out).

## Chains with
- Consumed by: **voice-agent-build**, **whatsapp-bot-build**, **webchat-widget**, **demo-personalization-pipeline** (greeting + objection lines per prospect config), **outreach composition** (Output B/C feed it directly — this engine is its upstream brain), **content-autopilot** (hooks/CTAs share the analysis pass)
- Consumes: **lead qualification** output (a HOT lead's niche+market are the engine's first two inputs), **lead harvesting** (business facts → grounded source)
- Feeds: **proposal writing** (the stated analysis findings paste straight into the proposal's "why this works" section)
