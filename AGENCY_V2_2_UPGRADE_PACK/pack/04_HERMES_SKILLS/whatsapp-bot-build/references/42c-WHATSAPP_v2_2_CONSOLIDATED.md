# ██████████████████████████████████████████████████████████
# WHATSAPP BOT v2.2 CONSOLIDATED MODULE — APPEND TO File 42 (after v2.0)
# = v2.1 ADDENDUM (§22–§32, verbatim from 42b) + v2.2 GAP CLOSURE
#   (§33–§37, verbatim from W_01) + §38 DEMO-MODE PLAYBOOK (net-new).
# One file replaces the 42b + W_01 pair — nothing removed, order fixed
# so every cross-reference (§22A Flows, §23C quality playbook, §24A/B
# tenancy, §25 Pay, §28 templates, §31 window) resolves top-to-bottom.
# RULE: ADDITIVE. Nothing in v2.0 is removed.
# ██████████████████████████████████████████████████████████

# ██████████████████████████████████████████████████████████
# WHATSAPP BOT v2.1 ADDENDUM MODULE — APPEND TO File 42
# Adds: WhatsApp Flows · WhatsApp Pay · Catalog+Cart · CTWA Ads ·
#       Quality rating monitoring · Multi-WABA agency architecture ·
#       Niche template library · Auto-CSAT · WA↔Voice handoff ·
#       Observability · 24h window optimization
# RULE: This is ADDITIVE. Nothing in v2.0 is removed. Paste this block
# at the END of File 42.
# ██████████████████████████████████████████████████████████

> Why this module exists: v2.0 ships a hardened text-only bot with interactive buttons
> and lists. Three things have changed since v2.0 was written that make the gap real:
> (1) WhatsApp Flows are now production-stable — mini-apps inside WhatsApp let you
> ship signup forms, appointment booking with calendar pickers, and product
> configurators that buttons + lists cannot match. (2) Quality rating monitoring is
> now a discipline — Meta will silently throttle your number if you ignore it, and
> v2.0 has no monitoring. (3) Agencies managing >3 client numbers need multi-WABA
> architecture, not three copies of the same project.

---

# ═══════════════════════════════════════════════════════════
# SECTION 22 — WHATSAPP FLOWS (the biggest miss in v2.0)
# (Flows = native mini-apps inside WhatsApp. Calendar pickers,
#  multi-step forms, dropdowns, dynamic data — everything that
#  buttons + lists cannot do. This is what makes a WhatsApp bot
#  feel like a real product instead of a chat interface.)
# ═══════════════════════════════════════════════════════════

## 22A. WHEN TO USE FLOWS vs INTERACTIVE MESSAGES

| Use case | v2.0 approach | v2.1 approach |
|----------|---------------|---------------|
| Pick from 3 options | Buttons | Buttons (unchanged) |
| Pick from 10 options | List | List (unchanged) |
| Pick a date AND time slot | "Type your preferred date" → painful | **Flow** with native date picker + slot list |
| Sign up (name, email, phone, notes) | 4 back-and-forth messages | **Flow** with single multi-field form |
| Product configurator (size, color, qty, address) | Impossible cleanly | **Flow** with branched screens |
| Pre-consultation intake (15 fields) | Impossible without dropout | **Flow** with progress indicator |
| Lead qualification quiz | Impossible | **Flow** with conditional branching |
| Order/booking review + confirm | Multiple messages | **Flow** with review screen + submit |

Rule of thumb: ≥3 structured inputs OR any input needing native UI (date, time, dropdown >10 items) → Flow. Below that → buttons/lists from v2.0.

## 22B. FLOW ARCHITECTURE (the actual mechanism)

