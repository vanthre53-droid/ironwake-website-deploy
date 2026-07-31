import assert from 'node:assert/strict';
import test from 'node:test';
import { getServerDsn, getClientDsn, getSentryEnvironment } from './sentry-dsn.mjs';

function withEnv(overrides, fn) {
  const original = {};
  for (const key of Object.keys(overrides)) {
    original[key] = process.env[key];
    if (overrides[key] === undefined) delete process.env[key];
    else process.env[key] = overrides[key];
  }
  try {
    return fn();
  } finally {
    for (const key of Object.keys(overrides)) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
}

test('Sentry stays disabled server- and client-side when no DSN is configured', () => {
  withEnv({ SENTRY_DSN: undefined, NEXT_PUBLIC_SENTRY_DSN: undefined }, () => {
    assert.equal(getServerDsn(), '');
    assert.equal(getClientDsn(), '');
  });
});

test('Sentry reads a configured DSN for each side independently', () => {
  withEnv({ SENTRY_DSN: 'https://server.example/1', NEXT_PUBLIC_SENTRY_DSN: 'https://client.example/1' }, () => {
    assert.equal(getServerDsn(), 'https://server.example/1');
    assert.equal(getClientDsn(), 'https://client.example/1');
  });
});

test('Sentry environment falls back to development when unset', () => {
  withEnv({ SENTRY_ENVIRONMENT: undefined }, () => {
    assert.equal(getSentryEnvironment(), 'development');
  });
});
