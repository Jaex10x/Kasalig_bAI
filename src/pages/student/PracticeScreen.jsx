import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DIFFICULTY_LABELS, QUESTION_TYPE_LABELS, topicById } from '../../data/curriculum';
import { PRACTICE_GOAL, checkAnswer, hasAnswer, isOpenGap, nextPractice, practiceFor } from '../../lib/engine';
import { generateQuestion } from '../../lib/generators';
import { useStudentProgress } from '../../hooks/dashboardHooks';
import { EmptyState, QuestionInput } from '../../components/dashboard/DashWidgets';
import { ArrowIcon, BackIcon, BulbIcon, CheckIcon, XIcon } from '../../components/dashboard/DashIcons';

export default function PracticeScreen() {
  const { topicId } = useParams();
  return topicById(topicId) ? (
    <PracticeRunner key={topicId} topicId={topicId} />
  ) : (
    <section className="kd-stage kd-page">
      <EmptyState icon="🔎" title="Unknown topic" action={<Link to="/dashboard/path" className="kd-btn kd-btn-dark">Back to my path</Link>} />
    </section>
  );
}

/** Adaptive practice: questions get harder after two right in a row and easier after two wrong. */
function PracticeRunner({ topicId }) {
  const topic = topicById(topicId);
  const { student, status, path } = useStudentProgress();
  const s = status[topicId];
  const gapKey = isOpenGap(s) ? s.gap.attemptId : 'free';
  const practice = practiceFor(student.practice, topicId, gapKey);
  const pathItem = path.find((p) => p.topic.id === topicId);

  const [question, setQuestion] = useState(() => generateQuestion(topicId, practice.level));
  const [value, setValue] = useState(undefined);
  const [result, setResult] = useState(null); // { correct, levelChange }
  const [hints, setHints] = useState(0);

  const check = () => {
    if (!hasAnswer(question, value) || result) return;
    const { correct } = checkAnswer(question, value);
    const after = nextPractice(practice, correct);
    student.recordPractice(topicId, gapKey, correct);
    setResult({ correct, levelChange: Math.sign(after.level - practice.level), justDone: after.done && !practice.done });
  };

  const next = () => {
    setQuestion(generateQuestion(topicId, practice.level));
    setValue(undefined);
    setResult(null);
    setHints(0);
  };

  const levels = [1, 2, 3];

  return (
    <section className="kd-stage kd-quiz">
      <header className="kd-quiz-top">
        <Link to="/dashboard/path" className="kd-icon-btn" aria-label="Back to the learning path">
          <BackIcon size={20} />
        </Link>
        <div className="kd-quiz-heading">
          <h1>Practice: {topic.name}</h1>
          <p>
            {practice.done
              ? 'Practice goal reached. Keep going, or take the mastery check.'
              : `Get ${PRACTICE_GOAL} right at Medium or Hard to unlock the mastery check.`}
          </p>
        </div>
        <div className="kd-level-meter" aria-label={`Difficulty: ${DIFFICULTY_LABELS[practice.level]}`}>
          {levels.map((l) => (
            <span key={l} className={l <= practice.level ? 'is-on' : ''} />
          ))}
          <strong>{DIFFICULTY_LABELS[practice.level]}</strong>
        </div>
      </header>

      <div className="kd-quiz-progress" role="progressbar" aria-label="Practice goal" aria-valuemin={0} aria-valuemax={PRACTICE_GOAL} aria-valuenow={Math.min(practice.goal, PRACTICE_GOAL)}>
        <span style={{ width: `${Math.min(100, (practice.goal / PRACTICE_GOAL) * 100)}%` }} />
      </div>

      <article className="kd-card kd-quiz-card" key={question.id}>
        <div className="kd-chip-row">
          <span className="kd-chip" style={{ color: topic.color, background: topic.tint }}>
            {topic.name}
          </span>
          <span className="kd-chip kd-chip-soft">{QUESTION_TYPE_LABELS[question.type]}</span>
          <span className="kd-chip kd-chip-soft">{DIFFICULTY_LABELS[question.difficulty]}</span>
        </div>
        <h2 className="kd-quiz-prompt" id="kd-practice-prompt">
          {question.prompt}
        </h2>
        <QuestionInput
          question={question}
          value={value}
          onChange={setValue}
          disabled={Boolean(result)}
          result={result}
          labelledBy="kd-practice-prompt"
          onSubmit={result ? next : check}
        />

        {hints > 0 && (
          <ol className="kd-hints">
            {question.hints.slice(0, hints).map((h) => (
              <li key={h}>
                <BulbIcon size={16} /> {h}
              </li>
            ))}
          </ol>
        )}

        {result && (
          <div className={`kd-feedback ${result.correct ? 'is-right' : 'is-wrong'}`} role="status">
            <strong>
              {result.correct ? <CheckIcon size={18} /> : <XIcon size={18} />} {result.correct ? 'Correct!' : 'Not quite.'}
            </strong>
            <p>{question.explanation}</p>
            {result.levelChange > 0 && <p className="kd-level-note">⬆️ Two in a row: the next questions get harder.</p>}
            {result.levelChange < 0 && <p className="kd-level-note">⬇️ Let&rsquo;s ease off a little and rebuild.</p>}
            {result.justDone && <p className="kd-level-note">🎯 Practice goal reached!</p>}
          </div>
        )}
      </article>

      {practice.done && pathItem && (
        <div className="kd-banner">
          <span>
            {pathItem.waitingOn.length
              ? `Mastery check unlocks after ${pathItem.waitingOn.map((t) => t.name).join(' and ')} is closed.`
              : 'The mastery check is unlocked.'}
          </span>
          {!pathItem.waitingOn.length && (
            <Link to={`/dashboard/check/${topicId}`} className="kd-btn kd-btn-accent kd-btn-sm">
              Take the mastery check <ArrowIcon size={16} />
            </Link>
          )}
        </div>
      )}

      <footer className="kd-quiz-actions">
        <button
          type="button"
          className="kd-btn kd-btn-ghost"
          onClick={() => setHints((h) => h + 1)}
          disabled={Boolean(result) || hints >= question.hints.length}
        >
          <BulbIcon size={18} /> {hints ? 'Another hint' : 'Show a hint'}
        </button>
        <span className="kd-muted kd-small">
          {practice.correct}/{practice.answered} correct this round
        </span>
        {result ? (
          <button type="button" className="kd-btn kd-btn-dark" onClick={next}>
            Next question <ArrowIcon size={18} />
          </button>
        ) : (
          <button type="button" className="kd-btn kd-btn-dark" onClick={check} disabled={!hasAnswer(question, value)}>
            Check <CheckIcon size={18} />
          </button>
        )}
      </footer>
    </section>
  );
}
