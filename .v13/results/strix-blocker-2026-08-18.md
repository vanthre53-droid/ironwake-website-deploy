# Strix — External Blocker (2026-08-18)

## Status: BLOCKED_EXTERNAL

`strix` 1.5.3 installed at `/home/shadowlingo/.strix/bin/strix`. All 11 prior runs in `strix_runs/` against this repo are `interrupted` (10) or `stopped` (1) — same root cause every time.

## Real output (this turn)

```
$ strix -n -t . -m standard --scope-mode full --max-budget 10
Error code 429 - usage_limit_reached
plan_type: plus, resets in ~50.9 h (~2026-08-20 17:14 UTC)
```

## What this is

The configured `STRIX_LLM=chatgpt/gpt-5.4` model is on the ChatGPT Plus subscription cap. The 429 is upstream of strix — no `--max-budget` retuning bypasses it. Subscription tier, not a tool config.

## Next action

- Pass on the Strix cycle with **PARTIAL** status per .v13/TODO.md TODO-29 (this audit sits in the parts of the goal that are *defense-in-depth*, not in the 6 deploy-blocking gates).
- Auto-resume when the clock passes 2026-08-20 17:14 UTC — re-run `strix -t . -m standard --scope-mode full` against this repo.
- Until then, every prior run's vulns (only `vuln-0001` material: rate-limit x-forwarded-for header spoof) remain **already fixed** in `lib/request-rate-limit.mjs` via the `cf-connecting-ip` trust boundary.

## Verification

- `which strix` → `/home/shadowlingo/.strix/bin/strix`
- `strix --version` → `strix 1.5.3`
- `strix --help` → renders
- `strix -n -t . -m standard --scope-mode full --max-budget 10` → HTTP 429 `usage_limit_reached`
- 11 prior runs in `strix_runs/` all hit the same wall; `vuln-0001` is the only material finding and is already patched.
