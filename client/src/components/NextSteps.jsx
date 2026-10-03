import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Clock, Flag, Lightbulb, Zap, Rocket, Star, Trophy } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  { text: "The best time to start was yesterday. The next best time is right now.", author: "— Career Wisdom" },
  { text: "Consistency beats intensity every single time. Show up daily.", author: "— Engineering Principle" },
  { text: "You are closer than you think. Every expert was once exactly where you are.", author: "— Growth Mindset" },
];

export default function NextSteps({ nextSteps }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % MOTIVATIONAL_QUOTES.length), 4500);
    return () => clearInterval(t);
  }, []);

  if (!nextSteps) return null;

  return (
    <div
      ref={sectionRef}
      className="glass-panel"
      style={{
        padding: '36px', marginBottom: '40px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.7s 0.1s cubic-bezier(0.16,1,0.3,1), transform 0.7s 0.1s cubic-bezier(0.16,1,0.3,1)'
      }}
    >
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(0,229,160,0.12)', border: '1px solid rgba(0,229,160,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Rocket size={24} color="var(--accent-emerald)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
            5. Actionable Next Steps &amp; Execution Plan
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Immediate actions to build momentum and lock in your daily study habit
          </p>
        </div>
      </div>

      {/* Motivational quote strip */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(109,112,255,0.10) 0%, rgba(0,212,255,0.07) 100%)',
        padding: '16px 22px', borderRadius: '14px',
        border: '1px solid rgba(109,112,255,0.22)',
        marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px'
      }}>
        <Star size={20} fill="var(--accent-amber)" color="var(--accent-amber)" style={{ flexShrink: 0, animation: 'orbPulse 3s ease-in-out infinite' }} />
        <div style={{ transition: 'opacity 0.5s ease' }}>
          <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            "{MOTIVATIONAL_QUOTES[quoteIdx].text}"
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            {MOTIVATIONAL_QUOTES[quoteIdx].author}
          </span>
        </div>
      </div>

      {/* 3 action columns */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '24px' }}>

        {/* Immediate 48-Hour Action Items */}
        <div className="card-hover-glow" style={{
          background: 'rgba(8,12,28,0.7)', padding: '24px', borderRadius: '18px',
          border: '1px solid rgba(0,229,160,0.15)'
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} /> First 48-Hour Checklist
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {nextSteps.immediateActionItems?.map((item, idx) => (
              <li key={idx} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                fontSize: '0.875rem', color: 'var(--text-muted)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-16px)',
                transition: `opacity 0.5s ${0.15 * idx + 0.4}s ease, transform 0.5s ${0.15 * idx + 0.4}s cubic-bezier(0.16,1,0.3,1)`
              }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)"
                  style={{ flexShrink: 0, marginTop: '2px', animation: visible ? `bounceIn 0.5s ${0.15 * idx + 0.5}s ease both` : 'none' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Daily Routine */}
        <div className="card-hover-glow" style={{
          background: 'rgba(8,12,28,0.7)', padding: '24px', borderRadius: '18px',
          border: '1px solid rgba(109,112,255,0.15)'
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} /> Daily Study Routine
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nextSteps.dailyRoutine?.map((routine, idx) => (
              <div key={idx} style={{
                fontSize: '0.875rem', color: 'var(--text-muted)',
                background: 'rgba(109,112,255,0.05)', padding: '9px 13px',
                borderRadius: '10px', border: '1px solid rgba(109,112,255,0.12)',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ${0.15 * idx + 0.5}s ease`
              }}>
                {routine}
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="card-hover-glow" style={{
          background: 'rgba(8,12,28,0.7)', padding: '24px', borderRadius: '18px',
          border: '1px solid rgba(0,212,255,0.15)'
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flag size={18} /> Target Milestones
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {nextSteps.milestones?.map((milestone, idx) => (
              <div key={idx} style={{
                fontSize: '0.875rem', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(16px)',
                transition: `opacity 0.5s ${0.15 * idx + 0.5}s ease, transform 0.5s ${0.15 * idx + 0.5}s cubic-bezier(0.16,1,0.3,1)`
              }}>
                <Trophy size={15} color="var(--accent-amber)"
                  style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{milestone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gemma Pro-Tip */}
      {nextSteps.proTip && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(109,112,255,0.12) 0%, rgba(191,111,255,0.10) 100%)',
          padding: '22px 26px', borderRadius: '16px',
          border: '1px solid rgba(109,112,255,0.3)',
          display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(255,184,54,0.12)', border: '1px solid rgba(255,184,54,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            animation: 'orbPulse 4s ease-in-out infinite'
          }}>
            <Lightbulb size={22} color="var(--accent-amber)" />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
              ⚡ Gemma 4 Strategy Insight
            </span>
            <p style={{ fontSize: '0.93rem', color: 'var(--text-main)', margin: 0, fontWeight: 500, lineHeight: 1.55 }}>
              "{nextSteps.proTip}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
