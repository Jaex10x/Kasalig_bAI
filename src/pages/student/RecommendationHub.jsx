import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Fireworks } from '../../components/landing/Fireworks';
import { GAP_TYPES, competencyById, topicById } from '../../data/curriculum';
import { CHECK_PASS, masteryLevel, studyReview } from '../../lib/engine';
import { formatDate, useStudentProgress } from '../../hooks/dashboardHooks';
import { Bar, EmptyState, GapTypeChip, LevelChip, MasteryRing, SeverityChip } from '../../components/dashboard/DashWidgets';
import { ArrowIcon, ChatIcon, CheckIcon, XIcon } from '../../components/dashboard/DashIcons';
import { ChangesPanel, RecCard, StudyReview } from '../../components/dashboard/Recommendations';

const SUMMARY = {
  mastered: 'Strong work. Only a few rough edges to polish.',
  developing: 'A solid base, with a few clear gaps to close.',
  gap: 'Plenty of room to grow. Your learning path shows where to start.',
};

/** The learning gap report for one attempt (the latest one if no id is given). */
export default function RecommendationHub() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { student, recs, changes } = useStudentProgress();
  const fireworksRef = useRef(null);
  const heroRef = useRef(null);

  const sorted = [...student.attempts].sort((a, b) => b.takenAt - a.takenAt);
  const attempt = attemptId ? student.attempts.find((a) => a.id === attemptId) : sorted[0];
  const celebrate = Boolean(location.state?.fresh) && attempt && (attempt.passed || (attempt.kind === 'quiz' && attempt.pct >= 80));

  // Celebrate once, right after finishing; then drop the flag so a refresh does not replay it.
  useEffect(() => {
    if (!location.state?.fresh) return undefined;
    const timer = setTimeout(() => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (celebrate && rect) fireworksRef.current?.launch(rect.left + rect.width * 0.8, rect.top + rect.height / 2);
      navigate(location.pathname, { replace: true, state: null });
    }, 350);
    return () => clearTimeout(timer);
  }, [celebrate, location.state, location.pathname, navigate]);

  if (!attempt) {
    return (
      <section className="kd-stage kd-page">
        <EmptyState icon="📋" title="No gap report yet" action={<Link to="/dashboard/quiz" className="kd-btn kd-btn-dark">Take a quiz</Link>}>
          Finish a quiz and your report shows up here.
        </EmptyState>
      </section>
    );
  }

  const isCheck = attempt.kind === 'check';
  const checkTopic = isCheck ? topicById(attempt.topicId) : null;
  const level = masteryLevel(attempt.pct);
  const wrong = attempt.items.filter((i) => !i.correct);
  const typeCounts = Object.keys(GAP_TYPES).map((type) => ({ type, ...GAP_TYPES[type], count: wrong.filter((w) => w.error === type).length }));
  const maxCount = Math.max(1, ...typeCounts.map((t) => t.count));

  let headline = `${attempt.correct} of ${attempt.total} correct`;
  let line = SUMMARY[level.id];
  if (isCheck) {
    headline = attempt.passed ? `Gap closed: ${checkTopic.name} 🎉` : `Not closed yet: ${checkTopic.name}`;
    line = attempt.passed
      ? `${attempt.correct} of ${attempt.total} correct. This gap is now marked Closed, and your learning path has been updated.`
      : `${attempt.correct} of ${attempt.total} correct; you need ${CHECK_PASS}. Do a bit more practice, then try the check again.`;
  }

  return (
    <section className="kd-stage kd-results">
      <Fireworks ref={fireworksRef} className="kd-fireworks" />

      <article className="kd-hero kd-results-hero" ref={heroRef}>
        <div className="kd-hero-copy">
          <p className="kd-hero-eyebrow">
            {isCheck ? 'Mastery check' : 'Learning gap report'} · {attempt.title} · {formatDate(attempt.takenAt, { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="kd-hero-title">{headline}</h1>
          <p className="kd-hero-text">{line}</p>
          {attempt.sample && <p className="kd-sample-note">Sample attempt, loaded for exploring the app.</p>}
          <div className="kd-hero-actions">
            <Link to="/dashboard/path" className="kd-btn kd-btn-accent">
              Open my learning path <ArrowIcon size={18} />
            </Link>
            <Link to="/dashboard/for-you" className="kd-btn kd-btn-glass">
              My recommendations
            </Link>
          </div>
        </div>
        <div className="kd-hero-art kd-hero-art-small">
          <svg className="kd-hero-blob" viewBox="0 0 400 360" aria-hidden="true">
            <path d="M300 20c70 30 100 110 80 190s-90 140-180 130S30 270 25 190 70 40 150 20s80-30 150 0z" fill="#de7a40" />
          </svg>
          <div className="kd-hero-ring">
            <MasteryRing value={attempt.pct} size={150} label="score" />
          </div>
        </div>
      </article>

      {!isCheck && (
        <article className="kd-card">
          <StudyReview review={studyReview({ attempts: [attempt], scope: 'quiz' })} title="Kasalig's feedback on this quiz" max={3} />
        </article>
      )}

      {changes && changes.attempt.id === attempt.id && (
        <article className="kd-card kd-report-recs">
          <ChangesPanel changes={changes} />
          {recs.length > 0 && (
            <>
              <h2 className="kd-report-recs-title">Recommended next</h2>
              <div className="kd-rec-list is-grid">
                {recs.slice(0, 3).map((r, i) => (
                  <RecCard key={r.key} rec={r} rank={i + 1} onDone={student.markRecDone} compact />
                ))}
              </div>
              <Link to="/dashboard/for-you" className="kd-text-link">See every recommendation and why</Link>
            </>
          )}
        </article>
      )}

      {!isCheck && (
        <article className="kd-card">
          <header className="kd-card-head">
            <div>
              <h2>Where you&rsquo;re weak, and why</h2>
              <p>
                {attempt.gaps.length
                  ? 'Each gap is labelled by type and severity, with the evidence behind it.'
                  : 'No gaps in this quiz: every topic is at 80% or higher.'}
              </p>
            </div>
          </header>
          {attempt.gaps.length > 0 && (
            <div className="kd-gap-cards">
              {attempt.gaps.map((g) => {
                const topic = topicById(g.topicId);
                return (
                  <section key={g.topicId} className="kd-gap-card" style={{ '--c': topic.color, '--t': topic.tint }}>
                    <header>
                      <h3>{topic.name}</h3>
                      <strong>{g.pct}%</strong>
                    </header>
                    <div className="kd-chip-row">
                      <GapTypeChip type={g.type} />
                      <SeverityChip severity={g.severity} />
                    </div>
                    <p className="kd-gap-summary">{g.summary}</p>
                    <h4>Why we think so</h4>
                    <ul className="kd-why">
                      {g.reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                    <p className="kd-muted kd-small">
                      Competencies: {g.competencies.map((c) => competencyById(c)?.code).join(', ')}
                    </p>
                    <button
                      type="button"
                      className="kd-btn kd-btn-soft"
                      onClick={() => navigate('/dashboard/tutor', { state: { topicId: g.topicId } })}
                    >
                      <ChatIcon size={17} /> Ask Kasalig about it
                    </button>
                  </section>
                );
              })}
            </div>
          )}
        </article>
      )}

      <div className="kd-results-grid">
        <article className="kd-card">
          <header className="kd-card-head">
            <div>
              <h2>Topic breakdown</h2>
              <p>Score in each topic this attempt covered.</p>
            </div>
          </header>
          <ul className="kd-breakdown">
            {attempt.topics.map((t) => {
              const topic = topicById(t.id);
              return (
                <li key={t.id}>
                  <span className="kd-topic-icon is-small" style={{ '--c': topic.color, '--t': topic.tint }} aria-hidden="true">
                    <span />
                  </span>
                  <div className="kd-breakdown-body">
                    <div className="kd-breakdown-top">
                      <strong>{topic.name}</strong>
                      <span>
                        {t.correct}/{t.total} · <b>{t.pct}%</b>
                      </span>
                    </div>
                    <Bar pct={t.pct} />
                  </div>
                  <LevelChip pct={t.pct} />
                </li>
              );
            })}
          </ul>
        </article>

        <article className="kd-card">
          <header className="kd-card-head">
            <div>
              <h2>Gap categories</h2>
              <p>What kind of mistake each missed answer was.</p>
            </div>
          </header>
          <ul className="kd-gap-types">
            {typeCounts.map((g) => (
              <li key={g.type} style={{ '--c': g.color, '--t': g.tint }}>
                <span className="kd-gap-type-count">{g.count}</span>
                <div>
                  <strong>{g.label}</strong>
                  <p>{g.hint}</p>
                  <span className="kd-gap-type-bar" aria-hidden="true">
                    <span style={{ width: `${(g.count / maxCount) * 100}%` }} />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>By learning competency</h2>
            <p>How each tagged competency went.</p>
          </div>
        </header>
        <div className="kd-table-wrap">
          <table className="kd-table">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Competency</th>
                <th scope="col">Correct</th>
                <th scope="col">Level</th>
              </tr>
            </thead>
            <tbody>
              {attempt.competencies.map((c) => {
                const comp = competencyById(c.id);
                return (
                  <tr key={c.id}>
                    <td className="kd-code">{comp?.code ?? c.id}</td>
                    <td>{comp?.text ?? '—'}</td>
                    <td>
                      {c.correct}/{c.total}
                    </td>
                    <td>
                      <LevelChip pct={c.pct} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>

      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>Answer review</h2>
            <p>Open a question to see the worked solution and why a miss was classified the way it was.</p>
          </div>
        </header>
        <ol className="kd-review">
          {attempt.items.map((item, i) => (
            <li key={`${item.questionId}-${i}`}>
              <details>
                <summary>
                  <span className={`kd-review-mark ${item.correct ? 'is-ok' : 'is-miss'}`} aria-label={item.correct ? 'Correct' : 'Missed'}>
                    {item.correct ? <CheckIcon size={15} /> : <XIcon size={15} />}
                  </span>
                  <span className="kd-review-q">
                    {i + 1}. {item.prompt}
                  </span>
                  <span className="kd-review-topic">{topicById(item.topicId)?.name}</span>
                </summary>
                <div className="kd-review-body">
                  <p>
                    Your answer: <b>{item.response}</b>
                    {!item.correct && (
                      <>
                        {' '}· Correct: <b>{item.correctAnswer}</b>
                      </>
                    )}
                  </p>
                  {!item.correct && (
                    <>
                      <div className="kd-chip-row">
                        <GapTypeChip type={item.error} />
                      </div>
                      <ul className="kd-why">
                        {item.reasons.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p>{item.explanation}</p>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
}
