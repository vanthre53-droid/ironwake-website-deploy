# V_04 — VOICE ADMIN UI/UX BUILD SUB-PROMPT
**A separate, runnable build prompt for the voice operator surface.**
Paste into Claude Code after V_02 phases P1–P5 exist. Reads REAL rows from your voice tables — never mock (Master §2 rule 2).

---

## 0. WHAT THIS SURFACE IS
- **Subject:** a call-review station — where an operator listens back, reads transcripts, checks QA + compliance, and (if outbound) manages campaigns. Closest real-world analog: a call-center QA desk, but for one person watching an AI.
- **Audience:** operator (all tenants, switcher) + client admin (own tenant, RLS).
- **Single job:** answer "did the calls go well and did any break compliance?" — compliance failures must be impossible to miss.

---

## 1. DESIGN DIRECTION (deliberate — distinct from the T1 board and W console)
Reject the three AI defaults. This surface is about **listening and trust**, so the thesis is: **compliance and QA are the loudest signals; the transcript is the hero content.**

**Palette (calm chrome; QA/compliance carry meaning):**
- `--bg: #101318` / `--panel: #191E27` / `--line: #272F3B` / `--text: #E9ECF2` / `--muted: #808A9B`
- QA/compliance states: `--pass: #22C55E` · `--warn: #F59E0B` · `--fail: #EF4444` (compliance <90 uses `--fail` and is visually unmissable — a red left-border on the whole call row)
- One accent for waveform/scrubber + actions: `--accent: #14B8A6` (teal — reads "audio/telephony", not alarming)

**Type:** grotesque headers, Inter UI, **monospace for the transcript timestamps, latencies, and scores** — a call transcript with aligned timestamps is a control-room artifact, and it's the signature.

**Signature element:** the **Call Detail view** — a synced transcript + waveform + per-turn latency, with the agent-journey (triage→specialist, §24) as a slim timeline above it, and the 5 QA scores (§27) as a compact row. Playing the recording highlights the transcript line. This is where the operator lives; make it excellent. Keep the call list quiet around it.

**Restraint:** no fake "AI listening" animations. Motion only when playback scrubs the transcript. Reduced-motion, visible focus, tablet-responsive.

---

## 2. SCREEN INVENTORY (build in order)
1. **Call Log** (`/admin/voice`) — live list of calls; each row shows outcome, QA overall, compliance (red-bordered if <90), duration, cost. Filter by outcome/score/compliance. Compliance failures sort to the top.
2. **Call Detail** (`/admin/voice/calls/[id]`) — the signature: recording + synced transcript, per-layer latency (§29), agent journey (§24), 5 QA scores + failure notes (§27), transfer summary (§34) if transferred, CRM match (§32).
3. **Compliance** (`/admin/voice/compliance`) — every call's compliance score; <90 listed with the specific violation; for outbound, consent + DNC + window audit (§25).
4. **Outbound Campaigns** (`/admin/voice/campaigns`, if §25) — campaign list, consent status, suppression counts, dial-window config, live progress, connect/answer rates. A campaign cannot start without passing the pre-flight (consent source + DNC scrub confirmed).
5. **Latency & Cost** (`/admin/voice/health`) — p95 per layer trend, cost per call, alerts.

---

## 3. DATA CONTRACT (real rows)
- Call log ← `voice_calls` (+ `call_qa_scores`, per-layer latency columns), tenant-scoped, Realtime.
- Call detail ← transcript segments + recording URL (signed, 15-min expiry, §31B) + `call_agents_used` (§24) + `call_qa_scores` + `transfer_summary`.
- Compliance ← `call_qa_scores.compliance_score` + `failures` JSON; outbound audit ← `outbound_consent` + `suppression_list` + `outbound_campaigns`.
- Campaign start ← blocked unless pre-flight passes (consent + DNC).
- **RLS:** JWT-authenticated read surface → JWT RLS correct here.

---

## 4. COPY RULES
- "Needs review," not "qa_flagged." A compliance failure says exactly what broke: "Missing AI disclosure," not "compliance: 70." "Start campaign" → toast "Campaign running."
- Empty log: "No calls yet today." A compliance failure state tells the operator the fix, in the interface's voice.

---

## 5. VERIFICATION GATE (Gate-C evidence)
- [ ] Call log renders live from `voice_calls`; a new call appears in real time
- [ ] Call detail: playback scrubs the synced transcript; QA scores + latency render from real rows
- [ ] A compliance-<90 call is visually unmissable (red border) and lists the violation
- [ ] Outbound campaign cannot start without the consent+DNC pre-flight (paste the blocked start)
- [ ] Recording URLs are signed + expiring (paste an expired-URL 403)
- [ ] RLS proven cross-tenant; focus visible; reduced-motion; tablet layout; zero mock data

Commit: `feat: voice admin console`.

## 6. WHAT NOT TO BUILD
No sentiment gimmicks, no vanity call-volume hero. Every panel serves one decision: review a call, fix a compliance break, or run a campaign safely. The compliance surface is the one you never let get buried.