A Flow is a JSON spec (Meta's Flow JSON v6+ in 2026) defining:
- **Screens** — each screen is one form view
- **Components** — TextInput, TextArea, DatePicker, Dropdown, RadioButtonsGroup, CheckboxGroup, OptIn, EmbeddedLink, Footer (submit)
- **Data exchange** — Flow can call YOUR endpoint mid-flow to fetch dynamic data (available slots, product variants, prices)
- **Routing** — conditional next-screen based on user input
- **Termination** — `data_exchange` action on submit posts payload to your webhook → you create the booking/lead/order

```
User taps "Book Appointment" button
  → WhatsApp opens Flow modal natively in-app
  → Screen 1: pick service (radio)        [your webhook returns service list]
  → Screen 2: pick date + slot            [your webhook returns available slots for that service]
  → Screen 3: name + phone + notes
  → Screen 4: review + confirm
  → On submit: POST to /api/webhooks/flows/booking
  → You create row in `appointments`, send WhatsApp confirmation
  → Modal closes, conversation continues
```

This is the same UX as a web booking widget, but inside WhatsApp, never leaving the app.

## 22C. REQUIRED INFRASTRUCTURE (add to Sections 03 + 06)

### New table
```sql
CREATE TABLE whatsapp_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id TEXT NOT NULL UNIQUE,         -- Meta's flow ID after upload
  name TEXT NOT NULL,                   -- 'booking_v1' / 'intake_v2' / 'product_config_v1'
  category TEXT NOT NULL,               -- 'APPOINTMENT_BOOKING' / 'SIGN_UP' / 'LEAD_GENERATION' / 'CONTACT_US' / 'CUSTOMER_SUPPORT' / 'OTHER'
  json_version TEXT NOT NULL,           -- '6.0'
  data_api_version TEXT NOT NULL,       -- '3.0'
  flow_json JSONB NOT NULL,             -- full Flow JSON spec
  status TEXT NOT NULL,                 -- 'draft' / 'published' / 'deprecated'
  endpoint_uri TEXT NOT NULL,           -- our endpoint for data exchange
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE TABLE flow_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID NOT NULL REFERENCES whatsapp_flows(id),
  contact_id UUID REFERENCES contacts(id),
  payload JSONB NOT NULL,               -- the submitted form data
  outcome TEXT NOT NULL,                -- 'success' / 'validation_failed' / 'business_logic_error'
  outcome_detail JSONB,
  resulting_record_id UUID,             -- e.g. appointment.id if it created a booking
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_flow_submissions_contact ON flow_submissions(contact_id);
```

### New endpoint
`POST /api/webhooks/flows/[flow_name]` — receives Flow data exchange + submission.
- Meta signs the request payload with the Flow's public key (asymmetric crypto — different from webhook HMAC). Verify EVERY request.
- Decrypt payload using the Flow's private key (stored in Infisical / env).
- Process the data exchange or submission.
- Respond with the next screen's data OR a success/error response.

The encrypted payload + key rotation is non-trivial — Meta provides reference code in node/python. Use it, don't roll your own crypto.

## 22D. FLOW LIBRARY (ship with each project)

The generated build prompt now includes 4 pre-built Flow JSON files based on niche:

1. **`booking_flow.json`** — universal appointment booking (service → date → slot → contact → review)
2. **`intake_flow.json`** — pre-consultation form (~10 fields, branched by service type)
3. **`product_config_flow.json`** — e-commerce variant picker + add to order
4. **`lead_qualification_flow.json`** — multi-step qualification with conditional branching

These are TEMPLATES — the build prompt customizes screen titles, field labels, and dropdown options to the client's data, but the structure is reusable.

## 22E. FALLBACK FOR FLOW-INCAPABLE DEVICES

Older WhatsApp versions or some web clients can't render Flows. Bot MUST fall back gracefully:
- Detect: Meta's `device_supports_flow` capability check in user profile
- If unsupported: send sequence of interactive messages with the same data
- Log: `messages.metadata.flow_fallback_used = true` so you can measure Flow adoption

---

# ═══════════════════════════════════════════════════════════
# SECTION 23 — QUALITY RATING MONITORING
# (Meta scores every WABA phone number HIGH/MEDIUM/LOW based on
#  user behavior. LOW = throttling + template suspension. v2.0
#  has zero monitoring. By the time you notice, you're throttled.)
# ═══════════════════════════════════════════════════════════

## 23A. WHAT QUALITY RATING IS

Every WhatsApp Business phone number has a quality rating updated by Meta in near-real-time based on:
- User-initiated block rate
- User-initiated report rate
- Reply rate (low replies on template messages → suggests spam)
- "Not interested" responses
- Velocity changes that look like spam patterns

Ratings: **Green (HIGH)** → no restrictions · **Yellow (MEDIUM)** → 24-hr warning, fix or get downgraded · **Red (LOW)** → messaging tier downgraded (fewer daily conversations allowed). Repeated LOW → number flagged, template approvals slowed, eventually permanent restriction.

## 23B. MONITORING IMPLEMENTATION

### New table
```sql
CREATE TABLE quality_rating_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number_id TEXT NOT NULL,        -- which WABA number (for multi-WABA agency)
  rating TEXT NOT NULL CHECK (rating IN ('GREEN', 'YELLOW', 'RED', 'UNKNOWN')),
  messaging_limit_tier TEXT NOT NULL,   -- '1K' / '10K' / '100K' / 'UNLIMITED'
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL                  -- 'webhook' / 'polling' / 'manual'
);
CREATE INDEX idx_quality_phone_time ON quality_rating_history(phone_number_id, checked_at DESC);
```

### Webhook subscription
Subscribe to `phone_number_quality_update` webhook event. Meta pushes rating changes — store every change with timestamp.

### Daily poll
Some accounts don't get webhook events reliably. Cron job polls `GET /{phone-number-id}?fields=quality_rating,messaging_limit_tier` daily. Store every reading.

### Alerts (Sentry + email + admin dashboard banner)
- Rating goes YELLOW → email + dashboard warning + suggested actions
- Rating goes RED → P0 alert + immediate template send freeze (pause non-essential templates automatically)
- Messaging limit downgrade → email + dashboard warning

## 23C. ROOT-CAUSE PLAYBOOK (paste into ops runbook)

When rating drops, the cause is one of:
1. **Sent marketing template to people who didn't expect it** → tighten opt-in, revisit recent template sends
2. **Frequency too high** → reduce template send velocity
3. **Template content reads as spam** → A/B test rewrites
4. **Sent to wrong audience** → audit segmentation logic
5. **Wrong template category** (marketing template sent as utility, etc.) → re-category and re-submit
6. **Outdated contact list** (numbers that no longer use WhatsApp) → list hygiene job

The build prompt MUST include a "diagnose drop in quality rating" runbook in `docs/RUNBOOKS.md`.

---

# ═══════════════════════════════════════════════════════════
# SECTION 24 — MULTI-WABA AGENCY ARCHITECTURE
# (For agencies managing >3 client WABA numbers from one codebase.
#  v2.0 assumes single-tenant. v2.1 ships multi-tenant from Day 1.)
# ═══════════════════════════════════════════════════════════

## 24A. WHEN TO ENABLE MULTI-WABA

- Single client → skip this section, v2.0 single-tenant is correct
- 2-3 clients → still skip, deploy independent instances (less complex)
- 4+ clients → enable multi-WABA, one codebase, one admin, per-client isolation

## 24B. ARCHITECTURE CHANGES

### Add to every table that holds tenant data
```sql
ALTER TABLE contacts        ADD COLUMN tenant_id UUID NOT NULL;
ALTER TABLE messages        ADD COLUMN tenant_id UUID NOT NULL;
ALTER TABLE templates       ADD COLUMN tenant_id UUID NOT NULL;
ALTER TABLE flows           ADD COLUMN tenant_id UUID NOT NULL;  -- whatsapp_flows
ALTER TABLE conversations   ADD COLUMN tenant_id UUID NOT NULL;
-- etc. for every business table
```

### New top-level table
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                          -- 'Sunrise Dental Clinic' / 'Patel Realty'
  slug TEXT NOT NULL UNIQUE,                   -- 'sunrise-dental' / 'patel-realty'
  waba_phone_number_id TEXT NOT NULL UNIQUE,   -- Meta's phone number ID
  waba_business_account_id TEXT NOT NULL,
  display_phone_number TEXT NOT NULL,          -- E.164 format for display
  webhook_verify_token TEXT NOT NULL UNIQUE,   -- per-tenant token
  access_token_secret_ref TEXT NOT NULL,       -- Infisical path for this tenant's WABA token
  monthly_message_quota INTEGER,               -- for billing
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### RLS on every tenant table
```sql
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON contacts
  FOR ALL TO authenticated
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
-- Repeat for every table with tenant_id
```

### Webhook routing
`POST /api/webhooks/whatsapp` receives messages for ALL tenants. Routing rule:
1. Parse incoming payload → extract `metadata.phone_number_id`
2. Look up tenant by `waba_phone_number_id`
3. Load that tenant's access token + system prompt from tenant config
4. Process message scoped to that tenant_id
5. All DB writes carry `tenant_id`

### Admin UI changes
- Top-bar tenant switcher (visible to agency admins only)
- Client admins see only their tenant (RLS enforces)
- Cross-tenant analytics view for agency owner: revenue per tenant, message volume, quality rating per tenant

## 24C. PER-TENANT BILLING

```sql
CREATE TABLE tenant_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  period TEXT NOT NULL,                    -- '2026-06'
  messages_utility INTEGER NOT NULL DEFAULT 0,
  messages_marketing INTEGER NOT NULL DEFAULT 0,
  messages_authentication INTEGER NOT NULL DEFAULT 0,
  messages_service INTEGER NOT NULL DEFAULT 0,
  total_cost_cents INTEGER NOT NULL DEFAULT 0,
  ai_tokens_input BIGINT NOT NULL DEFAULT 0,
  ai_tokens_output BIGINT NOT NULL DEFAULT 0,
  ai_cost_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, period)
);
```

Monthly invoice generation cron → email PDF to each client → reconcile against Meta's actual invoice (you eat the variance, or pass-through with a markup).

---

# ═══════════════════════════════════════════════════════════
# SECTION 25 — WHATSAPP PAY (India primary; expanding globally)
# (In-chat payments. Massive for Indian SMBs — book + pay in one
#  chat. v2.0 doesn't mention it.)
# ═══════════════════════════════════════════════════════════

## 25A. WHEN AVAILABLE (June 2026)

- **India** — Live since 2020 via WhatsApp Pay on UPI. Mature. Default for Indian SMBs.
- **Brazil, Singapore** — Live, growing
- **Indonesia** — Rolling out
- **US, UK, EU** — Limited or pilot — verify per client at build time, do not assume

For non-India markets, fall back to Section 26 (Catalog+Cart) which uses external payment processors.

## 25B. ARCHITECTURE (India / UPI)

1. Bot sends an `interactive` message of type `payment_request` with amount + reference ID
2. User taps "Pay" → opens UPI flow inside WhatsApp natively
3. User selects UPI app + completes payment
4. Meta sends webhook `payment_status` → success / failed / expired
5. On success: bot confirms, your DB marks the order paid, downstream triggers fire (booking confirmed, invoice sent)

## 25C. REQUIRED INFRASTRUCTURE

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  reference_id TEXT NOT NULL UNIQUE,    -- our internal reference sent to Meta
  amount_minor INTEGER NOT NULL,        -- amount in minor units (paise/cents)
  currency TEXT NOT NULL,               -- 'INR'
  status TEXT NOT NULL CHECK (status IN ('initiated', 'pending', 'success', 'failed', 'expired', 'refunded')),
  provider_payment_id TEXT,             -- Meta's payment ID after success
  related_order_id UUID,
  initiated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_payments_contact_status ON payments(contact_id, status);
```

Webhook handler: verify signature, idempotency on `reference_id` (same reference processed once even if webhook fires twice), state transitions strict (cannot go from `success` back to `pending`).

## 25D. UI IN ADMIN

`/admin/payments` shows all transactions per tenant: status, reconciliation against Meta's payout, refund button (with reason logged).

---

# ═══════════════════════════════════════════════════════════
# SECTION 26 — CATALOG + CART (e-commerce niche)
# (For product-selling clients. WhatsApp's native catalog hosts
#  products; the bot adds them to a cart; checkout via WhatsApp Pay
#  or external link. Massive for D2C brands and local retail.)
# ═══════════════════════════════════════════════════════════

## 26A. ARCHITECTURE

1. Client uploads products to their WhatsApp Business Catalog (Meta Commerce Manager OR via API)
2. Bot's `send_catalog_item` and `send_multi_product` interactive messages reference catalog product IDs
3. User taps "Add to cart" → cart accumulates server-side (your DB, indexed by contact + tenant)
4. User says "Checkout" → bot summarizes cart, prompts for delivery address (Flow from Section 22), then payment (Section 25 or external link)

## 26B. REQUIRED TABLES

```sql
CREATE TABLE catalog_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  meta_product_retailer_id TEXT NOT NULL,    -- the ID synced with Meta catalog
  name TEXT NOT NULL,
  description TEXT,
  price_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  image_url TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  variants JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  status TEXT NOT NULL CHECK (status IN ('open', 'abandoned', 'checked_out')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contact_id, tenant_id) WHERE status = 'open'   -- one open cart per contact per tenant
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES catalog_products(id),
  variant_selection JSONB,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_add_minor INTEGER NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 26C. ABANDONED CART RE-ENGAGEMENT

If cart is `open` for >24 hours with no checkout: cron sends an outside-24-hour template (`cart_reminder_v1`, utility category) reminding the user. Click-through reopens the conversation. One reminder only — repeated reminders tank quality rating (Section 23).

---

# ═══════════════════════════════════════════════════════════
# SECTION 27 — CLICK-TO-WHATSAPP ADS (CTWA) INTEGRATION
# (Meta Ads → opens WhatsApp directly. THIS is the discoverability
#  lever for WhatsApp bots, NOT SEO. v7.1 §28B made the SEO point —
#  v2.1 ships the actual CTWA infrastructure.)
# ═══════════════════════════════════════════════════════════

## 27A. WHAT IT IS

A Meta ad (Facebook or Instagram) with a "Send Message" CTA that opens the user's WhatsApp directly to a conversation with the client's WABA number. Pre-fills an opening message based on ad parameters. Trackable end-to-end: ad impression → click → message → conversion.

## 27B. INFRASTRUCTURE

### Ad context capture
When CTWA-originated messages arrive, Meta includes `referral.source_type=ad`, `referral.source_id` (ad ID), `referral.ctwa_clid` (click ID), `referral.headline`, `referral.body`, `referral.media_url`. Capture all of it:

```sql
ALTER TABLE messages ADD COLUMN referral JSONB;
-- Populated for the first inbound message of CTWA conversations

CREATE TABLE ctwa_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  ctwa_clid TEXT NOT NULL,
  ad_id TEXT NOT NULL,
  campaign_id TEXT,
  conversation_started_at TIMESTAMPTZ NOT NULL,
  qualified_at TIMESTAMPTZ,
  booking_at TIMESTAMPTZ,
  purchase_at TIMESTAMPTZ,
  purchase_amount_minor INTEGER,
  attribution_window_days INTEGER NOT NULL DEFAULT 7
);
```

### Conversions API
Send conversion events back to Meta Ads via the WhatsApp Conversions API:
- Conversation started → MESSAGE_RECEIVED event
- Lead qualified → LEAD event
- Booking → SCHEDULE event
- Purchase → PURCHASE event (with value, currency)

This tells Meta's ad optimizer which ad spend produced revenue, dramatically improving ROAS over time. Without Conversions API, Meta is flying blind and your client's CAC stays high.

## 27C. ATTRIBUTION DASHBOARD

`/admin/ctwa` per-tenant view:
- Cost per click (from Meta)
- Cost per qualified lead
- Cost per booking
- ROAS by campaign
- Top-performing ads by conversion (so client knows which creatives to scale)

---

# ═══════════════════════════════════════════════════════════
# SECTION 28 — NICHE TEMPLATE LIBRARY (Day-1 submission ready)
# (v2.0 says "submit templates for approval" — leaves you writing
#  them per project. v2.1 ships pre-written, Meta-compliant templates
#  per niche, categorized correctly, ready to paste.)
# ═══════════════════════════════════════════════════════════

For each niche the build prompt detected (Q1 / Q3), generate a `templates/` directory with these files, ready to submit on Day 1.

## 28A. DENTAL (8 templates)
- `appointment_confirmation` (utility) — "Hi {{1}}, your appointment with {{2}} is confirmed for {{3}}. Reply CANCEL to cancel."
- `appointment_reminder_24h` (utility) — "Reminder: appointment tomorrow at {{1}} with {{2}}. Reply C to confirm, R to reschedule."
- `appointment_reminder_2h` (utility)
- `treatment_followup` (utility) — "Hi {{1}}, how are you feeling after yesterday's {{2}}? Reply if you have any concerns."
- `new_patient_welcome` (utility)
- `payment_receipt` (utility)
- `seasonal_checkup_reminder` (marketing) — opt-in required
- `referral_request` (marketing)

## 28B. HVAC / HOME SERVICES (8)
- `service_call_confirmation`, `technician_eta_update`, `service_complete_receipt`, `seasonal_maintenance_reminder` (marketing), `emergency_callback`, `quote_followup`, `annual_inspection_reminder` (marketing), `payment_reminder` (utility)

## 28C. REAL ESTATE (8)
- `property_inquiry_response`, `viewing_confirmation`, `viewing_reminder_24h`, `viewing_reminder_2h`, `new_listing_match_alert` (marketing), `price_drop_alert` (marketing), `documentation_followup`, `closing_reminder`

## 28D. LAW FIRM (6)
- `consultation_confirmation`, `consultation_reminder`, `document_request`, `case_update`, `payment_reminder`, `next_step_followup`
- NOTE: marketing-category templates rare for law firms — most client communication is utility

## 28E. RESTAURANT (6)
- `reservation_confirmation`, `reservation_reminder`, `order_received`, `order_ready_for_pickup`, `delivery_dispatched`, `weekly_specials` (marketing)

## 28F. SALON / SPA (6)
- `booking_confirmation`, `booking_reminder`, `last_minute_slot_offer` (marketing), `loyalty_reward` (marketing), `birthday_offer` (marketing), `aftercare_followup`

## 28G. GYM / FITNESS (6)
- `membership_welcome`, `class_booking_confirmation`, `class_reminder`, `renewal_reminder`, `new_class_alert` (marketing), `progress_milestone` (marketing)

## 28H. SUBMISSION HYGIENE (rules baked into every template)

- Category correct (utility for transactional, marketing for promotional, authentication for OTPs only). Wrong category = rejection or Section 23 quality drop.
- Variables `{{1}}, {{2}}` numbered sequentially, no gaps
- Sample values provided in submission UI (Meta requires)
- Buttons: max 3 quick replies OR max 2 CTAs (URL + phone) per template
- Header media: optional, but if used must be the same media type for every send
- No promotional language in utility templates (Meta will downgrade category and you lose the cheaper utility rate)

---

# ═══════════════════════════════════════════════════════════
# SECTION 29 — CONVERSATION ANALYTICS & AUTO-CSAT
# (Same idea as Voice §27 — every conversation auto-scored.)
# ═══════════════════════════════════════════════════════════

## 29A. SCORED PER CONVERSATION (Claude job, hourly)

- **Resolution** — did the user get what they came for? (booked / answered / cart completed / lead qualified)
- **Compliance** — did bot stay scoped? Quote only DB prices? Refuse legal/medical advice where required?
- **Hallucination** — claims cross-checked against tool returns
- **Sentiment** — inferred from user utterances (positive / neutral / frustrated)
- **Injection attempts** — did anyone try the 5 injection tests from v2.0 §10? Defense held?
- **Handoff reason** — if escalated to human, why?

```sql
CREATE TABLE conversation_qa_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  resolution_score INTEGER, compliance_score INTEGER, hallucination_score INTEGER,
  sentiment_score INTEGER, overall_score INTEGER,
  injection_attempts JSONB DEFAULT '[]',
  handoff_reason TEXT,
  failures JSONB DEFAULT '[]',
  scored_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 29B. WEEKLY DIGEST (per tenant)

Monday morning email:
- Total conversations, resolution rate, average score
- Top 5 intents handled
- Bottom 5 conversations (low score) with links
- Injection attempts detected (security visibility for client)
- Quality rating status (from Section 23) — keep them aware

---

# ═══════════════════════════════════════════════════════════
# SECTION 30 — WHATSAPP ↔ VOICE CROSS-CHANNEL HANDOFF
# (Mirror of Voice §28. One bot, two channels, one customer.)
# ═══════════════════════════════════════════════════════════

## 30A. WHATSAPP → VOICE

User says "call me" / "I'd rather talk" / "is anyone there to call":
- Bot offers two buttons: "Call me now" / "Schedule a call"
- "Now" → triggers outbound call via voice agent infrastructure (subject to Voice §25 `canDial()` checks)
- "Schedule" → inserts to `scheduled_callbacks`, voice cron picks up
- Full WhatsApp conversation summary passed to voice agent as opening context

## 30B. VOICE → WHATSAPP (mirror)
See Voice v2.1 §28A — caller says "text me" → voice agent calls WhatsApp send tool.

## 30C. UNIFIED CONTACT TIMELINE (mirror)
`/admin/contacts/[id]` shows both voice and WhatsApp interactions interleaved by time.

---

# ═══════════════════════════════════════════════════════════
# SECTION 31 — 24-HOUR WINDOW OPTIMIZATION
# (Free messaging window is 24h from last user message. Outside
#  the window = paid templates. Strategy to maximize free window
#  usage without spam = direct margin improvement.)
# ═══════════════════════════════════════════════════════════

## 31A. THE WINDOW MECHANICS (June 2026)

- User messages bot → 24h "service conversation" window opens, free
- Within window: bot can send any non-template messages (text, media, buttons, lists, Flows)
- Window resets every time user sends a new message
- Window closes → next bot-initiated message MUST be an approved template (paid, per-conversation)
- Marketing templates: separate paid category, higher cost per send

## 31B. OPTIMIZATION TACTICS

1. **End every conversation with a soft re-engagement.** Last bot message asks an easy yes/no: "Was that helpful?" If user replies yes/no → window resets free, conversation continues if needed.
2. **Hour-23 check-in.** Cron at hour 23 of any open conversation: if there's any pending action (incomplete booking, abandoned cart, follow-up due), send the question NOW while still free.
3. **Template only when necessary.** Don't send a template just because it's been a few hours. Templates have cost AND quality rating downside if reply rate is low.
4. **Batch outside-window messages into approved templates with high reply incentive.** Higher reply rate → better quality rating → more capacity.

## 31C. COST DASHBOARD

`/admin/cost/whatsapp` per tenant per month:
- Free service-window messages (volume only, $0)
- Paid utility template messages (volume × cost)
- Paid marketing template messages (volume × cost)
- Paid authentication template messages
- Avoidable templates (sent in last hour of window when free message would have worked) — surface to operator

---

# ═══════════════════════════════════════════════════════════
# SECTION 32 — OBSERVABILITY STACK (WhatsApp-adapted)
# (Mirror of v7.1 §30 with WhatsApp-specific layers.)
# ═══════════════════════════════════════════════════════════

All six layers from v7.1 §30 (Sentry, PostHog, Google Cloud Logging, Infisical, CI/CD, edge proxy) apply. WhatsApp additionally needs:

## 32A. LANGFUSE (all tiers)

Every conversation = one trace. Spans for each tool call. Cost per intent, cost per resolved conversation, prompt version A/B by resolution rate.

## 32B. TEMPLATE PERFORMANCE DASHBOARD

Per template per tenant:
- Sent count
- Delivered / read / replied count
- Reply rate (low reply = quality risk)
- Conversion rate (template sent → desired action)
- Cost per conversion

Underperforming templates flagged for rewrite or category change.

## 32C. WHATSAPP-SPECIFIC ALERTS

- Quality rating downgrade (Section 23) → P0
- Template rejection → email with reason + suggested fix
- Webhook delivery failure rate >2% for 1 hour → alert (Meta's webhook is unreliable; you may need to enable webhook reliability features or set up message-status reconciliation cron)
- Cost per conversation >2× weekly average → alert
- Injection attempt detected (Section 29) → security log + dashboard surface

---

# ═══════════════════════════════════════════════════════════
# END OF WHATSAPP BOT v2.1 ADDENDUM MODULE
# ═══════════════════════════════════════════════════════════
# ██████████████████████████████████████████████████████████
# WHATSAPP v2.2 GAP-CLOSURE MODULE — APPEND TO File 42 (after v2.1)
# Closes W1–W5 from 00_GAP_ANALYSIS.md. ADDITIVE — nothing in v2.0/v2.1
# is removed. These are the residual gaps in an already-strong prompt;
# W1 and W2 are ship-blockers, W3–W5 are sales-blockers.
# ██████████████████████████████████████████████████████████

---

# ═══════════════════════════════════════════════════════════
# SECTION 33 — MULTI-WABA WEBHOOK TENANT ISOLATION  (W1 — HIGH)
# The one real security bug in v2.1. §24B enforces RLS via
# `auth.jwt() ->> 'tenant_id'`. Inbound webhooks run as SERVICE ROLE —
# there is NO user JWT — so JWT-based RLS does NOT protect webhook
# writes. As written, a routing error can write tenant A's message
# under tenant B. This section fixes it.
# ═══════════════════════════════════════════════════════════

## 33A. THE TWO-PATH MODEL (internalize this)
- **Admin UI read path** → runs under a user JWT → JWT-based RLS from §24B is correct HERE. Keep it.
- **Webhook write path** → runs under service role → JWT RLS is bypassed by definition. Needs a DIFFERENT defense:

## 33B. THE FIX (all four, not a subset)
1. **Explicit tenant resolution, asserted.** Webhook parses `metadata.phone_number_id` → looks up tenant → `tenant_id` is carried explicitly on EVERY insert in that request. No insert without it.
2. **NOT-NULL + FK, enforced at DB.** Every tenant table already has `tenant_id UUID NOT NULL`. Add a FK to `tenants(id)` and a trigger that rejects any insert where `tenant_id` doesn't match the resolved tenant for that `phone_number_id`:
```sql
CREATE OR REPLACE FUNCTION assert_tenant_matches_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS DISTINCT FROM
     (SELECT id FROM tenants WHERE waba_phone_number_id = NEW.source_phone_number_id)
  THEN RAISE EXCEPTION 'tenant_id/phone_number_id mismatch — refusing cross-tenant write';
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
-- attach to messages, conversations, flow_submissions, etc.
```
3. **Least-privilege DB role for the webhook.** The webhook connects as a restricted Postgres role that can INSERT/UPDATE only tenant tables and cannot read across tenants — service-role omnipotence is not needed on this path.
4. **RLS still ON** for the admin path; the webhook path relies on 1–3, not on RLS.

## 33C. PROOF (Gate — cannot ship multi-tenant without this)
Reuse `tenant_isolation_test`, extended: fire a webhook for tenant A with a payload that tries to write `tenant_id = B` → the trigger raises, the row is refused. Paste the rejection. Then confirm tenant B's admin session cannot read any tenant A message. Both must hold.

> If you deploy 1–3 clients as independent instances (v2.1 §24A says to), this whole section is N/A — there's no shared codebase to leak across. Only enable it at 4+ clients on one codebase.

---

# ═══════════════════════════════════════════════════════════
# SECTION 34 — GLOBAL STOP / OPT-OUT  (W2 — HIGH, regulatory)
# v2.1 §28 ships templates but has no global opt-out. Every market
# requires an honored STOP. Missing this is a compliance failure AND
# a fast route to a quality-rating RED (§23).
# ═══════════════════════════════════════════════════════════

## 34A. KEYWORDS (per language — tie to §28 localization / W4)
- EN: STOP, UNSUBSCRIBE, CANCEL, OPT OUT · HI: बंद करो / रोको / हटाओ · TE: ఆపు / వద్దు
- Match case-insensitively as a whole-message intent, not substring (don't opt out "stop by tomorrow").

## 34B. MECHANISM
Reuse the Voice §25 `suppression_list` pattern for parity across channels:
```sql
-- extend suppression_list to carry channel + tenant (already E.164-keyed)
INSERT INTO suppression_list (phone, reason, added_by)
VALUES ($1, 'user_opt_out_whatsapp', 'stop_handler');
```
On STOP detected: (1) write suppression, (2) halt ALL non-service messaging to that contact (no templates, no marketing), (3) send ONE confirmation ("You're opted out. Reply START to resume."), (4) honor START to reverse. Log every transition.

## 34C. RULE
A marketing/utility send MUST check suppression before dispatch (mirror Voice's pre-dial `canDial()`). Bypassing it is a P0, same as the voice equivalent.

---

# ═══════════════════════════════════════════════════════════
# SECTION 35 — NEW-NUMBER WARM-UP RAMP  (W3 — sales-blocker)
# §23 MONITORS quality but nothing prescribes the ramp. A new WABA
# number blasting volume tanks to RED before it ever earns tier.
# ═══════════════════════════════════════════════════════════

## 35A. THE RAMP (gate each step on quality staying GREEN)
| Day | Max business-initiated conversations/day | Advance if |
|-----|------------------------------------------|-----------|
| 1–2 | 50 | quality = GREEN, block/report rate ~0 |
| 3–4 | 100 | still GREEN |
| 5–7 | 250 | still GREEN |
| 8–14 | 500 → 1K | GREEN; then Meta auto-raises tier |
| 15+ | follow Meta messaging tier | — |

## 35B. RULES
- Ramp is per NEW number only; established numbers ignore it.
- If quality drops to YELLOW mid-ramp → **freeze at current level**, run §23C root-cause, do not advance until GREEN 48h.
- Prioritize inbound-triggered (service) conversations during ramp — they don't count against initiation limits and build a healthy reply-rate signal.
- Bake the ramp into a `number_warmup` state on `tenants`; the send scheduler reads it.

---

# ═══════════════════════════════════════════════════════════
# SECTION 36 — TEMPLATE LOCALIZATION  (W4 — sales-blocker for IN)
# §28's library is English-only. Your ICP is partly Indian SMB.
# Meta approves templates PER LANGUAGE, category per language.
# ═══════════════════════════════════════════════════════════

## 36A. STRUCTURE CHANGE
Template library gains a language dimension: `templates/<niche>/<template_name>.<lang>.json`. Each language is a separate Meta submission with its own approval + category.

## 36B. PRIORITY LANGUAGES BY MARKET
- **IN:** English + Hindi always; Telugu/Tamil/Kannada/Bengali by client region. (Your base market — Nellore/AP → Telugu matters.)
- **US:** English + Spanish for many niches.
- **UK/CA/AU:** English (localize spelling/tone, not language).

## 36C. SUBMISSION HYGIENE PER LANGUAGE (extends §28H)
- Same category across languages (a utility template stays utility in Hindi).
- Variables `{{1}} {{2}}` map to the SAME data in every language.
- Native-quality translation (not machine-literal) — a clumsy Hindi template reads as spam and risks §23 downgrade.
- Provide sample values per language (Meta requires).

---

# ═══════════════════════════════════════════════════════════
# SECTION 37 — FLOWS KEY ROTATION RUNBOOK  (W5 — LOW)
# §22C uses asymmetric crypto for Flows but has no rotation runbook.
# ═══════════════════════════════════════════════════════════

- **Schedule:** rotate the Flow private key every 180 days, or immediately on any suspected exposure.
- **Steps:** generate new keypair → upload new public key to Meta (Flows endpoint) → keep BOTH keys valid during a 24h overlap → switch decryption to the new key → after overlap, retire the old key from Infisical → audit-log the rotation.
- Store keys in Infisical (v7.1 §30), never in `.env` committed anywhere. Add rotation to `docs/RUNBOOKS.md`.

# ═══════════════════════════════════════════════════════════
# END WHATSAPP v2.2 GAP-CLOSURE MODULE
# ═══════════════════════════════════════════════════════════


# ═══════════════════════════════════════════════════════════
# SECTION 38 — DEMO-MODE PLAYBOOK  (v2.2 net-new — for the portfolio
# flagships and prospect demos; production rules above still apply)
# ═══════════════════════════════════════════════════════════

## 38A. TEST-NUMBER REALITY (build demos on Meta's test number)
- The Cloud API **test number is free** but can message **only up to 5 verified recipient numbers** — add yours, Dheeraj's, and the prospect's number BEFORE the demo call, or the "message this number right now" line dies on stage.
- Test numbers skip business verification but NOT template review; pre-approve the 2–3 demo templates days ahead.
- Going live for a paying client = their own number + verified WABA → the W3/§35 warm-up ramp applies from day 1; never blast a fresh number for a launch stunt.

## 38B. DEMO CONVERSATION DESIGN (what the Loom shows)
The 60–90s arc: inbound "hi" → AI-disclosed greeting → ONE grounded wow (their real price / a listing card with photo / quote-with-photo request) → a Flow or button booking → confirmation read-back. Keep it inside the free service window (§31) — and SAY that to the owner: "everything you just saw cost ₹0 in message fees."

## 38C. DEMO DATA HYGIENE
- Demo tenant rows isolated (mirror Voice §39C); grounded facts scraped from THEIR public site with provenance, human-eyeballed before send.
- STOP/START (§34) works even in demos — a prospect testing STOP and getting another message is a lost deal AND a compliance story.
- No fake reviews, no invented ratings, no "500+ happy customers" — demo is labeled a demo.

## 38D. DEMO → PRODUCTION CHECKLIST (what changes on signature)
Own WABA + number · permanent token in Infisical · webhook on production URL · templates re-submitted under THEIR WABA (per-language, §36) · warm-up ramp state initialized (§35) · suppression list empty-but-armed (§34) · quality webhook live (§23) · tenancy decision recorded (§24A: 1–3 clients = independent instances; 4+ = W1/§33 isolation).

# ═══════════════════════════════════════════════════════════
# SECTION 39 — DELIVERY ORDERING, CONTEXT & INBOUND-FLOOD HARDENING
# (v2.2 production-hardening pass. Already covered elsewhere and NOT
# restated: HMAC verification (§W2), wamid idempotency + backoff
# (Gate B), media AV-scan + no-system-access (§W4), template PAUSED
# recovery (QUALITY_RATING_PLAYBOOK), reconciliation alert (§32C).)
# ═══════════════════════════════════════════════════════════

## 39.1 WEBHOOK ORDERING & EXACTLY-ONCE PROCESSING
**Purpose.** Make inbound processing correct under Meta's real delivery behavior: duplicates, out-of-order events, and status races. **Production justification:** Gate B dedups by `wamid`; nothing yet handles a *reply arriving before the message it answers* or a `delivered` status landing before `sent` — both produce wrong conversation state and wrong bot answers under load.
**Architecture.** Persist-then-process: the webhook handler ONLY verifies signature, dedups, and inserts raw events into `webhook_events`; a worker consumes per-conversation in timestamp order. Meta's 200-OK deadline is met instantly; processing latency never causes Meta retries.
**Data model.**
```sql
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  wamid TEXT,                      -- UNIQUE partial index WHERE wamid IS NOT NULL (dedup)
  event_type TEXT NOT NULL,        -- message | status | template_update | quality_update
  provider_ts TIMESTAMPTZ NOT NULL,-- Meta's timestamp, NOT arrival time
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  attempts INT NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX uq_webhook_wamid ON webhook_events(wamid) WHERE wamid IS NOT NULL;
CREATE INDEX idx_webhook_pending ON webhook_events(tenant_id, processed_at) WHERE processed_at IS NULL;
```
**Algorithms.** (a) Ordering buffer: worker processes a conversation's pending events sorted by `provider_ts`; an event >2s newer than an unprocessed older sibling waits one tick (bounded: max hold 5s, then process — availability beats perfect order). (b) Status monotonicity: `sent → delivered → read` only; a late lower state is recorded in history but never regresses the message's current state (same pattern as §25C payment transitions). (c) Reconciliation cron (makes §32C's alert actionable): every 15 min, `GET` message status for sends with no terminal status after 10 min → upsert; >2%/hr mismatches → the existing §32C alert.
**Failure modes / recovery.** Worker down → events accumulate unprocessed (nothing lost); on restart, per-conversation order still holds because ordering is by `provider_ts`, not arrival. Poison event → `attempts ≥ 3` routes to the dead-letter path (v7.2 §36.2). **Testing protocol (pass/fail):** replay a captured 50-event burst shuffled + 20% duplicated → final DB state byte-identical to the ordered run; a `read` delivered before `delivered` → state ends `read`, history shows both. **Performance:** webhook p95 <150ms (insert-only); worker lag alert at >30s. **Migration note:** single-client builds may run the worker in-process; the table contract is identical, so multi-tenant later is zero rework.

## 39.2 LONG-CONVERSATION CONTEXT MANAGEMENT
**Purpose.** Keep multi-day, many-turn WhatsApp threads coherent within a bounded token budget, and hand humans a usable context pack on takeover. **Production justification:** memory is currently "last-N turns" — a customer returning on day 6 about their day-1 quote gets a bot that has forgotten the quote; a human taking over (W_04 "take over") currently inherits a raw scrollback, not state.
**Data model.** `conversations.summary TEXT` · `conversations.summary_through_message_id UUID` · `conversations.open_slots JSONB` (captured entities: service, date, budget, address...).
**Implementation rules.**
1. Token budget per turn: system+persona (cached) + `summary` + last **10** verbatim turns + `open_slots` ≤ **6K input tokens**; breach → summarize first, then respond.
2. Rolling summary: every 20 processed messages (or on window close), Haiku folds older turns into `summary` (facts, commitments, unresolved asks — no verbatim chat); grounded facts referenced go to `entities`, not prose.
3. Resumption: new inbound on a conversation idle >24h → prompt = summary + slots + the new message; the bot explicitly acknowledges continuity ("About the boiler quote from Tuesday —").
4. Human takeover pack: the W_04 take-over flag renders `summary` + `open_slots` + last 5 turns + QA flags at the top of the thread view — the human never scrolls to orient.
5. Auto-CSAT (§29) scores the FULL conversation via stored messages, never the compressed summary — QA is unaffected by compression.
**Failure mode:** summarizer drops a commitment → mitigated by rule 2's "commitments" clause + the critic cross-check that claimed bookings have rows (unchanged). **Testing (pass/fail):** 60-turn scripted thread → turn-61 input tokens ≤ budget AND the bot correctly recalls a fact stated at turn 3 (from summary/entities); takeover view shows the pack. **Future compatibility:** summary format is plain text — model-agnostic across GLM/Haiku routing.

## 39.3 PER-CONTACT INBOUND FLOOD CONTROL
**Purpose.** Bound cost and queue health when one contact floods the bot. **Production justification:** §1.3 rate-limits HTTP callers; inbound WhatsApp arrives via *Meta's* IPs, so the existing limiter never fires — one user (or a prospect "testing it") sending 200 messages costs 200 LLM turns and starves the worker; nothing prevents it today.
**Algorithm.** Per contact per conversation: >**8 messages/60s** → coalesce mode: worker batches the burst into ONE model turn ("answering your last several messages together") for up to 60s; >**40 messages/10min** → cool-down: one notice ("I'm getting a lot of messages — replying to everything in a moment"), then process every 60s in batches; STOP/START and escalation keywords BYPASS all coalescing (compliance is never queued). Never auto-block, never suppress — flood ≠ opt-out; log `flood_events` for the operator digest.
**Testing (pass/fail):** fixture floods 30 messages/30s → ≤5 model calls total, one coalesced reply, STOP mid-flood still processed instantly (suppression row within 60s). **Performance:** coalescing is a worker-side queue policy on §39.1's table — no new infrastructure.

## 39.4 MEDIA INTAKE SPECIFICS (completes §W4 — three missing controls only)
§W4 already mandates AV-scan and never-system-access. Add, for user media (P1 quote-with-photo is the live consumer): (1) **allowlist + caps** — images `jpeg|png|webp` ≤10MB, documents `pdf` ≤10MB, everything else politely refused with the fallback line; validate MIME by magic bytes, not extension. (2) **EXIF/metadata strip** on stored images (customer GPS coordinates in a photo's EXIF is silent PII leakage into the lead record). (3) **Isolated storage path** `media/{tenant}/{conversation}/` with signed, expiring URLs (mirror Voice §31B's 15-min pattern). **Testing:** upload a GPS-tagged photo → stored copy has no EXIF; upload a renamed .exe as .jpg → refused by magic-byte check.

# ═══════════════════════════════════════════════════════════
# END SECTION 39
# ═══════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════
# END WHATSAPP BOT v2.2 CONSOLIDATED MODULE
# ═══════════════════════════════════════════════════════════
