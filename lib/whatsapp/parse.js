// lib/whatsapp/parse.js
//
// ponytail: minimal, deterministic parsers for Meta WhatsApp Cloud API
// webhook payloads. Source-cited against v20.0 (current as of 2026-08):
//
//   Webhook payload structure (entry[] / changes[] / value):
//   https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/
//
//   Inbound message envelope:
//   https://developers.facebook.com/docs/whatsapp/cloud-api/messages
//
// Every helper is null-safe. We never throw on unknown shapes — we
// return a stable record that the route handler can fan out to the
// durable store without losing the wamid. Unknown types are recorded
// as `unknown` so observability is preserved.

/**
 * Stable identification of a delivery.
 * - Messages: `wamid:{message.id}` (Meta's opaque, base64-ish id).
 * - Statuses: `status:{status.id}` (also wamid-prefixed but the field
 *   is the message id, not the conversation id).
 */
export function messageKey(payload) {
  try {
    const entries = payload?.entry;
    if (!Array.isArray(entries)) return null;
    for (const entry of entries) {
      const changes = entry?.changes;
      if (!Array.isArray(changes)) continue;
      for (const change of changes) {
        const value = change?.value;
        const messages = value?.messages;
        if (Array.isArray(messages) && messages.length) {
          const id = messages[0]?.id;
          if (typeof id === 'string' && id.length > 0) return `wamid:${id}`;
        }
        const statuses = value?.statuses;
        if (Array.isArray(statuses) && statuses.length) {
          const id = statuses[0]?.id;
          if (typeof id === 'string' && id.length > 0) return `status:${id}`;
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Top-level routing metadata: which WABA + phone received the
 * notification. We keep the raw ids for observability and never
 * invent missing fields.
 */
export function routingMeta(payload) {
  try {
    const entry = Array.isArray(payload?.entry) ? payload.entry[0] : null;
    const change = Array.isArray(entry?.changes) ? entry.changes[0] : null;
    const value = change?.value || {};
    return {
      wabaId: typeof value.metadata?.phone_number_id === 'string'
        ? value.metadata.phone_number_id
        : null,
      displayPhoneNumber: typeof value.metadata?.display_phone_number === 'string'
        ? value.metadata.display_phone_number
        : null,
      field: typeof change?.field === 'string' ? change.field : null,
    };
  } catch {
    return { wabaId: null, displayPhoneNumber: null, field: null };
  }
}

/**
 * Inbound message records. We extract only minimum-necessary fields:
 *   - id (wamid)
 *   - from (E.164 string, used only as a CRM key — never echoed back)
 *   - timestamp (string, used only for ordering)
 *   - type (text | image | ... | unknown)
 *   - text body when present, never embedded otherwise
 *
 * Profile name is collected only when the conversation just opened —
 * Meta only sends it on the first message of a 24h window. The route
 * passes it through as `profileName` for CRM record creation.
 */
export function parseInboundMessages(payload) {
  const out = [];
  try {
    const entries = payload?.entry;
    if (!Array.isArray(entries)) return out;
    for (const entry of entries) {
      const changes = entry?.changes;
      if (!Array.isArray(changes)) continue;
      for (const change of changes) {
        const value = change?.value;
        if (!Array.isArray(value?.messages)) continue;
        for (const msg of value.messages) {
          if (!msg || typeof msg !== 'object') continue;
          out.push(normalizeMessage(msg, value?.contacts));
        }
      }
    }
  } catch {
    return out;
  }
  return out;
}

function normalizeMessage(msg, contacts) {
  const id = typeof msg.id === 'string' ? msg.id : null;
  const from = typeof msg.from === 'string' ? msg.from : null;
  const timestamp = typeof msg.timestamp === 'string' ? msg.timestamp : null;
  const type = typeof msg.type === 'string' ? msg.type : 'unknown';
  const body = extractTextBody(msg);
  const profileName = lookupProfileName(contacts, from);
  return { id, from, timestamp, type, body, profileName };
}

function extractTextBody(msg) {
  if (msg?.type === 'text') {
    const body = msg?.text?.body;
    return typeof body === 'string' ? body.slice(0, 4096) : null;
  }
  // For non-text types, summary fields. We never include raw media
  // payloads, just descriptive metadata, so the durable store can
  // route to the right ingest pipeline later.
  switch (msg?.type) {
    case 'image':
    case 'video':
    case 'audio':
    case 'document':
    case 'sticker':
      return {
        kind: msg.type,
        mediaId: msg?.[msg.type]?.id || null,
        mimeType: msg?.[msg.type]?.mime_type || null,
        sha256: msg?.[msg.type]?.sha256 || null
      };
    case 'location':
      return {
        kind: 'location',
        latitude: msg?.location?.latitude ?? null,
        longitude: msg?.location?.longitude ?? null,
        name: msg?.location?.name || null,
        address: msg?.location?.address || null
      };
    case 'button':
      return { kind: 'button', text: msg?.button?.text || null, payload: msg?.button?.payload || null };
    case 'interactive':
      return { kind: 'interactive', payload: msg?.interactive || null };
    case 'contacts':
      return { kind: 'contacts', count: Array.isArray(msg?.contacts) ? msg.contacts.length : 0 };
    default:
      return { kind: 'unknown' };
  }
}

function lookupProfileName(contacts, from) {
  if (!Array.isArray(contacts) || typeof from !== 'string') return null;
  for (const c of contacts) {
    if (c?.wa_id === from && typeof c?.profile?.name === 'string') {
      return c.profile.name.slice(0, 200);
    }
  }
  return null;
}

/**
 * Status updates (sent / delivered / read / failed). Mapping per
 * v20.0: `status` ∈ { sent, delivered, read, failed, deleted (deletion
 * of an outgoing template by user) }.
 *
 * Returns null when the payload has no statuses. `errors` carries the
 * error blob Meta attaches on `failed` (sub-code, title, message,
 * details) — we record it raw for operator triage but never echo.
 */
export function parseStatusUpdates(payload) {
  const out = [];
  try {
    const entries = payload?.entry;
    if (!Array.isArray(entries)) return out;
    for (const entry of entries) {
      const changes = entry?.changes;
      if (!Array.isArray(changes)) continue;
      for (const change of changes) {
        const value = change?.value;
        if (!Array.isArray(value?.statuses)) continue;
        for (const status of value.statuses) {
          out.push(normalizeStatus(status));
        }
      }
    }
  } catch {
    return out;
  }
  return out;
}

function normalizeStatus(status) {
  const id = typeof status?.id === 'string' ? status.id : null;
  const recipientId = typeof status?.recipient_id === 'string' ? status.recipient_id : null;
  const name = typeof status?.status === 'string' ? status.status : 'unknown';
  const timestamp = typeof status?.timestamp === 'string' ? status.timestamp : null;
  const conversationId = typeof status?.conversation?.id === 'string'
    ? status.conversation.id
    : null;
  const conversationExpiresAt = typeof status?.conversation?.expires_at === 'string'
    ? status.conversation.expires_at
    : null;
  const pricing = status?.pricing && typeof status.pricing === 'object'
    ? {
        billable: typeof status.pricing.billable === 'boolean' ? status.pricing.billable : null,
        category: typeof status.pricing.category === 'string' ? status.pricing.category : null,
        pricingModel: typeof status.pricing.pricing_model === 'string'
          ? status.pricing.pricing_model
          : null
      }
    : null;
  const errors = Array.isArray(status?.errors) ? status.errors : null;
  return {
    id, recipientId, name, timestamp,
    conversationId, conversationExpiresAt,
    pricing, errors
  };
}

/**
 * Meta STOP keywords (policy compliance — never echo, never re-message).
 * Source: https://developers.facebook.com/docs/whatsapp/cloud-api/phone-numbers/opt-out
 */
const STOP_KEYWORDS = new Set(['stop', 'stopall', 'unsubscribe', 'cancel', 'end', 'quit']);

/**
 * Detect an opt-out expressed in an inbound message. Returns the wa_id
 * + keyword when the body is exactly one of the documented STOP tokens
 * (case-insensitive, trimmed). Returns null otherwise.
 */
export function detectOptOut(payload) {
  try {
    const messages = parseInboundMessages(payload);
    for (const msg of messages) {
      const body = typeof msg.body === 'string' ? msg.body.trim().toLowerCase() : '';
      if (!body) continue;
      if (STOP_KEYWORDS.has(body)) {
        return { from: msg.from, keyword: body, wamid: msg.id };
      }
    }
  } catch {
    return null;
  }
  return null;
}

export const __internals = { normalizeMessage, normalizeStatus, lookupProfileName, extractTextBody };
