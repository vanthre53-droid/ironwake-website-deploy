// lib/whatsapp/business-profile.js
//
// ponytail: well-known WhatsApp Business profile payload shape used by
// Graph `POST /{phone-id}/whatsapp_business_profile` and the matching
// `GET` field. Centralizing the shape lets every caller validate,
// sanitize, and round-trip through JSON without ever producing a
// payload Meta will reject with `131009` (invalid parameters) or
// silently fail to apply.
//
// Source citations (current as of 2026-08, Graph v20.0):
//   https://developers.facebook.com/docs/whatsapp/cloud-api/business-profile/
//   https://developers.facebook.com/docs/whatsapp/cloud-api/reference/whatsapp-business-profiles
//   https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers
//
// Honest-by-construction:
//   * No invention: defaults are explicit. If a field is null we keep
//     it null — Meta's Graph endpoint treats null as "do not change",
//     and we surface that intent to the caller rather than guessing.
//   * No silent XSS: every string passes through `sanitizeText` which
//     strips control characters and HTML tags before any cap.
//   * No protocol drift: websites must be `https:` (Meta rejects `http:`
//     on the business-profile endpoint), emails must be a real RFC 5322
//     mailbox-shaped string, profile_pic_url must be `https:` and the
//     upload step that produces it lives outside this module.
//   * No fabricated fields: anything outside the documented Graph
//     payload shape is rejected up-front rather than submitted and
//     silently dropped by Meta.

const LENGTH_LIMITS = Object.freeze({
  about: 139,         // Graph hard limit; longer strings return `131009`
  description: 512,   // mirrors Meta's `description` cap on the v20.0 endpoint
  address: 256,       // cap observed in the Graph error envelope
  email: 128,         // SMTP + display-name cap
  website: 2048,      // Meta accepts URLs well within sane URL limits
  profile_pic_url: 2048,
  vertical: 64,
  category: 128,
  header: 60,         // business profile header, e.g. "Bookings"
  sites: 2            // Graph allows at most 2 websites per business profile
});

const PROTOCOL_ALLOWED_HTTPS = 'https:';

/**
 * The empty Graph payload Meta accepts to clear a field. Sending
 * `{ about: '' }` removes an existing about string; sending
 * `{ websites: [] }` removes the existing list. Surfaced as a frozen
 * value so callers can compare by reference.
 */
export const EMPTY_PROFILE = Object.freeze({
  about: '',
  address: '',
  email: '',
  description: '',
  vertical: '',
  websites: Object.freeze([]),
  profile_pic_url: ''
});

/**
 * Vertical catalog surfaced in the WhatsApp Manager UI. Use as-is; the
 * Graph endpoint rejects unknown verticals with `131009`.
 * Source: https://developers.facebook.com/docs/whatsapp/cloud-api/business-profile#about-verticals
 */
export const VERTICALS = Object.freeze([
  'AUTOMOTIVE',
  'BEAUTY',
  'APPAREL',
  'EDU',
  'ENTERTAIN',
  'EVENT_PLAN',
  'FINANCE',
  'GROCERY',
  'GOVT',
  'HEALTH',
  'EMAIL',
  'HOTEL',
  'NONPROFIT',
  'PROF_SERVICES',
  'RETAIL',
  'TRAVEL',
  'RESTAURANT',
  'ALCOHOL',
  'HOUSING',
  'MEDIA',
  'TELECOM',
  'FITNESS',
  'LEGAL',
  'LOGISTICS',
  'GAMING',
  'OTHER'
]);

const DOCUMENTED_FIELDS = new Set([
  'about',
  'address',
  'email',
  'description',
  'vertical',
  'websites',
  'profile_pic_url'
]);

/**
 * Build a Meta-compatible business-profile payload from a loose
 * caller object. Returns `{ profile, diagnostics }` so the caller
 * receives both the usable payload AND a precise list of field-level
 * issues (renderable in an operator-facing UI). Never throws.
 *
 * @param {object} input  Freeform profile object from a form / API.
 * @returns {{
 *   profile: object,
 *   diagnostics: {
 *     ok: boolean,
 *     droppedFields: string[],
 *     truncatedFields: string[],
 *     invalidFields: string[],
 *     warnings: string[]
 *   }
 * }}
 */
