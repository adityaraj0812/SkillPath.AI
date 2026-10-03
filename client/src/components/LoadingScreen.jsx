import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, Brain, Code2, Rocket, Zap } from 'lucide-react';

const ENCOURAGEMENTS = [
  "🚀 You're making a great decision investing in yourself!",
  "💡 Most successful engineers had a structured plan. You're building yours!",
  "🎯 Every hour you study compounds — this roadmap maximizes that return.",
  "🌟 Your future self will thank you for starting today.",
  "⚡ Gemma 4 is analyzing industry requirements in real-time just for you!"
];

export default function LoadingScreen({ userInputs }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [encourageIdx, setEncourageIdx] = useState(0);
  const [dotCount, setDotCount] = useState(1);

  const steps = [
    { label: 'Connecting to Gemma 4 via Gemini API', icon: <Cpu size={20} color="#9b9eff" /> },
    { label: `Evaluating skills against "${userInputs?.careerGoal || 'Target Role'}" requirements`, icon: <Brain size={20} color="#00d4ff" /> },
    { label: `Calculating milestone schedule for ${userInputs?.hoursPerDay || 3}h daily commitment`, icon: <Code2 size={20} color="#bf6fff" /> },
    { label: 'Synthesizing skill gap matrix & project recommendations', icon: <Sparkles size={20} color="#ffb836" /> },
    { label: 'Finalizing structured JSON roadmap response', icon: <Rocket size={20} color="#00e5a0" /> }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2400);
    return () => clearInterval(timer);
  }, [steps.length]);

  useEffect(() => {
    const t = setInterval(() => setEncourageIdx(i => (i + 1) % ENCOURAGEMENTS.length), 3200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setDotCount(d => d === 3 ? 1 : d + 1), 500);
    return () => clearInterval(t);
  }, []);

  const progress = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div style={{ maxWidth: '660px', margin: '50px auto', padding: '20px' }}>
      <div className="glass-panel animate-scale-in" style={{ padding: '44px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

        {/* Background glow effect */}
        <div style={{
          position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,112,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Animated Brain Orb */}
        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 30px' }}>
          {/* Outer ring */}
          <div style={{
            position: 'absolute', inset: '-10px', borderRadius: '50%',
            border: '2px dashed rgba(109,112,255,0.5)',
            animation: 'spinSlow 10s linear infinite'
          }} />
          {/* Middle ring */}
          <div style={{
            position: 'absolute', inset: '-3px', borderRadius: '50%',
            border: '1px solid rgba(0,212,255,0.3)',
            animation: 'spinSlow 7s linear infinite reverse'
          }} />
          {/* Core */}
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(109,112,255,0.5) 0%, rgba(0,212,255,0.45) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 50px rgba(109,112,255,0.5), inset 0 0 20px rgba(0,212,255,0.2)',
            animation: 'orbPulse 2.5s ease-in-out infinite'
          }}>
            <Brain size={46} color="#ffffff" />
          </div>
        </div>

        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '8px' }}>
          Gemma 4 is Crafting Your Roadmap{'.'.repeat(dotCount)}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
          Personalised for&nbsp;
          <strong style={{ color: 'var(--accent-cyan)' }}>{userInputs?.careerGoal}</strong>
        </p>

        {/* Progress bar */}
        <div style={{
          height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px',
          marginBottom: '8px', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))',
            borderRadius: '99px',
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 0 10px rgba(0,212,255,0.5)'
          }} />
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '28px', textAlign: 'right' }}>
          {progress}% complete
        </p>

        {/* Step Sequence */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left',
          background: 'rgba(8, 12, 28, 0.65)', padding: '22px 20px', borderRadius: '16px',
          border: '1px solid var(--border-subtle)', marginBottom: '24px'
        }}>
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                opacity: isCurrent || isDone ? 1 : 0.3,
                transition: 'opacity 0.4s ease',
                transform: isCurrent ? 'scale(1.01)' : 'scale(1)',
              }}>
                <div style={{ width: '26px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                  {isDone ? (
                    <CheckCircle2 size={20} color="var(--accent-emerald)"
                      style={{ animation: isDone ? 'bounceIn 0.4s ease' : 'none' }} />
                  ) : isCurrent ? (
                    <Loader2 size={20} color="var(--primary-light)"
                      style={{ animation: 'spinSlow 1.5s linear infinite' }} />
                  ) : (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-dim)' }} />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  {step.icon}
                  <span style={{
                    fontSize: '0.875rem', lineHeight: 1.4,
                    fontWeight: isCurrent ? 700 : 400,
                    color: isCurrent ? 'var(--text-main)' : isDone ? 'var(--text-muted)' : 'var(--text-dim)'
                  }}>
                    {step.label}{isCurrent ? '.'.repeat(dotCount) : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rotating encouragement */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(109,112,255,0.1) 0%, rgba(0,212,255,0.08) 100%)',
          padding: '14px 20px', borderRadius: '12px',
          border: '1px solid rgba(109,112,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <Zap size={16} color="var(--accent-amber)" />
            <p style={{
              fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500,
              transition: 'opacity 0.5s ease',
            }}>
              {ENCOURAGEMENTS[encourageIdx]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
