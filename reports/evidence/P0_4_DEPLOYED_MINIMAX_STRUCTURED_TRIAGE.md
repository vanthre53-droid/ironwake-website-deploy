# P0.4 Deployed MiniMax Structured Triage

**UTC:** 2026-08-10T00:00Z  
**Result:** `FAILED_LIVE`

- New Netlify site `ironwake-20260810013623-17343.netlify.app` published candidate `7bfee26` as deploy `6a79498cda82b42dc9adbe7f`.
- Three controlled synthetic inquiries reached the deployed MiniMax boundary and persisted safely, but returned `invalid_output`, `provider_timeout`, and `invalid_output`; no structured completion was stored.
- Direct MiniMax HTTP 200 with the configured base/model/key confirms provider access. The remaining defect is the deployed adapter’s fixed 8-second timeout/output handling.
- Correction candidate `ebd20ba` passes 4/4 focused AI tests and one local real-provider call returns `complete` with provider `minimax` and model `MiniMax-M3`. This is local evidence only because the candidate is not deployed under the one-deploy budget.
- A local optimized build and local production-server audit path using `ebd20ba` then stored a `complete` MiniMax result in the existing Supabase project (`provider=minimax`, `model=MiniMax-M3`, `triaged_at` present). This strengthens the held-candidate evidence but does not change the failed live status.
- Local failure-injection tests still cover timeout, provider-unavailable, and invalid-output classification. MFA-enrolled owner-session evidence remains separate and unproved.
