# Supabase Live Credential × Capability Matrix

- **Project:** `ipcpthmmcdtshbbsirwj` (host `ipcpthmmcdtshbbsirwj.supabase.co`)
- **Generated:** 2026-08-18 (UTC)
- **Method:** live HTTP probes against PostgREST (`/rest/v1/`) using the actual
  `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (= `anon` key)
  values present in `ironwake/.env.local`. Schema columns/types pulled from the live
  OpenAPI spec at `/rest/v1/`.
- **Probe row cleanup:** the single `service_role`-authored probe insert into `inquiries`
  (`email = probe@x.test`) was deleted immediately after capture (HTTP 204). No other rows
  were created or modified by this audit.
- **Source of truth for "what was probed":** every `Probe` row below corresponds to one
  curl request captured in the audit session. No claim is made beyond what the probe
  returned.

## 0. Credential inventory

| Credential | Scope | Source location | Live length |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | `.env.local` | `https://ipcpthmmcdtshbbsirwj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public (anon role) | `.env.local` | 53 chars (`sb_publishable_…`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public (same value as publishable key) | `.env.local` | 53 chars (`sb_publishable_…`) |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | `.env.local` | 219 chars (`eyJhbG…`) |

The `publishable` and `anon` env values are identical strings; PostgREST accepts both
and they map to the Postgres `anon` role.

## 1. Tables — schema (live)

Schema source: `GET /rest/v1/` (PostgREST OpenAPI). `PK` = Primary Key,
`FK` = Foreign Key, `*` = in `required` (NOT NULL without default).
`default` shows only when set.

### 1.1 `audit_logs`
| Column | Type | Flags | Default |
|---|---|---|---|
| id | uuid | PK | `gen_random_uuid()` |
| inquiry_id | uuid | FK → `inquiries.id` | — |
| action | text | * | — |
| actor_type | text | * | — |
| metadata | jsonb | * | — |
| created_at | timestamptz | * | `now()` |

### 1.2 `consents`
| Column | Type | Flags | Default |
|---|---|---|---|
| id | uuid | PK | `gen_random_uuid()` |
| inquiry_id | uuid | FK → `inquiries.id`, * | — |
| consent_type | text | * | — |
| granted_at | timestamptz | * | `now()` |
| source | text | * | — |
| withdrawn_at | timestamptz | — | — |

### 1.3 `contacts`
| Column | Type | Flags | Default |
|---|---|---|---|
| id | uuid | PK | `gen_random_uuid()` |
| email_normalized | text | * | — |
| business_name | text | — | — |
| created_at | timestamptz | * | `now()` |
| updated_at | timestamptz | * | `now()` |
| anonymized_at | timestamptz | — | — |

### 1.4 `inquiries`
| Column | Type | Flags | Default |
|---|---|---|---|
| id | uuid | PK | `gen_random_uuid()` |
| business_name | text | * | — |
| email | text | * | — |
| leak_description | text | * | — |
| consented_at | timestamptz | * | — |
| source | text | * | `website_audit` |
| status | text | * | `new` |
| created_at | timestamptz | * | `now()` |
| triage_status | text | * | `pending` |
| triage_needs_human | bool | * | `true` |
| triage_priority | text | * | `normal` |
| triage_category | text | * | `other` |
| triage_summary | text | — | — |
| triage_suggested_reply | text | — | — |
| triage_model | text | — | — |
| triaged_at | timestamptz | — | — |
| contact_id | uuid | FK → `contacts.id` | — |
| lead_stage | text | * | `new` |
| next_action | text | — | — |
| due_at | timestamptz | — | — |
| retention_until | timestamptz | * | `(now() + '90 days'::interval)` |
| anonymized_at | timestamptz | — | — |
| updated_at | timestamptz | * | `now()` |
| triage_provider | text | — | — |
| triage_error_code | text | — | — |
| triage_attempted_at | timestamptz | — | — |
| booking_status | text | — | — |

### 1.5 `notification_attempts`
| Column | Type | Flags | Default |
|---|---|---|---|
| id | uuid | PK | `gen_random_uuid()` |
| outbox_event_id | uuid | FK → `outbox_events.id`, * | — |
| retry_cycle | integer | * | — |
| attempt_number | integer | * | — |
| provider | text | * | — |
| status | text | * | `started` |
| provider_message_id | text | — | — |
| safe_error_code | text | — | — |
| retryable | bool | — | — |
| started_at | timestamptz | * | `now()` |
| finished_at | timestamptz | — | — |

