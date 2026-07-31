# P4 — SHELF DEMO: Aura Archives + Retail Widget (local business)
**Runnable build prompt. Half a day, Day 10. Aura Archives is your one actually-shipped build (8.5/10) — it IS the demo. This adds the AI layer and cleans the labeling. Lowest-ticket, most price-sensitive niche: it does not earn more build than this.**

## PHASE A — AUDIT PASS (≤1h) [GLM]
- Label it a demo build (footer + about line). **Strip anything resembling fake testimonials, invented review counts, or placeholder trust badges** — the standing audit rule.
- Confirm the admin panel demo path still works for a 30-second screen-share (the "full admin panel" is a genuine differentiator vs template shops — show it).
- Known-missing (Stripe, AI features) stays missing; the widget below IS the AI feature now. If asked about payments: "checkout integration is a delivery item, not a demo item."

## PHASE B — RETAIL WIDGET (≤3h — same P1/39c §34 code) [GLM]
RAG corpus = the jewelry catalog (names, materials, price bands, care/shipping/returns policies → `knowledge_chunks` + price facts → `entities`).
Behaviors: **product recommendations** ("something under ₹15k for an anniversary" → 2–3 real catalog items with links) · **product Q&A** (materials, sizing, care — grounded only) · **order status** (demo: looks up a seeded orders table by order # — honest demo data in `seeds/`, labeled) · **lead capture** (name+WhatsApp for "notify me / custom enquiry"). Disclosure on; escalation to "message the owner" path; injection tests on the new corpus.
**Gate B (paste):** recommendation citing real catalog rows · a policy answer with its chunk · order-status lookup on seeded row · absent-fact fallback · lead row · 5/5 injection · Lighthouse ≥90 with widget.

## PHASE C — 60-SECOND LOOM
A retail chatbot on a real storefront: ask for a gift rec → get real products → ask a care question → check an order → drop a lead. Close: "This runs on your existing site with one script tag."

## VOICE / WHATSAPP / AUTOMATION — shown via flagships when asked. Not built here.

## COST (approx)
~$0 marginal (existing site, free tiers, pennies of embedding+inference). Hard time cap: half a day. If Phase B overruns, cut order-status first — recommendations are the wow.
