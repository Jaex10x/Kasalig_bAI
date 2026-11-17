import { Link } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { GAP_TYPES, TOPICS, topicById } from '../../data/curriculum';
import { heatColor } from '../../data/classData';
import { QUARTERS, sectionResults } from '../../data/schoolData';
import { greeting } from '../../hooks/dashboardHooks';
import { useSchoolData } from '../../store/learningStore';
import { SampleNotice } from '../../components/dashboard/DashWidgets';

const GRADE_COLORS = { 7: '#0ea5e9', 8: '#10b981', 9: '#de7a40', 10: '#8b5cf6' };
const avg = (nums) => (nums.length ? Math.round(nums.reduce((s, n) => s + n, 0) / nums.length) : null);

/** Line chart of average mastery per quarter, one line per grade level. */
function TrendChart({ series }) {
  const W = 560;
  const H = 220;
  const pad = { l: 36, r: 16, t: 14, b: 28 };
  const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (QUARTERS.length - 1);
  const y = (v) => pad.t + ((100 - v) / 70) * (H - pad.t - pad.b); // 30–100 range
  return (
    <figure className="kd-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Average mastery per quarter by grade level">
        {[40, 60, 80, 100].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke={v === 80 ? '#e8c9ad' : '#f1e7dc'} strokeDasharray={v === 80 ? '4 4' : undefined} />
            <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" className="kd-chart-axis">{v}</text>
          </g>
        ))}
        {QUARTERS.map((q, i) => (
          <text key={q} x={x(i)} y={H - 8} textAnchor="middle" className="kd-chart-axis">{q}</text>
        ))}
        {series.map((s) => (
          <g key={s.grade}>
            <path
              d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')}
              fill="none"
              stroke={GRADE_COLORS[s.grade]}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {s.values.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r="4" fill="#fff" stroke={GRADE_COLORS[s.grade]} strokeWidth="2.5" />
            ))}
          </g>
        ))}
      </svg>
      <figcaption className="kd-chart-legend">
        {series.map((s) => (
          <span key={s.grade}>
            <i style={{ background: GRADE_COLORS[s.grade] }} /> Grade {s.grade}: {s.values.at(-1)}%
          </span>
        ))}
      </figcaption>
      <table className="kd-sr-only">
        <caption>Average mastery per quarter</caption>
        <thead>
          <tr><th>Grade</th>{QUARTERS.map((q) => <th key={q}>{q}</th>)}</tr>
        </thead>
        <tbody>
          {series.map((s) => (
            <tr key={s.grade}><th>Grade {s.grade}</th>{s.values.map((v, i) => <td key={i}>{v}%</td>)}</tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** School-wide analytics: gap trends across sections and grade levels. */
export default function AdminDashboard() {
  const { user } = useAuth();
  const { classes } = useSchoolData();

  const sections = classes.map((c) => ({ ...c, results: sectionResults(c.id) }));
  const withResults = sections.filter((s) => s.results);
  const grades = [...new Set(withResults.map((s) => s.gradeLevel))].sort();

  const series = grades.map((g) => {
    const secs = withResults.filter((s) => s.gradeLevel === g);
    return {
      grade: g,
      values: QUARTERS.map((_, q) => avg(secs.map((s) => avg(s.results.topics.map((t) => t.quarters[q]))))),
      mix: Object.keys(GAP_TYPES).map((type) => ({ type, value: avg(secs.map((s) => s.results.gapMix[type])) })),
    };
  });

  const topicSchool = TOPICS.map((t) => {
    const vals = withResults.map((s) => s.results.topics.find((x) => x.id === t.id)?.latest).filter((v) => v !== undefined);
    return { ...t, avg: avg(vals), sections: vals.length };
  })
    .filter((t) => t.avg !== null)
    .sort((a, b) => a.avg - b.avg);

  const totalStudents = classes.reduce((s, c) => s + (Number(c.studentCount) || 0), 0);
  const schoolAvg = avg(withResults.map((s) => s.results.latestAvg));
  const declining = withResults.filter((s) => s.results.trend < 0);

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">{greeting()}, {user.fullName.split(/\s+/)[0]}</p>
          <h1>School-wide analytics</h1>
          <p>Gap trends across sections and grade levels. Section results are sample data until the backend aggregates real quiz results.</p>
        </div>
        <Link to="/dashboard/classes" className="kd-btn kd-btn-ghost">Manage classes</Link>
      </header>

      <div className="kd-stat-tiles">
        <article className="kd-card kd-stat-tile"><small>Sections</small><strong>{classes.length}</strong><span className="kd-muted kd-small">{withResults.length} with results</span></article>
        <article className="kd-card kd-stat-tile"><small>Students</small><strong>{totalStudents}</strong><span className="kd-muted kd-small">across all sections</span></article>
        <article className="kd-card kd-stat-tile"><small>Average mastery</small><strong>{schoolAvg ?? '—'}%</strong><span className="kd-muted kd-small">latest quarter</span></article>
        <article className="kd-card kd-stat-tile"><small>Declining sections</small><strong className={declining.length ? 'is-alert' : ''}>{declining.length}</strong><span className="kd-muted kd-small">{declining.map((d) => `G${d.gradeLevel} ${d.name}`).join(', ') || 'none'}</span></article>
      </div>

      <div className="kd-results-grid">
        <article className="kd-card">
          <header className="kd-card-head">
            <div>
              <h2>Mastery trend by grade level</h2>
              <p>Average across sections, per quarter. Dashed line: 80% mastery.</p>
            </div>
          </header>
          {series.length ? <TrendChart series={series} /> : <p className="kd-empty">No results yet.</p>}
        </article>

        <article className="kd-card">
          <header className="kd-card-head">
            <div>
              <h2>Gap types by grade level</h2>
              <p>What kind of gaps students have: where to focus support.</p>
            </div>
          </header>
          <ul className="kd-mix-list">
            {series.map((s) => (
              <li key={s.grade}>
                <strong>Grade {s.grade}</strong>
                <span className="kd-mix-bar" role="img" aria-label={s.mix.map((m) => `${GAP_TYPES[m.type].label} ${m.value}%`).join(', ')}>
                  {s.mix.map((m) => (
                    <span key={m.type} style={{ width: `${m.value}%`, background: GAP_TYPES[m.type].color }} title={`${GAP_TYPES[m.type].label}: ${m.value}%`}>
                      {m.value >= 14 ? `${m.value}%` : ''}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="kd-chart-legend">
            {Object.entries(GAP_TYPES).map(([id, t]) => (
              <span key={id}><i style={{ background: t.color }} /> {t.label}</span>
            ))}
          </p>
          {topicSchool[0] && (
            <SampleNotice>
              Weakest topic school-wide: <b>{topicSchool[0].name}</b> ({topicSchool[0].avg}%). Prerequisite gaps are highest in{' '}
              {series.length ? `Grade ${[...series].sort((a, b) => b.mix[2].value - a.mix[2].value)[0].grade}` : '—'}.
            </SampleNotice>
          )}
        </article>
      </div>

      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>Sections × topics</h2>
            <p>Latest quarter&rsquo;s average mastery per section. Blank cells are topics a grade level has not reached.</p>
          </div>
        </header>
        <div className="kd-heat-scroll">
          <table className="kd-heat-table">
            <thead>
              <tr>
                <th scope="col">Section</th>
                {TOPICS.map((t) => <th key={t.id} scope="col">{t.name}</th>)}
                <th scope="col">Trend / qtr</th>
              </tr>
            </thead>
            <tbody>
              {sections
                .sort((a, b) => b.gradeLevel - a.gradeLevel || a.name.localeCompare(b.name))
                .map((s) => (
                  <tr key={s.id}>
                    <th scope="row">
                      <span>
                        <b>G{s.gradeLevel}</b> {s.name}
                        <small className="kd-muted"> · {s.adviser || 'no adviser'}</small>
                      </span>
                    </th>
                    {TOPICS.map((t) => {
                      const v = s.results?.topics.find((x) => x.id === t.id)?.latest;
                      if (v === undefined) return <td key={t.id}><span className="kd-heat-cell is-empty">·</span></td>;
                      const c = heatColor(v);
                      return <td key={t.id}><span className="kd-heat-cell" style={{ background: c.bg, color: c.fg }}>{v}</span></td>;
                    })}
                    <td>
                      {s.results ? (
                        <strong className={s.results.trend >= 0 ? 'kd-up' : 'kd-down'}>
                          {s.results.trend >= 0 ? '▲' : '▼'} {Math.abs(s.results.trend)}
                        </strong>
                      ) : (
                        <span className="kd-muted kd-small">No results yet</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>Topics needing school-wide attention</h2>
            <p>Lowest average mastery first.</p>
          </div>
        </header>
        <ul className="kd-breakdown">
          {topicSchool.map((t) => {
            const topic = topicById(t.id);
            return (
              <li key={t.id}>
                <span className="kd-topic-icon is-small" style={{ '--c': topic.color, '--t': topic.tint }} aria-hidden="true"><span /></span>
                <div className="kd-breakdown-body">
                  <div className="kd-breakdown-top">
                    <strong>{t.name}</strong>
                    <span>{t.sections} section{t.sections === 1 ? '' : 's'} · <b>{t.avg}%</b></span>
                  </div>
                  <span className="kd-bar" aria-hidden="true"><span className="kd-bar-fill" style={{ width: `${t.avg}%`, background: heatColor(t.avg).fg }} /></span>
                </div>
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}
