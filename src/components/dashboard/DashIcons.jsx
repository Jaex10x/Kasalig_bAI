// Line icons for the dashboard (24px grid, stroke follows currentColor).
const Svg = ({ size = 22, children, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

export const HomeIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7" height="7" rx="2.5" />
    <rect x="14" y="3" width="7" height="7" rx="2.5" />
    <rect x="3" y="14" width="7" height="7" rx="2.5" />
    <rect x="14" y="14" width="7" height="7" rx="2.5" />
  </Svg>
);

export const QuizIcon = (p) => (
  <Svg {...p}>
    <rect x="4" y="3" width="16" height="18" rx="3" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </Svg>
);

export const ChartIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </Svg>
);

export const ChatIcon = (p) => (
  <Svg {...p}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    <path d="M9 11h.01M12 11h.01M15 11h.01" strokeWidth="2.6" />
  </Svg>
);

export const UserIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </Svg>
);

export const LogoutIcon = (p) => (
  <Svg {...p}>
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    <path d="M10 16l-4-4 4-4M6 12h10" />
  </Svg>
);

export const StarIcon = ({ size = 16, color = '#f6a23c' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2.5l2.6 6.2 6.7.6-5.1 4.4 1.6 6.6L12 16.8l-5.8 3.5 1.6-6.6-5.1-4.4 6.7-.6z"
      fill={color}
    />
  </svg>
);

export const ClockIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const LevelIcon = (p) => (
  <Svg {...p}>
    <path d="M5 20v-5M12 20V9M19 20V4" />
  </Svg>
);

export const ArrowIcon = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const BackIcon = (p) => (
  <Svg {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </Svg>
);

export const SendIcon = (p) => (
  <Svg {...p}>
    <path d="M4 12l16-8-6 16-2.5-6.5z" />
  </Svg>
);

export const AlertIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3l9.5 17h-19z" />
    <path d="M12 10v4M12 17h.01" />
  </Svg>
);

export const PlayIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor" />
  </Svg>
);

export const BookIcon = (p) => (
  <Svg {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
    <path d="M4 19V5M8 7h7" />
  </Svg>
);

export const PencilIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20l4-1 11-11-3-3L5 16z" />
    <path d="M14 6l3 3" />
  </Svg>
);

export const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const XIcon = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

/** The Kasalig bAI "KB" mark (public/logo.png). `size` is its height. */
export const LogoMark = ({ size = 40 }) => (
  <img src="/logo.png" alt="" height={size} style={{ height: size, width: 'auto', display: 'block' }} />
);

/** A small capybara face: the tutor's avatar. */
export const CapyFace = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#fdeee3" />
    <ellipse cx="13" cy="15" rx="4" ry="3.4" fill="#8f5a33" />
    <ellipse cx="35" cy="15" rx="4" ry="3.4" fill="#8f5a33" />
    <rect x="8" y="13" width="32" height="27" rx="13.5" fill="#b5794a" />
    <circle cx="31" cy="11" r="4" fill="#de7a40" />
    <path d="M31 7 q2.5 -2.6 5 -1 q-2.5 2 -5 1z" fill="#4f9d5d" />
    <circle cx="17.5" cy="23" r="2.2" fill="#3b2416" />
    <circle cx="30.5" cy="23" r="2.2" fill="#3b2416" />
    <rect x="15" y="27" width="18" height="12" rx="6" fill="#9a6238" />
    <path d="M21.5 33.5 q2.5 2 5 0" fill="none" stroke="#3b2416" strokeWidth="1.6" strokeLinecap="round" />
    <ellipse cx="12.5" cy="28" rx="2.6" ry="1.6" fill="#f2a07b" />
    <ellipse cx="35.5" cy="28" rx="2.6" ry="1.6" fill="#f2a07b" />
  </svg>
);

export const PathIcon = (p) => (
  <Svg {...p}>
    <circle cx="6" cy="19" r="2.5" />
    <circle cx="18" cy="5" r="2.5" />
    <path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" />
  </Svg>
);

export const HistoryIcon = (p) => (
  <Svg {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5M12 7v5l3.5 2" />
  </Svg>
);

export const LibraryIcon = (p) => (
  <Svg {...p}>
    <path d="M4 4h4v16H4zM10 4h4v16h-4z" />
    <path d="M16.5 4.5l3.8 1 -3.8 14.5 -3.8-1z" />
  </Svg>
);

export const MapIcon = (p) => (
  <Svg {...p}>
    <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
    <path d="M9 4v14M15 6v14" />
  </Svg>
);

export const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </Svg>
);

export const PrintIcon = (p) => (
  <Svg {...p}>
    <path d="M7 9V3h10v6M7 17H4v-7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7h-3" />
    <path d="M7 14h10v7H7z" />
  </Svg>
);

export const SparkleIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
  </Svg>
);

export const LockIcon = (p) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

export const LinkIcon = (p) => (
  <Svg {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Svg>
);

export const BulbIcon = (p) => (
  <Svg {...p}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  </Svg>
);

/** Two people: a class of students. */
export const UsersIcon = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c1.2-3.4 3.6-5 6.5-5s5.3 1.6 6.5 5" />
    <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 15.3c1.7.6 2.9 2.1 3.5 4.7" />
  </Svg>
);

/** A page with a folded corner: an assessment. */
export const DocIcon = (p) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </Svg>
);

/** A robot head: AI gap analytics. */
export const BotIcon = (p) => (
  <Svg {...p}>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 4v4M9 13v1M15 13v1M9.5 17h5M2 13v2M22 13v2" />
    <circle cx="12" cy="3.5" r="1" />
  </Svg>
);

/** Bars on an axis: progress over time. */
export const BarsIcon = (p) => (
  <Svg {...p}>
    <path d="M4 4v16h16" />
    <path d="M8 16v-4M12 16V8M16 16v-6" />
  </Svg>
);
