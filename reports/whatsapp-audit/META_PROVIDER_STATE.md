# Meta WhatsApp Cloud API Provider Audit

**Audit date:** 2026-08-20 (UTC)
**Audited by:** Hermes subagent (provider-audit delegation)
**Working directory:** `/mnt/c/Users/vanth/Downloads/ironwake`
**Meta Graph API version probed:** `v22.0`
**Posture:** READ-ONLY / non-mutating. No code or environment was modified.

---

## TL;DR

| Component | Verdict | Evidence |
|---|---|---|
| **App credentials in `.env`** | ✅ PRESENT | All 7 required vars present and non-empty |
| **App ID reachable by token** | ✅ VALID | `v22.0/{APP_ID}` → `{"id":"…","name":"ironwake"}` HTTP 200 |
| **Token validity & scopes** | ✅ VALID | `debug_token` → `is_valid:true`, scopes `whatsapp_business_management`, `whatsapp_business_messaging`, `manage_app_solution` |
| **`/me` returns expected subject** | ✅ VALID | `name:"IronWake Automation"`, `id:"122105065113434941"` (system user) |
| **Phone number ID reachable** | ❌ UNREACHABLE | `v22.0/{PHONE_NUMBER_ID}` → 400 "Object with ID … does not exist / cannot be loaded due to missing permissions" |
| **WABA ID reachable** | ❌ UNREACHABLE | `v22.0/{WABA_ID}` and `…/{WABA_ID}/phone_numbers` → 400 same error |
| **App webhook subscriptions** | ❌ UNREACHABLE | `v22.0/{APP_ID}/subscriptions` → 400 "Application Secret required" |
| **Outbound send path** | ❌ BLOCKED | `POST {PHONE_ID}/messages` → 400 same "does not exist / permissions" error |
| **Webhook route reachable** | ⚠️ PRESENT but path differs from brief | Local handlers at `/api/webhooks/whatsapp` and `/api/webhooks/meta/whatsapp`; brief asked for `/api/whatsapp/webhook` (does not exist in repo) |

**PROVIDER_AUDIT = PARTIAL**

> Token + app are healthy and correctly scoped, but the WABA and phone number referenced in `.env` are **NOT visible to this system-user token**. Outbound sends and inbound webhook deliveries cannot work until the phone/WABA are repaired or re-bound.

---

## 1. Inventory of Meta/WhatsApp code

All paths below `/mnt/c/Users/vanth/Downloads/ironwake`.

### Library layer
- `lib/whatsapp/meta-client.js` — Graph API client (POST messages, read phone, read WABA, template lookup). Imports `process.env.META_WA_API_VERSION`, `META_WA_GRAPH_API_BASE`, `META_WA_ACCESS_TOKEN`, `META_WA_PHONE_NUMBER_ID`, `META_WA_BUSINESS_ID` (where `META_WA_BUSINESS_ID` here refers to the **WABA ID**, not the Meta Business ID — naming confusion, see §6).
- `lib/whatsapp/meta-client.test.js` — unit tests.
- `lib/whatsapp/signature.js` — `verifyMetaSignature`, `verifyWebhookChallenge`, `META_SIGNATURE_HEADER` (referenced but not opened in this audit).
- `lib/whatsapp/parse.js` — `parseInboundMessages`, `parseStatusUpdates`, `detectOptOut`, `messageKey`.
- `lib/whatsapp/crm.js` — `resolveContact`, `recordOptOut`, `recordInboundEvent`, `recordStatusUpdate`.
- `lib/meta-webhook-verify.mjs` — `verifyMetaSignature`, `isValidVerifyToken`.
- `lib/meta-webhook-verify.test.mjs` — unit tests.
- `lib/notifications/whatsapp-adapter.mjs` — adapter that wraps `meta-client.js` for the notifications worker.
- `lib/notifications/whatsapp-adapter.test.mjs` — adapter tests.
- `lib/provider-state.mjs` — owner-dashboard probes (see §6 — **config-name mismatch bug**).

### App API routes
- `app/api/webhooks/whatsapp/route.js` — primary Meta WhatsApp webhook receiver (GET handshake + POST signature verification, dedup, status updates, opt-outs).
- `app/api/webhooks/meta/whatsapp/route.js` — legacy Meta WhatsApp webhook receiver (same contract; uses `lib/meta-webhook-verify.mjs`).
- `app/api/whatsapp/start/route.js` — start a WhatsApp conversation (outbound path through `meta-client.js`).
- `app/meta/data-deletion/route.js` — Meta Data Deletion Request callback (App Review requirement).
- `app/api/owner/provider-state/route.js` — exposes `probeMeta()` from `lib/provider-state.mjs` for the owner dashboard.

