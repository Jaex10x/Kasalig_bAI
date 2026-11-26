import { Link } from 'react-router-dom';
import { DIFFICULTY_LABELS, GAP_TYPES, LESSONS, SEVERITIES, TOPICS } from '../../data/curriculum';
import { CHECK_PASS, CHECK_SIZE, PRACTICE_GOAL } from '../../lib/engine';
import { formatDate, useStudentProgress } from '../../hooks/dashboardHooks';
import { EmptyState, LangToggle } from '../../components/dashboard/DashWidgets';
import { ChangesPanel } from '../../components/dashboard/Recommendations';
import { CheckIcon } from '../../components/dashboard/DashIcons';

/** The personalized learning path: one card per open gap, prerequisites first. */
export default function LearningPath() {
  const { student, path, status, latest, changes, attempts } = useStudentProgress();
  const lang = student.lang ?? 'en';
  const closed = TOPICS.filter((t) => status[t.id]?.closed);

  if (!attempts.length) {
    return (
      <section className="kd-stage kd-page">
        <EmptyState
          icon="🧭"
          title="Your learning path starts with a quiz"
          action={<Link to="/dashboard/quiz" className="kd-btn kd-btn-dark">Take a diagnostic</Link>}
        >
          Once we know where your gaps are, this page lists lessons, practice and a mastery check for each one, in the right order.
        </EmptyState>
      </section>
    );
  }

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Learning path</p>
          <h1>{path.length ? `${path.length} gap${path.length === 1 ? '' : 's'} to close` : 'No open gaps'}</h1>
          <p>
            Ordered so prerequisites come first. Updated after every result
            {latest && ` · last update ${formatDate(latest.takenAt, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}`}.
          </p>
        </div>
        <div className="kd-page-head-side">
          <span className="kd-muted kd-small">Lessons in</span>
          <LangToggle value={lang} onChange={student.setLang} />
        </div>
      </header>

      {changes && <ChangesPanel compact changes={changes} />}

      {path.length === 0 && (
        <EmptyState icon="🎉" title="Every gap is closed" action={<Link to="/dashboard/quiz" className="kd-btn kd-btn-dark">Take another quiz</Link>}>
          Take another quiz to check new topics; any new gaps will show up here.
        </EmptyState>
      )}

      <div className="kd-lp">
        {path.map((item) => {
          const { topic, gap, practice, waitingOn } = item;
          const lesson = LESSONS[topic.id][lang] ?? LESSONS[topic.id].en;
          const checkStep = item.steps[2];
          const hasResources = item.resources.length > 0;
          return (
            <article key={topic.id} className="kd-card kd-lp-card">
              <header>
                <h2 className="kd-lp-title">{topic.name}</h2>
                <p className="kd-lp-meta">
                  {GAP_TYPES[gap.type].label} · {SEVERITIES[gap.severity].label} · {item.pct}%
                </p>
              </header>
              <p className="kd-lp-summary">{gap.summary}</p>
              {waitingOn.length > 0 && (
                <p className="kd-lp-note">
                  Fix {waitingOn.map((t) => t.name).join(' and ')} first: {waitingOn.length === 1 ? 'it is a prerequisite' : 'they are prerequisites'} for this topic.
                </p>
              )}
              {item.lastCheck && (
                <p className="kd-lp-note">Last mastery check: {item.lastCheck.pct}%. A little more practice, then try again.</p>
              )}

              <ul className="kd-lp-steps">
                <li>
                  <strong>1. Short lesson</strong>
                  <span className="kd-lp-status">{practice.lessonRead ? 'Done' : '2 min read'}</span>
                  <details className="kd-lp-lesson" open={!practice.lessonRead}>
                    <summary>{practice.lessonRead ? 'Read again' : 'Read the lesson'}</summary>
                    <div lang={lang === 'en' ? 'en' : lang === 'fil' ? 'fil' : 'ceb'}>
                      <p>{lesson.summary}</p>
                      <ol>
                        {lesson.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                      {!practice.lessonRead && (
                        <button type="button" className="kd-lp-btn" onClick={() => student.markLessonRead(topic.id, gap.attemptId)}>
                          Mark as read
                        </button>
                      )}
                    </div>
                  </details>
                </li>

                <li className="kd-lp-step">
                  <div>
                    <strong>2. Practice</strong>
                    <span className="kd-lp-status">
                      {practice.done
                        ? `Done · ${practice.correct}/${practice.answered} correct`
                        : `${DIFFICULTY_LABELS[practice.level]} · ${practice.goal} of ${PRACTICE_GOAL} right at Medium or Hard`}
                    </span>
                  </div>
                  <Link to={`/dashboard/practice/${topic.id}`} className="kd-lp-btn is-primary">
                    {practice.answered ? 'Continue' : 'Start'}
                  </Link>
                </li>

                {hasResources && (
                  <li>
                    <strong>3. Study materials</strong>
                    <ul className="kd-lp-res">
                      {item.resources.map((r) => {
                        const label = `${r.type}${r.minutes ? `, ${r.minutes} min` : ''}${r.builtIn ? '' : ', from your teacher'}`;
                        return (
                          <li key={r.id ?? r.title}>
                            {r.url ? (
                              <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>
                            ) : (
                              <span>{r.title}</span>
                            )}{' '}
                            <span className="kd-lp-status">({label})</span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                )}

                <li className="kd-lp-step">
                  <div>
                    <strong>{hasResources ? 4 : 3}. Mastery check</strong>
                    <span className="kd-lp-status">
                      {checkStep.locked
                        ? waitingOn.length
                          ? 'Available after the prerequisite gap is closed'
                          : 'Available when practice is done'
                        : `${CHECK_SIZE} questions · get ${CHECK_PASS} right to close this gap`}
                    </span>
                  </div>
                  {checkStep.locked ? (
                    <span className="kd-lp-btn" aria-disabled="true">Not yet</span>
                  ) : (
                    <Link to={`/dashboard/check/${topic.id}`} className="kd-lp-btn is-primary">
                      Take the check
                    </Link>
                  )}
                </li>
              </ul>
            </article>
          );
        })}
      </div>

      {closed.length > 0 && (
        <article className="kd-card">
          <header className="kd-card-head">
            <div>
              <h2>Closed gaps</h2>
              <p>Passed a mastery check. A future quiz can reopen a gap if the topic slips.</p>
            </div>
          </header>
          <ul className="kd-closed-list">
            {closed.map((t) => (
              <li key={t.id}>
                <span className="kd-closed-badge">
                  <CheckIcon size={14} /> Closed
                </span>
                <strong>{t.name}</strong>
                <span className="kd-muted kd-small">
                  {status[t.id].pct}% · {formatDate(status[t.id].closedAt)}
                </span>
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}
