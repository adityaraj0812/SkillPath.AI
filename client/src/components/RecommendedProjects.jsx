import React, { useEffect, useRef, useState } from 'react';
import { Rocket, Clock, Star } from 'lucide-react';

export default function RecommendedProjects({ projects }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!projects || projects.length === 0) return null;

  const diffColors = {
    beginner:     { text: '#5fffc9', bg: 'rgba(0,229,160,0.10)',  border: 'rgba(0,229,160,0.25)' },
    intermediate: { text: '#9b9eff', bg: 'rgba(109,112,255,0.10)', border: 'rgba(109,112,255,0.25)' },
    advanced:     { text: '#fda4af', bg: 'rgba(255,79,123,0.10)', border: 'rgba(255,79,123,0.25)' },
  };


  return (
    <div
      ref={sectionRef}
      className="glass-panel"
      style={{
        padding: '32px', marginBottom: '32px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.7s 0.1s cubic-bezier(0.16,1,0.3,1), transform 0.7s 0.1s cubic-bezier(0.16,1,0.3,1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(191,111,255,0.12)', border: '1px solid rgba(191,111,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Rocket size={24} color="var(--accent-purple)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>4. Portfolio Projects &amp; Practical Applications</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Hands-on builds designed to prove competency to recruiters and engineering leads
          </p>
        </div>
      </div>

      <div className="grid-2">
        {projects.map((proj, idx) => {
          const diff = diffColors[proj.difficulty?.toLowerCase()] || diffColors.intermediate;
          return (
            <div
              key={idx}
              className="card-hover-glow"
              style={{
                background: 'rgba(8,12,28,0.7)', padding: '26px', borderRadius: '20px',
                border: `1px solid ${diff.border}`,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(22px)',
                transition: `opacity 0.6s ${idx * 0.14 + 0.2}s ease, transform 0.6s ${idx * 0.14 + 0.2}s cubic-bezier(0.16,1,0.3,1)`
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '99px',
                    color: diff.text, background: diff.bg, border: `1px solid ${diff.border}`,
                    display: 'flex', alignItems: 'center', gap: '5px'
                  }}>
                    <Star size={12} /> {proj.difficulty || 'Intermediate'} Project
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> ~{proj.estimatedHours || 15}h build
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>{proj.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.55 }}>
                  {proj.description}
                </p>
              </div>
              <div>
                {proj.techStack?.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      Tech Stack
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {proj.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="code-font" style={{
                          background: 'rgba(109,112,255,0.08)', border: '1px solid rgba(109,112,255,0.2)',
                          color: 'var(--primary-light)', padding: '3px 10px',
                          borderRadius: '6px', fontSize: '0.78rem'
                        }}>{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
                {proj.keySkillsLearned?.length > 0 && (
                  <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.79rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      ✓ {proj.keySkillsLearned.join(' • ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
