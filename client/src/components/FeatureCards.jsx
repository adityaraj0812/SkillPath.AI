import React from 'react';
import { UserCheck, Sparkles, LayoutDashboard, Rocket } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: <UserCheck size={24} color="#818cf8" />,
    title: 'Input Your Background',
    desc: 'Enter your existing skills, career goal, current experience level, and daily study hours.'
  },
  {
    num: '02',
    icon: <Sparkles size={24} color="#38bdf8" />,
    title: 'Gemma 4 Processing',
    desc: 'Gemma 4 evaluates skill depth, industry requirements, and plans a weekly roadmap.'
  },
  {
    num: '03',
    icon: <LayoutDashboard size={24} color="#c084fc" />,
    title: 'Interactive Dashboard',
    desc: 'Receive structured skill assessments, gap matrix, learning phases, and project specs.'
  },
  {
    num: '04',
    icon: <Rocket size={24} color="#34d399" />,
    title: 'Execute & Track',
    desc: 'Follow immediate 48-hour action items, daily study routines, and hands-on milestones.'
  }
];

export default function FeatureCards() {
  return (
    <section style={{ maxWidth: '1100px', margin: '40px auto 80px', padding: '0 20px' }}>
      <div
        className="animate-fade-up stagger-1"
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '10px' }}>
          How SkillPath AI Works
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          From raw profile inputs to a custom career trajectory in seconds.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {steps.map((step, i) => (
          <div
            key={step.num}
            className={`glass-panel card-hover-glow animate-fade-up stagger-${i + 2}`}
            style={{ padding: '28px', position: 'relative' }}
          >
            {/* Big background number */}
            <span style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'rgba(255, 255, 255, 0.05)',
              userSelect: 'none'
            }}>
              {step.num}
            </span>

            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
              border: '1px solid var(--border-subtle)'
            }}>
              {step.icon}
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
