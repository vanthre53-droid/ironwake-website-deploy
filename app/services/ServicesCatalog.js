import { MotionReveal } from '../components/MotionReveal';
import { OFFERED_NOW_MATRIX } from '../../lib/canonical-entity.mjs';

// ponytail: every capability on this page comes from the single OFFERED_NOW
// matrix in lib/canonical-entity.mjs. The matrix is the V15 §88 source of
// truth — never inline a capability here that is not in the matrix, and
// never copy the matrix entries into a parallel local list. If a capability
// must be added, edit the matrix. If the matrix must evolve, do it under
// V15 §39 governance (source, approver, version, effective time).

const deliveryTone = {
  PRODUCTIZED_READY_NOW:
    'Fixed scope, fixed price. Ready to buy as a defined engagement.',
  CUSTOM_SCOPED_READY_NOW:
    'Capability is real. Scope and price are quoted per engagement after the Business Leak Audit.',
  INTEGRATION_READY_NOW:
    'Capability is real but requires a verified third-party integration.',
  REQUIRES_THIRD_PARTY_PROVIDER:
    'Capability is built end to end. A partner account or number is the only client-side step.',
  REQUIRES_DISCOVERY:
    'Capability exists but scope is discovery-first. Always paired with the Business Leak Audit.',
  OWNER_APPROVAL_REQUIRED:
    'Internal capability is built. Commercial launch needs an explicit owner go.',
};

const deliveryLabel = {
  PRODUCTIZED_READY_NOW: 'Productized',
  CUSTOM_SCOPED_READY_NOW: 'Custom scoped',
  INTEGRATION_READY_NOW: 'Integration-ready',
  REQUIRES_THIRD_PARTY_PROVIDER: 'Provider-bounded',
  REQUIRES_DISCOVERY: 'Discovery-first',
  OWNER_APPROVAL_REQUIRED: 'Owner approval',
};

