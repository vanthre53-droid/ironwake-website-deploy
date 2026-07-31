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

function parseProviderOutput(value) {
  if (typeof value !== 'string') return null;
  try {
    const parsed = JSON.parse(value);
    if (
      typeof parsed.needs_human !== 'boolean' ||
      !PRIORITIES.has(parsed.priority) ||
      !CATEGORIES.has(parsed.category) ||
      typeof parsed.summary !== 'string' ||
      typeof parsed.suggested_reply !== 'string' ||
      parsed.summary.length > 500 ||
      parsed.suggested_reply.length > 1200
    ) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function triageInquiry(
  { business, leak },
  {
    apiKey = process.env.OPENAI_API_KEY,
    model = process.env.OPENAI_MODEL || 'gpt-4o-mini',
    fetchImpl = fetch,
    timeoutMs = 8000
  } = {}
) {
  if (!apiKey) return { ...FALLBACK };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        input: [
          {
            role: 'system',
            content: 'Triage an IronWake business leak inquiry. Handle routine questions, but set needs_human true for urgent, sensitive, legal, payment, angry, ambiguous, or high-value cases. Never invent facts, prices, guarantees, or outcomes. Return only the requested JSON schema.'
          },
          { role: 'user', content: JSON.stringify({ business, leak }) }
        ],
        text: { format: { type: 'json_schema', name: 'ironwake_triage', strict: true, schema: TRIAGE_SCHEMA } }
      })
    });
    if (!response.ok) return { ...FALLBACK, status: 'provider_error', summary: 'AI triage could not be completed.' };
    const data = await response.json();
    const parsed = parseProviderOutput(data.output_text);
    if (!parsed) return { ...FALLBACK, status: 'provider_error', summary: 'AI triage returned an invalid result.' };
    return { status: 'complete', ...parsed };
  } catch {
    return { ...FALLBACK, status: 'provider_error', summary: 'AI triage could not be completed.' };
  } finally {
    clearTimeout(timeout);
  }
}
