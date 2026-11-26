import { Link } from 'react-router-dom';
import { QUESTION_TYPE_LABELS, topicById } from '../../data/curriculum';
import { formatDate } from '../../hooks/dashboardHooks';
import { useClassData } from '../../store/learningStore';
import { EmptyState, SectionTabs } from '../../components/dashboard/DashWidgets';
import { TEACHER_TABS } from '../../components/dashboard/teacherTabs';
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/dashboard/DashIcons';

/** The teacher's quizzes: create, edit, publish to students, delete. */
export default function QuizBuilder() {
  const { quizzes, setPublished, deleteQuiz } = useClassData();
  const sorted = [...quizzes].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Quiz builder</p>
          <h1>Your quizzes</h1>
          <p>Published quizzes appear in your students&rsquo; quiz list. Their results feed each student&rsquo;s gap report and learning path.</p>
        </div>
        <Link to="/dashboard/quizzes/new" className="kd-btn kd-btn-dark">
          <PlusIcon size={18} /> New quiz
        </Link>
      </header>
      <SectionTabs tabs={TEACHER_TABS.assessments} label="Assessments" />

      {sorted.length === 0 ? (
        <EmptyState icon="📝" title="No quizzes yet" action={<Link to="/dashboard/quizzes/new" className="kd-btn kd-btn-dark">Create your first quiz</Link>}>
          Build one from scratch, or let the generator draft questions for a topic and review them.
        </EmptyState>
      ) : (
        <div className="kd-quiz-grid">
          {sorted.map((q) => {
            const topics = [...new Set(q.questions.map((x) => x.topicId))].map(topicById).filter(Boolean);
            const types = [...new Set(q.questions.map((x) => x.type))];
            return (
              <article key={q.id} className="kd-card kd-quiz-tile">
                <div className="kd-quiz-tile-top">
                  <span className={`kd-chip ${q.published ? 'kd-chip-ok' : 'kd-chip-soft'}`}>{q.published ? 'Published' : 'Draft'}</span>
                  <span className="kd-muted kd-small">{q.updatedAt ? `Edited ${formatDate(q.updatedAt)}` : ''}</span>
                </div>
                <h2>{q.title}</h2>
                <p className="kd-small">
                  {q.courseLabel ? <strong>{q.courseLabel}</strong> : <span className="kd-muted">No course: visible to every student</span>}
                </p>
                <p className="kd-muted kd-small">
                  {q.questions.length} questions · {types.map((t) => QUESTION_TYPE_LABELS[t]).join(', ')}
                </p>
                <div className="kd-chip-row">
                  {topics.map((t) => (
                    <span key={t.id} className="kd-chip" style={{ color: t.color, background: t.tint }}>{t.name}</span>
                  ))}
                </div>
                <footer className="kd-quiz-tile-foot">
                  <label className="kd-switch">
                    <input type="checkbox" checked={Boolean(q.published)} onChange={(e) => setPublished(q.id, e.target.checked)} />
                    <span aria-hidden="true" />
                    {q.published ? (q.courseId ? 'Visible to its students' : 'Visible to students') : 'Hidden'}
                  </label>
                  <span className="kd-row-actions">
                    <Link to={`/dashboard/quizzes/${q.id}`} className="kd-icon-btn kd-icon-btn-sm" aria-label={`Edit ${q.title}`}>
                      <PencilIcon size={16} />
                    </Link>
                    <button
                      type="button"
                      className="kd-icon-btn kd-icon-btn-sm"
                      aria-label={`Delete ${q.title}`}
                      onClick={() => window.confirm(`Delete "${q.title}"? Students' past results are kept.`) && deleteQuiz(q.id)}
                    >
                      <TrashIcon size={16} />
                    </button>
                  </span>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
