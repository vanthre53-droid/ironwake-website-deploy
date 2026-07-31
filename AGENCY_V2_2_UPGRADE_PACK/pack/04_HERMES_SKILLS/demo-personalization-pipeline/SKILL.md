---
name: demo-personalization-pipeline
description: Turn a prospect's URL into a live personalized demo — scrape their site, generate a validated config.json, clone the flagship Vapi assistant via API/MCP, seed grounded facts, redeploy the branded demo site/widget, verify, and record the 90-second Loom. Target under 2 hours per prospect, under 30 minutes by week 3. Use when the user says clone a demo, personalize the demo, make a demo for [business], prospect demo, demo for this URL, deploy-demo, teardown demo, demo registry, demo expired, or "get a Loom out for this lead".
---

# Demo Personalization Pipeline (Voice v2.2 §39 / P5)

## The chain (scripted, idempotent — never the dashboard)
1. `gen-config.ts <url> <niche> <market>` → scrape → Claude drafts `demos/<slug>/config.json` (39A contract: name, services, area, hours, greeting, persona, voice, pronunciation, accent/logo, grounded_facts[] each WITH source_url). **STOP for the 30-second human eyeball — mandatory. A wrong fact in a demo is fatal; ungroundable facts are omitted, never guessed.**
2. `deploy-demo.ts <slug>` → seed `entities` (tenant=slug) → clone flagship assistant via Vapi API (patch prompt: persona + greeting + disclosure with THEIR name + facts block) → attach shared demo number (or per-demo if hot) → deploy branded site/widget via `data-*` config → write `demo_registry` row (expires_at = +14d).
3. `verify-demo.ts <slug>` → asserts disclosure string, facts in prompt, barge-in on; then the manual 4-check: disclosure ✓ · THEIR price quoted ✓ · absent-fact fallback ✓ · interrupt twice ✓.
4. **Loom (90s):** cold open on their business name → call on speaker → interrupt it mid-sentence → it quotes THEIR price → booking read-back → "already answering as YOUR business — want it on your number this week?"
5. `teardown-demo.ts` on the daily expiry cron: delete assistant, clear seed, mark archived.

## Hard rules (§39C)
Isolated demo tenants · per-demo call caps with auto-pause · 14-day auto-archive · demo labeled a demo · zero fake testimonials/reviews/metrics · registry row per run (it doubles as the outreach ledger — review weekly).

## Reference
Full spec: `references/40c-VOICE_v2_2_CONSOLIDATED.md` §39 · build prompt with gates: `references/P5_PERSONALIZATION_PIPELINE_BUILD_PROMPT.md`.

## Chains with (adjust names to installed skills)
- Consumes: **lead harvesting** (the prospect URL + business facts), **lead qualification** (HOT leads earn demos first), **voice-agent-build** (the flagship assistant is the clone source), **webchat-widget** (the `data-*` config surface), **script-generator** (greeting + objection lines per prospect config)
- Feeds: **outreach composition** (Loom link + send copy), **proposal writing** (a claimed demo → proposal), **client onboarding** (demo→production checklist on signature)
- This skill supersedes the old **demo generation** skill for prospect-personalized demos.
