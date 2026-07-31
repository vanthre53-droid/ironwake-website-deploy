# P1 — FLAGSHIP BUILD: "Rapid Response Plumbing & Heating" (UK home services)
**Runnable build prompt. Days 1–5. The hero demo — every other project reuses its parts.**
Paste into your orchestrator (Hermes/GLM for volume phases; Claude Code/Opus for the flagged ones). Kits: AGENCY_KIT_VOICE + 40c · AGENCY_KIT_WHATSAPP + 42c · AGENCY_KIT_V7 + 39c (§34 widget). `progress.md` line 1: *"P1 flagship. Inbound-only voice (V_02 §0). Single instance, no multi-WABA (W_02 §0). Demo tenant = rapid-response."*

## 0. WHAT THIS DEMOS (the sell, verbatim from V_03/W_03 §6 style)
*"A plumbing firm that answers every call in under a second at 11pm, books the emergency, texts the confirmation, chases the quote, and asks for the review in the morning — without hiring anyone."* One fictional but realistic UK business: Rapid Response Plumbing & Heating, Manchester; services: emergency call-outs, boiler repair/service, bathroom installs; grounded price list of 8–12 REAL-typical UK prices you write into `entities` (e.g. call-out fee, boiler service fixed price) — provenance noted as "demo canonical sheet".

## PHASE A — SUBSTRATE (Day 1 AM) [GLM]
Supabase project `p1-rapid-response`: `entities` + `knowledge_chunks` (39c §33.4 schema), `leads`, `bookings`, `voice_calls` (+QA/latency/transfer columns, V_02 P1), `conversations`/`messages` (WhatsApp), `scheduled_callbacks`, `suppression_list`. RLS on; demo tenant row. Seed the grounded price/hours/service-area facts.
**Gate A:** schema + seeded entity rows pasted; cross-tenant read empty.

## PHASE B — VOICE AGENT, the hero (Day 1 PM – Day 2) [Opus for barge-in + grounding; GLM persona/tools]
Follow **V_02 single-client carve-out (§5)** exactly: P1→P6-lite.
- Vapi assistant via API/MCP loop — never the dashboard (this discipline IS the P5 pipeline rehearsal). Runtime LLM fast+cheap (GPT-4o-mini / Flash / Haiku). **British voice**; Twilio UK number attached.
- **Barge-in FIRST** (40c §33): yield-on-speech on, acknowledge-and-continue for the disclosure + price confirmations, backchannel tolerance, min-2-words interrupt, threshold tuned up (tradesmen call from vans — noisy).
- Persona: fast, action-first, warm-but-brisk (40c §26 HVAC-adjacent). Disclosure literal first sentence.
- Emergency triage flow: "emergency or booking?" → emergency: capture address+issue+access, read-back confirm, book earliest slot, promise SMS · non-emergency: 2–3 discovery Qs → book.
- Tools (<800ms each): `get_services`, `check_availability`, `book_appointment`, `log_lead`. Confirm-before-commit on booking.
- Grounding lock live (40c v2.1 §-map + 39c §33.5 stale-block): change a price mid-test → agent re-grounds.
- Script via **V_05** (run its §2 market pass for UK/home-services BEFORE writing lines; ≤200 tokens/turn).
**Gate B (paste all):** Interrupter test 5/5 with disclosure never truncated · booking row from a real call · stale-price re-ground · 20-call test protocol sheet started (personas: emergency, price-shopper, rambler, interrupter, wrong-number).

## PHASE C — WHATSAPP BOT (Day 3) [GLM; Opus reviews stale-block]
Follow **W_02 single-client carve-out (§5)**: P1-lite webhook (HMAC verified) → P2 pipeline (Meta **test number**; intent Haiku → grounded response; buttons/lists) → P3 grounding (same `entities`) → P4 two templates approved (booking confirm = utility; follow-up = utility) → P6 quality monitor wired → P7 STOP/START (42c §34 — test it) → P9 CSAT scoring.
Intents: **quote-with-photo** (photo in → acknowledge + create lead + "a human will price this within the hour" — honest, no fake CV pricing), book, job-status, FAQ. Brain = n8n on Railway → GLM-5.2 via OpenRouter → Supabase memory. Demo recipients registered per 42c §38A (yours + Dheeraj + slot for prospect).
**Gate C:** grounded reply to a real inbound · photo-quote lead row · STOP → suppressed + blocked send pasted.

## PHASE D — SITE + WIDGET (Day 4 AM) [GLM]
One-page Next.js/Vercel site (its only jobs: host the widget, look real in the Loom): hero, services with the grounded prices, service-area, "open 24/7 — call or chat", the Twilio number, WhatsApp click-to-chat link. **Widget per 39c §34**: RAG over the seeded KB, routed through the same n8n intent brain, lead capture, disclosure, injection tests 5/5.
**Gate D:** widget grounded answer + absent-fact fallback + lead row + Lighthouse ≥90 pasted.

## PHASE E — THE 3 AUTOMATIONS (Day 4 PM) [GLM] — the part tradesmen understand instantly
n8n on Railway: (1) **missed-call text-back** — Twilio missed/failed call webhook → SMS/WhatsApp "Sorry we missed you — book here / reply and we'll call back" → lead row; (2) **review request** — booking marked complete → next-morning message with Google-review link (one send, suppression-checked); (3) **3-touch quote follow-up** — quote lead untouched → day 1 / day 3 / day 7 messages, stop on reply or STOP.
**Gate E:** each flow fired once with evidence rows; all sends suppression-checked.

## PHASE F — SALES ASSET (Day 5) 
3-minute Loom, one continuous story: **11pm call** (you, on speaker, interrupting the agent mid-sentence — barge-in is the demo weapon) → agent triages + books + read-back → **SMS/WhatsApp confirmation on screen** → **morning review-request** fires → widget answering a price question on the site. End frame: "This is a demo build. Yours answers as YOUR business — I can have that live this week." Also record the 90-sec cut for cold sends.
**Gate F:** Loom link + the 20-call test sheet complete (≥18/20 pass; any compliance fail = fix first).

## COST (approx — verify)
Build: ~$8–18 test minutes + $1–1.5/mo number. Running: rides the P0 base (~$15–30/mo attributable). Demo call cap: 30 min/day auto-pause (40c §39C).

## DON'T BUILD
Outbound calling (TCPA/PECR risk, V_02 §0) · multi-WABA · payments · client dashboard beyond a minimal call log. Day-3 rule: the Loom goes out with whatever exists — polish never delays outreach.
