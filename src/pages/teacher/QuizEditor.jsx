import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  DIFFICULTY_LABELS,
  GAP_TYPES,
  QUESTION_TYPE_LABELS,
  SUBJECTS,
  TOPICS,
  competenciesOf,
  topicById,
} from '../../data/curriculum';
import { correctText } from '../../lib/engine';
import { generateQuestion } from '../../lib/generators';
import { useClassData } from '../../store/learningStore';
import { EmptyState } from '../../components/dashboard/DashWidgets';
import { BackIcon, PlusIcon, SparkleIcon, TrashIcon } from '../../components/dashboard/DashIcons';

let seq = 0;
const qid = () => `tq-${Date.now().toString(36)}-${(seq++).toString(36)}`;

/** A question in editable form: identification answers are one per line. */
const toForm = (q) => ({
  ...q,
  key: q.id ?? qid(),
  acceptText: q.type === 'id' ? (q.accept ?? []).join('\n') : '',
  options: q.type === 'mc' ? q.options.map((o) => ({ text: o.text, correct: Boolean(o.correct), error: o.error ?? 'concept' })) : undefined,
});

function blankQuestion(type, topicId) {
  const competencyId = competenciesOf(topicId)[0]?.id ?? '';
  const base = { id: qid(), type, topicId, competencyId, difficulty: 2, prompt: '', explanation: '' };
  if (type === 'mc') return toForm({ ...base, options: [0, 1, 2, 3].map((i) => ({ text: '', correct: i === 0, error: 'concept' })) });
  if (type === 'tf') return toForm({ ...base, answer: true });
  return toForm({ ...base, accept: [] });
}

/** Turn the form back into a stored question, or return what is missing. */
function finalize(f) {
  const errors = [];
  if (!f.prompt.trim()) errors.push('Write the question.');
  if (!f.competencyId) errors.push('Pick a competency.');
  const base = { id: f.id, type: f.type, topicId: f.topicId, competencyId: f.competencyId, difficulty: Number(f.difficulty), prompt: f.prompt.trim(), explanation: f.explanation.trim() || 'Ask your teacher to walk through this one.', generated: f.generated || undefined };
  if (f.type === 'mc') {
    const texts = f.options.map((o) => o.text.trim());
    if (texts.some((t) => !t)) errors.push('Fill in all four options.');
    if (new Set(texts).size !== texts.length) errors.push('Options must be different.');
    return { errors, question: { ...base, options: f.options.map((o) => (o.correct ? { text: o.text.trim(), correct: true } : { text: o.text.trim(), error: o.error })) } };
  }
  if (f.type === 'tf') return { errors, question: { ...base, answer: f.answer } };
  const accept = f.acceptText.split('\n').map((a) => a.trim()).filter(Boolean);
  if (!accept.length) errors.push('Add at least one accepted answer.');
  return { errors, question: { ...base, accept, traps: f.traps ?? [] } };
}

export default function QuizEditor() {
  const { quizId } = useParams();
  return <QuizEditorForm key={quizId} quizId={quizId} />;
}

