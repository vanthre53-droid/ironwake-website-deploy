# ██████████████████████████████████████████████████████████
# VOICE AGENT v2.2 CONSOLIDATED MODULE — APPEND TO File 40 (after v2.0)
# = v2.1 SPINE (§23–§32) + v2.2 GAP CLOSURE (§33–§38, verbatim from
#   V_01) + §39 DEMO-CLONE PIPELINE (net-new, powers portfolio P5).
#
# ⚠ PROVENANCE NOTE: your 40b-VOICE_v2_1_ADDENDUM.md did not upload,
# so §23–§32 below is a RECONSTRUCTED SPINE — every section number,
# scope and rule recovered from AGENCY_KIT_VOICE (CLAUDE.md, skills
# INDEX, LATENCY_BUDGET.md, call_qa_scoring, tcpa_outbound_setup) and
# the cross-references in V_01–V_05. If you still have the full 40b
# text, paste it OVER this spine — the spine is correct but compact;
# your original prose is richer. Everything from §33 onward is exact.
# RULE: ADDITIVE. Nothing in v2.0/v2.1 is removed.
# ██████████████████████████████████████████████████████████

# ═══════════════ v2.1 SPINE (§23–§32, reconstructed) ═══════════════

## SECTION 23 — MULTI-LANGUAGE STACK
- **23A Language modes:** single-language · caller-picks (menu at open) · auto-detect (first-utterance detection, confirm on low confidence). Persist choice on the call row and CRM contact.
- **23B Engine routing:** ElevenLabs **Turbo v2.5 for English-only** (faster + cheaper), **Multilingual v2 otherwise** — never Multilingual for English-only (CLAUDE.md §12). Deepgram STT language/endpointing configured PER LANGUAGE. Skill: `multilang_voice_setup`.
- **23C Code-switching:** Hinglish (and Telugu-English for AP clients) is normal speech for IN local callers — the agent must parse and mirror it naturally, not force pure-English or pure-Hindi turns.

## SECTION 24 — MULTI-AGENT TRIAGE + SPECIALISTS
- **24A:** Triage agent (Haiku, ~200-token system prompt, <400ms classify) identifies intent → **hot-swaps** to the specialist (sales/support/billing/scheduling) mid-call.
- **24B:** Shared call state travels with the swap — the caller NEVER repeats themselves; the swap is invisible (feels like one person).
- **24C:** Log `call_agents_used` (journey) + intent confidence per hop; routing accuracy is a tracked KPI (V_03 §2B).

## SECTION 25 — TCPA-SAFE OUTBOUND (highest-risk surface)
- **25A Consent:** verifiable prior express written consent per contact; consent source stored (`outbound_consent`).
- **25B Suppression:** `suppression_list` (E.164-keyed) — DNC + user opt-outs; shared pattern with WhatsApp W2/§34.
- **25C `canDial()` before EVERY dial** — consent ✓ + not suppressed ✓ + inside dial window (local time) ✓ + frequency cap ✓. Bypassing it is a P0 (CLAUDE.md §2.6). One-to-One consent rules honored.
- **25D AMD:** answering-machine detection; a dropped compliant VM counts as a call under TCPA (same consent). Loop closure is v2.2 §38. Skill: `tcpa_outbound_setup`; agent: `tcpa-compliance-checker`.

## SECTION 26 — PERSONA LIBRARY
Named personas per niche (pace, warmth, formality, small-talk tolerance) mapped to caller emotional state (dental=reassuring-unhurried · HVAC=fast-action-first · law=measured-careful · restaurant=warm-brisk). Persona = system-prompt block + voice choice + pronunciation notes (business name, local terms). Skill: `voice_persona_design`. V_05 §2.1 selects from here.

## SECTION 27 — AUTO CALL-QA (every call graded)
- Cron every 15 min on completed calls → `call-critic` agent scores **5 dimensions 0–100**: resolution · compliance · hallucination · sentiment · latency (rubric verbatim in `.claude/skills/call_qa_scoring.md`).
- **27D thresholds:** overall <70 → flagged for review · **compliance <90 → P0 alert** (interrupt-the-night) · Monday weekly QA report (totals, avg vs last week, bottom calls + recordings, top-3 failure modes, cost/call).
- Store in `call_qa_scores`; the eval harness re-runs after every prompt change before promotion.

## SECTION 28 — CROSS-CHANNEL + SCHEDULED CALLBACKS
- **28A Voice→WhatsApp:** "text me the details" → template/send via the WhatsApp stack, logged against the call. WhatsApp→Voice mirror (42b §30).
- **28B `scheduled_callbacks` table:** callback requests (outside-hours, all-busy, AMD retries) with window + context payload; the same pattern v2.2 §34B and §38 reuse.

