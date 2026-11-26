import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../../context/useAuth';
import { enrollApi } from '../../services/coursesApi';
import { CURRICULUM, SEMESTER_LABELS, YEAR_LABELS, courseLabel, termLabel } from '../../data/bsitCurriculum';
import { EmptyState } from '../../components/dashboard/DashWidgets';
import { PlusIcon } from '../../components/dashboard/DashIcons';

const unitsOf = (c) => (c.units === null || c.units === undefined ? 0 : Number(c.units));

/** One class: subject, section, teacher, term and units, with an enroll or drop button. */
function ClassCard({ course, enrolled, busy, onEnroll, onDrop }) {
  return (
    <li className={`kd-class-card ${enrolled ? 'is-enrolled' : ''}`}>
      <div className="kd-class-main">
        <span className="kd-class-code">{course.subjectCode ?? 'Class'}</span>
        <strong>{course.title}</strong>
        <small className="kd-muted">
          {[course.section && `Section ${course.section}`, course.teacherName && `with ${course.teacherName}`].filter(Boolean).join(' · ')}
        </small>
        <small className="kd-muted">
          {[termLabel(course.yearLevel, course.semester), course.units !== null && course.units !== undefined ? `${Number(course.units)} units` : null]
            .filter(Boolean)
            .join(' · ')}
        </small>
      </div>
      {enrolled ? (
        <div className="kd-class-actions">
          <span className="kd-chip kd-chip-ok">Enrolled</span>
          <button type="button" className="kd-link-btn kd-small" onClick={onDrop} disabled={busy}>
            Drop
          </button>
        </div>
      ) : (
        <button type="button" className="kd-btn kd-btn-dark kd-btn-sm" onClick={onEnroll} disabled={busy}>
          {busy ? 'Enrolling…' : (<><PlusIcon size={15} /> Enroll</>)}
        </button>
      )}
    </li>
  );
}

/**
 * Student: self-enrollment. Browse the classes teachers have opened (by year and semester of the
 * curriculum), enroll, and drop. The teacher sees enrolled students on their class roster.
 */
