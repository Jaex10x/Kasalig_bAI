import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MASTERY, overallMastery, topicStatus } from '../../lib/engine';
import { topicById } from '../../data/curriculum';

const DAY = 86400000;
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TREND_POINTS = 8;
const MIN_POINTS = 3;

const dayKey = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

/** Midnight of this week's Monday, local time. */
function weekStart(now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}

/** Everything the card shows, worked out from the saved attempts and activity. */
function weekSummary(attempts, activity) {
  const start = weekStart();
  const today = dayKey(Date.now());
  const studied = new Set([...attempts.map((a) => dayKey(a.takenAt)), ...activity.map(dayKey)]);
  const days = DAY_NAMES.map((name, i) => {
    const key = dayKey(start + i * DAY + DAY / 2); // midday avoids DST edges
    return { name, label: name[0], done: studied.has(key), today: key === today };
  });

  const sorted = [...attempts].sort((a, b) => a.takenAt - b.takenAt);
  // Overall mastery after each result, oldest first.
  const series = sorted.map((_, i) => overallMastery(topicStatus(sorted.slice(0, i + 1))));
  const points = series.slice(-TREND_POINTS);

  const before = sorted.filter((a) => a.takenAt < start);
  const thisWeek = sorted.filter((a) => a.takenAt >= start);
  const nowStatus = topicStatus(sorted);

  let delta = null;
  let biggest = null;
  if (thisWeek.length) {
    // Compare with where they stood before Monday, or with their first result if that was this week.
    const baseAttempts = before.length ? before : sorted.slice(0, 1);
    const baseStatus = topicStatus(baseAttempts);
    delta = series[series.length - 1] - overallMastery(baseStatus);
    Object.entries(nowStatus).forEach(([id, s]) => {
      const was = baseStatus[id];
      if (!was) return;
      const gain = s.pct - was.pct;
      if (gain > 0 && (!biggest || gain > biggest.gain)) biggest = { name: topicById(id)?.name ?? id, gain };
    });
  }

  return {
    days,
    points,
    delta,
    biggest,
    quizzesTaken: thisWeek.filter((a) => a.kind === 'quiz').length,
    gapsClosed: Object.values(nowStatus).filter((s) => s.closed && s.closedAt >= start).length,
  };
}

/** The mastery sparkline: one point per result, with the 80% goal as a dashed line. */
function TrendChart({ points }) {
  const W = 260;
  const top = 8;
  const bottom = 80;
  const x0 = 10;
  const x1 = 248;
  const low = Math.max(0, Math.floor((Math.min(...points, MASTERY) - 10) / 10) * 10);
  const y = (p) => top + ((100 - p) / (100 - low)) * (bottom - top);
  const xs = points.map((_, i) => x0 + (i * (x1 - x0)) / (points.length - 1));
  const coords = points.map((p, i) => `${xs[i].toFixed(1)},${y(p).toFixed(1)}`);
  const goalY = y(MASTERY);
  const last = points[points.length - 1];
  const lastX = xs[xs.length - 1];
  const lastY = y(last);
  // Keep the labels clear of the latest point.
  const goalLeft = lastY < goalY + 14;
  const valueY = lastY < bottom - 18 ? lastY + 18 : lastY - 10;

  return (
    <svg
      className="kd-week-chart"
      width="100%"
      height="96"
      viewBox={`0 0 ${W} 96`}
      role="img"
      aria-label={`Overall mastery over your last ${points.length} results, from ${points[0]}% to ${last}%. The goal is ${MASTERY}%.`}
    >
      <path d={`M${x0} ${goalY.toFixed(1)} H${W - 10}`} stroke="#cbb8a5" strokeWidth="1.2" strokeDasharray="4 4" />
      <text x={goalLeft ? x0 : W - 10} y={goalY - 5} textAnchor={goalLeft ? 'start' : 'end'} fill="#75665a" fontSize="10" fontWeight="700">
        {MASTERY}% goal
      </text>
      <path d={`M${x0},85 L${coords.join(' L')} L${lastX.toFixed(1)},85 Z`} fill="#de7a40" fillOpacity="0.14" />
      <polyline points={coords.join(' ')} fill="none" stroke="#de7a40" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      {xs.slice(0, -1).map((cx, i) => (
        <circle key={i} cx={cx} cy={y(points[i])} r="2.6" fill="#ffffff" stroke="#de7a40" strokeWidth="2" />
      ))}
      <circle cx={lastX} cy={lastY} r="5" fill="#a24c16" stroke="#ffffff" strokeWidth="2" />
      <text x={lastX} y={valueY} textAnchor="end" fill="#1d140e" fontSize="11" fontWeight="800">
        {last}%
      </text>
      <text x={x0} y="94" fill="#75665a" fontSize="9.5" fontWeight="700">
        {points.length - 1} results ago
      </text>
      <text x={W - 10} y="94" textAnchor="end" fill="#75665a" fontSize="9.5" fontWeight="700">
        Latest
      </text>
    </svg>
  );
}

export default function ThisWeekCard({ attempts, activity = [] }) {
  const w = useMemo(() => weekSummary(attempts, activity), [attempts, activity]);
  const missing = MIN_POINTS - w.points.length;
  const tone = w.delta > 0 ? 'is-up' : w.delta < 0 ? 'is-down' : '';
  const deltaText =
    w.delta === null ? 'No results this week' : w.delta === 0 ? 'No change this week' : `${w.delta > 0 ? '+' : '−'}${Math.abs(w.delta)}% this week`;

  return (
    <article className="kd-week">
      <div className="kd-week-head">
        <h2>This week</h2>
        <Link to="/dashboard/progress">Progress</Link>
      </div>

      <ul className="kd-week-days" aria-label="Days you studied this week">
        {w.days.map((d) => (
          <li key={d.name} className={d.today ? 'is-today' : undefined}>
            <span className={`kd-week-dot ${d.done ? 'is-done' : ''}`} aria-hidden="true" />
            <span aria-hidden="true">{d.label}</span>
            <span className="kd-sr-only">
              {d.name}: {d.done ? 'studied' : 'not studied'}
              {d.today ? ' (today)' : ''}
            </span>
          </li>
        ))}
      </ul>

      <div className="kd-week-trend">
        <div className="kd-week-trend-head">
          <span>Mastery trend</span>
          {missing <= 0 && <span className={`kd-week-delta ${tone}`}>{deltaText}</span>}
        </div>
        {missing > 0 ? (
          <p className="kd-week-wait">
            Take {missing} more quiz{missing === 1 ? '' : 'zes'} to see your trend.
          </p>
        ) : (
          <>
            <TrendChart points={w.points} />
            {w.biggest && (
              <p className="kd-week-gain">
                Biggest gain: <b>{w.biggest.name} +{w.biggest.gain}%</b>
              </p>
            )}
          </>
        )}
      </div>

      <p className="kd-week-foot">
        {w.quizzesTaken} quiz{w.quizzesTaken === 1 ? '' : 'zes'} taken · {w.gapsClosed} gap{w.gapsClosed === 1 ? '' : 's'} closed this week
      </p>
    </article>
  );
}
