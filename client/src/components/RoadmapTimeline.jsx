import React, { useEffect, useRef, useState } from 'react';
import { Map, Calendar, Clock, ChevronRight, BookOpen } from 'lucide-react';

function PhaseCard({ phase, index }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const phaseColors = [
    { accent: '#6366f1', glow: 'rgba(99,102,241,0.2)', tag: 'badge-indigo' },
    { accent: '#06b6d4', glow: 'rgba(6,182,212,0.2)',  tag: 'badge-emerald' },
    { accent: '#a855f7', glow: 'rgba(168,85,247,0.2)', tag: 'badge-purple' }
  ];
  const colors = phaseColors[index % phaseColors.length];

  return (
    <div
      ref={cardRef}
      style={{
        display: 'flex', gap: '24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-35px)',
        transition: `opacity 0.7s ${index * 0.14}s cubic-bezier(0.16,1,0.3,1), transform 0.7s ${index * 0.14}s cubic-bezier(0.16,1,0.3,1)`,
        marginBottom: '28px', position: 'relative'
      }}
    >
      {/* Vertical timeline connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: `rgba(${index === 0 ? '99,102,241' : index === 1 ? '6,182,212' : '168,85,247'},0.15)`,
          border: `2px solid ${colors.accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '1.1rem', color: colors.accent,
          boxShadow: `0 0 20px ${colors.glow}`,
          transition: 'all 0.3s ease',
          flexShrink: 0
        }}>
          {phase.phase}
        </div>
        {/* vertical line below */}
        <div style={{
          width: '2px', flex: 1, minHeight: '20px',
          background: `linear-gradient(to bottom, ${colors.accent}40, transparent)`,
          marginTop: '8px'
        }} />
      </div>

      {/* Card */}
      <div
        className="card-hover-glow"
        style={{
          flex: 1, background: 'rgba(10,15,28,0.7)', padding: '24px', borderRadius: '20px',
          border: `1px solid ${colors.glow}`, marginBottom: '8px'
        }}
      >
        {/* Phase header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{phase.phaseName}</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem',
              color: colors.accent, fontWeight: 700,
              background: colors.glow, padding: '4px 12px', borderRadius: '99px',
              border: `1px solid ${colors.accent}40`
            }}>
              <Calendar size={13} /> {phase.durationWeeks} weeks
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem',
              color: 'var(--text-muted)', fontWeight: 600
            }}>
              <Clock size={13} /> {phase.weeklyHours}h/week
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.55 }}>
          <strong style={{ color: 'var(--text-main)' }}>Objective:</strong> {phase.objective}
        </p>

        {/* Topics grid */}
        {phase.topics?.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Core Topics
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {phase.topics.map((topic, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.82rem', fontWeight: 600, color: colors.accent,
                    background: colors.glow, padding: '4px 12px',
                    borderRadius: '99px', border: `1px solid ${colors.accent}30`,
                    opacity: 0,
                    animation: visible ? `fadeIn 0.4s ${0.1 * i + 0.4}s ease both` : 'none'
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Exercises */}
        {phase.handsOnExercises?.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <BookOpen size={13} /> Hands-on Exercises
            </p>
            {phase.handsOnExercises.map((ex, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                <ChevronRight size={14} color={colors.accent} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{ex}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoadmapTimeline({ roadmap, userInputs }) {
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!roadmap || roadmap.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
      <div
        ref={headerRef}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px',
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)'
        }}
      >
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Map size={24} color="var(--primary-light)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>3. Your Learning Roadmap</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Phase-by-phase curriculum calibrated to {userInputs?.hoursPerDay || 3} hours/day
          </p>
        </div>
      </div>

      <div>
        {roadmap.map((phase, index) => (
          <PhaseCard key={phase.phase} phase={phase} index={index} />
        ))}
      </div>
    </div>
  );
}
