# P3 — SHELF DEMO: DentaCare Pro (dental, US-framed)
**Runnable build prompt. Day 10, ONE day, hard cap. Rule: finish to demo-grade, do NOT rebuild.**
Status honesty: DentaCare Pro was **scoped, not shipped** — this day converts the scope into a deployed demo using ONLY parts that already exist (P1 widget code, P1 Vapi assistant, existing site scaffold). Zero new outreach, zero new infrastructure (Tier-2 rule). If a dental prospect lands in the inbox, you have something to show within the hour — that is this project's entire job.

## PHASE A — SITE TO DEMO-GRADE (morning, ≤3h) [GLM]
Take the DentaCare Pro scaffold as-is → polish pass only: real-looking services/pricing page (grounded demo price sheet → `entities`, provenance noted), hours, insurance-FAQ page, deploy to Vercel. **Strip anything resembling fake testimonials/reviews/ratings** (same rule as the Aura audit). Label footer: "Demo build by [agency]".
**Gate A:** live URL; grep shows zero testimonial/fake-metric strings.

## PHASE B — WIDGET DROP-IN (≤2h — it's the same code) [GLM]
P1 widget embedded, RAG'd on services/pricing/insurance FAQ chunks. Dental tone via **T1_05/V_05 §2 findings**: anxious/in-pain caller → reassurance is the winning axis; **no medical advice** — symptom questions get the "book an exam, the dentist will assess" line, never diagnosis. Disclosure on. Injection tests re-run (new corpus = new run).
**Gate B:** grounded insurance answer · medical-question deflection verbatim · lead row · 5/5 injection.

## PHASE C — VOICE CLONE (afternoon) [GLM; this is P5's dry run — do it via API/MCP only]
Clone the P1 Vapi assistant per **40c §39B**: copy assistant → swap prompt to dental (appointment booking + rescheduling + hours + insurance-FAQ; persona = warm, unhurried, reassuring; disclosure first; barge-in settings inherited, threshold lowered — quiet clinic callers) → seed dental `entities` → attach demo number (share P1's number with a menu, or a cheap 2nd number). Re-run the 2-min verify protocol (39B step 5) + Interrupter test.
**Gate C:** call books an appointment row · dental price quoted from entities · time-from-start logged (this number seeds P5's <2h target).

## WHATSAPP + AUTOMATION — NOT BUILT (by design)
If a dental prospect asks: demo the P1 trades WhatsApp bot and say "same system, your intents." Honest, and it works.

## COMPLIANCE FRAMING (say it in the pitch, price it in)
Demo is fine as-is. **US dental delivery = HIPAA**: PHI never in logs/Sentry, BAA-covered vendors only, encrypted at rest/in transit, access audit-logged (39b §28A line). The pitch line: "The demo shows the experience; production runs on BAA-compliant infrastructure — that's included in the delivery price." Never claim the demo itself is HIPAA-compliant.

## COST (approx — verify)
~$1–3 total (clone minutes + inference). Optional 2nd number +$1.15/mo. Time cap: if Phase C isn't done by end of day, ship A+B and clone on demand — the calendar outranks completeness.
