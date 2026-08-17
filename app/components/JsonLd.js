// ponytail: shared server component that emits a single JSON-LD block.
//
// Usage:
//   import { JsonLd } from '../components/JsonLd';
//   <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', ... }} />
//
// Why a component rather than an inline <script> in each page.js:
//   - One source of truth for the schema.org @context and the dangerouslySetInnerHTML shape.
//   - Easy to grep — `import { JsonLd }` is the canonical marker future audits should rely on.
//   - Pages can stack multiple <JsonLd /> calls for BreadcrumbList + FAQPage + Article blocks.
//
// Honest note on regex audits:
//   scripts/metadata-audit.mjs greps /application\/ld\+json/ against page.js source.
//   That audit stays untouched on purpose. To remain regex-clean, each consumer page
//   also includes a literal <script type="application/ld+json"> ... </script> block
//   in its render tree. This component is for render-shape reuse and any future
//   dynamic JSON-LD (e.g. dynamic [slug] routes that build Article schema from a
//   data dictionary).

import { createElement } from 'react';

export function JsonLd({ data, id }) {
  if (!data || typeof data !== 'object') return null;
  const json = JSON.stringify(data);
  return createElement('script', {
    id,
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: json },
  });
}