function QuizEditorForm({ quizId }) {
  const navigate = useNavigate();
  const { quizzes, saveQuiz, newId } = useClassData();
  const existing = quizId === 'new' ? null : quizzes.find((q) => q.id === quizId);

  const [meta, setMeta] = useState(() => ({
    title: existing?.title ?? '',
    description: existing?.description ?? '',
    subjectId: existing?.subjectId ?? 'math9',
  }));
  const [questions, setQuestions] = useState(() => (existing ? existing.questions.map(toForm) : []));
  const [gen, setGen] = useState({ topicId: 'quadratic', difficulty: 2, count: 3 });
  const [drafts, setDrafts] = useState([]);
  const [errors, setErrors] = useState({});

  if (quizId !== 'new' && !existing) {
    return (
      <section className="kd-stage kd-page">
        <EmptyState icon="🔎" title="Quiz not found" action={<Link to="/dashboard/quizzes" className="kd-btn kd-btn-dark">Back to quizzes</Link>} />
      </section>
    );
  }

  const subjectTopics = TOPICS.filter((t) => t.subjectId === meta.subjectId);
  const defaultTopic = questions.at(-1)?.topicId ?? subjectTopics[0]?.id ?? TOPICS[0].id;

  const patch = (key, changes) => setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, ...changes } : q)));
  const move = (key, dir) =>
    setQuestions((qs) => {
      const i = qs.findIndex((q) => q.key === key);
      const j = i + dir;
      if (j < 0 || j >= qs.length) return qs;
      const next = [...qs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const generate = () => {
    const n = Math.max(1, Math.min(10, Number(gen.count) || 1));
    setDrafts(Array.from({ length: n }, () => generateQuestion(gen.topicId, Number(gen.difficulty))));
  };
  const accept = (draft) => {
    setQuestions((qs) => [...qs, toForm({ ...draft, id: qid(), generated: true })]);
    setDrafts((ds) => ds.filter((d) => d.id !== draft.id));
  };

  const save = (publish) => {
    const nextErrors = {};
    if (!meta.title.trim()) nextErrors.title = 'Give the quiz a title.';
    if (!questions.length) nextErrors.questions = 'Add at least one question.';
    const built = questions.map((f) => {
      const { errors: e, question } = finalize(f);
      if (e.length) nextErrors[f.key] = e;
      return question;
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.querySelector('.kd-field-error, .kd-q-errors')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    saveQuiz({
      id: existing?.id ?? newId('quiz'),
      title: meta.title.trim(),
      description: meta.description.trim(),
      subjectId: meta.subjectId,
      questions: built,
      published: publish,
    });
    navigate('/dashboard/quizzes');
  };

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <Link to="/dashboard/quizzes" className="kd-back-link">
            <BackIcon size={16} /> Quizzes
          </Link>
          <h1>{existing ? 'Edit quiz' : 'New quiz'}</h1>
          <p>Tag every question with a topic and competency; that is what lets Kasalig detect the gap behind a wrong answer.</p>
        </div>
        <div className="kd-row-actions">
          <button type="button" className="kd-btn kd-btn-ghost" onClick={() => save(false)}>Save draft</button>
          <button type="button" className="kd-btn kd-btn-dark" onClick={() => save(true)}>Publish to students</button>
        </div>
      </header>

      <article className="kd-card">
        <div className="kd-form-grid">
          <label className="kd-field kd-field-wide">
            <span>Title</span>
            <input
              className="kd-input"
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              placeholder="e.g. Quadratic Equations – Quiz 2"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && <small className="kd-field-error">{errors.title}</small>}
          </label>
          <label className="kd-field">
            <span>Subject</span>
            <select className="kd-select" value={meta.subjectId} onChange={(e) => setMeta({ ...meta, subjectId: e.target.value })}>
              {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label className="kd-field kd-field-wide">
            <span>Instructions for students (optional)</span>
            <input className="kd-input" value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} />
          </label>
        </div>
      </article>

      <article className="kd-card kd-generator">
        <header className="kd-card-head">
          <div>
            <h2>
              <SparkleIcon size={20} /> Draft questions for a topic
            </h2>
            <p>Pick a topic and difficulty; review each draft before adding it. Drafts come from Kasalig&rsquo;s question templates.</p>
          </div>
        </header>
        <div className="kd-form-row">
          <label className="kd-field">
            <span>Topic</span>
            <select className="kd-select" value={gen.topicId} onChange={(e) => setGen({ ...gen, topicId: e.target.value })}>
              {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <label className="kd-field">
            <span>Difficulty</span>
            <select className="kd-select" value={gen.difficulty} onChange={(e) => setGen({ ...gen, difficulty: e.target.value })}>
              {[1, 2, 3].map((d) => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
            </select>
          </label>
          <label className="kd-field kd-field-narrow">
            <span>How many</span>
            <input className="kd-input" type="number" min="1" max="10" value={gen.count} onChange={(e) => setGen({ ...gen, count: e.target.value })} />
          </label>
          <button type="button" className="kd-btn kd-btn-accent" onClick={generate}>
            <SparkleIcon size={18} /> Generate drafts
          </button>
        </div>

        {drafts.length > 0 && (
          <>
            <ul className="kd-drafts">
              {drafts.map((d) => (
                <li key={d.id}>
                  <div>
                    <div className="kd-chip-row">
                      <span className="kd-chip kd-chip-soft">{QUESTION_TYPE_LABELS[d.type]}</span>
                      <span className="kd-chip kd-chip-soft">{DIFFICULTY_LABELS[d.difficulty]}</span>
                    </div>
                    <strong>{d.prompt}</strong>
                    <small>Answer: {correctText(d)}</small>
                  </div>
                  <span className="kd-row-actions">
                    <button type="button" className="kd-btn kd-btn-soft kd-btn-sm" onClick={() => accept(d)}>Add</button>
                    <button type="button" className="kd-btn kd-btn-ghost kd-btn-sm" onClick={() => setDrafts((ds) => ds.filter((x) => x.id !== d.id))}>Discard</button>
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" className="kd-link-btn" onClick={() => drafts.forEach(accept)}>Add all {drafts.length}</button>
          </>
        )}
      </article>

      {errors.questions && <p className="kd-field-error kd-q-errors">{errors.questions}</p>}

      <ol className="kd-q-list">
        {questions.map((q, i) => {
          const topic = topicById(q.topicId);
          return (
            <li key={q.key} className="kd-card kd-q-card" style={{ '--c': topic?.color, '--t': topic?.tint }}>
              <header className="kd-q-head">
                <strong>Question {i + 1}</strong>
                {q.generated && <span className="kd-chip kd-chip-soft"><SparkleIcon size={13} /> Generated draft</span>}
                <span className="kd-row-actions">
                  <button type="button" className="kd-icon-btn kd-icon-btn-sm" onClick={() => move(q.key, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button type="button" className="kd-icon-btn kd-icon-btn-sm" onClick={() => move(q.key, 1)} disabled={i === questions.length - 1} aria-label="Move down">↓</button>
                  <button type="button" className="kd-icon-btn kd-icon-btn-sm" onClick={() => setQuestions((qs) => qs.filter((x) => x.key !== q.key))} aria-label="Delete question">
                    <TrashIcon size={16} />
                  </button>
                </span>
              </header>

              {errors[q.key] && (
                <ul className="kd-q-errors" role="alert">
                  {errors[q.key].map((e) => <li key={e}>{e}</li>)}
                </ul>
              )}

              <div className="kd-form-row">
                <label className="kd-field">
                  <span>Type</span>
                  <select
                    className="kd-select"
                    value={q.type}
                    onChange={(e) => setQuestions((qs) => qs.map((x) => (x.key === q.key ? { ...blankQuestion(e.target.value, q.topicId), key: q.key, id: q.id, prompt: q.prompt, explanation: q.explanation, competencyId: q.competencyId, difficulty: q.difficulty } : x)))}
                  >
                    {Object.entries(QUESTION_TYPE_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                  </select>
                </label>
                <label className="kd-field">
                  <span>Topic</span>
                  <select className="kd-select" value={q.topicId} onChange={(e) => patch(q.key, { topicId: e.target.value, competencyId: competenciesOf(e.target.value)[0]?.id ?? '' })}>
                    {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </label>
                <label className="kd-field kd-field-grow">
                  <span>Competency (MELC)</span>
                  <select className="kd-select" value={q.competencyId} onChange={(e) => patch(q.key, { competencyId: e.target.value })}>
                    {competenciesOf(q.topicId).map((c) => <option key={c.id} value={c.id}>{c.code} · {c.text}</option>)}
                  </select>
                </label>
                <label className="kd-field kd-field-narrow">
                  <span>Difficulty</span>
                  <select className="kd-select" value={q.difficulty} onChange={(e) => patch(q.key, { difficulty: Number(e.target.value) })}>
                    {[1, 2, 3].map((d) => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
                  </select>
                </label>
              </div>

              <label className="kd-field">
                <span>Question</span>
                <textarea className="kd-input kd-textarea" rows={2} value={q.prompt} onChange={(e) => patch(q.key, { prompt: e.target.value })} />
              </label>

              {q.type === 'mc' && (
                <fieldset className="kd-options-edit">
                  <legend>Options: mark the correct one, and tag what each wrong one reveals</legend>
                  {q.options.map((o, oi) => (
                    <div key={oi} className="kd-option-edit">
                      <label className="kd-radio">
                        <input
                          type="radio"
                          name={`correct-${q.key}`}
                          checked={o.correct}
                          onChange={() => patch(q.key, { options: q.options.map((x, xi) => ({ ...x, correct: xi === oi })) })}
                        />
                        <span className="kd-sr-only">Correct answer</span>
                      </label>
                      <input
                        className="kd-input"
                        value={o.text}
                        placeholder={`Option ${'ABCD'[oi]}`}
                        onChange={(e) => patch(q.key, { options: q.options.map((x, xi) => (xi === oi ? { ...x, text: e.target.value } : x)) })}
                      />
                      {o.correct ? (
                        <span className="kd-chip kd-chip-ok">Correct</span>
                      ) : (
                        <select
                          className="kd-select kd-select-sm"
                          aria-label="Gap this wrong option points to"
                          value={o.error}
                          onChange={(e) => patch(q.key, { options: q.options.map((x, xi) => (xi === oi ? { ...x, error: e.target.value } : x)) })}
                        >
                          {Object.entries(GAP_TYPES).map(([id, t]) => <option key={id} value={id}>{t.label}</option>)}
                        </select>
                      )}
                    </div>
                  ))}
                </fieldset>
              )}

              {q.type === 'tf' && (
                <fieldset className="kd-options-edit kd-tf-edit">
                  <legend>Correct answer</legend>
                  {[true, false].map((v) => (
                    <label key={String(v)} className="kd-radio-pill">
                      <input type="radio" name={`tf-${q.key}`} checked={q.answer === v} onChange={() => patch(q.key, { answer: v })} />
                      {v ? 'True' : 'False'}
                    </label>
                  ))}
                </fieldset>
              )}

              {q.type === 'id' && (
                <label className="kd-field">
                  <span>Accepted answers, one per line (spaces and capitals are ignored)</span>
                  <textarea className="kd-input kd-textarea" rows={2} value={q.acceptText} onChange={(e) => patch(q.key, { acceptText: e.target.value })} />
                </label>
              )}

              <label className="kd-field">
                <span>Explanation shown after answering</span>
                <textarea className="kd-input kd-textarea" rows={2} value={q.explanation} onChange={(e) => patch(q.key, { explanation: e.target.value })} />
              </label>
            </li>
          );
        })}
      </ol>

      <div className="kd-add-q">
        <span className="kd-muted kd-small">Add a question:</span>
        {Object.entries(QUESTION_TYPE_LABELS).map(([type, label]) => (
          <button key={type} type="button" className="kd-btn kd-btn-ghost kd-btn-sm" onClick={() => setQuestions((qs) => [...qs, blankQuestion(type, defaultTopic)])}>
            <PlusIcon size={16} /> {label}
          </button>
        ))}
      </div>
    </section>
  );
}
