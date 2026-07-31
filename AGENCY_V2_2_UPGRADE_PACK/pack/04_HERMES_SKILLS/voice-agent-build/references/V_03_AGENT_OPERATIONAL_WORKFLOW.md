# V_03 — VOICE AGENT OPERATIONAL WORKFLOW
**"The perfect workflow for that specific employee."**
How the voice agent operates once live — the per-call loop, the operator's rhythm, runbooks, SLA sheet. Client-facing IP. Runs on v2.0 + v2.1 + v2.2.

---

## 1. THE PER-CALL LOOP (real-time — every ms counts)
```
INBOUND CALL
  ▼
DISCLOSURE (first sentence: "Hi, this is [name], an AI assistant for [business]") — non-negotiable
  ▼
[TRIAGE if multi-agent §24] → route to specialist (hot-swap, caller feels continuity)
  ▼
CONVERSE  — grounded answers only · <200 tokens/turn (brevity = latency) · yields on barge-in (§33)
  ▼
ACTION  — book / answer / transfer — read back + confirm before committing
  ▼
HANDOFF if needed — warm transfer with summary (§34) OR scheduled callback
  ▼
END → auto-QA scored within 15 min (§27); recording stored; CRM synced (§32)
```
Hard budget: **voice-to-voice p95 <1000ms** throughout (§29). Slower = the caller thinks the line dropped.

---

## 2. THE AGENT AS EMPLOYEE — ROLE SPECS

### 2A. RECEPTIONIST (inbound answer + book) — the client-#1 role
- Trigger: inbound call. Does: disclosure → grounded FAQ → book/reschedule → warm transfer if needed.
- Acceptance (call-critic §27): goal achieved; disclosure present; only DB prices; confirmed before booking.
- Escalates: "I want a human", anger, out-of-scope, twice-low STT confidence (→ DTMF fallback §37).
- KPIs: resolution, containment, hallucination ~0, voice-to-voice p95, compliance ≥90.

### 2B. TRIAGE + SPECIALISTS (multi-line, §24)
- Triage (Haiku, <400ms) classifies intent → hot-swaps to sales/support/billing/scheduling specialist with shared state (§24C).
- Acceptance: correct routing (intent confidence logged); specialist has full context, caller never repeats themselves.
- KPIs: routing accuracy, per-agent resolution, transfer smoothness.

### 2C. OUTBOUND SDR (only if §25 built)
- Trigger: campaign, `canDial()`-gated. Does: consented outbound → qualify → book; AMD → callback loop (§38).
- Acceptance: EVERY dial passed canDial (consent + suppression + window + frequency); disclosure present.
- KPIs: connect rate, answer rate (STIR/SHAKEN §36 matters here), book rate, zero compliance violations.

---

## 3. THE OPERATOR'S DAY
- **Morning (5 min):** scan overnight calls. **Compliance score is the first thing** — any call <90 is a P0 (§27D). Then QA <70 calls (listen to the flagged ones). Check p95 latency trend.
- **If outbound running:** confirm campaigns stayed in-window, no suppression breaches, connect/answer rates healthy.
- **Weekly (15 min):** the Monday QA report (§27D) — total calls, avg score vs last week, bottom calls with recordings, top-3 failure modes, compliance violations (zero-tolerance). Cost per call.
- **Never:** let a compliance <90 sit; ship a prompt change without re-running the eval; ignore a rising p95.

Client pitch, verbatim: *"Every call is answered in under a second, sounds human enough that callers talk to it normally, never quotes a wrong price, and every single call is auto-graded for quality and compliance — you get a report every Monday and I fix anything below bar before you notice."*

---

## 4. OPERATIONAL RUNBOOKS
| Event | Automatic response | Operator sees |
|-------|-------------------|---------------|
| Voice-to-voice p95 >1.5s (3 calls) | latency alert; identify slowest layer (§29) | alert + which layer |
| Compliance score <90 | P0 alert (interrupt-the-night) | P0 — fix before next call day |
| QA overall <60 | flagged, recording linked | in the digest, listen + tune |
| Carrier primary down | auto-failover to backup (§35) | alert (already handled) |
| Barge-in false-triggering (noisy niche) | — | tune interruption threshold (§33B) |
| Cost per call >2× avg | alert (looping/hallucinating) | investigate the transcript |
| Voicemail on outbound | callback scheduled or WhatsApp follow-up (§38) | nothing |
| Consent missing on outbound | dial refused by canDial | nothing (correct) |

Ship as `docs/RUNBOOKS.md`.

---

## 5. SLA SHEET (client agreement)
- **Voice-to-voice p95 <1000ms** (the one the caller feels)
- **Compliance ≥90 every call** (disclosure, price discipline, TCPA if outbound) — zero tolerance below
- **Resolution / containment** ≥ target per niche
- **Hallucination ~0** (invented price/policy = P0)
- **Cost per call** tracked and capped
- Every call auto-graded (§27); breaches escalate automatically

---

## 6. THE OUTCOME YOU SELL
Not "an AI receptionist." Say: *"A receptionist that answers every call in under a second, day or night, sounds real enough that people just talk to it, never invents an answer, and grades its own calls for quality and compliance so you get a clean report every week."* v2.2 is the how; that's the what.
