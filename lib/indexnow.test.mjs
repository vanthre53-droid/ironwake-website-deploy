import test from 'node:test';
import assert from 'node:assert/strict';
import { readIndexNowKey, submitUrlsToIndexNow, urlsFromSitemap } from './indexnow.mjs';

test('readIndexNowKey returns env value when set', () => {
  assert.equal(readIndexNowKey({ INDEXNOW_KEY: 'abc123' }), 'abc123');
});

test('readIndexNowKey returns null when missing', () => {
  assert.equal(readIndexNowKey({}), null);
});

test('urlsFromSitemap extracts <loc> entries', () => {
  const xml = `<?xml version="1.0"?>
<urlset>
  <url><loc>https://ironwake.dev/</loc></url>
  <url><loc>https://ironwake.dev/services</loc></url>
  <url><loc>https://ironwake.dev/portfolio</loc></url>
</urlset>`;
  const urls = urlsFromSitemap(xml);
  assert.deepEqual(urls, [
    'https://ironwake.dev/',
    'https://ironwake.dev/services',
    'https://ironwake.dev/portfolio',
  ]);
});

test('submitUrlsToIndexNow returns missing-key when no key', async () => {
  const saved = process.env.INDEXNOW_KEY;
  delete process.env.INDEXNOW_KEY;
  const r = await submitUrlsToIndexNow(['https://ironwake.dev/'], { key: '' });
  if (saved) process.env.INDEXNOW_KEY = saved;
  assert.equal(r.ok, false);
  assert.equal(r.error, 'missing-key');
});

test('submitUrlsToIndexNow returns no-urls for empty list', async () => {
  const r = await submitUrlsToIndexNow([], { key: 'k' });
  assert.equal(r.ok, false);
  assert.equal(r.error, 'no-urls');
});

test('submitUrlsToIndexNow POSTs the documented body shape', async () => {
  let captured = null;
  const fakeFetch = async (url, init) => {
    captured = { url, init };
    return { ok: true, status: 200, text: async () => 'ok' };
  };
  const r = await submitUrlsToIndexNow(['https://ironwake.dev/'], {
    key: 'KEY',
    fetchImpl: fakeFetch,
  });
  assert.equal(r.ok, true);
  assert.equal(r.status, 200);
  assert.equal(r.urlCount, 1);
  assert.equal(captured.url, 'https://api.indexnow.org/indexnow');
  const body = JSON.parse(captured.init.body);
  assert.equal(body.host, 'ironwake.dev');
  assert.equal(body.key, 'KEY');
  assert.equal(body.keyLocation, 'https://ironwake.dev/KEY.txt');
  assert.deepEqual(body.urlList, ['https://ironwake.dev/']);
});