# W_05 — PER-NICHE SCRIPT SUB-PROMPT (WhatsApp)
**A separate, runnable build sub-prompt for WhatsApp conversation scripts AND template copy.**
Runs a market-analysis pass first, then produces reasoned, grounded, Meta-compliant output. Self-contained; feeds the standalone Script Generator.

---

## 0. THE RULE
No script or template copy is written until the §2 market-analysis pass is done and stated. WhatsApp adds three constraints voice doesn't have: it's **async text**, it's governed by the **24h window**, and every business-initiated message outside the window is a **categorized template** (utility/marketing/auth). The script must respect all three.

## 1. INPUTS (refuse without these)
- Niche · Market (IN/US/UK/CA/AU) · Language(s) · the business + its differentiators · the offer · grounded data source · whether Pay/Catalog/CTWA are in scope.

## 2. MARKET-ANALYSIS PASS (state findings first)
1. **Channel behavior by market.** How people actually use WhatsApp with businesses here. IN: primary channel, high trust, transactional expectation, price-first. US: emerging, often ad-driven (CTWA), consent-sensitive. UK/CA/AU: growing, politeness-gated, spam-averse. This sets tone and how forward the bot can be.
2. **Objection map (text-specific).** In chat, objections are shorter and faster to ghost. Rank them; each gets a tight grounded line that moves toward the offer without pushiness.
3. **Incumbent baseline.** What the business's current WhatsApp looks like (usually: slow human replies, or nothing). The bot must beat it on *speed + always-on*, which is WhatsApp's core advantage — name it.
4. **Window & template economics.** Which interactions can stay inside the free 24h window vs which need a template. Design the conversation to maximize free-window resolution (§31) — this is the client's margin, and it's a selling point.
5. **Compliance overlay.** AI disclosure; template category discipline (marketing only to opt-in); STOP honored (W2); per-language approval (W4); niche rules (no medical/legal advice where applicable).

## 3. OUTPUT A — BOT CONVERSATION SCRIPT (what the bot says)
- **Open:** AI disclosure + niche/market-tuned greeting (short — it's chat).
- **Intent routing lines:** how the bot recognizes and responds to each top intent.
- **Flow triggers:** when to launch a Flow vs buttons/lists (≥3 structured inputs → Flow, v2.1 §22A). Specify which Flow.
- **Objection lines:** grounded, one per top objection.
- **Grounding lock:** every fact from the source; the "let me confirm that for you" line when absent — never invent.
- **Window tactics:** the soft re-engagement close (§31B) to keep the window free.
- **Escalation (verbatim):** complaint / "human" / out-of-scope → handoff with context.
- **Confirm:** read back before any booking/payment.

## 4. OUTPUT B — TEMPLATE COPY (per niche + language)
For each template in the §28 library relevant to this niche:
- Correct **category** (utility for transactional, marketing for promo, auth for OTP only).
- Copy with numbered variables `{{1}} {{2}}` mapping to the same data across languages.
- **Per-language versions** (W4) — native-quality, not machine-literal.
- Sample values (Meta requires).
- Buttons within limits (≤3 quick replies or ≤2 CTAs).
- No promo language in utility templates (category-downgrade risk, §28H).

## 5. OUTPUT C — HUMAN SALES SCRIPT (what YOU say to sell it)
- **Cold-open** for the channel (often a WhatsApp/DM message itself — practice what you preach): leads with the owner's pain (missed after-hours enquiries, slow replies losing customers).
- **The demo:** "Message this number right now — it's already set up for a business like yours." Preview-first.
- **Owner objections:** "is it just autoreply?" / "will it annoy my customers?" / "what about wrong info?" → grounded answers (grounding lock, window-respecting, STOP-honoring, quality-protected).
- **Close:** outcome framing (W_03 §6) + price + parent as signing entity.

## 6. VERIFICATION
- [ ] Market findings stated before any output
- [ ] Every bot line grounded; disclosure + escalation + confirm present
- [ ] Templates categorized correctly, per-language, within button limits, opt-in respected
- [ ] Window tactics present (free-first)
- [ ] Output A passes injection + hallucination tests
- [ ] Output C leads with owner pain, not tooling

## 7. WHY THREE OUTPUTS
Voice needed two (agent + sales). WhatsApp needs three because **templates are their own artifact** — Meta-governed, categorized, per-language, and a frequent rejection point. Get the template copy wrong and the bot can't message outside the window at all. The conversation script, the templates, and the sales pitch all derive from the same market analysis, so they stay consistent.
