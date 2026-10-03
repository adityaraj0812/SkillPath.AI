import React, { useEffect, useRef, useState } from 'react';
import { Layers, Code, Rocket, Star } from 'lucide-react';

export default function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const diffColors = {
    beginner: { text: '#6ee7b7', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
    intermediate: { text: '#93c5fd', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
    advanced: { text: '#f9a8d4', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.3)' }
  };
  const diff = diffColors[project.difficulty?.toLowerCase()] || diffColors.intermediate;

  return (
    <div
      ref={ref}
      className="card-hover-glow"
      style={{
        background: 'rgba(10,15,28,0.7)', padding: '28px', borderRadius: '20px',
        border: '1px solid var(--border-subtle)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ${index * 0.12}s cubic-bezier(0.16,1,0.3,1), transform 0.6s ${index * 0.12}s cubic-bezier(0.16,1,0.3,1)`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {index % 2 === 0 ? <Layers size={22} color="var(--primary-light)" /> : <Rocket size={22} color="var(--accent-cyan)" />}
        </div>
        <span style={{
          fontSize: '0.78rem', fontWeight: 700, padding: '4px 12px', borderRadius: '99px',
          color: diff.text, background: diff.bg, border: `1px solid ${diff.border}`
        }}>
          {project.difficulty}
        </span>
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>{project.title}</h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '16px' }}>
        {project.description}
      </p>

      {/* Tech Stack */}
      {project.techStack?.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Code size={13} /> Tech Stack
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.techStack.map((tech, i) => (
              <span key={i} className="badge badge-indigo" style={{ fontSize: '0.76rem', padding: '3px 10px' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {project.estimatedHours && (
        <div style={{
          marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--accent-amber)', fontWeight: 600
        }}>
          <Star size={14} />
          <span>~{project.estimatedHours} hours to complete</span>
        </div>
      )}
    </div>
  );
}
