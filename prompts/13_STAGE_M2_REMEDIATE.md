# 13 — STAGE M2: SEALED REMEDIATION
Role: M2. Any CLI.

Fix ONLY state/SEALED_REMEDIATION_QUEUE.yaml. Nothing else, however tempting.

Per finding: fix → run its acceptance test → run the full regression suite → evidence →
commit. If a fix breaks something else, stop and report rather than cascading changes.

When the queue is clear, set required_role: C3 and commit.
