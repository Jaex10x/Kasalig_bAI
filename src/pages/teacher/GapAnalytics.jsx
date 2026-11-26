import { Link } from 'react-router-dom';
import { GAP_TYPES, SEVERITIES, TOPICS } from '../../data/curriculum';
import { isOpenGap } from '../../lib/engine';
import { pctText, topicAverage, topicsFor } from '../../data/classData';
import { useClassRoster } from '../../store/learningStore';
import { Avatar, EmptyState, GapTypeChip, SectionTabs, SeverityChip } from '../../components/dashboard/DashWidgets';
import { TEACHER_TABS } from '../../components/dashboard/teacherTabs';

const TYPE_IDS = Object.keys(GAP_TYPES);
const SEVERITY_IDS = ['critical', 'moderate', 'mild'];

/**
 * Teacher: the learning gaps across the class, as the gap-detection engine found them in each
 * student's quiz results: how many, what kind (concept, careless, prerequisite), how severe,
 * in which topics, and which students carry the most.
 */
export default function GapAnalytics() {
  const { students } = useClassRoster();

  // Every open gap in the class: { student, topic, gap }.
  const gaps = students.flatMap((s) =>
    TOPICS.filter((t) => isOpenGap(s.status?.[t.id])).map((t) => ({ student: s, topic: t, gap: s.status[t.id].gap }))
  );
  const count = (pred) => gaps.filter(pred).length;
  const byType = TYPE_IDS.map((id) => ({ id, ...GAP_TYPES[id], n: count((g) => g.gap.type === id) }));
  const maxType = Math.max(1, ...byType.map((t) => t.n));
  const commonType = [...byType].sort((a, b) => b.n - a.n)[0];
  const withGaps = new Set(gaps.map((g) => g.student.id));
  const tested = students.filter((s) => Object.keys(s.scores).length > 0);

  const topics = topicsFor(students).map((t) => {
    const here = gaps.filter((g) => g.topic.id === t.id);
    const types = TYPE_IDS.map((id) => ({ id, n: here.filter((g) => g.gap.type === id).length })).sort((a, b) => b.n - a.n);
    return {
      ...t,
      open: here.length,
      severity: Object.fromEntries(SEVERITY_IDS.map((id) => [id, here.filter((g) => g.gap.severity === id).length])),
      mainType: types[0].n ? types[0].id : null,
      avg: topicAverage(students, t.id),
      testedCount: students.filter((s) => s.scores[t.id] !== undefined).length,
    };
  }).sort((a, b) => b.open - a.open || (a.avg ?? 101) - (b.avg ?? 101));

  const mostGaps = students
    .map((s) => ({ s, list: gaps.filter((g) => g.student.id === s.id) }))
    .filter((x) => x.list.length)
    .sort((a, b) => b.list.length - a.list.length || a.s.name.localeCompare(b.s.name))
    .slice(0, 8);

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Gap analytics</p>
          <h1>Learning gaps across your class</h1>
          <p>What the AI found in your students&rsquo; quiz answers: where the gaps are, what kind they are, and how serious.</p>
        </div>
      </header>
      <SectionTabs tabs={TEACHER_TABS.gaps} label="Gap analytics" />

      {!tested.length ? (
        <article className="kd-card">
          <EmptyState icon="🔎" title="No gaps to analyse yet">
            Gaps appear once the students enrolled in your courses take a quiz.
          </EmptyState>
        </article>
      ) : (
        <>
          <div className="kd-stat-tiles">
            <article className="kd-card kd-stat-tile">
              <small>Open gaps</small>
              <strong>{gaps.length}</strong>
              <span className="kd-muted kd-small">across {withGaps.size} of {tested.length} tested students</span>
            </article>
            <article className="kd-card kd-stat-tile">
              <small>Critical</small>
              <strong className={count((g) => g.gap.severity === 'critical') ? 'is-alert' : ''}>{count((g) => g.gap.severity === 'critical')}</strong>
              <span className="kd-muted kd-small">{count((g) => g.gap.severity === 'moderate')} moderate · {count((g) => g.gap.severity === 'mild')} mild</span>
            </article>
            <article className="kd-card kd-stat-tile">
              <small>Most common type</small>
              <strong className="kd-stat-text">{commonType.n ? commonType.short : '—'}</strong>
              <span className="kd-muted kd-small">{commonType.n ? `${commonType.n} of ${gaps.length} gaps` : 'No open gaps'}</span>
            </article>
          </div>

          <div className="kd-gapan-grid">
            <article className="kd-card">
              <header className="kd-card-head">
                <div>
                  <h2>Gap categories</h2>
                  <p>Why students are getting it wrong. Each type needs a different fix.</p>
                </div>
              </header>
              <ul className="kd-gapan-types">
                {byType.map((t) => (
                  <li key={t.id}>
                    <div className="kd-gapan-type-top">
                      <GapTypeChip type={t.id} />
                      <strong>{t.n}</strong>
                    </div>
                    <span className="kd-gapan-track">
                      <span style={{ width: `${(t.n / maxType) * 100}%`, background: t.color }} />
                    </span>
                    <small className="kd-muted">{t.hint}</small>
                  </li>
                ))}
              </ul>
            </article>

            <article className="kd-card">
              <header className="kd-card-head">
                <div>
                  <h2>Students with the most gaps</h2>
                  <p>Open a report to see their learning path and log an intervention.</p>
                </div>
              </header>
              {mostGaps.length === 0 ? (
                <p className="kd-muted">No open gaps. Every tested topic is at mastery.</p>
              ) : (
                <ul className="kd-gapan-students">
                  {mostGaps.map(({ s, list }) => (
                    <li key={s.id}>
                      <Link to={`/dashboard/students/${s.id}`} className="kd-person">
                        <Avatar name={s.name} size={32} />
                        <strong>{s.name}</strong>
                      </Link>
                      <span className="kd-chip-row">
                        {list.map((g) => (
                          <span
                            key={g.topic.id}
                            className="kd-chip"
                            style={{ color: SEVERITIES[g.gap.severity].color, background: SEVERITIES[g.gap.severity].tint }}
                            title={`${GAP_TYPES[g.gap.type].label}, ${SEVERITIES[g.gap.severity].label.toLowerCase()}`}
                          >
                            {g.topic.name}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          <article className="kd-card">
            <header className="kd-card-head">
              <div>
                <h2>Gaps by topic</h2>
                <p>Topics with the most open gaps first. Re-teach where many students share the same kind of gap.</p>
              </div>
            </header>
            <div className="kd-table-wrap">
              <table className="kd-table">
                <thead>
                  <tr>
                    <th scope="col">Topic</th>
                    <th scope="col">Class average</th>
                    <th scope="col">Students with a gap</th>
                    <th scope="col">Severity</th>
                    <th scope="col">Main cause</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <span className="kd-chip" style={{ color: t.color, background: t.tint }}>{t.name}</span>
                      </td>
                      <td>{pctText(t.avg)}</td>
                      <td>{t.testedCount ? `${t.open} of ${t.testedCount} tested` : <span className="kd-muted">Not tested yet</span>}</td>
                      <td>
                        {t.open ? (
                          <span className="kd-chip-row">
                            {SEVERITY_IDS.filter((id) => t.severity[id]).map((id) => (
                              <span key={id} className="kd-sev-count">
                                <SeverityChip severity={id} /> {t.severity[id]}
                              </span>
                            ))}
                          </span>
                        ) : (
                          <span className="kd-muted">—</span>
                        )}
                      </td>
                      <td>{t.mainType ? <GapTypeChip type={t.mainType} short /> : <span className="kd-muted">—</span>}</td>
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
