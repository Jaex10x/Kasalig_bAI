import React from 'react';

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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.77-.28 1.05.02 2.25.77 3.02.73.79 1.87 1.14 2.91.93 1.09-.17 2.06-.94 2.45-1.97.22-.57.29-1.19.29-1.8V.02h.74z" />
  </svg>
);

export const DiscordIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// High-Fidelity 3D Rocket Component
export const RocketGraphic = ({ isLaunching = false, className = "", onClick }) => (
  <div 
    className={`rocket-3d-container ${isLaunching ? 'launching-3d' : ''} ${className}`}
    onClick={onClick}
    title="Click me to blast off in 3D!"
  >
    <svg 
      width="82" 
      height="94" 
      viewBox="0 0 100 115" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="rocket-3d-svg"
    >
      <defs>
        {/* 3D Nose Cone Gradient */}
        <linearGradient id="noseCone3D" x1="38" y1="10" x2="62" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="45%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>

        {/* 3D Cylindrical Rocket Body Gradient */}
        <linearGradient id="fuselage3D" x1="35" y1="45" x2="65" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="25%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* 3D Fins Gradients */}
        <linearGradient id="finLeft3D" x1="22" y1="52" x2="40" y2="74" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>
        <linearGradient id="finRight3D" x1="78" y1="52" x2="60" y2="74" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#7C2D12" />
        </linearGradient>

        {/* 3D Glass Window Reflection */}
        <radialGradient id="glassPorthole" cx="48" cy="44" r="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#075985" />
        </radialGradient>

        {/* Thruster Flame Gradient */}
        <linearGradient id="thrusterFlame" x1="50" y1="74" x2="50" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="30%" stopColor="#FB923C" />
          <stop offset="75%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </linearGradient>

        {/* Ambient Drop Shadow Filter */}
        <filter id="rocketCastShadow" x="-15%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="-2" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#rocketCastShadow)">
        {/* Animated Thruster Exhaust Flame */}
        <g className="flame-group-3d">
          <path 
            d="M44 76C44 76 50 102 50 110C50 102 56 76 56 76H44Z" 
            fill="url(#thrusterFlame)" 
            className="outer-flame-3d"
          />
          <path 
            d="M47 76C47 76 50 94 50 100C50 94 53 76 53 76H47Z" 
            fill="#FEF08A" 
            className="inner-flame-3d"
          />
        </g>

        {/* Exhaust Nozzle */}
        <path d="M42 74H58L55 78H45L42 74Z" fill="#334155" stroke="#1E293B" strokeWidth="1" />

        {/* Left Fin 3D */}
        <path d="M25 60L40 46V72L24 76C24 76 24.5 64 25 60Z" fill="url(#finLeft3D)" />
        <path d="M25 60L40 46V49L26 62Z" fill="#FDBA74" opacity="0.6" />

        {/* Right Fin 3D */}
        <path d="M75 60L60 46V72L76 76C76 76 75.5 64 75 60Z" fill="url(#finRight3D)" />
        <path d="M75 60L60 46V49L74 62Z" fill="#9A3412" opacity="0.4" />

        {/* Center Fuselage 3D Body */}
        <path 
          d="M50 12C38 28 38 66 38 74H62C62 66 62 28 50 12Z" 
          fill="url(#fuselage3D)" 
        />

        {/* 3D Specular Highlight stripe down the left flank */}
        <path 
          d="M47 16C42 28 41 62 41 72H44C44 62 45 28 49 16Z" 
          fill="#FFFFFF" 
          opacity="0.75" 
        />

        {/* Red / Orange 3D Nose Cone */}
        <path 
          d="M50 12C45 19 41.5 28 40.5 35H59.5C58.5 28 55 19 50 12Z" 
          fill="url(#noseCone3D)" 
        />
        {/* Nose Highlight */}
        <path d="M48 14C45 20 43 27 42.5 33H45C45.5 27 47 20 49 14Z" fill="#FED7AA" opacity="0.8" />

        {/* 3D Metallic Porthole Rim */}
        <circle cx="50" cy="48" r="9.5" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
        {/* 3D Glass Lens */}
        <circle cx="50" cy="48" r="7.5" fill="url(#glassPorthole)" />
        {/* Glass Glare Highlight */}
        <path d="M46 44C47.5 42.5 50 42.5 52 43.5C50 44 47.5 45.5 46.5 48C46 46.5 45.5 45 46 44Z" fill="#FFFFFF" opacity="0.85" />
      </g>
    </svg>
  </div>
);