export function ServicesCatalog() {
  const groups = serviceCatalogGroups();
  return (
    <main className="page page-services">
      <section className="hero compact">
        <span className="eyebrow">Services</span>
        <h1>What IronWake designs, builds, and operates — by capability.</h1>
        <p className="reading-width">
          Every card on this page is a capability that is offering-ready today.
          The matrix is the single source of truth: scope, delivery model, proof class,
          and where the work is already exercised. Nothing here is implied as a
          guarantee or a future roadmap item.
        </p>
      </section>

      <MotionReveal>
        <section className="section services-status">
          <div className="reading-width">
            <span className="eyebrow">Status contract</span>
            <h2>How to read each card.</h2>
            <p className="section-lede">
              The capability is real, the delivery model is honest, and the proof
              is anchored to a specific work route. Anything that does not meet
              those three bars is not on this page.
            </p>
          </div>
          <div className="services-status-grid">
            <div className="services-status-card">
              <span className="services-status-label">Capability</span>
              <p>The named thing IronWake delivers. No marketing language, no repackaging.</p>
            </div>
            <div className="services-status-card">
              <span className="services-status-label">Delivery model</span>
              <p>How the work is sold. Productized, custom-scoped, integration-ready, provider-bounded, or discovery-first.</p>
            </div>
            <div className="services-status-card">
              <span className="services-status-label">Proof</span>
              <p>The route(s) where the capability is already exercised internally. Each card links to a live work page.</p>
            </div>
          </div>
        </section>
      </MotionReveal>

      {groups.map((group) => (
        <MotionReveal key={group.id}>
          <section className="section services-group" id={`services-${group.id}`}>
            <header className="services-group-header">
              <span className="services-group-eyebrow">{group.label}</span>
              <h2 className="services-group-title">{group.title}</h2>
              <p className="services-group-blurb">{group.blurb}</p>
            </header>
            <div className="services-grid">
              {group.capabilities.map((cap) => (
                <article key={cap.capability} className="service-card">
                  <div className="service-card-head">
                    <span className="service-card-tag">{deliveryLabel[cap.deliveryModel] || 'Custom scoped'}</span>
                    <h3 className="service-card-title">{cap.capability}</h3>
                  </div>
                  <p className="service-card-claim">{cap.buyerLanguage}</p>
                  {cap.antiMisread ? (
                    <p className="service-card-guard">{cap.antiMisread}</p>
                  ) : null}
                  <dl className="service-card-meta">
                    <div>
                      <dt>Delivery</dt>
                      <dd>{deliveryTone[cap.deliveryModel] || 'Custom scoped per engagement.'}</dd>
                    </div>
                    <div>
                      <dt>Proof</dt>
                      <dd>
                        {cap.evidenceRoutes && cap.evidenceRoutes.length > 0 ? (
                          <ul className="service-card-evidence">
                            {cap.evidenceRoutes.map((route) => (
                              <li key={route}>
                                <a href={route}>{route}</a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="service-card-evidence-empty">No public work route yet — capability is exercised in private engagements.</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        </MotionReveal>
      ))}

      <MotionReveal>
        <section className="section services-flow">
          <div className="reading-width">
            <span className="eyebrow">How a card becomes a project</span>
            <h2>Same flow for every capability.</h2>
            <p className="section-lede">
              Pricing is not on this page. The Business Leak Audit is the gate that
              converts any capability above into a quoted implementation engagement.
            </p>
          </div>
          <ol className="services-flow-steps">
            <li>
              <span className="services-flow-step">01</span>
              <h3>Choose the capability</h3>
              <p>Pick one or more cards from the matrix above. Each card links to a route where the work is already exercised.</p>
            </li>
            <li>
              <span className="services-flow-step">02</span>
              <h3>Run the Business Leak Audit</h3>
              <p>The audit identifies where the gap is in your specific operation. Pricing starts at ₹799 / $29 (Lite). Implementation is scoped separately.</p>
            </li>
            <li>
              <span className="services-flow-step">03</span>
              <h3>Receive a scoped proposal</h3>
              <p>The audit findings lead to a single quoted implementation engagement with one named owner, one visible next action, and one due time per record.</p>
            </li>
            <li>
              <span className="services-flow-step">04</span>
              <h3>Build, ship, operate</h3>
              <p>Every engagement is built end to end on Cloudflare Workers + Supabase and runs on the same monitoring stack the owner dashboard uses.</p>
            </li>
          </ol>
        </section>
      </MotionReveal>
    </main>
  );
}

export function serviceCatalogGroups() {
  return groupByServiceId(OFFERED_NOW_MATRIX);
}

function groupByServiceId(matrix) {
  const order = [
    { id: 'conversion-websites', label: 'Web platforms', title: 'Web platforms and conversion systems.', blurb: 'Custom-built websites, frontend engineering, backend, and deployment. Each one is a working system, not a design handoff.' },
    { id: 'integrations-api', label: 'Integration', title: 'Backend, APIs, and integrations.', blurb: 'The plumbing that connects the website, the CRM, the calendar, and the AI agents into one auditable pipeline.' },
    { id: 'ai-receptionist-voice', label: 'AI', title: 'AI receptionists and bounded agents.', blurb: 'Voice and chat agents that handle first contact, qualify, and route to a named human owner with full audit trail.' },
    { id: 'missed-lead-recovery-followup', label: 'Recovery', title: 'Missed-lead recovery and follow-up.', blurb: 'The productized layer that makes sure every enquiry reaches a named owner within the same business day.' },
    { id: 'whatsapp-business-automation', label: 'Messaging', title: 'WhatsApp, Meta, and direct messaging.', blurb: 'Meta Cloud API integrations that bring the same ownership and audit trail to WhatsApp as any other channel.' },
    { id: 'crm-lead-pipeline', label: 'Pipeline', title: 'CRM and lead pipeline.', blurb: 'The lead pipeline a service business actually runs: capture, qualification, handoff, ownership, and status tracking.' },
    { id: 'booking-reservation-dispatch', label: 'Booking', title: 'Booking, reservation, and dispatch.', blurb: 'Calendar-integrated booking systems with auditable state: requested, reviewed, confirmed, completed.' },
    { id: 'quote-support-repair-intake', label: 'Intake', title: 'Quote, support, and repair intake.', blurb: 'Capture-to-completion workflows for trades and service businesses that need a structured intake record.' },
    { id: 'seo-search-visibility', label: 'SEO', title: 'SEO and search visibility.', blurb: 'Technical SEO foundation: canonical, metadata, structured data, sitemap, internal links, crawl diagnostics, and AI-search entity clarity.' },
    { id: 'monitoring-optimization-intelligence', label: 'Operations', title: 'Monitoring, optimization, and operational intelligence.', blurb: 'Dashboards, error budgets, conversion telemetry, and provider-failure reconciliation so the client sees exactly what is working.' },
    { id: 'conversion-websites-audit', label: 'Audit', title: 'Conversion audit (Business Leak Audit).', blurb: 'The diagnostic at the entry point. Identifies where leads, calls, and bookings are leaking. Pricing starts at ₹799 / $29 (Lite).' },
    { id: 'google-business-profile-local', label: 'Local', title: 'Google Business Profile setup.', blurb: 'Local search foundation: profile completeness, categories, service areas, and the data Google uses to surface a local business.' },
    { id: 'ai-agents-workflow-automation', label: 'Automation', title: 'AI agents and workflow automation.', blurb: 'Bounded AI agents for lead triage, qualification, follow-up, and handoff — every action has a verifiable trigger and audit trail.' },
  ];

  const seen = new Set();
  const out = [];

  for (const entry of order) {
    const matches = matrix.filter((cap) => cap.serviceIds.includes(entry.id) && cap.status === 'OFFERED_NOW');
    if (matches.length === 0) continue;
    out.push({ ...entry, capabilities: matches });
    matches.forEach((m) => seen.add(m.capability));
  }

  const overflow = matrix.filter((cap) => cap.status === 'OFFERED_NOW' && !seen.has(cap.capability));
  if (overflow.length > 0) {
    out.push({
      id: 'other',
      label: 'Other',
      title: 'Other capabilities on the matrix.',
      blurb: 'Capabilities that have not yet been placed under a labelled group. The matrix is the source of truth; this page is a navigation surface.',
      capabilities: overflow,
    });
  }

  return out;
}
