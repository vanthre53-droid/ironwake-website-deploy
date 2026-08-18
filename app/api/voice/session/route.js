import { createWebCall, retellConfigured, retellUnconfiguredResult } from '../../../../lib/retell-server.mjs';
import { allowRequest, requestIdentity } from '../../../../lib/request-rate-limit.mjs';
import { getServerOrigin } from '../../../../lib/site-origin.mjs';

export const dynamic = 'force-dynamic';

// ponytail: explicit marker the UI checks for to show the truthful
// "voice not yet wired" state. Surfaced whenever RETELL_API_KEY or
// RETELL_AGENT_ID is missing.
const PROVIDER_PENDING_MARKER = 'RETELL_PROVIDER_PENDING';

function pendingResponse(safe) {
  return Response.json(
    {
      ok: false,
      provider: 'retell',
      status: 'unconfigured',
      marker: PROVIDER_PENDING_MARKER,
      safeErrorCode: safe?.safeErrorCode || 'retell_unconfigured',
      message: 'Voice receptionist is wired but the Retell provider is not yet provisioned. Set RETELL_API_KEY and RETELL_AGENT_ID to enable live calls.'
    },
    { status: safe?.httpStatus || 503 }
  );
}

// ponytail: Retell web-call session bootstrap.
//
// Browser POSTs here with an empty body. The server:
//  1. derives a client identity (Cloudflare cf-connecting-ip),
//  2. applies a small per-IP budget so the expensive Retell create-call
//     call cannot be exhausted by an attacker,
//  3. calls Retell server-to-server with RETELL_API_KEY (never sent to
//     the browser),
//  4. returns only the short-lived web-call access token plus a safe
//     call identifier.
//
// The browser starts the call with the @retell/client-sdk; the access
// token is single-use and Retell invalidates an unused token after
// ~30 seconds. Microphone permission is requested by the SDK on call
// start; we never activate the mic in this route.
//
// Goal §16: server-only keys, real states (this route returns 503 when
// the provider is unconfigured; the UI shows a truthful unavailable
// state, never a fake waveform).
export async function POST(request) {
  // ponytail: short-circuit on missing provider credentials before touching
  // the rate limiter — no point burning a token budget when there's nothing
  // to call upstream.
  if (!retellConfigured(process.env)) {
    return pendingResponse(retellUnconfiguredResult());
  }

  const identity = requestIdentity(request);
  const budget = allowRequest(`voice-session:${identity}`, { limit: 5, windowMs: 60_000 });
  if (!budget) {
    return Response.json(
      { ok: false, safeErrorCode: 'rate_limited' },
      { status: 429, headers: { 'retry-after': String(Math.ceil((budget.resetMs || 60_000) / 1000)) } }
    );
  }

  const result = await createWebCall({
    metadata: { source: 'demo' },
    customerSupabaseUserId: null
  });

  if (!result.ok) {
    if (result.safeErrorCode === 'retell_unconfigured') {
      return pendingResponse(result);
    }
    return Response.json(
      { ok: false, provider: 'retell', safeErrorCode: result.safeErrorCode, marker: null },
      { status: result.httpStatus || 503 }
    );
  }

  return Response.json({
    ok: true,
    provider: 'retell',
    accessToken: result.accessToken,
    callId: result.callId,
    expiresInSeconds: result.expiresInSeconds || 30,
    origin: getServerOrigin()
  });
}

export async function GET() {
  // ponytail: provider-readiness probe. Mirrors the marker contract above so
  // the UI can decide whether to show the live-call UI, the audit form, or
  // the truthful "voice is wired but the provider is pending" state.
  if (!retellConfigured(process.env)) {
    return pendingResponse(retellUnconfiguredResult());
  }
  return Response.json(
    {
      ok: true,
      provider: 'retell',
      status: 'ready',
      marker: null,
      agentId: process.env.RETELL_AGENT_ID
    },
    { status: 200 }
  );
}
