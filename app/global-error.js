'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import './globals.css';
import { getClientDsn, getSentryEnvironment } from '../lib/sentry-dsn.mjs';

export default function GlobalErrorBoundary({ error, reset }) {
  useEffect(() => {
    const dsn = getClientDsn();
    if (!dsn) return;
    Sentry.init({ dsn, environment: getSentryEnvironment(), tracesSampleRate: 0 });
    Sentry.captureException(error);
  }, [error]);

  return <html lang="en"><body>
    <main className="shell"><section className="hero compact"><span className="eyebrow">IronWake / error</span><h1>The application hit an unrecoverable error.</h1><p>Nothing was lost silently — this screen only appears when the page itself cannot render. Try again or return home.</p><div className="hero-actions"><button type="button" className="button" onClick={() => reset()}>Try again</button><a className="button secondary" href="/">Return home</a></div></section></main>
  </body></html>;
}