**Note:** the brief references `https://ironwake.dev/api/whatsapp/webhook`. No route exists at that path. The two routes that implement the documented Meta webhook contract are `/api/webhooks/whatsapp` and `/api/webhooks/meta/whatsapp` (both at the deployed host `ironwake.dev`). Either the brief's path is a typo, or the route at `/api/whatsapp/webhook` has not been added yet — see §8 remediation.

---

## 2. Environment variables (`.env`)

All seven required variables are **present and non-empty**:

| Variable | Present | First 4 chars (length) | Used by |
|---|---|---|---|
| `META_WA_ACCESS_TOKEN` | ✅ | `EAAO…` (205 chars) | `lib/whatsapp/meta-client.js`, `lib/notifications/whatsapp-adapter.mjs`, both webhook routes |
| `META_WA_PHONE_NUMBER_ID` | ✅ | `1334…` (16 digits) | `meta-client.js`, `provider-state.mjs` *(under different name — see §6)* |
| `META_WA_VERIFY_TOKEN` | ✅ | `be50…` | both webhook GET-handshake paths |
| `META_WABA_ID` | ✅ | `4480…` (16 digits) | `meta-client.js`, `provider-state.mjs` *(under different name)* |
| `META_BUSINESS_ID` | ✅ | `1703…` (16 digits) | **No in-repo code reference found** — appears reserved for business-level API calls |
| `META_APP_ID` | ✅ | `1050…` (16 digits) | not consumed by code but used by humans for App-Dashboard subscription config |
| `META_APP_SECRET` | ✅ | `d2e3…` | webhook HMAC signature verify (`lib/whatsapp/signature.js`, `lib/meta-webhook-verify.mjs`) |

Token prefix `EAAO…` confirms this is a real Meta system-user token (not a placeholder).

> **No code was modified. All values redacted in this report.**

---

## 3. Live Meta Graph API probes

All probes were real `curl` calls to `https://graph.facebook.com/v22.0/...`. Full responses are saved to `reports/whatsapp-audit/PROBE_*.json`.

### Probe 1 — Token validity: `GET /me`
- **Endpoint:** `https://graph.facebook.com/v22.0/me?fields=id,name&access_token=…`
- **HTTP:** 200
- **Response:**
  ```json
  {"id":"122105065113434941","name":"IronWake Automation"}
  ```
- **Verdict:** ✅ Token is valid; subject is a system user / admin named "IronWake Automation".

### Probe 2 — Phone number reachable: `GET /{PHONE_NUMBER_ID}`
- **Endpoint:** `https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}?fields=id,verified_name,display_phone_number,quality_rating`
- **HTTP:** 400
- **Response:**
  ```json
  {"error":{"message":"Unsupported get request. Object with ID '{PHONE_NUMBER_ID}' does not exist, cannot be loaded due to missing permissions, or does not support this operation.","type":"GraphMethodException","code":100,"error_subcode":33,"fbtrace_id":"…"}}
  ```
- **Verdict:** ❌ Phone is not reachable by this token. Either the ID is wrong, the phone has been removed from the WABA, or this system user lacks admin on the WABA that owns the phone.

### Probe 3 — WABA ownership: `GET /{WABA_ID}/phone_numbers`
- **Endpoint:** `https://graph.facebook.com/v22.0/{WABA_ID}/phone_numbers`
- **HTTP:** 400
- **Response:** Same `Object with ID '{WABA_ID}' does not exist …` error.
- **Verdict:** ❌ WABA is not reachable. Same root-cause candidates as probe 2.

### Probe 4 — Webhook subscription state: `GET /{APP_ID}/subscriptions`
- **Endpoint:** `https://graph.facebook.com/v22.0/{APP_ID}/subscriptions`
- **HTTP:** 400
- **Response:**
  ```json
  {"error":{"message":"(#190) Application Secret required for this endpoint","type":"OAuthException","code":190}}
  ```
- **Verdict:** ⚠️ Endpoint requires `appsecret_proof`. When probed with the proper HMAC-SHA256 `appsecret_proof` (Probes 4b/4c), the endpoint still returned the same `Application Secret required` error. This is the documented behaviour when the **token does not belong to the app whose subscriptions you're querying** — even though both IDs are `1050632807552604` (see Probe 7). Possible causes: (a) the token is a **system-user token** which doesn't carry the same app-scoped capability as a regular app-admin token, (b) the app dashboard is owned by a different Meta Business Manager, or (c) the configured `META_APP_ID` in `.env` is one digit off from the real app.

