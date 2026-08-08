// ponytail: loading boundary must NOT use an <h1> — the streaming SSR + a real page <h1> would create two H1s for SEO and screen readers. Use a non-heading element with the same visual weight so search engines see one H1 per page.
export default function Loading() {
  return <main className="shell"><section className="loading-state" aria-live="polite" aria-busy="true"><span className="eyebrow">IronWake</span><div className="loading-headline">Preparing the next view.</div><p>The page is loading. No inquiry, booking, or provider action is happening in the background.</p><span className="loading-line" aria-hidden="true" /></section></main>;
}
