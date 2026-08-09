'use client';

import { useState } from 'react';

// ponytail: fictional dashboard illustration — not connected to real data.
const demoInquiries = [
  { id: 'IW-DEMO-01', business: 'Example home service', type: 'Urgent request', status: 'New', due: 'Illustrative due date', age: 'Illustrative age' },
  { id: 'IW-DEMO-02', business: 'Example clinic', type: 'Consultation request', status: 'In progress', due: 'Illustrative due date', age: 'Illustrative age' },
  { id: 'IW-DEMO-03', business: 'Example studio', type: 'Service enquiry', status: 'Awaiting review', due: 'Illustrative due date', age: 'Illustrative age' },
  { id: 'IW-DEMO-04', business: 'Example local business', type: 'Service request', status: 'Completed', due: 'Illustrative due date', age: 'Illustrative age' },
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
    <span className="eyebrow">Dashboard demonstration</span>
    <h2>See a possible review workflow.</h2>
    <p>This fictional illustration shows how review state, due date, and next action can be presented. It is not live owner data, and named assignment is not connected on this site.</p>
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
          <div><span>Assignment</span><strong>Not connected</strong></div>
          <div><span>Due</span><strong>{inquiry.due}</strong></div>
          <div><span>Age</span><strong>{inquiry.age}</strong></div>
        </div>
        <div className="dashboard-detail-actions">
          <button className="button" disabled>Named assignment not connected</button>
          <button className="button secondary" disabled>Mark complete</button>
        </div>
        <p className="dashboard-disclaimer">This is a static demonstration. The private owner dashboard is deployed separately; a real MFA-authenticated owner-session proof remains pending.</p>
      </div>
    </div>
  </section>;
}
