import { useState } from 'react';
import { SUBJECTS, competenciesOf, topicsOf } from '../components/dashboard/curriculum';
import { GRADE_LEVELS } from '../components/dashboard/schoolData';
import { useSchoolData } from '../components/dashboard/store';
import { PencilIcon, PlusIcon, TrashIcon } from '../components/dashboard/DashIcons';

const EMPTY = { id: null, name: '', grade: 'Grade 9', description: '' };

/** Admin: the subjects the school offers. Built-in subjects come with topics, competencies and questions. */
export default function ManageSubjects() {
  const school = useSchoolData();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const usedBy = (id) => school.classes.filter((c) => c.subjectIds.includes(id));

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError('Enter the subject name.');
    const all = [...SUBJECTS, ...school.subjects];
    if (all.some((s) => s.id !== form.id && s.name.toLowerCase() === name.toLowerCase())) return setError('A subject with this name already exists.');
    school.saveSubject({ ...(form.id ? { id: form.id } : {}), name, grade: form.grade, description: form.description.trim() });
    setForm(EMPTY);
    setError('');
    return undefined;
  };

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Administration</p>
          <h1>Subjects</h1>
          <p>Built-in subjects include topics, MELC competencies and a question bank. Added subjects can be assigned to classes now; their topics and questions come with the backend curriculum.</p>
        </div>
      </header>

      <div className="kd-quiz-grid">
        {SUBJECTS.map((s) => (
          <article key={s.id} className="kd-card kd-subject-tile" style={{ '--c': s.color, '--t': s.tint }}>
            <div className="kd-quiz-tile-top">
              <span className="kd-chip kd-chip-ok">Built-in</span>
              <span className="kd-muted kd-small">{s.grade}</span>
            </div>
            <h2>{s.name}</h2>
            <ul className="kd-plain-list kd-small">
              {topicsOf(s.id).map((t) => (
                <li key={t.id}>
                  {t.name} · {competenciesOf(t.id).map((c) => c.code).join(', ')}
                </li>
              ))}
            </ul>
            <p className="kd-muted kd-small">Taken by {usedBy(s.id).length} class{usedBy(s.id).length === 1 ? '' : 'es'}</p>
          </article>
        ))}
        {school.subjects.map((s) => (
          <article key={s.id} className="kd-card kd-subject-tile">
            <div className="kd-quiz-tile-top">
              <span className="kd-chip kd-chip-soft">Added</span>
              <span className="kd-row-actions">
                <button type="button" className="kd-icon-btn kd-icon-btn-sm" aria-label={`Edit ${s.name}`} onClick={() => setForm({ ...EMPTY, ...s })}>
                  <PencilIcon size={16} />
                </button>
                <button
                  type="button"
                  className="kd-icon-btn kd-icon-btn-sm"
                  aria-label={`Delete ${s.name}`}
                  onClick={() => window.confirm(`Delete ${s.name}? It will be removed from ${usedBy(s.id).length} class(es).`) && school.deleteSubject(s.id)}
                >
                  <TrashIcon size={16} />
                </button>
              </span>
            </div>
            <h2>{s.name}</h2>
            <p className="kd-muted kd-small">{s.grade}</p>
            {s.description && <p className="kd-small">{s.description}</p>}
            <p className="kd-muted kd-small">Taken by {usedBy(s.id).length} class{usedBy(s.id).length === 1 ? '' : 'es'} · no topics yet</p>
          </article>
        ))}
      </div>

      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>{form.id ? `Edit ${form.name}` : 'Add a subject'}</h2>
          </div>
        </header>
        <form className="kd-form-grid" onSubmit={submit} noValidate>
          <label className="kd-field">
            <span>Subject name</span>
            <input className="kd-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Science 9" aria-invalid={Boolean(error)} />
            {error && <small className="kd-field-error">{error}</small>}
          </label>
          <label className="kd-field">
            <span>Grade level</span>
            <select className="kd-select" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
              {GRADE_LEVELS.map((g) => <option key={g}>Grade {g}</option>)}
            </select>
          </label>
          <label className="kd-field kd-field-wide">
            <span>Description (optional)</span>
            <input className="kd-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="kd-field-wide kd-row-actions">
            <button type="submit" className="kd-btn kd-btn-dark">
              {form.id ? 'Save changes' : (<><PlusIcon size={18} /> Add subject</>)}
            </button>
            {form.id && <button type="button" className="kd-btn kd-btn-ghost" onClick={() => { setForm(EMPTY); setError(''); }}>Cancel</button>}
          </div>
        </form>
      </article>
    </section>
  );
}
