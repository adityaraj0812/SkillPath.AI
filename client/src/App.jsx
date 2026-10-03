import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import FeatureCards from './components/FeatureCards.jsx';
import RoadmapForm from './components/RoadmapForm.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import Dashboard from './components/Dashboard.jsx';
import { fetchGeneratedRoadmap, checkServerHealth } from './services/api.js';
import { AlertTriangle, RefreshCw, Star, Heart } from 'lucide-react';

/* ── CSS-only twinkling star particles ── */
function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 55 }, (_, i) => ({
      id: i,
      top:  `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      dur:  `${2.5 + Math.random() * 4.5}s`,
      delay:`${Math.random() * 6}s`,
      size: `${1 + Math.random() * 2}px`,
      opacity: 0.08 + Math.random() * 0.25
    }));
  }, []);

  return (
    <div className="stars-layer" aria-hidden="true">
      {stars.map(s => (
        <span
          key={s.id}
          className="star twinkle"
          style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            opacity: s.opacity,
            '--dur': s.dur,
            animationDelay: s.delay
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  // Steps: 'landing' | 'form' | 'loading' | 'dashboard' | 'error'
  const [currentStep, setCurrentStep] = useState('landing');
  const [userInputs, setUserInputs] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [errorDetails, setErrorDetails] = useState('');
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    // Ping server health on mount
    checkServerHealth().then((res) => {
      setServerStatus(res);
    });
  }, []);

  const handleFormSubmit = async (formData) => {
    setUserInputs(formData);
    setCurrentStep('loading');
    setErrorDetails('');

    try {
      const data = await fetchGeneratedRoadmap(formData);
      setRoadmapData(data);
      setCurrentStep('dashboard');
    } catch (err) {
      console.error('Roadmap Generation Error:', err);
      setErrorDetails(err.message || 'An error occurred while generating your roadmap with Gemma 4.');
      setCurrentStep('error');
    }
  };

  const handleReset = () => {
    setCurrentStep('landing');
    setRoadmapData(null);
    setErrorDetails('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Background star field — always rendered */}
      <StarField />

      <Navbar
        onStartNew={handleReset}
        onGoHome={handleReset}
        currentStep={currentStep}
        modelUsed={roadmapData?.modelUsed}
      />

      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {currentStep === 'landing' && (
          <>
            <HeroSection onGetStarted={() => setCurrentStep('form')} />
            <FeatureCards />
          </>
        )}

        {currentStep === 'form' && (
          <div style={{ padding: '40px 0' }}>
            <RoadmapForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {currentStep === 'loading' && (
          <LoadingScreen userInputs={userInputs} />
        )}

        {currentStep === 'dashboard' && roadmapData && (
          <Dashboard roadmapData={roadmapData} onStartNew={() => setCurrentStep('form')} />
        )}

        {currentStep === 'error' && (
          <div style={{ maxWidth: '600px', margin: '80px auto', padding: '40px', textAlign: 'center' }} className="glass-panel animate-scale-in">
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(255, 79, 123, 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', border: '1px solid rgba(255, 79, 123, 0.3)'
            }}>
              <AlertTriangle size={32} color="var(--accent-rose)" />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px' }}>
              Roadmap Generation Notice
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
              {errorDetails || 'Unable to connect to Gemma 4 via Gemini API.'}
            </p>
            <div style={{ background: 'rgba(8, 12, 28, 0.7)', padding: '16px', borderRadius: '12px', textAlign: 'left', marginBottom: '28px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              <strong>Troubleshooting Tips:</strong>
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                <li>Ensure <code>GEMINI_API_KEY</code> is set in <code>server/.env</code></li>
                <li>Verify your network connection to the Gemini API</li>
                <li>Check backend server logs on port 5001</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button onClick={() => setCurrentStep('form')} className="btn-primary">
                <RefreshCw size={16} /> Try Again
              </button>
              <button onClick={handleReset} className="btn-secondary">Back to Home</button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '28px 40px',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
        background: 'rgba(5, 8, 15, 0.9)',
        position: 'relative', zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          <Star size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Every expert was once a beginner. Your roadmap starts today.
          </span>
          <Star size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          SkillPath AI • AI Hackathon Edition • Built with
          <Heart size={12} fill="var(--accent-rose)" color="var(--accent-rose)" />
          React, Node.js, Express &amp; Gemma 4 via Gemini API
        </p>
      </footer>
    </div>
  );
}
