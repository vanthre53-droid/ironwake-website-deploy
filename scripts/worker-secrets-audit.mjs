// ponytail: R011 audit. Verifies the production Worker has the required
// secrets by name only (no values), per AGENTS.md secret rule.
//
// Required IronWake production secrets:
//   - Voice: RETELL_API_KEY, RETELL_WEBHOOK_API_KEY, RETELL_AGENT_ID
//   - Email: RESEND_API_KEY, RESEND_WEBHOOK_SIGNING_SECRET, RESEND_FROM_EMAIL
//   - Meta:  META_APP_ID, META_APP_SECRET, META_WA_VERIFY_TOKEN, META_WA_PHONE_NUMBER_ID
//   - Data:  SUPABASE_SERVICE_ROLE_KEY
//   - Ops:   INDEXNOW_KEY, EMAIL_FROM, EMAIL_NOTIFICATION_RECIPIENT, EMAIL_PROVIDER,
//            AI_API_KEY, AI_API_BASE, AI_MODEL, NEXT_PUBLIC_SITE_URL
//
// Usage: `node scripts/worker-secrets-audit.mjs`
// Exits 0 when all required secrets are present; 1 otherwise.

import { spawnSync } from 'node:child_process';

const REQUIRED = [
  'RETELL_API_KEY',
  'RETELL_WEBHOOK_API_KEY',
  'RETELL_AGENT_ID',
  'RESEND_API_KEY',
  'RESEND_WEBHOOK_SIGNING_SECRET',
  'RESEND_FROM_EMAIL',
  'META_APP_ID',
  'META_APP_SECRET',
  'META_WA_VERIFY_TOKEN',
  'META_WA_PHONE_NUMBER_ID',
  'SUPABASE_SERVICE_ROLE_KEY',
  'INDEXNOW_KEY',
  'EMAIL_FROM',
  'EMAIL_NOTIFICATION_RECIPIENT',
  'EMAIL_PROVIDER',
  'AI_API_KEY',
  'AI_API_BASE',
  'AI_MODEL',
  'NEXT_PUBLIC_SITE_URL',
];

const result = spawnSync('npx', ['wrangler', 'secret', 'list'], {
  encoding: 'utf8',
  maxBuffer: 8 * 1024 * 1024,
});
if (result.status !== 0) {
  console.error('wrangler secret list failed:', result.stderr || result.stdout);
  process.exit(2);
}

let present;
try {
  present = new Set(JSON.parse(result.stdout).map((s) => s.name));
} catch (err) {
  console.error('Failed to parse wrangler secret list:', err.message);
  process.exit(2);
}

const missing = REQUIRED.filter((k) => !present.has(k));
const issues = [];

if (missing.length > 0) {
  issues.push(`Missing required secrets: ${missing.join(', ')}`);
}

const report = {
  scannedAt: new Date().toISOString(),
  presentCount: present.size,
  requiredCount: REQUIRED.length,
  missingCount: missing.length,
  missing: missing,
  issues,
};
console.log(JSON.stringify(report, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
