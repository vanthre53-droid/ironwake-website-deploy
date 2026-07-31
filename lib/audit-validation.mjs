import { z } from 'zod';

export const auditSchema = z.object({
  business: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  leak: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  website: z.string().max(0).optional().default('')
}).strict();

export function parseAuditPayload(value) {
  return auditSchema.safeParse(value);
}
