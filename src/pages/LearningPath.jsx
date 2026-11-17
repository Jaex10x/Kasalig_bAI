import { Link } from 'react-router-dom';
import { DIAGNOSTIC, DIFFICULTY_LABELS, LESSONS, TOPICS } from '../components/dashboard/curriculum';
import { CHECK_PASS, CHECK_SIZE, PRACTICE_GOAL } from '../components/dashboard/engine';
import { formatDate, useStudentProgress } from '../components/dashboard/dashboardHooks';
import { EmptyState, GapTypeChip, LangToggle, SeverityChip } from '../components/dashboard/DashWidgets';
import { ChangesPanel } from '../components/dashboard/Recommendations';
import { ArrowIcon, BookIcon, CheckIcon, LinkIcon, LockIcon, PencilIcon, PlayIcon } from '../components/dashboard/DashIcons';

const RESOURCE_ICONS = { Video: PlayIcon, Reading: BookIcon, Worksheet: PencilIcon, PDF: BookIcon, Link: LinkIcon };

function StepMark({ n, done, locked }) {
  return (
    <span className={`kd-step-mark ${done ? 'is-done' : ''} ${locked ? 'is-locked' : ''}`} aria-hidden="true">
      {done ? <CheckIcon size={15} /> : locked ? <LockIcon size={14} /> : n}
    </span>
  );
}

/** The personalized learning path: one card per open gap, prerequisites first. */
export default function LearningPath() {
  const { student, path, status, latest, changes } = useStudentProgress();
  const lang = student.lang ?? 'en';
  const closed = TOPICS.filter((t) => status[t.id]?.closed);

  if (!student.attempts.length) {
    return (
      <section className="kd-stage kd-page">
        <EmptyState
          icon="🧭"
          title="Your learning path starts with a quiz"
          action={<Link to={`/dashboard/quiz/${DIAGNOSTIC.id}`} className="kd-btn kd-btn-dark">Take the diagnostic</Link>}
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

      <ol className="kd-path">
        {path.map((item, i) => {
          const { topic, gap, practice, waitingOn } = item;
          const lesson = LESSONS[topic.id][lang] ?? LESSONS[topic.id].en;
          const checkStep = item.steps[2];
          return (
            <li key={topic.id} className="kd-path-item" style={{ '--c': topic.color, '--t': topic.tint, '--delay': `${i * 80}ms` }}>
              <span className="kd-path-num" aria-hidden="true">{i + 1}</span>
              <article className="kd-card kd-path-card">
                <header className="kd-path-head">
                  <div>
                    <h2>{topic.name}</h2>
                    <div className="kd-chip-row">
                      <GapTypeChip type={gap.type} />
                      <SeverityChip severity={gap.severity} />
                      <span className="kd-chip kd-chip-soft">Now {item.pct}%</span>
                    </div>
                  </div>
                </header>
                <p className="kd-gap-summary">{gap.summary}</p>
                {waitingOn.length > 0 && (
                  <p className="kd-path-note">
                    <LockIcon size={15} /> Fix {waitingOn.map((t) => t.name).join(' and ')} first: {waitingOn.length === 1 ? 'it is a prerequisite' : 'they are prerequisites'} for this topic.
                  </p>
                )}
                {item.lastCheck && (
                  <p className="kd-path-note is-soft">
                    Last mastery check: {item.lastCheck.pct}%. A little more practice, then try again.
                  </p>
                )}

                <ol className="kd-steps">
                  <li className="kd-step">
                    <StepMark n={1} done={practice.lessonRead} />
                    <details className="kd-step-body" open={!practice.lessonRead}>
                      <summary>
                        <strong>Short lesson</strong>
                        <span className="kd-muted kd-small">2 min read</span>
                      </summary>
                      <div className="kd-lesson" lang={lang === 'en' ? 'en' : lang === 'fil' ? 'fil' : 'ceb'}>
                        <p>{lesson.summary}</p>
                        <ol>
                          {lesson.steps.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ol>
                        {!practice.lessonRead && (
                          <button type="button" className="kd-btn kd-btn-soft" onClick={() => student.markLessonRead(topic.id, gap.attemptId)}>
                            <CheckIcon size={16} /> I&rsquo;ve read this
                          </button>
                        )}
                      </div>
                    </details>
                  </li>

                  <li className="kd-step">
                    <StepMark n={2} done={practice.done} />
                    <div className="kd-step-body">
                      <div className="kd-step-row">
                        <div>
                          <strong>Adaptive practice</strong>
                          <p className="kd-muted kd-small">
                            {practice.done
                              ? `Done · ${practice.correct}/${practice.answered} correct`
                              : `Level ${DIFFICULTY_LABELS[practice.level]} · ${practice.goal}/${PRACTICE_GOAL} right at Medium or Hard`}
                          </p>
                          <span className="kd-mini-progress" aria-hidden="true">
                            <span style={{ width: `${Math.min(100, (practice.goal / PRACTICE_GOAL) * 100)}%` }} />
                          </span>
                        </div>
                        <Link to={`/dashboard/practice/${topic.id}`} className="kd-btn kd-btn-dark kd-btn-sm">
                          {practice.answered ? 'Continue' : 'Start'} <ArrowIcon size={16} />
                        </Link>
                      </div>
                    </div>
                  </li>

                  <li className="kd-step">
                    <StepMark n={3} done={false} />
                    <div className="kd-step-body">
                      <strong>Recommended resources</strong>
                      <ul className="kd-res-list">
                        {item.resources.map((r) => {
                          const Icon = RESOURCE_ICONS[r.type] ?? LinkIcon;
                          const body = (
                            <>
                              <span className="kd-material-icon" aria-hidden="true">
                                <Icon size={16} />
                              </span>
                              <span>
                                <strong>{r.title}</strong>
                                <small>
                                  {r.type}
                                  {r.minutes ? ` · ${r.minutes} min` : ''}
                                  {r.builtIn ? ' · built-in' : ' · from your teacher'}
                                </small>
                              </span>
                            </>
                          );
                          return (
                            <li key={r.id ?? r.title}>
                              {r.url ? (
                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="kd-res-item is-link">
                                  {body}
                                </a>
                              ) : (
                                <span className="kd-res-item">{body}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>

                  <li className="kd-step">
                    <StepMark n={4} done={false} locked={checkStep.locked} />
                    <div className="kd-step-body">
                      <div className="kd-step-row">
                        <div>
                          <strong>Mastery check</strong>
                          <p className="kd-muted kd-small">
                            {checkStep.locked
                              ? waitingOn.length
                                ? 'Unlocks after the prerequisite gap is closed.'
                                : 'Unlocks when practice is done.'
                              : `${CHECK_SIZE} questions · get ${CHECK_PASS} right and this gap is marked Closed.`}
                          </p>
                        </div>
                        {checkStep.locked ? (
                          <span className="kd-btn kd-btn-ghost kd-btn-sm is-disabled" aria-disabled="true">
                            <LockIcon size={15} /> Locked
                          </span>
                        ) : (
                          <Link to={`/dashboard/check/${topic.id}`} className="kd-btn kd-btn-accent kd-btn-sm">
                            Take the check <ArrowIcon size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                </ol>
              </article>
            </li>
          );
        })}
      </ol>

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
