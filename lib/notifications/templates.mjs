const OWNER_EVENTS = new Set([
  'owner_new_audit',
  'owner_new_booking_request',
  'owner_priority_alert'
]);
const CUSTOMER_EVENTS = new Set([
  'customer_audit_received',
  'customer_booking_request_received'
]);

function cleanText(value, fallback = 'Not provided') {
  const text = String(value ?? '').replace(/\r/g, '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();
  return text || fallback;
}

function cleanHeader(value) {
  return cleanText(value).replace(/[\r\n]+/g, ' ').slice(0, 180);
}

function escapeHtml(value) {
  return cleanText(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function htmlLines(value) {
  return escapeHtml(value).replaceAll('\n', '<br />');
}

function utcTimestamp(value) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? 'Time unavailable' : date.toISOString();
}

function ownerTemplate(event, inquiry) {
  const booking = event.eventType === 'owner_new_booking_request';
  const priority = event.eventType === 'owner_priority_alert';
  const label = priority ? 'PRIORITY LEAD' : booking ? 'NEW BOOKING REQUEST' : 'NEW AUDIT REQUEST';
  const business = cleanText(inquiry.businessName, 'Unnamed business');
  const subject = cleanHeader(`${label} — ${business}`);
  const fields = [
    ['Business', business],
    ['Contact email', cleanText(inquiry.email)],
    ['Source', cleanText(inquiry.source)],
    ['Received at', utcTimestamp(inquiry.createdAt)],
    ['Priority', cleanText(inquiry.triagePriority, 'Not triaged')],
    ['Human review', inquiry.triageNeedsHuman ? 'Required' : 'Not flagged'],
    ['Inquiry reference', cleanText(inquiry.id)]
  ];
  const details = cleanText(inquiry.leakDescription, 'No request detail supplied.');
  const summary = cleanText(inquiry.triageSummary, 'No triage summary available.');
  const text = [
    label,
    '',
    ...fields.map(([name, value]) => `${name}: ${value}`),
    '',
    'Request detail:',
    details,
    '',
    'Triage summary:',
    summary,
    '',
    'Provider acceptance is not delivery confirmation. Review this saved lead in the owner CRM.'
  ].join('\n');
  const rows = fields.map(([name, value]) => `<tr><th align="left">${escapeHtml(name)}</th><td>${escapeHtml(value)}</td></tr>`).join('');
  const html = `<!doctype html><html><body><main><h1>${escapeHtml(label)}</h1><table>${rows}</table><h2>Request detail</h2><p>${htmlLines(details)}</p><h2>Triage summary</h2><p>${htmlLines(summary)}</p><p>Provider acceptance is not delivery confirmation. Review this saved lead in the owner CRM.</p></main></body></html>`;
  return { subject, text, html };
}

function customerTemplate(event, inquiry) {
  const booking = event.eventType === 'customer_booking_request_received';
  const label = booking ? 'BOOKING REQUEST RECEIVED' : 'AUDIT REQUEST RECEIVED';
  const business = cleanText(inquiry.businessName, 'there');
  const receivedAt = utcTimestamp(inquiry.createdAt);
  const reference = cleanText(inquiry.id);
  const bookingBoundary = booking
    ? 'This acknowledges your request only. No appointment is confirmed until IronWake sends a separate confirmation.'
    : 'This acknowledges receipt only. IronWake will review the request before any scope or outcome is confirmed.';
  const subject = `${label} — IronWake`;
  const text = [
    label,
    '',
    `Hello ${business},`,
    '',
    `IronWake received your ${booking ? 'booking request' : 'audit request'} at ${receivedAt}.`,
    bookingBoundary,
    `Reference: ${reference}`,
    '',
    'Please keep this message for your records.'
  ].join('\n');
  const html = `<!doctype html><html><body><main><h1>${escapeHtml(label)}</h1><p>Hello ${escapeHtml(business)},</p><p>IronWake received your ${booking ? 'booking request' : 'audit request'} at ${escapeHtml(receivedAt)}.</p><p>${escapeHtml(bookingBoundary)}</p><p><strong>Reference:</strong> ${escapeHtml(reference)}</p><p>Please keep this message for your records.</p></main></body></html>`;
  return { subject, text, html };
}

export function renderNotification(event, inquiry, config) {
  if (!event || !inquiry || !config?.from) throw new Error('notification_template_input_invalid');
  const ownerEvent = OWNER_EVENTS.has(event.eventType);
  const customerEvent = CUSTOMER_EVENTS.has(event.eventType);
  if ((!ownerEvent && !customerEvent) || (ownerEvent && event.targetType !== 'owner') || (customerEvent && event.targetType !== 'customer')) {
    throw new Error('notification_event_invalid');
  }
  const rendered = ownerEvent ? ownerTemplate(event, inquiry) : customerTemplate(event, inquiry);
  const to = event.targetType === 'owner' ? config.ownerRecipient : inquiry.email;
  if (!to || /[\r\n]/.test(to) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(to)) {
    throw new Error('notification_recipient_invalid');
  }
  return {
    from: config.from,
    to,
    replyTo: config.replyTo,
    ...rendered
  };
}

export const notificationTemplateInternals = { cleanText, cleanHeader, escapeHtml, utcTimestamp };
