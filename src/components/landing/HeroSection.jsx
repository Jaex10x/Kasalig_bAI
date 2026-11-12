import { GamepadIcon, ArrowRightIcon, SparklesIcon } from './Icons';
import QuizDemo from './QuizDemo';
import { PixelCanvas, cellNoise, makeRamp } from './PixelCanvas';

/* ---------------------------------------------------------------------------
 * Hero pixel mosaic: near-white centre → tinted rings → cooler outer edges,
 * fading into the page cream.
 * Every HERO_TICK_MS the whole mosaic cross-fades to the next palette in
 * HERO_PALETTES (Gizmo-style colour cycling); the blocks also re-roll and the
 * rings gently breathe in and out.
 * ------------------------------------------------------------------------- */
const HERO_CELL = 56;
const HERO_STEPS = 9;
const HERO_TICK_MS = 1000;
const HERO_FADE_MS = 600;

// Ring positions shared by every palette: centre → mid rings → outer edge.
const HERO_STOPS = [0.0, 0.22, 0.4, 0.56, 0.7, 0.84, 1.0];

// Ordered around the colour wheel so each change flows into the next.
// The first entry is the brand palette (also the static, reduced-motion frame).
// All palettes stay pastel so the dark heading and orange highlight stay readable.
const HERO_PALETTES = [
  ['#fffbf5', '#fff1e2', '#fde3cb', '#fad4b2', '#f1d9cb', '#dfe2ec', '#cdd5e5'], // brand peach → slate
  ['#fffdf3', '#fff6d8', '#fdeab2', '#f9dc8c', '#f1e0a8', '#e3e5c6', '#cfe3cf'], // sunny yellow → sage
  ['#f7fffa', '#e4fbee', '#c6f3da', '#a3e8c4', '#aee6d4', '#bfe6e4', '#abdcde'], // mint → teal
  ['#f6fbff', '#e2f1ff', '#c6e2fd', '#a6cefa', '#b6cdf5', '#cacef2', '#bfc1ec'], // sky → indigo
  ['#fbf8ff', '#efe7ff', '#dfd0fd', '#cbb4f8', '#d4c1f2', '#e2cdee', '#eac6e2'], // lilac → orchid
  ['#fff7f9', '#ffe5ec', '#fdcfda', '#f9b3c5', '#f3c2ce', '#ecd2db', '#e0cee0'], // rose → mauve
].map((colors) => makeRamp(colors.map((hex, i) => [HERO_STOPS[i], hex])));

const PAGE_CREAM = [250, 247, 242]; // #faf7f2

const paintHero = (cx, cy, cols, rows, tick = 0) => {
  // Distance from a point just above centre, measured in cell space so rings stay round.
  const dx = (cx + 0.5 - cols / 2) / (cols * 0.5);
  const dy = (cy + 0.5 - rows * 0.36) / (rows * 0.6);
  // Blend round + square distance for Gizmo-style blocky rings.
  const d = 0.6 * Math.hypot(dx, dy) + 0.4 * Math.max(Math.abs(dx), Math.abs(dy));
  // Per-cell jitter re-rolls on every tick; the sine drifts the rings in/out.
  const jitter = (cellNoise(cx, cy, tick) - 0.5) * 0.14;
  const breathe = Math.sin(tick * 0.8) * 0.035;
  const t = Math.min(1, Math.max(0, Math.round((d + jitter + breathe) * HERO_STEPS) / HERO_STEPS));
  // Each tick moves on to the next palette.
  const rgb = HERO_PALETTES[tick % HERO_PALETTES.length](t);

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
      <PixelCanvas
        cell={HERO_CELL}
        paint={paintHero}
        className="hero-pixel-bg"
        interval={HERO_TICK_MS}
        fade={HERO_FADE_MS}
      />

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
