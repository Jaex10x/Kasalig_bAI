import { Link } from 'react-router-dom';
import { DIAGNOSTIC } from '../../data/curriculum';
import { useStudentProgress } from '../../hooks/dashboardHooks';
import { ChangesPanel, RecCard, StudyReview } from '../../components/dashboard/Recommendations';
import { EmptyState } from '../../components/dashboard/DashWidgets';

const GROUPS = [
  { id: 'work', title: 'Lessons, practice and checks', kinds: ['lesson', 'practice', 'check'] },
  { id: 'materials', title: 'Study materials', kinds: ['resource'] },
  { id: 'help', title: 'Get help', kinds: ['tutor'] },
  { id: 'quizzes', title: 'Quizzes', kinds: ['quiz'] },
];

const RULES = [
  'Prerequisites first: a topic waits until the skills it builds on are fixed.',
  'Critical gaps rank above moderate and mild ones.',
  'The kind of gap picks the material: a video for a missed concept, a worksheet for careless slips, a reading for a missing prerequisite.',
  'Materials your teacher shared come before the built-in ones.',
  'The list is rebuilt after every quiz, practice answer and mastery check.',
];

/** "For you": every recommendation, ranked, each with the reason it was picked. */
export default function RecommendationsPage() {
  const { student, recs, changes, review } = useStudentProgress();
  const top = recs.slice(0, 3);
  const rest = recs.slice(3);
  const doneCount = Object.keys(student.recDone ?? {}).length;

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">For you</p>
          <h1>Recommended next steps</h1>
          <p>An honest review of how you study, and the next steps picked from your results, each with the reason why.</p>
        </div>
        <Link to="/dashboard/path" className="kd-btn kd-btn-ghost">See the full learning path</Link>
      </header>

      <StudyReview review={review} />

      {changes && <ChangesPanel changes={changes} />}

      {recs.length === 0 ? (
        <EmptyState icon="🎉" title="Nothing to recommend right now" action={<Link to={`/dashboard/quiz/${DIAGNOSTIC.id}`} className="kd-btn kd-btn-dark">Take a quiz</Link>}>
          You&rsquo;ve done everything on your list. Take a quiz to check for new gaps.
        </EmptyState>
      ) : (
        <>
          <article className="kd-card kd-rec-top-card">
            <header className="kd-card-head">
              <div>
                <h2>Up next</h2>
                <p>Your three most useful steps right now.</p>
              </div>
            </header>
            <div className="kd-rec-list">
              {top.map((r, i) => (
                <RecCard key={r.key} rec={r} rank={i + 1} onDone={student.markRecDone} />
              ))}
            </div>
          </article>

          {rest.length > 0 &&
            GROUPS.map((g) => {
              const items = rest.filter((r) => g.kinds.includes(r.kind));
              if (!items.length) return null;
              return (
                <article key={g.id} className="kd-card">
                  <header className="kd-card-head">
                    <div>
                      <h2>{g.title}</h2>
                      <p>{items.length} more</p>
                    </div>
                  </header>
                  <div className="kd-rec-list">
                    {items.map((r) => (
                      <RecCard key={r.key} rec={r} onDone={student.markRecDone} compact />
                    ))}
                  </div>
                </article>
              );
            })}
        </>
      )}

      <article className="kd-card kd-rec-rules">
        <header className="kd-card-head">
          <div>
            <h2>How recommendations are picked</h2>
            {doneCount > 0 && <p>{doneCount} item{doneCount === 1 ? '' : 's'} marked done. They come back if a later quiz reopens that gap.</p>}
          </div>
        </header>
        <ol className="kd-plain-list">
          {RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </article>
    </section>
  );
}
