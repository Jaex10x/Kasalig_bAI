import { useCountUp } from './dashboardHooks';
import { GAP_TYPES, LANGUAGES, SEVERITIES } from './curriculum';
import { masteryLevel } from './engine';

const AVATAR_COLORS = ['#de7a40', '#8b5cf6', '#10b981', '#e5604d', '#f59e0b', '#0ea5e9'];

/** Initials in a coloured circle. The colour is stable for the same name. */
export function Avatar({ name = '', size = 44 }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
  const hash = [...name].reduce((h, c) => h + c.charCodeAt(0), 0);
  return (
    <span
      className="kd-avatar"
      style={{ width: size, height: size, fontSize: size * 0.38, background: AVATAR_COLORS[hash % AVATAR_COLORS.length] }}
      aria-hidden="true"
    >
      {initials || '?'}
    </span>
  );
}

/** Circular meter that fills up and counts to `value` (0–100). `tone="dark"` for light backgrounds. */
export function MasteryRing({ value, size = 150, stroke = 14, track, color, label = 'mastery', tone = 'light' }) {
  const shown = useCountUp(value ?? 0);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const isDark = tone === 'dark';
  return (
    <div
      className={`kd-ring ${isDark ? 'is-dark' : ''}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={value === null ? `${label}: not tested yet` : `${value}% ${label}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track ?? (isDark ? '#f1e7dc' : 'rgba(255,255,255,0.18)')} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color ?? (isDark ? '#de7a40' : '#ffffff')}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="kd-ring-value" aria-hidden="true">
        <strong style={{ fontSize: size * 0.22 }}>{value === null ? '—' : `${shown}%`}</strong>
        <small>{label}</small>
      </span>
    </div>
  );
}

/** "Mastered" / "Developing" / "Needs work" / "Not tested" chip. */
export function LevelChip({ pct }) {
  const level = masteryLevel(pct);
  return (
    <span className="kd-chip" style={{ color: level.color, background: level.tint }}>
      {level.label}
    </span>
  );
}

export function GapTypeChip({ type, short = false }) {
  const t = GAP_TYPES[type];
  if (!t) return null;
  return (
    <span className="kd-chip" style={{ color: t.color, background: t.tint }}>
      {short ? t.short : t.label}
    </span>
  );
}

export function SeverityChip({ severity }) {
  const s = SEVERITIES[severity];
  if (!s) return null;
  return (
    <span className="kd-chip kd-chip-sev" style={{ color: s.color, background: s.tint }}>
      <span className="kd-sev-dot" style={{ background: s.color }} aria-hidden="true" />
      {s.label}
    </span>
  );
}

/** Horizontal bar that grows to `pct`. */
export function Bar({ pct, color }) {
  return (
    <span className="kd-bar" aria-hidden="true">
      <span className="kd-bar-fill" style={{ width: `${pct ?? 0}%`, background: color ?? masteryLevel(pct).color }} />
    </span>
  );
}

export function SampleNotice({ children }) {
  return <p className="kd-sample-note">{children}</p>;
}

/** English / Filipino / Cebuano switch. */
export function LangToggle({ value, onChange }) {
  return (
    <div className="kd-segment" role="group" aria-label="Explanation language">
      {LANGUAGES.map((l) => (
        <button key={l.id} type="button" aria-pressed={value === l.id} onClick={() => onChange(l.id)}>
          {l.label}
        </button>
      ))}
    </div>
  );
}

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * The answer area for any question type. `value` is an option index (mc),
 * true/false (tf) or text (id). `result` (optional) colours the right/wrong answers.
 */
export function QuestionInput({ question, value, onChange, disabled = false, result = null, labelledBy, onSubmit }) {
  if (question.type === 'id') {
    const state = result ? (result.correct ? 'is-right' : 'is-wrong') : '';
    return (
      <div className="kd-id-answer">
        <input
          className={`kd-input kd-id-input ${state}`}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSubmit) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Type your answer"
          aria-labelledby={labelledBy}
          disabled={disabled}
          autoComplete="off"
          spellCheck="false"
        />
        <small>Spaces and capitals don&rsquo;t matter. Type √ as &ldquo;root&rdquo; if you like.</small>
      </div>
    );
  }

  const options =
    question.type === 'tf'
      ? [
          { text: 'True', value: true },
          { text: 'False', value: false },
        ]
      : question.options.map((o, i) => ({ text: o.text, value: i }));
  const rightValue = question.type === 'tf' ? question.answer : question.options.findIndex((o) => o.correct);

  return (
    <div className={`kd-quiz-options ${question.type === 'tf' ? 'is-tf' : ''}`} role="radiogroup" aria-labelledby={labelledBy}>
      {options.map((opt, i) => {
        const chosen = value === opt.value;
        let state = chosen ? 'is-chosen' : '';
        if (result) {
          if (opt.value === rightValue) state = 'is-right';
          else if (chosen) state = 'is-wrong';
        }
        return (
          <button
            key={`${opt.text}-${i}`}
            type="button"
            role="radio"
            aria-checked={chosen}
            className={`kd-quiz-option ${state}`}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
          >
            <span className="kd-quiz-key">{question.type === 'tf' ? (opt.value ? 'T' : 'F') : OPTION_KEYS[i]}</span>
            <span>{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Tiny line chart of scores over time (0–100). */
export function Sparkline({ points, color = '#de7a40', width = 140, height = 40 }) {
  if (!points.length) return <span className="kd-spark-empty">No data yet</span>;
  const pad = 4;
  const xs = points.map((_, i) => (points.length === 1 ? width / 2 : pad + (i * (width - pad * 2)) / (points.length - 1)));
  const ys = points.map((p) => height - pad - (p / 100) * (height - pad * 2));
  const d = xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  return (
    <svg className="kd-spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <line x1="0" x2={width} y1={height - pad - 0.8 * (height - pad * 2)} y2={height - pad - 0.8 * (height - pad * 2)} stroke="#e8dccf" strokeDasharray="3 4" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={i === xs.length - 1 ? 4 : 2.5} fill={i === xs.length - 1 ? color : '#fff'} stroke={color} strokeWidth="2" />
      ))}
    </svg>
  );
}

/** A friendly empty state with an optional action. */
export function EmptyState({ icon = '🌱', title, children, action }) {
  return (
    <div className="kd-empty-state">
      <span className="kd-empty-icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
