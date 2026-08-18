# Ruflo ↔ Hermes MCP Integration Probe

**Date:** 2026-08-18
**Probed by:** subagent (delegated from ironwake FULL_PRODUCTION continuation)
**Verdict:** ❌ **FAILED — connectivity not proven. Config NOT modified.**

---

## Status: FAILED

The Ruflo source tree is present at `/home/shadowlingo/.local/share/ironwake-tools/ruflo`, the wrapper `bin/cli.js` exists, and `node bin/cli.js --version` returns `ruflo v3.38.12` — but those are surface-level checks. **The actual command path is broken** because the TypeScript source has never been compiled: `v3/@claude-flow/cli/dist/src/` does not exist, but every CLI entrypoint (`bin/cli.js`, `bin/mcp-server.js`) imports from it.

Per task spec (§5): "Do NOT mark this as connected unless you actually saw a real `memory list` response or equivalent." The probe did NOT see a `memory list` response — it saw a `ERR_MODULE_NOT_FOUND` on every non-`--version` invocation.

---

## Version

```
$ node /home/shadowlingo/.local/share/ironwake-tools/ruflo/bin/cli.js --version
ruflo v3.38.12
```

The `--version` path is hardcoded to short-circuit before any heavy imports (see `v3/@claude-flow/cli/bin/cli.js:125-141`), which is why it works while every other command does not.

## Path

```
/home/shadowlingo/.local/share/ironwake-tools/ruflo/bin/cli.js          (wrapper, 427 bytes)
/home/shadowlingo/.local/share/ironwake-tools/ruflo/v3/@claude-flow/cli/bin/cli.js        (12,243 bytes, real entrypoint)
/home/shadowlingo/.local/share/ironwake-tools/ruflo/v3/@claude-flow/cli/bin/mcp-server.js (6,401 bytes, stdio MCP server)
```

---

## Root Cause

`v3/@claude-flow/cli/bin/cli.js` (line 325) and `bin/mcp-server.js` (line 30) both begin with:

```js
import { CLI } from '../dist/src/index.js';
//                  ^^^^^^^ does not exist
import { listMCPTools, callMCPTool, hasTool } from '../dist/src/mcp-client.js';
//                                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ does not exist
```

The `dist/` directory is absent. `package.json` declares `"build": "tsc"` and the `files` field requires `dist/**/*.js`, but no `node_modules/` exists at any level (root, `v3/`, or `v3/@claude-flow/cli/`), so the build script has never been run. The local tree is a **source checkpoint, not a runnable install** — equivalent to checking out the git repo without `pnpm install && pnpm build`.

This is the same problem the Ruflo `SKILL.md` "Getting started" section warned about (step 1: `npx ruflo init`), but the `npx` route was not used here — a vendored source tree was dropped at `~/.local/share/ironwake-tools/ruflo` without a build step.

---

## Test Output (verbatim)

### Test 1: --version (works, but is a fake-positive)

```
$ node /home/shadowlingo/.local/share/ironwake-tools/ruflo/bin/cli.js --version
ruflo v3.38.12
exit_code: 0
```

### Test 2: --help (the real command path — fails immediately)

```
$ node /home/shadowlingo/.local/share/ironwake-tools/ruflo/bin/cli.js --help
node:internal/modules/esm/resolve:275
    throw new ERR_MODULE_NOT_FOUND(
          ^
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/shadowlingo/.local/share/ironwake-tools/ruflo/v3/@claude-flow/cli/dist/src/index.js' imported from /home/shadowlingo/.local/share/ironwake-tools/ruflo/v3/@claude-flow/cli/bin/cli.js
    at finalizeResolution (node:internal/modules/esm/resolve:275:11)
    at moduleResolve (node:internal/modules/esm/resolve:861:10)
    at defaultResolve (node:internal/modules/esm/resolve:985:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:747:20)
    at ModuleLoader.import (node:internal/modules/esm/get_module_job_loader:320:38)
    at onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:680:36)
    at TracingChannel.tracePromise (node:diagnostics_channel:350:14)
    at ModuleLoader.import (node:internal/modules/esm/loader:679:21)
    at defaultImportModuleDynamicallyForModule (node:internal/modules/esm/utils:222:31) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/shadowlingo/.local/share/ironwake-tools/ruflo/v3/@claude-flow/cli/dist/src/index.js'
}
Node.js v22.23.1
exit_code: 1
```

### Test 3: task spec command — `memory list --limit 3` (fails identically)

```
$ node /home/shadowlingo/.local/share/ironwake-tools/ruflo/bin/cli.js memory list --limit 3
node:internal/modules/esm/resolve:275
    throw new ERR_MODULE_NOT_FOUND(
          ^
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/shadowlingo/.local/share/ironwake-tools/ruflo/v3/@claude-flow/cli/dist/src/index.js' imported from /home/shadowlingo/.local/share/ironwake-tools/ruflo/v3/@claude-flow/cli/bin/cli.js
    [stack identical to Test 2]
exit_code: 1
```

