# Build + Dry-Run Report — V13 (wave-2 HEAD)

**Generated:** 2026-08-18 (UTC)
**Workspace:** `/mnt/c/Users/vanth/Downloads/ironwake`
**HEAD commit:** `b7fedfd` (master; 160 unpushed)
**Wave-2 commit under review:** `d48505f` — *v13(wave-2): cf env fix + retell sdk + formal state machine + dag + observability + file ownership*

---

## 1. `npm run build`

| Metric | Value |
|---|---|
| Status | ✅ PASS |
| Toolchain | Next.js 16.2.12 (Turbopack) |
| TypeScript | ✅ Finished in 1137ms |
| Wall-clock | 110s |
| Compile | 21.7s |
| Static pages | 60/60 generated in 9.4s |
| Total routes | 60 (1 static set + 1 dynamic middleware) |
| Static (○) | 38 |
| Dynamic (ƒ) | 16 |
| SSG (●) | 1 (`/insights/[slug]` — 4 instances) |
| Warnings | 1 — `middleware` file convention deprecated; should rename to `proxy` (cosmetic, non-blocking) |

Route inventory (highlights):
- Pages: `/`, `/about`, `/admin`, `/audit`, `/book`, `/chat`, `/forgot-password`, `/industries/*`, `/insights`, `/login`, `/owner`, `/pricing`, `/privacy`, `/process`, `/scope`, `/signup`, `/systems/*`, `/terms`, `/update-password`, `/voice`, `/work/*`, etc.
- API: `/api/audit`, `/api/chat`, `/api/cron/notifications`, `/api/owner/{export,notification-readiness,whoami}`, `/api/voice/session`, `/api/webhooks/{meta/whatsapp,resend,retell}`
- Auth: `/auth/callback`, `/auth/confirm`
- Special: `/account`, `/meta/data-deletion`, `/sitemap.xml`, `/manifest.json`, `/robots.txt`
- Middleware: 1 (Proxy/Middleware — handles auth + cron gating)

---

## 2. `npm run build:worker`

| Metric | Value |
|---|---|
| Status | ✅ PASS |
| Wall-clock | 443s |
| OpenNext CF | 1.20.2 / AWS 4.1.0 |
| Worker saved | `.open-next/worker.js` (2278 B — wrapper that imports the server bundle) |
| Output tree | `.open-next/{assets,cache,cloudflare,cloudflare-templates,dynamodb-provider,middleware,server-functions}` |

Bundle composition:

| Artifact | Size (raw) | Size (gzip) |
|---|---:|---:|
| `.open-next/server-functions/default/handler.mjs` (server bundle) | 8,763,773 B (8.36 MiB) | n/a — bundled into worker-entry |
| `.open-next/server-functions/default/index.mjs` | 116,485 B | n/a |
| `.open-next/middleware/handler.mjs` | 719,564 B (0.69 MiB) | 163,701 B (0.16 MiB) |
| `.open-next/assets/` (static) | ~1.8 MiB | (HTTP-gzip at edge) |
| `.open-next/cloudflare/` (templates + helpers) | 52 KiB | n/a |
| Total `.open-next/` | ~38 MiB on disk | — |

Chunk / file counts:
- Files inside `.open-next/`: **1,540** (`.js`/`.mjs`/`.cjs`)
- Files inside `.open-next/server-functions/default/`: **1,604**
- Client static JS chunks (in `assets/_next/static/chunks/`): **46** files
- Functions defined inside server `handler.mjs`: **252**

Warnings emitted:
- `workerd compatibility_date: 2024-12-30, consider updating your wrangler config to a more recent date to benefit from the latest features and fixes.` — advisory, non-blocking.

---

## 3. Wrangler Dry-Run

Command: `npx wrangler deploy --dry-run --outdir=/tmp/v13-dry-run`

| Metric | Value |
|---|---|
| Status | ✅ PASS |
| Wrangler | 4.120.0 |
| Files read from `.open-next/assets/` | 72 |
| Total Upload (assets) | 12,948.55 KiB (12.65 MiB) |
| gzip total | 2,748.25 KiB (2.68 MiB) |
| `worker-entry.js` raw | 13,259,315 B (12.65 MiB) |
| `worker-entry.js` gzip | 2,813,252 B (2.68 MiB) |
| Dry-run outdir | `/tmp/v13-dry-run/{worker-entry.js, worker-entry.js.map, README.md}` |

### Bindings (3)

| Binding | Resource |
|---|---|
| `env.WORKER_SELF_REFERENCE` | Worker (self) |
| `env.ASSETS` | Assets (`.open-next/assets/`) |
| `env.NEXT_PUBLIC_SITE_URL` | Environment Variable — `https://ironwake.dev` |

### Vars (1)

`NEXT_PUBLIC_SITE_URL=https://ironwake.dev`

### Secrets (18 — verified via `wrangler secret list`)

`AI_API_BASE, AI_API_KEY, AI_MODEL, EMAIL_FROM, EMAIL_NOTIFICATION_RECIPIENT, EMAIL_PROVIDER, INDEXNOW_KEY, META_APP_ID, META_APP_SECRET, META_WA_PHONE_NUMBER_ID, META_WA_VERIFY_TOKEN, RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_WEBHOOK_SIGNING_SECRET, RETELL_AGENT_ID, RETELL_API_KEY, RETELL_WEBHOOK_API_KEY, SUPABASE_SERVICE_ROLE_KEY`

