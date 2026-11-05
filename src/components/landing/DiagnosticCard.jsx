import React from 'react';
import { 
  CheckCircleIcon, 
  PlayCircleIcon, 
  LockIcon, 
  TrendLineIcon, 
  AlertTriangleIcon 
} from './Icons';

export const DiagnosticCard = () => {
  return (
    <div className="diagnostic-card-container">
      {/* Card Header */}
      <div className="diagnostic-card-header">
        <div className="diagnostic-header-left">
          <div className="diagnostic-avatar-badge">KA</div>
          <div className="diagnostic-header-meta">
            <h4 className="diagnostic-canvas-title">Diagnostic Canvas • Term 2</h4>
            <span className="diagnostic-canvas-sub">Mathematics • Algebraic Foundations</span>
          </div>
        </div>
        <div className="diagnostic-active-badge">
          ACTIVE ANALYSIS
        </div>
      </div>

      {/* Mastery & AI Finding Section */}
      <div className="diagnostic-summary-grid">
        {/* Donut Progress Ring */}
        <div className="diagnostic-gauge-wrapper">
          <div className="diagnostic-donut-container">
            <svg viewBox="0 0 100 100" className="diagnostic-donut-svg">
              {/* Background circle track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F3EDE4"
                strokeWidth="11"
              />
              {/* Progress stroke: circumference = 2 * pi * 40 = 251.32. 78% of 251.32 = 196.03 */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#C86A2E"
                strokeWidth="11"
                strokeDasharray="251.32"
                strokeDashoffset={251.32 * (1 - 0.78)}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="diagnostic-donut-text">
              <span className="donut-percentage">78%</span>
              <span className="donut-label">MASTERY</span>
            </div>
          </div>
        </div>

        {/* AI Diagnostic Finding Box */}
        <div className="diagnostic-finding-content">
          <h5 className="finding-headline">AI Diagnostic Finding:</h5>
          <p className="finding-text">
            Solid grasp of linear equalities, but{' '}
            <span className="highlight-gap-term">Quadratic Factoring</span> has a 34% gap from
            missing sign rule fundamentals.
          </p>
          <div className="finding-pinpoint-alert">
            <AlertTriangleIcon size={14} color="#D97706" />
            <span>1 Priority Topic Pinpointed</span>
          </div>
        </div>
      </div>

      {/* Recovery Path Header */}
      <div className="recovery-path-header">
        <span className="recovery-title">PERSONALIZED RECOVERY PATH</span>
        <span className="recovery-step-indicator">Step 2 of 4</span>
      </div>

      {/* Steps List */}
      <div className="recovery-steps-list">
        {/* Step 1: Completed */}
        <div className="recovery-step-row completed">
          <div className="step-icon-wrap">
            <CheckCircleIcon size={18} color="#C2672D" />
          </div>
          <div className="step-details">
            <h6 className="step-title">Diagnostic Quiz: Polynomials</h6>
            <p className="step-sub">Completed in 14 mins • 8 Items checked</p>
          </div>
          <div className="step-status-tag completed-tag">100%</div>
        </div>

        {/* Step 2: Active */}
        <div className="recovery-step-row active-step">
          <div className="step-icon-wrap">
            <PlayCircleIcon size={18} color="#8C3E14" />
          </div>
          <div className="step-details">
            <h6 className="step-title">Targeted Drill: Negative Signs in Factoring</h6>
            <p className="step-sub">Bespoke 6-question micro-session</p>
          </div>
          <div className="step-status-tag active-tag">Active</div>
        </div>

        {/* Step 3: Upcoming / Locked */}
        <div className="recovery-step-row upcoming-step">
          <div className="step-icon-wrap">
            <LockIcon size={16} color="#94A3B8" />
          </div>
          <div className="step-details">
            <h6 className="step-title text-muted">Curated Video: Visualizing Roots</h6>
            <p className="step-sub text-muted">4-minute regional language breakdown</p>
          </div>
          <div className="step-status-tag upcoming-tag">Upcoming</div>
        </div>
      </div>

      {/* Card Footer Bar */}
      <div className="diagnostic-card-footer">
        <div className="projected-recovery">
          <TrendLineIcon size={15} color="#8C3E14" />
          <span>Projected recovery: <strong>+22% score jump in 3 days</strong></span>
        </div>
        <div className="confidence-pill">
          Kasalig Confidence: <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticCard;

