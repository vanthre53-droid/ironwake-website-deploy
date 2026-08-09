# Retention and deletion decision packet — D-008

- Prepared: 2026-08-09
- Role: C1
- Scope: single-owner IronWake CRM data only
- Status: `OPEN — ADULT/LEGAL-OWNER DECISION REQUIRED BEFORE ANY DELETION, ANONYMIZATION, OR SCHEDULED EXECUTOR`

## Verified starting point

- G2 approves a 90-day retention target, minimised data collection, secure export,
  immediate contact opt-out, and reviewed additive CRM controls.
- The live database has a security-definer retention function callable by
  `service_role` only. Live readback found no currently expired pending inquiry,
  two historical anonymized inquiries, and no `pg_cron` relation.
- The local owner view can show retention/anonymized state and withdraw contact
  consent. It cannot invoke anonymization or deletion.
- Existing consent withdrawal is deliberately narrower than deletion: it stops
  future contact and cancels unsent customer notifications while retaining the
  minimum audit record.

## Decision required

| Item | Recommended decision | Why it is required | Alternatives / effect |
|---|---|---|---|
| D-008A: lawful retention rule | Confirm 90 days for inquiry/contact operational data, measured from receipt; preserve only redacted audit/suppression evidence after anonymization. | A target duration alone does not define legal basis, exceptions, or what remains. | Select another duration or jurisdiction-specific rule; code, notices, and testing must change together. |
| D-008B: deletion request authority | Accept requests only through a verified owner-reviewed workflow; never automate public deletion from a raw form or email. | Prevents fraudulent or cross-object deletion and preserves a checkable audit trail. | Add a verified requester flow after legal review; this needs identity-verification and abuse controls. |
| D-008C: execution and recovery | Require a pre-execution report, a named owner confirmation, a deletion/anonymization audit event, processor propagation review, and restore/backup handling before enabling a job. | The current service-role function has no scheduler, report, restoration proof, or processor lifecycle. | Keep manual execution disabled indefinitely; public copy must remain truthful. |
| D-008D: test authority | Approve one specified synthetic record for the G6 deletion/anonymization and export/recovery test only after the preceding controls are live. | Production destructive proof must be narrow, reversible where possible, and attributable. | Defer all destructive proof; the capability remains partial. |

## Sealed implementation boundary

Until D-008 is recorded by the adult/legal owner, implementation may only:

- display retention and suppression status to the authorized owner;
- create drafts, tests, reports, and request records that do not invoke deletion;
- retain the existing export and consent-withdrawal controls;
- audit and harden authorization, logging, and private response handling.

It may not schedule the current function, execute anonymization/deletion, delete
customer records, reduce backup retention, send deletion notices, or claim a
verified deletion process.

## Evidence needed to close D-008

1. Named adult/legal-owner decision entered in `inputs/APPROVALS.md`.
2. Updated privacy/legal notice approved for the real entity, markets, and
   processors.
3. A reviewed implementation with owner authorization, pre-execution report,
   minimal metadata-only audit logging, and processor/backup handling.
4. An approved G6 synthetic test proving export, requested deletion/anonymization,
   no unintended notification, durable evidence, and the documented restoration
   posture.

This packet does not authorize a production data operation.
