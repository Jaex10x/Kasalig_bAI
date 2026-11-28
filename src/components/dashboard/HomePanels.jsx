import { Link } from 'react-router-dom';
import { subjectForCourseCode } from '../../data/curriculum';
import { isOpenGap } from '../../lib/engine';
import { formatDate } from '../../hooks/dashboardHooks';
import { EmptyState, GapTypeChip, SeverityChip } from './DashWidgets';

const DAY = 86400000;
const OPEN_GAPS_SHOWN = 5;
const NEWS_SHOWN = 3;

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const tone = (pct) => (pct >= 80 ? 'is-good' : pct >= 60 ? 'is-mid' : 'is-low');

/** "posted today" / "posted yesterday" / "posted 3 days ago" / "posted 12 Nov". */
function postedLabel(ms) {
  if (!ms) return null;
  const startOf = (t) => new Date(new Date(t).toDateString()).getTime();
  const days = Math.round((startOf(Date.now()) - startOf(ms)) / DAY);
  if (days <= 0) return 'posted today';
  if (days === 1) return 'posted yesterday';
  if (days < 7) return `posted ${days} days ago`;
  return `posted ${formatDate(ms)}`;
}

/** My courses: one card per enrolled course with its mastery, open gaps and topics. */
export function MyCoursesPanel({ myCourses, topics, status }) {
  const courses = myCourses.map((course) => {
    const subject = subjectForCourseCode(course.subjectCode);
    const own = subject ? topics.filter((t) => t.subjectId === subject.id) : [];
    const tested = own.filter((t) => status[t.id]);
    const pct = tested.length ? Math.round(tested.reduce((sum, t) => sum + status[t.id].pct, 0) / tested.length) : null;
    const gaps = own.filter((t) => isOpenGap(status[t.id])).length;
    return { course, own, pct, gaps, tested: tested.length };
  });

  return (
    <section className="kd-home-panel kd-home-courses" aria-labelledby="kd-home-courses-title">
      <div className="kd-home-panel-head">
        <h2 id="kd-home-courses-title">My courses</h2>
        <Link to="/dashboard/my-courses">Manage enrollment</Link>
      </div>

      {!courses.length ? (
        <EmptyState
          icon="📚"
          title="No classes yet"
          action={
            <Link to="/dashboard/my-courses" className="kd-btn kd-btn-dark">
              Find my classes
            </Link>
          }
        >
          Enroll in your classes and each one shows up here with its topics and mastery.
        </EmptyState>
      ) : (
        courses.map(({ course, own, pct, gaps, tested }) => (
          <article key={course.id} className="kd-home-course">
            <div className="kd-home-course-top">
              <div className="kd-home-course-name">
                {course.subjectCode && <span>{course.subjectCode}</span>}
                <strong>{course.title}</strong>
              </div>
              <div className="kd-home-course-score">
                {tested > 0 && (
                  <span className={`kd-home-tag ${gaps ? 'is-low' : 'is-good'}`}>
                    {gaps ? `${plural(gaps, 'open gap')}` : 'No open gaps'}
                  </span>
                )}
                <strong>{pct === null ? '—' : `${pct}%`}</strong>
              </div>
            </div>
            <div
              className="kd-home-course-bar"
              role="img"
              aria-label={pct === null ? `${course.title}: not tested yet` : `${course.title}: ${pct}% mastery`}
            >
              <span style={{ width: `${pct ?? 0}%` }} />
            </div>
            {own.length ? (
              <ul className="kd-home-tags" aria-label={`${course.title} topics`}>
                {own.map((t) => {
                  const s = status[t.id];
                  return (
                    <li key={t.id} className={`kd-home-tag ${s ? tone(s.pct) : 'is-untested'}`}>
                      {t.name} {s ? `${s.pct}%` : '· not tested'}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="kd-home-muted">No topic map for this course yet. Your teacher&rsquo;s quizzes still count.</p>
            )}
          </article>
        ))
      )}
    </section>
  );
}

/** New from your teachers: published quizzes in their courses, newest first. */
export function TeacherNewsPanel({ quizzes, myCourses, attempts }) {
  const taken = new Set(attempts.map((a) => a.quizId));
  const teacherOf = new Map(myCourses.map((c) => [c.id, c.teacherName]));
  const posted = (q) => q.createdAt ?? q.updatedAt ?? 0;
  const news = [...quizzes].sort((a, b) => posted(b) - posted(a)).slice(0, NEWS_SHOWN);

  return (
    <section className="kd-home-panel" aria-labelledby="kd-home-news-title">
      <div className="kd-home-panel-head">
        <h2 id="kd-home-news-title">New from your teachers</h2>
        <Link to="/dashboard/quiz">All quizzes</Link>
      </div>
      {!news.length ? (
        <p className="kd-home-muted">
          {myCourses.length ? 'No quizzes posted in your classes yet.' : 'Enroll in a class to see its quizzes here.'}
        </p>
      ) : (
        <ul className="kd-home-news">
          {news.map((q) => {
            const meta = [q.courseCode, teacherOf.get(q.courseId), postedLabel(posted(q))].filter(Boolean).join(' · ');
            const done = taken.has(q.id);
            return (
              <li key={q.id}>
                <span>
                  <strong>{q.title}</strong>
                  {meta && <small>{meta}</small>}
                </span>
                <Link to={`/dashboard/quiz/${q.id}`} className="kd-home-outline-btn">
                  {done ? 'Retake' : 'Take'}
                  <span className="kd-sr-only"> {q.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** Open gaps: a compact list, worst first, with a link to the full gap report. */
export function OpenGapsPanel({ gaps, hasHistory, latest }) {
  const shown = gaps.slice(0, OPEN_GAPS_SHOWN);
  const more = gaps.length - shown.length;

  return (
    <section className="kd-home-panel" aria-labelledby="kd-home-gaps-title">
      <div className="kd-home-panel-head">
        <h2 id="kd-home-gaps-title">
          Open gaps <span className="kd-home-count">· {gaps.length}</span>
        </h2>
        <Link to={latest ? `/dashboard/results/${latest.id}` : '/dashboard/results'}>Gap report</Link>
      </div>
      {!hasHistory ? (
        <p className="kd-home-muted">Your gaps will appear here after your first quiz.</p>
      ) : !gaps.length ? (
        <p className="kd-home-muted">No open gaps right now. Nice work!</p>
      ) : (
        <>
          <ul className="kd-home-gaps">
            {shown.map(({ topic, status: s }) => (
              <li key={topic.id}>
                <span>
                  <strong>{topic.name}</strong>
                  <span className="kd-chip-row">
                    <GapTypeChip type={s.gap.type} short />
                    <SeverityChip severity={s.gap.severity} />
                  </span>
                </span>
                <b>{s.pct}%</b>
              </li>
            ))}
          </ul>
          {more > 0 && <p className="kd-home-muted">+{more} more in the gap report</p>}
        </>
      )}
    </section>
  );
}
