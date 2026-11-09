import { GamepadIcon, ArrowRightIcon, SparklesIcon } from './Icons';
import QuizDemo from './QuizDemo';

export const HeroSection = ({ onStartLearning, onExplore }) => {
  return (
    <section id="home" className="kasalig-hero-modern">
      {/* Ambient background sparkles */}
      <div className="hero-sparkle sparkle-top-left">
        <SparklesIcon size={24} color="#FDE68A" />
      </div>
      <div className="hero-sparkle sparkle-top-right">
        <SparklesIcon size={24} color="#FDE68A" />
      </div>

      <div className="kasalig-container hero-center-wrapper">
        {/* Top Tagline Pill Badge */}
        <div className="hero-tag-pill">
          <span className="tag-brand-chip">KASALIG bAI</span>
          <span className="tag-slogan">UNDERSTAND.IMPROVE.EXCEL</span>
        </div>

        {/* Main Headline with Wavy Ribbon Underline */}
        <h1 className="hero-giant-heading">
          Learning Should<br />
          Never Leave<br />
          <span className="heading-highlight-word">
            Anyone Behind.
            {/* Playful wavy SVG squiggle underline */}
            <svg 
              className="wavy-underline-svg" 
              viewBox="0 0 320 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M5 12C20 4 35 18 50 12C65 6 80 18 95 12C110 6 125 18 140 12C155 6 170 18 185 12C200 6 215 18 230 12C245 6 260 18 275 12C290 6 305 18 315 12" 
                stroke="#DE7A40" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
              />
            </svg>
          </span>
        </h1>

        {/* Subtitles */}
        <p className="hero-lead-text">
          AI quizzes and diagnostic telemetry that make studying easy.
        </p>
        <blockquote className="hero-quote-text">
          “Every student learns differently. Every learning gap deserves attention.”
        </blockquote>

        {/* Action Buttons */}
        <div className="hero-buttons-row">
          <button
            type="button"
            className="hero-btn-dark-pill"
            onClick={onStartLearning}
          >
            <GamepadIcon size={18} color="#FFFFFF" />
            <span>Start learning</span>
          </button>

          <button
            type="button"
            className="hero-btn-white-pill"
            onClick={onExplore}
          >
            <span>Explore How It Works</span>
            <ArrowRightIcon size={15} color="#1E293B" />
          </button>
        </div>

        {/* Interactive & Animated Quiz Demonstration Card */}
        <div className="hero-interactive-quiz-container">
          <QuizDemo />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
