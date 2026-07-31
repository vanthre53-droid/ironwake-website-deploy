# P5 — THE PERSONALIZATION PIPELINE (Days 11–13 — "the actual weapon")
**Runnable build prompt. Implements 40c §39 end-to-end as scripts, not vibes. Target: prospect URL → live personalized voice demo + branded page + 90-sec Loom in <2 hours; <30 min by week 3. The P3 dental clone was rep #1 — this productizes it.**
Kits: VOICE (+40c §39) · V7 (+39c §34 widget config surface). `progress.md` line 1: *"P5 pipeline. Demos are isolated tenants with caps + 14-day auto-archive."*

## PHASE A — THE CONFIG CONTRACT (Day 11 AM) [GLM]
`demos/<slug>/config.json` schema exactly per 40c §39A (business name, services, area, hours, greeting, persona id, voice id, pronunciation, accent/logo, grounded_facts[] each with source_url). JSON-schema validate; a config that fails validation cannot deploy.
**Gate A:** schema + one hand-written config validating.

## PHASE B — SCRAPE→CONFIG GENERATOR (Day 11 PM) [GLM; Opus reviews the fact-extraction prompt]
`scripts/gen-config.ts <url> <niche> <market>`: fetch prospect site (+ GBP data if given) → Claude extracts services/hours/area/3–10 quotable facts WITH the exact source URL per fact → drafts config → **prints a human-review diff and STOPS**. The human eyeball (30s) is a mandatory pipeline step — a wrong fact in a demo is fatal (40c §39B.1). Facts that can't be grounded are simply omitted, never guessed (kit rule §2.1).
**Gate B:** run on 2 real UK trade sites from Dheeraj's list → 2 reviewed configs.

## PHASE C — CLONE + DEPLOY SCRIPTS (Day 12) [Opus for the Vapi API sequencing; GLM for the site script]
`scripts/deploy-demo.ts <slug>` (idempotent — re-run = update, not duplicate):
1. Seed/refresh `entities` for tenant `<slug>` from config facts.
2. Vapi API: clone flagship assistant → patch system prompt (persona + greeting + disclosure with THEIR name + grounded-facts block) → attach the shared demo number (menu key per active demo) or a per-demo number if hot prospect.
3. Vercel: deploy the site template with config branding (env/`data-*` injection) → `<slug>.your-demos.vercel.app`.
4. Write `demo_registry` row (prospect, config path, assistant id, number, URL, expires_at = +14d).
`scripts/teardown-demo.ts <slug>` deletes assistant, clears seed, marks archived — wired to a daily expiry cron (40c §39C cost hygiene). Per-demo call cap enforced.
**Gate C:** deploy one demo end-to-end from a Phase-B config; paste registry row; run teardown on a scratch slug and paste the deleted-assistant response.

## PHASE D — VERIFY + LOOM PROTOCOL (Day 13 AM) [GLM]
`scripts/verify-demo.ts <slug>` automates the 2-min protocol where possible (assistant config asserts: disclosure string present, grounded facts in prompt, barge-in settings on) + a manual 4-line checklist print (call it: disclosure ✓ · their price ✓ · absent-fact fallback ✓ · interrupt twice ✓). Then the standard 90-sec Loom shape: cold open on THEIR business name → call on speaker → interrupt it → it quotes THEIR price → booking read-back → "already answering as your business — want it on your number this week?"
**Gate D:** one fully verified demo + its Loom recorded end-to-end, wall-clock time logged.

## PHASE E — THROUGHPUT DRILL (Day 13 PM)
Run the whole chain on 3 prospects from the live outreach list back-to-back. Log per-stage minutes into `demo_registry`. Anything >2h total → name the slow stage in `progress.md` and fix THAT next, nothing else.
**Gate E:** 3 registry rows with timings; Looms handed to the outreach track.

## COST (approx — verify)
$0 new infra. Marginal per prospect ~$0.5–2 (call minutes + inference + embeddings). Shared demo number strategy keeps numbers at 1–2 total.

## RULES
Isolated demo tenants, caps, 14-day expiry, demo-labeled, zero fake social proof (40c §39C). The pipeline exists to FEED outreach — if Dheeraj's list is empty, building P5 faster changes nothing. Registry doubles as the outreach ledger; review it in the weekly 15-min ops slot.
