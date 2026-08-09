import { z } from 'zod';

// ponytail: one intake function covers all public write paths (audit, booking,
// chatbot handoff). The route persists `source` so the owner CRM can
// distinguish request types without separate tables.
const ALLOWED_SOURCES = new Set([
  'website_audit',
  'website_booking',
  'chatbot_handoff'
]);

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
  source: safeText(0, 64).optional().default('website_audit')
}).strict().transform((value) => ({
  ...value,
  source: ALLOWED_SOURCES.has(value.source) ? value.source : 'website_audit'
}));

export function parseAuditPayload(value) {
  return auditSchema.safeParse(value);
}
