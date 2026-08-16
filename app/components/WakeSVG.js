'use client';

import { useEffect, useRef, useState } from 'react';

// ponytail: "The Wake" — substantial hero visualization of the IronWake operating model.
// 9 nodes along a copper wake path. Path stroke draws on scroll-into-view, then nodes pulse one by one.
const WAKE_NODES = [
  { id: 'attention',    label: 'Attention',     desc: 'Captured' },
  { id: 'response',     label: 'Response',      desc: 'First reply' },
  { id: 'qualification', label: 'Qualification', desc: 'Intent + fit' },
  { id: 'routing',       label: 'Routing',       desc: 'To right team' },
  { id: 'crm',           label: 'CRM',           desc: 'Durable record' },
  { id: 'booking',       label: 'Booking',       desc: 'Reviewed request' },
  { id: 'owner',         label: 'Owner',         desc: 'Named, dated' },
  { id: 'follow-up',     label: 'Follow-up',     desc: 'Tracked next action' },
  { id: 'measurement',  label: 'Measurement',   desc: 'Visible state' },
];

// Path drawn through 9 nodes on a 2.5D-curved wake. Coordinates chosen for a 720×260 viewBox.
const WAKE_PATH = 'M 20 130 Q 100 20 180 130 T 340 130 T 500 130 T 660 130 L 700 130';
const NODE_COORDS = [
  { x: 20,  y: 130 },
  { x: 95,  y: 60  },
  { x: 180, y: 130 },
  { x: 260, y: 60  },
  { x: 340, y: 130 },
  { x: 420, y: 60  },
  { x: 500, y: 130 },
  { x: 580, y: 60  },
  { x: 660, y: 130 },
];

export function WakeSVG() {
  const [progress, setProgress] = useState(0); // 0..1 path draw
  const [activeNode, setActiveNode] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      setActiveNode(WAKE_NODES.length - 1);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const totalMs = 1400;
      const start = performance.now();
      const nodeTimers = [];
      function drawTick(now) {
        const t = Math.min(1, (now - start) / totalMs);
        setProgress(t);
        if (t < 1) requestAnimationFrame(drawTick);
        else {
          for (let i = 0; i < WAKE_NODES.length; i++) {
            nodeTimers.push(setTimeout(() => setActiveNode(i), 140 * i));
          }
        }
      }
      requestAnimationFrame(drawTick);
      return () => nodeTimers.forEach(clearTimeout);
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={ref} className="glass wake-figure" aria-label="IronWake operating wake: attention to measurement">
      <svg className="wake-svg" viewBox="0 0 720 260" role="img" aria-label="The Wake — IronWake operating model from attention to measurement">
        <defs>
          <linearGradient id="wake-path" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--copper)" stopOpacity=".4" />
            <stop offset="50%" stopColor="var(--copper)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--aqua)" stopOpacity=".9" />
          </linearGradient>
          <filter id="wake-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base guide line (stone) */}
        <path d={WAKE_PATH} fill="none" stroke="var(--rule)" strokeWidth="1.5" strokeDasharray="2 4" />

        {/* Animated copper wake path */}
        <path
          d={WAKE_PATH}
          fill="none"
          stroke="url(#wake-path)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="900"
          strokeDashoffset={900 - 900 * progress}
          filter="url(#wake-glow)"
        />

        {/* Nodes */}
        {WAKE_NODES.map((n, i) => {
          const { x, y } = NODE_COORDS[i];
          const isActive = i <= activeNode;
          const isCurrent = i === activeNode;
          return (
            <g key={n.id} className={`wake-node${isActive ? ' active' : ''}${isCurrent ? ' current' : ''}`}>
              <circle cx={x} cy={y} r={isCurrent ? 11 : 8} fill="var(--white)" stroke="var(--copper)" strokeWidth="2" />
              <circle cx={x} cy={y} r={isCurrent ? 4 : 3} fill="var(--copper)" />
              <text x={x} y={y + 26} textAnchor="middle" className="wake-label">{n.label}</text>
              <text x={x} y={y + 42} textAnchor="middle" className="wake-desc">{n.desc}</text>
            </g>
          );
        })}

        {/* Travelling pulse along the path */}
        {activeNode >= 0 && activeNode < WAKE_NODES.length - 1 && (
          <circle r="5" fill="var(--copper)" filter="url(#wake-glow)">
            <animateMotion
              dur="2.4s"
              repeatCount="indefinite"
              path={WAKE_PATH}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            />
          </circle>
        )}
      </svg>
      <figcaption className="wake-caption">The Wake — the IronWake operating model from first attention to measurable follow-up.</figcaption>
    </figure>
  );
}
