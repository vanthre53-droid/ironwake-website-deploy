// ponytail: shell test for scripts/seo-tech-audit.mjs.
// Runs the audit and asserts exit code 0 + at least one JSON-LD pass on a sample page.
//
// Exit codes:
//   0 → audit ran clean (or only non-blocking warnings)
//   1 → audit found failures
//   2 → this test harness detected something wrong (e.g. audit threw or
//       stdout was empty)

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, access } from 'node:fs/promises';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const auditPath = path.join(ROOT, 'scripts/seo-tech-audit.mjs');

await access(auditPath);

const proc = spawnSync('node', [auditPath], { encoding: 'utf8' });
if (proc.status !== 0 && proc.status !== 1) {
  console.error('audit process failed:', proc.stderr);
  console.error('stdout:', proc.stdout);
  process.exit(2);
}

let report;
try {
  report = JSON.parse(proc.stdout);
} catch (e) {
  console.error('audit emitted non-JSON stdout:', proc.stdout.slice(0, 200));
  process.exit(2);
}

if (report.failures && report.failures.length > 0) {
  console.error(`seo-tech-audit reported ${report.failures.length} failures:`);
  for (const f of report.failures) console.error(`  - [${f.check}] ${f.detail}`);
  process.exit(1);
}

if (report.publicPagesAudited < 5) {
  console.error(`suspect: only ${report.publicPagesAudited} public pages audited, expected >5`);
  process.exit(2);
}

if (!report.passes.some((p) => p.check === 'jsonld-organization')) {
  console.error('audit reported no Organization JSON-LD passes');
  process.exit(2);
}

console.log(`seo-tech-audit.test: OK — ${report.passes.length} passes, ${report.warnings.length} warnings, ${report.failures.length} failures across ${report.publicPagesAudited} public pages`);
