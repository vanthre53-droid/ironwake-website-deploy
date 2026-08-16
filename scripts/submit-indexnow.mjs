#!/usr/bin/env node
// ponytail: manual trigger to push current sitemap URLs to IndexNow.
//
// Usage:
//   INDEXNOW_KEY=$(cat ~/.config/ironwake/cloudflare-migration/secrets/INDEXNOW_KEY) \
//   node scripts/submit-indexnow.mjs [--urls url1,url2,...]
//
// Without --urls we read app/sitemap.js by importing it in-process (Node
// loads its on-disk export) — but sitemap.js depends on Next.js globals, so
// the practical path is to run after `next build` and read .next/sitemap.xml
// if present, or to accept URLs on stdin.
import { submitUrlsToIndexNow, urlsFromSitemap } from '../lib/indexnow.mjs';
import fs from 'node:fs';
import path from 'node:path';

function readStdinOrFile(arg) {
  if (!arg) return null;
  if (fs.existsSync(arg)) return fs.readFileSync(arg, 'utf8');
  return arg;
}

const argv = process.argv.slice(2);
let urlsArg = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--urls') urlsArg = argv[i + 1];
  if (argv[i] === '--sitemap') urlsArg = argv[i + 1];
  if (argv[i] === '--stdin') urlsArg = fs.readFileSync(0, 'utf8');
}

let urls;
if (urlsArg) {
  const xml = readStdinOrFile(urlsArg);
  if (xml && xml.includes('<loc>')) urls = urlsFromSitemap(xml);
  else if (xml) urls = xml.split(/[,\s]+/).filter(Boolean);
} else {
  const fallback = path.join(process.cwd(), '.next', 'sitemap.xml');
  if (fs.existsSync(fallback)) urls = urlsFromSitemap(fs.readFileSync(fallback, 'utf8'));
}

if (!urls || urls.length === 0) {
  console.error('no urls supplied — pass --urls or --sitemap <file>');
  process.exit(2);
}

const key = process.env.INDEXNOW_KEY || readIndexNowKeyFallback();
function readIndexNowKeyFallback() {
  const p = '/home/shadowlingo/.config/ironwake/cloudflare-migration/secrets/INDEXNOW_KEY';
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim();
  return null;
}

const result = await submitUrlsToIndexNow(urls, { key });
console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 1);