## SECTION 29 — LATENCY BUDGET (the physics)
STT p95 <250ms · LLM TTFT <300ms · LLM full <500ms cache-hit / <800ms miss · TTS first-audio <250ms · **voice-to-voice p95 <1000ms**. Tool routes <800ms. **≤200 tokens per spoken turn** (brevity IS latency — V_05 §2.4). Prompt caching mandatory (`cache_control: ephemeral`; >70% hit by Day 3). Any layer breaching 5 consecutive calls → alert + fix before features. Skill: `latency_optimization`; full table in `rules/LATENCY_BUDGET.md`.

## SECTION 30 — VOICE-CLONE CONSENT
Cloned client voice ONLY with written consent + revocation path (consent record stored; revocation kills the voice within 24h). Never proceed without it (CLAUDE.md §10). Skill: `voice_clone_consent_flow`.

## SECTION 31 — OBSERVABILITY (voice-adapted v7.1 §30)
- **31A:** Langfuse trace per call, child spans per layer (STT/LLM/TTS/tool) — the p95 breakdown feeds §29 alerts.
- **31B:** Recordings mirrored to Supabase Storage on call end; serve via **signed URLs, 15-min expiry** (V_04 relies on this).
- **31C Alerts:** p95 breach · compliance <90 · cost/call >2× avg · carrier fallback triggered (the failover PATH is v2.2 §35).

## SECTION 32 — CRM SYNC
- **32A:** Every call upserts the contact + appends a timeline entry (outcome, summary, recording link) to the client's CRM (sheet/Airtable/HubSpot adapter — whatever the client runs).
- **32B:** Inbound match by E.164 → the agent (and §34 warm-transfer whisper) greets known callers with context.

# ═══════════ END RECONSTRUCTED v2.1 SPINE — v2.2 FOLLOWS (verbatim) ═══════════
# ██████████████████████████████████████████████████████████
# VOICE AGENT v2.2 GAP-CLOSURE MODULE — APPEND TO File 40 (after v2.1)
# Closes V1–V6 from 00_GAP_ANALYSIS.md. ADDITIVE. V1 (barge-in) is the
# one that decides whether a demo sounds human or robotic — build it first.
# ██████████████████████████████████████████████████████████

---

# ═══════════════════════════════════════════════════════════
# SECTION 33 — BARGE-IN / INTERRUPTION HANDLING  (V1 — HIGH)
# v2.1 §29 optimizes SPEED. It does not handle TURN-TAKING. A caller
# who talks over the agent and gets ignored is the #1 "this feels like
# a robot" failure — and it loses demos. Latency <1s with no barge-in
# still sounds robotic.
# ═══════════════════════════════════════════════════════════

## 33A. THE THREE INTERRUPTION BEHAVIORS (configure per agent)
1. **Yield-on-speech (default):** the moment the caller starts speaking, the agent STOPS talking mid-sentence and listens. This is human. Vapi/Retell both support it — it must be turned on and tuned, not assumed on.
2. **Acknowledge-and-continue:** for critical disclosures (AI disclosure, "not legal advice", price confirmation), the agent finishes the sentence before yielding — these lines are compliance and cannot be half-spoken.
3. **Backchannel tolerance:** "mm-hmm", "yeah", "okay" from the caller are NOT interruptions — the agent keeps talking. Distinguish backchannel from a real interrupt (short filler at low energy ≠ a new utterance).

## 33B. TUNING PARAMETERS (per platform)
- Interruption sensitivity / `interruptionThreshold` — higher in noisy niches (HVAC field, restaurant) so background noise doesn't false-trigger a yield; lower in quiet ones (law office).
- Endpointing already per-language in v2.1 §23B — barge-in tuning is separate and stacks on top.
- Min-words-to-interrupt: require ≥2 words before treating caller audio as an interrupt (kills false yields on coughs/noise).

## 33C. TEST MATRIX ROW (add to §12 v2.0)
- "Interrupter" persona: caller talks over the agent 5 times → agent yields cleanly every time EXCEPT mid-disclosure (behavior 2). No talk-over-talk, no dropped context, disclosure never truncated.

## 33D. WHY THIS IS FIRST
You can have perfect latency and lose the demo on this alone. When the prospect calls your demo number and talks over the agent to test it, yield-on-speech is what makes them say "that actually sounds real." Build it before anything else in v2.2.

---

