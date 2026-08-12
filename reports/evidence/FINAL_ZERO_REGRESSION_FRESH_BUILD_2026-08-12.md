# Fresh production build evidence — FINAL ZERO REGRESSION

- Origin: LOCAL_FRESH_PRODUCTION_BUILD
- Candidate fingerprint: `c5ae77eb5d4c0a5bbef46162f431dca1569c96a70e6357eee484d7438c9dec29`
- HEAD: `435c343d23d271e6bc5bc8a1145a91b12e9c0158`
- Build time: `2026-08-12T05:19:18Z`
- Stale `.next` removed before build: YES
- Command: `npm run build`
- Exit code: `0`

## Redacted build output
```text
> ironwake@0.1.0 build
> next build

▲ Next.js 16.2.12 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 16.8s
  Running TypeScript ...
  Finished TypeScript in 1140ms ...
  Collecting page data using 11 workers ...
  Generating static pages using 11 workers (0/56) ...
  Generating static pages using 11 workers (14/56) 
  Generating static pages using 11 workers (28/56) 
  Generating static pages using 11 workers (42/56) 
✓ Generating static pages using 11 workers (56/56) in 4.2s
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ƒ /account
├ ○ /admin
├ ƒ /api/audit
├ ƒ /api/chat
├ ƒ /api/owner/export
├ ƒ /api/owner/notification-readiness
├ ƒ /api/owner/whoami
├ ƒ /api/webhooks/resend
├ ○ /audit
├ ƒ /auth/confirm
├ ○ /book
├ ○ /chat
├ ○ /forgot-password
├ ○ /icon.svg
├ ○ /industries
├ ○ /industries/dental-clinics
├ ○ /industries/home-services
├ ○ /industries/salons-spas
├ ○ /insights
├ ● /insights/[slug]
│ ├ /insights/missed-lead-recovery-service-businesses
│ ├ /insights/booking-confirmation-vs-booking-request
│ ├ /insights/follow-up-ownership-service-businesses
│ └ /insights/ai-receptionist-honest-assessment
├ ƒ /login
├ ○ /manifest.json
├ ○ /owner
├ ○ /owner/login
├ ○ /owner/reset-password
├ ○ /pricing
├ ○ /privacy
├ ○ /process
├ ○ /robots.txt
├ ○ /scope
├ ƒ /signup
├ ○ /sitemap.xml
├ ○ /systems
├ ○ /systems/ai-receptionist
├ ○ /systems/booking-control
├ ○ /systems/missed-lead-recovery
├ ○ /systems/trust-lead-capture
├ ○ /terms
├ ƒ /update-password
├ ○ /work
├ ○ /work/atelier
├ ○ /work/aura-archives
├ ○ /work/bramble-cafe
├ ○ /work/dentacare-pro
├ ○ /work/harbour-estates
├ ○ /work/luxe-studio
├ ○ /work/rapidpulse
├ ○ /work/retech
└ ○ /work/voltix


ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```
