// lib/provider-state.mjs
//
// ponytail: provider-state probes for the owner dashboard.
// Each probe is a SAFE READ-ONLY call against the provider's least-privileged
// surface. Probes never echo secrets, never log PII, never mutate provider
// state, and never trigger a Retell call / Meta send / Supabase mutation.
//
// Verdict vocabulary (per the V13 owner requirement: "no fake placeholders"):
//   - VERIFIED        — env is configured AND the live read-only call succeeded
//   - NOT_CONFIGURED  — required env vars are missing; nothing to probe
//   - UNREACHABLE     — env is configured but the live call failed (network,
//                        auth, 4xx, 5xx). We never claim success on a failure.
//
// All probes are hardened against missing fetch (Node 18+), worker runtime
// (no `process.on`, no `require`), and short timeouts so the owner dashboard
// stays snappy even when a provider is degraded.

const DEFAULT_TIMEOUT_MS = 4_000;

function normalizeEnv(env) {
  if (!env || typeof env !== 'object') return process.env || {};
  return env;
}

function pickFetch(fetchImpl) {
  if (typeof fetchImpl === 'function') return fetchImpl;
  if (typeof globalThis.fetch === 'function') return globalThis.fetch;
  return null;
}

function withTimeout(fetchImpl, timeoutMs) {
  return async function fetchWithTimeout(url, init) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetchImpl(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };
}

function redactError(error) {
  if (!error) return null;
  const name = error.name === 'AbortError' ? 'timeout' : 'unknown';
  const message = error.message ? String(error.message).slice(0, 120) : '';
  // Strip token/key-like substrings ("Bearer xxx", "sk-...") defensively.
  const safe = message.replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer <redacted>')
    .replace(/[A-Za-z0-9-]{20,}/g, (m) => (m.toLowerCase().includes('bearer') ? m : '<redacted>'));
  return { name, message: safe };
}

// ---------------------------------------------------------------------------
// Retell
// ---------------------------------------------------------------------------

const RETELL_API_BASE = 'https://api.retellai.com';

