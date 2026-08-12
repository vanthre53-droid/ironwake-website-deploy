# Final Candidate Browser Report

- Base: http://127.0.0.1:4304
- Generated: 2026-08-12T07:29:54.626Z
- Matrix: **90/90** route/viewport records across 15 routes × 6 widths
- Matrix screenshots: **90/90**; additional interactive/reduced-motion screenshots also captured
- Browser: existing system Chromium at `/home/shadowlingo/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome`
- Run duration: 88s

## Matrix Summary

- Horizontal-overflow records: **0**
- Records with console errors: **0**
- Records with uncaught page errors: **0**
- Records with hydration-error indicators: **0**
- HTTP status observations: **200 × 35; 304 × 55** (cache revalidation); HTTP errors: **0**
- Anonymous customer-assistant launcher detected: **0/90** records
- Every record in `browser_matrix.json` includes final URL, observed status, title, H1 count/text, document widths/overflow, console/page errors, hydration indicators, and launcher detection.

## Interactive Checks

- **Anonymous chat:** prompt submitted through the UI; real local `POST /api/chat` returned **200** with a completed assistant reply.
- **Login/signup/forgot-password:** empty and syntactically invalid submissions produced validation and remained on their routes. Exact pre/post input validity, browser messages, app alerts, and request observations are in `interactive.forms`. No valid credentials were used; no account was created.
- **Anonymous redirects:** `/account` → `/login?next=/account`; `/update-password` → `/forgot-password`.
- **Keyboard focus:** all 8 sampled login Tab stops matched `:focus-visible` and had an outline or focus box-shadow. The skip-link initially had an offscreen rectangle while focused; subsequent controls were onscreen.
- **Reduced motion:** media query matched on home and chat; content remained present/visible. Motion durations were reduced to effectively zero (`1e-06s`): /: 453 elements a:1e-06s|t:1e-06s; /chat: 143 elements a:1e-06s|t:1e-06s.

## Failures / Findings

- **Potential requirement gap:** no anonymous customer-assistant launcher was detectable on any tested route/width, including home and chat. The dedicated anonymous `/chat` page itself worked.
- No horizontal overflow, console errors, uncaught page errors, hydration indicators, failed resources, HTTP errors, or chat API failure were observed in the matrix.

## Evidence

- Machine-readable matrix: `browser_matrix.json`
- Screenshots: `screenshots/`
- PNG verification: 100 files total; all were at least 5 KB and had valid PNG signatures.

> Screenshots are evidence of rendered states only. This report does not infer visual quality from their existence.
