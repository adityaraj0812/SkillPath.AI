import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Target, Clock, Cpu, Users, TrendingUp, Award } from 'lucide-react';

/* ── Typewriter hook ── */
function useTypewriter(words, speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;

    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx));
        setCharIdx(c => c - 1);
      }, speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

const CAREER_WORDS = [
  'Fullstack Developer',
  'AI / ML Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Cloud Architect',
  'Mobile Developer',
];

const STATS = [
  { icon: <Users size={22} color="var(--accent-cyan)" />, value: '10,000+', label: 'Roadmaps Generated' },
  { icon: <TrendingUp size={22} color="var(--accent-emerald)" />, value: '50+', label: 'Career Paths Covered' },
  { icon: <Award size={22} color="var(--accent-amber)" />, value: '98%', label: 'User Satisfaction' },
  { icon: <Sparkles size={22} color="var(--accent-purple)" />, value: 'Gemma 4', label: 'AI Powered' },
];

export default function HeroSection({ onGetStarted }) {
  const career = useTypewriter(CAREER_WORDS, 75, 1600);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStatsVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={{
      textAlign: 'center',
      padding: '70px 20px 30px',
      maxWidth: '1060px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'visible'
    }}>
      {/* Floating ambient orbs */}
      <div className="animate-float" style={{
        position: 'absolute', top: '5%', left: '-80px',
        width: '340px', height: '340px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(109,112,255,0.18) 0%, transparent 70%)',
        filter: 'blur(36px)', pointerEvents: 'none', zIndex: 0
      }} />
      <div className="animate-float-alt" style={{
        position: 'absolute', top: '0', right: '-90px',
        width: '380px', height: '380px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.13) 0%, transparent 70%)',
        filter: 'blur(44px)', pointerEvents: 'none', zIndex: 0
      }} />
      <div className="animate-float" style={{
        position: 'absolute', bottom: '-40px', left: '38%',
        width: '260px', height: '260px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(191,111,255,0.12) 0%, transparent 70%)',
        filter: 'blur(38px)', pointerEvents: 'none', zIndex: 0, animationDelay: '2.5s'
      }} />

      {/* ── Hero Content ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Badge */}
        <div className="badge badge-indigo border-glow-pulse animate-fade-up stagger-1"
          style={{ marginBottom: '28px', padding: '8px 20px', fontSize: '0.88rem' }}>
          <Sparkles size={16} />
          <span>Next-Gen AI Career Intelligence • Hackathon Edition 2024</span>
        </div>

        {/* Main heading */}
        <h1 className="animate-fade-up stagger-2" style={{
          fontSize: 'calc(2.4rem + 1.8vw)', fontWeight: 800,
          lineHeight: 1.12, letterSpacing: '-0.03em', marginBottom: '20px'
        }}>
          Your Personalised Path To
          <br />
          <span className="gradient-text">Becoming A</span>
        </h1>

        {/* Typewriter career title */}
        <div className="animate-fade-up stagger-3" style={{ marginBottom: '26px', minHeight: '60px' }}>
          <span style={{
            fontSize: 'calc(1.6rem + 1.2vw)', fontWeight: 800,
            color: 'var(--accent-cyan)',
            display: 'inline-block',
            textShadow: '0 0 30px rgba(0,212,255,0.4)'
          }}>
            {career}
            <span style={{ animation: 'blink 0.85s step-end infinite', color: 'var(--accent-cyan)', marginLeft: '2px' }}>|</span>
          </span>
        </div>

        {/* Subtitle */}
        <p className="animate-fade-up stagger-3" style={{
          fontSize: '1.15rem', color: 'var(--text-muted)',
          maxWidth: '700px', margin: '0 auto 38px', lineHeight: 1.65
        }}>
          SkillPath AI analyzes your current skillset, identifies the exact gaps, and generates a
          day-by-day learning plan powered by <strong style={{ color: 'var(--primary-light)' }}>Gemma 4</strong> — so you never waste a study hour again.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-up stagger-4" style={{ marginBottom: '60px' }}>
          <button onClick={onGetStarted} className="btn-primary" style={{ fontSize: '1.12rem', padding: '17px 40px' }}>
            <span>Create My Roadmap — It's Free</span>
            <ArrowRight size={21} />
          </button>
          <p style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            ⚡ Takes &lt;30 seconds • No sign-up required
          </p>
        </div>

        {/* ── Motivational Stats Bar ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '14px',
          padding: '28px',
          background: 'rgba(12, 18, 36, 0.7)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          backdropFilter: 'blur(16px)',
          marginBottom: '40px'
        }}>
          {STATS.map((stat, i) => (
            <div
              key={i}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                padding: '10px 0',
                borderRight: i < STATS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'translateY(0)' : 'translateY(14px)',
                transition: `opacity 0.6s ${i * 0.1 + 0.8}s ease, transform 0.6s ${i * 0.1 + 0.8}s cubic-bezier(0.16,1,0.3,1)`
              }}
            >
              {stat.icon}
              <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                className="gradient-text-static">{stat.value}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* ── Feature Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px'
        }}>
          {[
            {
              icon: <Target size={26} color="var(--primary-light)" />,
              title: 'Precision Gap Analysis',
              desc: 'Identifies critical missing skills between your current stack and your target role.',
              delay: 'stagger-4'
            },
            {
              icon: <Clock size={26} color="var(--accent-cyan)" />,
              title: 'Pace-Calibrated Timeline',
              desc: 'Calculates a realistic, week-by-week plan based on your actual daily study hours.',
              delay: 'stagger-5'
            },
            {
              icon: <Cpu size={26} color="var(--accent-purple)" />,
              title: 'Real Gemma 4 AI',
              desc: 'No static templates — dynamic structured JSON directly from the Gemini API.',
              delay: 'stagger-6'
            }
          ].map((card, i) => (
            <div
              key={i}
              className={`gradient-border-card card-hover-glow animate-fade-up ${card.delay}`}
              style={{ padding: '24px', textAlign: 'left', background: 'rgba(12,18,36,0.75)' }}
            >
              <div style={{
                width: '50px', height: '50px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px'
              }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '7px' }}>{card.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
