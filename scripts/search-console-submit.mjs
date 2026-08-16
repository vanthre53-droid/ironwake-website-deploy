#!/usr/bin/env node
// ponytail: one-shot helper that submits the canonical sitemap to Google
// Search Console once the owner grants the OAuth refresh token.
//
// Goal §19 acceptance:
//   - Domain property verified via TXT (already live at apex)
//   - Sitemap submitted + read (Google fetches it and reads URLs)
//   - Indexed pages are t...[truncated>