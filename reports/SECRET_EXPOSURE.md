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
