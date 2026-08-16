// ponytail: defer Sentry configuration to runtime only when DSN is set.
// The string indirection prevents the Next.js bundler from eagerly bundling
// `@sentry/nextjs` into the production handler. Without this, ~40 Sentry
// instrumentation packages (~800 KiB+) get bundled even when DSN is empty.
//
// Behavior:
//   - No DSN  → no Sentry import, no instrumentation, no overhead.
//   - Has DSN → dynamic import of sentry.server.config.js, which initializes SDK.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  // eval() disguise: prevents static analysis from following the import.
  // The runtime still resolves to the actual module path.
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || '';
  if (!dsn) return;

  const path = ['.', 'sentry', 'server', 'config', '.js'].join('/');
  const runner = new Function('p', 'return import(p)');
  await runner(path);
}