# ═══════════════════════════════════════════════════════════
# SECTION 34 — WARM-TRANSFER CONTEXT HANDOFF  (V2 — MED)
# §2 rule 5 offers human handoff; what the human RECEIVES was undefined.
# A cold transfer ("someone will help you") that dumps the caller on a
# human with no context annoys the caller AND the client's staff.
# ═══════════════════════════════════════════════════════════

## 34A. WARM TRANSFER (default when a human is available)
Before connecting, the agent generates a 1–2 sentence handoff and delivers it as a **whisper** to the human (caller doesn't hear it) OR as a screen-pop:
- Who's calling (name + number, CRM match if any — §32B)
- Why (intent + what's been done: "wants to reschedule tomorrow's cleaning, I couldn't find a slot")
- Sentiment (calm / frustrated — from §27 scoring)
Then connects. The human starts already knowing the situation.

## 34B. SCHEDULED CALLBACK (when no human available)
Outside hours or all-busy → agent offers a callback, writes `scheduled_callbacks` (v2.1 §28B already has this table pattern), passes the same handoff summary as context for whoever takes it.

## 34C. DATA
```sql
ALTER TABLE voice_calls ADD COLUMN transfer_summary TEXT;
ALTER TABLE voice_calls ADD COLUMN transfer_type TEXT
  CHECK (transfer_type IN ('warm_whisper','warm_screenpop','callback_scheduled','none'));
```
The handoff summary is generated by the same model turn that decides to transfer — no extra latency in the caller's path.

---

# ═══════════════════════════════════════════════════════════
# SECTION 35 — TELEPHONY / CARRIER FAILOVER  (V3 — MED)
# §31C ALERTS on "carrier fallback triggered" but never defined the
# failover path. An alert with no failover is just a notification that
# you're down.
# ═══════════════════════════════════════════════════════════

## 35A. ARCHITECTURE
- **Primary + backup carrier/number** per agent (Vapi/Retell support number pools / SIP failover).
- **Health check:** a synthetic test call every N minutes; on failure → mark primary unhealthy.
- **Failover trigger:** primary unhealthy OR >X% call-setup failures in Y minutes → route new calls to backup automatically.
- **Inbound continuity:** forward the primary number to the backup at the carrier level so in-flight and new calls don't drop.

## 35B. RULE
Failover must be automatic, not manual. A human noticing at 2am is not a plan. Test it: kill the primary in staging → new calls land on backup within one failed health check. Paste the evidence.

---

# ═══════════════════════════════════════════════════════════
# SECTION 36 — STIR/SHAKEN + BRANDED CALLER ID  (V4 — for US outbound)
# Affects whether your client's outbound calls get answered or show as
# "Spam Likely". Inbound (v2.0/§25 consented outbound) — this raises
# answer rates and is table stakes for US B2B outbound.
# ═══════════════════════════════════════════════════════════

- Ensure outbound numbers carry proper **STIR/SHAKEN attestation** (A-level) via the carrier — unattested numbers get flagged as spam and answer rates crater.
- **Branded caller ID** (CNAM / rich call data where supported) so the business name shows, not a raw number.
- Register numbers against spam-flagging databases; monitor and remediate if a number gets flagged.
- This is a configuration + carrier-relationship task, not code — but the build prompt must state it as a required step for any US outbound campaign, or the campaign underperforms silently.

---

# ═══════════════════════════════════════════════════════════
# SECTION 37 — DTMF / KEYPAD FALLBACK  (V5 — LOW)
# For noisy environments and accessibility. Voice-only fails when the
# caller is in a loud place or can't speak clearly.
# ═══════════════════════════════════════════════════════════

- For critical branch points (main menu in a §24 multi-agent setup, confirming a booking), accept **DTMF as an alternative to speech**: "Say 'billing' or press 2."
- Required for accessibility in some jurisdictions; always a graceful fallback when STT confidence is low twice in a row.
- Keep it minimal — DTMF menus everywhere feel like a 1990s IVR, which is the opposite of the product. Use only at high-stakes branch points.

---

# ═══════════════════════════════════════════════════════════
# SECTION 38 — VOICEMAIL → CALLBACK LOOP  (V6 — LOW)
# §25D detects voicemail (AMD) but the loop wasn't closed — a detected
# voicemail just ended.
# ═══════════════════════════════════════════════════════════

On AMD = voicemail for a consented outbound call:
1. Optionally drop a compliant pre-recorded VM (§25D — counts as a call under TCPA, same consent).
2. Write a `scheduled_callbacks` row for a retry in the contact's window (respect frequency cap, §25C).
3. OR cross-channel: if the contact has WhatsApp consent, send a follow-up template instead (v2.1 §28A) — often higher response than a second call.
4. Cap retries (default 2), then mark `contact_status = unreachable`, stop.

# ═══════════════════════════════════════════════════════════
# END VOICE AGENT v2.2 GAP-CLOSURE MODULE
# ═══════════════════════════════════════════════════════════


# ═══════════════════════════════════════════════════════════
# SECTION 39 — DEMO-CLONE / PERSONALIZATION PIPELINE  (v2.2 net-new)
# The portfolio's "actual weapon" (P5): clone the flagship assistant
# into a prospect-branded demo in <2h (→ <30min by week 3), via the
# Vapi/Retell API or MCP loop — NEVER the dashboard.
# ═══════════════════════════════════════════════════════════

## 39A. THE CONFIG CONTRACT (one file per prospect)
`demos/<prospect-slug>/config.json`: business name · services list · service area · hours · greeting line · persona pick (§26) · voice id · pronunciation notes · accent color/logo (for the paired site/widget) · grounded facts (3–10 real prices/policies scraped or transcribed from THEIR site — provenance URL required, `entities` rows).

## 39B. THE PIPELINE (scripted, idempotent)
1. **Scrape** the prospect URL (services/prices/hours) → Claude drafts `config.json` → HUMAN eyeballs it (30 seconds — wrong facts in a demo are fatal).
2. **Clone** the flagship assistant via API/MCP: copy assistant → patch system prompt from config (persona + greeting + grounded facts + disclosure with THEIR business name) → attach/keep the demo number.
3. **Seed** `entities` with the config facts (tenant = prospect-slug) so the grounding lock works in the demo exactly as in prod.
4. **Redeploy** the site template with config branding (widget `data-*` attrs, §34 v7.2) — demo URL per prospect.
5. **Verify (2-min protocol):** disclosure first sentence ✓ · quotes THEIR real price ✓ · absent-fact fallback ✓ · Interrupter test (talk over it twice, §33) ✓.
6. **Record the 90-second Loom:** call the number on speaker → interrupt it → it quotes their price → booking confirmed → "this is already answering as YOUR business."
Each run logs to `demo_registry` (prospect, config path, assistant id, number, site URL, loom URL, sent-at, outcome) — this doubles as your outreach ledger.

## 39C. RULES
- Demo tenants are ISOLATED rows — never share tables with a paying client's data unqualified.
- Demo caps: max call minutes/day per demo number (a prospect-shared number can get hammered); auto-pause at cap.
- Every demo discloses it's a demo build when asked; no fake testimonials/reviews anywhere near it (same rule as the Aura audit).
- Kill switch: unclaimed demos auto-archive after 14 days (assistant deleted, number released if per-demo) — cost hygiene.

# ═══════════════════════════════════════════════════════════
# SECTION 40 — CALL RESILIENCE & TELEPHONY ABUSE HARDENING
# (v2.2 production-hardening pass — closes the five voice gaps the
# audit confirmed are NOT covered elsewhere. §V1 recording storage,
# Gate F latency load, AMD §38 and barge-in §33 already exist and
# are referenced, not restated.)
# ═══════════════════════════════════════════════════════════

## 40.1 SILENCE / NO-INPUT POLICY
**Purpose.** Define agent behavior when the caller goes silent. **Production justification:** the platform configs ship only a hard `silenceTimeout ≈ 30s` end-call; between 0 and 30s the agent currently does nothing — dead air reads as "the line died" and callers hang up. Barge-in (§33) governs overlap; this governs absence.
**Implementation rules.**
1. Reprompt ladder: no caller audio for **6s** after the agent finishes → reprompt 1 ("Are you still there? Take your time."). **+8s** more → reprompt 2, offer the exit ("I can also text you a booking link, or have someone call you back."). **+8s** more → graceful close: write `scheduled_callbacks` row (v2.1 §28B) if a contact number exists, say the close line, end with `ended_reason='caller_silent'`.
2. Reprompts are persona-tuned (§26) and NEVER count as new turns for the ≤200-token budget accounting.
3. Outbound only: post-connect silence >4s with hold-music/IVR spectral signature → treat as AMD-adjacent, route to the §38 loop, don't monologue to hold music.
4. Distinguish from mid-form thinking: after the agent asks for a long value (address, postcode), first threshold extends 6s→10s.
**Failure mode / recovery:** reprompt fires while caller was audible = STT gap → log `silence_false_positive`, threshold +2s for that call. **Testing protocol (add row to the §12 matrix):** "Silent caller" persona — say nothing at both thresholds → both reprompts heard, callback row written, clean close; and "slow speaker" — 8s pauses mid-answer → NOT interrupted after long-value questions. **Performance:** timers run platform-side (Vapi `silenceTimeoutSeconds` stays 30 as the hard floor; ladder implemented via idle-message config / server events) — zero added latency in the speech path. **Future compatibility:** thresholds are per-agent config values, not constants.

## 40.2 RECORDING NOTICE (spoken — distinct from the AI disclosure)
**Purpose.** §V1 governs recording *storage*; nothing governs *telling the caller*. **Production justification:** UK GDPR transparency and US two-party-consent states require callers be informed calls are recorded; the scripts mandate only the AI disclosure. One missing sentence is a compliance exposure on every recorded call.
**Implementation rules.** Per-tenant config `recording_notice: required|off` (set from `client_context.md` jurisdiction). When required, the first turn is: AI disclosure + "Calls are recorded for quality." as ONE acknowledge-and-continue unit (§33A behavior 2 — never truncated by barge-in). Caller objects → offer: continue unrecorded if the platform supports pause, else offer callback/WhatsApp; log the objection. QA: the §27 compliance rubric adds a check — notice present when config requires it; absence scores compliance <90 → existing P0 path. **Testing:** one test call per jurisdiction profile; Interrupter test extended — interrupt during the notice → sentence completes. **Migration note:** existing agents get the line via prompt-registry version bump (§33.8), eval-gated.

## 40.3 CONCURRENCY & BUSY POLICY
**Purpose.** Define what happens on simultaneous calls. **Production justification:** Vapi/Retell accounts carry concurrency ceilings; beyond them calls ring out or drop — currently unspecified, so the failure mode is silent missed revenue (the exact thing the product sells against).
**Data model.** `agent_config.max_concurrent_calls INT` (default: platform plan limit − 1) · `voice_calls.queued_reason TEXT`.
**Implementation rules.** At limit: inbound → carrier-level forward to the missed-call text-back automation (P1 Phase E) OR voicemail-with-callback (§34B) — never a dead ring; choice is per-tenant config. Outbound campaigns: governor admits dials only while `active_calls < max_concurrent` (reuse the §33.6 admission pattern). Alert at 80% sustained 10 min ("capacity, not incident"). **Testing (pass/fail):** place `max+2` simultaneous test calls → `max` connect, extras hit the fallback within 2 rings, zero drops; paste `voice_calls` rows. **Operational note:** demo numbers set `max_concurrent_calls=2` — a prospect demo must never busy-out the flagship line.

## 40.4 PER-CALLER TELEPHONY ABUSE THROTTLE
**Purpose.** Rate-limit the *telephone* surface. **Production justification:** §1.3 rate-limits HTTP; nothing limits a single CLI hammering the number — every answered minute costs STT+LLM+TTS+telephony. Demo numbers published in cold outreach are the obvious target; §39C's daily cap protects the day's budget but not against one abuser consuming it in an hour.
**Data model.** `caller_velocity (phone TEXT, window_start TIMESTAMPTZ, call_count INT, total_seconds INT, flagged BOOLEAN)`.
**Algorithm.** On call-start webhook: same CLI >**4 calls/hour** or >**20 min/hour** → answer, one persona-tuned line ("You've reached us several times — I'll have someone call you back."), write callback row, end (`ended_reason='velocity_capped'`). Anonymous/withheld CLI: shared bucket at half thresholds. Repeat next window → carrier-level block list (manual, operator approves — never auto-block: repeat callers can be legit emergencies, which is why the cap *answers and routes* rather than rejects). Outbound transfers: destination allowlist = client's own numbers only (blocks premium-rate/toll-fraud pivots).
**Testing:** scripted 5th call inside the hour → capped line heard + callback row; paste. **Security consideration:** velocity rows are PII-bearing → same retention class as `voice_calls` (39c §35). **Recovery:** false-positive flag → operator clears the row; thresholds per-tenant.

## 40.5 STT-CONFIDENCE REPAIR THRESHOLDS (formalizes what §37 assumes)
Single turn confidence <0.55 → rephrase once, differently ("Sorry — could you say just the postcode?"). Second consecutive <0.55 → the §37 DTMF fallback at that branch point. High-stakes values (phone, postcode, amounts) are ALWAYS read back digit-by-digit for the §-standard confirm regardless of confidence. Log `repair_events` per call; >2 repairs → sentiment dimension informed (§27). **Testing:** noisy-audio fixture call → exactly one rephrase, then DTMF, never a third open retry.

# ═══════════════════════════════════════════════════════════
# END SECTION 40
# ═══════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════
# END VOICE AGENT v2.2 CONSOLIDATED MODULE
# ═══════════════════════════════════════════════════════════
