// lib/whatsapp/crm.js
//
// ponytail: contact identity resolution for the Meta WhatsApp Cloud
// API.
//
// We never trust phone numbers as identity. The IronWake rule (Rule §3
// no-invention, §8 minimum retention, §8B contact keys) is:
//
//   1. Phone numbers from Meta become a contact identity key ONLY when
//      matched to an existing lead / customer row we already host in
//      Supabase (`leads` for prospects, `owner_leads` for CRM managed
//      by the owner, and `auth.users` for logged-in customers).
//   2. If no match is found we do NOT auto-create a customer record —
//      we surface "unknown_contact" and the owner chooses what to do.
//   3. Profile names are stored only on the existing matched record
//      (or pending-review queue), never as a new row.
//
// The point of this module is to be the only place CRM lookups happen
// for the WhatsApp route. Keeping it isolated means the route handler
// never grows direct SQL/PostgREST and keeps reasoning about the
// identity layer in one place.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL_ENV = 'NEXT_PUBLIC_SUPABASE_URL';
const SERVICE_KEY_ENV = 'SUPABASE_SERVICE_ROLE_KEY';

let cachedClient = null;
let cachedEnvKey = null;

function supabaseClient(env = process.env) {
  const url = env[SUPABASE_URL_ENV];
  const key = env[SERVICE_KEY_ENV];
  if (!url || !key) return null;
  // ponytail: caching the client avoids re-doing the JWT handshake on
  // every webhook call. Re-create when env rotates.
  if (cachedClient && cachedEnvKey === key + url) return cachedClient;
  cachedClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  cachedEnvKey = key + url;
  return cachedClient;
}

/**
 * Resolve a contact by E.164 phone number to an existing Supabase
 * identity. We try the three identity sources in order:
 *   1. `leads` — public-submitted prospects (matches via normalized
 *      `phone_e164`).
 *   2. `owner_leads` — owner-managed leads (matches `phone_e164`).
 *   3. We intentionally DO NOT match `auth.users` — finding a logged-in
 *      customer by phone only is a privacy boundary we don't cross
 *      from the webhook.
 *
 * The supabase client uses the service role because the route is
 * server-only and the tables are owner-RLS. If Supabase isn't
 * configured, resolution still returns a stable shape (no match,
 * reason `supabase_unconfigured`) so the route can continue.
 *
 * @param {object} input
 * @param {string} input.from          E.164 phone string from Meta.
 * @param {string|null} input.profileName Optional display name from the
 *                                        first message of a conversation.
 * @param {object} [input.env]         Environment override (tests).
 * @param {object} [input.fetchImpl]   Optional fetch override (tests).
 * @returns {Promise<{
 *   status: 'matched_lead' | 'matched_owner_lead' | 'unknown_contact' | 'supabase_unconfigured' | 'invalid_phone',
 *   leadId?: string|null,
 *   source?: 'leads' | 'owner_leads' | null,
 *   raw?: unknown
 * }>}
 */
export async function resolveContact({ from, profileName, env, fetchImpl } = {}) {
  const phone = normalizeE164(from);
  if (!phone) return { status: 'invalid_phone', reason: 'phone_format_invalid' };

  const supabase = supabaseClient(env || process.env);
  if (!supabase) {
    return { status: 'supabase_unconfigured', reason: 'missing_env' };
  }

  // 1. Public leads table — discovered at intake time with a phone.
  try {
    const { data: lead, error: leadErr } = await supabase
      .from('leads')
      .select('id, full_name, phone_e164')
      .eq('phone_e164', phone)
      .maybeSingle();
    if (!leadErr && lead?.id) {
      return maybeUpdateDisplayName(supabase, 'leads', lead, profileName);
    }
  } catch {
    // non-fatal — fall through
  }

  // 2. Owner-managed lead table.
  try {
    const { data: ownerLead, error: ownerErr } = await supabase
      .from('owner_leads')
      .select('id, full_name, phone_e164')
      .eq('phone_e164', phone)
      .maybeSingle();
    if (!ownerErr && ownerLead?.id) {
      return maybeUpdateDisplayName(supabase, 'owner_leads', ownerLead, profileName);
    }
  } catch {
    // non-fatal
  }

  return { status: 'unknown_contact', leadId: null, source: null, raw: { from: phone } };
}

/**
 * Persist an opt-out signal. Same tables / shape as before, but moved
 * behind a single function so the route handler stays focused on the
 * HTTP response. Idempotent on `(wa_from, keyword, source)`.
 */
export async function recordOptOut({ from, keyword, source }, env = process.env) {
  const supabase = supabaseClient(env);
  if (!supabase) return { ok: false, safeErrorCode: 'supabase_unconfigured' };
  const phone = normalizeE164(from);
  if (!phone) return { ok: false, safeErrorCode: 'phone_invalid' };

  try {
    const { error } = await supabase
      .from('meta_opt_outs')
      .insert({ wa_from: phone, keyword, source: source || 'meta_whatsapp' }, { count: 'exact' });
    if (error) {
      // ponytail: 23505 / duplicate-key is idempotency success, not a
      // real failure. Anything else is a transient Supabase error.
      const isDup = error.code === '23505' || String(error.message || '').includes('duplicate key');
      if (isDup) return { ok: true, duplicate: true };
      return { ok: false, safeErrorCode: 'supabase_insert_failed' };
    }
    return { ok: true, duplicate: false };
  } catch {
    return { ok: false, safeErrorCode: 'supabase_unreachable' };
  }
}

