# Telegram Bot Security Hardening — Local Readback

- Status: `PARTIAL — LOCAL HARDENING VERIFIED; BOT LOGIC AND TOKEN ROTATION PENDING`
- Date: 2026-07-30
- Scope: Hermes Telegram gateway runtime on WSL; no secret values read or recorded.

## Verified and changed

1. `/home/shadowlingo/.hermes` is owner-only (`700`).
2. Environment files and backups under `.hermes` are owner-only (`600`).
3. Private Hermes state databases, run databases, state snapshots, config backups, and the Ponytail plugin `.env` were changed to owner-only (`600`).
4. Runtime `STATE.md` was changed to owner-only (`600`).
5. No public TCP listener was observed in WSL during the check. This does not prove Telegram/API or outbound polling security.

## Highest-risk remaining actions

- Rotate the Telegram bot token through `@BotFather` if it ever existed in an exposed backup, chat, log, or repository.
- Confirm the gateway uses numeric owner user/chat ID allowlists for privileged commands.
- Confirm no raw Telegram text reaches shell execution, `eval`, SQL, or unrestricted tool calls.
- If webhooks are used, require HTTPS and validate Telegram's secret-token header on every request.
- Review dependency and host patch status before production use.
- Add redacted audit logging, rate limits, replay protection, and an incident/rollback procedure.

## Boundary

This is a local permission and exposure check, not a penetration test. Bot source logic, Telegram BotFather configuration, webhook/polling mode, and token history were not inspected because doing so could expose secrets or require provider mutation.