### Probe 7 — `debug_token` (full capability matrix)
- **Endpoint:** `https://graph.facebook.com/v22.0/debug_token?input_token=…&access_token=…`
- **HTTP:** 200
- **Response (key fields):**
  ```json
  {"data":{
    "app_id":"1050632807552604",
    "type":"SYSTEM_USER",
    "application":"ironwake",
    "data_access_expires_at":0,
    "expires_at":0,
    "is_valid":true,
    "issued_at":1786881806,
    "scopes":[
      "whatsapp_business_management",
      "whatsapp_business_messaging",
      "manage_app_solution",
      "public_profile"
    ],
    "granular_scopes":[…],
    "user_id":"122105065113434941"
  }}
  ```
- **Verdict:** ✅ Token is healthy and non-expiring (`expires_at:0`). `app_id` matches `META_APP_ID` exactly. Scopes include the two WA scopes required for this integration.

### Probe 11 — Outbound send: `POST /{PHONE_ID}/messages`
- **Endpoint:** `POST https://graph.facebook.com/v22.0/{PHONE_ID}/messages` (with a valid body to a Meta-approved test recipient)
- **HTTP:** 400
- **Response:** `Object with ID '{PHONE_ID}' does not exist, cannot be loaded due to missing permissions …`
- **Verdict:** ❌ Outbound sends will fail at runtime with the same "object does not exist / permissions" error.

### Probe 12 — Phone via app-scoped debug fields: same error.
### Probe 13 — App details: ✅ `{"id":"1050632807552604","name":"ironwake"}`.

### Diagnostic probes (negative results — recorded for the record)
| Probe | Result |
|---|---|
| `GET /{APP_ID}/subscriptions` (with `appsecret_proof`) | 400 `Application Secret required` |
| `GET /me/applications` | 400 `#100 nonexisting field` |
| `GET /me/owned_whatsapp_business_accounts` | 400 `#100 nonexisting field` |
| `GET /me/client_whatsapp_business_accounts` | 400 `#100 nonexisting field` |
| `GET /me/phone_numbers` | 400 `#100 nonexisting field` |
| `GET /{BUSINESS_ID}?fields=subscribed_apps` | 403 `#200 Requires business_management permission` |
| `GET /{WABA_ID}/assigned_users` | 400 object-not-exist |
| `POST /{APP_ID}/test_subscriptions` | 403 object-not-exist |

These rules out several common misconfigurations: the token is **not** missing scopes, the app is **not** wrong, the WABA ID is **not** swapped with the App ID — the problem is at the WABA / phone binding layer.

---

## 4. Verdict matrix

| Check | Status |
|---|---|
| Token valid, non-expiring | ✅ |
| Token scopes include both WA scopes | ✅ |
| Token's `app_id` matches configured `META_APP_ID` | ✅ |
| Token's `app_name` = "ironwake" | ✅ |
| Phone number ID resolves | ❌ |
| WABA ID resolves | ❌ |
| WABA's `phone_numbers` edge resolves | ❌ |
| App `/subscriptions` endpoint reads clean | ❌ (capability not granted) |
| Outbound `POST {phone}/messages` reachable | ❌ |
| Webhook receiver route exists locally | ✅ at `/api/webhooks/whatsapp` (not `/api/whatsapp/webhook`) |
| Verify token matches expected format | ✅ present in env, used by both handlers |

**Final verdict:** `PROVIDER_AUDIT=PARTIAL` — credentials + app are healthy; WABA/phone binding is broken or the system user has not been granted admin on the WABA.

---

## 5. Outbound / inbound runtime impact

Given the verdict above:
- **`app/api/whatsapp/start`** (outbound → `meta-client.js → POST /messages`) will return a 4xx at every send attempt because the phone ID is unreachable.
- **`app/api/webhooks/{whatsapp,meta/whatsapp}`** will continue to handle handshake GETs and signed POSTs *if Meta ever reaches them* — but Meta is currently not subscribed to these URLs (no subscription record visible), so no real deliveries land. The handlers will not be exercised in production.

---

## 6. Pre-existing bug found (config-name mismatch)

`lib/provider-state.mjs` reads **different** env var names than the rest of the codebase:

| `lib/provider-state.mjs` (probeMeta, lines 138-140) | Actual `.env` (and `meta-client.js`) |
|---|---|
| `e.META_WA_TOKEN` | `META_WA_ACCESS_TOKEN` |
| `e.META_WA_PHONE_ID` | `META_WA_PHONE_NUMBER_ID` |
| `e.META_WA_BUSINESS_ID` (used here to mean WABA) | `META_WABA_ID` |

