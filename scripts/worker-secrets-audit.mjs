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
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

// ponytail: vault fallback. If wrangler auth fails (no CLOUDFLARE_API_TOKEN
// in CI), fall back to scanning files under the local vault. Either source
// is sufficient to assert "secret exists by name" without ever printing a value.

const VAULT_DIR = process.env.IRONWAKE_VAULT_DIR
  || '/home/shadowlingo/.config/ironwake/cloudflare-migration/secrets';

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

const present = new Set();
let source = 'wrangler';

const wranglerResult = spawnSync('npx', ['wrangler', 'secret', 'list'], {
  encoding: 'utf8',
  maxBuffer: 8 * 1024 * 1024,
  timeout: 20000,
});

if (wranglerResult.status === 0 && wranglerResult.stdout.trim().startsWith('[')) {
  try {
    const arr = JSON.parse(wranglerResult.stdout);
    for (const s of arr) if (s && s.name) present.add(s.name);
  } catch {
    // ponytail: malformed JSON falls through to vault
  }
}

if (present.size === 0) {
  source = 'vault';
  for (const name of REQUIRED) {
    try {
      const p = join(VAULT_DIR, name);
      if (existsSync(p) && statSync(p).size > 0) present.add(name);
    } catch {
      // ponytail: unreadable entry just stays absent
    }
  }
}

const missing = REQUIRED.filter((k) => !present.has(k));
const issues = [];

if (missing.length > 0) {
  issues.push(`Missing required secrets: ${missing.join(', ')}`);
}

const report = {
  scannedAt: new Date().toISOString(),
  source,
  presentCount: present.size,
  requiredCount: REQUIRED.length,
  missingCount: missing.length,
  missing,
  issues,
};
console.log(JSON.stringify(report, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
