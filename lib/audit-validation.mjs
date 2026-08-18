import { z } from 'zod';

// ponytail: one intake function covers all public write paths (audit, booking,
// chatbot handoff). The route persists `source` so the owner CRM can
// distinguish request types without separate tables.
const ALLOWED_SOURCES = new Set([
  'website_audit',
  'website_booking',
  'chatbot_handoff'
]);

const ALLOWED_OFFER_IDS = new Set([
  'recovery-retainer',
  'growth-retainer',
  'foundation-build',
  'sprint-fix'
]);

const ALLOWED_TIERS = new Set(['lite', 'standard', 'pro']);

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;

function safeText(min, max) {
  return z.string().trim().min(min).max(max).refine(
    (value) => !CONTROL_CHARACTERS.test(value),
    'Control characters are not allowed.'
  );
}

export const auditSchema = z.object({
  business: safeText(2, 120),
  email: z.string().trim().email().max(254).refine((value) => !CONTROL_CHARACTERS.test(value), 'Control characters are not allowed.'),
  leak: safeText(10, 4000),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(''),
  source: safeText(0, 64).optional().default('website_audit'),
  // ponytail: optional routing signals from /pricing tier rows. The server
  // never trusts the client — only values in the allow-list survive.
  offer: z.string().trim().max(64).optional(),
  tier: z.string().trim().max(16).optional()
}).strict().transform((value) => {
  const offer = value.offer && ALLOWED_OFFER_IDS.has(value.offer) ? value.offer : null;
  const tier = value.tier && ALLOWED_TIERS.has(value.tier.toLowerCase()) ? value.tier.toLowerCase() : null;
  return {
    ...value,
    source: ALLOWED_SOURCES.has(value.source) ? value.source : 'website_audit',
    offer,
    tier
  };
});

export function parseAuditPayload(value) {
  return auditSchema.safeParse(value);
}
