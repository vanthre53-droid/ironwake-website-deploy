# Phase 4 Prompt — Owner CRM, Booking, Notifications, and Approved Providers

Resume only after P2/P3 pass and G3 is approved. Build the private owner CRM and the real public inquiry/booking flows from `docs/04_ARCHITECTURE_CRM_AND_INTEGRATIONS.md`.

The durable order is: validate → create inquiry/service/consent record → request/check slot → commit current status → create owner task/timeline → enqueue notifications → provider response/callback → update exact status. Never mark booked, delivered, paid or live from a frontend click or unconfirmed request.

Implement owner dashboard, pipeline, lead detail, timeline, tasks, booking queue, notification/dead-letter visibility, proof/content status, settings without raw secrets, audit log, export and deletion/anonymization.

Implement social-source attribution and content operations: platform/account, content asset or campaign ID, first/last touch, landing/CTA, consent, owner, next action, outcome, and a privacy-minimised conversation reference. Add a content/proof register and social verification status to the dashboard. Do not ingest full private inbox history by default.

Email/WhatsApp/voice/calendar/payment are adapter-gated. Connect only providers explicitly approved in G4, using approved test recipients, spend caps, consent, signatures, idempotency, redacted logs, retries and safe replay. For unapproved providers, build only typed interfaces/test doubles and truthful pending states. Do not work around KYC, age or ownership requirements; payment accounts require the approved adult/legal owner.

Run Gate D, store evidence, and update every durable state file. Stop before any new external provider/spend/public action not already approved.
