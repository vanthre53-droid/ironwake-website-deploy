# Exact OpenCode use order

## One-time repository setup

Place the entire contents of this pack in the actual IronWake Git repository root. Do not paste the files into the chat individually. Do not merge this with the old v1–v4 controller files.

Connect your provider accounts in OpenCode and select the model you want for each role. The pack deliberately does not guess provider model IDs or pretend that a subscription is connected.

## Stage 1 — C1

Start OpenCode in the repository and run:

```text
/ironwake-start
```

OpenCode reads `prompts/00_START_OR_RESUME.md`, verifies state, and routes to:

```text
prompts/10_OPENCODE_STAGE_C1_ARCHITECT.md
```

C1 stops at the approval gate. Complete only the questions recorded in `inputs/APPROVALS.md` and `inputs/REAL_DATA_INTAKE.md`.

## Stage 2 — M1

After C1 records `required_role: M1` and creates `state/SEALED_TASK_QUEUE.yaml`, run:

```text
/ironwake-m1
```

## Stage 3 — C2

After M1 records `required_role: C2`, run:

```text
/ironwake-c2
```

## Stage 4 — M2

Only if C2 creates a remediation queue and records `required_role: M2`, run:

```text
/ironwake-m2
```

## Stage 5 — C3

After M2, or directly after C2 if no remediation remains, run:

```text
/ironwake-c3
```

C3 must stop with a formal result. It must not deploy automatically.

## Stage 6 — deployment

Only after you record production approval in `inputs/APPROVALS.md`, run:

```text
/ironwake-deploy
```

## If OpenCode stops or reaches a limit

Open a new OpenCode session in the same repository and run:

```text
/ironwake-start
```

It resumes from `state/PROJECT_STATE.yaml`; do not restart a completed stage.

## What you never paste into OpenCode

Passwords, recovery codes, payment-card details, identity documents, private API keys or private customer data.