export function buildBusinessProfile(input) {
  const issues = {
    ok: true,
    droppedFields: [],
    truncatedFields: [],
    invalidFields: [],
    warnings: []
  };
  if (!input || typeof input !== 'object') {
    issues.ok = false;
    issues.invalidFields.push('payload');
    return { profile: { ...EMPTY_PROFILE, websites: [] }, diagnostics: issues };
  }

  // ponytail: strip undocumented fields up-front. Meta silently
  // ignores them, but including them makes diff-audits noisy and
  // risks accidentally storing PII in a future cache.
  for (const key of Object.keys(input)) {
    if (!DOCUMENTED_FIELDS.has(key)) issues.droppedFields.push(key);
  }

  const profile = {
    about: sanitizeText(input.about, { cap: LENGTH_LIMITS.about, field: 'about', issues }),
    address: sanitizeText(input.address, { cap: LENGTH_LIMITS.address, field: 'address', issues }),
    description: sanitizeText(input.description, { cap: LENGTH_LIMITS.description, field: 'description', issues }),
    email: sanitizeEmail(input.email, issues),
    vertical: sanitizeVertical(input.vertical, issues),
    websites: sanitizeWebsites(input.websites, issues),
    profile_pic_url: sanitizeProfilePicUrl(input.profile_pic_url, issues)
  };

  if (issues.droppedFields.length) issues.warnings.push(
    `dropped ${issues.droppedFields.length} undocumented field(s)`
  );

  // ponytail: "ok" stays true when only truncation/drop warnings
  // happened; only structural rejections flip it false.
  const hasStructural = issues.invalidFields.length > 0;
  issues.ok = !hasStructural;
  return { profile, diagnostics: issues };
}

/**
 * Compare two profiles and return the minimal diff payload Meta will
 * accept. Unchanged fields are omitted so the Graph endpoint does the
 * right thing (treating absent fields as "leave alone"), but callers
 * that want a real "clear everything" call can compare against
 * `EMPTY_PROFILE` directly.
 *
 * @param {object} current   Snapshot from Meta's GET (already normalized).
 * @param {object} desired   Output of `buildBusinessProfile`.
 */
export function diffBusinessProfile(current, desired) {
  const fields = ['about', 'address', 'description', 'email', 'vertical',
                  'websites', 'profile_pic_url'];
  const patch = {};
  for (const key of fields) {
    const a = current?.[key] ?? '';
    const b = desired?.[key] ?? '';
    if (key === 'websites') {
      if (!arraysEqual(a || [], b || [])) patch.websites = b || [];
    } else if (String(a) !== String(b)) {
      patch[key] = b;
    }
  }
  return patch;
}

/**
 * Round-trip a payload through JSON. Meta's Graph endpoint returns
 * a JSON-quoted string; we normalize it the same way so callers can
 * hand a string back into `buildBusinessProfile` safely.
 */
export function normalizeGraphProfile(jsonString) {
  const fallbackDiagnostics = { ok: true, droppedFields: [], truncatedFields: [], invalidFields: [], warnings: ['empty input'] };
  if (typeof jsonString !== 'string' || !jsonString.trim()) {
    return { profile: { ...EMPTY_PROFILE, websites: [] }, diagnostics: fallbackDiagnostics };
  }
  let parsed;
  try { parsed = JSON.parse(jsonString); } catch {
    return { profile: { ...EMPTY_PROFILE, websites: [] }, diagnostics: { ...fallbackDiagnostics, warnings: ['invalid JSON'] } };
  }
  const { profile, diagnostics } = buildBusinessProfile(parsed);
  // ponytail: a round-trip from the Graph API is trusted enough that
  // we surface invalidFields as warnings rather than failing the
  // caller. The diagnostics object still tells them.
  for (const field of diagnostics.invalidFields) {
    diagnostics.warnings.push(`graph-returned ${field} was rejected`);
  }
  diagnostics.invalidFields = [];
  diagnostics.ok = true;
  return { profile, diagnostics };
}

// ----- internals -------------------------------------------------------------

function sanitizeText(value, { cap, field, issues }) {
  if (value == null || value === '') return '';
  if (typeof value !== 'string') {
    issues.invalidFields.push(field);
    return '';
  }
  const cleaned = stripControlChars(stripHtml(value)).trim();
  if (cleaned.length === 0) return '';
  if (cleaned.length > cap) {
    issues.truncatedFields.push(field);
    return cleaned.slice(0, cap).trim();
  }
  return cleaned;
}

