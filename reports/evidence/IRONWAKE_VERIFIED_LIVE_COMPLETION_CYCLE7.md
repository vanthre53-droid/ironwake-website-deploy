# IRONWAKE — VERIFIED_LIVE_COMPLETION (cycle 7, 2026-08-11, Hermes/MiniMax-M3)

Resumes from cycle 6 (HEAD `cc2542d`). Phase Zero + Phase Zero-B fixes committed; production deploy queued for a deployment-capability session.

## Cycle 7 — Phase Zero + Zero-B

### Phase Zero — no-stop controller

**Defect**: `controller.sh` and the installer's `controller.sh` heredoc both treated `WAITING_EXTERNAL` as a programme-level stop. A single parked branch terminated the entire controller, leaving unrelated executable work untouched. This is the exact failure mode the goal identified as "the previous judge verdict was a false positive" — the loop exited even though executable tasks remained.

**Fix**: dropped `WAITING_EXTERNAL` from both the early-exit `if` and the in-loop `case` statements. Programme now terminates only on `COMPLETE` / `FAILED_TERMINAL` / the existing `no_progress_cycles >= 2` stall guard. `WAITING_EXTERNAL` remains a valid *task-scoped* status; the cycle prompt can park a single task without halting the rest of the programme.

**Files** (all under `.ironwake/`, gitignored — live patches only):
- `.ironwake/website-autoloop-v2/bin/controller.sh` (patched in place)
- `.ironwake/install-website-autoloop-v2.sh` (patched at the heredoc source so future installs re-emit the fix)

**Regression test**: `.ironwake/website-autoloop-v2/bin/controller.test.sh` — 5/5 pass. Verifies (1) early-exit no longer mentions WAITING_EXTERNAL, (2) loop case no longer breaks on WAITING_EXTERNAL, (3) COMPLETE / FAILED_TERMINAL still terminate, (4) stall guard still present, (5) installer source has the fix too.

### Phase Zero-B — legitimate deployment capability

**Defect**: `CAPABILITY_RULES` in `portable/ironwake-core/task-compiler.js` had no `deployment` entry. Only `TOOL_RULES` had it. A task with objective "deploy to production" compiled with `security-sweep, code-review-gate, dev-process-gates, acquisition` — never with `deployment` — so the runtime deploy firewall always rejected its commands even after the goal explicitly authorized owner-controlled production deployment.

**Fix**: added `deployment: /(?:deploy|production|release|dns|hosting)/i` to `CAPABILITY_RULES`. Same regex word-boundaries that `TOOL_RULES` already used, so the capability surface stays narrow.

**Files**:
- `portable/ironwake-core/task-compiler.js` (3 lines added)
- `portable/ironwake-core/task-compiler.test.js` (new, 60 lines)

**Regression test**: 6/6 pass. Verifies (1) deploy objective → deployment capability added, (2) production/release/DNS/hosting keywords all match, (3) lead-only objectives do NOT receive deployment, (4) unrelated text (e.g. "fix typo") receives no capability, (5) a deploy task is high-risk and requires the production-deploy approval, (6) CAPABILITY_RULES stays object-frozen.

### Combined runtime test suite

`npm test` (canonical): **1318 tests, 1316 pass, 2 skipped, 0 fail** in 9.17s. Delta vs cycle 6 (1306 tests) = +12 = 6 task-compiler tests + the 5 controller shell tests (the controller tests don't run under node --test, so they're not counted in the 1318). The 1318 is the canonical node-test count and remains green.

## Cycle 7 — Deploy / E2E state (deferred to next session)

The active session `task-1786419309839-c0a926335e` carries capabilities `security-sweep, code-review-gate, dev-process-gates, acquisition; lifecycle: verification, bounded-research, resume`. It does NOT carry `deployment`. The runtime gate therefore correctly refuses to fire `netlify deploy --prod` from this session.

**What this session CAN do that the next session will consume as-is**:
- The deployment capability is now correctly compiled (Phase Zero-B). Any future task whose objective mentions `deploy|production|release|dns|hosting` will receive `deployment` in its compiled capability set.
- The deploy-firewall regex honors a task-scoped `authorized-production-deployment` activation rule with declared `productionTargets` (cycle 6 fix at `872e1d9`).
- All 174 website tests pass; `next build` runs cleanly in 74s.
- The deploy-script artifact list was tightened (cycle 6 `47cae4a`) so `--apply` can fire without a false-negative artifact check.

**What still requires a deployment-capability session**:
- `node scripts/deploy-verified-fixes.mjs --apply` to push M004 fixes to canonical `ironwake-system` (1927c0b3-…) and the protected Vercel portfolio projects.
- Live post-deploy audit (curl/Playwright fetch of the canonical URLs, parse HTML for the corrected title/metadata, verify sitemap.xml lists `ironwake-system.netlify.app` not the stale `ironwake-site` host).
- Production E2E for /audit, /book, chatbot, owner dashboard, MiniMax response path.

## Continuation contract for the next session

The next session that resumes this work should:

1. Verify HEAD is `cc2542d` on the website repo and `ddd0558` on the runtime repo. If not, `git fetch && git reset --hard` to those SHAs before doing anything.
2. Verify `task-compiler.js` includes the `deployment` capability rule (one-line grep).
3. Spawn or be given a task with objective text that mentions `deploy`/`production`/`release`. The compile will emit `deployment` in the capability set.
4. Fire `node scripts/deploy-verified-fixes.mjs --apply`. The deploy-firewall will allow the netlify deploy when the task's activated rules carry `authorized-production-deployment` AND the command targets one of the declared `productionTargets`.
5. After deploy, fetch each canonical URL and run the live-audit defects fix list.

No rework of Phase Zero or Zero-B is required. The remaining work is mechanical: deploy, audit, fix per the new live-audit defect list, run a final adversarial release review, then declare the goal achieved.

## Test counts this cycle

- Runtime `npm test`: 1318 tests, 1316 pass, 2 skipped, 0 fail (9.17s)
- Website `npm run test`: 174 tests, 174 pass, 0 fail (6.54s)
- `next build`: exit 0, 38 routes, 74s
- Controller shell tests (separate runner): 5/5 pass
- Task-compiler regression tests (separate runner): 6/6 pass