---
name: fleet-orchestration
description: Build or extend the multi-agent AI-employee fleet layer (task envelope + state machine, Planner, Critic, shared knowledge substrate, grounding freshness, fleet budget/kill-switch, human approval gate, idempotency, prompt registry) per v7.2 §33. Use when the user says fleet, orchestration, AI employees, multi-agent, planner, critic, task graph, agent_tasks, needs_human, approval queue, command center backend, grounding freshness, kill switch, or asks two-plus agents to coordinate. Also use for the single-agent carve-out for client #1.
---

# Fleet Orchestration (v7.2 §33)

## The one decision first (T1_02 §0 — enforce it)
Ask: paying client needing ≥3 coordinating agents, agency's own Command Center, or neither?
**Neither → STOP.** Route to the single-agent carve-out below. The fleet is post-revenue IP.

## Full build (only when justified)
Follow `references/T1_02_HUMAN_BUILD_WORKFLOW.md` phases F1→F8 in order, each ending in a Gate with pasted evidence. The spec for every table/agent is `references/39c-V7_2_UPGRADE_MODULE.md` SECTION 33:
- F1 substrate: `agent_tasks` (33.1 envelope + state machine), `knowledge_chunks`/`entities` (33.4), `fleet_budget` (33.6), dedup table (33.8) — [GLM]
- F2 governance: transition enforcer, idempotency guard, cost governor + kill-switch — [Opus]
- F3 Planner (33.2): checkable acceptance, never invents agents, unmappable→needs_human — [Opus]
- F4 Workers: §27 per-agent spec, one at a time, eval harness each — [GLM]
- F5 Critic (33.3): ≥80 pass, defect-list returns, 2-fail escalation, no loops — [Opus rubric]
- F6 Approval UI → hand off to T1_04 (see `command center` in portfolio-demo-factory / P6)
- F7 grounding freshness (33.5) — **build even solo** — F8 observability + prompt registry (33.8)

## Single-agent carve-out (client #1 default — T1_02 §7)
Build ONLY: `entities`+`knowledge_chunks`+one memory table · one worker (receptionist/SDR) · grounding freshness · one escalation path (WHAT/WHY/EVIDENCE notification per 33.7). ~2–3 days, slots into the fleet later with zero rework.

## Routing rule (memorize)
A bug that could leak tenant data, wrongly fire an irreversible action, or quote a wrong fact → **Opus/Claude Code**. Everything else → **GLM/Hermes**.

## Chains with (adjust names to your installed skills)
- Consumes: **supabase-backend-pro** (schema/RLS/webhook hardening for F1), **security sweep** (before any deploy)
- Feeds: **client onboarding** (fleet SLA sheet from T1_03 §5 goes in the agreement), **retention ops** (the T1_03 §2D Analyst weekly report), **self-annealing** (Critic defect patterns → permanent prompt-registry edits)
- Escalation runbook + operator's day: `references/T1_03_EMPLOYEE_OPERATIONAL_WORKFLOW.md`