// High-Fidelity 3D Cute Creature Component
export const CuteCreatureGraphic = ({ isHappy = false, className = "", onClick }) => (
  <div 
    className={`creature-3d-container ${isHappy ? 'celebrating-3d' : ''} ${className}`}
    onClick={onClick}
    title="Click me for a surprise!"
  >
    <svg 
      width="92" 
      height="78" 
      viewBox="0 0 100 84" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="creature-3d-svg"
    >
      <defs>
        {/* Spherical 3D Body Gradient */}
        <radialGradient id="bodySphere3D" cx="42" cy="36" r="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="35%" stopColor="#8B5CF6" />
          <stop offset="75%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#4C1D95" />
        </radialGradient>

        {/* 3D Cheek Glow */}
        <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F472B6" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#EC4899" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
        </radialGradient>

        {/* 3D Gill Gradient */}
        <linearGradient id="gill3D" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBCFE8" />
          <stop offset="60%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>

        {/* Creature Drop Shadow */}
        <filter id="creatureCastShadow" x="-15%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#creatureCastShadow)">
        {/* Left 3D Gills / Fins */}
        <g className="creature-gill-left">
          <ellipse cx="14" cy="30" rx="9" ry="5.5" fill="url(#gill3D)" transform="rotate(-22 14 30)" />
          <ellipse cx="11" cy="42" rx="10" ry="6" fill="url(#gill3D)" />
          <ellipse cx="16" cy="54" rx="9" ry="5.5" fill="url(#gill3D)" transform="rotate(22 16 54)" />
        </g>

        {/* Right 3D Gills / Fins */}
        <g className="creature-gill-right">
          <ellipse cx="86" cy="30" rx="9" ry="5.5" fill="url(#gill3D)" transform="rotate(22 86 30)" />
          <ellipse cx="89" cy="42" rx="10" ry="6" fill="url(#gill3D)" />
          <ellipse cx="84" cy="54" rx="9" ry="5.5" fill="url(#gill3D)" transform="rotate(-22 84 54)" />
        </g>

        {/* Plump 3D Spherical Head/Body */}
        <ellipse cx="50" cy="44" rx="38" ry="32" fill="url(#bodySphere3D)" />

        {/* 3D Glossy Light Reflection Arc */}
        <ellipse cx="44" cy="24" rx="20" ry="8" fill="#FFFFFF" opacity="0.35" transform="rotate(-8 44 24)" />

        {/* 3D Rosy Cheeks */}
        <circle cx="28" cy="50" r="7.5" fill="url(#cheekGlow)" />
        <circle cx="72" cy="50" r="7.5" fill="url(#cheekGlow)" />

        {/* 3D Expressive Eyes */}
        {isHappy ? (
          // Happy Joyful Arcs ^_^
          <g stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M33 42C35.5 37 40.5 37 43 42" />
            <path d="M57 42C59.5 37 64.5 37 67 42" />
          </g>
        ) : (
          // Deep glossy 3D anime spheres
          <g>
            {/* Left Eye */}
            <circle cx="38" cy="40" r="6" fill="#0F172A" />
            <circle cx="36" cy="38" r="2.4" fill="#FFFFFF" />
            <circle cx="41" cy="42" r="1.1" fill="#FFFFFF" opacity="0.8" />

            {/* Right Eye */}
            <circle cx="62" cy="40" r="6" fill="#0F172A" />
            <circle cx="60" cy="38" r="2.4" fill="#FFFFFF" />
            <circle cx="65" cy="42" r="1.1" fill="#FFFFFF" opacity="0.8" />
          </g>
        )}

        {/* 3D Cute Curved Smile */}
        <path 
          d="M46 48C47.5 52 52.5 52 54 48" 
          stroke="#0F172A" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          fill="none" 
        />
      </g>
    </svg>
  </div>
);
