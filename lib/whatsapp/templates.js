// lib/whatsapp/templates.js
//
// ponytail: helpers for the Meta WhatsApp Cloud API template messages.
//
// Source citations (current as of 2026-08, v20.0):
//   Template messages:
//   https://developers.facebook.com/docs/whatsapp/cloud-api/messages/template-messages
//   Parameter formats:
//   https://developers.facebook.com/docs/whatsapp/cloud-api/messages/message-templates/parameters
//
// Templates are the only mechanism to start a business-initiated
// conversation outside the 24h service window. We never invent template
// IDs, never substitute short-codes that haven't been vetted by the
// template library review, and never ship a `template` whose `language`
// is anything other than `language.code`. The send-side caller is
// expected to look the resolved template by name from the
// already-approved catalog (it's stored in the CRM/owner dashboard, not
// resolved at request time).
//
// This module is intentionally framework- and transport-agnostic:
// `buildTemplateBody({...})` returns a plain object the Graph wrapper
// passes to `POST /v20.0/{phone_id}/messages`. Keeping the body shape
// separate from the transport lets the same template drive the legacy
// adapter (`lib/notifications/whatsapp-adapter.mjs`), the new graph
// client (`lib/whatsapp/meta-client.js`), and tests.

const ALLOWED_LANG_CODES = new Set([
  'af', 'sq', 'ar', 'az', 'bn', 'bg', 'ca', 'zh_CN', 'zh_HK', 'zh_TW',
  'hr', 'cs', 'da', 'nl', 'en', 'en_GB', 'en_US', 'et', 'fil', 'fi',
  'fr', 'fr_CA', 'ka', 'de', 'el', 'gu', 'ha', 'he', 'hi', 'hu',
  'id', 'ga', 'it', 'ja', 'kn', 'kk', 'rw_RW', 'ko', 'ky_KG', 'lo',
  'lv', 'lt', 'mk', 'mg', 'ms', 'ml', 'mr', 'nb', 'nn', 'fa',
  'pl', 'pt_BR', 'pt_PT', 'pa', 'ro', 'ru', 'sr', 'sk', 'sl', 'es',
  'es_AR', 'es_ES', 'es_MX', 'sw', 'sv', 'tl', 'ta', 'te', 'th',
  'tr', 'uk', 'ur', 'uz', 'vi', 'zu'
]);

const HEADER_KINDS = new Set(['text', 'image', 'document', 'video']);

function truncate(value, max) {
  if (typeof value !== 'string') return value;
  return value.length > max ? value.slice(0, max) : value;
}

/**
 * Sanitize a template body. We do not validate that the template name
 * is registered — the CRM layer does that on the owner side. We only
 * enforce the v20.0 envelope rules so a malformed caller payload
 * short-circuits before hitting the Graph API.
 */
export function buildTemplateBody({
  to,
  templateName,
  languageCode,
  components,
  category
} = {}) {
  if (typeof to !== 'string' || !to) {
    return { ok: false, safeErrorCode: 'wa_to_missing' };
  }
  // ponytail: WhatsApp template names are lowercase alpha + underscore,
  // but the documented official envelope allows ASCII alnum + underscore,
  // and we cap at 512 because that's the documented Graph API limit.
  if (typeof templateName !== 'string' || !/^[A-Za-z0-9_]{1,512}$/.test(templateName)) {
    return { ok: false, safeErrorCode: 'wa_template_name_invalid' };
  }
  if (typeof languageCode !== 'string' || !ALLOWED_LANG_CODES.has(languageCode)) {
    return { ok: false, safeErrorCode: 'wa_language_code_unsupported' };
  }
  const normalized = normalizeComponents(components);
  if (!normalized.ok) return normalized;

  return {
    ok: true,
    body: {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        ...(category ? { category } : {}),
        ...(normalized.components.length
          ? { components: normalized.components }
          : {})
      }
    }
  };
}

function normalizeComponents(components) {
  if (components == null) return { ok: true, components: [] };
  if (!Array.isArray(components)) return { ok: false, safeErrorCode: 'wa_components_invalid' };

  const result = [];
  for (const raw of components) {
    if (!raw || typeof raw !== 'object') {
      return { ok: false, safeErrorCode: 'wa_components_invalid' };
    }
    const { type, parameters } = raw;
    if (typeof type !== 'string') {
      return { ok: false, safeErrorCode: 'wa_components_invalid' };
    }
    if (type === 'header' && typeof raw.format === 'string' && HEADER_KINDS.has(raw.format)) {
      result.push({
        type: 'header',
        format: raw.format,
        parameters: normalizeHeaderParameters(raw.format, parameters)
      });
      continue;
    }
    if (type === 'body') {
      result.push({
        type: 'body',
        parameters: normalizeStringParameters(parameters)
      });
      continue;
    }
    if (type === 'footer') {
      // footer has no parameters in v20.0 — ignored if a caller passes one.
      result.push({ type: 'footer' });
      continue;
    }
    if (type === 'button') {
      const list = normalizeButtonParameters(parameters);
      if (!list.ok) return list;
      result.push({
        type: 'button',
        sub_type: raw.sub_type || 'quick_reply',
        index: typeof raw.index === 'number' ? raw.index : 0,
        parameters: list.parameters
      });
      continue;
    }
    return { ok: false, safeErrorCode: `wa_unknown_component_type_${type}` };
  }
  return { ok: true, components: result };
}

