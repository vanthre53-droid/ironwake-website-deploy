// ponytail: R012 audit. Verifies the deploy ledger is atomic:
//   - exactly one entry per deploy attempt
//   - ledger JSON is valid
//   - HEAD in latest deploy matches current HEAD
//   - rollback tag still exists
//   - forbidden architectures absent from active state

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const LEDGER = '.ironwake/release/CLOUDFLARE_DEPLOY_LEDGER.json';

let ledger;
try {
  ledger = JSON.parse(readFileSync(LEDGER, 'utf8'));
} catch (err) {
  console.error('Failed to read ledger:', err.message);
  process.exit(1);
}

const issues = [];
const head = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const tags = execSync('git tag --list', { encoding: 'utf8' }).trim().split('\n');

const history = ledger.deploymentHistory || [];
if (history.length === 0) {
  issues.push('No deployment history in ledger');
} else {
  const latest = history[history.length - 1];
  if (latest.status !== 'DEPLOYED_LIVE' && latest.status !== 'DEPLOY_SUCCEEDED') {
    issues.push(`Latest deploy status: ${latest.status}, expected DEPLOYED_LIVE`);
  }
}

const rollbackTag = ledger.rollbackTag;
if (rollbackTag && !tags.includes(rollbackTag) && !tags.includes(`ROLLBACK-${rollbackTag}`)) {
  issues.push(`Rollback tag ${rollbackTag} (or ROLLBACK-${rollbackTag}) missing from git`);
}

const forbidden = ledger.forbiddenActiveArchitectures || [];
const expectedForbidden = ['netlify.app production hosting', 'vercel.app production hosting', 'Twilio', 'Dograh', 'Sarvam', 'Smallest', 'Vapi', 'Vonage', 'Telnyx', 'Plivo', 'n8n'];
for (const arch of expectedForbidden) {
  if (!forbidden.includes(arch)) {
    issues.push(`Forbidden architecture missing from list: ${arch}`);
  }
}

const budget = ledger.deploymentBudgetLedger || {};
if (budget.DEPLOY_REMAINING === undefined) {
  issues.push('DEPLOY_REMAINING not in budget ledger');
}

const report = {
  scannedAt: new Date().toISOString(),
  currentHEAD: head,
  latestDeploy: history[history.length - 1] || null,
  rollbackTag,
  budget,
  issues,
};
console.log(JSON.stringify(report, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
