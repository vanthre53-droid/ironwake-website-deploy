# 10 — STAGE C1: ARCHITECTURE, RESEARCH, SEALED QUEUE
Role: C1. Any CLI. Ends at GC1_ARCHITECTURE_APPROVED.

C1 owns judgment. C1 writes no production feature code.

1. Complete P0 and P1 (prompts 01, 02) if not already evidenced.
2. Design the full W00-W22 architecture: data model, RLS, routes, components, providers,
   risk/security/privacy model, social execution design.
3. Select skills per AGENTS.md §6; record in reports/SKILL_USAGE_LOG.md.
4. Decompose EVERYTHING into atomic, independently testable tasks.
5. Write state/SEALED_TASK_QUEUE.yaml — each task with acceptance test + evidence path +
   authority class. Set sealed: true, record sealed_commit.
6. Set required_role: M1. Checkpoint and commit.

A sealed queue is a contract. If M1 later finds it wrong, M1 stops and reports — it does
not silently redesign.
