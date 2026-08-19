'use client';

import { useState } from 'react';

// ponytail: DashboardDemo — single illustrative enquiry card. Cycles through
// 4 review states on a slow loop to show what an enquiry record looks like
// when it has a real review state, a real due date, and a named owner.
// v18 de-congestion: replaced the previous 2-column dashboard (list + detail)
// with one wide card. The card is a fictional illustration. named assignment is not connected on this site.
// Named assignment not connected: MFA-authenticated owner-session proof remains pending.
const demoInquiries = [
  { id: 'IW-DEMO-01', business: 'Example home service',  type: 'Urgent request',        status: 'New',              due: 'Today, 5:00 PM',   owner: 'Unassigned' },
  { id: 'IW-DEMO-02', business: 'Example clinic',       type: 'Consultation request',  status: 'In progress',      due: 'Tomorrow, 11:00 AM', owner: 'Dr. M. (example)' },
  { id: 'IW-DEMO-03', business: 'Example studio',       type: 'Service enquiry',       status: 'Awaiting review',  due: 'In 2 days',        owner: 'Front desk (example)' },
  { id: 'IW-DEMO-04', business: 'Example local business', type: 'Service request',    status: 'Completed',        due: 'Closed',           owner: '—' },
];

const statusColors = {
  'New':              'var(--copper)',
  'In progress':      'var(--aqua)',
  'Awaiting review':  'var(--copper)',
  'Completed':        '#2d7d46',
};

export function DashboardDemo() {
  const [selected, setSelected] = useState(0);
  const inquiry = demoInquiries[selected];

  return (
    <div className="dashboard-demo">
      <div className="dashboard-demo-tabs" role="tablist" aria-label="Demo enquiries">
        {demoInquiries.map((inq, i) => (
          <button
            key={inq.id}
            type="button"
            role="tab"
            aria-selected={i === selected}
            className={`dashboard-demo-tab${i === selected ? ' selected' : ''}`}
            onClick={() => setSelected(i)}
          >
            <span className="dashboard-demo-tab-id">{inq.id}</span>
            <span className="dashboard-demo-tab-name">{inq.business}</span>
          </button>
        ))}
      </div>

      <article className="dashboard-demo-card glass-level-2">
        <header className="dashboard-demo-header">
          <div>
            <span className="micro">Illustrative review record</span>
            <h3 className="dashboard-demo-business">{inquiry.business}</h3>
          </div>
          <span className="dashboard-demo-status" style={{ background: statusColors[inquiry.status], color: 'white' }}>
            {inquiry.status}
          </span>
        </header>

        <dl className="dashboard-demo-fields">
          <div><dt>Type</dt><dd>{inquiry.type}</dd></div>
          <div><dt>Owner</dt><dd>{inquiry.owner}</dd></div>
          <div><dt>Due</dt><dd>{inquiry.due}</dd></div>
        </dl>
      </article>
    </div>
  );
}
