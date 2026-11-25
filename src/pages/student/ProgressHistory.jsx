import { Link } from 'react-router-dom';
import { DIAGNOSTIC, TOPICS, subjectById } from '../../data/curriculum';
import { formatDate, useStudentProgress } from '../../hooks/dashboardHooks';
import { EmptyState, LevelChip, MasteryRing, Sparkline } from '../../components/dashboard/DashWidgets';
import { ArrowIcon } from '../../components/dashboard/DashIcons';

/** Progress history: every saved result, scores by topic over time, streaks, badges, subject mastery. */
export default function ProgressHistory() {
  const { student, status, subjects, streak, badges } = useStudentProgress();
  const attempts = [...student.attempts].sort((a, b) => b.takenAt - a.takenAt);
  const earned = badges.filter((b) => b.earned).length;

  if (!attempts.length) {
    return (
      <section className="kd-stage kd-page">
        <EmptyState
          icon="📈"
          title="Your progress shows up here"
          action={
            <div className="kd-row-actions">
              <Link to={`/dashboard/quiz/${DIAGNOSTIC.id}`} className="kd-btn kd-btn-dark">Take the diagnostic</Link>
              <button type="button" className="kd-btn kd-btn-ghost" onClick={student.loadSampleHistory}>
                Load sample history
              </button>
            </div>
          }
        >
          Every quiz and mastery check is saved, so you can watch each topic improve.
        </EmptyState>
      </section>
    );
  }

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Progress</p>
          <h1>How far you&rsquo;ve come</h1>
          <p>
            {attempts.length} saved result{attempts.length === 1 ? '' : 's'} · {streak.days} active day{streak.days === 1 ? '' : 's'}
          </p>
        </div>
      </header>

      <div className="kd-progress-top">
        {subjects.map((s) => (
          <article key={s.id} className="kd-card kd-subject-card" style={{ '--c': s.color, '--t': s.tint }}>
            <MasteryRing value={s.value} size={112} stroke={11} tone="dark" color={s.color} label="mastery" />
            <div>
              <h2>{s.name}</h2>
              <p className="kd-muted kd-small">{s.grade}</p>
              <p className="kd-small">
                {s.tested}/{s.total} topics tested
              </p>
            </div>
          </article>
        ))}
        <article className="kd-card kd-streak-card">
          <span className="kd-streak-flame" aria-hidden="true">🔥</span>
          <div>
            <strong>{streak.current}</strong>
            <span>day streak</span>
          </div>
          <p className="kd-muted kd-small">Best: {streak.best} days</p>
        </article>
      </div>

      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>Achievements</h2>
            <p>
              {earned} of {badges.length} badges earned
            </p>
          </div>
        </header>
        <ul className="kd-badges">
          {badges.map((b) => (
            <li key={b.id} className={b.earned ? 'is-earned' : ''}>
              <span className="kd-badge-icon" aria-hidden="true">{b.icon}</span>
              <strong>{b.name}</strong>
              <small>{b.text}</small>
              <span className="kd-sr-only">{b.earned ? 'Earned' : 'Not earned yet'}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>Scores by topic</h2>
            <p>Each dot is a quiz or mastery check. The dashed line is the 80% mastery mark.</p>
          </div>
        </header>
        <ul className="kd-trends">
          {TOPICS.map((t) => {
            const s = status[t.id];
            const points = (s?.history ?? []).map((h) => h.pct);
            const change = points.length > 1 ? points.at(-1) - points[0] : null;
            return (
              <li key={t.id}>
                <div className="kd-trend-name">
                  <strong>{t.name}</strong>
                  <small>{subjectById(t.subjectId).name}</small>
                </div>
                <Sparkline points={points} color={t.color} />
                <div className="kd-trend-end">
                  <strong>{s ? `${s.pct}%` : '—'}</strong>
                  {change !== null && change !== 0 && (
                    <small className={change > 0 ? 'is-up' : 'is-down'}>
                      {change > 0 ? '▲' : '▼'} {Math.abs(change)}
                    </small>
                  )}
                </div>
                <LevelChip pct={s?.pct ?? null} />
              </li>
            );
          })}
        </ul>
      </article>

      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>Every result</h2>
            <p>Open one to see its full gap report.</p>
          </div>
          <button
            type="button"
            className="kd-btn kd-btn-ghost kd-btn-sm"
            onClick={() => {
              if (window.confirm('Delete your saved quiz history and practice progress? Your teacher will no longer see these results.')) student.clearHistory();
            }}
          >
            Clear history
          </button>
        </header>
        <div className="kd-table-wrap">
          <table className="kd-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Assessment</th>
                <th scope="col">Score</th>
                <th scope="col">Gaps found</th>
                <th scope="col">
                  <span className="kd-sr-only">Report</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td>{formatDate(a.takenAt, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</td>
                  <td>
                    <strong>{a.title}</strong>
                    {a.kind === 'check' && (
                      <span className={`kd-chip ${a.passed ? 'kd-chip-ok' : 'kd-chip-soft'}`}>{a.passed ? 'Gap closed' : 'Not passed'}</span>
                    )}
                    {a.sample && <span className="kd-chip kd-chip-soft">Sample</span>}
                  </td>
                  <td>
                    <strong>{a.pct}%</strong> <span className="kd-muted">({a.correct}/{a.total})</span>
                  </td>
                  <td>{a.kind === 'quiz' ? a.gaps.length : '—'}</td>
                  <td>
                    <Link to={`/dashboard/results/${a.id}`} className="kd-icon-link" aria-label={`Open report for ${a.title}`}>
                      <ArrowIcon size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
