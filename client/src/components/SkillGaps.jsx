import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Target, ShieldAlert } from 'lucide-react';

export default function SkillGaps({ skillGaps }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!skillGaps || skillGaps.length === 0) return null;

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': case 'critical': return 'badge-amber';
      case 'medium': return 'badge-indigo';
      case 'low': return 'badge-purple';
      default: return 'badge-indigo';
    }
  };

  return (
    <div
      ref={sectionRef}
      className="glass-panel"
      style={{
        padding: '32px', marginBottom: '32px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.65s 0.1s cubic-bezier(0.16,1,0.3,1), transform 0.65s 0.1s cubic-bezier(0.16,1,0.3,1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ShieldAlert size={24} color="var(--accent-amber)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>2. Skill Gaps & Focus Areas</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Missing technical competencies required to achieve your target role
          </p>
        </div>
      </div>

      <div className="grid-2">
        {skillGaps.map((gap, index) => (
          <div
            key={index}
            className="card-hover-glow"
            style={{
              background: 'rgba(10,15,28,0.65)', padding: '20px 24px', borderRadius: '16px',
              border: '1px solid var(--border-subtle)', position: 'relative',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ${0.08 * index + 0.2}s ease, transform 0.5s ${0.08 * index + 0.2}s cubic-bezier(0.16,1,0.3,1)`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className={`badge ${getPriorityClass(gap.priority)}`}>
                <AlertCircle size={13} />
                {gap.priority || 'High'} Priority
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {gap.category || 'Core Skill'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>{gap.skill}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
              {gap.reasoning}
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem',
              color: 'var(--accent-cyan)', fontWeight: 600,
              paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
              <Target size={14} />
              <span>Target: {gap.targetProficiency || 'Production Ready'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
