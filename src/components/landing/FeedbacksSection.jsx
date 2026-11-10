import { useState } from 'react';
import { HeartIcon } from './Icons';
import { PixelCanvas, cellNoise } from './PixelCanvas';

/* ---------------------------------------------------------------------------
 * 3D app icons (Understand · Improve · Excel)
 * Gradients + highlights give each glyph volume; the tile itself is shaded in CSS.
 * ------------------------------------------------------------------------- */
const BulbIcon = () => (
  <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true">
    <defs>
      <radialGradient id="fb-bulb-glass" cx="40%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="45%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </radialGradient>
      <linearGradient id="fb-bulb-base" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="45%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <radialGradient id="fb-bulb-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE047" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="19" r="18" fill="url(#fb-bulb-glow)" />
    <g stroke="#FDE68A" strokeWidth="2.2" strokeLinecap="round">
      <line x1="24" y1="2.5" x2="24" y2="5.5" />
      <line x1="9" y1="8" x2="11.2" y2="10.2" />
      <line x1="39" y1="8" x2="36.8" y2="10.2" />
      <line x1="4" y1="20" x2="7" y2="20" />
      <line x1="44" y1="20" x2="41" y2="20" />
    </g>
    <path
      d="M24 8c-7 0-12 5.2-12 11.6 0 4.2 2.2 7 4.3 9 1.4 1.3 2.2 2.9 2.2 4.6V35h11v-1.8c0-1.7.8-3.3 2.2-4.6 2.1-2 4.3-4.8 4.3-9C36 13.2 31 8 24 8z"
      fill="url(#fb-bulb-glass)"
      stroke="#B45309"
      strokeWidth="0.8"
    />
    <path d="M20.5 32v-5.5l3.5-3 3.5 3V32" fill="none" stroke="#B45309" strokeWidth="1.4" strokeLinejoin="round" />
    <ellipse cx="19" cy="15" rx="3" ry="4.5" fill="#FFFFFF" opacity="0.75" transform="rotate(-25 19 15)" />
    <rect x="18.5" y="35" width="11" height="7" rx="2" fill="url(#fb-bulb-base)" />
    <line x1="18.8" y1="37.4" x2="29.2" y2="37.4" stroke="#334155" strokeWidth="0.9" />
    <line x1="18.8" y1="39.6" x2="29.2" y2="39.6" stroke="#334155" strokeWidth="0.9" />
    <path d="M21 42h6l-1 2.5h-4z" fill="#334155" />
  </svg>
);

const ImproveIcon = () => (
  <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true">
    <defs>
      <linearGradient id="fb-bar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#BBF7D0" />
      </linearGradient>
      <linearGradient id="fb-bar-side" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
      <linearGradient id="fb-arrow" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    {/* Isometric bars: front face + darker side face for depth */}
    <path d="M10 40V31h6v9z" fill="url(#fb-bar)" />
    <path d="M16 40V31l2.5-2v9z" fill="url(#fb-bar-side)" />
    <path d="M10 31l2.5-2h6L16 31z" fill="#F0FDF4" />
    <path d="M20 40V24h6v16z" fill="url(#fb-bar)" />
    <path d="M26 40V24l2.5-2v16z" fill="url(#fb-bar-side)" />
    <path d="M20 24l2.5-2h6L26 24z" fill="#F0FDF4" />
    <path d="M30 40V16h6v24z" fill="url(#fb-bar)" />
    <path d="M36 40V16l2.5-2v24z" fill="url(#fb-bar-side)" />
    <path d="M30 16l2.5-2h6L36 16z" fill="#F0FDF4" />
    {/* Rising arrow */}
    <path
      d="M7 27L17 18l6 4.5L36 9"
      fill="none"
      stroke="#92400E"
      strokeOpacity="0.35"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(0.8 1.2)"
    />
    <path d="M7 27L17 18l6 4.5L36 9" fill="none" stroke="url(#fb-arrow)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30 6.5l9-1.5-1.5 9z" fill="#F59E0B" stroke="#FDE047" strokeWidth="0.8" strokeLinejoin="round" />
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true">
    <defs>
      <linearGradient id="fb-gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="30%" stopColor="#FDE68A" />
        <stop offset="55%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="fb-gold-v" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="fb-plinth" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7C2D12" />
        <stop offset="100%" stopColor="#431407" />
      </linearGradient>
    </defs>
    {/* Handles */}
    <path d="M14 11H8c0 7 3 11 8 12" fill="none" stroke="url(#fb-gold-v)" strokeWidth="3" strokeLinecap="round" />
    <path d="M34 11h6c0 7-3 11-8 12" fill="none" stroke="url(#fb-gold-v)" strokeWidth="3" strokeLinecap="round" />
    {/* Cup */}
    <path d="M13 7h22v8c0 7-4.8 12-11 12S13 22 13 15z" fill="url(#fb-gold)" />
    <ellipse cx="24" cy="7" rx="11" ry="2" fill="#FEF3C7" />
    <path d="M17 10v5c0 3.5 1.6 6.5 4 8" fill="none" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round" />
    {/* Star */}
    <path
      d="M24 11.5l1.5 3.1 3.4.5-2.5 2.4.6 3.4-3-1.6-3 1.6.6-3.4-2.5-2.4 3.4-.5z"
      fill="#FFFBEB"
      opacity="0.95"
    />
    {/* Stem + base */}
    <path d="M21.5 27h5l1 6h-7z" fill="url(#fb-gold)" />
    <rect x="16" y="33" width="16" height="3.5" rx="1" fill="url(#fb-gold)" />
    <rect x="14" y="36.5" width="20" height="6" rx="1.5" fill="url(#fb-plinth)" />
    <rect x="19" y="38.3" width="10" height="2.4" rx="0.6" fill="#FBBF24" />
  </svg>
);

const APP_ICONS = [
  { key: 'understand', label: 'Understand', className: 'bubble-understand', Icon: BulbIcon },
  { key: 'improve', label: 'Improve', className: 'bubble-improve', Icon: ImproveIcon },
  { key: 'excel', label: 'Excel', className: 'bubble-excel', Icon: TrophyIcon },
];

/* ---------------------------------------------------------------------------
 * Pixel mosaic glow (behind the feedback cards)
 * ------------------------------------------------------------------------- */
const GLOW_CELL = 18;

// Warm brand-palette blobs: x/y are 0–1 positions, rx/ry are radii (0–1).
const GLOW_BLOBS = [
  { x: 0.18, y: 0.30, rx: 0.16, ry: 0.55, rgb: [255, 226, 190] }, // cream
  { x: 0.36, y: 0.75, rx: 0.14, ry: 0.50, rgb: [251, 191, 36] },  // amber
  { x: 0.50, y: 0.45, rx: 0.18, ry: 0.65, rgb: [255, 178, 110] }, // peach
  { x: 0.62, y: 0.85, rx: 0.12, ry: 0.45, rgb: [194, 65, 12] },   // deep orange
  { x: 0.72, y: 0.20, rx: 0.15, ry: 0.50, rgb: [255, 237, 213] }, // light cream
  { x: 0.86, y: 0.65, rx: 0.14, ry: 0.55, rgb: [249, 115, 80] },  // coral
  { x: 0.05, y: 0.80, rx: 0.10, ry: 0.45, rgb: [253, 186, 116] }, // soft orange
];

const paintGlow = (cx, cy, cols, rows) => {
  const u = (cx + 0.5) / cols;
  const v = (cy + 0.5) / rows;

  let weight = 0;
  let r = 0;
  let g = 0;
  let b = 0;
  for (const blob of GLOW_BLOBS) {
    const dx = (u - blob.x) / blob.rx;
    const dy = (v - blob.y) / blob.ry;
    const f = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
    const k = f * f;
    weight += k;
    r += blob.rgb[0] * k;
    g += blob.rgb[1] * k;
    b += blob.rgb[2] * k;
  }
  if (weight === 0) return null;

  // Soft fade toward top/bottom so the mosaic melts into the section.
  const edge = Math.min(1, Math.min(v, 1 - v) * 4);
  const jitter = 0.75 + cellNoise(cx, cy) * 0.5;
  // Quantise opacity into steps for that chunky, stepped-pixel look.
  const alpha = Math.round(Math.min(1, weight) * edge * jitter * 6) / 6;

  return [r / weight, g / weight, b / weight, alpha * 0.92];
};

const PixelGlow = () => (
  <PixelCanvas cell={GLOW_CELL} paint={paintGlow} className="feedback-wall-glow" />
);

const REVIEWS = [
  {
    id: 1,
    initials: 'IS',
    avatarBg: '#6366F1',
    name: 'Isla',
    text: "I'm actually obsessed with Kasalig. I never enjoyed reviewing before! Got 100% on my math diagnostic!",
    time: '8d',
    likes: 201,
  },
  {
    id: 2,
    initials: 'JJ',
    avatarBg: '#8B5CF6',
    name: 'JJ 🎧',
    text: 'I STUDIED WITH THIS APP AND IDENTIFIED MY EXACT FACTORING GAP IN 15 MINS! YALL NEED TO DOWNLOAD THIS',
    time: '1d',
    likes: 512,
  },
  {
    id: 3,
    initials: 'AX',
    avatarBg: '#D97706',
    name: 'Alexander',
    text: 'I can actually vouch for this. Used it for AP Bio and got high distinction. So easy to use! ✨',
    time: '4d',
    likes: 122,
  },
  {
    id: 4,
    initials: 'SA',
    avatarBg: '#10B981',
    name: 'Sabrina524',
    text: 'This app got me an A+ in chemistry! The adaptive practice genuinely feels like playing a video game 🎮',
    time: '9d',
    likes: 144,
  },
  {
    id: 5,
    initials: 'NO',
    avatarBg: '#EF4444',
    name: 'Norachal',
    text: 'Kasalig is literally the life force of my grades. Only app that shows me WHY I picked the wrong answer.',
    time: '2d',
    likes: 1550,
  },
  {
    id: 6,
    initials: 'FF',
    avatarBg: '#06B6D4',
    name: 'FF1 Student',
    text: 'Honestly guys, coming from a grade 10 student, I use this every night. Recommend it to all my friends!',
    time: '14d',
    likes: 993,
  },
  {
    id: 7,
    initials: 'BW',
    avatarBg: '#3B82F6',
    name: 'Britt W.',
    text: 'I wanted to say after getting my exam results back, these telemetry quizzes worked like magic! ✨',
    time: '8d',
    likes: 3101,
  },
  {
    id: 8,
    initials: 'OA',
    avatarBg: '#EA580C',
    name: 'OASIS',
    text: "Our teacher had our whole class use this for mock exams. It's crazy how accurate the diagnostic pinpointing is.",
    time: '9d',
    likes: 643,
  },
];

// Each row starts at a different review so neighbouring rows never line up the same card.
const ROW_OFFSETS = [0, 3, 6];

const rotate = (list, offset) => list.slice(offset).concat(list.slice(0, offset));

const FeedbackCard = ({ item, liked, onLike, ariaHidden }) => (
  <article className="feedback-card" aria-hidden={ariaHidden || undefined}>
    <div className="feedback-avatar" style={{ backgroundColor: item.avatarBg }}>
      {item.initials}
    </div>

    <div className="feedback-card-body">
      <span className="feedback-user-name">{item.name}</span>
      <p className="feedback-card-text">{item.text}</p>

      <div className="feedback-card-footer">
        <span className="feedback-card-meta">
          <span className="feedback-card-time">{item.time}</span>
          <span className="feedback-card-reply">Reply</span>
        </span>
        <button
          type="button"
          className={`feedback-like-button ${liked ? 'liked' : ''}`}
          onClick={onLike}
          aria-pressed={liked}
          aria-label={`Like ${item.name}'s feedback`}
          tabIndex={ariaHidden ? -1 : undefined}
        >
          <HeartIcon size={16} color={liked ? '#C2410C' : '#DE7A40'} />
          <span className="like-count">{item.likes.toLocaleString()}</span>
        </button>
      </div>
    </div>
  </article>
);

export const FeedbacksSection = () => {
  const [likedMap, setLikedMap] = useState({});

  const handleLike = (id) => setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));

  const likesFor = (item) => item.likes + (likedMap[item.id] ? 1 : 0);

  return (
    <section className="kasalig-feedbacks-section">
      <div className="kasalig-container feedback-header-center">
        {/* Three floating 3D app icons in a triangle: Improve on top, Understand + Excel below */}
        <div className="feedback-app-icons-row">
          {APP_ICONS.map(({ key, label, className, Icon }) => (
            <div key={key} className={`app-bubble-wrap app-bubble-wrap--${key}`}>
              <div className={`app-bubble ${className}`} role="img" aria-label={label} title={label}>
                <Icon />
              </div>
              <span className="app-bubble-shadow" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* Curved Title: "Understand.Improve.Excel" */}
        <div className="curved-title-container">
          <svg
            viewBox="0 0 920 115"
            className="curved-title-svg"
            aria-label="Understand.Improve.Excel"
          >
            <defs>
              <path
                id="feedbackTextArc"
                d="M 50 96 Q 460 22 870 96"
                fill="none"
              />
              <filter id="curvedTextShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.12" />
              </filter>
            </defs>
            <text className="curved-svg-text" filter="url(#curvedTextShadow)">
              <textPath
                href="#feedbackTextArc"
                startOffset="50%"
                textAnchor="middle"
              >
                Understand.Improve.Excel
              </textPath>
            </text>
          </svg>
        </div>

        <p className="feedback-sub-title">By students and educators around the region</p>
      </div>

      {/* Staggered wall of feedback cards over an orange mosaic glow */}
      <div className="feedback-wall">
        <PixelGlow />

        {ROW_OFFSETS.map((offset, rowIndex) => {
          const row = rotate(REVIEWS, offset);
          return (
            <div key={rowIndex} className={`feedback-row feedback-row-${rowIndex + 1}`}>
              {/* Two identical halves: the track slides by -50% and loops seamlessly */}
              <div className="feedback-track">
                {[0, 1].map((copy) =>
                  row.map((item) => (
                    <FeedbackCard
                      key={`${copy}-${item.id}`}
                      item={{ ...item, likes: likesFor(item) }}
                      liked={!!likedMap[item.id]}
                      onLike={() => handleLike(item.id)}
                      ariaHidden={copy === 1 || rowIndex > 0}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeedbacksSection;
