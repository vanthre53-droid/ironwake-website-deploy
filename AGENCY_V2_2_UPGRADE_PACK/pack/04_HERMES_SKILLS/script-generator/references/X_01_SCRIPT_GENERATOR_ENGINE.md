# SCRIPT GENERATOR ENGINE (cross-cutting)
**The master engine. T1_05 / W_05 / V_05 are channel adapters that call this core.**
It does not "write scripts." It runs a critical-thinking market-analysis pass, then routes to channel-specific output rules, and produces grounded, compliant, conversion-shaped scripts. This is the closest thing in your whole system to money — scripts are what convert a demo into a signature.

---

## 0. THE REFUSE RULE
No output is produced until (a) the ANALYSIS ENGINE (§2) has run and its findings are stated, and (b) a grounded data source is provided. Missing either → the generator asks for it. It never emits a generic, ungrounded script. A script without analysis is a template, and templates are why most agency outreach gets ignored.

## 1. INPUTS
- **Niche** · **Market** (IN/US/UK/CA/AU) · **Channel** (voice / whatsapp / web-widget / cold-DM / email / cold-call)
- **Business** (name, differentiators, hours, service area) · **Offer** (the one outcome this script drives)
- **Grounded source** (real prices/availability/policies — quoted-only, never invented)
- **Who the script is for** (the AI agent/bot, OR the human doing outreach — different output, §4)

---

## 2. THE ANALYSIS ENGINE (channel-agnostic core — this is the "critical thinking")
Run all seven. State findings before any script.

1. **Buyer job + emotional state.** What is the buyer actually trying to get done, and how do they feel doing it? (Dental caller = anxious/in-pain; HVAC = urgent/frustrated; law = stressed/cautious; a business owner reading your cold DM = skeptical/busy.) Emotional state sets tone before words.
2. **Objection ladder.** For each top objection, dig from surface → real → root:
   - Surface: "it's too expensive" → Real: "I don't see the value" → Root: "I don't believe it'll work for a business like mine."
   Write the grounded response to the ROOT, not the surface. This is the single highest-leverage analytical move — most scripts answer the surface and lose.
3. **Incumbent baseline + winning axis.** What does the current human / competitor bot sound like, and the ONE axis to beat them on (dental=reassurance, HVAC=speed, law=careful non-advice, cold outreach=relevance-to-them). Everything else stays quiet; win one axis hard.
4. **Market/cultural calibration.** Tone, directness, trust cues, language + code-switching (Hinglish for IN local, §23C), price framing (IN=value/₹ framing, US=insurance/financing, UK=understated). The same words land differently by market — this is why market matters more than niche.
5. **Channel physics.** How the medium changes the message (§3 routing).
6. **Compliance overlay.** AI disclosure (always for agents), niche rules (no medical/legal advice, Fair Housing), channel rules (TCPA voice, template categories WhatsApp, email CAN-SPAM/deliverability, opt-out everywhere).
7. **Conversion spine.** Name the ONE outcome and the SINGLE call-to-action. A script with two CTAs converts on neither. State it, and make every line serve it.

---

## 3. CHANNEL ADAPTERS (route the analysis into the right output shape)

| Channel | Physics | Output rules |
|---------|---------|--------------|
| **Voice** | real-time, audible tone, no visuals | ≤200 tokens/turn (latency, §29); barge-in behavior noted (§V_01); TTS pronunciation; disclosure first sentence |
| **WhatsApp** | async text, 24h window, categorized templates | free-window-first (§31); Flow vs buttons (§22A); template copy is a separate artifact, per-language (§W_01) |
| **Web-widget** | instant, on a page with SEO, visual | tighter, can show rich UI; grounding lock; captures lead even if no conversion |
| **Cold-DM** | uninvited, skimmed in 2 seconds | pattern-interrupt open about THEM, not you; one line of proof; one soft CTA; brutally short |
| **Email** | uninvited, deliverability-gated | subject line does 80% of the work; short body; one CTA; no spam-trigger language; plain-text feel |
| **Cold-call** | human-delivered, live objections | permission-based open; the human runs it, so it's a flexible frame, not a rigid read |

## 4. OUTPUTS (produce the ones the input asks for)
- **A — Agent/bot script** (when for the AI): grounded, disclosure, discovery, objection-ladder responses, confirm-before-commit, escalation, channel-specific brevity/format. Testable by the relevant critic (§27) + injection/hallucination tests.
- **B — Human outreach/sales script** (when for you/Dheeraj): pain-first open, the preview-first demo line ("I already built a working version for your business"), owner-objection responses (the owner's objections, not the customer's), close with outcome framing + price + parent as signing entity.
- **C — Channel artifacts** (as needed): WhatsApp template copy (categorized, per-language), email subject variants, DM openers.

## 5. QUALITY GATES
- [ ] All 7 analysis findings stated before output
- [ ] Objection responses target the ROOT objection, not the surface
- [ ] One outcome, one CTA (conversion spine)
- [ ] Every fact grounded; disclosure + escalation present in agent scripts
- [ ] Market calibration applied (not a US script relabeled for IN)
- [ ] Compliance overlay present for niche+channel+market
- [ ] Agent scripts pass the channel critic + hallucination test

## 6. WIRING IT INTO THE COMMAND CENTER APP
Expose as an interactive generator:
1. **Input form:** niche · market · channel · business + differentiators · offer · grounded-source link · audience (agent/human).
2. **Analysis panel (show the work):** render the 7 findings so YOU see the reasoning before the script — this is what makes it trustworthy and what a client would pay for. Don't hide it.
3. **Output tabs:** Agent script · Human script · Artifacts.
4. **Library + versioning:** save every generated script keyed by niche+market+channel; version on edit (reuse the prompt-registry idea, T1 §33.8) so you build a reusable, improving script bank instead of regenerating from zero each time.
5. **Grounding link:** the generator reads the real price/availability source so scripts are never stale (T1 §33.5).

## 7. WHY THIS IS THE REVENUE PIECE
Every other file in this system makes the product *work*. This one makes it *sell* — both the agent that survives the prospect's test call and the outreach that gets the call in the first place. If you build one generator in your Command Center this quarter, build this one, and point it at your actual target niches in your actual market. Then use its Output B today, on a real prospect. That is the shortest line in this entire 16-file system between what you've built and a signature.
