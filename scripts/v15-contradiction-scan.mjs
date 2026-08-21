// scripts/v15-contradiction-scan.mjs
//
// V15 §82 contradiction scanner — scans every public source file and outputs
// a machine-readable contradiction ledger. NOT part of the production bundle.
// Run: node scripts/v15-contradiction-scan.mjs

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const out = {
  scanned: 0,
  exactPhraseHits: [],
  semanticRisks: [],
  capabilityDenials: [],
  hostnameLeaks: [],
  brandRenameRisks: [],
  demoStatusIssues: [],
  pricingStaleness: [],
  evidenceRouteDrift: [],
  date: new Date().toISOString(),
};

// ---------------- banned phrases / patterns ----------------
// Per V15 §82: detect standalone "systems" use, consultancy-only framing,
// "backend only", "no fixed timeline" used as a global restriction, custom
// scoped misread as unavailable, etc.

const EXACT_PHRASES = [
  'founder-led systems practice',
  'systems practice for service businesses',
  'smallest useful system',
  'smallest system that closes',
  'maps operational systems',
  'written boundary, not a redesign',
  'reviewed request rather than a confirmed slot',
  'separately scoped client build',
  'separately scoped provider deployment',
  'produces a written boundary',
  'produces a written boundary or summary',
  'does not design, build, or sell custom websites',
  'does not design, build, or sell',
  'no fixed timeline',
  'no fixed timeline, price',
  'backend only',
  'not turnkey',
  'consultancy only',
  'is only a founder-led consultancy',
  'is only a founder-led',
];

const CAPABILITY_DENIAL_REGEX = [
  /\bIronWake\s+(does\s+not|will\s+not|cannot|doesn['']t)\s+(design|build|code|deploy|integrate|write|maintain|provide|support|own|host|configure|set\s+up|implement|deliver)/i,
  /\b(IronWake|the\s+company)\s+is\s+(just|only|merely)\s+a\s+(consultancy|practice|system\s+architect|workflow\s+mapper|advisor|founder-led)/i,
  /\bIronWake\s+would\s+(outsource|delegate\s+implementation|add\s+a\s+middleman)/i,
  /\bthe\s+live\s+site\s+is\s+only\s+a?\s*capability\s+demo/i,
  /\b(IronWake|the\s+company)\s+produces\s+(a\s+written\s+boundary|a\s+summary),?\s*not\s+a\s+(redesign|design|build|custom\s+platform)/i,
  /\bseparately\s+scoped[\s\w]*\s+(means|means?\s+unavailable|means?\s+that\s+IronWake)/i,
];

const BRAND_RENAME_REGEX = [
  /\bIronWake\s+Systems\b(?!\s*Practice\b|\s+feature|\s+page|\s+title|\s+alternate|\s+alias|\s+historic)/i,
  /\bIronwake\s+Inc\b/i,
  /\bIronWake\s+inc\b/,
];

const DEMO_STATUS_PATTERNS = [
  /\bcapability\s+demo(?:nation)?\s+only\b/i,
  /\bpre-launch\b/i,
  /\bpractice\s+only\b/i,
];

const PRICING_STALENESS = [
  // Stale ₹799 / $29 must NOT appear as the entire offer outside of Business Leak Audit
  // (the live offer tier list is 5 offers × 3 tiers).
  { pattern: /\b₹799\b/, label: 'stale ₹799 Lite signal outside pricing.mjs' },
  { pattern: /\$29\b/, label: 'stale $29 Lite signal outside pricing.mjs' },
];

const BANNED_HOSTS = ['localhost', '127.0.0.1', 'netlify.app', 'workers.dev'];

// ---------------- file walk ----------------