Matches `scripts/worker-secrets-audit.mjs` required list exactly.

### Routes (2)

| Pattern | Custom domain |
|---|---|
| `ironwake.dev` | true |
| `www.ironwake.dev` | true |

### Compatibility

- `compatibility_date`: **2024-12-30** (advisory: OpenNext suggests a more recent date; not blocking)
- `compatibility_flags`: **`nodejs_compat`**, **`global_fetch_strictly_public`**
- `placement.mode`: `smart`
- `workers_dev`: `false`
- `triggers.crons`: `[ "*/2 * * * *" ]` (1 entry)

---

## 4. Code Review — V13 wave-2 diff (`d48505f~1..d48505f`)

### Diff shape

```
45 files changed, 5283 insertions(+), 903 deletions(-)
```

### File list (45 files, sorted by activity)

Modified (24): `app/audit/AuditForm.js`, `app/components/MotionReveal.js`, `app/components/VoiceSessionLauncher.js`, `app/icon.test.js`, `app/layout.js`, `app/manifest.json`, `app/page.js`, 8× case-study pages, `app/work/dentacare-pro/DentaCareCaseStudy.test.js`, `app/work/rapidpulse/RapidPulseCaseStudy.test.js`, `scripts/worker-secrets-audit.{mjs,test.mjs}`, `wrangler.jsonc`, `package.json`, `package-lock.json`, `app/globals.css`.

Added (21):
- `.v13/MACHINE.{json,schema.json,yaml}` — global state machine, schema-validated
- `.v13/results/agent-observability.md`
- `app/components/CaseStudyStory.js` (156)
- `app/components/VoiceSessionLauncher.test.js` (37)
- `app/components/home/Scrollytelling.js` (95)
- `app/components/motion.js` (240)
- `lib/design-system/IRONWAKE_DESIGN_BRIEF.md` (217)
- `lib/design-tokens.ts` (72)
- `reports/CREDENTIAL_CAPABILITY_MATRIX.md` (327)
- `reports/axe-cdp-report.json` (140) + `…deprecated-netlify.json` (140)
- `reports/perf-live-measurement-2026-08-18.md` (54)
- `scripts/axe-cdp-run.mjs` (322)
- `scripts/axe-debug.mjs` (83)
- `state/states.md` (155), `state/states.yaml` (554)
- `supabase/migrations/20260818090000_webhook_dedup_and_meta_deletion.sql` (48) + `.test.mjs` (54)

### New files > 100 lines — header / purpose checks

| File | Lines | Has purpose comment? |
|---|---:|---|
| `state/states.yaml` | 554 | ✅ schema header + 7.0.0 DAG contract |
| `.v13/MACHINE.yaml` | 347 | ✅ `# IronWake V13 — Global State Machine (formal)` + companion-files map |
| `reports/CREDENTIAL_CAPABILITY_MATRIX.md` | 327 | ✅ Generated, method, project fields |
| `.v13/MACHINE.json` | 324 | ✅ `$schema`, `$id`, `title`, `version`, `source_of_record` |
| `scripts/axe-cdp-run.mjs` | 322 | ✅ `// ponytail: real axe-core + real chromium audit…` |
| `app/components/motion.js` | 240 | ✅ `// ponytail: motion primitives — small hooks + components…` |
| `lib/design-system/IRONWAKE_DESIGN_BRIEF.md` | 217 | ✅ `# IronWake Composite Design Standard — V13` |
| `app/components/CaseStudyStory.js` | 156 | ✅ `// ponytail: shared story-driven case-study shell…` |
| `state/states.md` | 155 | ✅ Generated, source DAG contract header |
| `reports/axe-cdp-report.json` | 140 | ✅ `tool`, `toolVersion`, `runner`, `chromiumBinary`, ISO timestamps |
| `reports/axe-cdp-report.deprecated-netlify.json` | 140 | ✅ same header shape |

All 11 new files > 100 lines carry a header explaining purpose (ponytail comment, schema header, or generated-by/method metadata).

### `console.log` / `console.warn` / `debugger` in `app/**` or `lib/**`

```
TOTAL_MATCHES=0
```

✅ None.

### `console.error` review (informational, not part of the audit rules)

| Location | Context |
|---|---|
| `app/api/audit/route.js:46,65,87,98,113` | structured error logging inside `catch` handlers (env-missing, persistence failure, queue failure) — all legitimate error reporting |

### `TODO` / `FIXME` / `XXX` in shipped code (`app/`, `lib/`, `scripts/`)

```
TOTAL=0
```

✅ None.

### Middleware deprecation

- Next.js prints `The "middleware" file convention is deprecated. Please use "proxy" instead.` Cosmetic, not blocking. Worth a follow-up rename in a future wave.

### OpenNext compat-date advisory

- `compatibility_date: 2024-12-30` — OpenNext suggests bumping for "latest features and fixes". Advisory, not blocking. CF platform will still accept; bump when a feature requires it.

---

## 5. Verdict

**ready-to-deploy: ✅ YES**

Blockers: none.

Optional follow-ups (non-blocking, do not gate deploy):
1. Rename `middleware` → `proxy` to clear the Next.js deprecation warning.
2. Bump `wrangler.jsonc` `compatibility_date` past `2024-12-30` to silence OpenNext advisory.
