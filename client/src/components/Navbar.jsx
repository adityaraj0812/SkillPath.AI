import React from 'react';
import { Compass, Sparkles, RefreshCw } from 'lucide-react';

export default function Navbar({ onStartNew, onGoHome, currentStep, modelUsed }) {
  return (
    <nav
      className="animate-nav"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <div
        onClick={onGoHome}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      >
        {/* Logo icon with subtle orb pulse */}
        <div
          className="orb-pulse"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)'
          }}
        >
          <Compass size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            SkillPath<span style={{ color: 'var(--primary-light)' }}>.AI</span>
          </h1>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
            Powered by <strong style={{ color: '#38bdf8' }}>Gemma 4</strong> via Gemini API
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          className="badge badge-indigo border-glow-pulse"
          style={{ padding: '6px 14px' }}
        >
          <Sparkles size={14} />
          <span>Gemma 4 Intelligence</span>
        </div>

        {currentStep === 'dashboard' && (
          <button
            onClick={onStartNew}
            className="btn-secondary"
            style={{ fontSize: '0.88rem', padding: '9px 16px' }}
          >
            <RefreshCw size={15} />
            New Roadmap
          </button>
        )}
      </div>
    </nav>
  );
}
