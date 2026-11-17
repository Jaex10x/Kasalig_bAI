import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  DIAGNOSTIC,
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
  competencyById,
  questionById,
  topicById,
} from '../../data/curriculum';
import { CHECK_PASS, CHECK_SIZE, buildMasteryCheck, gradeAttempt, hasAnswer } from '../../lib/engine';
import { useStudentProgress } from '../../hooks/dashboardHooks';
import { EmptyState, QuestionInput } from '../../components/dashboard/DashWidgets';
import { ArrowIcon, BackIcon, ClockIcon, XIcon } from '../../components/dashboard/DashIcons';

/** Load the quiz for the URL: the diagnostic, a teacher quiz, or a mastery check for one topic. */
function useQuizDefinition(mode, quizId, topicId, teacherQuizzes) {
  const [checkQuestions] = useState(() => (mode === 'check' && topicById(topicId) ? buildMasteryCheck(topicId) : null));
  if (mode === 'check') {
    const topic = topicById(topicId);
    if (!topic) return null;
    return {
      quiz: { id: `check-${topicId}`, title: `Mastery check: ${topic.name}` },
      questions: checkQuestions,
      subtitle: `${CHECK_SIZE} questions · get ${CHECK_PASS} right to close the gap`,
    };
  }
  if (quizId === DIAGNOSTIC.id) {
    return {
      quiz: DIAGNOSTIC,
      questions: DIAGNOSTIC.questionIds.map(questionById),
      subtitle: `About ${DIAGNOSTIC.minutes} minutes · graded at the end`,
    };
  }
  const quiz = teacherQuizzes.find((q) => q.id === quizId);
  if (!quiz || !quiz.questions.length) return null;
  return { quiz, questions: quiz.questions, subtitle: `${quiz.questions.length} questions · graded at the end` };
}

/** The route: a fresh runner (no leftover answers) for every quiz or check URL. */
export default function QuizScreen({ mode = 'quiz' }) {
  const { quizId, topicId } = useParams();
  return <QuizRunner key={`${mode}-${quizId ?? topicId}`} mode={mode} quizId={quizId} topicId={topicId} />;
}

/** Takes a quiz one question at a time, then grades it and opens the gap report. */
function QuizRunner({ mode, quizId, topicId }) {
  const navigate = useNavigate();
  const { student, status, quizzes } = useStudentProgress();
  const def = useQuizDefinition(mode, quizId, topicId, quizzes);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const times = useRef({});
  const shownAt = useRef(0);

  // Time on each question feeds careless-error detection (a rushed wrong answer).
  useEffect(() => {
    shownAt.current = performance.now();
  }, [index]);

  if (!def) {
    return (
      <section className="kd-stage kd-page">
        <EmptyState icon="🔎" title="That quiz isn't available" action={<Link to="/dashboard/quiz" className="kd-btn kd-btn-dark">See all quizzes</Link>}>
          It may have been unpublished by your teacher.
        </EmptyState>
      </section>
    );
  }

  const { quiz, questions, subtitle } = def;
  const question = questions[index];
  const topic = topicById(question.topicId);
  const competency = competencyById(question.competencyId);
  const value = answers[question.id];
  const isLast = index === questions.length - 1;
  const answeredCount = questions.filter((q) => hasAnswer(q, answers[q.id])).length;
  const canGo = hasAnswer(question, value);

  const logTime = () => {
    const spent = performance.now() - shownAt.current;
    times.current[question.id] = (times.current[question.id] ?? 0) + spent;
  };

  const go = (to) => {
    logTime();
    setIndex(to);
  };

  const finish = () => {
    logTime();
    const responses = {};
    questions.forEach((q) => {
      responses[q.id] = { value: answers[q.id], ms: Math.round(times.current[q.id] ?? 0) };
    });
    const attempt = gradeAttempt({ quiz, questions, responses, kind: mode, topicId: topicId ?? null, prior: status });
    student.saveAttempt(attempt);
    navigate(`/dashboard/results/${attempt.id}`, { state: { fresh: true } });
  };

  const next = () => {
    if (!canGo) return;
    if (isLast) finish();
    else go(index + 1);
  };

  return (
    <section className="kd-stage kd-quiz">
      <header className="kd-quiz-top">
        <Link to={mode === 'check' ? '/dashboard/path' : '/dashboard/quiz'} className="kd-icon-btn" aria-label="Leave the quiz">
          <XIcon size={20} />
        </Link>
        <div className="kd-quiz-heading">
          <h1>{quiz.title}</h1>
          <p>
            <ClockIcon size={15} /> {subtitle}
          </p>
        </div>
        <span className="kd-quiz-count">
          {index + 1} / {questions.length}
        </span>
      </header>

      <div
        className="kd-quiz-progress"
        role="progressbar"
        aria-label="Questions answered"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={answeredCount}
      >
        <span style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
      </div>

      <article className="kd-card kd-quiz-card" key={question.id}>
        <div className="kd-chip-row">
          <span className="kd-chip" style={{ color: topic.color, background: topic.tint }}>
            {topic.name}
          </span>
          <span className="kd-chip kd-chip-soft">{QUESTION_TYPE_LABELS[question.type]}</span>
          <span className="kd-chip kd-chip-soft">{DIFFICULTY_LABELS[question.difficulty]}</span>
        </div>
        <h2 className="kd-quiz-prompt" id="kd-quiz-prompt">
          {question.prompt}
        </h2>
        {competency && (
          <p className="kd-competency-line" title={competency.text}>
            Competency {competency.code}: {competency.text}
          </p>
        )}
        <QuestionInput
          question={question}
          value={value}
          onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))}
          labelledBy="kd-quiz-prompt"
          onSubmit={next}
        />
      </article>

      <footer className="kd-quiz-actions">
        <button type="button" className="kd-btn kd-btn-ghost" onClick={() => go(index - 1)} disabled={index === 0}>
          <BackIcon size={18} /> Back
        </button>
        <div className="kd-quiz-dots" aria-hidden="true">
          {questions.map((q, i) => (
            <span key={q.id} className={`${i === index ? 'is-current' : ''} ${hasAnswer(q, answers[q.id]) ? 'is-done' : ''}`} />
          ))}
        </div>
        <button type="button" className="kd-btn kd-btn-dark" onClick={next} disabled={!canGo}>
          {isLast ? 'Finish and see my gaps' : 'Next'} <ArrowIcon size={18} />
        </button>
      </footer>
    </section>
  );
}