function walk(dir, depth = 0, maxDepth = 4) {
  const out = [];
  if (depth > maxDepth) return out;
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    // Skip well-known build/cache/hidden dirs
    if (name === 'node_modules' || name === '.git' || name === '.next' || name === 'dist' || name === '.netlify' || name === '.open-next' || name === '.wrangler' || name === '.cache' || name === '.ironwake' || name === '.claude' || name === '.claude-flow' || name === '.hermes' || name === '.mimocode' || name === '.opencode' || name === '.qa-screenshots' || name === '.v13' || name === '.worktrees' || name === '.qa' || name === 'coverage' || name === 'out' || name === 'build' || name === 'ironwakeportifolioprojects' || name === 'ironwake-portfolio-projects') continue;
    // Skip literal Windows-style path directories leaked into WSL
    // (e.g. C:\Users\...\lighthouse.XXXXX) and anything with backslashes
    if (name.includes('\\') || /^[A-Z]:/.test(name)) continue;
    const p = join(dir, name);
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) {
      out.push(...walk(p, depth + 1, maxDepth));
    } else if (s.isFile()) {
      if (s.size > 256 * 1024) continue;
      out.push(p);
    }
  }
  return out;
}

// quick debug (stderr only, won't pollute JSON)
process.stderr.write(`[scan] starting walk from ${ROOT}\n`);
const t0 = Date.now();
const allFiles = walk(ROOT);
process.stderr.write(`[scan] walked ${allFiles.length} files in ${Date.now() - t0}ms\n`);

function isCodeOrCopy(path) {
  return /\.(js|mjs|jsx|ts|tsx|md|mdx|txt|json|html|yaml|yml)$/i.test(path);
}

