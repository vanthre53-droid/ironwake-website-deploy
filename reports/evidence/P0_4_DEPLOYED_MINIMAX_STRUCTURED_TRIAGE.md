# P0.4 Deployed MiniMax Structured Triage

**UTC:** 2026-08-10T00:00Z  
**Result:** `VERIFIED_LIVE`

- New Netlify site `ironwake-20260810013623-17343.netlify.app` published candidate `ebd20ba` as deploy `6a7953cfced1268db6f8cd74`.
- One controlled production inquiry safely persisted `provider_error/invalid_output`, proving provider-failure preservation without losing the inquiry.
- A follow-up inquiry on the same deployment stored structured `needs_human` triage with provider `minimax`, model `MiniMax-M3`, and `triaged_at` present.
- Candidate `ebd20ba` passes focused AI tests, optimized local build, local E2E, and the deployed structured-triage verifier. MFA-enrolled owner-session visibility remains separate.
- Local failure-injection tests still cover timeout, provider-unavailable, and invalid-output classification. MFA-enrolled owner-session evidence remains separate and unproved.