/**
 * Persist a status update to the customer-facing CRM timeline. We
 * bridge from the wamid → the lead so the dashboard can show a single
 * thread. Failures here are non-fatal: the webhook has already
 * acknowledged Meta, and the operator sees the failed event in logs.
 */
export async function recordStatusUpdate({ contactResolution, status, env, fetchImpl } = {}) {
  if (!contactResolution?.leadId) {
    return { ok: false, safeErrorCode: 'contact_unresolved' };
  }
  if (!status?.id) return { ok: false, safeErrorCode: 'status_missing' };

  const supabase = supabaseClient(env || process.env);
  if (!supabase) return { ok: false, safeErrorCode: 'supabase_unconfigured' };

  try {
    const { error } = await supabase.from('whatsapp_events').insert({
      event_type: 'status',
      wamid: status.id,
      source: 'meta_whatsapp',
      contact_id: contactResolution.leadId,
      contact_source: contactResolution.source,
      status_name: status.name || null,
      status_timestamp: status.timestamp || null,
      recipient_id: status.recipientId || null,
      conversation_id: status.conversationId || null,
      conversation_expires_at: status.conversationExpiresAt || null,
      pricing: status.pricing || null,
      errors: status.errors || null,
      metadata: { routing: status.routing || null }
    }, { count: 'exact' });
    if (error && !(error.code === '23505' || String(error.message || '').includes('duplicate key'))) {
      return { ok: false, safeErrorCode: 'supabase_insert_failed' };
    }
    return { ok: true };
  } catch {
    return { ok: false, safeErrorCode: 'supabase_unreachable' };
  }
}

/**
 * Persist an inbound message event to `whatsapp_events`. Safe to call
 * when the table is missing — the route will fall back to structured
 * logging. We DO NOT fail the webhook if the insert errors.
 */
export async function recordInboundEvent({
  contactResolution,
  inbound,
  env,
  dedupKey,
  optedOut
} = {}) {
  const supabase = supabaseClient(env || process.env);
  if (!supabase) return { ok: false, safeErrorCode: 'supabase_unconfigured', persistenceMode: 'log_only' };
  if (!inbound?.id) return { ok: false, safeErrorCode: 'wamid_missing' };

  try {
    const row = {
      event_type: 'inbound',
      wamid: inbound.id,
      source: 'meta_whatsapp',
      contact_id: contactResolution?.leadId || null,
      contact_source: contactResolution?.source || null,
      recipient_id: inbound.from || null,
      message_type: inbound.type || null,
      message_text: typeof inbound.body === 'string' ? inbound.body.slice(0, 1024) : null,
      profile_name: inbound.profileName || null,
      opted_out: Boolean(optedOut),
      dedup_key: dedupKey || null,
      metadata: {
        timestamp: inbound.timestamp || null
      }
    };
    const { error } = await supabase.from('whatsapp_events').insert(row, { count: 'exact' });
    if (error && !(error.code === '23505' || String(error.message || '').includes('duplicate key'))) {
      // ponytail: missing-table is a recoverable / operator-actionable
      // shape. Surface it as `missing_table` so the route can produce
      // an accurate diagnostic instead of pretending success.
      if (error.code === '42P01' || String(error.message || '').includes('does not exist')) {
        return { ok: false, safeErrorCode: 'table_missing', persistenceMode: 'log_only' };
      }
      return { ok: false, safeErrorCode: 'supabase_insert_failed', persistenceMode: 'log_only' };
    }
    return { ok: true, persistenceMode: 'supabase' };
  } catch {
    return { ok: false, safeErrorCode: 'supabase_unreachable', persistenceMode: 'log_only' };
  }
}

// ponytail: minimum E.164 validation. We accept + country code + 7-14
// digits; spaces, dashes, parentheses get stripped so the matched key
// in the CRM is the same string we'd see in `leads.phone_e164`.
export function normalizeE164(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().replace(/[\s()-]/g, '');
  return /^\+[1-9]\d{6,14}$/.test(trimmed) ? trimmed : null;
}

async function maybeUpdateDisplayName(supabase, table, row, profileName) {
  if (!profileName || typeof profileName !== 'string') {
    return { status: table === 'leads' ? 'matched_lead' : 'matched_owner_lead', leadId: row.id, source: table, raw: row };
  }
  // ponytail: only fill in when the existing value is empty. Never
  // overwrite a human-entered name with the Meta-relayed profile name.
  if (row.full_name && row.full_name.trim().length) {
    return { status: table === 'leads' ? 'matched_lead' : 'matched_owner_lead', leadId: row.id, source: table, raw: row, nameUpdated: false };
  }
  try {
    await supabase.from(table).update({ full_name: profileName.slice(0, 200) }).eq('id', row.id);
  } catch {
    return { status: table === 'leads' ? 'matched_lead' : 'matched_owner_lead', leadId: row.id, source: table, raw: row, nameUpdated: false };
  }
  return { status: table === 'leads' ? 'matched_lead' : 'matched_owner_lead', leadId: row.id, source: table, raw: row, nameUpdated: true };
}

export const __internals = {
  supabaseClient,
  maybeUpdateDisplayName
};
