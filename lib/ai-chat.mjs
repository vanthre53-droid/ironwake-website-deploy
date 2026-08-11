// ponytail: server-only chat assistant that calls MiniMax-M3 with a grounded
// IronWake knowledge base. No API secret is exposed to the browser bundle.
// Returns a structured result with status: 'complete' | 'unconfigured' |
// 'provider_error'. Caller maps that to a user-facing reply and optional
// handoff guidance. Hot-path aborts after timeoutMs so the serverless route
// never hangs.

import { PRICING_OFFERS } from './pricing.mjs';

const CATEGORIES = new Set(['inquiry', 'booking', 'follow_up', 'reception', 'other']);
const PRIORITIES = new Set(['low', 'normal', 'high', 'urgent']);

const CHAT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    reply: { type: 'string', maxLength: 600 },
    needs_human: { type: 'boolean' },
    handoff: { type: 'boolean' },
    priority: { type: 'string', enum: [...PRIORITIES] },
    category: { type: 'string', enum: [...CATEGORIES] },
    summary: { type: 'string', maxLength: 240 },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] }
  },
  required: ['reply', 'needs_human', 'handoff', 'priority', 'category', 'summary', 'confidence']
};

const FALLBACK_UNCONFIGURED = Object.freeze({
  status: 'unconfigured',
  reply: 'The IronWake assistant is not configured for this deployment yet. Please use the guided options or the Audit form for now.',
  needs_human: true,
  handoff: true,
  priority: 'normal',
  category: 'other',
  summary: 'Assistant unavailable.',
  confidence: 'low'
});

function providerName(baseUrl, model) {
  if (/minimax\.io/i.test(baseUrl) || /^MiniMax-/i.test(model)) return 'minimax';
  return 'unknown';
}

function providerFailure({ provider, model, safeErrorCode, summary }) {
  return {
    ...FALLBACK_UNCONFIGURED,
    status: 'provider_error',
    reply: 'The IronWake assistant hit a temporary provider issue. Try the guided options or open the Audit form.',
    summary,
    provider,
    model,
    safe_error_code: safeErrorCode
  };
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
      typeof parsed.reply !== 'string' ||
      typeof parsed.needs_human !== 'boolean' ||
      typeof parsed.handoff !== 'boolean' ||
      !PRIORITIES.has(parsed.priority) ||
      !CATEGORIES.has(parsed.category) ||
      typeof parsed.summary !== 'string' ||
      typeof parsed.confidence !== 'string' ||
      parsed.reply.length > 600 ||
      parsed.summary.length > 240
    ) continue;
    return parsed;
  }
  return null;
}

function knowledgeBlock() {
  const offerLines = PRICING_OFFERS.map((o) => {
    const liteIndia = o.india[0];
    const liteIntl = o.intl[0];
    return `- ${o.name}: India from ${liteIndia}, International from ${liteIntl}. ${o.description}`;
  }).join('\n');
  return [
    'IronWake is a founder-led agency that builds operational systems for service businesses.',
    'Five published offers, each with three tiers (Lite, Standard, Pro) and separate India/International price schedules:',
    offerLines,
    'Every engagement starts with a Business Leak Audit (Lite/Standard/Pro: ₹799/₹1,499/₹2,999 India; $29/$59/$99 International).',
    'Provider, domain, and usage charges are billed separately from the setup prices.',
    'No automated payment is taken on the website — proposals and contracts are accepted separately.',
    'The chatbot must NOT invent client outcomes, testimonials, ROI figures, years in business, or guaranteed improvements.',
    'If asked something the published knowledge does not cover (legal, tax, refund, custom pricing, urgent or sensitive), set handoff=true and needs_human=true.',
    'Always reply in plain English. Be concise. Prefer outcomes over engineering jargon. Use the customer-facing India/International pricing published above.',
    'Demos on the /work page are capability proofs, not client engagements. The portfolio contains P1 RapidPulse, P3 DentaCare, P10 Atelier and others.',
    'If the visitor wants to share details, point them to /audit (consent checkbox required) or the booking flow at /book.'
  ].join('\n');
}

export function buildChatSystemPrompt() {
  return [
    'You are the IronWake website assistant — a real AI grounded in published IronWake knowledge.',
    knowledgeBlock(),
    'Respond with exactly one JSON object and no markdown, comments, or prose:',
    '{"reply":"<<=600 chars, plain text>","needs_human":<boolean>,"handoff":<boolean>,"priority":"low|normal|high|urgent","category":"inquiry|booking|follow_up|reception|other","summary":"<<=240 chars>","confidence":"high|medium|low"}',
    'Set handoff=true whenever the visitor asks about legal, tax, refund, contract, urgent, sensitive, angry, abusive, or anything the knowledge base does not explicitly cover. Never fabricate facts, prices, or outcomes. Keep the reply helpful and short.'
  ].join('\n\n');
}

export async function chatCompletion(
  messages,
  {
    apiKey = process.env.AI_API_KEY,
    model = process.env.AI_MODEL || 'MiniMax-M3',
    baseUrl = process.env.AI_API_BASE || 'https://api.minimax.io/v1',
    fetchImpl = fetch,
    timeoutMs = Number(process.env.AI_CHAT_TIMEOUT_MS || 12000),
    systemPrompt = buildChatSystemPrompt()
  } = {}
) {
  if (!apiKey) return { ...FALLBACK_UNCONFIGURED };
  if (!Array.isArray(messages) || messages.length === 0) {
    return {
      ...FALLBACK_UNCONFIGURED,
      status: 'invalid_input',
      summary: 'No messages supplied.'
    };
  }

  const provider = providerName(baseUrl, model);
  const endpoint = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const safeMessages = messages
    .filter((m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));

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
          { role: 'system', content: systemPrompt },
          ...safeMessages
        ],
        reasoning_split: true,
        max_completion_tokens: 700,
        temperature: 0.2
      })
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data || (Number(data?.base_resp?.status_code) !== 0 && data?.base_resp?.status_code !== undefined)) {
      return providerFailure({
        provider,
        model,
        safeErrorCode: responseFailureCode(response, data),
        summary: 'Assistant provider returned an error.'
      });
    }
    const content = data.choices?.[0]?.message?.content;
    const parsed = parseProviderOutput(content);
    if (!parsed) {
      return providerFailure({
        provider,
        model,
        safeErrorCode: 'invalid_output',
        summary: 'Assistant provider returned an unparseable result.'
      });
    }
    return { status: 'complete', provider, model, safe_error_code: null, ...parsed };
  } catch (error) {
    return providerFailure({
      provider,
      model,
      safeErrorCode: error?.name === 'AbortError' ? 'provider_timeout' : 'provider_network_error',
      summary: 'Assistant provider request failed.'
    });
  } finally {
    clearTimeout(timeout);
  }
}

export const CHAT_FALLBACK = FALLBACK_UNCONFIGURED;
export const CHAT_SCHEMA_PUBLIC = CHAT_SCHEMA;
