# Portfolio Proof Gate

- Gate: `G1_5_PORTFOLIO_TRUTH_GATE`
- Prepared: 2026-07-28
- Executor: OpenCode M1
- Status: `READY_FOR_G1_5_DEMO_APPROVAL`

## Evidence boundary

Verified evidence is limited to the immutable source-snapshot audit and the read-only public URL readback:

- `reports/PORTFOLIO_SOURCE_SNAPSHOT_AUDIT.md`
- `reports/PORTFOLIO_URL_READBACK.md`
- `reports/CLAIM_QUARANTINE.md`
- `reports/ASSET_LEDGER.md`
- `inputs/REAL_DATA_INTAKE.md`

These records establish source availability or page reachability only. They do not establish client engagement, provider success, payment, security posture, uptime, metrics, or production ownership.

## Nine-project classification

| Project | Verified state | Allowed internal classification | Public disposition |
|---|---|---|---|
| P1 RapidPulse | Source snapshot and public URL readback; portfolio demonstration | `PORTFOLIO DEMONSTRATION — capability proof; not a client engagement` | Eligible for inclusion after G1.5/G3 wording approval |
| P2 Harbour Estates | Public URL readback only; no source/provider/client proof | `DEMONSTRATION — provider proof pending` | Defer |
| P3 DentaCare Pro | Source snapshot and public URL readback; portfolio demonstration | `PORTFOLIO DEMONSTRATION — capability proof; not a client engagement` | Eligible for inclusion after G1.5/G3 wording approval |
| P4 Aura Archives | Public URL readback only; no source/provider/client proof | `DEMONSTRATION — provider proof pending` | Defer |
| P6 Luxe Studio | Public URL readback only; payment/provider proof pending | `DEMONSTRATION — provider proof pending` | Defer |
| P7 Bramble Cafe | Public URL readback only; generic title and POS/payment proof pending | `DEMONSTRATION — provider proof pending` | Defer |
| P8 Voltix | Public URL readback only; auth/payment proof pending | `DEMONSTRATION — provider proof pending` | Defer |
| P9 RE-TECH | Public URL readback only; generic title and staff/operations proof pending | `DEMONSTRATION — provider proof pending` | Defer |
| P10 Atelier | Source snapshot and public URL readback; portfolio demonstration | `PORTFOLIO DEMONSTRATION — capability proof; not a client engagement` | Eligible for inclusion after G1.5/G3 wording approval |

P5 has no supplied evidence and is omitted.

## Gate checks

| Check | Result | Evidence |
|---|---|---|
| Source access for P1/P3/P10 | `PASS_FOR_SOURCE_DISCOVERY` | `reports/PORTFOLIO_SOURCE_SNAPSHOT_AUDIT.md` |
| Public URL reachability | `PASS_FOR_READBACK_ONLY` | `reports/PORTFOLIO_URL_READBACK.md` |
| Reproducible executable tests | `NOT_VERIFIED` | No test output supplied or run against the snapshots |
| Signed provider callbacks | `NOT_REQUIRED_FOR_DEMO` | These are portfolio demonstrations, not client/provider engagements |
| Durable database/provider readback | `NOT_REQUIRED_FOR_DEMO` | Provider success is not claimed |
| Client engagement or permission | `NOT_REQUIRED_FOR_DEMO` | User identified the projects as capability-proof portfolio work |
| Approved production assets | `NOT_VERIFIED` | `reports/ASSET_LEDGER.md` quarantines prototype/external assets |
| Approved public claims | `NOT_VERIFIED` | `reports/CLAIM_LEDGER.md`; unsupported claims remain quarantined |

## Conclusion

The portfolio proof gate is ready for named G1.5 approval as a demonstration-only portfolio. No project may be presented as a client engagement, verified provider integration, result, testimonial, payment, booking, or security proof.

## Required next evidence

1. Named approval of the demonstration-only wording in G1.5/G3.
2. Reproducible test output only when a future claim goes beyond visual/capability demonstration.
3. Provider callback and durable readback only when a future project is presented as an actual connected integration.
