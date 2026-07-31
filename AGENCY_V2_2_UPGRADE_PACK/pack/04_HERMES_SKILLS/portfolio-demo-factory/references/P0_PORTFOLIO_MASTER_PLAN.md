# P0 — PORTFOLIO MASTER PLAN (two-tier, 13 days, costs, calendar)
**Source of truth:** the two-tier decision doc (uploaded as T1_01) + the v2.2 module set. This file is the index; P1–P6 are the runnable build prompts. Nothing here overrides the one rule that grades the 90 days: **Dheeraj's 100-trade UK list starts Day 1, first ten Looms go out Day 3 with the half-finished flagship, Day 14 the building stops.**

## THE MAP
| # | Project | Niche/Tier | Products demoed | Days | Prompt |
|---|---------|-----------|-----------------|------|--------|
| P1 | Rapid Response Plumbing & Heating | Home services · Tier-1 flagship | Voice (hero) + WhatsApp + widget + site + 3 automations | 1–5 | P1_... |
| P2 | Harbour Estates | Real estate · Tier-1 flagship | Voice qualification + WhatsApp listings + widget + listings site + CRM drip | 6–9 | P2_... |
| P3 | DentaCare Pro | Dental · Tier-2 shelf | Existing site polished + widget + cloned voice agent | 10 | P3_... |
| P4 | Aura Archives + widget | Local business · Tier-2 shelf | Existing 8.5/10 site + retail widget | 10 (½ day) | P4_... |
| P5 | Personalization pipeline | Cross-cutting weapon | Config→clone→Loom per prospect, <2h → <30min | 11–13 | P5_... |
| P6 | Command Center + Script Generator | Internal (ADDED project) | Fleet board + the X_01 engine as an app | parallel / post-14 | P6_... |

Every product is demonstrated at full depth somewhere; every niche has a door; ~13 build days total. P6 is the one project this system was missing: T1_02 §0 explicitly allows building the agency's own Command Center ahead of revenue, and X_01 §6–7 says the Script Generator is "the revenue piece" — it belongs in the portfolio as internal leverage, NOT as a fifth demo to procrastinate with. Build it in dead time only.

## BUILD CALENDAR (interleaved with the outreach track)
- **Day 1:** P1 phases A–B start · Dheeraj's list building starts · demo Twilio UK number bought
- **Day 3:** P1 voice demo callable (even rough) → **first 10 Looms out**
- **Day 5:** P1 complete + Loom v2 · outreach volume continues daily
- **Day 6–9:** P2 (70% reuse) · Looms now sent per-niche
- **Day 10:** P3 (1 day) + P4 (½ day) — shelf demos live
- **Day 11–13:** P5 pipeline — from here every prospect gets a personalized demo
- **Day 14:** building stops. Everything after is outreach, demos, calls, proposals. P6 only in gaps.

## COST MODEL (approximate mid-2026 figures — verify each before committing; prices move)
**One-time / build-phase (~₹850–2,500 total, ≈ $10–30):**
| Item | Est. |
|---|---|
| Twilio UK local number ×1 (demo) | ~$1–1.5/mo + ~$1 setup |
| Test call minutes during build (~150–300 min across Vapi/Twilio/Deepgram/TTS) | ~$8–25 |
| Domain (optional — vercel.app subdomains are free) | ~$10/yr |

**Monthly running (whole 4-demo portfolio + pipeline): ~$18–45/mo ≈ ₹1,500–3,800**
| Line | Est./mo | Notes |
|---|---|---|
| Vapi platform + per-min (STT/LLM/TTS/telephony pass-through) | $5–20 | ~$0.10–0.25/min all-in typical at demo volume (50–100 min/mo); Vapi bills platform fee + provider costs |
| Twilio numbers (1–2 UK) + inbound minutes | $2–5 | UK local ~$1.15/mo; inbound pennies/min |
| ElevenLabs | $0–5 | Free tier may cover demo volume; Starter $5 if not; Turbo v2.5 for English-only |
| Deepgram STT | $0–3 | ~$0.004–0.008/min; new accounts historically get free credits |
| OpenRouter (GLM-5.2) + Anthropic (Haiku for intent) | $2–6 | demo-volume chat/widget inference is pennies |
| Supabase | $0 | free tier: DB+Auth+Storage covers all demos |
| Vercel (sites + widget) | $0 | Hobby tier |
| Railway (n8n, always-on) | $5 | the "never your laptop" rule; Render free tier sleeps — don't use it for webhooks |
| Meta WhatsApp Cloud API | $0 | test number free (≤5 recipients); service-window replies free; you're not blasting templates in demos |
| Loom | $0 | free plan: 25 videos ≤5 min — enough; delete/re-record as needed |
| Langfuse | $0 | free/self-host tier |

**Per-prospect marginal cost once P5 runs:** ~$0.5–2 (a few call minutes + inference + zero new infra). That number is the whole point of P5.

**Per-project build-cost view:** P1 ≈ $10–20 one-time + owns most of the monthly base · P2 ≈ +$2–6/mo (optional 2nd number) · P3 ≈ ~$1–3 total (clone reuses everything) · P4 ≈ ~$0 · P5 ≈ $0 infra (scripting) · P6 ≈ $0 (Supabase+Vercel free tiers).

## GLOBAL RULES (apply to every P-file)
1. Kits loaded per project: P1/P2/P3 voice pieces → `AGENCY_KIT_VOICE` (+40c) · WhatsApp pieces → `AGENCY_KIT_WHATSAPP` (+42c) · sites/widget/automation/fleet → `AGENCY_KIT_V7` (+39c). Tool routing per V_02/W_02/T1_02 tables (GLM/Hermes = volume; Opus/Claude Code = barge-in, compliance, money, tenancy).
2. Every phase ends in a Gate with pasted evidence (kit law). `progress.md` line 1 states the project + scope decision.
3. Demo-grade ≠ sloppy: grounding lock, AI disclosure, STOP handling, and injection tests are NON-NEGOTIABLE even in demos — the prospect WILL test exactly these.
4. No fake testimonials/reviews/metrics anywhere in any demo. Label demos as demos.
5. All demo facts scraped/entered with provenance into `entities`; human-eyeball before any Loom goes out.
6. n8n + webhooks live on Railway. Nothing demo-critical runs on the ThinkPad.
