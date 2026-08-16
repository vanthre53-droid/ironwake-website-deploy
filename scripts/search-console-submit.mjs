#!/usr/bin/env node
// ponytail: one-shot helper that submits the canonical sitemap to Google
// Search Console. Owner-gated: requires GOOGLE_SEARCH_REFRESH_TOKEN +
// GOOGLE_SEARCH_CLIENT_ID + GOOGLE_SEARCH_CLIENT_SECRET in the environment
// (or read from ~/.config/ironwake/cloudflare-migration/secrets/).
//
// Goal §14 / R046 acceptance:
//   - Domain property verified via TXT (already live at apex)
//   - Sitemap submitted + read back (Google fetches it and reports URLs)
//   - No fake calls; unconfigured -> safe error code
//
// Usage:
//   node scripts/search-console-submit.mjs [--dry-run] [--site https://ironwake.dev] [--sitemap https://ironwake.dev/sitemap.xml]
//
// Env (required for live submit):
//   GOOGLE_SEARCH_CLIENT_ID, GOOGLE_SEARCH_CLIENT_SECRET, GOOGLE_SEARCH_REFRESH_TOKEN
//
// On success, prints {ok:true, action:'submit', sitemap:<url>, status:200}.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const VAULT_DIR = path.join(os.homedir(), '.config', 'ironwake', 'cloudflare-migration', 'secrets');
const SCOPES = 'https://www.googleapis.com/auth/webmasters';

function readVaultSecret(name) {
  const p = path.join(VAULT_DIR, name);
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8').trim();
}

function resolveEnv(name) {
  return process.env[name] || process.env[`IRONWAKE_${name}`] || readVaultSecret(name) || null;
}

export function readSearchConsoleConfig(env = process.env) {
  const clientId = env.GOOGLE_SEARCH_CLIENT_ID || readVaultSecret('GOOGLE_SEARCH_CLIENT_ID');
  const clientSecret = env.GOOGLE_SEARCH_CLIENT_SECRET || readVaultSecret('GOOGLE_SEARCH_CLIENT_SECRET');
  const refreshToken = env.GOOGLE_SEARCH_REFRESH_TOKEN || readVaultSecret('GOOGLE_SEARCH_REFRESH_TOKEN');
  return { clientId, clientSecret, refreshToken };
}

export function isSearchConsoleConfigured(config = readSearchConsoleConfig()) {
  return Boolean(config.clientId && config.clientSecret && config.refreshToken);
}

export async function exchangeRefreshToken({ clientId, clientSecret, refreshToken, fetchImpl = globalThis.fetch } = {}) {
  if (!clientId || !clientSecret || !refreshToken) {
    return { ok: false, safeErrorCode: 'search_console_unconfigured' };
  }
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  });
  let response;
  try {
    response = await fetchImpl('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body
    });
  } catch {
    return { ok: false, safeErrorCode: 'search_console_network_unreachable' };
  }
  if (!response.ok) {
    return { ok: false, safeErrorCode: 'search_console_token_exchange_failed', httpStatus: response.status };
  }
  let json;
  try {
    json = await response.json();
  } catch {
    return { ok: false, safeErrorCode: 'search_console_malformed_token_response' };
  }
  if (!json || typeof json.access_token !== 'string' || !json.access_token) {
    return { ok: false, safeErrorCode: 'search_console_malformed_token_response' };
  }
  return { ok: true, accessToken: json.access_token, expiresInSeconds: json.expires_in };
}

export async function submitSitemap({
  siteUrl,
  sitemapUrl,
  accessToken,
  fetchImpl = globalThis.fetch
} = {}) {
  if (!siteUrl || !sitemapUrl || !accessToken) {
    return { ok: false, safeErrorCode: 'search_console_missing_arguments' };
  }
  const url = `https://searchconsole.googleapis.com/v1/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  let response;
  try {
    response = await fetchImpl(url, {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${accessToken}`,
        'content-type': 'application/json'
      },
      body: ''
    });
  } catch {
    return { ok: false, safeErrorCode: 'search_console_network_unreachable' };
  }
  return {
    ok: response.ok,
    safeErrorCode: response.ok ? null : 'search_console_submit_failed',
    httpStatus: response.status
  };
}

export async function readSitemap({ siteUrl, sitemapUrl, accessToken, fetchImpl = globalThis.fetch } = {}) {
  if (!siteUrl || !sitemapUrl || !accessToken) {
    return { ok: false, safeErrorCode: 'search_console_missing_arguments' };
  }
  const url = `https://searchconsole.googleapis.com/v1/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  let response;
  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: { 'authorization': `Bearer ${accessToken}` }
    });
  } catch {
    return { ok: false, safeErrorCode: 'search_console_network_unreachable' };
  }
  if (!response.ok) {
    return { ok: false, safeErrorCode: 'search_console_read_failed', httpStatus: response.status };
  }
  let json;
  try {
    json = await response.json();
  } catch {
    return { ok: false, safeErrorCode: 'search_console_malformed_read_response' };
  }
  return { ok: true, feedpath: json.feedpath, lastSubmitted: json.lastSubmitted, lastDownloaded: json.lastDownloaded, errors: json.errors, warnings: json.warnings, contents: json.contents };
}

export async function submitSitemapToSearchConsole({
  siteUrl = 'https://ironwake.dev',
  sitemapUrl = 'https://ironwake.dev/sitemap.xml',
  config = readSearchConsoleConfig(),
  fetchImpl = globalThis.fetch
} = {}) {
  if (!isSearchConsoleConfigured(config)) {
    return { ok: false, safeErrorCode: 'search_console_unconfigured' };
  }
  const token = await exchangeRefreshToken({ ...config, fetchImpl });
  if (!token.ok) return token;
  const submit = await submitSitemap({ siteUrl, sitemapUrl, accessToken: token.accessToken, fetchImpl });
  if (!submit.ok) return submit;
  const readback = await readSitemap({ siteUrl, sitemapUrl, accessToken: token.accessToken, fetchImpl });
  return {
    ok: readback.ok,
    safeErrorCode: readback.ok ? null : readback.safeErrorCode,
    httpStatus: readback.httpStatus,
    action: 'submit',
    sitemap: sitemapUrl,
    feedpath: readback.feedpath,
    lastSubmitted: readback.lastSubmitted,
    lastDownloaded: readback.lastDownloaded,
    errors: readback.errors,
    warnings: readback.warnings,
    contents: readback.contents
  };
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--site') { args.siteUrl = argv[++i]; }
    else if (a === '--sitemap') { args.sitemapUrl = argv[++i]; }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const config = readSearchConsoleConfig();
  if (!isSearchConsoleConfigured(config)) {
    console.log(JSON.stringify({
      ok: false,
      safeErrorCode: 'search_console_unconfigured',
      message: 'Set GOOGLE_SEARCH_CLIENT_ID + GOOGLE_SEARCH_CLIENT_SECRET + GOOGLE_SEARCH_REFRESH_TOKEN',
      dryRun: Boolean(args.dryRun)
    }, null, 2));
    process.exit(0);
  }
  if (args.dryRun) {
    console.log(JSON.stringify({ ok: true, dryRun: true, configured: true }, null, 2));
    return;
  }
  const result = await submitSitemapToSearchConsole({ siteUrl: args.siteUrl, sitemapUrl: args.sitemapUrl });
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  main().catch((err) => {
    console.error(JSON.stringify({ ok: false, error: err && err.message ? err.message : String(err) }));
    process.exit(2);
  });
}
