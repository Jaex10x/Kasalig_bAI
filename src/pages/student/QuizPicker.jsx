import { Link } from 'react-router-dom';
import { DIAGNOSTIC, QUESTION_TYPE_LABELS, questionById, topicById } from '../../data/curriculum';
import { formatDate, useStudentProgress } from '../../hooks/dashboardHooks';
import { ArrowIcon, ClockIcon, QuizIcon } from '../../components/dashboard/DashIcons';

/** Every quiz the student can take: the built-in diagnostic plus the teacher's published quizzes. */
export default function QuizPicker() {
  const { student, quizzes } = useStudentProgress();

  const all = [
    { ...DIAGNOSTIC, questions: DIAGNOSTIC.questionIds.map(questionById), author: 'Kasalig bAI' },
    ...quizzes.map((q) => ({ ...q, minutes: Math.max(3, Math.round(q.questions.length * 0.8)), author: q.author ?? 'Your teacher' })),
  ];

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Quizzes</p>
          <h1>Pick an assessment</h1>
          <p>Every question is tagged with a topic and a learning competency, so each result updates your gaps and learning path.</p>
        </div>
      </header>

      <div className="kd-quiz-grid">
        {all.map((quiz, i) => {
          const topics = [...new Set(quiz.questions.map((q) => q.topicId))].map(topicById).filter(Boolean);
          const types = [...new Set(quiz.questions.map((q) => q.type))];
          const last = [...student.attempts].filter((a) => a.quizId === quiz.id).sort((a, b) => b.takenAt - a.takenAt)[0];
          return (
            <article key={quiz.id} className="kd-card kd-quiz-tile" style={{ '--delay': `${i * 60}ms` }}>
              <div className="kd-quiz-tile-top">
                <span className="kd-quiz-tile-icon" aria-hidden="true">
                  <QuizIcon size={22} />
                </span>
                {quiz.builtIn ? <span className="kd-chip kd-chip-soft">Diagnostic</span> : <span className="kd-chip kd-chip-soft">From {quiz.author}</span>}
              </div>
              <h2>{quiz.title}</h2>
              {quiz.description && <p className="kd-muted">{quiz.description}</p>}
              <ul className="kd-meta-list">
                <li>
                  <ClockIcon size={15} /> {quiz.questions.length} questions · ~{quiz.minutes} min
                </li>
                <li>{types.map((t) => QUESTION_TYPE_LABELS[t]).join(' · ')}</li>
              </ul>
              <div className="kd-chip-row">
                {topics.map((t) => (
                  <span key={t.id} className="kd-chip" style={{ color: t.color, background: t.tint }}>
                    {t.name}
                  </span>
                ))}
              </div>
              <footer className="kd-quiz-tile-foot">
                {last ? (
                  <Link to={`/dashboard/results/${last.id}`} className="kd-muted-link">
                    Last: {last.pct}% · {formatDate(last.takenAt)}
                  </Link>
                ) : (
                  <span className="kd-muted">Not taken yet</span>
                )}
                <Link to={`/dashboard/quiz/${quiz.id}`} className="kd-btn kd-btn-dark kd-btn-sm">
                  {last ? 'Retake' : 'Start'} <ArrowIcon size={16} />
                </Link>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