### Test 4: MCP stdio `initialize` over pipe (fails identically, same module)

```
$ echo '{"jsonrpc":"2.0","id":1,"method":"initialize",...}' | node /home/shadowlingo/.local/share/ironwake-tools/ruflo/v3/@claude-flow/cli/bin/cli.js
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/shadowlingo/.local/share/ironwake-tools/ruflo/v3/@claude-flow/cli/dist/src/mcp-client.js'
```

The MCP entrypoint (`bin/mcp-server.js`) is also broken — it imports `dist/src/mcp-client.js` which doesn't exist. **MCP handshake would fail at startup**, before any tool can be advertised.

---

## Config Snippet (NOT YET APPLIED)

The proposed config addition is recorded here. A separate, security-cleared pass is required to merge it into `/home/shadowlingo/.hermes/config.yaml` — Hermes correctly refused the subagent from modifying the live config file.

```yaml
# /home/shadowlingo/.hermes/config.yaml  —  add to the existing `mcp_servers:` block
  ruflo:
    command: node
    args:
      - /home/shadowlingo/.local/share/ironwake-tools/ruflo/bin/cli.js
    env: {}
    enabled: true
```

**Do not apply this config until the build issue below is resolved.** Adding it now would cause Hermes to repeatedly fail to spawn the server on every reload, polluting the MCP log with ERR_MODULE_NOT_FOUND noise.

---

## Estimated Capabilities (when working)

Per Ruflo `SKILL.md` and the resolved source tree, when the dist build exists, the MCP server exposes 314+ tools across these namespaces:

| Namespace | Purpose |
|-----------|---------|
| `mcp__claude-flow__memory_*` | store / search / list / retrieve — HNSW-indexed semantic search, hybrid SQLite+AgentDB backend |
| `mcp__claude-flow__swarm_*` | init hierarchical / mesh swarms with anti-drift topology |
| `mcp__claude-flow__agent_spawn` | spawn specialized agents (coder, reviewer, tester, security-architect, +55 more) |
| `mcp__claude-flow__hooks_*` | routing, pattern learning, background worker dispatch |
| `mcp__claude-flow__task_*` | task lifecycle (create / assign / complete / summary) |
| `mcp__claude-flow__intelligence_*` | 4-step pipeline (RETRIEVE → JUDGE → DISTILL → CONSOLIDATE) |

Plus 30+ plugins (`ruflo-goals`, `ruflo-cost-tracker`, `ruflo-metaharness`, `ruflo-browser`, `ruflo-jujutsu`, `ruflo-security-audit`, etc.).

**None of these are available to Hermes today** — the server cannot start.

---

## Required Next Step (for the next stage)

The probe is a **build failure**, not a connectivity configuration failure. To unblock:

### Option A — Build the vendored tree (fast, but heavy)

```bash
cd /home/shadowlingo/.local/share/ironwake-tools/ruflo
pnpm install          # installs ~30 deps including native bindings (better-sqlite3, sharp, ONNX, sql.js)
pnpm --filter @claude-flow/cli build   # runs `tsc` → produces dist/
```

Subsequent `node bin/cli.js memory list --limit 3` should succeed. Then re-run this probe.

### Option B — Use the published npm package instead (cleaner, no Rust/native deps handled by maintainers)

```bash
npm install -g @claude-flow/cli@3.38.12
# or: npx -y @claude-flow/cli@3.38.12
```

Then point the Hermes config at the installed binary (`which claude-flow` or `npx -y @claude-flow/cli bin path`) and the config snippet above continues to work.

### Option C — Skip Ruflo for now

If Ruflo integration is not on the critical path for the next ironwake phase, mark this as a known-blocking dependency and proceed without it. The MCP integration is a non-activation dependency — nothing downstream fails catastrophically if Ruflo is offline.

---

## Files Touched

- **Created:** `/mnt/c/Users/vanth/Downloads/ironwake/.v13/results/ruflo-mcp-integration.md` (this file)
- **Modified:** none (Hermes config was correctly refused; see "Config Snippet" section above)

---

## Lessons Learned (for the build-future-Ruflo fix path)

1. **`--version` is a liar.** Ruflo's CLI short-circuits `--version` to read the `package.json` directly, bypassing the broken `dist/` import. Any future "is this thing alive?" probe must test a real command (`memory list`, `--help`, or `mcp start --help`), not the version flag.
2. **The dist/ gap is the only real failure.** Everything else (wrapper, inner CLI, MCP server, all 314 tool definitions, all 30+ plugins) is present and likely correct in source. A single `tsc` invocation, given a working `node_modules`, would likely flip this entire probe from FAILED to CONNECTED.
3. **The subagent safety guard refused the config edit.** That's correct behavior — security-sensitive config edits should be quarantined to a human/sudo loop. The next stage needs to apply the snippet itself, then verify with `hermes status` or equivalent.