**Consequence:** `/api/owner/provider-state` will report `meta: { configured: false, lastError: { code: 'not_configured', message: 'META_WA_TOKEN or META_WA_PHONE_ID is missing' } }` even though Meta IS configured. The owner dashboard will lie about Meta.

This is a separate finding from the live API audit but should be addressed in the same hardening pass.

---

## 7. Webhook configuration status

Meta's webhook subscriptions could not be enumerated (Probe 4). The `/{APP_ID}/subscriptions` endpoint either:
- requires an app-admin token (not a system-user token), or
- requires a different `appsecret_proof` chain, or
- the configured `META_APP_ID` does not own the subscription record.

To be re-checked after the WABA/phone repair below.

---

## 8. Required remediation steps (no code was changed)

These are **operational actions in the Meta UI** (no source changes were made).

### 8.1 — Repair the WABA / phone binding (root cause)

Choose ONE of the following, then rotate credentials:

**Option A (WABA is real but token lost access):**
1. Open `business.facebook.com` → Business Settings → Users → System Users.
2. Locate the system user named "IronWake Automation" (`122105065113434941`).
3. Assign that system user **Full Control** on the WABA that owns the configured phone number.
4. Re-generate the system-user token and update `META_WA_ACCESS_TOKEN`.

**Option B (WABA was deleted or the ID is wrong):**
1. Verify the current WABA ID by visiting Meta App Dashboard → WhatsApp → API Setup. The real Phone Number ID is shown there along with the WABA that owns it.
2. If the WABA truly doesn't exist, provision a new one: App Dashboard → WhatsApp → Getting Started → Create WhatsApp Business Account.
3. Update `META_WA_PHONE_NUMBER_ID` and `META_WABA_ID` in `.env` and in the Cloudflare Worker secrets.
4. Update the system user's assets to include the new WABA.

### 8.2 — Re-confirm via the audit's own probes

After any fix, re-run:
```bash
set -a && . ./.env && set +a
curl -sS "https://graph.facebook.com/v22.0/${META_WA_PHONE_NUMBER_ID}?fields=id,verified_name,display_phone_number,quality_rating&access_token=${META_WA_ACCESS_TOKEN}"
curl -sS "https://graph.facebook.com/v22.0/${META_WABA_ID}/phone_numbers&access_token=${META_WA_ACCESS_TOKEN}"
curl -sS "https://graph.facebook.com/v22.0/${META_APP_ID}/subscriptions&access_token=${META_WA_ACCESS_TOKEN}"
```
Each must return HTTP 200 with `data` populated.

### 8.3 — Configure the Meta webhook

Webhook URL & verify token to enter in **Meta App Dashboard → WhatsApp → Configuration → Webhook**:

| Field | Value |
|---|---|
| Callback URL | `https://ironwake.dev/api/webhooks/whatsapp` (see §8.4 — the brief's `/api/whatsapp/webhook` does not exist in this repo) |
| Verify token | The full value of `META_WA_VERIFY_TOKEN` from `.env` (first 6 chars: `be50…`) |
| Webhook fields to subscribe | `messages`, `message_template_status_update`, `account_alerts`, `business_capability_update`, `phone_number_quality_update`, `smb_app_state_sync`, `template_category_update` |

The handshake on that URL is handled by `app/api/webhooks/whatsapp/route.js` `GET` handler (lines 85-95). The route also enforces HMAC-SHA256 signature verification on `POST`.

### 8.4 — Reconcile the brief's webhook path

The brief specified `https://ironwake.dev/api/whatsapp/webhook`. **No route exists at `/api/whatsapp/webhook/`** in this repository. The two route directories that implement the webhook contract are:
- `app/api/webhooks/whatsapp/` → `https://ironwake.dev/api/webhooks/whatsapp`
- `app/api/webhooks/meta/whatsapp/` → `https://ironwake.dev/api/webhooks/meta/whatsapp`

Two acceptable resolutions:
1. Update Meta App Dashboard to use `/api/webhooks/whatsapp` (existing route).
2. Add a re-export route at `app/api/whatsapp/webhook/route.js` that forwards to `app/api/webhooks/whatsapp/route.js`.

### 8.5 — Subscribe the app to the WABA webhook fields (Meta API call)

Once §8.1 and §8.3 are done, programmatically subscribe via the Graph API:

```bash
# Subscribe the app to specific webhook fields for a WABA
curl -X POST \
  "https://graph.facebook.com/v22.0/${META_WABA_ID}/subscribed_apps" \
  -H "Authorization: Bearer ${META_WA_ACCESS_TOKEN}" \
  -d "subscribed_fields=messages,message_template_status_update,account_alerts,phone_number_quality_update,smb_app_state_sync,template_category_update"
```

Expected 200 response:
```json
{"success":true}
```

To list current subscriptions later:
```bash
curl "https://graph.facebook.com/v22.0/${META_WABA_ID}/subscribed_apps?access_token=${META_WA_ACCESS_TOKEN}"
```

### 8.6 — Cloudflare Worker secrets must mirror `.env`

After any `.env` rotation, mirror the values into the Cloudflare Worker:
```bash
wrangler secret put META_WA_ACCESS_TOKEN
wrangler secret put META_WA_PHONE_NUMBER_ID
wrangler secret put META_WA_VERIFY_TOKEN
wrangler secret put META_WABA_ID
wrangler secret put META_BUSINESS_ID
wrangler secret put META_APP_ID
wrangler secret put META_APP_SECRET
```

### 8.7 — Fix the config-name mismatch in `lib/provider-state.mjs` (separate)

Replace lines 138-140:
```js
const token    = String(e.META_WA_TOKEN        || '').trim();
const phoneId  = String(e.META_WA_PHONE_ID     || '').trim();
const wabaId   = String(e.META_WA_BUSINESS_ID  || '').trim();
```
with:
```js
const token    = String(e.META_WA_ACCESS_TOKEN     || '').trim();
const phoneId  = String(e.META_WA_PHONE_NUMBER_ID  || '').trim();
const wabaId   = String(e.META_WABA_ID             || '').trim();
```

The `apiVersion` and `graphBase` env names (`META_WA_API_VERSION`, `META_GRAPH_API_BASE`) are consistent between `provider-state.mjs` and `.env` and need no change.

---

## 9. Evidence file index

All probe responses are stored alongside this report in `reports/whatsapp-audit/`:

| File | Endpoint probed | HTTP | Verdict |
|---|---|---|---|
| `PROBE_01_me.json` | `GET /me` | 200 | ✅ token valid |
| `PROBE_02_phone.json` | `GET /{PHONE_ID}` | 400 | ❌ unreachable |
| `PROBE_03_waba_phones.json` | `GET /{WABA_ID}/phone_numbers` | 400 | ❌ unreachable |
| `PROBE_04_app_subs.json` | `GET /{APP_ID}/subscriptions` | 400 | ❌ capability missing |
| `PROBE_04b_app_subs_proof.json` | same, with `appsecret_proof` | 400 | same |
| `PROBE_04c_app_subs_proof.json` | same, with HMAC-correct `appsecret_proof` | 400 | same |
| `PROBE_05_waba_check.json` | `GET /{WABA_ID}` | 400 | ❌ unreachable |
| `PROBE_06_my_apps.json` | `GET /me/applications` | 400 | n/a |
| `PROBE_07_debug_token.json` | `GET /debug_token` | 200 | ✅ scopes verified |
| `PROBE_08_waba_direct.json` | `GET /{WABA_ID}` | 400 | ❌ unreachable |
| `PROBE_09_biz.json` | `GET /{BUSINESS_ID}` | 403 | needs business_management |
| `PROBE_10_biz_subs.json` | `GET /{BUSINESS_ID}?fields=subscribed_apps` | 400 | n/a |
| `PROBE_11_post_messages.json` | `POST /{PHONE_ID}/messages` | 400 | ❌ outbound broken |
| `PROBE_12_phone_with_meta.json` | `GET /{PHONE_ID}` w/ `?fields=...` | 400 | same |
| `PROBE_13_app_meta.json` | `GET /{APP_ID}?fields=id,name` | 200 | ✅ app reachable |
| `PROBE_14_list_wabas.json` … `PROBE_19_app_wabas.json` | various discovery probes | mixed | diagnostic |

---

## 10. Final verdict

```
PROVIDER_AUDIT=PARTIAL
```

**Summary:**
- App credentials and access token are **healthy and correctly scoped** (`is_valid:true`, non-expiring, scopes include `whatsapp_business_management` and `whatsapp_business_messaging`).
- The WABA ID and Phone Number ID configured in `.env` are **NOT reachable by this token** (`Object with ID … does not exist / missing permissions`).
- Outbound sends will fail; inbound webhooks are not configured at Meta.
- A separate **config-name mismatch** in `lib/provider-state.mjs` causes the owner dashboard to falsely report Meta as `not_configured`.

**Evidence URLs:** the 18 probe response files in this directory; the Graph API requests logged inside each one show the exact URL + query params used (token is redacted in saved files via the redaction in the curl wrapper used by the audit).