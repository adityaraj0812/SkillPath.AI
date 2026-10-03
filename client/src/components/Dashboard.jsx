import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Share2, Printer, Sparkles, RefreshCw, Cpu, Layers } from 'lucide-react';

import SkillAssessment from './SkillAssessment.jsx';
import SkillGaps from './SkillGaps.jsx';
import RoadmapTimeline from './RoadmapTimeline.jsx';
import RecommendedProjects from './RecommendedProjects.jsx';
import NextSteps from './NextSteps.jsx';

export default function Dashboard({ roadmapData, onStartNew }) {
  useEffect(() => {
    // Launch celebratory confetti when roadmap is ready
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  }, []);

  if (!roadmapData) return null;

  const { roadmap, userInputs, modelUsed, createdAt } = roadmapData;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShare = () => {
    const text = `🚀 My Gemma 4 SkillPath AI Roadmap for "${userInputs?.careerGoal}":\nGoal: ${userInputs?.careerGoal}\nReadiness: ${roadmap?.currentSkillAssessment?.readinessRating}\nStudy Plan: ${userInputs?.hoursPerDay}h/day`;
    navigator.clipboard.writeText(text);
    alert('Copied roadmap summary to clipboard!');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>
      {/* Top Action Bar */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-indigo">
              <Cpu size={13} />
              Model: {modelUsed || 'Gemma 4'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Generated on {new Date(createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
            Roadmap to <span className="gradient-text">{userInputs?.careerGoal}</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            Current Experience: <strong>{userInputs?.experienceLevel}</strong> • Pace: <strong>{userInputs?.hoursPerDay}h daily</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleCopyShare} className="btn-secondary">
            <Share2 size={16} />
            Share Summary
          </button>
          <button onClick={handlePrint} className="btn-secondary">
            <Printer size={16} />
            Print / Save PDF
          </button>
          <button onClick={onStartNew} className="btn-primary" style={{ padding: '12px 20px' }}>
            <RefreshCw size={16} />
            New Roadmap
          </button>
        </div>
      </div>

      {/* 1. Skill Assessment */}
      <SkillAssessment
        assessment={roadmap?.currentSkillAssessment}
        userInputs={userInputs}
      />

      {/* 2. Skill Gaps */}
      <SkillGaps
        skillGaps={roadmap?.skillGaps}
      />

      {/* 3. Learning Roadmap Timeline */}
      <RoadmapTimeline
        roadmap={roadmap?.learningRoadmap}
        userInputs={userInputs}
      />

      {/* 4. Recommended Projects */}
      <RecommendedProjects
        projects={roadmap?.recommendedProjects}
      />

      {/* 5. Next Steps */}
      <NextSteps
        nextSteps={roadmap?.nextSteps}
      />
    </div>
  );
}
