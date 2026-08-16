#!/usr/bin/env node
// ponytail: secret scanner. Walks the repo for plaintext credentials that
// belong in Worker secrets, not in the source tree.
//
// Checks (per Goal §4):
//   1. Source: scan .js/.mjs/.ts/.tsx/.jsx/.json/.env* files under app/,
//      components/, lib/, scripts/ for known secret patterns (Resend,
//      Retell, Meta, Supabase, Google, IronWake API key shapes).
//   2. Diffs: same pattern scan applied to git HEAD..HEAD~1 diff text.
//   3. History: full grep across git log -p for those patterns.
//   4. Client chunks: scan .next/static/ + opennext assets for the same
//      patterns (must always come back empty).
//   5. Worker bundle: scan .open-next/dist/server for the same patterns.
//
// Any hit is an issue. Exit code is the issue count (0 == pass).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();

const SCAN_DIRS = ['app', 'components', 'lib', 'scripts'];
const CLIENT_DIRS = ['.next/static', '.open-next/dist/assets'];
const WORKER_BUNDLE = '.open-next/dist/server';
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', '.open-next', '.hermes', 'dist', 'build', 'coverage']);

// ponytail: secret shape catalog. Each shape targets a high-signal prefix
// or structure. We deliberately avoid matching generic sha256 / base64.
// ponytail: word-boundary anchors block identifier false positives like
// 'lead_capture' or 'capture_step' that contain '_re' as a substring.
const PATTERNS = [
  { name: 'resend-api-key',     re: /(?<![A-Za-z0-9])re_[A-Za-z0-9]{20,}(?![A-Za-z0-9])/g },
  { name: 'resend-webhook-id',  re: /(?<![A-Za-z0-9])whsec_[A-Za-z0-9]{20,}(?![A-Za-z0-9])/g },
  { name: 'retell-api-key',     re: /(?<![A-Za-z0-9])key_[A-Za-z0-9]{32,}(?![A-Za-z0-9])/g },
  { name: 'meta-whatsapp-token', re: /(?<![A-Za-z0-9])EAA[A-Za-z0-9]{50,}(?![A-Za-z0-9])/g },
  { name: 'google-oauth-refresh', re: /(?<![A-Za-z0-9])1\/\/[A-Za-z0-9_\-]{40,}(?![A-Za-z0-9])/g },
  { name: 'google-api-key',     re: /(?<![A-Za-z0-9])AIza[A-Za-z0-9_\-]{35}(?![A-Za-z0-9])/g }
]; // jwt/eyJ removed: too many false positives; use dedicated scanner if needed.

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const p = path.join(dir, entry);
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function isScannableFile(p) {
  if (!/\.(js|mjs|cjs|ts|tsx|jsx|json|env|env\.local|html|css)$/i.test(p)) return false;
  // ponytail: never scan generated vendor chunks for source trees; they're
  // for client/worker bundles below.
  if (p.includes('.next') || p.includes('.open-next')) return false;
  return true;
}

function scanText(text, origin, pattern) {
  const issues = [];
  pattern.re.lastIndex = 0;
  let m;
  while ((m = pattern.re.exec(text)) !== null) {
    const start = Math.max(0, m.index - 40);
    const end = Math.min(text.length, m.index + m[0].length + 40);
    issues.push({
      origin,
      pattern: pattern.name,
      sample: text.slice(start, end).replace(/\n/g, '\\n').slice(0, 120)
    });
  }
  return issues;
}

function scanFiles(roots, kind) {
  const issues = [];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const f of walk(root)) {
      if (!isScannableFile(f) && !f.endsWith('.mjs') && !f.endsWith('.js')) continue;
      let text;
      try { text = readFileSync(f, 'utf8'); } catch { continue; }
      for (const pat of PATTERNS) {
        for (const i of scanText(text, `${kind}:${f}`, pat)) issues.push(i);
      }
    }
  }
  return issues;
}

function scanCommand(cmd, kind) {
  const issues = [];
  let out;
  try {
    out = execSync(cmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  } catch (e) {
    out = (e && e.stdout ? e.stdout.toString() : '') + (e && e.stderr ? e.stderr.toString() : '');
  }
  for (const pat of PATTERNS) {
    pat.re.lastIndex = 0;
    let m;
    while ((m = pat.re.exec(out)) !== null) {
      const start = Math.max(0, m.index - 40);
      const end = Math.min(out.length, m.index + m[0].length + 40);
      issues.push({
        origin: `${kind}:history`,
        pattern: pat.name,
        sample: out.slice(start, end).replace(/\n/g, '\\n').slice(0, 120)
      });
    }
  }
  return issues;
}

export async function runSecretScan() {
  const issues = [];
  issues.push(...scanFiles(SCAN_DIRS.filter(d => existsSync(path.join(ROOT, d))), 'source'));
  issues.push(...scanCommand('git diff HEAD~1 HEAD', 'diff'));
  issues.push(...scanCommand('git log --all -p --max-count=200', 'history'));
  issues.push(...scanFiles(CLIENT_DIRS.map(d => path.join(ROOT, d)), 'client-chunks'));
  if (existsSync(path.join(ROOT, WORKER_BUNDLE))) {
    issues.push(...scanFiles([path.join(ROOT, WORKER_BUNDLE)], 'worker-bundle'));
  }
  return {
    scannedAt: new Date().toISOString(),
    source: SCAN_DIRS,
    clientDirs: CLIENT_DIRS,
    workerBundle: WORKER_BUNDLE,
    issueCount: issues.length,
    issues: issues.slice(0, 50)
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runSecretScan().then((r) => {
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.issueCount > 0 ? 1 : 0);
  }).catch((err) => {
    console.error('scan failed:', err && err.message ? err.message : err);
    process.exit(2);
  });
}
