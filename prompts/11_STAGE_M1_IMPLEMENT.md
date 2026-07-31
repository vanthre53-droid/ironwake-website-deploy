# 11 — STAGE M1: SEALED IMPLEMENTATION
Role: M1. Any CLI. Ends at GM1_IMPLEMENTATION_COMPLETE.

Implement state/SEALED_TASK_QUEUE.yaml exactly. Do not add scope. Do not redesign.

Per task: implement → run its named acceptance test → write its evidence file → update
state → commit. One task, one commit.

Order per AGENTS.md §7 (build order). Database and API tests precede dependent UI.
No UI may simulate a backend success state that has not actually occurred.

If a task is impossible, ambiguous, or wrong: mark it blocked, record exactly why, move to
the next unblocked task. Do not guess and do not silently drop it.

When the queue is fully done or blocked, set required_role: C2 and commit.
