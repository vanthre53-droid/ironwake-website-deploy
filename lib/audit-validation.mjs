import { z } from 'zod';

// ponytail: one intake function covers all public write paths (audit, booking,
// chatbot handoff). The route persists `source` so the owner CRM can
// distinguish request types without separate tables.
const ALLOWED_SOURCES = new Set([
  'website_audit',
  'website_booking',
  'chatbot_handoff'
]);

export const auditSchema = z.object({
  business: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  leak: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(''),
  source: z.string().trim().max(64).optional().default('website_audit')
}).strict().transform((value) => ({
  ...value,
  source: ALLOWED_SOURCES.has(value.source) ? value.source : 'website_audit'
}));

export function parseAuditPayload(value) {
  return auditSchema.safeParse(value);
}
