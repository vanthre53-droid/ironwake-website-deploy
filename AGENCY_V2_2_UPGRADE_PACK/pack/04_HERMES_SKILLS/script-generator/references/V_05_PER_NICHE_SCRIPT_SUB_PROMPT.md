# V_05 — PER-NICHE SCRIPT SUB-PROMPT (Voice)
**A separate, runnable build sub-prompt for the voice agent's conversation script + persona.**
Runs a market-analysis pass first, then produces a reasoned, grounded, latency-aware voice script. Self-contained; feeds the standalone Script Generator.

---

## 0. THE RULE
No script until the §2 market-analysis pass is stated. Voice has the hardest constraints of the three channels: **real-time (latency budget forces brevity), no visual fallback (except DTMF), turn-taking/barge-in, and TTS pronunciation.** A voice script that reads well but is too long per turn will breach the latency budget and sound robotic.

## 1. INPUTS (refuse without these)
- Niche · Market (IN/US/UK/CA/AU) · Language mode (single/caller-picks/auto-detect, §23A) + languages · the business + differentiators · the offer (inbound answer/book, or outbound) · grounded data source · persona choice from §26 library.

## 2. MARKET-ANALYSIS PASS (state findings first)
1. **Caller emotional state by niche.** This dominates voice more than any other channel because tone is audible. Dental = anxious/in-pain → warm, unhurried, reassuring. HVAC = urgent/frustrated → fast, action-first. Law = stressed/cautious → measured, careful, never casual. Restaurant = casual → warm, brisk. Match the §26 persona to this.
2. **What "good" sounds like in this market.** Pace, formality, small-talk tolerance, how directness lands. Direct works US/HVAC; softer UK/law; warm IN local. Whether code-switching (Hinglish) is expected (§23C) — for IN local, usually yes.
3. **Objection map (spoken).** Voice objections come fast and the caller can hang up instantly. Rank them; each gets a SHORT grounded response (voice = brevity). "Do you take my insurance?" (US dental) leads; "kitna charge hoga?" (IN) leads.
4. **Latency-forced brevity.** Every turn ≤200 tokens (§29 caps this for a reason). The script must say the necessary thing in the fewest words — long explanations kill the budget and bore the caller.
5. **Compliance overlay (spoken).** AI disclosure as the literal first sentence; "not legal advice" on any legal question (law); no medical advice (dental/health); price discipline; TCPA disclosure if outbound.

## 3. OUTPUT A — AGENT VOICE SCRIPT (what the agent says)
Wired to guardrails + latency:
- **Disclosure line:** verbatim first sentence (persona-tuned but always discloses AI).
- **Greeting:** from §26 persona + §2.1 emotional state.
- **Discovery:** 2–3 short questions, ordered by what this caller answers first.
- **Objection lines:** one short grounded response each.
- **Grounding lock:** DB facts only; the "let me have someone confirm that exact number" line when absent — never invent (a wrong spoken price is worse than a text one; the caller acts on it immediately).
- **Barge-in behavior notes:** which lines yield-on-speech vs finish-then-yield (disclosures finish, §33A).
- **Confirm:** read back the booking/action for a spoken "yes" before committing.
- **Escalation (verbatim):** "I want a human" / anger / out-of-scope → acknowledge + warm transfer with summary (§34).
- **Pronunciation notes:** business name, uncommon terms, and TTS engine choice (Turbo v2.5 English-only vs Multilingual v2 otherwise, §23B).
- **DTMF fallback lines** for the 1–2 high-stakes branch points (§37).

Output as the agent config script + a (situation → line) table testable by the §27 call-critic and the §12 test matrix (including the "Interrupter" row, §33C).

## 4. OUTPUT B — HUMAN SALES SCRIPT (what YOU say to sell it)
- **Cold-open** leading with owner pain: missed after-hours calls = lost jobs; a human receptionist can't answer at 9pm.
- **The demo:** "Call this number right now — talk over it, try to trip it up." (Barge-in is your demo weapon — let them interrupt it and watch them be surprised.)
- **Owner objections:** "will it sound like a robot?" (→ let them hear it), "what if it says the wrong price?" (→ grounding lock), "is this even legal?" (→ AI disclosure + TCPA discipline).
- **Close:** outcome framing (V_03 §6) + price + parent as signing entity.

## 5. VERIFICATION
- [ ] Market findings stated before the script
- [ ] Every turn ≤200 tokens; every fact grounded
- [ ] Disclosure first sentence; barge-in notes present; confirm + escalation lines present
- [ ] Compliance overlay for niche+market; pronunciation + TTS engine specified
- [ ] Output A passes call-critic + the Interrupter test
- [ ] Output B's demo leans on barge-in ("try to interrupt it")

## 6. WHY THE DEMO IS THE PITCH (voice edition)
For voice, the sales script barely matters next to the live demo. A prospect who calls your number, talks over the agent, and hears it yield naturally and quote *their* real prices is 80% sold. Build Output A so well that Output B is almost just "call the number." That's the whole game for voice — the product demos itself if barge-in (§33) and grounding (§V_02 P4) are right.
