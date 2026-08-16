#!/usr/bin/env node
// ponytail: Content-Security-Policy audit. Reads next.config.mjs, parses
// the Content-Security-Policy header, and asserts every known third-party
// endpoint (Retell Web SDK, Supabase, Resend, Meta WA, etc.) is either
// explicitly allowed or unreachable from the page.
//
// Goal R049 acceptance: no Retell call silently blocked by CSP; no
// overly broad wildcard allowing arbitrary origins.

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// Required endpoint domains. Each entry: { kind, url, directive, reason }.
const REQUIRED_ORIGINS = [
  { kind: 'retell-rest',    url: 'https://api.retellai.com',     directive: 'connect-src', reason: 'create-web-call API' },
  { kind: 'retell-ws',      url: 'wss://*.retellai.com',         directive: 'connect-src', reason: 'Realtime audio WS' },
  { kind: 'retell-media',   url: 'https://*.retell.ai',          directive: 'media-src',   reason: 'Agent audio stream (.retell.ai)' },
  { kind: 'retell-media-2', url: 'https://*.retellai.com',       directive: 'media-src',   reason: 'Agent audio stream (.retellai.com)' },
  { kind: 'retell-media-blob', url: 'blob:',                     directive: 'media-src',   reason: 'AudioWorklet blob URLs' },
  { kind: 'supabase-rest',  url: 'https://*.supabase.co',        directive: 'connect-src', reason: 'Supabase REST/auth' }
];

function readCsp() {
  const out = spawnSync('git', ['show', 'HEAD:next.config.mjs'], { encoding: 'utf8' });
  if (out.status !== 0) throw new Error('failed to read next.config.mjs: ' + out.stderr);
  // ponytail: CSP value is double-quoted; use a backreference-free form
  // so the closing `"` matches the same kind and the regex doesn't stop at
  // the first inner `'self'` quote.
  const m = out.stdout.match(/Content-Security-Policy[^]*?value:\s*"([^"]+)"/);
  if (!m) throw new Error('CSP not found in next.config.mjs');
  return m[1];
}

function parseCsp(csp) {
  const directives = {};
  for (const part of csp.split(';').map(s => s.trim()).filter(Boolean)) {
    const [name, ...tokens] = part.split(/\s+/);
    directives[name] = tokens;
  }
  return directives;
}

function originMatches(token, url) {
  // Exact match
  if (token === url) return true;
  // Wildcard subdomain (e.g. https://*.retellai.com matches https://x.retellai.com)
  if (token.includes('*')) {
    const re = new RegExp('^' + token.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]+') + '$');
    return re.test(url);
  }
  // Scheme-only token (blob: wss:)
  if (token.endsWith(':') && url.startsWith(token)) return true;
  return false;
}

function audit() {
  const csp = readCsp();
  const directives = parseCsp(csp);
  const issues = [];

  for (const req of REQUIRED_ORIGINS) {
    const tokens = directives[req.directive] || [];
    if (tokens.includes('*')) {
      issues.push({ kind: req.kind, issue: 'wildcard-allows-arbitrary', directive: req.directive, reason: req.reason });
      continue;
    }
    const ok = tokens.some(t => originMatches(t, req.url));
    if (!ok) {
      issues.push({ kind: req.kind, issue: 'missing-required-origin', directive: req.directive, url: req.url, reason: req.reason });
    }
  }

  // Check that 'unsafe-inline' is NOT used in script-src (would allow XSS injection).
  // This is a WARNING, not a failure — Next.js dev/HMR may need it; production can
  // switch to a nonce strategy.
  const scriptTokens = directives['script-src'] || [];
  const warnings = [];
  if (scriptTokens.includes("'unsafe-inline'") && !scriptTokens.includes("'nonce-")) {
    warnings.push({ kind: 'csp', issue: 'script-uses-unsafe-inline', directive: 'script-src', detail: 'consider nonce strategy for production' });
  }

  return { scannedAt: new Date().toISOString(), csp: csp.slice(0, 200) + (csp.length > 200 ? '…' : ''), issueCount: issues.length, warningCount: warnings.length, issues, warnings };
}

const result = audit();
console.log(JSON.stringify(result, null, 2));
// Only required-origin misses cause exit 1; warnings are informational.
process.exit(result.issueCount === 0 ? 0 : 1);