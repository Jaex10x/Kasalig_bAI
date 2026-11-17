import useAuth from '../context/useAuth';
import { COMPETENCIES, DIAGNOSTIC, QUESTION_BANK, SUBJECTS, topicById, topicsOf } from '../components/dashboard/curriculum';
import { MASTERY, masteryLevel } from '../components/dashboard/engine';
import { topicAverage } from '../components/dashboard/classData';
import { useClassData } from '../components/dashboard/store';
import { LevelChip } from '../components/dashboard/DashWidgets';

/**
 * Curriculum alignment: every competency (MELC code) with whether it has been
 * taught, how many quiz questions test it, and how well the class has mastered it.
 */
export default function CurriculumMap() {
  const { user } = useAuth();
  const { quizzes, taught, setTaught } = useClassData();
  const canEdit = user.role === 'teacher';

  const published = quizzes.filter((q) => q.published);
  const rows = COMPETENCIES.map((c) => {
    const inDiagnostic = QUESTION_BANK.filter((q) => q.competencyId === c.id && DIAGNOSTIC.questionIds.includes(q.id)).length;
    const inQuizzes = published.reduce((n, q) => n + q.questions.filter((x) => x.competencyId === c.id).length, 0);
    const mastery = topicAverage(c.topicId);
    return { ...c, topic: topicById(c.topicId), tested: inDiagnostic + inQuizzes, inDiagnostic, inQuizzes, mastery, isTaught: Boolean(taught[c.id]) };
  });

  const counts = {
    total: rows.length,
    taught: rows.filter((r) => r.isTaught).length,
    tested: rows.filter((r) => r.tested > 0).length,
    mastered: rows.filter((r) => r.mastery >= MASTERY).length,
  };
  const gaps = rows.filter((r) => r.isTaught && r.tested === 0);
  const untaughtTested = rows.filter((r) => !r.isTaught && r.tested > 0);

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Curriculum alignment</p>
          <h1>Competency map (MELCs)</h1>
          <p>Each topic and question is mapped to a learning competency. See which ones have been taught, tested and mastered.</p>
        </div>
      </header>

      <div className="kd-stat-tiles">
        {[
          ['Competencies', counts.total, ''],
          ['Taught', counts.taught, 'marked by the teacher'],
          ['Tested', counts.tested, 'in the diagnostic or a published quiz'],
          ['Mastered', counts.mastered, `class average ≥ ${MASTERY}%`],
        ].map(([label, value, sub]) => (
          <article key={label} className="kd-card kd-stat-tile">
            <small>{label}</small>
            <strong>
              {value}
              {label !== 'Competencies' && <span>/{counts.total}</span>}
            </strong>
            {sub && <span className="kd-muted kd-small">{sub}</span>}
          </article>
        ))}
      </div>

      {(gaps.length > 0 || untaughtTested.length > 0) && (
        <article className="kd-card kd-align-alerts">
          <h2>Alignment checks</h2>
          <ul className="kd-plain-list">
            {gaps.map((r) => <li key={r.id}>{r.code} is taught but not tested yet. Add a question to a quiz.</li>)}
            {untaughtTested.map((r) => <li key={r.id}>{r.code} is tested but not marked as taught.</li>)}
          </ul>
        </article>
      )}

      {SUBJECTS.map((s) => (
        <article key={s.id} className="kd-card">
          <header className="kd-card-head">
            <div>
              <h2>{s.name}</h2>
              <p>{s.grade}</p>
            </div>
          </header>
          <div className="kd-table-wrap">
            <table className="kd-table kd-align-table">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Competency</th>
                  <th scope="col">Topic</th>
                  <th scope="col">Taught</th>
                  <th scope="col">Tested</th>
                  <th scope="col">Class mastery</th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .filter((r) => topicsOf(s.id).some((t) => t.id === r.topicId))
                  .map((r) => (
                    <tr key={r.id}>
                      <td className="kd-code">{r.code}</td>
                      <td>{r.text}</td>
                      <td>
                        <span className="kd-chip" style={{ color: r.topic.color, background: r.topic.tint }}>{r.topic.name}</span>
                      </td>
                      <td>
                        {canEdit ? (
                          <label className="kd-switch">
                            <input type="checkbox" checked={r.isTaught} onChange={(e) => setTaught(r.id, e.target.checked)} />
                            <span aria-hidden="true" />
                            <span className="kd-sr-only">Taught</span>
                            {r.isTaught ? 'Yes' : 'No'}
                          </label>
                        ) : (
                          <span>{r.isTaught ? 'Yes' : 'No'}</span>
                        )}
                      </td>
                      <td>
                        {r.tested ? (
                          <span title={`${r.inDiagnostic} in the diagnostic, ${r.inQuizzes} in published quizzes`}>
                            {r.tested} question{r.tested === 1 ? '' : 's'}
                          </span>
                        ) : (
                          <span className="kd-chip" style={{ color: masteryLevel(null).color, background: masteryLevel(null).tint }}>Not tested</span>
                        )}
                      </td>
                      <td>
                        <span className="kd-mastery-cell">
                          {r.mastery}% <LevelChip pct={r.mastery} />
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </article>
      ))}
      <p className="kd-muted kd-small">Codes follow the DepEd MELC format; confirm them against the official list for your grade level. Class mastery uses the sample section until real results are available.</p>
    </section>
  );
}
