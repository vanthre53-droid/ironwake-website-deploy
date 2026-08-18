import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = '/home/shadowlingo/.local/share/ironwake-tools/design-skills/baselines/2026-08-18-v13-qa/1920';
await mkdir(OUT, { recursive: true });
const outPath = join(OUT, 'home.png');
console.log('outPath:', outPath);

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();
page.on('console', m => { if (m.type() === 'error') console.log(`[err]`, m.text().slice(0, 200)); });
page.on('pageerror', e => console.log('[pageerror]', e.message));

try {
  const resp = await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 60000 });
  console.log('status:', resp?.status(), 'finalUrl:', page.url());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('SHOT_OK');
} catch (e) {
  console.log('FAIL:', e.message);
  console.log('FAIL_STACK:', e.stack);
}
await browser.close();
