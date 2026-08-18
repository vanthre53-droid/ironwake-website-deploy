#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const requireCache = createRequire('/home/shadowlingo/.cache/ironwake-a11y/package.json');
const chromeLauncher = requireCache('chrome-launcher');
const WebSocket = requireCache('ws');

const chromiumBinary = '/home/shadowlingo/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome';
const AXE_SOURCE = readFileSync(resolve(process.cwd(), 'node_modules/axe-core/axe.min.js'), 'utf8');

const chrome = await chromeLauncher.launch({
  chromePath: chromiumBinary,
  chromeFlags: ['--headless=new','--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu'],
});
console.error('chrome launched on port', chrome.port);

const list = await fetch(`http://127.0.0.1:${chrome.port}/json`).then(r => r.json());
console.error('targets:', JSON.stringify(list.map(t => ({id: t.id, type: t.type, url: t.url})), null, 2));

const newTab = await fetch(`http://127.0.0.1:${chrome.port}/json/new`, { method: 'PUT' }).then(r => r.json());
console.error('newTab:', JSON.stringify(newTab));

const ws = new WebSocket(newTab.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.once('open', res); ws.once('error', rej); });

let nextId = 1;
const pending = new Map();
ws.on('message', (raw) => {
  const m = JSON.parse(raw.toString());
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) reject(new Error(m.error.message));
    else resolve(m.result);
  } else if (m.method) {
    console.error('event:', m.method, JSON.stringify(m.params).slice(0, 200));
  }
});

function send(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send('Page.enable');
await send('Runtime.enable');
await send('Page.setBypassCSP', { enabled: true });

console.error('navigating...');
// Inject axe BEFORE page scripts run by attaching it to every new document.
const addScript = await send('Page.addScriptToEvaluateOnNewDocument', {
  source: AXE_SOURCE,
  runImmediately: true,
});
console.error('addScriptToEvaluateOnNewDocument:', addScript);

await send('Page.navigate', { url: 'https://ironwake.netlify.app/' });
await new Promise(r => setTimeout(r, 5000));

const docInfo = await send('Runtime.evaluate', { expression: 'JSON.stringify({ readyState: document.readyState, title: document.title, hasAxe: typeof window.axe !== "undefined", hasRun: typeof window.axe !== "undefined" && typeof window.axe.run === "function", location: location.href })', returnByValue: true });
console.error('doc info:', docInfo.result.value);

const inject = await send('Runtime.evaluate', {
  expression: `${JSON.stringify(AXE_SOURCE)}\n//# sourceURL=axe.min.js\nJSON.stringify({ winAxe: typeof window.axe, bareAxe: (function(){ try { return typeof axe; } catch(e) { return 'threw:'+String(e); } })(), hasRun: typeof window.axe !== 'undefined' && typeof window.axe.run === 'function' })`,
  returnByValue: true,
});
console.error('inject result:', inject.result.value);

const run = await send('Runtime.evaluate', {
  expression: `axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa'] } }).then(r => JSON.stringify({ ok: true, violationCount: (r.violations||[]).length })).catch(e => JSON.stringify({ ok: false, msg: String(e && e.message || e), stack: String(e && e.stack || '').slice(0,500) }))`,
  awaitPromise: true,
  returnByValue: true,
});
console.error('axe.run result raw (first 400):', String(run.result.value).slice(0, 400));

ws.close();
await chrome.kill();
process.exit(0);
