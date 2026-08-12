# Chatbot diagnosis — Phase 1 boundary trace

- Origin: LOCAL_FRESH_PRODUCTION_BUILD
- Build: exact candidate fingerprint `c5ae77eb5d4c0a5bbef46162f431dca1569c96a70e6357eee484d7438c9dec29`
- Server: `next start -p 4303`, explicitly recorded PID 232951
- Server process: running from fresh `.next`

## Boundary evidence
1. Customer session → not exercised yet: requires an authorized disposable/customer session and browser interaction.
2. Launcher visibility/click/panel/input → not exercised yet in rendered browser. Source gate remains customer-only and anonymous returns null.
3. POST request → PASS at direct local production API boundary: `POST /api/chat` returned HTTP 200.
4. Server response → PASS at direct API boundary: response body was 723 bytes and contains the API response contract.
5. `/chat` route → PASS HTTP 200, 20,793 bytes.
6. Home route → PASS HTTP 200, 61,011 bytes.
7. Persistence/history/navigation/mobile/loading/error → not yet proven by browser interaction.

## Current classification
`CHAT_API_BACKEND=PASS` for the harmless business question at the local fresh production server. Backend is protected; no backend change is authorized or needed.
`CHATBOT_STATUS=FAILED` remains until the complete rendered interaction is reproduced.

## Important source finding
The uncommitted client edits move `safeReply(data)` above the HTTP-status branch and render a reply for non-429 error responses. This is a client integration change, not a backend change. It is UNVERIFIED until browser evidence proves response rendering and persistence.

## Next exact action
Run a rendered-browser trace against `http://127.0.0.1:4303` with an authorized disposable/customer session if available; otherwise complete anonymous `/chat` and route/source checks without claiming authenticated flow success. Capture console errors, launcher visibility, click, panel, request, response, rendered bubble, reload/history, and mobile layout.
