import * as Sentry from '@sentry/nextjs';
import { getServerDsn, getSentryEnvironment } from './lib/sentry-dsn.mjs';

const dsn = getServerDsn();

if (dsn) {
  Sentry.init({ dsn, environment: getSentryEnvironment(), tracesSampleRate: 0 });
}