export default function StudentCourses() {
  const { authRequest, isPreview } = useAuth();
  const api = useMemo(() => enrollApi(authRequest), [authRequest]);

  const [items, setItems] = useState(null); // [{ course, enrolled }]
  const [loadError, setLoadError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null); // { type: 'ok' | 'error', text }
  const [year, setYear] = useState('all');
  const [semester, setSemester] = useState('all');
  const [query, setQuery] = useState('');

  const fetchItems = useCallback(
    () =>
      api
        .list()
        .then((list) => setItems(Array.isArray(list) ? list : []))
        .catch((err) => setLoadError(err.message)),
    [api]
  );

  useEffect(() => {
    if (!isPreview) fetchItems();
  }, [fetchItems, isPreview]);

  const retry = () => {
    setLoadError('');
    setItems(null);
    fetchItems();
  };

  const setEnrolled = (courseId, enrolled, delta) =>
    setItems((list) =>
      list.map((x) =>
        x.course.id === courseId ? { course: { ...x.course, studentCount: x.course.studentCount + delta }, enrolled } : x
      )
    );

  const enroll = async (course) => {
    setBusyId(course.id);
    setMessage(null);
    try {
      await api.enroll(course.id);
      setEnrolled(course.id, true, 1);
      setMessage({ type: 'ok', text: `You are now enrolled in ${courseLabel(course)}.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusyId(null);
    }
  };

  const drop = async (course) => {
    if (!window.confirm(`Drop ${courseLabel(course)}? Your quiz results stay saved.`)) return;
    setBusyId(course.id);
    setMessage(null);
    try {
      await api.drop(course.id);
      // A closed class disappears once dropped; an open one goes back to the available list.
      setItems((list) =>
        course.selfEnroll ? list.map((x) => (x.course.id === course.id ? { course: { ...x.course, studentCount: x.course.studentCount - 1 }, enrolled: false } : x)) : list.filter((x) => x.course.id !== course.id)
      );
      setMessage({ type: 'ok', text: `You dropped ${courseLabel(course)}.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusyId(null);
    }
  };

  const head = (
    <header className="kd-page-head">
      <div>
        <p className="kd-eyebrow">Enrollment</p>
        <h1>My courses</h1>
        <p>
          Enroll in the classes you are taking this term ({CURRICULUM.program}, curriculum {CURRICULUM.schoolYear}). Your
          teacher sees your results once you are enrolled.
        </p>
      </div>
    </header>
  );

  if (isPreview) {
    return (
      <section className="kd-stage kd-page">
        {head}
        <article className="kd-card">
          <EmptyState icon="🔌" title="Enrollment needs the backend">
            Preview mode has no server to enroll you in classes. Log in with a real student account.
          </EmptyState>
        </article>
      </section>
    );
  }

  const enrolled = (items ?? []).filter((x) => x.enrolled).map((x) => x.course);
  const totalUnits = enrolled.reduce((sum, c) => sum + unitsOf(c), 0);
  const q = query.trim().toLowerCase();
  const available = (items ?? [])
    .filter((x) => !x.enrolled)
    .map((x) => x.course)
    .filter((c) => year === 'all' || String(c.yearLevel) === year)
    .filter((c) => semester === 'all' || String(c.semester) === semester)
    .filter((c) => `${c.subjectCode ?? ''} ${c.title} ${c.section ?? ''} ${c.teacherName ?? ''}`.toLowerCase().includes(q));

  return (
    <section className="kd-stage kd-page">
      {head}

      {message && (
        <p className={`kd-enroll-msg is-${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
          {message.text}
        </p>
      )}

      {loadError ? (
        <article className="kd-card">
          <EmptyState icon="📡" title="Could not load classes" action={<button type="button" className="kd-btn kd-btn-dark" onClick={retry}>Try again</button>}>
            {loadError}
          </EmptyState>
        </article>
      ) : items === null ? (
        <article className="kd-card">
          <p className="kd-muted" aria-busy="true">Loading classes…</p>
        </article>
      ) : (
        <>
          <article className="kd-card">
            <header className="kd-card-head">
              <div>
                <h2>Enrolled</h2>
                <p>
                  {enrolled.length} class{enrolled.length === 1 ? '' : 'es'} · {totalUnits} unit{totalUnits === 1 ? '' : 's'}
                </p>
              </div>
            </header>
            {enrolled.length === 0 ? (
              <p className="kd-muted">You are not enrolled in any class yet. Pick yours from the list below.</p>
            ) : (
              <ul className="kd-class-list">
                {enrolled.map((c) => (
                  <ClassCard key={c.id} course={c} enrolled busy={busyId === c.id} onDrop={() => drop(c)} />
                ))}
              </ul>
            )}
          </article>

          <article className="kd-card">
            <header className="kd-card-head">
              <div>
                <h2>Available classes</h2>
                <p>Classes your teachers have opened for self-enrollment.</p>
              </div>
            </header>
            <div className="kd-toolbar">
              <input
                className="kd-input kd-search"
                type="search"
                placeholder="Search by code, subject, section or teacher"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search classes"
              />
              <select className="kd-select kd-select-sm" value={year} onChange={(e) => setYear(e.target.value)} aria-label="Year level">
                <option value="all">All years</option>
                {Object.entries(YEAR_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
              <select className="kd-select kd-select-sm" value={semester} onChange={(e) => setSemester(e.target.value)} aria-label="Semester">
                <option value="all">All semesters</option>
                {Object.entries(SEMESTER_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>
            {available.length === 0 ? (
              <p className="kd-muted">
                {items.some((x) => !x.enrolled)
                  ? 'No classes match your filters.'
                  : 'No open classes right now. Your teacher can also add you to their class directly.'}
              </p>
            ) : (
              <ul className="kd-class-list">
                {available.map((c) => (
                  <ClassCard key={c.id} course={c} busy={busyId === c.id} onEnroll={() => enroll(c)} />
                ))}
              </ul>
            )}
          </article>
        </>
      )}
    </section>
  );
}
