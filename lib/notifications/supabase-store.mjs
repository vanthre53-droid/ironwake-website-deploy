function databaseError(error, fallback) {
  const safe = new Error(fallback);
  safe.safeCode = typeof error?.code === 'string' ? error.code.slice(0, 80) : fallback;
  return safe;
}

export function createSupabaseNotificationStore(supabase) {
  if (!supabase?.rpc || !supabase?.from) throw new Error('notification_store_invalid');
  return {
    async claim({ workerId, provider, limit, inquiryId }) {
      const { data, error } = await supabase.rpc('claim_notification_events', {
        p_worker_id: workerId,
        p_provider: provider,
        p_limit: Math.min(Math.max(Number(limit) || 1, 1), 10),
        p_inquiry_id: inquiryId || null
      });
      if (error) throw databaseError(error, 'notification_claim_failed');
      return (data || []).map((row) => ({
        eventId: row.event_id,
        inquiryId: row.inquiry_id,
        eventType: row.event_type,
        targetType: row.target_type,
        idempotencyKey: row.idempotency_key,
        attemptId: row.attempt_id,
        retryCycle: row.retry_cycle,
        attemptNumber: row.attempt_number
      }));
    },

    async getInquiries(ids) {
      if (!ids.length) return new Map();
      const { data, error } = await supabase
        .from('inquiries')
        .select('id,business_name,email,leak_description,source,created_at,triage_priority,triage_summary,triage_needs_human')
        .in('id', ids);
      if (error) throw databaseError(error, 'notification_inquiry_lookup_failed');
      return new Map((data || []).map((row) => [row.id, {
        id: row.id,
        businessName: row.business_name,
        email: row.email,
        leakDescription: row.leak_description,
        source: row.source,
        createdAt: row.created_at,
        triagePriority: row.triage_priority,
        triageSummary: row.triage_summary,
        triageNeedsHuman: row.triage_needs_human
      }]));
    },

    async finish({ eventId, attemptId, outcome, providerEventId, safeErrorCode, retryable }) {
      const { data, error } = await supabase.rpc('finish_notification_attempt', {
        p_event_id: eventId,
        p_attempt_id: attemptId,
        p_outcome: outcome,
        p_provider_message_id: providerEventId || null,
        p_safe_error_code: safeErrorCode || null,
        p_retryable: Boolean(retryable)
      });
      if (error) throw databaseError(error, 'notification_finish_failed');
      return data;
    },

    async queuePriority(inquiryId) {
      const { data, error } = await supabase.rpc('queue_priority_lead_notification', {
        p_inquiry_id: inquiryId
      });
      if (error) throw databaseError(error, 'notification_priority_queue_failed');
      return data;
    },

    async recordProviderEvent({ provider, providerEventId, eventType, providerMessageId, occurredAt }) {
      const { data, error } = await supabase.rpc('record_notification_provider_event', {
        p_provider: provider,
        p_provider_event_id: providerEventId,
        p_event_type: eventType,
        p_provider_message_id: providerMessageId,
        p_occurred_at: occurredAt || null
      });
      if (error) throw databaseError(error, 'notification_provider_event_failed');
      return data;
    }
  };
}
