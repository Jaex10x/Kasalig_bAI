import { Link } from 'react-router-dom';
import useAuth from '../context/useAuth';
import Capybara from '../components/capybaraStyle/Capybara';
import { DIAGNOSTIC, DIFFICULTY_LABELS, GAP_TYPES, TOPICS, subjectById } from '../components/dashboard/curriculum';
import { greeting, useStudentProgress } from '../components/dashboard/dashboardHooks';
import { Avatar, Bar, GapTypeChip, MasteryRing, SampleNotice, SeverityChip } from '../components/dashboard/DashWidgets';
import { ArrowIcon, ClockIcon, LevelIcon, StarIcon } from '../components/dashboard/DashIcons';
import { ChangesPanel, RecCard, StudyReview } from '../components/dashboard/Recommendations';

const STEP_TITLES = { lesson: 'Short lesson', practice: 'Adaptive practice', check: 'Mastery check' };

export default function StudentDashboard() {
  const { user } = useAuth();
  const { student, status, gaps, path, overall, streak, badges, latest, quizzes, recs, changes, review } = useStudentProgress();
  const showChanges = changes && changes.attempt.id !== student.seenChangesOf;
  const firstName = user.fullName.split(/\s+/)[0];
  const hasHistory = student.attempts.length > 0;
  const earned = badges.filter((b) => b.earned);
  const first = path[0];

  // The hero always points at the single most useful next thing to do.
  let hero;
  if (!hasHistory) {
    hero = {
      eyebrow: 'Start here',
      title: `Take the ${DIAGNOSTIC.title}`,
      meta: [
        [ClockIcon, `About ${DIAGNOSTIC.minutes} min`],
        [LevelIcon, `${DIAGNOSTIC.questionIds.length} questions, 3 types`],
      ],
      to: `/dashboard/quiz/${DIAGNOSTIC.id}`,
      cta: 'Start the diagnostic',
    };
  } else if (first) {
    const step = first.next ?? first.steps[0];
    hero = {
      eyebrow: `Next on your learning path · ${GAP_TYPES[first.gap.type].label}`,
      title: `${STEP_TITLES[step.id]}: ${first.topic.name}`,
      meta: [
        [StarIcon, `${first.pct}% now`],
        [LevelIcon, `Practice level: ${DIFFICULTY_LABELS[first.practice.level]}`],
        [ClockIcon, `${path.length} gap${path.length === 1 ? '' : 's'} to close`],
      ],
      to: '/dashboard/path',
      cta: 'Continue my path',
    };
  } else {
    hero = {
      eyebrow: 'All caught up',
      title: 'Every gap is closed. Nice work!',
      meta: [[StarIcon, `${overall}% overall mastery`]],
      to: '/dashboard/quiz',
      cta: 'Try another quiz',
    };
  }

  return (
    <div className="kd-home">
      <aside className="kd-side">
        <div className="kd-profile">
          <Avatar name={user.fullName} size={42} />
          <div>
            <p className="kd-profile-name">{user.fullName}</p>
            <p className="kd-profile-sub">{user.course ?? 'Student'}</p>
          </div>
        </div>

        <p className="kd-eyebrow">{greeting()},</p>
        <h1 className="kd-title">{firstName}! Let&rsquo;s close a few gaps.</h1>
        <p className="kd-lede">
          Every quiz shows which topics need work and why. Your learning path then takes you through
          them in the right order.
        </p>

        <div className="kd-stat-pills">
          <span className="kd-stat-pill">
            <span aria-hidden="true">🔥</span> {streak.current}-day streak
          </span>
          <Link to="/dashboard/progress" className="kd-stat-pill">
            <span aria-hidden="true">🏅</span> {earned.length}/{badges.length} badges
          </Link>
        </div>

        {!hasHistory && (
          <SampleNotice>
            No results yet. Take the diagnostic, or{' '}
            <button type="button" className="kd-link-btn" onClick={student.loadSampleHistory}>
              load sample history
            </button>{' '}
            to explore the app.
          </SampleNotice>
        )}

        <div className="kd-side-head">
          <h2>Active gaps</h2>
          <span className="kd-count">{gaps.length}</span>
        </div>

        {!hasHistory ? (
          <p className="kd-empty">Your gaps will appear here after your first quiz.</p>
        ) : gaps.length === 0 ? (
          <p className="kd-empty">No open gaps right now. 🎉</p>
        ) : (
          <ul className="kd-gap-list">
            {gaps.map(({ topic, status: s }, i) => (
              <li key={topic.id} className="kd-gap-item" style={{ '--delay': `${i * 70}ms` }}>
                <span className="kd-gap-dot" style={{ background: topic.tint, color: topic.color }}>
                  {topic.name[0]}
                </span>
                <div className="kd-gap-body">
                  <div className="kd-gap-top">
                    <strong>{topic.name}</strong>
                    <span className="kd-score">
                      <StarIcon size={15} /> {s.pct}%
                    </span>
                  </div>
                  <div className="kd-chip-row">
                    <GapTypeChip type={s.gap.type} short />
                    <SeverityChip severity={s.gap.severity} />
                  </div>
                  <p>{s.gap.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {latest && (
          <Link to={`/dashboard/results/${latest.id}`} className="kd-text-link">
            Open my latest gap report
          </Link>
        )}
      </aside>

      <section className="kd-stage kd-stage-student">
        <article className="kd-hero">
          <div className="kd-hero-copy">
            <p className="kd-hero-eyebrow">{hero.eyebrow}</p>
            <h2 className="kd-hero-title">{hero.title}</h2>
            <ul className="kd-hero-meta">
              {hero.meta.map(([Icon, text]) => (
                <li key={text}>
                  <Icon size={17} /> {text}
                </li>
              ))}
            </ul>
            <Link to={hero.to} className="kd-btn kd-btn-accent">
              {hero.cta} <ArrowIcon size={18} />
            </Link>
          </div>
          <div className="kd-hero-art">
            <svg className="kd-hero-blob" viewBox="0 0 400 360" aria-hidden="true">
              <path d="M300 20c70 30 100 110 80 190s-90 140-180 130S30 270 25 190 70 40 150 20s80-30 150 0z" fill="#de7a40" />
              <path d="M40 300c60-30 90 20 150-10s70-110 140-120" fill="none" stroke="#f6a23c" strokeWidth="4" strokeLinecap="round" />
              <path d="M330 40c20 10 30 30 28 50" fill="none" stroke="#f6a23c" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="kd-hero-ring">
              <MasteryRing value={hasHistory ? overall : null} size={170} label="overall mastery" />
            </div>
          </div>
        </article>

        <article className="kd-card kd-home-recs">
          <header className="kd-card-head">
            <div>
              <h2>Recommended for you</h2>
              <p>Ranked from your latest results. Each one says why it was picked.</p>
            </div>
            <Link to="/dashboard/for-you" className="kd-btn kd-btn-ghost kd-btn-sm">
              See all {recs.length} <ArrowIcon size={15} />
            </Link>
          </header>
          <StudyReview review={review} compact title="Kasalig's honest take" />
          {showChanges && <ChangesPanel compact changes={changes} onSeen={() => student.markChangesSeen(changes.attempt.id)} />}
          <div className="kd-rec-list is-grid">
            {recs.slice(0, 3).map((r, i) => (
              <RecCard key={r.key} rec={r} rank={i + 1} onDone={student.markRecDone} compact />
            ))}
          </div>
        </article>

        <Link to="/dashboard/quiz" className="kd-cta">
          <span className="kd-cta-title">{hasHistory ? 'Take a quiz' : 'Find your gaps'}</span>
          <span className="kd-cta-sub">
            {quizzes.length ? `${quizzes.length + 1} quizzes available` : 'Multiple choice, identification, true or false'}
          </span>
          <span className="kd-cta-go" aria-hidden="true">
            <ArrowIcon size={20} />
          </span>
          <svg className="kd-cta-squiggle" viewBox="0 0 200 200" aria-hidden="true">
            <path d="M150 10c-40 30 30 60-10 100s-90 10-120 60" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="5" strokeDasharray="12 14" strokeLinecap="round" />
          </svg>
          <span className="kd-cta-capy">
            <Capybara mood="happy" message={hasHistory ? 'Ready for another round?' : 'Let’s find your gaps!'} />
          </span>
        </Link>

        <ul className="kd-topic-list" aria-label="Mastery by topic">
          {TOPICS.map((t, i) => {
            const s = status[t.id];
            const open = s?.gap && !s.closed;
            return (
              <li key={t.id} style={{ '--delay': `${150 + i * 60}ms` }}>
                <Link to={hasHistory ? '/dashboard/progress' : '/dashboard/quiz'} className="kd-topic-row">
                  <span className="kd-topic-icon" style={{ '--c': t.color, '--t': t.tint }} aria-hidden="true">
                    <span />
                  </span>
                  <span className="kd-topic-text">
                    <strong>{t.name}</strong>
                    <small>
                      {subjectById(t.subjectId).name}
                      {s?.closed && ' · gap closed ✓'}
                      {open && ` · ${GAP_TYPES[s.gap.type].short.toLowerCase()} gap`}
                    </small>
                    <Bar pct={s?.pct ?? 0} />
                  </span>
                  <span className="kd-topic-score">
                    {s ? (
                      <>
                        <StarIcon size={20} /> {s.pct}%
                      </>
                    ) : (
                      <span className="kd-untested">Not tested</span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
