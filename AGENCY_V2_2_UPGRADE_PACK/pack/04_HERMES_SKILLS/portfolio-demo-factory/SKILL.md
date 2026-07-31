---
name: portfolio-demo-factory
description: Run the two-tier portfolio build program — the P0 master plan and the P1–P6 runnable build prompts (UK trades flagship, UK real-estate flagship, dental shelf demo, retail shelf demo, personalization pipeline, internal Command Center + Script Generator app), with the 13-day calendar, per-project costs, and gates. Use when the user says portfolio, build the demos, flagship demo, plumbing demo, real estate demo, shelf demo, P1 through P6, 13-day sprint, demo calendar, master plan, or "what do I build next".
---

# Portfolio Demo Factory (P0–P6)

## Route by request
| Ask | Run |
|---|---|
| plan / calendar / costs / "what next" | `references/P0_PORTFOLIO_MASTER_PLAN.md` |
| UK trades / plumbing flagship (voice hero + WhatsApp + widget + site + 3 automations) | `references/P1_...md` (Days 1–5) |
| real estate / listings / speed-to-lead flagship | `references/P2_...md` (Days 6–9, 70% P1 reuse) |
| dental shelf demo (site + widget + voice clone, HIPAA framing) | `references/P3_...md` (Day 10, hard cap) |
| retail / Aura Archives widget | `references/P4_...md` (Day 10, half day) |
| per-prospect personalization pipeline | `references/P5_...md` (Days 11–13) → then use **demo-personalization-pipeline** skill per prospect |
| Script Generator app / fleet board / Command Center | `references/P6_...md` (dead time ONLY) |

## Non-negotiables enforced across every P-file
Phase gates with pasted evidence · grounding lock + AI disclosure + STOP + injection tests even in demos (the prospect WILL test exactly these) · no fake testimonials/reviews/metrics, demos labeled demos · facts seeded to `entities` with provenance + human eyeball before any Loom · n8n/webhooks on Railway, never the laptop · **Day 3: first ten Looms go out with whatever exists · Day 14: building stops.** If a request would break the calendar, say so and route to outreach instead.

## Costs (P0 has the full table — approximate, verify)
Whole portfolio ≈ $18–45/mo (₹1,500–3,800) · per-prospect marginal ≈ $0.5–2 once P5 runs.

## Chains with (adjust names to installed skills)
- Orchestrates: **voice-agent-build** (P1/P2/P3 voice phases), **whatsapp-bot-build** (P1/P2), **webchat-widget** (P1–P4), **demo-personalization-pipeline** (P5), **script-generator** (P6 part 1 + every Loom's pitch lines), **fleet-orchestration** (P6 part 2 backend)
- Consumes: **lead harvesting** + **lead qualification** (which niche door a prospect enters), **supabase-backend-pro** (every substrate phase)
- Feeds: **outreach composition** (Looms + sends), **proposal writing** (demo → proposal), **client onboarding** (on signature), **company-os** (registry/progress land in the pipeline tracker)
