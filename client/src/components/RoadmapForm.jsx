import React, { useState } from 'react';
import { Sparkles, Target, Award, Clock, ArrowRight, Zap, Code } from 'lucide-react';

export default function RoadmapForm({ onSubmit, isLoading }) {
  const [currentSkills, setCurrentSkills] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample presets for quick hackathon testing
  const samplePresets = [
    {
      label: '🚀 Fullstack Developer',
      skills: 'HTML, CSS, JavaScript basics, React, Git',
      goal: 'Senior Fullstack MERN & Next.js Engineer',
      level: 'Intermediate',
      hours: 3
    },
    {
      label: '🤖 AI / ML Engineer',
      skills: 'Python, NumPy, Pandas, Basic Linear Algebra',
      goal: 'AI Applications Engineer (LLMs, RAG, PyTorch)',
      level: 'Beginner',
      hours: 4
    },
    {
      label: '☁️ DevOps & Cloud Specialist',
      skills: 'Linux, Shell Scripting, Docker, Networking',
      goal: 'Cloud Platform & Kubernetes Engineer',
      level: 'Intermediate',
      hours: 2
    }
  ];

  const applyPreset = (preset) => {
    setCurrentSkills(preset.skills);
    setCareerGoal(preset.goal);
    setExperienceLevel(preset.level);
    setHoursPerDay(preset.hours);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentSkills.trim()) {
      setErrorMsg('Please enter at least one current skill.');
      return;
    }
    if (!careerGoal.trim()) {
      setErrorMsg('Please enter your desired career goal.');
      return;
    }
    setErrorMsg('');

    onSubmit({
      currentSkills: currentSkills.trim(),
      careerGoal: careerGoal.trim(),
      experienceLevel,
      hoursPerDay: Number(hoursPerDay)
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="badge badge-indigo" style={{ marginBottom: '12px' }}>
            <Zap size={14} />
            <span>AI Roadmap Builder</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
            Build Your Personalized Career Path
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Provide your details below for Gemma 4 to craft your custom learning roadmap.
          </p>
        </div>

        <div style={{ marginBottom: '28px', padding: '16px 20px', background: 'rgba(109,112,255,0.05)', borderRadius: '14px', border: '1px solid rgba(109,112,255,0.15)' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '10px', letterSpacing: '0.04em' }}>
            ⚡ QUICK DEMO PRESETS — CLICK TO PREFILL:
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                style={{
                  background: 'rgba(109,112,255,0.10)',
                  border: '1px solid rgba(109,112,255,0.25)',
                  color: 'var(--primary-light)',
                  padding: '7px 16px',
                  borderRadius: '20px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(109,112,255,0.22)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(109,112,255,0.10)'}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(255,79,123,0.12)',
            border: '1px solid rgba(255,79,123,0.35)',
            color: '#fda4af',
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Current Skills */}
          <div className="input-group">
            <label className="input-label">
              <Code size={16} color="var(--primary-light)" />
              Your Current Skills & Technologies
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g. JavaScript, HTML/CSS, React, Basic Node.js, Git..."
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              required
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Separate skills with commas. Include languages, tools, or frameworks you already know.
            </span>
          </div>

          {/* Desired Career Goal */}
          <div className="input-group">
            <label className="input-label">
              <Target size={16} color="var(--accent-cyan)" />
              Desired Career Goal / Target Role
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Senior Fullstack Developer, AI Engineer, Backend Lead..."
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              required
            />
          </div>

          {/* Experience Level & Hours per Day Grid */}
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">
                <Award size={16} color="var(--accent-purple)" />
                Current Experience Level
              </label>
              <select
                className="form-control"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="Beginner">Beginner (0 - 1 year)</option>
                <option value="Intermediate">Intermediate (1 - 3 years)</option>
                <option value="Advanced">Advanced (3+ years / Career Switcher)</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">
                <Clock size={16} color="var(--accent-amber)" />
                Study Time per Day: <strong style={{ color: 'var(--accent-amber)' }}>{hoursPerDay} hours</strong>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                style={{ accentColor: 'var(--primary-light)', marginTop: '8px', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                <span>1h / day</span>
                <span>4h / day</span>
                <span>8h / day</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '10px' }}
          >
            <Sparkles size={18} />
            <span>Generate Gemma 4 Roadmap</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