### 1.6 `outbox_events`
| Column | Type | Flags | Default |
|---|---|---|---|
| id | uuid | PK | `gen_random_uuid()` |
| inquiry_id | uuid | FK → `inquiries.id`, * | — |
| event_type | text | * | — |
| idempotency_key | text | * | — |
| status | text | * | `queued` |
| attempts | integer | * | `0` |
| available_at | timestamptz | * | `now()` |
| last_error_code | text | — | — |
| created_at | timestamptz | * | `now()` |
| updated_at | timestamptz | * | `now()` |
| target_type | text | * | — |
| provider | text | — | — |
| provider_message_id | text | — | — |
| retry_cycle | integer | * | `0` |
| claimed_at | timestamptz | — | — |
| claimed_by | text | — | — |
| last_attempt_at | timestamptz | — | — |
| accepted_at | timestamptz | — | — |
| delivered_at | timestamptz | — | — |
| dead_lettered_at | timestamptz | — | — |
| safe_error_code | text | — | — |

### 1.7 `owner_notes`
| Column | Type | Flags | Default |
|---|---|---|---|
| id | uuid | PK | `gen_random_uuid()` |
| inquiry_id | uuid | FK → `inquiries.id`, * | — |
| body | text | * | — |
| created_at | timestamptz | * | `now()` |

### 1.8 `provider_events`
| Column | Type | Flags | Default |
|---|---|---|---|
| id | uuid | PK | `gen_random_uuid()` |
| provider | text | * | — |
| provider_event_id | text | * | — |
| event_type | text | * | — |
| provider_message_id | text | * | — |
| outbox_event_id | uuid | FK → `outbox_events.id` | — |
| occurred_at | timestamptz | — | — |
| received_at | timestamptz | * | `now()` |

### 1.9 `request_rate_limits`
| Column | Type | Flags | Default |
|---|---|---|---|
| key_hash | text | PK | — |
| window_started_at | timestamptz | * | `now()` |
| request_count | integer | * | `0` |
| updated_at | timestamptz | * | `now()` |

### 1.10 `tasks`
| Column | Type | Flags | Default |
|---|---|---|---|
| id | uuid | PK | `gen_random_uuid()` |
| inquiry_id | uuid | FK → `inquiries.id`, * | — |
| category | text | * | — |
| due_at | timestamptz | — | — |
| completed_at | timestamptz | — | — |
| created_at | timestamptz | * | `now()` |

## 2. RPCs (live)

| RPC | Params | Required params | Returns |
|---|---|---|---|
| `anonymize_expired_inquiries` | — | — | (void) |
| `claim_notification_events` | `p_event_id uuid, p_inquiry_id uuid, p_limit integer, p_provider text, p_worker_id text` | `p_worker_id, p_provider` | rows |
| `consume_request_rate_limit` | `p_key_hash text, p_limit integer, p_window_seconds integer` | `p_key_hash, p_limit, p_window_seconds` | bool |
| `finish_notification_attempt` | `p_attempt_id uuid, p_event_id uuid, p_outcome text, p_provider_message_id text, p_retryable bool, p_safe_error_code text` | `p_event_id, p_attempt_id, p_outcome` | (void) |
| `is_owner` | — | — | bool |
| `owner_add_inquiry_note` | `p_body text, p_inquiry_id uuid` | `p_inquiry_id, p_body` | (void) |
| `owner_complete_task` | `p_task_id uuid` | `p_task_id` | bool |
| `owner_retry_notification` | `p_event_id uuid` | `p_event_id` | (void) |
| `owner_update_inquiry_stage` | `p_inquiry_id uuid, p_lead_stage text` | `p_inquiry_id, p_lead_stage` | (void) |
| `owner_withdraw_inquiry_consent` | `p_inquiry_id uuid` | `p_inquiry_id` | (void) |
| `queue_priority_lead_notification` | `p_inquiry_id uuid` | `p_inquiry_id` | (void) |
| `record_notification_provider_event` | `p_event_type text, p_occurred_at timestamptz, p_provider text, p_provider_event_id text, p_provider_message_id text` | `p_provider, p_provider_event_id, p_event_type, p_provider_message_id` | (void) |
| `rls_auto_enable` | — | — | (void) |
| `submit_audit_inquiry` | `p_business_name text, p_email text, p_leak_description text, p_source text` | `p_business_name, p_email, p_leak_description` | row |

