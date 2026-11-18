
// Brand Logo Icon (Orange circle with stylized leaf/flame or K)
export const LogoIcon = ({ size = 30, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="18" cy="18" r="18" fill="#E67E22" />
    <path 
      d="M18 7C18 7 13 14 13 19.5C13 22.5 15.2 25 18 25C20.8 25 23 22.5 23 19.5C23 14 18 7 18 7Z" 
      fill="#FDF2E9" 
    />
    <circle cx="18" cy="20" r="3.5" fill="#D35400" />
  </svg>
);

export const GamepadIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" strokeWidth="3" />
    <line x1="18" y1="11" x2="18.01" y2="11" strokeWidth="3" />
    <rect x="2" y="6" width="20" height="12" rx="6" />
  </svg>
);

export const ArrowRightIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const ChevronDownIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const CloseIcon = ({ size = 14, color = "#94A3B8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const StopwatchIcon = ({ size = 16, color = "#94A3B8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2" />
    <path d="M12 2v3" />
    <path d="M19 6l-1.5 1.5" />
  </svg>
);

export const SparklesIcon = ({ size = 16, color = "#F59E0B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

export const TargetGapIcon = ({ size = 14, color = "#C2672D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

export const KeyIcon = ({ size = 14, color = "#E67E22" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3" />
  </svg>
);

export const BookOpenIcon = ({ size = 15, color = "#64748B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const HeartIcon = ({ size = 14, color = "#EF4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// Problem Section Icons
export const CompassIcon = ({ size = 24, color = "#C2672D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} />
  </svg>
);

export const SearchIcon = ({ size = 24, color = "#C2672D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const BarChartIcon = ({ size = 24, color = "#C2672D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export const PackageIcon = ({ size = 24, color = "#C2672D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24a1.8 1.8 0 0 0-1.8 0L2.5 6.1a1.8 1.8 0 0 0-.9 1.56v8.68a1.8 1.8 0 0 0 .9 1.56l3.25 1.86a1.8 1.8 0 0 0 1.8 0l8.95-5.16a1.8 1.8 0 0 0 .9-1.56V9.4z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);

export const CheckIcon = ({ size = 16, color = "#C2672D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Social Media Icons
export const InstagramIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const TikTokIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.77-.28 1.05.02 2.25.77 3.02.73.79 1.87 1.14 2.91.93 1.09-.17 2.06-.94 2.45-1.97.22-.57.29-1.19.29-1.8V.02h.74z" />
  </svg>
);

export const DiscordIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// 16x16 pixel-art sprites: each row is a string, each character a palette key ('.' = empty).
// Runs of the same colour are merged into one <rect> to keep the SVG small.
const pixelRects = (rows, palette, keyPrefix) =>
  rows.flatMap((row, y) => {
    const rects = [];
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      if (ch !== '.' && palette[ch]) {
        rects.push(<rect key={`${keyPrefix}-${y}-${x}`} x={x} y={y} width={end - x} height={1} fill={palette[ch]} />);
      }
      x = end;
    }
    return rects;
  });

const PixelLayer = ({ rows, palette, name, className }) => <g className={className}>{pixelRects(rows, palette, name)}</g>;

const ROCKET_PALETTE = {
  K: '#0f172a', // outline
  W: '#f8fafc', // body
  G: '#cbd5e1', // body shade
  R: '#f97316', // nose & fins
  r: '#c2410c', // fin shade
  D: '#475569', // engine band
  B: '#7dd3fc', // window glare
  b: '#0369a1', // window
  Y: '#fde047', // flame core
  O: '#fb923c', // flame
  E: '#ef4444', // flame tip
};

const ROCKET_BODY = [
  '.......KK.......',
  '......KRRK......',
  '.....KRRRrK.....',
  '.....KWWWGK.....',
  '....KWWWWWGK....',
  '....KWWKKWGK....',
  '....KWKBbKGK....',
  '....KWKbbKGK....',
  '....KWWKKWGK....',
  '....KWWWWWGK....',
  '..KRKWWWWWGKrK..',
  '.KRRKWWWWWGKrrK.',
  '.KRRKDDDDDDKrrK.',
  '.KKKKKDDDDKKKKK.',
];
const ROCKET_FLAME_A = [
  ...Array(14).fill('................'),
  '.....EOYYOE.....',
  '......EOOE......',
];
const ROCKET_FLAME_B = [
  ...Array(14).fill('................'),
  '......OYYO......',
  '.......EE.......',
];

// Pixel rocket, tilted a little to the right; click to launch.
export const RocketGraphic = ({ isLaunching = false, className = '', onClick, size = 160 }) => (
  <button
    type="button"
    className={`pixel-sprite pixel-rocket ${isLaunching ? 'is-launching' : ''} ${className}`}
    onClick={onClick}
    title="Click me to blast off!"
    aria-label="Launch the rocket"
  >
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <PixelLayer rows={ROCKET_FLAME_A} palette={ROCKET_PALETTE} name="fa" className="pixel-frame-a" />
      <PixelLayer rows={ROCKET_FLAME_B} palette={ROCKET_PALETTE} name="fb" className="pixel-frame-b" />
      <PixelLayer rows={ROCKET_BODY} palette={ROCKET_PALETTE} name="rb" />
    </svg>
  </button>
);

const CREATURE_PALETTE = {
  K: '#2e1065', // outline
  P: '#8b5cf6', // body
  p: '#6d28d9', // body shade
  L: '#c4b5fd', // shine
  k: '#f472b6', // gills & cheeks
  E: '#0f172a', // eyes & mouth
  w: '#ffffff', // eye sparkle
};

const CREATURE_BODY = [
  '................',
  '....KKKKKKKK....',
  '...KPPLLPPPPK...',
  '..KPLLPPPPPPPK..',
  '..KPPPPPPPPPPK..',
  '..KPPPPPPPPPPK..',
  '.KPPPPPPPPPPPPK.',
  '.KPkkPPPPPPkkPK.',
  '.KPPPPEPPEPPPPK.',
  '.KpPPPPEEPPPPpK.',
  '..KppPPPPPPppK..',
  '...KKppppppKK...',
  '....KKKKKKKK....',
  '.....Kp..pK.....',
  '.....KK..KK.....',
];
const CREATURE_GILLS_A = ['', '', '', 'kk............kk', '.k............k.', 'kk............kk'];
const CREATURE_GILLS_B = ['', '', '.k............k.', 'k..............k', 'kk............kk', '.k............k.', 'k..............k'];
const CREATURE_EYES_OPEN = ['', '', '', '', '', '.....Ew..Ew.....', '.....EE..EE.....'];
const CREATURE_EYES_SHUT = ['', '', '', '', '', '', '.....EE..EE.....'];
const CREATURE_EYES_HAPPY = ['', '', '', '', '', '.....EE..EE.....', '....E..EE..E....'];

// Pixel axolotl: wiggles its gills and blinks; click for a happy hop.
export const CuteCreatureGraphic = ({ isHappy = false, className = '', onClick, size = 160 }) => (
  <button
    type="button"
    className={`pixel-sprite pixel-creature ${isHappy ? 'is-happy' : ''} ${className}`}
    onClick={onClick}
    title="Click me for a surprise!"
    aria-label="Say hi to the axolotl"
  >
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <PixelLayer rows={CREATURE_GILLS_A} palette={CREATURE_PALETTE} name="ga" className="pixel-frame-a" />
      <PixelLayer rows={CREATURE_GILLS_B} palette={CREATURE_PALETTE} name="gb" className="pixel-frame-b" />
      <PixelLayer rows={CREATURE_BODY} palette={CREATURE_PALETTE} name="cb" />
      {isHappy ? (
        <PixelLayer rows={CREATURE_EYES_HAPPY} palette={CREATURE_PALETTE} name="eh" />
      ) : (
        <>
          <PixelLayer rows={CREATURE_EYES_OPEN} palette={CREATURE_PALETTE} name="eo" className="pixel-eyes-open" />
          <PixelLayer rows={CREATURE_EYES_SHUT} palette={CREATURE_PALETTE} name="es" className="pixel-eyes-shut" />
        </>
      )}
    </svg>
  </button>
);
