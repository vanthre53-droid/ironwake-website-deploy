import { randomUUID } from 'node:crypto';
import { readNotificationConfig } from './config.mjs';
import { createResendAdapter } from './resend-adapter.mjs';
import { renderNotification } from './templates.mjs';

export function needsPriorityAlert(triage) {
  return triage?.needs_human === true || triage?.priority === 'high' || triage?.priority === 'urgent';
}

function safeOutcome(result) {
  if (result?.accepted && result.status === 'accepted') return 'accepted_by_provider';
  return result?.status === 'failed' ? 'failed' : 'unknown';
}

export async function runNotificationWorker({
  env = process.env,
  store,
  adapterFactory = (config) => createResendAdapter(config),
  workerId = `ironwake-notification-${randomUUID()}`,
  limit = 10,
  inquiryId = null,
  eventId = null
} = {}) {
  const config = readNotificationConfig(env);
  if (!config.configured) {
    return { status: 'unconfigured', safeErrorCode: config.safeErrorCode, claimed: 0, accepted: 0, retryScheduled: 0, deadLettered: 0 };
  }
  if (!store) throw new Error('notification_store_required');

  const adapter = adapterFactory(config);
  const events = await store.claim({
    workerId,
    provider: config.provider,
    limit: Math.min(Math.max(Number(limit) || 1, 1), 10),
    inquiryId,
    eventId
  });
  const summary = {
    status: 'processed',
    claimed: events.length,
    accepted: 0,
    retryScheduled: 0,
    deadLettered: 0,
    failedToFinish: 0
  };
  if (!events.length) return summary;

  let inquiries;
  try {
    inquiries = await store.getInquiries([...new Set(events.map((event) => event.inquiryId))]);
  } catch {
    inquiries = new Map();
  }

  for (const event of events) {
    let result;
    const inquiry = inquiries.get(event.inquiryId);
    if (!inquiry) {
      result = { accepted: false, status: 'unknown', retryable: true, safeErrorCode: 'inquiry_lookup_failed' };
    } else {
      try {
        const message = renderNotification(event, inquiry, config);
        result = await adapter.send(message, { idempotencyKey: event.idempotencyKey });
      } catch {
        result = { accepted: false, status: 'failed', retryable: false, safeErrorCode: 'notification_render_failed' };
      }
    }

    try {
      const finalStatus = await store.finish({
        eventId: event.eventId,
        attemptId: event.attemptId,
        outcome: safeOutcome(result),
        providerEventId: result.providerEventId,
        safeErrorCode: result.safeErrorCode,
        retryable: result.retryable
      });
      if (finalStatus === 'accepted_by_provider') summary.accepted += 1;
      else if (finalStatus === 'retry_scheduled') summary.retryScheduled += 1;
      else if (finalStatus === 'dead_letter') summary.deadLettered += 1;
    } catch {
      summary.failedToFinish += 1;
    }
  }

  return summary;
}

export async function runNotificationWorkerBestEffort(options) {
  try {
    return await runNotificationWorker(options);
  } catch (error) {
    return {
      status: 'worker_error',
      safeErrorCode: typeof error?.safeCode === 'string' ? error.safeCode : 'notification_worker_failed',
      claimed: 0,
      accepted: 0,
      retryScheduled: 0,
      deadLettered: 0
    };
  }
}