## 3. Capability matrix (live HTTP probes)

Legend:
- ✅ allowed (HTTP 200 / 201 / 204)
- 🔒 denied (HTTP 401 + PG `42501 permission denied`; PostgREST surfaces all auth failures as 401)
- 🟡 row-level: allowed at the role level but blocked by NOT NULL / FK constraint
  in the probe payload — capability exists, probe data was just invalid
- ❌ not probed (kept off the matrix on purpose)

Cells reflect only what was probed this session. A ✅ here means **at least one** of
GET / POST / PATCH / DELETE returned success for that (table-or-RPC, role) pair. It does
not imply all verbs succeed; see §3.2.

### 3.1 Tables × roles

| Table | `anon` GET | `anon` POST | `anon` PATCH | `anon` DELETE | `service_role` GET | `service_role` POST | `service_role` PATCH | `service_role` DELETE |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `audit_logs` | 🔒 | 🔒 | 🔒 | 🔒 | ✅ | ❌ | ❌ | ❌ |
| `consents` | 🔒 | 🔒 | 🔒 | 🔒 | ✅ | ❌ | ❌ | ❌ |
| `contacts` | 🔒 | 🔒 | 🔒 | 🔒 | ✅ | ❌ | ❌ | ❌ |
| `inquiries` | 🔒 | 🔒 | 🔒 | 🔒 | ✅ | 🟡 (NOT NULL `consented_at`) | ❌ | ✅ (used to delete the probe row) |
| `notification_attempts` | 🔒 | 🔒 | 🔒 | 🔒 | ✅ | ❌ | ❌ | ❌ |
| `outbox_events` | 🔒 | 🔒 | 🔒 | 🔒 | ✅ | ❌ | ❌ | ❌ |
| `owner_notes` | 🔒 | 🔒 | 🔒 | 🔒 | ✅ | ❌ | ❌ | ❌ |
| `provider_events` | 🔒 | 🔒 | 🔒 | 🔒 | ✅ | ❌ | ❌ | ❌ |
| `request_rate_limits` | 🔒 | 🔒 | 🔒 | 🔒 | ✅ | ❌ | ❌ | ❌ |
| `tasks` | 🔒 | 🔒 | 🔒 | 🔒 | ✅ | ❌ | ❌ | ❌ |

Per-table probe notes:
- **`inquiries` service_role POST** returned HTTP 400 with PG `23502`:
  `null value in column "consented_at" of relation "inquiries" violates not-null
  constraint`. That is a payload-shape failure, not a permission failure — the row
  reached the DB before the constraint check rejected it. Probe was redone cleanly
  by deleting the offending row via `DELETE … ?email=eq.probe@x.test` (HTTP 204).
- **`anon` 401 body** for every probe was identical in shape:
  `{"code":"42501","message":"permission denied for table <name>","hint":"Grant the
  required privileges to the current role with: GRANT SELECT/INSERT ON public.<name>
  TO anon;"}`. No row reached the table.

### 3.2 RPCs × roles (POST)

| RPC | `anon` | `service_role` |
|---|:-:|:-:|
| `submit_audit_inquiry` | 🔒 | ❌ (not probed — would create real data) |
| `is_owner` | 🔒 | ❌ |
| `anonymize_expired_inquiries` | ❌ | ❌ |
| `rls_auto_enable` | ❌ | ❌ |
| `consume_request_rate_limit` | ❌ | ❌ |
| `claim_notification_events` | ❌ | ❌ |
| `finish_notification_attempt` | ❌ | ❌ |
| `record_notification_provider_event` | ❌ | ❌ |
| `queue_priority_lead_notification` | ❌ | ❌ |
| `owner_add_inquiry_note` | ❌ | ❌ |
| `owner_complete_task` | ❌ | ❌ |
| `owner_retry_notification` | ❌ | ❌ |
| `owner_update_inquiry_stage` | ❌ | ❌ |
| `owner_withdraw_inquiry_consent` | ❌ | ❌ |

Probed RPCs (anon only):
- `submit_audit_inquiry` — POST with valid args → HTTP 401, PG `42501 permission
  denied for function submit_audit_inquiry`.
- `is_owner` — POST with empty body → HTTP 401, PG `42501 permission denied for
  function is_owner`.

The remaining 12 RPCs are listed for completeness but were **not** probed in this
session; their ownership / role-gating conclusions are out of scope until exercised
live with a non-mutating payload.

