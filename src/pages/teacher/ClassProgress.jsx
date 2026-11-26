import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TOPICS } from '../../data/curriculum';
import { isOpenGap, overallMastery, topicStatus } from '../../lib/engine';
import { pctText, quizAverage } from '../../data/classData';
import { formatDate } from '../../hooks/dashboardHooks';
import { useClassRoster } from '../../store/learningStore';
import { Avatar, EmptyState } from '../../components/dashboard/DashWidgets';

/** Overall mastery after each result, oldest first: the student's progress line. */
function masteryTimeline(attempts) {
  const sorted = [...attempts].sort((a, b) => a.takenAt - b.takenAt);
  return sorted.map((a, i) => ({ takenAt: a.takenAt, pct: overallMastery(topicStatus(sorted.slice(0, i + 1))) }));
}

/** A small line of mastery over time (0-100). */
function Sparkline({ points }) {
  if (points.length < 2) return <span className="kd-muted kd-small">{points.length ? 'One result so far' : '—'}</span>;
  const W = 120;
  const H = 32;
  const x = (i) => (i / (points.length - 1)) * (W - 4) + 2;
  const y = (p) => H - 2 - (p / 100) * (H - 4);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.pct).toFixed(1)}`).join(' ');
  const up = points.at(-1).pct >= points[0].pct;
  return (
    <svg className="kd-spark" width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Mastery from ${points[0].pct}% to ${points.at(-1).pct}%`}>
      <line x1="2" x2={W - 2} y1={y(80)} y2={y(80)} className="kd-spark-goal" />
      <path d={d} fill="none" stroke={up ? '#047857' : '#b42318'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(points.length - 1)} cy={y(points.at(-1).pct)} r="3" fill={up ? '#047857' : '#b42318'} />
    </svg>
  );
}

/**
 * Teacher: how each enrolled student's mastery has changed since their first quiz, the gaps
 * they closed with mastery checks, and the gaps still open.
 */
export default function ClassProgress() {
  const { students } = useClassRoster();
  const [sortBy, setSortBy] = useState('change'); // 'change' | 'name' | 'now'

  const rows = useMemo(
    () =>
      students.map((s) => {
        const quizzes = s.attempts.filter((a) => a.kind === 'quiz');
        const timeline = masteryTimeline(s.attempts);
        const start = timeline[0]?.pct ?? null;
        const now = quizAverage(s);
        return {
          s,
          timeline,
          start,
          now,
          change: start !== null && now !== null ? now - start : null,
          quizzes: quizzes.length,
          closed: s.attempts.filter((a) => a.kind === 'check' && a.passed).length,
          open: TOPICS.filter((t) => isOpenGap(s.status?.[t.id])).length,
        };
      }),
    [students]
  );

  const withResults = rows.filter((r) => r.timeline.length);
  const compared = rows.filter((r) => r.change !== null && r.timeline.length > 1);
  const avgChange = compared.length ? Math.round(compared.reduce((sum, r) => sum + r.change, 0) / compared.length) : null;
  const improving = compared.filter((r) => r.change > 0).length;
  const closedTotal = rows.reduce((sum, r) => sum + r.closed, 0);

  const sorted = [...rows].sort((a, b) => {
    if (sortBy === 'name') return a.s.name.localeCompare(b.s.name);
    if (sortBy === 'now') return (a.now ?? 101) - (b.now ?? 101);
    return (b.change ?? -999) - (a.change ?? -999);
  });

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Progress</p>
          <h1>Student progress</h1>
          <p>How each student&rsquo;s mastery has changed since their first quiz, and the gaps they have closed with mastery checks.</p>
        </div>
      </header>

      {!withResults.length ? (
        <article className="kd-card">
          <EmptyState icon="📈" title="No progress to show yet">
            Progress appears once the students enrolled in your courses take quizzes.
          </EmptyState>
        </article>
      ) : (
        <>
          <div className="kd-stat-tiles">
            <article className="kd-card kd-stat-tile">
              <small>Average change</small>
              <strong>{avgChange === null ? '—' : `${avgChange > 0 ? '+' : ''}${avgChange}`}</strong>
              <span className="kd-muted kd-small">mastery points since the first quiz</span>
            </article>
            <article className="kd-card kd-stat-tile">
              <small>Improving</small>
              <strong>
                {improving}
                <span>/{compared.length}</span>
              </strong>
              <span className="kd-muted kd-small">students with 2+ results</span>
            </article>
            <article className="kd-card kd-stat-tile">
              <small>Gaps closed</small>
              <strong>{closedTotal}</strong>
              <span className="kd-muted kd-small">mastery checks passed</span>
            </article>
            <article className="kd-card kd-stat-tile">
              <small>Quizzes taken</small>
              <strong>{rows.reduce((sum, r) => sum + r.quizzes, 0)}</strong>
              <span className="kd-muted kd-small">by {withResults.length} student{withResults.length === 1 ? '' : 's'}</span>
            </article>
          </div>

          <article className="kd-card">
            <header className="kd-card-head">
              <div>
                <h2>Every student</h2>
                <p>The line shows overall mastery after each result; the faint line is the 80% mastery mark.</p>
              </div>
              <div className="kd-segment" role="group" aria-label="Sort students">
                <button type="button" aria-pressed={sortBy === 'change'} onClick={() => setSortBy('change')}>Most improved</button>
                <button type="button" aria-pressed={sortBy === 'now'} onClick={() => setSortBy('now')}>Lowest now</button>
                <button type="button" aria-pressed={sortBy === 'name'} onClick={() => setSortBy('name')}>A–Z</button>
              </div>
            </header>
            <div className="kd-table-wrap">
              <table className="kd-table">
                <thead>
                  <tr>
                    <th scope="col">Student</th>
                    <th scope="col">First quiz</th>
                    <th scope="col">Now</th>
                    <th scope="col">Change</th>
                    <th scope="col">Trend</th>
                    <th scope="col">Quizzes</th>
                    <th scope="col">Gaps closed</th>
                    <th scope="col">Open gaps</th>
                    <th scope="col">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => (
                    <tr key={r.s.id}>
                      <td>
                        <Link to={`/dashboard/students/${r.s.id}`} className="kd-person">
                          <Avatar name={r.s.name} size={30} /> <strong>{r.s.name}</strong>
                        </Link>
                      </td>
                      <td>{pctText(r.start)}</td>
                      <td>{pctText(r.now)}</td>
                      <td>
                        {r.change === null || r.timeline.length < 2 ? (
                          <span className="kd-muted">—</span>
                        ) : (
                          <strong className={r.change > 0 ? 'kd-up' : r.change < 0 ? 'kd-down' : ''}>
                            {r.change > 0 ? '+' : ''}
                            {r.change}
                          </strong>
                        )}
                      </td>
                      <td>
                        <Sparkline points={r.timeline} />
                      </td>
                      <td>{r.quizzes || <span className="kd-muted">0</span>}</td>
                      <td>{r.closed || <span className="kd-muted">0</span>}</td>
                      <td>{r.open || <span className="kd-muted">0</span>}</td>
                      <td>{r.s.lastActive ? formatDate(r.s.lastActive) : <span className="kd-muted">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </>
      )}
    </section>
  );
}
