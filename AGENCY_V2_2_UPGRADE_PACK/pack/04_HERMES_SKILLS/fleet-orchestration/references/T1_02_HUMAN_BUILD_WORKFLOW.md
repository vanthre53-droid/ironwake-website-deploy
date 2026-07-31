# T1_02 — HUMAN BUILD WORKFLOW (AI-Employee Fleet)
**"The perfect workflow for ME to build this in my env."**
This is not the build prompt (that's T1_01). This is *your* operating procedure for constructing the fleet on your actual stack, phase by phase, with the tool-routing decision (GLM-5.2/Hermes vs Claude Code/Opus) made for you at each step, a Verification Gate per phase, and a hard "single-agent-first" carve-out so you can ship a paying client without building the whole workforce.

---

## 0. THE ONE DECISION BEFORE YOU TOUCH CODE

**Are you building this for a paying client, or for the agency's own Command Center?**
- **Neither yet →** stop. Close this file. The fleet is post-revenue IP. Build the single-agent carve-out in §7 instead, ship a client, come back.
- **Paying client who needs ≥3 coordinating agents →** proceed, but only build the agents in scope. Never build the full roster speculatively.
- **Agency internal Command Center →** proceed; this is the one case where building ahead of revenue is defensible, because it's *your* leverage tool.

Write the answer in `progress.md` as line 1. Everything downstream depends on it.

---

## 1. ENVIRONMENT PREFLIGHT

Your split is already correct; formalize it for this build:

| Work type | Tool | Why |
|-----------|------|-----|
| Schema, CRUD API routes, wiring, n8n flows, dashboard components | **Hermes + GLM-5.2** (the 90%) | High-volume, low-ambiguity, well-specified by T1_01. Cheap. |
| Planner prompt design, Critic rubric, saga/compensation logic, injection hardening, RLS-on-webhook reconciliation | **Claude Code + Opus 4.8** (the hard 10%) | These are the parts where a subtle error is a P0. Pay for judgment here. |

Preflight checklist (paste into `progress.md`):
- [ ] Kit installed: `AGENCY_KIT_V7` copied in, `CLAUDE.md` + `rules/` + `.claude/` present
- [ ] `progress.md` created, line 1 = the §0 decision
- [ ] Supabase project up, **pgvector extension enabled** (`create extension vector;`) — the fleet needs it, the single agent doesn't
- [ ] MCP servers wired that this build needs: Supabase MCP, and (if the Planner reads external data) the relevant read MCPs
- [ ] `.env.local` validated by `scripts/check-env.ts`
- [ ] Langfuse keys in env (fleet observability is not optional — §29)

---

## 2. FLEET BUILD ORDER (extends your DB→API→pages law)

Your kit's law is DB→API→pages. A fleet inserts a middle layer. The full order:

```
SUBSTRATE → GOVERNANCE → PLANNER → WORKERS → CRITIC → APPROVAL UI → GROUNDING → OBSERVABILITY
   (DB)      (guards)    (brain)   (hands)   (QA)      (pages)      (freshness)  (eyes)
```

Build it in exactly this order. Building a worker before the task table exists, or the Critic before workers produce anything to review, is wasted work — same failure mode your kit already warns about, one level up.

---

## 3. THE PHASES (each ends in a Gate with pasted evidence)

### Phase F1 — Substrate  [GLM-5.2/Hermes]
Build: `agent_tasks` (T1_01 §33.1), `knowledge_chunks` + `entities` (§33.4), `fleet_budget` (§33.6), the idempotency dedup table (§33.8), migrations only.
Invoke kit skill: `db_migration`.
**Gate F1 (evidence):** paste the migration output + `\d agent_tasks` showing the state-machine CHECK constraint + a row inserted and read back. RLS enabled on every tenant table (cross-tenant read returns empty — reuse `tenant_isolation_test` skill).
Commit: `feat: fleet substrate tables + RLS`.

### Phase F2 — Governance guards  [Opus 4.8 for the logic, GLM for the wiring]
Build: the state-machine transition enforcer (reject illegal transitions in code, not just CHECK), the idempotency guard (§33.8), the cost-rollup + kill-switch (§33.6).
Why Opus: the state machine and saga scaffolding are where silent bugs cost you a client's data. Get the transition table and the kill-switch right here.
**Gate F2:** paste a test run showing (a) an illegal transition rejected, (b) a duplicate `trigger_key` refused, (c) `kill_switch=true` stops new task admission while a running task finishes.
Commit: `feat: fleet governance (state machine, idempotency, cost governor)`.

### Phase F3 — Planner  [Opus 4.8]
Build: the `objectives` table trigger → Planner agent → writes `agent_tasks` graph. Prompt from T1_01 §33.2.
Why Opus: the Planner's decomposition quality *is* the product. Design its prompt and its acceptance-criteria requirement here, and run its eval harness before promoting.
**Gate F3:** paste a real objective in → the task graph out, showing every task has machine-checkable `acceptance` and valid `owner_agent`, and that an unmappable objective returns `needs_human` instead of a hallucinated agent.
Commit: `feat: planner agent + objective decomposition`.

### Phase F4 — Workers (reuse §27)  [GLM-5.2/Hermes per agent]
Build: each in-scope agent from the §27 per-agent spec. They now read from `entities`/`knowledge_chunks`, pull tasks from the queue, write `artifacts`, and set status. One agent = one focused build; don't parallelize until each passes its own §27 eval.
**Gate F4 (per agent):** the agent's §27 EVAL HARNESS passes on its fixed test set; paste results. Agent quotes only grounded facts (hallucination test passes).
Commit per agent: `feat: <agent> worker`.

### Phase F5 — Critic  [Opus 4.8 for the rubric]
Build: the Critic (§33.3) — reviews each worker output vs `acceptance`, cross-checks claims against DB, scores, passes/returns.
Why Opus: the rubric is the quality gate for everything. A lenient Critic ships bad work to clients; a broken one loops and burns budget.
**Gate F5:** paste (a) a good output → passes with evidence-mapped criteria, (b) a deliberately-wrong output → returned with a specific defect list, (c) 2 failures → escalates to `needs_human`, no infinite loop.
Commit: `feat: critic agent + review loop`.

### Phase F6 — Approval UI  → see T1_04 (separate build sub-prompt)
Build the `/admin/agents` Command Center per T1_04. This is where the human owns consequential decisions.
**Gate F6:** approve / edit-&-approve / reject each write back to `agent_tasks` + `audit_logs`; a rejected task runs its compensation.
Commit: `feat: command center + approval flow`.

### Phase F7 — Grounding freshness  [GLM, with Opus reviewing the stale-block logic]
Build: `grounding_refresh` cron (§33.5), stale-block on agent answers. **Build this even in the single-agent carve-out.**
**Gate F7:** change a source price → cron supersedes the old `entities` row (sets `valid_until`) and inserts the new one → an agent asked the old price re-grounds before answering. Paste the before/after.
Commit: `feat: grounding freshness + stale-answer block`.

### Phase F8 — Observability  [GLM]
Wire Langfuse traces per task, the prompt registry pointer (§33.8), and the fleet alerts (budget 80%/100%, stale grounding, critic-fail spikes). Reuse v7.1 §30.
**Gate F8:** one objective run produces one Langfuse trace with child spans per task; a prompt-version rollback flips the active pointer and Langfuse shows the version change.
Commit: `feat: fleet observability + prompt registry`.

---

## 4. TOOL-ROUTING RULE OF THUMB (memorize)

If a bug in this component would (a) leak a client's data, (b) let an agent take an irreversible action wrongly, or (c) quote a wrong price/fact — it goes to **Opus/Claude Code**. Everything else goes to **GLM/Hermes**. That's F2, F3, F5, and the F7 stale-block on Opus; the rest on GLM.

## 5. GIT + RESUME DISCIPLINE
Every Gate that passes = one commit with the gate name in the message. `progress.md` updated every session (your kit already enforces this). A fleet build spans many sessions — the resume protocol is what makes it survivable. Never leave uncommitted work between sessions.

## 6. TIME BUDGET (honest)
Full fleet, in-scope agents only: **F1–F2 ~1 day · F3 ~1 day · F4 ~0.5 day per agent · F5 ~1 day · F6 ~1–2 days · F7 ~0.5 day · F8 ~0.5 day.** A 4-agent fleet is realistically **7–10 focused days.** If that number scares you against your 90-day clock, that is the correct reaction — see §7.

---

## 7. THE SINGLE-AGENT CARVE-OUT (build THIS for client #1)

You do not need F2–F6 to ship one client. You need one §27 agent that is *fleet-ready* but runs alone. Build only:
- **F1-lite:** just `entities` + `knowledge_chunks` + one agent's memory table (skip `agent_tasks`, `fleet_budget`, idempotency — no fleet, no need)
- **One F4 worker** (the receptionist/SDR the client actually asked for)
- **F7 grounding freshness** (yes, even solo — this is the one that saves the demo)
- A **single human-escalation path** (not the full approval UI — just: low-confidence/anger/irreversible → notify the operator with context)

That's **~2–3 days**, it sells, and every piece slots into the full fleet later with zero rework because it already speaks the `entities`/`knowledge_chunks` contract. Ship this. Come back for F2–F6 when a client's cheque justifies it.

**Line to keep in `progress.md`:** *"Fleet is a roadmap. Client #1 gets the carve-out. Outreach is the constraint, not this build."*
