// ponytail: indexnow submit. IndexNow lets a site push URL changes for
// immediate crawl by Bing, Yandex, DuckDuckGo, Seznam and Naver — no API
// keys for those engines. The key file must be served at the host root:
// https://ironwake.dev/<key>.txt (we publish it from /public).
//
// Public docs: https://www.indexnow.org/documentation
//
// One function, no abstractions, no rate limiter (Bing caps at ~10k/day
// per host; we ship well under that and Bing ignores overflow). Caller
// passes a list of canonical URLs from sitemap.json. Errors are swallowed
// (best-effort hint, not a ranking dependency).

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY_PATH = process.env.INDEXNOW_KEY_PATH;

export function readIndexNowKey(fallbackEnv = process.env) {
  if (fallbackEnv.INDEXNOW_KEY) return String(fallbackEnv.INDEXNOW_KEY).trim();
  return null;
}

export async function submitUrlsToIndexNow(urls, {
  host = 'ironwake.dev',
  key,
  fetchImpl = fetch,
  keyLocation,
} = {}) {
  const list = (Array.isArray(urls) ? urls : [urls]).filter(Boolean).slice(0, 10_000);
  if (list.length === 0) return { ok: false, error: 'no-urls' };
  const keyValue = String(key !== undefined && key !== null ? key : (readIndexNowKey() || '')).trim();
  if (!keyValue) return { ok: false, error: 'missing-key' };
  const keyLocationUrl =
    keyLocation || `https://${host}/${keyValue}.txt`;

  const body = {
    host,
    key: keyValue,
    keyLocation: keyLocationUrl,
    urlList: list,
  };

  try {
    const res = await fetchImpl(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    return {
      ok: res.ok,
      status: res.status,
      urlCount: list.length,
      body: await res.text().catch(() => ''),
    };
  } catch (err) {
    return { ok: false, error: String(err?.message || err) };
  }
}

// ponytail: programmatic helper that reads sitemap.json (built by app/sitemap.js)
// and submits every URL. Used by scripts/submit-indexnow.mjs.
export function urlsFromSitemap(sitemapJson) {
  if (!sitemapJson || typeof sitemapJson !== 'string') return [];
  const out = [];
  for (const line of sitemapJson.split('\n')) {
    const m = line.match(/<loc>([^<]+)<\/loc>/);
    if (m) out.push(m[1]);
  }
  return out;
}