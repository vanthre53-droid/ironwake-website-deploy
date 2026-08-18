// lib/whatsapp/meta-client.js
//
// ponytail: Meta WhatsApp Cloud API Graph v20.0 wrapper.
//
// Source citations (current as of 2026-08):
//   Send text message:
//   https://developers.facebook.com/docs/whatsapp/cloud-api/messages/text-messages
//   Send template message:
//   https://developers.facebook.com/docs/whatsapp/cloud-api/messages/template-messages
//   Media (upload + retrieve):
//   https://developers.facebook.com/docs/whatsapp/cloud-api/messages/media
//   Phone numbers metadata:
//   https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers
//
// We treat the Cloud API as "unconfigured" unless every required env
// var is present. The wrapper never invents a WABA ID or phone ID,
// never echoes the access token, never logs the request body for a
// template send (template bodies can include PII), and never claims a
// delivery succeeded without the Graph API returning `messages[0].id`.
// Per Rule §3 (no-invention) and §8 (idempotency) we fail closed:
//
//   - Each outbound `send` requires an explicit `idempotencyKey` so
//     retries are deduplicated.
//   - 401 / 403 → never retry; surface as `auth_failed`.
//   - 429 → retryable, with our own timeout budget.
//   - 5xx → retryable, with bounded attempts.
//   - Any 4xx other than 429 → not retryable, surface as-is.

const GRAPH_BASE = 'https://graph.facebook.com';
const DEFAULT_API_VERSION = 'v20.0';
const DEFAULT_TIMEOUT_MS = 8_000;

const ENV_TOKEN = 'META_WA_TOKEN';
const ENV_PHONE_ID = 'META_WA_PHONE_ID';
const ENV_BUSINESS_ID = 'META_WA_BUSINESS_ID';
const ENV_APP_SECRET = 'META_APP_SECRET';

export function readConfig(env = process.env) {
  const token = String(env[ENV_TOKEN] || '').trim();
  const phoneId = String(env[ENV_PHONE_ID] || '').trim();
  const businessId = String(env[ENV_BUSINESS_ID] || '').trim();
  const appSecret = String(env[ENV_APP_SECRET] || '').trim();
  const apiVersion = String(env.META_WA_API_VERSION || DEFAULT_API_VERSION).trim() || DEFAULT_API_VERSION;
  const timeoutMs = Number(env.META_WA_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);

  if (!token || !phoneId || !appSecret) {
    return {
      configured: false,
      reasons: [
        !token && 'META_WA_TOKEN missing',
        !phoneId && 'META_WA_PHONE_ID missing',
        !appSecret && 'META_APP_SECRET missing'
      ].filter(Boolean)
    };
  }

  return {
    configured: true,
    apiVersion,
    phoneId,
    businessId: businessId || null,
    appSecret,
    accessToken: token,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS
  };
}

export function unconfiguredResult(reasons) {
  return {
    ok: false,
    accepted: false,
    safeErrorCode: 'wa_unconfigured',
    reasons: Array.isArray(reasons) ? reasons : [],
    httpStatus: 503
  };
}

/**
 * Create a configured wrapper. Throws synchronously only on a true
 * programming error (calling with `null` config). A failure to read
 * env vars is a non-throwing `{ ok: false, safeErrorCode }`.
 *
 * @param {object} config   The result of `readConfig`.
 * @param {object} [opts]   `{ fetch, timeoutMs }` overrides (tests).
 */
