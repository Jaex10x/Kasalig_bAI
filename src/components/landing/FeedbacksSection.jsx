import { useState } from 'react';
import { HeartIcon } from './Icons';
import { PixelCanvas, cellNoise } from './PixelCanvas';

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
        {/* Three cute app icon bubbles */}
        <div className="feedback-app-icons-row">
          <div className="app-bubble pink-bubble">❤️</div>
          <div className="app-bubble navy-bubble">✨</div>
          <div className="app-bubble cyan-bubble">🌍</div>
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