function isInsidePublicSignal(path) {
  // Customer-facing surface files (routes, components, copy, lib).
  // Skip test files (their forbidden-phrase assertions are not contradictions)
  // and skip internal checkpoints / audit / archive.
  const rel = path.replace(/\\/g, '/');
  if (/\.(test|spec)\.[a-z]+$/i.test(rel)) return false;
  if (/\/audits\//.test(rel) || rel.startsWith('audits/')) return false;
  if (/\/\.ironwake\//.test(rel) || rel.startsWith('.ironwake/')) return false;
  if (/\/\.git\//.test(rel) || rel.startsWith('.git/')) return false;
  if (/\/node_modules\//.test(rel) || rel.startsWith('node_modules/')) return false;
  if (/\/\.next\//.test(rel) || rel.startsWith('.next/')) return false;
  if (/\/coverage\//.test(rel) || rel.startsWith('coverage/')) return false;
  return (
    path.includes('app/') ||
    path.includes('public/') ||
    path.includes('lib/') ||
    path.includes('content/') ||
    path.includes('scripts/') ||
    path.endsWith('.md')
  );
}

function recordHit(arr, file, phrase, line) {
  arr.push({ file: relative(ROOT, file), phrase, line });
}

function findLineNumber(text, idx) {
  return text.slice(0, idx).split('\n').length;
}

// ---------------- main ----------------

const files = walk(ROOT).filter((f) => isCodeOrCopy(f) && isInsidePublicSignal(f));
console.error(`[scan] scanning ${files.length} files`);

// Self-exclusion: the scanner owns its pattern strings and quoting them in
// the source produces only self-matches. canonical-entity.mjs is the
// truth-record for OFFERED_NOW evidence routes — those are still scanned
// for evidenceRouteDrift (the §88 gate); only its price-docstrings are
// exempt from the §89 pricing-staleness check below.
// Paths from walk() are absolute, so match by suffix.
const SELF_EXCLUDE_SUFFIX = ['/scripts/v15-contradiction-scan.mjs'];
function isSelfExcluded(file) {
  return SELF_EXCLUDE_SUFFIX.some((s) => file.endsWith(s));
}

for (const file of files) {
  if (isSelfExcluded(file)) continue;
  out.scanned += 1;
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  for (const phrase of EXACT_PHRASES) {
    let from = 0;
    while (true) {
      const idx = text.indexOf(phrase, from);
      if (idx === -1) break;
      recordHit(out.exactPhraseHits, file, phrase, findLineNumber(text, idx));
      from = idx + phrase.length;
    }
  }

  for (const re of CAPABILITY_DENIAL_REGEX) {
    const m = text.match(re);
    if (!m) continue;
    // Skip false positives where the line is a §119 safe-restatement
    // dictionary entry (e.g. 'phrase → safe restatement'), a comment, or
    // a public meta-disclosure that names the denial AND corrects it.
    const lineStart = text.lastIndexOf('\n', m.index) + 1;
    const lineEnd = text.indexOf('\n', m.index);
    const rawLine = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    const line = rawLine.toLowerCase();
    const isSafeRestatement = /\b(safe\s*restatement|safe_restatement|restate|→\s*[A-Z])/.test(line)
      || rawLine.trimStart().startsWith('//')
      || rawLine.trimStart().startsWith('*')
      || rawLine.trimStart().startsWith('-')
      || /(means\s+that\s+ironwake\s+(can|will|does|designs|builds))/.test(line)
      || /it does( not|n't)? mean\s+(ironwake\s+)?(can'?t|cannot|does\s+not|doesn'?t)\s+(build|design|code|deploy|integrate|implement|deliver)/.test(line)
      || /does( not|n't)? mean\s+(that\s+)?(ironwake\s+)?(can'?t|cannot|does\s+not|doesn'?t)/.test(line);
    if (isSafeRestatement) continue;
    recordHit(out.capabilityDenials, file, m[0], findLineNumber(text, m.index ?? 0));
  }

  for (const re of BRAND_RENAME_REGEX) {
    const m = text.match(re);
    if (m) recordHit(out.brandRenameRisks, file, m[0], findLineNumber(text, m.index ?? 0));
  }

  for (const re of DEMO_STATUS_PATTERNS) {
    const m = text.match(re);
    if (m) recordHit(out.demoStatusIssues, file, m[0], findLineNumber(text, m.index ?? 0));
  }

  for (const { pattern, label } of PRICING_STALENESS) {
    const m = text.match(pattern);
    if (
      m &&
      !file.includes('lib/pricing.mjs') &&
      !file.includes('pricing-truth') &&
      !file.includes('lib/canonical-entity.mjs')
    ) {
      recordHit(out.pricingStaleness, file, label, findLineNumber(text, m.index ?? 0));
    }
  }

  for (const host of BANNED_HOSTS) {
    const re = new RegExp(`\\b${host.replace('.', '\\.')}\\b`, 'i');
    const m = text.match(re);
    if (!m) continue;
    // Skip the match if the line containing it is itself an explicit denial
    // or disclosure (V15 §119) — e.g. "No localhost, netlify.app, ... in
    // production". Such lines are intentional public meta-statements, not
    // leaks. We treat a line as denial-style if it begins with negation
    // words or contains "appear in production"/"do not appear"/"must not".
    const lineStart = text.lastIndexOf('\n', m.index) + 1;
    const lineEnd = text.indexOf('\n', m.index);
    const line = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).toLowerCase();
    const isDenial = /^\s*(\*|-|\/\/)\s*(no |no\b|do not|never|must not|forbidden)/i.test(text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd))
      || /(do(es)? not|never|must not) appear/.test(line)
      || /no\s+(localhost|netlify\.app|workers\.dev|vercel\.app)/.test(line);
    if (isDenial) continue;
    recordHit(out.hostnameLeaks, file, host, findLineNumber(text, m.index ?? 0));
  }
}

// V15 §88 + §122: every OFFERED_NOW capability.evidenceRoutes entry must
// resolve to a real route on disk, otherwise schema/sitemap/internal-link
// consumers will 404 on the proof anchor. Cross-checked against the same
// canonical-entity source the production gate (lib/contradiction-gate.test.mjs)
// enforces.
import('../lib/canonical-entity.mjs').then(async (entityMod) => {
  for (const cap of entityMod.OFFERED_NOW_MATRIX || []) {
    for (const route of cap.evidenceRoutes || []) {
      if (!existsSync(join(ROOT, 'app', route))) {
        out.evidenceRouteDrift.push({ capability: cap.capability, route });
      }
    }
  }
  const json = JSON.stringify(out, null, 2);
  // Optional file sink (used by companion tests; avoids any chance of
  // test-runner stdout interleaving). The scanner writes progress probes
  // to stderr so the stdout below is the canonical sink.
  const sinkPath = process.env.V15_SCAN_OUT_FILE;
  if (sinkPath) {
    try {
      const { writeFileSync } = await import('node:fs');
      writeFileSync(sinkPath, json + '\n');
    } catch (e) {
      process.stderr.write(`[scan] sink write failed: ${e.message}\n`);
    }
  }
  process.stdout.write(json + '\n');
  process.exit(0);
});
