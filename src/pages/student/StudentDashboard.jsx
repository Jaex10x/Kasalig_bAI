import { Link } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { DIFFICULTY_LABELS, GAP_TYPES } from '../../data/curriculum';
import { greeting, useStudentProgress } from '../../hooks/dashboardHooks';
import { MasteryRing, SampleNotice } from '../../components/dashboard/DashWidgets';
import { ArrowIcon, ClockIcon, LevelIcon, StarIcon } from '../../components/dashboard/DashIcons';
import { ChangesPanel } from '../../components/dashboard/Recommendations';
import { MyCoursesPanel, OpenGapsPanel, TeacherNewsPanel } from '../../components/dashboard/HomePanels';
import ThisWeekCard from '../../components/dashboard/ThisWeekCard';
import UpNextSlider from '../../components/dashboard/UpNextSlider';

const STEP_TITLES = { lesson: 'Short lesson', practice: 'Adaptive practice', check: 'Mastery check' };

export default function StudentDashboard() {
  const { user } = useAuth();
  const { student, status, gaps, path, overall, streak, badges, latest, quizzes, recs, changes, diagnostics, topics, myCourses, attempts } = useStudentProgress();
  // The diagnostic to start with: their first course's subject, else Math Foundations.
  const startDiag = diagnostics[0];
  const showChanges = changes && changes.attempt.id !== student.seenChangesOf;
  const firstName = user.fullName.split(/\s+/)[0];
  const hasHistory = attempts.length > 0;
  const earned = badges.filter((b) => b.earned);
  const first = path[0];

  // The hero always points at the single most useful next thing to do.
  let hero;
  if (!hasHistory && !myCourses.length) {
    hero = {
      eyebrow: 'Start here',
      title: 'Enroll in your classes',
      meta: [[ClockIcon, 'Takes a minute']],
      to: '/dashboard/my-courses',
      cta: 'Find my classes',
      recKey: 'enroll',
    };
  } else if (!hasHistory && startDiag) {
    // A class whose subject has a built-in diagnostic.
    hero = {
      eyebrow: 'Start here',
      title: `Take the ${startDiag.title}`,
      meta: [
        [ClockIcon, `About ${startDiag.minutes} min`],
        [LevelIcon, `${startDiag.questionIds.length} questions, 3 types`],
      ],
      to: `/dashboard/quiz/${startDiag.id}`,
      cta: 'Start the diagnostic',
      recKey: `quiz:${startDiag.id}`,
    };
  } else if (!hasHistory && quizzes.length) {
    // No built-in diagnostic for these subjects: start with a teacher's quiz.
    const quiz = quizzes[0];
    hero = {
      eyebrow: `Start here · ${quiz.courseCode ?? 'Your class'}`,
      title: `Take ${quiz.title}`,
      meta: [[LevelIcon, `${quiz.questions.length} question${quiz.questions.length === 1 ? '' : 's'}`]],
      to: `/dashboard/quiz/${quiz.id}`,
      cta: 'Start the quiz',
      recKey: `quiz:${quiz.id}`,
    };
  } else if (!hasHistory) {
    // Enrolled, but nothing to take yet.
    hero = {
      eyebrow: 'Waiting for your teacher',
      title: 'No quizzes in your classes yet',
      meta: [[ClockIcon, `${myCourses.length} class${myCourses.length === 1 ? '' : 'es'} enrolled`]],
      to: '/dashboard/my-courses',
      cta: 'See my classes',
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
      // Same key format as the engine's lesson / practice / check recommendations.
      recKey: `${step.id}:${first.topic.id}:${first.gap.attemptId}`,
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

  // Up next: every recommendation except the one the hero already points at.
  const upNext = recs.filter((r) => r.key !== hero.recKey);

  return (
    <div className="kd-home">
      <header className="kd-home-head">
        <div className="kd-home-greet">
          <p>{greeting()},</p>
          <h1>{firstName}, here&rsquo;s your next step.</h1>
        </div>
        <div className="kd-home-pills">
          <Link to="/dashboard/progress" className="kd-home-pill is-streak">
            {streak.current}-day streak
          </Link>
          <Link to="/dashboard/progress" className="kd-home-pill">
            {earned.length}/{badges.length} badges
          </Link>
          <Link to="/dashboard/quiz" className="kd-home-pill is-outline">
            Take a quiz
          </Link>
        </div>
      </header>

      {!hasHistory && (
        <SampleNotice>
          {myCourses.length
            ? 'No results yet. Take a quiz in one of your classes to find your gaps.'
            : 'No classes yet. Enroll in your classes and their quizzes, gaps and progress show up here.'}
        </SampleNotice>
      )}

      <div className="kd-home-row">
        <article className="kd-hero kd-home-hero">
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
            <div className="kd-home-hero-actions">
              <Link to={hero.to} className="kd-btn kd-btn-accent">
                {hero.cta} <ArrowIcon size={18} />
              </Link>
              {first && latest && (
                <Link to={`/dashboard/results/${latest.id}`} className="kd-home-hero-why">
                  Why this step?
                </Link>
              )}
            </div>
          </div>
          <MasteryRing
            value={hasHistory ? overall : null}
            size={150}
            track="#4a3426"
            color="#f6a23c"
            label="overall mastery"
          />
        </article>

        <ThisWeekCard attempts={attempts} activity={student.activity} />
      </div>

      <UpNextSlider
        recs={upNext}
        status={status}
        quizzes={quizzes}
        diagnostics={diagnostics}
        onDone={student.markRecDone}
        before={showChanges && <ChangesPanel compact changes={changes} onSeen={() => student.markChangesSeen(changes.attempt.id)} />}
      />

      <div className="kd-home-row kd-home-row-top">
        <MyCoursesPanel myCourses={myCourses} topics={topics} status={status} />
        <aside className="kd-home-aside">
          <TeacherNewsPanel quizzes={quizzes} myCourses={myCourses} attempts={attempts} />
          <OpenGapsPanel gaps={gaps} hasHistory={hasHistory} latest={latest} />
        </aside>
      </div>
    </div>
  );
}
