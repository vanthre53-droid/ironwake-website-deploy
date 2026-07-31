# T1_03 — AI-EMPLOYEE OPERATIONAL WORKFLOW
**"The perfect workflow for that specific employee."**
Not how to build the fleet (T1_02) — how it *operates* once live. This doubles as client-facing IP: it's the document you hand a client so they understand exactly how their "digital employee" behaves, escalates, and is measured. Everything here runs on the T1_01 orchestration spec.

---

## 1. THE FLEET'S DAILY LIFECYCLE (the loop that never stops)

```
TRIGGER (webhook / form / cron / inbound message)
   │  idempotency guard: seen this trigger_key? → drop duplicate
   ▼
PLANNER  decomposes objective → writes task graph (each task has acceptance criteria)
   ▼
QUEUE    tasks: queued → running (governor admits if under budget)
   ▼
WORKER   the owning agent does the task, grounds every fact, writes artifacts
   ▼
CRITIC   scores vs acceptance; cross-checks claims against DB
   │  ≥80 → done, unlock child tasks
   │  <80 → retry (max attempts) → then needs_human
   ▼
HUMAN GATE (only for needs_human + irreversible actions)
   │  approve / edit&approve / reject → writeback + audit log
   ▼
DONE     side-effects committed; if a later task fails, compensations run in reverse
```

Timing target: a reactive objective (inbound lead) moves trigger→first-response in **<30s**; a proactive objective (weekly report) runs on its cron and finishes async. Anything a human must approve waits on the human — the SLA clock pauses at the gate.

---

## 2. PER-ROLE OPERATING SPEC

Each agent is an "employee" with a job description, a cadence, acceptance criteria the Critic enforces, an escalation trigger, and KPIs. Generate one block per in-scope role. Below are the five archetypes; customize per niche.

### 2A. INBOUND SDR ("qualifies and books")
- **Trigger:** inbound message/call/form (reactive)
- **Inputs:** contact, source, the offer, qualification rubric (from niche playbook)
- **Does:** greets + discloses AI → qualifies (budget/timeframe/fit) → books or routes → writes lead to `entities`/CRM regardless of outcome
- **Acceptance (Critic checks):** lead row written with phone + intent + qualification fields; if booked, appointment row exists; AI disclosure present
- **Escalates when:** anger, "I want a human," pricing outside grounded range, low confidence
- **KPIs:** qualification rate, book rate, human-touch rate (lower is better), cost per booked meeting

### 2B. RECEPTIONIST / SCRIBE ("answers and records")
- **Trigger:** inbound (reactive)
- **Does:** answers FAQs from grounded data only → books/reschedules → logs a clean summary to the contact timeline
- **Acceptance:** every answer traceable to a grounded fact (no invented prices/hours/policies); summary written
- **Escalates when:** question needs a human decision, PHI/legal/medical territory (niche rules), stale grounding detected
- **KPIs:** resolution rate, hallucination rate (must be ~0), containment (share resolved without human)

### 2C. CONTENT / SEO ("produces and optimizes")
- **Trigger:** cron or Planner assignment (proactive)
- **Does:** drafts content grounded in the business's real offer → passes to the SEO step → writes artifacts for human approval before publish
- **Acceptance:** on-brand, factually grounded, meets the brief's checkable criteria; never auto-publishes without the human gate
- **Escalates when:** claim can't be grounded, brand-risk language
- **KPIs:** approval rate on first pass (Critic score), human-edit distance, published-per-week

### 2D. ANALYST ("reads the fleet and reports")
- **Trigger:** cron (weekly/daily)
- **Does:** reads real DB rows (tasks, outcomes, costs, QA scores) → produces the operator report → surfaces the 3 things that need attention
- **Acceptance:** every number in the report traces to a query (no narrative without data); top-3 issues are actionable
- **Escalates when:** a metric breaches a threshold (budget, resolution drop, compliance flag)
- **KPIs:** report accuracy, time-to-surface an issue

### 2E. REPUTATION ("watches and drafts")
- **Trigger:** review/mention webhook (reactive)
- **Does:** detects new review → drafts a response → routes to human approval (never auto-posts to public)
- **Acceptance:** draft matches sentiment + brand voice; negative reviews always go to human gate
- **Escalates when:** legal/defamatory territory, 1-star with a factual dispute
- **KPIs:** draft-approval rate, response time, share auto-drafted vs written from scratch

---

## 3. THE HUMAN OPERATOR'S DAY (what "running it" looks like)

- **Morning (5 min):** open `/admin/agents`. Scan the board. Green = running clean. Yellow = needs a decision. Red = needs action now. Clear the approval queue oldest-first.
- **Throughout:** approvals arrive as notifications; each shows what/why/evidence + approve/edit/reject. The operator only ever sees the ~5% of decisions that need a human.
- **Weekly (15 min):** read the Analyst report. Act on the top-3. Check fleet cost vs cap. Review any prompt-version changes and their resolution-rate impact.
- **What the operator NEVER does:** babysit green tasks, re-read transcripts the Critic already scored, or manually check grounding (the freshness cron does it).

This is the pitch to a client, verbatim: *"You look at one board for five minutes a day and approve the handful of decisions that need you. The system does the rest and shows its work."*

---

## 4. OPERATIONAL RUNBOOKS (what happens when something breaks)

| Event | Automatic response | Human sees |
|-------|-------------------|------------|
| Critic fails a task twice | task → `needs_human`, chain pauses at that node | approval queue item with the defect list |
| Fleet budget hits 100% | new task admission paused; running tasks finish | red banner + "raise cap or wait for period reset" |
| Grounding goes stale | affected agents blocked from quoting the value; re-ground on next cron | yellow banner "N facts stale — source changed" |
| Agent chain half-completes (booking made, confirmation failed) | compensation runs in reverse (cancel booking); task → failed | audit log + notification, nothing left half-done |
| Duplicate trigger fires | idempotency guard drops it | nothing (it's silent + correct) |
| Prompt change tanks resolution rate | Langfuse flags the version; operator rolls the pointer back | one-click rollback to last passing version |
| Injection attempt | request treated as data, logged, agent stays scoped | security surface in the report |

Ship these as `docs/RUNBOOKS.md` with the build (your kit already mandates a runbooks doc — this is its fleet content).

---

## 5. THE NUMBERS THAT DEFINE "WORKING" (SLA sheet)

Put these in the client agreement so "is it working?" is never a vibe:
- **Resolution rate** ≥ target per niche (e.g. receptionist ≥85% contained)
- **Hallucination rate** ~0 (any invented fact is a P0, not a metric to tolerate)
- **Human-touch rate** ≤ agreed % (this is the labor you're saving them — measure it)
- **Voice/response latency** within budget (voice: p95 <1s; text: first reply <5s)
- **Compliance score** ≥90 on every interaction (niche rules: HIPAA/legal/Fair Housing/TCPA)
- **Cost per outcome** tracked and capped (booked meeting, resolved conversation)

The Analyst reports these weekly; breaches escalate automatically. This SLA sheet *is* the difference between "I installed some AI" and "I run your operations."

---

## 6. WHAT THIS BUYS THE CLIENT (say it in outcomes)
Not "10 agents." Say: *"A team that never sleeps, never invents an answer, reviews its own work, hands you only the decisions that matter, and shows you the numbers every Monday — for a monthly cost you cap."* That sentence is the product. The 33-section spec behind it is the implementation detail they never see.
