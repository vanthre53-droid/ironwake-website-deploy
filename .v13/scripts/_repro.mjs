import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();
page.on('console', m => console.log(`[${m.type()}]`, m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));
page.on('requestfailed', r => console.log('[reqfail]', r.url(), r.failure()?.errorText));

const resp = await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 60000 });
console.log('status:', resp?.status());
console.log('url:', page.url());
await page.waitForTimeout(2000);

const docInfo = await page.evaluate(() => {
  const d = document.documentElement;
  return {
    docW: d.scrollWidth,
    docH: d.scrollHeight,
    bodyH: document.body?.scrollHeight,
    title: document.title,
    bodyText: (document.body?.innerText || '').slice(0, 200),
  };
});
console.log('doc:', JSON.stringify(docInfo));

try {
  await page.screenshot({ path: '/tmp/test-home.png', fullPage: true });
  console.log('SHOT_OK');
} catch (e) {
  console.log('SHOT_FAIL:', e.message);
}

await browser.close();