function normalizeStringParameters(parameters) {
  const out = [];
  if (!Array.isArray(parameters)) return out;
  for (const p of parameters) {
    if (!p || typeof p !== 'object') continue;
    if (typeof p.text === 'string') {
      out.push({ type: 'text', text: truncate(p.text, 1024) });
    } else if (typeof p.currency?.amount === 'number' && typeof p.currency?.code === 'string') {
      out.push({
        type: 'currency',
        currency: { amount: Math.round(p.currency.amount), code: p.currency.code.slice(0, 10) },
        fallback_value: truncate(p.fallback_value || '', 60)
      });
    } else if (typeof p.date_time?.timestamp === 'number') {
      out.push({
        type: 'date_time',
        date_time: truncate(p.date_time.text || '', 60),
        fallback_value: truncate(p.fallback_value || '', 60)
      });
    }
  }
  return out;
}

function normalizeHeaderParameters(format, parameters) {
  const out = [];
  if (!Array.isArray(parameters)) return out;
  for (const p of parameters) {
    if (!p || typeof p !== 'object') continue;
    if (format === 'text' && typeof p.text === 'string') {
      out.push({ type: 'text', text: truncate(p.text, 60) });
    } else if ((format === 'image' || format === 'video' || format === 'document') && p.link) {
      const obj = { type: format };
      if (typeof p.link === 'string') obj.link = truncate(p.link, 2048);
      if (typeof p.caption === 'string' && format !== 'document') obj.caption = truncate(p.caption, 1024);
      if (typeof p.filename === 'string' && format === 'document') obj.filename = truncate(p.filename, 240);
      out.push(obj);
    }
  }
  return out;
}

function normalizeButtonParameters(parameters) {
  if (!Array.isArray(parameters)) return { ok: true, parameters: [] };
  const out = [];
  for (const p of parameters) {
    if (!p || typeof p !== 'object') {
      return { ok: false, safeErrorCode: 'wa_components_invalid' };
    }
    if (typeof p.type === 'string' && typeof p.text === 'string') {
      out.push({
        type: p.type,
        text: truncate(p.text, 256),
        payload: typeof p.payload === 'string' ? truncate(p.payload, 256) : undefined,
        url: typeof p.url === 'string' ? truncate(p.url, 2048) : undefined
      });
    }
  }
  return { ok: true, parameters: out };
}

/**
 * Compose a session/text body. The route uses this only during the
 * 24h service window where the user initiated. Outside the window we
 * MUST send a template — there is no fall-through.
 */
export function buildTextBody({ to, body, previewUrl = false }) {
  if (typeof to !== 'string' || !to) {
    return { ok: false, safeErrorCode: 'wa_to_missing' };
  }
  const text = typeof body === 'string' ? body : '';
  if (!text.trim()) return { ok: false, safeErrorCode: 'wa_body_missing' };
  if (text.length > 4096) return { ok: false, safeErrorCode: 'wa_body_too_long' };

  return {
    ok: true,
    body: {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: Boolean(previewUrl), body: text }
    }
  };
}

/**
 * Known catalog of templates IronWake has pre-registered (or pending)
 * in Meta's Business Manager. This is informational only — the resolver
 * is on the owner dashboard. We never claim a template is registered
 * here; we expose the names that have been *requested* from Meta so
 * tests can match against the registered list.
 */
export const KNOWN_TEMPLATES = Object.freeze([
  {
    name: 'ironwake_welcome',
    language: 'en_US',
    status: 'pending',
    purpose: 'welcome_prospect_after_web_form'
  },
  {
    name: 'ironwake_follow_up_24h',
    language: 'en_US',
    status: 'pending',
    purpose: 'follow_up_after_unanswered_inquiry'
  },
  {
    name: 'ironwake_booking_confirmed',
    language: 'en_US',
    status: 'pending',
    purpose: 'confirm_booking_after_owner_approval'
  }
]);

export const __internals = {
  ALLOWED_LANG_CODES,
  HEADER_KINDS,
  normalizeComponents,
  normalizeStringParameters,
  normalizeHeaderParameters,
  normalizeButtonParameters
};
