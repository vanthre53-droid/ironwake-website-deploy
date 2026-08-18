// ponytail: Meta WhatsApp Cloud API outbound adapter. Same shape as
// resend-adapter.mjs so the existing notification store / claim worker
// drives it without a new branch.
//   POST https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages
//   Authorization: Bearer {ACCESS_TOKEN}
//   { messaging_product: 'whatsapp', to, type: 'text'|'template', text|template }
//
// We never store the access token at rest in source, never log message
// bodies or PII, and never write customer text back without opt-in.

function e164(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().replace(/[\s()-]/g, '');
  return /^\+[1-9][0-9]{6,14}$/.test(trimmed) ? trimmed : null;
}

function safeProviderCode(error) {
  const code = Number(error?.statusCode);
  const name = String(error?.name || '').toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 60);
  if (code === 401 || code === 403) return 'wa_auth_failed';
  if (code === 429) return 'wa_rate_limited';
  if (code >= 500) return 'wa_provider_error';
  return name ? `wa_${name}` : 'wa_request_failed';
}

function retryableProviderError(error) {
  const code = Number(error?.statusCode);
  return code === 408 || code === 429 || code >= 500;
}

export function readWhatsAppConfig(env = process.env) {
  const token = String(env.META_WA_ACCESS_TOKEN || '').trim();
  const phoneId = String(env.META_WA_PHONE_NUMBER_ID || '').trim();
  const apiVersion = String(env.META_WA_API_VERSION || 'v20.0').trim();
  const timeoutMs = Number(env.META_WA_TIMEOUT_MS || 8000);
  if (!token) return { configured: false, safeErrorCode: 'wa_access_token_missing' };
  if (!phoneId) return { configured: false, safeErrorCode: 'wa_phone_id_missing' };
  return {
    configured: true,
    provider: 'whatsapp',
    apiVersion,
    phoneId,
    accessToken: token,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 8000
  };
}

export function createWhatsAppAdapter(
  config,
  { fetchImpl = fetch, timeoutMs = config?.timeoutMs } = {}
) {
  if (!config?.configured || config.provider !== 'whatsapp') {
    throw new Error('whatsapp_adapter_unconfigured');
  }

  const endpoint = `https://graph.facebook.com/${config.apiVersion}/${config.phoneId}/messages`;

  async function sendText({ to, body }, { idempotencyKey } = {}) {
    if (!idempotencyKey) return { accepted: false, status: 'failed', retryable: false, safeErrorCode: 'idempotency_key_missing' };
    const phone = e164(to);
    if (!phone) return { accepted: false, status: 'failed', retryable: false, safeErrorCode: 'wa_recipient_invalid' };
    const text = typeof body === 'string' ? body.slice(0, 4096) : '';
    if (!text) return { accepted: false, status: 'failed', retryable: false, safeErrorCode: 'wa_body_missing' };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: phone,
          type: 'text',
          text: { preview_url: false, body: text }
        }),
        signal: controller.signal
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          accepted: false,
          status: 'failed',
          retryable: retryableProviderError({ statusCode: res.status }),
          safeErrorCode: safeProviderCode({ statusCode: res.status, name: json?.error?.type })
        };
      }
      const providerEventId = String(json?.messages?.[0]?.id || '').trim();
      if (!providerEventId) {
        return { accepted: false, status: 'unknown', retryable: true, safeErrorCode: 'wa_response_invalid' };
      }
      return { accepted: true, status: 'accepted', providerEventId, retryable: false };
    } catch (err) {
      const timedOut = err?.name === 'AbortError';
      return {
        accepted: false,
        status: timedOut ? 'unknown' : 'failed',
        retryable: true,
        safeErrorCode: timedOut ? 'wa_provider_timeout' : safeProviderCode({ name: err?.name })
      };
    } finally {
      clearTimeout(timer);
    }
  }

  async function sendTemplate({ to, templateName, languageCode = 'en', variables = [] }, { idempotencyKey } = {}) {
    if (!idempotencyKey) return { accepted: false, status: 'failed', retryable: false, safeErrorCode: 'idempotency_key_missing' };
    const phone = e164(to);
    if (!phone) return { accepted: false, status: 'failed', retryable: false, safeErrorCode: 'wa_recipient_invalid' };
    const name = typeof templateName === 'string' ? templateName.trim() : '';
    if (!name) return { accepted: false, status: 'failed', retryable: false, safeErrorCode: 'wa_template_missing' };

    const components = Array.isArray(variables) && variables.length
      ? [{ type: 'body', parameters: variables.slice(0, 10).map((v) => ({ type: 'text', text: String(v).slice(0, 256) })) }]
      : undefined;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: phone,
          type: 'template',
          template: { name, language: { code: languageCode }, ...(components ? { components } : {}) }
        }),
        signal: controller.signal
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          accepted: false,
          status: 'failed',
          retryable: retryableProviderError({ statusCode: res.status }),
          safeErrorCode: safeProviderCode({ statusCode: res.status, name: json?.error?.type })
        };
      }
      const providerEventId = String(json?.messages?.[0]?.id || '').trim();
      if (!providerEventId) {
        return { accepted: false, status: 'unknown', retryable: true, safeErrorCode: 'wa_response_invalid' };
      }
      return { accepted: true, status: 'accepted', providerEventId, retryable: false };
    } catch (err) {
      const timedOut = err?.name === 'AbortError';
      return {
        accepted: false,
        status: timedOut ? 'unknown' : 'failed',
        retryable: true,
        safeErrorCode: timedOut ? 'wa_provider_timeout' : safeProviderCode({ name: err?.name })
      };
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    provider: 'whatsapp',
    send: sendText,
    sendTemplate
  };
}

export const whatsappAdapterInternals = {
  retryableProviderError,
  safeProviderCode,
  e164
};