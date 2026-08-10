import { Resend } from 'resend';

const RETRYABLE_CODES = new Set([
  'application_error',
  'concurrent_idempotent_requests',
  'internal_server_error',
  'rate_limit_exceeded'
]);

function safeProviderCode(error) {
  const name = String(error?.name || '').toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 70);
  return name ? `resend_${name}` : 'resend_request_failed';
}

function retryableProviderError(error) {
  const statusCode = Number(error?.statusCode);
  return RETRYABLE_CODES.has(error?.name) || statusCode === 408 || statusCode === 409 || statusCode === 429 || statusCode >= 500;
}

export function createResendAdapter(
  config,
  { client = new Resend(config.apiKey), timeoutMs = 8000 } = {}
) {
  if (!config?.configured || config.provider !== 'resend') throw new Error('resend_adapter_unconfigured');

  return {
    provider: 'resend',
    async send(message, { idempotencyKey } = {}) {
      if (!idempotencyKey || typeof idempotencyKey !== 'string') {
        return { accepted: false, status: 'failed', retryable: false, safeErrorCode: 'idempotency_key_missing' };
      }

      let timeout;
      const timeoutResult = new Promise((resolve) => {
        timeout = setTimeout(() => resolve({ timedOut: true }), timeoutMs);
      });

      try {
        const request = client.emails.send({
          from: message.from,
          to: message.to,
          subject: message.subject,
          text: message.text,
          html: message.html,
          ...(message.replyTo ? { replyTo: message.replyTo } : {})
        }, { idempotencyKey });
        const result = await Promise.race([request, timeoutResult]);
        if (result?.timedOut) {
          return { accepted: false, status: 'unknown', retryable: true, safeErrorCode: 'provider_timeout' };
        }
        if (result?.error) {
          return {
            accepted: false,
            status: 'failed',
            retryable: retryableProviderError(result.error),
            safeErrorCode: safeProviderCode(result.error)
          };
        }
        const providerEventId = String(result?.data?.id || '').trim();
        if (!providerEventId) {
          return { accepted: false, status: 'unknown', retryable: true, safeErrorCode: 'provider_response_invalid' };
        }
        return { accepted: true, status: 'accepted', providerEventId, retryable: false };
      } catch {
        return { accepted: false, status: 'unknown', retryable: true, safeErrorCode: 'provider_request_failed' };
      } finally {
        clearTimeout(timeout);
      }
    }
  };
}

export const resendAdapterInternals = { retryableProviderError, safeProviderCode };