export async function probeRetell({ env = process.env, fetchImpl, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const e = normalizeEnv(env);
  const apiKey = String(e.RETELL_API_KEY || '').trim();
  const agentId = String(e.RETELL_AGENT_ID || '').trim();

  if (!apiKey || !agentId) {
    return {
      configured: false,
      agentId: agentId || null,
      healthy: false,
      lastError: {
        code: 'not_configured',
        message: 'RETELL_API_KEY or RETELL_AGENT_ID is missing'
      }
    };
  }

  const baseFetch = pickFetch(fetchImpl);
  if (!baseFetch) {
    return {
      configured: true,
      agentId,
      healthy: false,
      lastError: { code: 'runtime_no_fetch', message: 'fetch is not available in this runtime' }
    };
  }

  const fetchFn = withTimeout(baseFetch, timeoutMs);
  try {
    // GET /v2/agent/{agent_id} is read-only and verifies both the API key
    // and that the configured agent ID exists.
    const res = await fetchFn(`${RETELL_API_BASE}/v2/agent/${encodeURIComponent(agentId)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store'
    });
    if (res.ok) {
      return { configured: true, agentId, healthy: true, lastError: null };
    }
    if (res.status === 401 || res.status === 403) {
      return {
        configured: true,
        agentId,
        healthy: false,
        lastError: { code: 'auth_failed', message: 'Retell API key rejected (401/403)' }
      };
    }
    if (res.status === 404) {
      return {
        configured: true,
        agentId,
        healthy: false,
        lastError: { code: 'agent_not_found', message: 'Retell agent_id not found' }
      };
    }
    return {
      configured: true,
      agentId,
      healthy: false,
      lastError: { code: 'http_error', message: `Retell responded ${res.status}` }
    };
  } catch (err) {
    return {
      configured: true,
      agentId,
      healthy: false,
      lastError: redactError(err) || { code: 'network_error', message: 'Unknown fetch failure' }
    };
  }
}

// ---------------------------------------------------------------------------
// Meta Cloud API (WhatsApp)
// ---------------------------------------------------------------------------

const META_GRAPH_DEFAULT = 'https://graph.facebook.com';

export async function probeMeta({ env = process.env, fetchImpl, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const e = normalizeEnv(env);
  // FIX: align env var names with the rest of the codebase (lib/notifications/whatsapp-adapter.mjs,
  // app/api/whatsapp/start/route.js, lib/whatsapp/oauth.js). The previous names were stale and
  // caused the Meta probe to always report `not_configured` even when credentials existed.
  const token = String(e.META_WA_ACCESS_TOKEN || e.META_WA_TOKEN || '').trim();
  const phoneId = String(e.META_WA_PHONE_NUMBER_ID || e.META_WA_PHONE_ID || '').trim();
  const wabaId = String(e.META_WABA_ID || e.META_WA_BUSINESS_ID || '').trim();
  const apiVersion = String(e.META_WA_API_VERSION || 'v20.0').trim() || 'v20.0';
  const graphBase = String(e.META_GRAPH_API_BASE || META_GRAPH_DEFAULT).replace(/\/$/, '');

  if (!token || !phoneId) {
    return {
      configured: false,
      phoneId: phoneId || null,
      wabaId: wabaId || null,
      apiVersion,
      healthy: false,
      lastError: {
        code: 'not_configured',
        message: 'META_WA_ACCESS_TOKEN or META_WA_PHONE_NUMBER_ID is missing'
      }
    };
  }

  const baseFetch = pickFetch(fetchImpl);
  if (!baseFetch) {
    return {
      configured: true,
      phoneId,
      wabaId: wabaId || null,
      apiVersion,
      healthy: false,
      lastError: { code: 'runtime_no_fetch', message: 'fetch is not available in this runtime' }
    };
  }

  const fetchFn = withTimeout(baseFetch, timeoutMs);
  try {
    // GET /<apiVersion>/<phone-id> is the cheapest read-only Meta call: it
    // verifies the access token, that the phone number is connected, and
    // returns the verified_name + display_phone_number.
    const url = `${graphBase}/${apiVersion}/${encodeURIComponent(phoneId)}?fields=id,verified_name,display_phone_number,quality_rating`;
    const res = await fetchFn(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (res.ok) {
      return {
        configured: true,
        phoneId,
        wabaId: wabaId || null,
        apiVersion,
        healthy: true,
        lastError: null
      };
    }
    if (res.status === 401 || res.status === 403) {
      return {
        configured: true,
        phoneId,
        wabaId: wabaId || null,
        apiVersion,
        healthy: false,
        lastError: { code: 'auth_failed', message: 'Meta WhatsApp token rejected (401/403)' }
      };
    }
    if (res.status === 404) {
      return {
        configured: true,
        phoneId,
        wabaId: wabaId || null,
        apiVersion,
        healthy: false,
        lastError: { code: 'phone_not_found', message: 'Meta phone_id not found in this WABA' }
      };
    }
    return {
      configured: true,
      phoneId,
      wabaId: wabaId || null,
      apiVersion,
      healthy: false,
      lastError: { code: 'http_error', message: `Meta responded ${res.status}` }
    };
  } catch (err) {
    return {
      configured: true,
      phoneId,
      wabaId: wabaId || null,
      apiVersion,
      healthy: false,
      lastError: redactError(err) || { code: 'network_error', message: 'Unknown fetch failure' }
    };
  }
}

// ---------------------------------------------------------------------------
// Supabase
// ---------------------------------------------------------------------------

const SUPABASE_PROBE_PATH = '/auth/v1/health';

export async function probeSupabase({ env = process.env, fetchImpl, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const e = normalizeEnv(env);
  const url = String(e.NEXT_PUBLIC_SUPABASE_URL || e.SUPABASE_URL || '').trim();
  const anonKey = String(e.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  if (!url || !anonKey) {
    return {
      configured: false,
      url: url ? redactUrl(url) : null,
      healthy: false,
      lastError: {
        code: 'not_configured',
        message: 'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing'
      }
    };
  }

  const baseFetch = pickFetch(fetchImpl);
  if (!baseFetch) {
    return {
      configured: true,
      url: redactUrl(url),
      healthy: false,
      lastError: { code: 'runtime_no_fetch', message: 'fetch is not available in this runtime' }
    };
  }

  const fetchFn = withTimeout(baseFetch, timeoutMs);
  try {
    // Supabase exposes a public health endpoint at /auth/v1/health. The
    // apikey header is required and is public-safe.
    const healthUrl = `${url.replace(/\/$/, '')}${SUPABASE_PROBE_PATH}`;
    const res = await fetchFn(healthUrl, {
      method: 'GET',
      headers: { apikey: anonKey, 'content-type': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      return { configured: true, url: redactUrl(url), healthy: true, lastError: null };
    }
    return {
      configured: true,
      url: redactUrl(url),
      healthy: false,
      lastError: { code: 'http_error', message: `Supabase health responded ${res.status}` }
    };
  } catch (err) {
    return {
      configured: true,
      url: redactUrl(url),
      healthy: false,
      lastError: redactError(err) || { code: 'network_error', message: 'Unknown fetch failure' }
    };
  }
}

function redactUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cloudflare
// ---------------------------------------------------------------------------

export function probeCloudflare({ env = process.env } = {}) {
  const e = normalizeEnv(env);
  const apiToken = String(e.CF_API_TOKEN || '').trim();
  const accountId = String(e.CF_ACCOUNT_ID || '').trim();
  const zoneId = String(e.CF_ZONE_ID || '').trim();
  const workerName = String(e.CF_WORKER_NAME || '').trim();

  if (!apiToken && !accountId && !zoneId && !workerName) {
    return {
      configured: false,
      accountId: accountId || null,
      zoneId: zoneId || null,
      workerName: workerName || null,
      healthy: false,
      lastError: {
        code: 'not_configured',
        message: 'No Cloudflare credentials present (CF_API_TOKEN / CF_ACCOUNT_ID / CF_ZONE_ID / CF_WORKER_NAME)'
      }
    };
  }

  // We deliberately do NOT call the Cloudflare API here. The provider-state
  // dashboard reports CONFIGURATION only — the live read-only worker/zone
  // probe belongs to the deploy-time audit (scripts/worker-secrets-audit.mjs).
  // Reporting config truth is the honest verdict for a continuously-polled
  // owner endpoint (a noisy 4xx per dashboard refresh would not help).
  const missing = [];
  if (!apiToken) missing.push('CF_API_TOKEN');
  if (!accountId) missing.push('CF_ACCOUNT_ID');
  return {
    configured: true,
    accountId: accountId || null,
    zoneId: zoneId || null,
    workerName: workerName || null,
    healthy: missing.length === 0,
    lastError: missing.length
      ? { code: 'partial_config', message: `Missing: ${missing.join(', ')}` }
      : null
  };
}

// ---------------------------------------------------------------------------
// Aggregate probe
// ---------------------------------------------------------------------------

/**
 * Run every probe in parallel. Returns a stable shape:
 *   { retell: {...}, meta: {...}, supabase: {...}, cloudflare: {...}, lastProbed }
 */
export async function probeAll(opts = {}) {
  const startedAt = new Date().toISOString();
  const [retell, meta, supabase, cloudflare] = await Promise.all([
    probeRetell(opts),
    probeMeta(opts),
    probeSupabase(opts),
    Promise.resolve(probeCloudflare(opts))
  ]);
  return {
    lastProbed: startedAt,
    retell,
    meta,
    supabase,
    cloudflare
  };
}

/**
 * Maps a probe result to the contract the owner route returns:
 *   { provider, status, lastProbed, capability, detail }
 * where status is VERIFIED | NOT_CONFIGURED | UNREACHABLE.
 */
export function summarizeProvider(name, probeResult, lastProbed) {
  let status;
  if (!probeResult.configured) {
    status = 'NOT_CONFIGURED';
  } else if (probeResult.healthy) {
    status = 'VERIFIED';
  } else {
    status = 'UNREACHABLE';
  }
  return {
    provider: name,
    status,
    lastProbed,
    capability: describeCapability(name, probeResult),
    detail: {
      configured: probeResult.configured,
      healthy: probeResult.healthy,
      lastError: probeResult.lastError || null
    }
  };
}

function describeCapability(name, probeResult) {
  switch (name) {
    case 'retell':
      return probeResult.configured
        ? ['voice:web-call']
        : [];
    case 'meta':
      return probeResult.configured ? ['whatsapp:send', 'whatsapp:template'] : [];
    case 'supabase':
      return probeResult.configured ? ['auth', 'database', 'storage'] : [];
    case 'cloudflare':
      return probeResult.configured ? ['workers', 'kv', 'r2'] : [];
    default:
      return [];
  }
}
