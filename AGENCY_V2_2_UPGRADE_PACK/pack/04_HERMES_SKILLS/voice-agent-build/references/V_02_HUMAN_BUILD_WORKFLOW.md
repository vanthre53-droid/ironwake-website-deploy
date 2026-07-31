# V_02 — HUMAN BUILD WORKFLOW (Voice Agent)
**"The perfect workflow for ME to build the voice agent in my env."**
Phase-gated, tool-routed build procedure on your stack. Mirrors T1_02 / W_02. Single-client carve-out included.

---

## 0. THE ONE DECISION FIRST
**Inbound-only, or inbound + outbound?**
- **Inbound-only →** no TCPA outbound infra, no consent tables, no DNC. Vastly simpler and faster. **This is what client #1 should be.**
- **Outbound →** §25 TCPA infra becomes mandatory and is your highest-risk surface (a bad outbound campaign gets your client sued). Only take it on for a client who needs it and understands the compliance.

`progress.md` line 1.

## 1. ENVIRONMENT PREFLIGHT
| Work | Tool |
|------|------|
| Agent config, tool routes, admin UI, persona wiring, CRM adapters | **GLM-5.2 / Hermes** |
| Barge-in tuning (V1), TCPA `canDial()` (§25), carrier failover (V3), latency-critical path, QA rubric | **Opus 4.8 / Claude Code** |

- [ ] `AGENCY_KIT_VOICE` installed (CLAUDE.md + skills: `vapi_agent_setup`/`retell_agent_setup`, `multilang_voice_setup`, `voice_persona_design`, `tcpa_outbound_setup`, `voice_clone_consent_flow`, `latency_optimization`, `call_qa_scoring`)
- [ ] Vapi OR Retell account + number; Deepgram (STT); ElevenLabs (TTS — Turbo v2.5 English-only, Multilingual v2 otherwise, §23B)
- [ ] Supabase up (+ Storage for recordings); Langfuse keys
- [ ] Latency budget memorized (§29 / `LATENCY_BUDGET.md`)

## 2. BUILD ORDER (voice-specific — from Voice CLAUDE.md)
```
DB → VOICE PLATFORM AGENT CONFIG → BARGE-IN + PERSONA → TOOL ROUTES →
GROUNDING → QA SCORING → HANDOFF/FAILOVER → [OUTBOUND if scope] →
CROSS-CHANNEL → ADMIN UI → OBSERVABILITY
```

## 3. PHASES (each ends in a Gate with evidence)

### P1 — DB  [GLM]
`voice_calls` (+ v2.1/v2.2 columns: per-layer latency §29, `call_agents_used` §24, `call_qa_scores` §27, `transfer_summary` §34), recordings storage.
**Gate P1:** schema created, a call row inserted/read, RLS on tenant tables.
Commit: `feat: voice db schema`.

### P2 — Agent Config + Barge-in + Persona  [Opus for barge-in, GLM for persona]
Skill: `vapi_agent_setup`/`retell_agent_setup`. Wire STT/LLM/TTS per §23B. **Implement V1/§33 barge-in first** (yield-on-speech, acknowledge-and-continue for disclosures, backchannel tolerance). Drop in the §26 persona for the niche.
**Gate P2:** the "Interrupter" test (§33C) passes — agent yields cleanly, never truncates disclosure. AI disclosure is the first sentence.
Commit: `feat: agent config + barge-in + persona`.

### P3 — Tool Routes  [GLM]
`get_services`, `check_availability`, `book_appointment`, etc. Each <800ms (§29). Confirm before irreversible actions (§2 rule 4).
**Gate P3:** a booking completes end-to-end via voice; row created; read-back confirmation present.
Commit: `feat: voice tool routes`.

### P4 — Grounding  [GLM, Opus reviews stale-block]
Same T1 §33.5 mechanism: quote only DB prices; stale values re-ground; the "let me have someone confirm" line when absent. **Build even for a single agent.**
**Gate P4:** change a price → agent re-grounds; never quotes stale.
Commit: `feat: grounding freshness`.

### P5 — QA Scoring  [Opus for rubric, GLM for cron]
Skill: `call_qa_scoring` + the `call-critic` agent (§27). Every completed call scored on 5 dimensions; <70 flagged, compliance <90 = P0.
**Gate P5:** a completed call gets a QA row; a deliberately non-compliant call scores <90 and alerts.
Commit: `feat: auto qa scoring`.

### P6 — Handoff + Failover  [Opus for failover]
V2/§34 warm transfer (whisper/screen-pop + summary). V3/§35 carrier failover (health check + auto-route to backup).
**Gate P6:** a transfer delivers the summary to the human before connecting; killing the primary carrier in staging routes new calls to backup within one health check.
Commit: `feat: warm transfer + carrier failover`.

### P7 — Outbound  [Opus — highest risk; only if in scope]
Skill: `tcpa_outbound_setup`. `canDial()` (§25C) before EVERY dial: consent + suppression + window + frequency cap. STIR/SHAKEN (V4/§36). AMD → callback loop (V6/§38).
**Gate P7:** a dial with no consent is refused; a suppressed number is refused; an out-of-window dial is refused. Paste all three refusals.
Commit: `feat: tcpa outbound + amd loop`.

### P8 — Cross-channel  [GLM]
Voice↔WhatsApp handoff (§28): "text me" → WhatsApp send; "call me" from WhatsApp → outbound.
**Gate P8:** "text me" fires a WhatsApp follow-up logged against the call.
Commit: `feat: cross-channel handoff`.

### P9 — Admin UI  → see V_04 (separate build sub-prompt)
### P10 — Observability  [GLM]
Langfuse call tracing (§31A), recording storage (§31B), voice alerts (§31C).
**Gate P10:** one call = one Langfuse trace with per-layer spans; p95 breach alert fires.
Commit: `feat: voice observability`.

## 4. TOOL-ROUTING RULE
Realtime-path config (barge-in, latency), compliance (`canDial`), and failover → **Opus/Claude Code**. Persona, tool routes, UI, CRM adapters → **GLM/Hermes**.

## 5. SINGLE-CLIENT CARVE-OUT (build THIS for client #1)
Inbound receptionist only. Build: **P1 · P2 (config + barge-in + persona) · P3 tools · P4 grounding · P5 QA · P6 warm transfer (skip failover if single number) · a minimal admin call log.** Skip P7 outbound, P8 cross-channel, multi-agent §24. That's a demo-ready inbound voice agent in **~3–4 days** — and barge-in (P2) is what makes the demo land.

**progress.md line:** *"Inbound-only for client #1. Barge-in + grounding decide the demo. Outbound is a separate, higher-risk product — not now."*
