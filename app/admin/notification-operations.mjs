const RETRYABLE_STATUSES = new Set(['dead_letter', 'cancelled']);

export function isRetryableNotification(event) {
  return Boolean(
    event
    && RETRYABLE_STATUSES.has(event.status)
    && event.target_type !== 'legacy'
    && event.event_type !== 'inquiry_received'
  );
}

export function latestNotificationAttempt(attempts = []) {
  return [...attempts].sort((left, right) => {
    const cycle = Number(right.retry_cycle || 0) - Number(left.retry_cycle || 0);
    if (cycle) return cycle;
    return Number(right.attempt_number || 0) - Number(left.attempt_number || 0);
  })[0] || null;
}

export function notificationStatusDescription(status) {
  return ({
    queued: 'Saved and waiting for an available notification worker.',
    processing: 'A worker holds a bounded processing lease. Delivery is not established.',
    retry_scheduled: 'A prior attempt failed safely and another attempt is scheduled.',
    accepted_by_provider: 'The provider accepted the request. Delivery is still pending.',
    delivered: 'A signature-verified provider callback recorded delivery.',
    dead_letter: 'Bounded attempts ended without delivery. Owner review is required.',
    cancelled: 'The event is cancelled. Eligible non-legacy events may be returned to the queue.'
  })[status] || 'The durable notification state is unavailable.';
}
