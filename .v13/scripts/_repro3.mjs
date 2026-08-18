import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = '/home/shadowlingo/.local/share/ironwake-tools/design-skills/baselines/2026-08-18-v13-qa/_test';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });

const routes = [
  { r: '/', name: 'home' },
  { r: '/pricing', name: 'pricing' },
  { r: '/audit', name: 'audit' },
];

for (const route of routes) {
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[${route.name}/${m.type()}]`, m.text().slice(0, 100)); });
  page.on('pageerror', e => console.log(`[${route.name}/pageerror]`, e.message));

  const outPath = join(OUT, route.name + '.png');
  try {
    const resp = await page.goto('http://localhost:3000' + route.r, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(800);
    console.log(`${route.name}: status=${resp?.status()} url=${page.url()}`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`${route.name}: SHOT_OK`);
  } catch (e) {
    console.log(`${route.name}: FAIL=${e.message}`);
  }
  await page.close();
}
await browser.close();
