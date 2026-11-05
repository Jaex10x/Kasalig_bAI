import React from 'react';
import { TrophyIcon, ArrowRightIcon } from './Icons';

export const CtaBannerSection = ({ onGetStarted }) => {
  return (
    <section className="kasalig-cta-banner-section">
      <div className="kasalig-container">
        <div className="cta-banner-card">
          {/* Subtle Ambient Radial Glow */}
          <div className="cta-banner-glow"></div>

          {/* Badge */}
          <div className="cta-initiative-badge">
            <TrophyIcon size={16} color="#F59E0B" />
            <span>KASALIG bAI • ACADEMIC EXCELLENCE INITIATIVE</span>
          </div>

          {/* Heading */}
          <h2 className="cta-banner-headline">
            Every Improvement Starts<br />
            With Understanding.
          </h2>

          {/* Subtitle */}
          <p className="cta-banner-subtitle">
            Take the first step toward a better learning experience with Kasalig AI.
            Start diagnosing learning gaps today and watch confidence follow.
          </p>

          {/* Interactive CTA Buttons */}
          <div className="cta-banner-actions">
            <button 
              type="button" 
              className="cta-btn-primary"
              onClick={onGetStarted}
            >
              <span>Get Started Free</span>
              <ArrowRightIcon size={16} color="#FFFFFF" />
            </button>
            <a href="#how-it-works" className="cta-btn-secondary">
              Explore Demo Walkthrough
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBannerSection;

