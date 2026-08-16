// ponytail: build audit. Verifies:
//   1. .next/ artifacts exist (npm run build emitted them)
//   2. .open-next/worker.js + server-functions exist (npm run build:worker emitted them)
//   3. measures uncompressed bundle size; references the post-wrangler
//      gzip size as owner-gated (Workers Paid upgrade per cycle 21).
import { existsSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/mnt/c/Users/vanth/Downloads/ironwake';
const issues = [];

function totalSize(dir, acc = 0) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) acc = totalSize(p, acc);
    else if (e.isFile()) {
      try { acc += statSync(p).size; } catch {}
    }
  }
  return acc;
}

// 1. .next artifacts (built earlier in this session)
const nextDir = join(ROOT, '.next');
if (!existsSync(nextDir)) issues.push({ kind: 'next-build-no-artifacts' });

// 2. .open-next worker bundle + server-functions (built earlier in this session)
const workerBundle = join(ROOT, '.open-next/worker.js');
const serverFn = join(ROOT, '.open-next/server-functions/default');
if (!existsSync(workerBundle)) issues.push({ kind: 'worker-bundle-missing' });
if (!existsSync(serverFn)) issues.push({ kind: 'server-functions-missing' });

// 3. measure sizes
const workerBytes = existsSync(workerBundle) ? statSync(workerBundle).size : 0;
const serverFnBytes = existsSync(serverFn) ? totalSize(serverFn) : 0;
const totalBytes = workerBytes + serverFnBytes;

const summary = {
  scannedAt: new Date().toISOString(),
  workerBytes,
  serverFunctionsBytes: serverFnBytes,
  totalBytes,
  workerKiB: Math.round(workerBytes / 1024),
  serverFnMiB: Math.round(serverFnBytes / 1024 / 1024),
  totalMiB: Math.round(totalBytes / 1024 / 1024),
  // ponytail: gzip-compressed Cloudflare Worker bundle size is produced
  // at deploy time by wrangler and requires the Workers Paid upgrade
  // (recorded as unresolved predeployment financial gate per cycle 21).
  note: 'gzip post-wrangler bundle measurement deferred to wrangler deploy (Workers Paid gate)',
  issueCount: issues.length,
  issues,
};
console.log(JSON.stringify(summary, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
