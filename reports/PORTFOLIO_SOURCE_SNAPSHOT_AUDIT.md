# P0 Portfolio Source Snapshot Audit — P1, P3, P10

- Audited: 2026-07-26T16:05:00Z
- Method: SHA-256 readback, ZIP central-directory inspection, read-only extraction to a temporary directory, static manifest/config/source review. No archive script, build, server, provider request, deployment, or external account action was run.
- Classification: source access is available through immutable ZIP snapshots; it is **not** proof of a live deployment, client engagement, provider success, current security posture, or portfolio result.

## Snapshot readback

| Portfolio ID | Candidate archive | SHA-256 | Code observed | Test evidence observed | Provider/config references | Provider proof | Public status and only allowed wording |
|---|---|---|---|---|---|---|---|
| P1 RapidPulse | `ironwakeportifolioprojects/rapidpulse-plumbing.zip` | `04e0651016ab3ffc4f594f33b8122613aa85f5188228f3592c6c44d15de3d26a` | 32 files; React/Vite/Express/TypeScript snapshot with Firebase and Gemini references; API routes for health, chat, image generation, lead submission, transcription, user sync, and jobs | No test script, test configuration, or test files. `security_spec.md` is a proposed test outline only, not execution evidence. | Firebase client/admin config and `GEMINI_API_KEY` name; static review found a hard-coded server-secret-like literal in code/rules and browser-style Firebase configuration. Values are intentionally not reproduced. | None. No signed callback, durable database readback, provider account ownership, or live URL was supplied. | `DEMONSTRATION — source snapshot inspected; provider proof pending.` Do not claim live dispatch, real-time job status, booking success, AI availability, price, technician availability, result, or client engagement. |
| P3 DentaCare Pro | `ironwakeportifolioprojects/manchester-gentle-dental.zip` | `47058728aa71d9b9f0570bd59abb09c414a060df305d98fb03fed20162725e7f` | 27 files; React/Vite/Express/TypeScript snapshot with Firebase and Gemini references; API routes for chat, health, authenticated appointments, lead submission, image/video generation, video status/download | No test script, test configuration, or test files. | Firebase configuration, `GEMINI_API_KEY` name, and Gemini/Firebase source references. | None. No signed callback, durable appointment/lead readback, provider account ownership, or live URL was supplied. | `DEMONSTRATION — source snapshot inspected; provider proof pending.` Do not claim appointment confirmation, medical/clinical outcome, AI image/video availability, review authenticity, pricing, or client engagement. |
| P10 Atelier | `ironwakeportifolioprojects/atelier-luxury-salon.zip` | `3352858f9205c80c9c41f744fc9e69f079f11e7d2808910877fbe662108d7afd` | 41 files; React/Vite/Express/TypeScript snapshot with Gemini references; API routes for AI chat, image generation, and image analysis | No test script, test configuration, or test files. | `GEMINI_API_KEY` name and Gemini server-source references. | None. No signed callback, durable booking/order readback, provider account ownership, payment integration, or live URL was supplied. | `DEMONSTRATION — source snapshot inspected; provider proof pending.` Do not claim live consultation, booking/payment/order/delivery success, verified reviews, AI availability, price, or client engagement. |

## Claim and asset quarantine findings

The snapshots contain UI/data strings that imply operational states or commercial proof. They are source fixtures, not evidence: P1 contains seeded dispatch/jobs and availability language; P3 contains appointment/review and AI-generation interfaces; P10 contains booking/order/delivery states, product pricing, `LIVE` labels, testimonial/review data, and external image URLs. The static scan counted 3, 6, and 96 image-related external URL references respectively for P1, P3, and P10.

These findings extend the public claim and asset quarantine. No screenshot, visible code path, health route, configuration file, or README is accepted as provider proof. A source snapshot may support a future technical demonstration only after the P1.5 proof gate has verified its own test environment, default/failure/recovery/mobile states, permitted assets, and exact public wording.

## Security handling

One P1 source snapshot contains hard-coded secret-like control values. Their contents are not copied into this report or the controller repository. The archive remains unmodified. If any value is active, its owner must rotate/revoke it outside this repository before a controlled test; the archive must not be used as a deployment baseline.

## Reproducible readback

```text
sha256sum ironwakeportifolioprojects/{rapidpulse-plumbing,manchester-gentle-dental,atelier-luxury-salon}.zip
unzip -Z1 <archive>
# Read-only temporary extraction, followed by manifest/source inspection; no script execution.
```

## Consequence and next gate

P1/P3/P10 source-access readiness is recorded as available. Their portfolio and provider truth remains blocked pending human-supplied live URLs, owned test environments, current provider ownership, reproducible test output, and approved claim wording at G1.5. This audit satisfies source discovery only; it does not pass Gate A1.5.
