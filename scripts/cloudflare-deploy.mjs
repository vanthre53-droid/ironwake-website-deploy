#!/usr/bin/env node
// ponytail: thin Cloudflare production deploy wrapper.
// 1. Invokes scripts/release-gate.mjs (which enforces the lifetime ledger).
// 2. The gate itself runs `./node_modules/.bin/wrangler deploy` so the
//    deploy is a lockfile-pinned deterministic invocation (no `npx latest`).
// 3. Exit code is whatever the gate returns.
import { spawn } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();

const proc = spawn(process.execPath, [join(ROOT, 'scripts/release-gate.mjs')], {
  stdio: 'inherit',
  cwd: ROOT,
});

proc.on('close', (code) => process.exit(code ?? 1));
