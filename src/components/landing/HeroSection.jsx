import { GamepadIcon, ArrowRightIcon, SparklesIcon } from './Icons';
import QuizDemo from './QuizDemo';
import { PixelCanvas, cellNoise, makeRamp } from './PixelCanvas';

/* ---------------------------------------------------------------------------
 * Hero pixel mosaic: light cream centre → soft peach/orange rings →
 * lightened navy (slate-blue) at the outer edges, fading into the page cream.
 * ------------------------------------------------------------------------- */
const HERO_CELL = 56;
const HERO_STEPS = 9;

const heroRamp = makeRamp([
  [0.0, '#fffbf5'], // near-white cream
  [0.22, '#fff1e2'], // pale cream
  [0.4, '#fde3cb'], // light peach
  [0.56, '#fad4b2'], // light brand orange
  [0.7, '#f1d9cb'], // peach → slate blend
  [0.84, '#dfe2ec'], // pale slate
  [1.0, '#cdd5e5'], // lightened navy
]);

const PAGE_CREAM = [250, 247, 242]; // #faf7f2

const paintHero = (cx, cy, cols, rows) => {
  // Distance from a point just above centre, measured in cell space so rings stay round.
  const dx = (cx + 0.5 - cols / 2) / (cols * 0.5);
  const dy = (cy + 0.5 - rows * 0.36) / (rows * 0.6);
  // Blend round + square distance for Gizmo-style blocky rings.
  const d = 0.6 * Math.hypot(dx, dy) + 0.4 * Math.max(Math.abs(dx), Math.abs(dy));
  const jitter = (cellNoise(cx, cy) - 0.5) * 0.14;
  const t = Math.min(1, Math.max(0, Math.round((d + jitter) * HERO_STEPS) / HERO_STEPS));
  const rgb = heroRamp(t);

  // Stepped fade into the page cream across the bottom 40%.
  const v = (cy + 0.5) / rows;
  const fade = v < 0.6 ? 0 : Math.min(1, Math.round(((v - 0.6) / 0.4) * 5) / 5);
  return [
    rgb[0] + (PAGE_CREAM[0] - rgb[0]) * fade,
    rgb[1] + (PAGE_CREAM[1] - rgb[1]) * fade,
    rgb[2] + (PAGE_CREAM[2] - rgb[2]) * fade,
    1,
  ];
};

export const HeroSection = ({ onStartLearning, onExplore }) => {
  return (
    <section id="home" className="kasalig-hero-modern">
      <PixelCanvas cell={HERO_CELL} paint={paintHero} className="hero-pixel-bg" />

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