export function createMetaClient(config, opts = {}) {
  if (!config || !config.configured) {
    return {
      configured: false,
      sendText: async () => unconfiguredResult(config?.reasons || ['unconfigured']),
      sendTemplate: async () => unconfiguredResult(config?.reasons || ['unconfigured']),
      fetchPhoneNumber: async () => unconfiguredResult(config?.reasons || ['unconfigured']),
      fetchBusinessProfile: async () => unconfiguredResult(config?.reasons || ['unconfigured']),
      uploadMedia: async () => unconfiguredResult(config?.reasons || ['unconfigured']),
      fetchMedia: async () => unconfiguredResult(config?.reasons || ['unconfigured'])
    };
  }

  const fetchImpl = opts.fetch || (typeof fetch === 'function' ? fetch : null);
  if (typeof fetchImpl !== 'function') {
    throw new Error('meta_client_fetch_missing');
  }
  const timeoutMs = Number.isFinite(opts.timeoutMs) && opts.timeoutMs > 0
    ? opts.timeoutMs
    : config.timeoutMs;

  const base = `${GRAPH_BASE}/${config.apiVersion}/${config.phoneId}/messages`;
  const baseMedia = `${GRAPH_BASE}/${config.apiVersion}/${config.phoneId}/media`;
  const auth = `Bearer ${config.accessToken}`;

  async function request({ method, url, body, headers = {} }) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetchImpl(url, {
        method,
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
          ...headers
        },
        body: body == null ? undefined : JSON.stringify(body),
        signal: controller.signal
      });
      const text = await res.text();
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch { /* not JSON */ }
      return { status: res.status, json, raw: text };
    } finally {
      clearTimeout(timer);
    }
  }

  function normalizeResponse({ status, json }) {
    const ok = status >= 200 && status < 300;
    const errorBlob = Array.isArray(json?.error) ? json.error[0] : json?.error;
    const msgId = json?.messages?.[0]?.id || null;
    return {
      ok,
      accepted: ok,
      status,
      messageId: msgId,
      raw: json,
      safeErrorCode: ok
        ? null
        : safeErrorCodeFromError(errorBlob, status),
      retryable: !ok && retryableStatus(status),
      errorBlob
    };
  }

  async function sendText({ to, body }, ctx = {}) {
    if (!ctx.idempotencyKey) {
      return { ok: false, accepted: false, safeErrorCode: 'idempotency_key_missing', retryable: false };
    }
    const text = typeof body === 'string' ? body : '';
    if (!text.trim()) return { ok: false, accepted: false, safeErrorCode: 'wa_body_missing', retryable: false };
    if (text.length > 4096) return { ok: false, accepted: false, safeErrorCode: 'wa_body_too_long', retryable: false };

    const res = await request({
      method: 'POST',
      url: base,
      body: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { preview_url: Boolean(ctx.previewUrl), body: text }
      },
      headers: ctx.idempotencyKey ? { 'X-Request-Id': ctx.idempotencyKey } : {}
    });
    return normalizeResponse(res);
  }

  async function sendTemplate({ envelope }, ctx = {}) {
    if (!ctx.idempotencyKey) {
      return { ok: false, accepted: false, safeErrorCode: 'idempotency_key_missing', retryable: false };
    }
    if (!envelope?.template?.name) {
      return { ok: false, accepted: false, safeErrorCode: 'wa_template_name_missing', retryable: false };
    }
    const res = await request({
      method: 'POST',
      url: base,
      body: envelope,
      headers: ctx.idempotencyKey ? { 'X-Request-Id': ctx.idempotencyKey } : {}
    });
    return normalizeResponse(res);
  }

  async function fetchPhoneNumber(phoneIdOverride) {
    const id = phoneIdOverride || config.phoneId;
    const res = await request({
      method: 'GET',
      url: `${GRAPH_BASE}/${config.apiVersion}/${id}?fields=verified_name,display_phone_number,quality_rating,messaging_limit_tier,status`,
      body: null
    });
    return normalizeResponse(res);
  }

  async function fetchBusinessProfile() {
    if (!config.businessId) {
      return { ok: false, accepted: false, safeErrorCode: 'wa_business_id_missing', retryable: false };
    }
    const res = await request({
      method: 'GET',
      url: `${GRAPH_BASE}/${config.apiVersion}/${config.businessId}?fields=whatsapp_business_profile,messaging_contacts,phone_numbers`,
      body: null
    });
    return normalizeResponse(res);
  }

  async function uploadMedia({ filename, mimeType, data }, ctx = {}) {
    if (!ctx.idempotencyKey) {
      return { ok: false, accepted: false, safeErrorCode: 'idempotency_key_missing', retryable: false };
    }
    if (typeof data !== 'string' && !(data instanceof Uint8Array) && !(data instanceof ArrayBuffer)) {
      return { ok: false, accepted: false, safeErrorCode: 'wa_media_data_invalid', retryable: false };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const form = new FormData();
      const blob = typeof data === 'string'
        ? new Blob([new TextEncoder().encode(data)], { type: mimeType })
        : data instanceof Uint8Array
          ? new Blob([data], { type: mimeType })
          : new Blob([data], { type: mimeType });
      form.append('file', blob, filename || 'upload');
      form.append('messaging_product', 'whatsapp');
      const res = await fetchImpl(baseMedia, {
        method: 'POST',
        headers: { Authorization: auth },
        body: form,
        signal: controller.signal
      });
      const text = await res.text();
      let json = null;
      try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }
      const ok = res.status >= 200 && res.status < 300;
      return {
        ok,
        accepted: ok,
        status: res.status,
        mediaId: json?.id || null,
        raw: json,
        safeErrorCode: ok ? null : safeErrorCodeFromError(json?.error || json, res.status),
        retryable: !ok && retryableStatus(res.status)
      };
    } finally {
      clearTimeout(timer);
    }
  }

  async function fetchMedia(mediaId) {
    const res = await request({
      method: 'GET',
      url: `${GRAPH_BASE}/${config.apiVersion}/${mediaId}?fields=id,mime_type,sha256,file_size,url`,
      body: null
    });
    return normalizeResponse(res);
  }

  return {
    configured: true,
    apiVersion: config.apiVersion,
    phoneId: config.phoneId,
    businessId: config.businessId,
    sendText,
    sendTemplate,
    fetchPhoneNumber,
    fetchBusinessProfile,
    uploadMedia,
    fetchMedia
  };
}

function safeErrorCodeFromError(errorBlob, status) {
  const code = Number(status);
  // ponytail: ok (2xx) is not a failure shape — never emit a
  // safe-error code when the Graph response succeeded.
  if (code >= 200 && code < 300) return null;
  if (code === 401 || code === 403) return 'wa_auth_failed';
  if (code === 429) return 'wa_rate_limited';
  if (code === 404) return 'wa_not_found';
  if (code === 400) {
    const errCode = Number(errorBlob?.code);
    if (errCode === 131047) return 'wa_window_closed_template_required';
    if (errCode === 131051) return 'wa_template_unregistered';
    if (errCode === 132000) return 'wa_template_param_invalid';
    if (errorBlob?.error_subcode === 2388094 || errorBlob?.code === 2388094) return 'wa_rate_limited';
    return 'wa_request_invalid';
  }
  if (code >= 500) return 'wa_provider_error';
  return 'wa_request_failed';
}

function retryableStatus(status) {
  if (status === 408 || status === 429) return true;
  return status >= 500 && status < 600;
}

export const __internals = {
  GRAPH_BASE,
  DEFAULT_API_VERSION,
  DEFAULT_TIMEOUT_MS,
  retryableStatus,
  safeErrorCodeFromError
};