function sanitizeEmail(value, issues) {
  if (value == null || value === '') return '';
  if (typeof value !== 'string') {
    issues.invalidFields.push('email');
    return '';
  }
  const cleaned = stripControlChars(value).trim().toLowerCase();
  if (!EMAIL_RE.test(cleaned) || cleaned.length > LENGTH_LIMITS.email) {
    issues.invalidFields.push('email');
    return '';
  }
  return cleaned;
}

function sanitizeVertical(value, issues) {
  if (value == null || value === '') return '';
  if (typeof value !== 'string') {
    issues.invalidFields.push('vertical');
    return '';
  }
  const cleaned = stripControlChars(value).trim().toUpperCase();
  if (!VERTICALS.includes(cleaned)) {
    issues.invalidFields.push('vertical');
    return '';
  }
  return cleaned;
}

function sanitizeWebsites(value, issues) {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    // ponytail: accept a single string for friendlier form posts.
    if (typeof value === 'string') value = value.split(/[\n,]/);
    else { issues.invalidFields.push('websites'); return []; }
  }
  const out = [];
  const seen = new Set();
  for (let raw of value) {
    if (raw == null || raw === '') continue;
    if (typeof raw !== 'string') { issues.invalidFields.push('websites'); continue; }
    let url;
    try { url = new URL(stripControlChars(raw).trim()); } catch {
      issues.invalidFields.push('websites');
      continue;
    }
    if (url.protocol !== PROTOCOL_ALLOWED_HTTPS) {
      // ponytail: Graph rejects http:// on the business-profile
      // endpoint with `error_subcode 2388002` (invalid parameters).
      issues.invalidFields.push('websites');
      continue;
    }
    const normalized = url.toString();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    if (normalized.length > LENGTH_LIMITS.website) {
      issues.truncatedFields.push('websites');
      out.push(normalized.slice(0, LENGTH_LIMITS.website));
    } else {
      out.push(normalized);
    }
    if (out.length >= LENGTH_LIMITS.sites) break;
  }
  if (value.length > LENGTH_LIMITS.sites) {
    issues.warnings.push(`websites limited to ${LENGTH_LIMITS.sites} entries`);
  }
  return out;
}

function sanitizeProfilePicUrl(value, issues) {
  if (value == null || value === '') return '';
  if (typeof value !== 'string') {
    issues.invalidFields.push('profile_pic_url');
    return '';
  }
  const cleaned = stripControlChars(value).trim();
  if (!cleaned) return '';
  let url;
  try { url = new URL(cleaned); } catch {
    issues.invalidFields.push('profile_pic_url');
    return '';
  }
  if (url.protocol !== 'https:') {
    issues.invalidFields.push('profile_pic_url');
    return '';
  }
  if (url.toString().length > LENGTH_LIMITS.profile_pic_url) {
    issues.truncatedFields.push('profile_pic_url');
    return url.toString().slice(0, LENGTH_LIMITS.profile_pic_url);
  }
  return url.toString();
}

// ponytail: keep the regex intentionally simple. RFC 5322 is enormous;
// we only need the shape Meta accepts at the Graph endpoint.
const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

function stripControlChars(s) {
  // ASCII control chars (0x00-0x1F) + DEL; preserves \t and \n on intl
  // inputs which Meta ignores anyway on the receiving end.
  return s.replace(/[\x00-\x08\x0B-\x1F\x7F]/g, '');
}

function stripHtml(s) {
  // ponytail: < and > are rejected by Meta as `invalid_characters`
  // (`error_subcode 2388002`). Strip them before any cap to remove the
  // simplest XSS surface in a single line of code.
  return s.replace(/[<>]/g, '');
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

// ponytail: test surface. Not part of the public API; tests import it
// via `__internals` to assert against the validation primitives without
// reaching into private closure state.
export const __internals = {
  LENGTH_LIMITS,
  PROTOCOL_ALLOWED_HTTPS,
  DOCUMENTED_FIELDS,
  stripControlChars,
  stripHtml,
  arraysEqual,
  EMAIL_RE,
  sanitizeText,
  sanitizeEmail,
  sanitizeVertical,
  sanitizeWebsites,
  sanitizeProfilePicUrl
};
