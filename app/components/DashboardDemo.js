'use client';

import { useState } from 'react';

// ponytail: demonstration dashboard — not connected to real data
const demoInquiries = [
  { id: 'IW-2847', business: 'Sharma Plumbing', type: 'Emergency leak', status: 'New', owner: 'R. Kumar', due: 'Today 3pm', age: '12m' },
  { id: 'IW-2846', business: 'Mehta Dental', type: 'Root canal consult', status: 'In progress', owner: 'S. Patel', due: 'Tomorrow 10am', age: '2h' },
  { id: 'IW-2845', business: 'Glow Salon', type: 'Bridal package', status: 'Awaiting review', owner: 'A. Singh', due: 'Today 5pm', age: '45m' },
  { id: 'IW-2844', business: 'QuickFix Electric', type: 'Wiring inspection', status: 'Completed', owner: 'P. Verma', due: 'Done', age: '1d' },
];

const statusColors = {
  'New': 'var(--copper)',
  'In progress': 'var(--aqua)',
  'Awaiting review': 'var(--copper)',
  'Completed': '#2d7d46',
};

export function DashboardDemo() {
  const [selected, setSelected] = useState(0);
  const inquiry = demoInquiries[selected];

  return <section className="section">
    <span className="eyebrow">Owner control</span>
    <h2>See what the dashboard shows.</h2>
    <p>Every enquiry has a named owner, a due date, and a visible status. No guessing, no shared-inbox ambiguity.</p>
    <div className="dashboard-demo">
      <div className="dashboard-list">
        {demoInquiries.map((inq, i) => <button key={inq.id} className={`dashboard-row${i === selected ? ' selected' : ''}`} onClick={() => setSelected(i)}>
          <span className="dashboard-id">{inq.id}</span>
          <span className="dashboard-business">{inq.business}</span>
          <span className="dashboard-status" style={{ color: statusColors[inq.status] }}>{inq.status}</span>
          <span className="dashboard-age">{inq.age}</span>
        </button>)}
      </div>
      <div className="dashboard-detail">
        <span className="micro">DEMONSTRATION — NOT LIVE DATA</span>
        <div className="dashboard-detail-header">
          <h3>{inquiry.business}</h3>
          <span className="dashboard-detail-status" style={{ background: statusColors[inquiry.status], color: 'white' }}>{inquiry.status}</span>
        </div>
        <div className="dashboard-detail-fields">
          <div><span>Type</span><strong>{inquiry.type}</strong></div>
          <div><span>Owner</span><strong>{inquiry.owner}</strong></div>
          <div><span>Due</span><strong>{inquiry.due}</strong></div>
          <div><span>Age</span><strong>{inquiry.age}</strong></div>
        </div>
        <div className="dashboard-detail-actions">
          <button className="button" disabled>Assign owner</button>
          <button className="button secondary" disabled>Mark complete</button>
        </div>
        <p className="dashboard-disclaimer">This is a static demonstration. The live dashboard connects to your Supabase database and shows real enquiry data.</p>
      </div>
    </div>
  </section>;
}
