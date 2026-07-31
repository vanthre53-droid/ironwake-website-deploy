export function getServerDsn() {
  return process.env.SENTRY_DSN || '';
}

export function getClientDsn() {
  return process.env.NEXT_PUBLIC_SENTRY_DSN || '';
}

export function getSentryEnvironment() {
  return process.env.SENTRY_ENVIRONMENT || 'development';
}
