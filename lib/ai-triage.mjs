const CATEGORIES = new Set(['inquiry', 'booking', 'follow_up', 'reception', 'other']);
const PRIORITIES = new Set(['low', 'normal', 'high', 'urgent']);

const TRIAGE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    needs_human: { type: 'boolean' },
    priority: { type: 'string', enum: [...PRIORITIES] },
    category: { type: 'string', enum: [...CATEGORIES] },
    summary: { type: 'string', maxLength: 500 },
    suggested_reply: { type: 'string', maxLength: 1200 }
  },
  required: ['needs_human', 'priority', 'category', 'summary', 'suggested_reply']
};

const FALLBACK = {
  status: 'unconfigured',
  needs_human: true,
  priority: 'normal',
  category: 'other',
  summary: 'AI triage is not configured.',
  suggested_reply: ''
};

function providerName(baseUrl, model) {
  if (/minimax\.io/i.test(baseUrl) || /^MiniMax-/i.test(model)) return 'minimax';
  return 'unknown';
}

function providerFailure({ provider, model, safeErrorCode, summary }) {
  return { ...FALLBACK, status: 'provider_error', provider, model, safe_error_code: safeErrorCode, summary };
}

function responseFailureCode(response, body) {
  const providerCode = Number(body?.base_resp?.status_code);
  if (providerCode === 1001) return 'provider_timeout';
  if (providerCode === 1002 || providerCode === 2056 || response.status === 429) return 'provider_rate_limited';
  if (providerCode === 1004 || providerCode === 2049 || response.status === 401 || response.status === 403) return 'provider_auth_error';
  if (providerCode === 1024 || providerCode === 1033 || response.status >= 500) return 'provider_unavailable';
  return 'provider_rejected';
}

function parseProviderOutput(value) {
  if (typeof value !== 'string') return null;
  const candidates = [value.trim()];
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1]?.trim();
  if (fenced) candidates.push(fenced);
  const start = value.indexOf('{');
  const end = value.lastIndexOf('}');
  if (start >= 0 && end > start) candidates.push(value.slice(start, end + 1).trim());
  for (const candidate of [...new Set(candidates)]) {
    let parsed;
    try { parsed = JSON.parse(candidate); } catch { continue; }
    if (
      typeof parsed.needs_human !== 'boolean' ||
      !PRIORITIES.has(parsed.priority) ||
      !CATEGORIES.has(parsed.category) ||
      typeof parsed.summary !== 'string' ||
      typeof parsed.suggested_reply !== 'string' ||
      parsed.summary.length > 500 ||
      parsed.suggested_reply.length > 1200
    ) continue;
    return parsed;
  }
  return null;
}

// Server-only OpenAI-compatible provider configuration. MiniMax M3 is the
// production target; unsupported provider-specific fields must never be sent.
export async function triageInquiry(
  { business, leak },
  {
    apiKey = process.env.AI_API_KEY,
    model = process.env.AI_MODEL || 'MiniMax-M3',
    baseUrl = process.env.AI_API_BASE || 'https://api.minimax.io/v1',
    fetchImpl = fetch,
    timeoutMs = Number(process.env.AI_TRIAGE_TIMEOUT_MS || 15000)
  } = {}
) {
  if (!apiKey) return { ...FALLBACK };

  const provider = providerName(baseUrl, model);
  const endpoint = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Triage an IronWake business leak inquiry. Handle routine questions, but set needs_human true for urgent, sensitive, legal, payment, angry, ambiguous, or high-value cases. Never invent facts, prices, guarantees, or outcomes. Respond with exactly one JSON object and no markdown: {"needs_human":boolean,"priority":"low|normal|high|urgent","category":"inquiry|booking|follow_up|reception|other","summary":string,"suggested_reply":string}.'
          },
          { role: 'user', content: JSON.stringify({ business, leak }) }
        ],
        reasoning_split: true,
        max_completion_tokens: 500,
        temperature: 0.1
      })
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data || (Number(data?.base_resp?.status_code) !== 0 && data?.base_resp?.status_code !== undefined)) {
      return providerFailure({ provider, model, safeErrorCode: responseFailureCode(response, data), summary: 'AI triage could not be completed.' });
    }
    const content = data.choices?.[0]?.message?.content;
    const parsed = parseProviderOutput(content);
    if (!parsed) return providerFailure({ provider, model, safeErrorCode: 'invalid_output', summary: 'AI triage returned an invalid result.' });
    return { status: 'complete', provider, model, safe_error_code: null, ...parsed };
  } catch (error) {
    return providerFailure({ provider, model, safeErrorCode: error?.name === 'AbortError' ? 'provider_timeout' : 'provider_network_error', summary: 'AI triage could not be completed.' });
  } finally {
    clearTimeout(timeout);
  }
}
