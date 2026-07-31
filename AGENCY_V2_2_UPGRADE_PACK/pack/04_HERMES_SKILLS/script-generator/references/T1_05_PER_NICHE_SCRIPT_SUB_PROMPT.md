# T1_05 — PER-NICHE SCRIPT SUB-PROMPT (AI-Employee Track)
**A separate, runnable build sub-prompt for the conversational scripts the fleet's customer-facing agents run.**
Paste into Claude Code when building an SDR or receptionist worker (T1_02 Phase F4). This does NOT just "write a script" — it runs a market-analysis pass first, then produces a reasoned script wired to your §27/§33 guardrails so it can't invent prices or skip disclosure. Self-contained; feeds the standalone Script Generator later.

---

## 0. THE RULE THAT MAKES THIS DIFFERENT
A script written without market analysis is a template. This sub-prompt refuses to output a script until it has done the analysis pass in §2 and stated its findings. If the inputs to run that pass are missing, it asks for them — it does not guess and it does not produce a generic script.

---

## 1. INPUTS REQUIRED (refuse to proceed without these)
- **Niche** (dental / HVAC / real estate / law / restaurant / salon / gym / insurance / solar / property mgmt / local biz)
- **Market** (IN / US / UK / CA / AU) — this changes tone, objections, compliance, and price framing more than the niche does
- **The specific business** (name, services, the 3–5 things that make it different, hours, service area)
- **The offer** (what the agent is trying to achieve: book / qualify / answer / recover)
- **Grounded data source** (where real prices/availability/policies live — the agent quotes ONLY from here)

---

## 2. MARKET-ANALYSIS PASS (mandatory — output findings before any script)
Run and state each of these. This is the "critical thinking + analysis according to market" layer.

1. **Buyer profile.** Who actually calls/messages this business in this market? Their state of mind (dental = often anxious/in-pain; HVAC = urgent/frustrated; law = stressed/cautious; real estate = comparison-shopping). Emotional state dictates tone before anything else.
2. **Objection map.** The real objections in this niche+market, ranked by frequency. E.g. US dental: "do you take my insurance?" leads. IN local biz: price sensitivity + trust ("are you legit?"). UK services: politeness-gated ("just enquiring"). Each objection needs a grounded, non-pushy response line.
3. **Incumbent baseline.** What does the current human receptionist or the competitor's bot sound like? The script must be *noticeably better* on the one axis that matters in this niche (dental = reassurance; HVAC = speed to dispatch; law = careful non-advice; restaurant = warmth). Name that axis.
4. **"Good" in this market.** What a great interaction sounds like here — pace, formality, whether small talk helps or annoys, how directness lands (direct works in HVAC/US; softer in UK/law; warm in IN local).
5. **Compliance overlay.** The non-negotiable lines for this niche+market: AI disclosure (always), "not legal advice" (law), no medical advice (dental/health), Fair Housing language limits (US real estate), price-quote discipline (all).

State findings as a short block. Then, and only then, write the script.

---

## 3. OUTPUT A — AGENT OPERATING SCRIPT (what the AI says)
Structure, wired to guardrails:
- **Open:** AI disclosure as the first sentence (§27/§33 hard rule) + a niche-tuned warm/urgent/careful greeting from the §2 buyer-state finding.
- **Discovery:** the 2–4 questions that qualify or resolve, ordered by what this buyer will answer first (from the objection map — lead with what they came for, not your form).
- **Objection lines:** one grounded response per top objection from §2.2. Never pushy; each ends by moving toward the offer.
- **Grounding lock:** every factual answer pulls from the grounded data source. If the fact isn't there: the "I don't have that handy — I'll have someone confirm" line, never an invented value.
- **Escalation triggers (verbatim):** anger, "I want a human," out-of-scope, low confidence → acknowledge + hand off with full context (§33.7).
- **Close:** confirm the irreversible action (booking/quote) read back for a yes before committing (§27 confirm rule).
- **Persona notes:** pace, formality, code-switching if the market needs it (e.g. Hinglish for IN — reuse Voice v2.1 §23C rules).

Output this as the agent's system-prompt script block + a table of (situation → line), so it's testable by the §27 eval harness.

## 4. OUTPUT B — HUMAN DEMO / SALES SCRIPT (what YOU say to sell it)
Kept separate from Output A. Structure:
- **Cold-open** for the outreach channel (WhatsApp/DM/call) — leads with the buyer's pain in §2.1, not your tech.
- **The demo line:** "I already built a working version for *your* business — here's the number, call it." (Your preview-first strategy — the demo IS the pitch.)
- **Objection responses for the OWNER** (the business owner's objections, not the caller's): "is it just a chatbot?" / "will it sound robotic?" / "what if it says the wrong price?" — each answered with what the system actually does (grounding lock, human gate, QA scoring).
- **The close:** the outcome framing from T1_03 §6 + the price, with your parent as the signing/payment entity.

---

## 5. VERIFICATION
- [ ] Market-analysis findings stated before the script (no findings = reject the output)
- [ ] Every factual line in Output A traces to the grounded source (no invented prices/hours)
- [ ] AI disclosure is the first sentence; escalation + confirm lines present
- [ ] Compliance overlay lines present for the niche+market
- [ ] Output A passes the agent's §27 injection + hallucination tests
- [ ] Output B leads with buyer pain, not tooling

---

## 6. WHY BOTH OUTPUTS
The agent script makes the product *work*. The sales script makes it *sell*. Most agencies write one and wonder why the other fails. You need the demo to survive a real prospect (Output A) and you need to convert the owner who watches it (Output B). This sub-prompt produces both from the same market analysis, so they're consistent — the thing you sell is the thing that runs.
