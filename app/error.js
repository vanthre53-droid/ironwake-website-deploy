'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { getClientDsn, getSentryEnvironment } from '../lib/sentry-dsn.mjs';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    const dsn = getClientDsn();
    if (!dsn) return;
    Sentry.init({ dsn, environment: getSentryEnvironment(), tracesSampleRate: 0 });
    Sentry.captureException(error);
  }, [error]);

  return <main className="shell"><section className="hero compact"><span className="eyebrow">IronWake / error</span><h1>Something didn’t load.</h1><p>This is a page-level error, not a lost inquiry — anything already saved stays saved. Try again, or return home.</p><div className="hero-actions"><button type="button" className="button" onClick={() => reset()}>Try again</button><a className="button secondary" href="/">Return home</a></div></section></main>;
}
