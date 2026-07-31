# P2 — FLAGSHIP BUILD: "Harbour Estates" (UK real estate)
**Runnable build prompt. Days 6–9. 70% reuse of P1 — clone the repo/patterns, do not rebuild.**
Kits: same as P1. `progress.md` line 1: *"P2 flagship, 70% P1 reuse. Speed-to-lead outbound is UK-ONLY, consent-on-form. Demo tenant = harbour-estates."*

## 0. WHAT THIS DEMOS
*"An agency where every enquiry gets answered in seconds, qualified properly, matched to real listings with photos, and booked for a viewing — and web leads get a call back inside 60 seconds."* Fictional UK agency (Bristol). Seed 10–14 realistic listings into a `listings` table (address-ish, price, beds, type, 2–3 photos each from your own generated/stock-free images, status) + agency facts into `entities`.

## PHASE A — DATA (Day 6 AM) [GLM]
Clone P1 substrate; add `listings`, `viewings`, `enquiries` (+ qualification fields: budget, area, timeline, financing, buy/rent). Seed listings + facts.
**Gate A:** listings queryable by budget/area/beds; rows pasted.

## PHASE B — VOICE: buyer/renter qualification (Day 6 PM – Day 7) [Opus barge-in reuse; GLM]
Clone the P1 Vapi assistant via API (P5 rehearsal rep #1). Re-script with **V_05** (§2 pass for UK real estate: comparison-shopping mindset, politeness-gated; softer than trades; compliance note — UK ≠ US Fair-Housing wording but keep language neutral about protected characteristics anyway).
- Flow: disclose → buy/rent/sell? → qualify (budget, area, timeline, financing) → `match_listings` tool reads REAL rows → offer top 2 verbally → book viewing (read-back confirm) → "I'll WhatsApp you the property cards."
- **Speed-to-lead variant (UK ONLY):** site enquiry form → n8n → outbound call within 60s. Form contains explicit consent copy ("we'll call you back about your enquiry") stored on the lead row; agent's opener references THEIR enquiry. Gate the dial on consent-row-exists (`canDial()`-style even though UK — discipline transfers). **Do not build a US variant.**
**Gate B:** call → qualification fields persisted → viewing row · form-fill → outbound ring <60s with consent row pasted · Interrupter test passes post-rescript.

## PHASE C — WHATSAPP: the most visual demo you'll own (Day 8) [GLM]
Reuse the P1 pipeline. New intents: enquiry → qualify (buttons or a Flow if ≥3 structured inputs, 42c §22A) → `match_listings` → **property cards with images** (media messages: photo + price + beds + one line + "Book viewing" button) → viewing booked → confirm template. Cross-channel: voice's "I'll WhatsApp you the cards" actually fires it (40c v2.1 §28A).
**Gate C:** inbound "3-bed under £350k in Clifton" → 2 real cards with images → booked viewing row · voice→WhatsApp handoff message logged against the call.

## PHASE D — LISTINGS SITE + CHATBOT (Day 8 PM – Day 9 AM) [GLM]
P1 site skeleton, new content: listings grid + detail pages from the `listings` table (this makes the demo feel like a real agency). Widget (39c §34) becomes a **property-search assistant**: natural-language search over listings + agency FAQ; every chat captures the lead.
**Gate D:** widget answers "what's your cheapest 2-bed?" from real rows; lead row from a browse-only chat.

## PHASE E — CRM DRIP AUTOMATION (Day 9 PM) [GLM] — absorbs the old LeadFlow concept; standalone LeadFlow is dead
n8n: enquiry/form/chat lead → Airtable-or-Sheet CRM row → round-robin agent assignment → drip (instant ack → day-1 value message → day-3 new-matches → day-7 check-in) → **14-day recycle** (no response → back to nurture pool, flag for human). All sends suppression-checked; STOP honored across channels.
**Gate E:** one lead traced end-to-end through assignment + 2 drip touches (rows + message logs pasted).

## PHASE F — SALES ASSET
90-sec + 3-min Looms: form fill → phone rings in 60s → qualification → WhatsApp property cards land → viewing booked → CRM row appears. Close: "Every lead answered in 60 seconds, no agent lifted a finger."

## COST (approx — verify)
~$3–8/mo marginal on top of P0 base (optional 2nd Twilio number ~$1.15/mo; a few more test minutes; images $0 if self-generated). 

## DON'T BUILD
US speed-to-lead · portal integrations (Rightmove/Zoopla) · tenant referencing/payments · more than 14 listings. The demo sells the pattern, not the inventory.
