/* ---------------------------------------------------------------------------
 * Small white line drawings for recommendation covers, one per topic, with a
 * fallback per subject. Purely decorative: always aria-hidden.
 * All drawings share a 120 × 90 viewBox and inherit the stroke style below.
 * ------------------------------------------------------------------------- */

const LINE = { stroke: '#ffffff', strokeOpacity: 0.8, strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
const SOFT = { fill: '#ffffff', fillOpacity: 0.35 };
const LABEL = { fill: '#ffffff', fillOpacity: 0.8, fontSize: 11, fontWeight: 700, textAnchor: 'middle', stroke: 'none' };

const ART = {
  // CSIT121 · Variables: a typed box holding a value
  'p-vars': (
    <>
      <rect x="22" y="30" width="56" height="40" rx="6" />
      <path d="M22 30 L34 18 H90 L78 30 M90 18 V58 L78 70" />
      <text x="50" y="56" {...LABEL} fontSize="16">x=5</text>
      <text x="56" y="13" {...LABEL} fontSize="10">int</text>
    </>
  ),
  // Conditionals: a decision diamond splitting into two paths
  'p-cond': (
    <>
      <path d="M60 8 L82 30 L60 52 L38 30 Z" />
      <path d="M38 30 H18 V72 M82 30 H102 V72 M12 64 L18 72 L24 64 M96 64 L102 72 L108 64" />
      <text x="60" y="34" {...LABEL}>?</text>
      <rect x="10" y="74" width="16" height="10" rx="3" {...SOFT} stroke="none" />
    </>
  ),
  // Loops: a circular arrow with a counter
  'p-loops': (
    <>
      <path d="M86 45 A28 28 0 1 1 74 22" />
      <path d="M66 14 L76 22 L66 30" />
      <text x="58" y="50" {...LABEL} fontSize="14">i++</text>
    </>
  ),
  // Arrays: indexed cells 0–4, the first one filled
  'p-arrays': (
    <>
      <rect x="6" y="26" width="108" height="28" rx="4" />
      <path d="M27.6 26 V54 M49.2 26 V54 M70.8 26 V54 M92.4 26 V54" />
      <rect x="7" y="27" width="20" height="26" {...SOFT} stroke="none" />
      {[17, 38, 60, 81, 103].map((x, i) => (
        <text key={x} x={x} y="72" {...LABEL}>{i}</text>
      ))}
    </>
  ),
  // CSIT221 · Big-O: growth curves on axes
  'd-bigo': (
    <>
      <path d="M12 80 H112 M12 80 V8" />
      <path d="M12 80 L108 34" />
      <path d="M12 80 Q72 78 96 8" strokeDasharray="5 5" />
      <path d="M12 80 Q30 52 108 58" />
    </>
  ),
  // Stacks & queues: stacked blocks with a push arrow
  'd-stack': (
    <>
      <rect x="36" y="60" width="50" height="16" rx="4" />
      <rect x="36" y="40" width="50" height="16" rx="4" />
      <rect x="36" y="20" width="50" height="16" rx="4" {...SOFT} />
      <path d="M100 4 V30 M93 22 L100 30 L107 22" />
    </>
  ),
  // Linked lists: nodes joined by arrows
  'd-list': (
    <>
      {[6, 46, 86].map((x) => (
        <g key={x}>
          <rect x={x} y="32" width="28" height="22" rx="4" />
          <path d={`M${x + 18} 32 V54`} />
        </g>
      ))}
      <rect x="7" y="33" width="16" height="20" {...SOFT} stroke="none" />
      <path d="M28 43 H44 M39 38 L44 43 L39 48 M68 43 H84 M79 38 L84 43 L79 48" />
      <path d="M108 43 H116 M116 37 V49" />
    </>
  ),
  // Binary search trees: a small node tree
  'd-bst': (
    <>
      <path d="M60 16 L34 44 M60 16 L86 44 M34 44 L20 72 M34 44 L48 72 M86 44 L100 72" />
      <circle cx="60" cy="14" r="9" {...SOFT} />
      <circle cx="34" cy="44" r="8" />
      <circle cx="86" cy="44" r="8" />
      <circle cx="20" cy="74" r="7" />
      <circle cx="48" cy="74" r="7" />
      <circle cx="100" cy="74" r="7" />
    </>
  ),
  // CSIT226 · Keys: two tables linked key to key
  'i-keys': (
    <>
      <rect x="6" y="18" width="42" height="54" rx="4" />
      <path d="M6 32 H48 M6 46 H48 M6 60 H48" />
      <rect x="7" y="33" width="40" height="12" {...SOFT} stroke="none" />
      <rect x="72" y="18" width="42" height="54" rx="4" />
      <path d="M72 32 H114 M72 46 H114 M72 60 H114" />
      <path d="M48 39 C60 39 60 53 72 53" strokeDasharray="4 4" />
      <circle cx="93" cy="10" r="5" />
      <path d="M98 10 H112 M108 10 V14" />
    </>
  ),
  // SELECT & filtering: a funnel picking rows from a table
  'i-select': (
    <>
      <rect x="6" y="12" width="52" height="66" rx="4" />
      <path d="M6 28 H58 M6 44 H58 M6 60 H58" />
      <rect x="7" y="29" width="50" height="14" {...SOFT} stroke="none" />
      <path d="M70 20 H112 L96 42 V64 L86 70 V42 Z" />
    </>
  ),
  // Joins: two overlapping circles
  'i-joins': (
    <>
      <circle cx="46" cy="46" r="30" fill="#ffffff" fillOpacity="0.16" />
      <circle cx="76" cy="46" r="30" fill="#ffffff" fillOpacity="0.16" />
    </>
  ),
  // Normalization: one table splitting into two
  'i-norm': (
    <>
      <rect x="6" y="14" width="46" height="62" rx="4" />
      <path d="M6 30 H52 M6 46 H52 M6 62 H52 M28 14 V76" />
      <path d="M58 45 H70 M65 40 L70 45 L65 50" />
      <rect x="76" y="10" width="38" height="30" rx="4" />
      <path d="M76 24 H114" />
      <rect x="76" y="50" width="38" height="30" rx="4" />
      <path d="M76 64 H114" />
    </>
  ),

  // Not tied to one topic
  quiz: (
    <>
      <rect x="20" y="8" width="80" height="76" rx="8" />
      <path d="M32 26 l5 5 l9 -10 M32 46 l5 5 l9 -10" />
      <rect x="32" y="60" width="13" height="13" rx="3" />
      <path d="M54 27 H88 M54 47 H88 M54 67 H80" />
    </>
  ),
  tutor: (
    <>
      <path d="M14 14 H78 A8 8 0 0 1 86 22 V50 A8 8 0 0 1 78 58 H40 L26 70 V58 H22 A8 8 0 0 1 14 50 V22 A8 8 0 0 1 22 14 Z" />
      <path d="M28 30 H70 M28 42 H56" />
      <path d="M92 40 H104 A6 6 0 0 1 110 46 V66 A6 6 0 0 1 104 72 H100 V82 L90 72 H70 A6 6 0 0 1 64 66 V64" />
    </>
  ),
  enroll: (
    <>
      <rect x="22" y="12" width="60" height="70" rx="6" />
      <path d="M34 30 H70 M34 44 H70 M34 58 H56" />
      <circle cx="90" cy="64" r="16" {...SOFT} />
      <path d="M90 56 V72 M82 64 H98" />
    </>
  ),

  // Subject fallbacks
  csit121: (
    <>
      <path d="M38 22 L14 45 L38 68 M82 22 L106 45 L82 68 M68 14 L52 76" />
    </>
  ),
  csit221: (
    <>
      <circle cx="24" cy="24" r="9" />
      <circle cx="96" cy="24" r="9" {...SOFT} />
      <circle cx="60" cy="66" r="9" />
      <path d="M33 24 H87 M30 31 L54 59 M90 31 L66 59" />
    </>
  ),
  csit226: (
    <>
      <ellipse cx="60" cy="18" rx="34" ry="10" />
      <path d="M26 18 V70 C26 76 42 80 60 80 C78 80 94 76 94 70 V18" />
      <path d="M26 36 C26 42 42 46 60 46 C78 46 94 42 94 36 M26 54 C26 60 42 64 60 64 C78 64 94 60 94 54" />
    </>
  ),
};

/** The drawing key for a recommendation: its topic, else its kind, else its subject. */
function artKey({ topicId, subjectId, kind }) {
  if (topicId && ART[topicId]) return topicId;
  if (kind && ART[kind]) return kind;
  if (subjectId && ART[subjectId]) return subjectId;
  return 'quiz';
}

export default function TopicArt({ topicId, subjectId, kind, className, width = 132, height = 99 }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 120 90" aria-hidden="true" focusable="false">
      <g {...LINE}>{ART[artKey({ topicId, subjectId, kind })]}</g>
    </svg>
  );
}