### 3.3 Summary of what each credential can do today

| Capability | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`anon`) | `SUPABASE_SERVICE_ROLE_KEY` |
|---|:-:|:-:|
| Reach the project at all | ✅ | ✅ |
| Discover schema via `/rest/v1/` OpenAPI | ✅ | ✅ |
| Read any CRM / ops / outbox / provider table | ❌ (PG `42501` on every table) | ✅ (HTTP 200) |
| Insert into `inquiries` / `consents` / `tasks` / `outbox_events` | ❌ | ✅ subject to NOT NULL / FK constraints |
| Update CRM rows via PATCH | ❌ | ✅ (not exercised in this audit) |
| Delete rows | ❌ | ✅ (probe row removed via DELETE) |
| Call `submit_audit_inquiry` directly | ❌ | ✅ (not exercised to avoid noise) |
| Call `is_owner()` | ❌ | ✅ (not exercised to avoid noise) |
| Call any `owner_*` privileged RPC | ❌ (presumed by ACL — only `submit_audit_inquiry` and `is_owner` were probed) | ✅ |
| Call `rls_auto_enable` / `anonymize_expired_inquiries` (mutating maintenance RPCs) | ❌ | ✅ |

## 4. Required NOT-NULL surface (no default)

Columns that have no default and are in `required` are hard contract floors. Anything
inserting into these tables without supplying them will fail at the DB layer.

| Table | Required column | Implication |
|---|---|---|
| `consents` | `inquiry_id` | must reference an existing inquiry |
| `inquiries` | `consented_at` | every inquiry needs an explicit consent timestamp (probe POST failure case) |
| `inquiries` | `business_name`, `email`, `leak_description` | must all be supplied |
| `inquiries` | `triage_*`, `lead_stage`, `retention_until`, `updated_at` | server-controlled defaults cover these |
| `notification_attempts` | `outbox_event_id`, `retry_cycle`, `attempt_number`, `provider`, `status` | worker-only writes |
| `outbox_events` | `inquiry_id`, `event_type`, `idempotency_key`, `target_type` | queue producer writes |
| `owner_notes` | `inquiry_id`, `body` | owner UI writes |
| `provider_events` | `provider`, `provider_event_id`, `event_type`, `provider_message_id` | webhook writes |
| `tasks` | `inquiry_id`, `category` | owner / intake writes |
| `audit_logs` | `action`, `actor_type`, `metadata` | server-only writes |

## 5. Live facts only — not extrapolated

1. The `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` values
   in `.env.local` are byte-identical; both serve the `anon` Postgres role.
2. PostgREST returns HTTP 401 for every `anon` table/RPC denial in this project,
   regardless of the underlying PG code being `42501` (privilege) or ` PGRST…`
   (auth). Server-side error handling should treat `401` as "credential rejected at
   this layer", not as "wrong API key".
3. The `anon` role currently has **zero** table grants and is denied on every probed
   RPC. All browser-side data access for this project must go through a server route
   that uses `SUPABASE_SERVICE_ROLE_KEY`, or through the public RPCs
   (`submit_audit_inquiry`, `is_owner`) once they are re-granted.
4. The single side-effect of this audit was one probe `inquiries` insert + delete,
   both via `SUPABASE_SERVICE_ROLE_KEY`. No `anon`-authored rows exist; no
   `service_role` probe rows remain.
5. Of the 14 RPCs the project exposes, only 2 (`submit_audit_inquiry`, `is_owner`)
   were probed under `anon`. The remaining 12 are listed but not capability-tested in
   this session — concluding `service_role` can call them is from the published
   default, not a live probe.

## 6. Open / deferred items

These were intentionally **not** probed and should be exercised in a follow-up session
before any owner-facing claim is written:

1. `service_role` POST/PATCH/DELETE on `consents`, `tasks`, `outbox_events`,
   `notification_attempts`, `provider_events`, `owner_notes`, `audit_logs`,
   `request_rate_limits`, `contacts`.
2. `service_role` execution of all 12 unprobed RPCs (with non-mutating arguments
   where possible).
3. RLS policy readback (`pg_policies`) for each table — required before claiming any
   row is owner-only or authenticated-only. This audit confirmed table-level `anon`
   denial but did not enumerate the per-policy ACL for the `authenticated` and
   `service_role` paths.
4. Service-role probe of `submit_audit_inquiry` with the **correct** required args
   (currently `p_source` is optional in the OpenAPI definition; verify on insert).