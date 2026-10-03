import React, { useState, useEffect, useRef } from 'react';
import { Award, CheckCircle, Clock, Zap, Star } from 'lucide-react';

/* Animated number counter hook */
function useCountUp(target, duration = 1200, delay = 400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return count;
}

export default function SkillAssessment({ assessment, userInputs }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const score = assessment?.levelScore || 65;
  const animatedScore = useCountUp(visible ? score : 0, 1000, 300);

  if (!assessment) return null;

  return (
    <div
      ref={sectionRef}
      className="glass-panel"
      style={{
        padding: '32px',
        marginBottom: '32px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Award size={24} color="var(--primary-light)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              1. Skill Assessment & Readiness
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              AI analysis of your starting foundation vs. target standards
            </p>
          </div>
        </div>
        <div className="badge badge-indigo border-glow-pulse" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          <Zap size={15} />
          <span>Readiness: {assessment.readinessRating || 'Intermediate'}</span>
        </div>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '200px 1fr 1fr', marginBottom: '24px' }}>
        {/* Animated Score Card */}
        <div style={{
          background: 'rgba(10,15,28,0.7)', padding: '24px', borderRadius: '16px',
          border: '1px solid var(--border-subtle)', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>
            FOUNDATION SCORE
          </span>

          {/* Animated SVG ring */}
          <div style={{ position: 'relative', margin: '14px 0 8px' }}>
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="url(#scoreGrad)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - animatedScore / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.05s ease' }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #818cf8, #38bdf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {animatedScore}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '3px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={13}
                fill={star <= Math.round(score / 20) ? '#f59e0b' : 'none'}
                color={star <= Math.round(score / 20) ? '#f59e0b' : '#334155'}
              />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{
          background: 'rgba(10,15,28,0.7)', padding: '24px', borderRadius: '16px',
          border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-light)' }}>
            Gemma 4 Evaluative Summary
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{assessment.summary}</p>
        </div>

        {/* Pace Analysis */}
        <div style={{
          background: 'rgba(10,15,28,0.7)', padding: '24px', borderRadius: '16px',
          border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Clock size={18} color="var(--accent-amber)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-amber)' }}>Pace Calculation</h4>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {assessment.timeCommitmentAnalysis || `At ${userInputs?.hoursPerDay || 3} hours daily, you have a consistent structure.`}
          </p>
        </div>
      </div>

      {/* Strengths */}
      {assessment.strengths?.length > 0 && (
        <div style={{
          background: 'rgba(16,185,129,0.08)', padding: '16px 20px', borderRadius: '12px',
          border: '1px solid rgba(16,185,129,0.2)'
        }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
            Verified Current Strengths
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {assessment.strengths.map((str, i) => (
              <span
                key={i}
                className={`badge badge-emerald animate-scale-in`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <CheckCircle size={13} />
                {str}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
