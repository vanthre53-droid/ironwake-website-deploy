# W_03 — WHATSAPP BOT OPERATIONAL WORKFLOW
**"The perfect workflow for that specific employee."**
How the WhatsApp bot operates once live — its daily loop, the operator's rhythm, runbooks, and the SLA sheet. Doubles as client-facing IP. Runs on your v2.0 + v2.1 + v2.2 stack.

---

## 1. THE BOT'S DAILY LOOP
```
INBOUND MESSAGE
  │ suppression check (opted out? → do nothing but honor START)
  │ 24h service window opens/resets (free messaging)
  ▼
INTENT (Haiku)  → FAQ · book · buy · qualify · human · complaint
  ▼
RESPONSE (Sonnet, grounded)  → text / buttons / list / FLOW (if ≥3 structured inputs)
  ▼
ACTION  → booking row / lead / cart / payment — confirmed before commit
  ▼
WINDOW MANAGEMENT  → soft re-engagement to keep window free (§31); template only if truly needed
  ▼
CSAT  → conversation auto-scored by conversation-critic; low score flagged
```
Async by nature: unlike voice, replies don't need <1s. Target first reply **<5s**, and never let the 24h free window lapse into a paid template when a free message would have worked (§31 is margin).

---

## 2. THE BOT AS EMPLOYEE — ROLE SPECS
The same number can serve multiple jobs (route by intent). Generate the ones in scope.

### 2A. RECEPTIONIST (answer + book)
- Trigger: inbound. Does: grounded FAQ, booking via Flow, reschedule.
- Acceptance (conversation-critic): resolved without human where possible; every fact grounded; booking row exists if booked.
- Escalates: human decision needed, complaint, stale grounding.
- KPIs: containment %, resolution, hallucination ~0, avoidable-template count (should trend to 0).

### 2B. SALES / LEAD QUALIFIER
- Trigger: inbound, often CTWA-originated (§27). Does: qualify via Flow/quiz, capture to CRM, book.
- Acceptance: lead written with qualification fields + `referral` attribution if CTWA.
- KPIs: qualification rate, cost per qualified lead (from CTWA dashboard), book rate.

### 2C. SUPPORT
- Trigger: inbound "something's wrong." Does: grounded troubleshooting, ticket creation, human handoff.
- Acceptance: issue resolved or cleanly escalated with context.
- KPIs: first-contact resolution, escalation quality.

### 2D. COMMERCE (if Pay/Catalog in scope)
- Trigger: product intent. Does: catalog → cart → checkout (UPI/§25 or link), abandoned-cart re-engage (one template, §26C).
- Acceptance: payment idempotent; order marked paid once.
- KPIs: cart→checkout conversion, abandoned-cart recovery, payment success rate.

---

## 3. THE OPERATOR'S DAY
- **Morning (5 min):** check the **quality-rating banner** first — GREEN = fine, YELLOW = act today (§23C playbook), RED = freeze non-essential templates, diagnose now. Clear any human-handoff conversations.
- **Marketing sends:** any marketing-category template blast is operator-approved, opt-in-verified, and suppression-checked before it goes.
- **Weekly (15 min):** template performance dashboard (kill low-reply templates — they risk quality), cost dashboard (avoidable templates), CSAT digest (bottom-5 conversations), CTWA ROAS if running ads.
- **Never:** send a template just because time passed; blast an un-warmed number; ignore a YELLOW.

Client pitch, verbatim: *"Your number stays healthy, your customers get answered in seconds inside WhatsApp, and you approve any promotional send — nothing goes out that could get you flagged."*

---

## 4. OPERATIONAL RUNBOOKS
| Event | Automatic response | Operator sees |
|-------|-------------------|---------------|
| Quality → YELLOW | warning + suggested actions; ramp freezes (§35) | banner + §23C root-cause checklist |
| Quality → RED | non-essential template sends auto-frozen | P0 alert |
| Template rejected | logged with Meta's reason | email + suggested fix / re-category |
| STOP received | contact suppressed, confirmation sent | nothing (silent + correct) |
| Webhook failure >2%/hr | reconciliation cron catches missed messages | alert (Meta webhooks are flaky) |
| Window about to lapse w/ pending action | hour-23 free check-in sent (§31B) | nothing |
| Injection attempt | treated as data, logged | security line in digest |
| Payment webhook double-fire | idempotency dedups | nothing |

Ship as `docs/RUNBOOKS.md` (extends your `QUALITY_RATING_PLAYBOOK.md` rule file).

---

## 5. SLA SHEET (put in the client agreement)
- **Containment** ≥ target (share resolved without human)
- **First reply** <5s
- **Hallucination** ~0 (invented fact = P0)
- **Quality rating** = GREEN sustained (this is the one the client feels — a throttled number = missed customers)
- **Compliance:** correct template categories, opt-in honored, STOP honored
- **Cost per conversation** tracked; avoidable-template count trending down

The conversation-critic + quality monitor report these; breaches escalate.

---

## 6. THE OUTCOME YOU SELL
Not "a WhatsApp chatbot." Say: *"A WhatsApp line that answers in seconds, books and sells inside the chat, never invents a price, keeps your number healthy so you're never silently throttled, and only asks you to approve the promotional sends."* The v2.2 stack is how; that sentence is what.
