import { useState } from 'react';
import { SUBJECTS } from '../../data/curriculum';
import { GRADE_LEVELS, sectionResults } from '../../data/schoolData';
import { useSchoolData } from '../../store/learningStore';
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/dashboard/DashIcons';

const EMPTY = { id: null, name: '', gradeLevel: 9, adviser: '', studentCount: '', subjectIds: [] };

/** Admin: create, edit and remove classes (sections) and the subjects each one takes. */
export default function ManageClasses() {
  const school = useSchoolData();
  const allSubjects = [...SUBJECTS.map((s) => ({ ...s, builtIn: true })), ...school.subjects];
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Enter the section name.';
    const count = Number(form.studentCount);
    if (form.studentCount !== '' && (!Number.isInteger(count) || count < 0 || count > 80)) next.studentCount = 'Enter a number from 0 to 80.';
    if (!form.subjectIds.length) next.subjectIds = 'Pick at least one subject.';
    const dupe = school.classes.find((c) => c.id !== form.id && c.gradeLevel === Number(form.gradeLevel) && c.name.trim().toLowerCase() === form.name.trim().toLowerCase());
    if (dupe) next.name = `Grade ${dupe.gradeLevel} already has a section called ${dupe.name}.`;
    setErrors(next);
    if (Object.keys(next).length) return;
    school.saveClass({
      ...(form.id ? { id: form.id } : {}),
      name: form.name.trim(),
      gradeLevel: Number(form.gradeLevel),
      adviser: form.adviser.trim(),
      studentCount: form.studentCount === '' ? 0 : count,
      subjectIds: form.subjectIds,
    });
    setForm(EMPTY);
  };

  const toggleSubject = (id) =>
    setForm((f) => ({ ...f, subjectIds: f.subjectIds.includes(id) ? f.subjectIds.filter((s) => s !== id) : [...f.subjectIds, id] }));

  const sorted = [...school.classes].sort((a, b) => a.gradeLevel - b.gradeLevel || a.name.localeCompare(b.name));

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Administration</p>
          <h1>Classes</h1>
          <p>Sections, their advisers and the subjects they take. School analytics group results by these sections and grade levels.</p>
        </div>
      </header>

      <article className="kd-card" id="kd-class-form">
        <header className="kd-card-head">
          <div>
            <h2>{form.id ? `Edit Grade ${form.gradeLevel} – ${form.name}` : 'Add a class'}</h2>
          </div>
        </header>
        <form className="kd-form-grid" onSubmit={submit} noValidate>
          <label className="kd-field">
            <span>Grade level</span>
            <select className="kd-select" value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: Number(e.target.value) })}>
              {GRADE_LEVELS.map((g) => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </label>
          <label className="kd-field">
            <span>Section name</span>
            <input className="kd-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sampaguita" aria-invalid={Boolean(errors.name)} />
            {errors.name && <small className="kd-field-error">{errors.name}</small>}
          </label>
          <label className="kd-field">
            <span>Adviser</span>
            <input className="kd-input" value={form.adviser} onChange={(e) => setForm({ ...form, adviser: e.target.value })} placeholder="Teacher's name" />
          </label>
          <label className="kd-field">
            <span>Number of students</span>
            <input className="kd-input" type="number" min="0" max="80" value={form.studentCount} onChange={(e) => setForm({ ...form, studentCount: e.target.value })} aria-invalid={Boolean(errors.studentCount)} />
            {errors.studentCount && <small className="kd-field-error">{errors.studentCount}</small>}
          </label>
          <fieldset className="kd-field kd-field-wide kd-check-group">
            <legend>Subjects</legend>
            {allSubjects.map((s) => (
              <label key={s.id} className="kd-check-pill">
                <input type="checkbox" checked={form.subjectIds.includes(s.id)} onChange={() => toggleSubject(s.id)} />
                {s.name} <small>{s.grade}</small>
              </label>
            ))}
            {errors.subjectIds && <small className="kd-field-error">{errors.subjectIds}</small>}
          </fieldset>
          <div className="kd-field-wide kd-row-actions">
            <button type="submit" className="kd-btn kd-btn-dark">
              {form.id ? 'Save changes' : (<><PlusIcon size={18} /> Add class</>)}
            </button>
            {form.id && <button type="button" className="kd-btn kd-btn-ghost" onClick={() => { setForm(EMPTY); setErrors({}); }}>Cancel</button>}
          </div>
        </form>
      </article>

      <article className="kd-card">
        <div className="kd-table-wrap">
          <table className="kd-table">
            <thead>
              <tr>
                <th scope="col">Section</th>
                <th scope="col">Adviser</th>
                <th scope="col">Students</th>
                <th scope="col">Subjects</th>
                <th scope="col">Results</th>
                <th scope="col"><span className="kd-sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id}>
                  <td><strong>Grade {c.gradeLevel} – {c.name}</strong></td>
                  <td>{c.adviser || <span className="kd-muted">—</span>}</td>
                  <td>{c.studentCount}</td>
                  <td>
                    <div className="kd-chip-row">
                      {c.subjectIds.map((id) => {
                        const s = allSubjects.find((x) => x.id === id);
                        return s ? <span key={id} className="kd-chip kd-chip-soft">{s.name}</span> : null;
                      })}
                    </div>
                  </td>
                  <td>{sectionResults(c.id) ? 'Sample results' : <span className="kd-muted">None yet</span>}</td>
                  <td>
                    <span className="kd-row-actions">
                      <button
                        type="button"
                        className="kd-icon-btn kd-icon-btn-sm"
                        aria-label={`Edit Grade ${c.gradeLevel} ${c.name}`}
                        onClick={() => {
                          setForm({ ...EMPTY, ...c, studentCount: String(c.studentCount ?? '') });
                          setErrors({});
                          document.getElementById('kd-class-form')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <PencilIcon size={16} />
                      </button>
                      <button
                        type="button"
                        className="kd-icon-btn kd-icon-btn-sm"
                        aria-label={`Delete Grade ${c.gradeLevel} ${c.name}`}
                        onClick={() => window.confirm(`Delete Grade ${c.gradeLevel} – ${c.name}?`) && school.deleteClass(c.id)}
                      >
                        <TrashIcon size={16} />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
