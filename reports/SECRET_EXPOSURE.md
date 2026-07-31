# Secret Exposure Record

- Detected: 2026-07-26T08:57:57Z
- Location: `opencode.json` local provider configuration
- Classification: credential exposure; no secret value is recorded in this report

## Action Taken

1. Removed the inline credential from the tracked configuration before staging the initial baseline commit.
2. Added root ignore rules for local environment values, local OpenCode dependencies, historical configuration copies, and the nested portfolio workspace.
3. Did not attempt provider access, rotation, or external configuration changes.

## Required Human Action

The credential owner must revoke or rotate the exposed provider credential in its provider/admin console before using the corresponding provider again. Enter its replacement only through an approved secret/environment mechanism, never in repository files, chat, screenshots, or reports.

## 2026-07-30 — Chat credential exposure

- Classification: `credential-exposure-recovery-required`
- A Supabase credential and a Vercel token were pasted into chat.
- Secret values, token fragments, and provider identifiers are intentionally not recorded.
- No affected API call was made and no value was written to memory, project files, logs, or `.env` files.
- Required human action: revoke/rotate both credentials in their provider consoles before use.

## 2026-07-30 — Repeated chat exposure

- Classification: `credential-exposure-recovery-required`
- Supabase anon/service credentials and a Vercel token were pasted again in chat.
- No secret value was copied into the repository; `.env.local` contains only the public Supabase URL and blank secret fields.
- Required human action: revoke/rotate the Supabase service-role credential and Vercel token before any provider use. The anon key is public by design but remains blank locally until entered through the approved local mechanism.
