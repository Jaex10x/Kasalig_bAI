import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { coursesApi } from '../../services/coursesApi';
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, STUDENT_ID_PATTERN } from '../../services/authApi';
import { COURSES as PROGRAMS } from '../../data/courses';
import { CURRICULUM, SUBJECT_GROUPS, courseLabel, subjectByCode, termLabel } from '../../data/bsitCurriculum';
import { formatDate } from '../../hooks/dashboardHooks';
import { useClassRoster } from '../../store/learningStore';
import { Avatar, EmptyState } from '../../components/dashboard/DashWidgets';
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/dashboard/DashIcons';

const EMPTY_COURSE = { id: null, subjectCode: '', section: '', selfEnroll: true };
const EMPTY_STUDENT = { fullName: '', email: '', program: '', password: '' };

/** A random starting password without look-alike characters (no 0/O, 1/l/I). */
function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = new Uint32Array(length);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

const courseName = (c) => [courseLabel(c), c.section].filter(Boolean).join(' · ');
const unitsText = (u) => (u === null || u === undefined ? '' : `${Number(u)} unit${Number(u) === 1 ? '' : 's'}`);
const isLoginId = (v) => EMAIL_PATTERN.test(v) || STUDENT_ID_PATTERN.test(v);

/**
 * Teacher: the courses they handle and the students enrolled in each. Students added here are
 * the ones the teacher sees on the class dashboard, roster and reports.
 */
export default function MyCourses() {
  const { authRequest, isPreview } = useAuth();
  const api = useMemo(() => coursesApi(authRequest), [authRequest]);
  const { reload: reloadRoster } = useClassRoster();

  const [courses, setCourses] = useState(null); // null while loading
  const [loadError, setLoadError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const [courseForm, setCourseForm] = useState(EMPTY_COURSE);
  const [courseErrors, setCourseErrors] = useState({});
  const [courseServerError, setCourseServerError] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);

  const fetchCourses = useCallback(
    () =>
      api
        .list()
        .then((list) => {
          const next = Array.isArray(list) ? list : [];
          setCourses(next);
          setSelectedId((id) => (next.some((c) => c.id === id) ? id : next[0]?.id ?? null));
        })
        .catch((err) => setLoadError(err.message)),
    [api]
  );

  useEffect(() => {
    if (!isPreview) fetchCourses();
  }, [fetchCourses, isPreview]);

  const retry = () => {
    setLoadError('');
    setCourses(null);
    fetchCourses();
  };

  /** A student count changed: update the list and the dashboard roster. */
  const changedEnrollment = (courseId, delta) => {
    setCourses((list) => list.map((c) => (c.id === courseId ? { ...c, studentCount: c.studentCount + delta } : c)));
    reloadRoster();
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    const next = {};
    const subject = subjectByCode(courseForm.subjectCode);
    if (!subject) next.subjectCode = 'Pick the subject you teach from the curriculum.';
    setCourseErrors(next);
    setCourseServerError('');
    if (Object.keys(next).length) return;
    const body = {
      subjectCode: subject.code,
      title: subject.title,
      units: subject.units,
      yearLevel: subject.year,
      semester: subject.semester,
      section: courseForm.section.trim() || null,
      selfEnroll: courseForm.selfEnroll,
    };
    setSavingCourse(true);
    try {
      if (courseForm.id) {
        const saved = await api.update(courseForm.id, body);
        setCourses((list) => list.map((c) => (c.id === saved.id ? saved : c)));
      } else {
        const saved = await api.create(body);
        setCourses((list) => [...list, saved].sort((a, b) => courseName(a).localeCompare(courseName(b))));
        setSelectedId(saved.id);
      }
      setCourseForm(EMPTY_COURSE);
      reloadRoster();
    } catch (err) {
      setCourseServerError(err.message);
    } finally {
      setSavingCourse(false);
    }
  };

  const deleteCourse = async (c) => {
    const msg = `Delete ${courseName(c)}? Its ${c.studentCount} student${c.studentCount === 1 ? '' : 's'} will be removed from the course (their accounts and results stay).`;
    if (!window.confirm(msg)) return;
    try {
      await api.remove(c.id);
      setCourses((list) => list.filter((x) => x.id !== c.id));
      setSelectedId((id) => (id === c.id ? null : id));
      if (courseForm.id === c.id) setCourseForm(EMPTY_COURSE);
      reloadRoster();
    } catch (err) {
      window.alert(err.message);
    }
  };

  if (isPreview) {
    return (
      <section className="kd-stage kd-page">
        <header className="kd-page-head">
          <div>
            <p className="kd-eyebrow">Courses</p>
            <h1>Courses</h1>
          </div>
        </header>
        <article className="kd-card">
          <EmptyState icon="🔌" title="Courses need the backend">
            Preview mode has no server to save courses and enrollments. Log in with a real teacher account to manage them.
          </EmptyState>
        </article>
      </section>
    );
  }

  const selected = courses?.find((c) => c.id === selectedId) ?? null;

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Teaching</p>
          <h1>Courses you teach</h1>
          <p>
            The subjects you teach, from the {CURRICULUM.code} curriculum, and the students enrolled in each. Students join
            themselves when a class is open for self-enrollment, or you add them here. They appear on your class dashboard,
            roster and reports.
          </p>
        </div>
      </header>

      <div className="kd-courses">
        {/* Course list + new course form */}
        <div className="kd-courses-side">
          <article className="kd-card">
            <header className="kd-card-head">
              <div>
                <h2>Your courses</h2>
              </div>
            </header>
            {loadError ? (
              <EmptyState icon="📡" title="Could not load courses" action={<button type="button" className="kd-btn kd-btn-dark" onClick={retry}>Try again</button>}>
                {loadError}
              </EmptyState>
            ) : courses === null ? (
              <p className="kd-muted" aria-busy="true">Loading courses…</p>
            ) : courses.length === 0 ? (
              <p className="kd-muted kd-small">No courses yet. Create the first one below.</p>
            ) : (
              <ul className="kd-course-list">
                {courses.map((c) => (
                  <li key={c.id}>
                    <button type="button" className="kd-course-pick" aria-pressed={c.id === selectedId} onClick={() => setSelectedId(c.id)}>
                      <span>
                        <strong>{c.subjectCode ?? c.title}</strong>
                        <small>{c.subjectCode ? c.title : ''}</small>
                        <small>{[c.section, termLabel(c.yearLevel, c.semester)].filter(Boolean).join(' · ') || 'No section'}</small>
                      </span>
                      <span className="kd-count">{c.studentCount}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="kd-card" id="kd-course-form">
            <header className="kd-card-head">
              <div>
                <h2>{courseForm.id ? 'Edit course' : 'New course'}</h2>
              </div>
            </header>
            <form className="kd-form-grid kd-form-stack" onSubmit={submitCourse} noValidate>
              <label className="kd-field">
                <span>Subject ({CURRICULUM.code} curriculum {CURRICULUM.schoolYear})</span>
                <select
                  className="kd-select"
                  value={courseForm.subjectCode}
                  onChange={(e) => setCourseForm({ ...courseForm, subjectCode: e.target.value })}
                  aria-invalid={Boolean(courseErrors.subjectCode)}
                >
                  <option value="">Pick the subject you teach…</option>
                  {SUBJECT_GROUPS.map((g) => (
                    <optgroup key={g.label} label={g.label}>
                      {g.subjects.map((sub) => (
                        <option key={sub.code} value={sub.code}>
                          {sub.code} · {sub.title} ({sub.units} u)
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {courseErrors.subjectCode && <small className="kd-field-error">{courseErrors.subjectCode}</small>}
                {subjectByCode(courseForm.subjectCode) && (
                  <small className="kd-muted">
                    {termLabel(subjectByCode(courseForm.subjectCode).year, subjectByCode(courseForm.subjectCode).semester)} ·{' '}
                    {unitsText(subjectByCode(courseForm.subjectCode).units)}
                  </small>
                )}
              </label>
              <label className="kd-field">
                <span>Section (optional)</span>
                <input
                  className="kd-input"
                  value={courseForm.section}
                  onChange={(e) => setCourseForm({ ...courseForm, section: e.target.value })}
                  placeholder="e.g. BSIT-2A"
                />
              </label>
              <label className="kd-switch kd-switch-field">
                <input
                  type="checkbox"
                  checked={courseForm.selfEnroll}
                  onChange={(e) => setCourseForm({ ...courseForm, selfEnroll: e.target.checked })}
                />
                <span aria-hidden="true" />
                Students can enroll themselves
              </label>
              {courseServerError && <p className="kd-field-error" role="alert">{courseServerError}</p>}
              <div className="kd-row-actions">
                <button type="submit" className="kd-btn kd-btn-dark" disabled={savingCourse}>
                  {savingCourse ? 'Saving…' : courseForm.id ? 'Save course' : (<><PlusIcon size={18} /> Create course</>)}
                </button>
                {courseForm.id && (
                  <button type="button" className="kd-btn kd-btn-ghost" onClick={() => { setCourseForm(EMPTY_COURSE); setCourseErrors({}); }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </article>
        </div>

        {/* Selected course: enrolled students + add student */}
        <div className="kd-courses-main">
          {!selected ? (
            <article className="kd-card">
              <EmptyState icon="📚" title={courses?.length ? 'Pick a course' : 'Create your first course'}>
                {courses?.length
                  ? 'Choose a course on the left to see and add its students.'
                  : 'Create a course you handle, then add the students who are enrolled in it.'}
              </EmptyState>
            </article>
          ) : (
            <CourseDetail
              key={selected.id}
              course={selected}
              api={api}
              onEdit={() => {
                setCourseForm({ id: selected.id, subjectCode: selected.subjectCode ?? '', section: selected.section ?? '', selfEnroll: selected.selfEnroll });
                setCourseErrors({});
                document.getElementById('kd-course-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onDelete={() => deleteCourse(selected)}
              onEnrollmentChange={(delta) => changedEnrollment(selected.id, delta)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/** One course: its enrolled students, and adding an existing or new student. */
function CourseDetail({ course, api, onEdit, onDelete, onEnrollmentChange }) {
  const [students, setStudents] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [mode, setMode] = useState('existing'); // 'existing' | 'new'
  const [identifier, setIdentifier] = useState('');
  const [form, setForm] = useState(EMPTY_STUDENT);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null); // { text } or { credentials: { fullName, email, password } }
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .students(course.id)
      .then((list) => setStudents(Array.isArray(list) ? list : []))
      .catch((err) => setLoadError(err.message));
  }, [api, course.id]);

  const added = (student) => {
    setStudents((list) => [...list, student].sort((a, b) => (a.fullName ?? '').localeCompare(b.fullName ?? '')));
    onEnrollmentChange(1);
  };

  const enrollExisting = async (e) => {
    e.preventDefault();
    const id = identifier.trim();
    setServerError('');
    setNotice(null);
    if (!isLoginId(id)) {
      setErrors({ identifier: 'Enter the student’s email or student ID (e.g. 2024-01530).' });
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const student = await api.enrollExisting(course.id, id);
      added(student);
      setIdentifier('');
      setNotice({ text: `${student.fullName} is now enrolled in ${courseName(course)}.` });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const createStudent = async (e) => {
    e.preventDefault();
    setServerError('');
    setNotice(null);
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Enter the student’s full name.';
    if (!isLoginId(form.email.trim())) next.email = 'Enter a valid email or student ID (e.g. 2024-01530).';
    if (form.password.length < MIN_PASSWORD_LENGTH) next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters, or press Generate.`;
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    try {
      const student = await api.createStudent(course.id, {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        program: form.program || null,
        password: form.password,
      });
      added(student);
      setNotice({ credentials: { fullName: student.fullName, email: student.email, password: form.password } });
      setCopied(false);
      setForm(EMPTY_STUDENT);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const unenroll = async (s) => {
    if (!window.confirm(`Remove ${s.fullName} from ${courseName(course)}? Their account and results stay.`)) return;
    try {
      await api.unenroll(course.id, s.id);
      setStudents((list) => list.filter((x) => x.id !== s.id));
      onEnrollmentChange(-1);
    } catch (err) {
      window.alert(err.message);
    }
  };

  const copyDetails = async () => {
    const c = notice.credentials;
    const text = `Kasalig bAI student login\nPage: ${window.location.origin}/login\nEmail or student ID: ${c.email}\nPassword: ${c.password}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setServerError('');
  };

  return (
    <>
      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>{courseName(course)}</h2>
            <p>
              {[termLabel(course.yearLevel, course.semester), unitsText(course.units)].filter(Boolean).join(' · ')}
              {course.yearLevel || course.units ? ' · ' : ''}
              {course.studentCount} student{course.studentCount === 1 ? '' : 's'} enrolled ·{' '}
              {course.selfEnroll ? 'open for self-enrollment' : 'teacher adds students'}
            </p>
          </div>
          <span className="kd-row-actions">
            <button type="button" className="kd-icon-btn kd-icon-btn-sm" aria-label={`Edit ${courseName(course)}`} onClick={onEdit}>
              <PencilIcon size={16} />
            </button>
            <button type="button" className="kd-icon-btn kd-icon-btn-sm" aria-label={`Delete ${courseName(course)}`} onClick={onDelete}>
              <TrashIcon size={16} />
            </button>
          </span>
        </header>

        {loadError ? (
          <p className="kd-field-error" role="alert">{loadError}</p>
        ) : students === null ? (
          <p className="kd-muted" aria-busy="true">Loading students…</p>
        ) : students.length === 0 ? (
          <EmptyState icon="🧑‍🎓" title="No students enrolled yet">Add the students enrolled in this course below.</EmptyState>
        ) : (
          <div className="kd-table-wrap">
            <table className="kd-table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col">Email or student ID</th>
                  <th scope="col">Program</th>
                  <th scope="col">Enrolled</th>
                  <th scope="col"><span className="kd-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link to={`/dashboard/students/${s.id}`} className="kd-person">
                        <Avatar name={s.fullName ?? '?'} size={30} /> <strong>{s.fullName}</strong>
                      </Link>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.program || <span className="kd-muted">—</span>}</td>
                    <td>{s.enrolledOn ? formatDate(new Date(s.enrolledOn).getTime(), { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                    <td>
                      <button type="button" className="kd-icon-btn kd-icon-btn-sm" aria-label={`Remove ${s.fullName} from the course`} onClick={() => unenroll(s)}>
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      {notice?.credentials && (
        <article className="kd-card kd-credentials" role="status">
          <div>
            <h2>Account created for {notice.credentials.fullName}</h2>
            <p className="kd-muted">They are enrolled in {courseName(course)}. Pass these on now; the password is not shown again.</p>
            <dl className="kd-credentials-list">
              <dt>Login page</dt>
              <dd>{window.location.origin}/login</dd>
              <dt>Email or ID</dt>
              <dd>{notice.credentials.email}</dd>
              <dt>Password</dt>
              <dd className="kd-code">{notice.credentials.password}</dd>
            </dl>
          </div>
          <div className="kd-row-actions">
            <button type="button" className="kd-btn kd-btn-dark kd-btn-sm" onClick={copyDetails}>
              {copied ? 'Copied' : 'Copy details'}
            </button>
            <button type="button" className="kd-btn kd-btn-ghost kd-btn-sm" onClick={() => setNotice(null)}>
              Done
            </button>
          </div>
        </article>
      )}

      <article className="kd-card">
        <header className="kd-card-head">
          <div>
            <h2>Add a student</h2>
            <p>
              {mode === 'existing'
                ? 'The student already registered: enter the email or student ID they log in with.'
                : 'The student has no account yet: create one, then give them their login details.'}
            </p>
          </div>
          <div className="kd-segment" role="group" aria-label="How to add the student">
            <button type="button" aria-pressed={mode === 'existing'} onClick={() => switchMode('existing')}>
              Has an account
            </button>
            <button type="button" aria-pressed={mode === 'new'} onClick={() => switchMode('new')}>
              New account
            </button>
          </div>
        </header>

        {notice?.text && <p className="kd-muted" role="status">✓ {notice.text}</p>}

        {mode === 'existing' ? (
          <form className="kd-form-grid" onSubmit={enrollExisting} noValidate>
            <label className="kd-field kd-field-wide">
              <span>Email or student ID</span>
              <input
                className="kd-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. juan.delacruz@school.edu or 2024-01530"
                autoComplete="off"
                aria-invalid={Boolean(errors.identifier)}
              />
              {errors.identifier && <small className="kd-field-error">{errors.identifier}</small>}
            </label>
            {serverError && <p className="kd-field-wide kd-field-error" role="alert">{serverError}</p>}
            <div className="kd-field-wide">
              <button type="submit" className="kd-btn kd-btn-dark" disabled={saving}>
                {saving ? 'Enrolling…' : (<><PlusIcon size={18} /> Enroll student</>)}
              </button>
            </div>
          </form>
        ) : (
          <form className="kd-form-grid" onSubmit={createStudent} noValidate>
            <label className="kd-field">
              <span>Full name</span>
              <input
                className="kd-input"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Juan Dela Cruz"
                autoComplete="off"
                aria-invalid={Boolean(errors.fullName)}
              />
              {errors.fullName && <small className="kd-field-error">{errors.fullName}</small>}
            </label>
            <label className="kd-field">
              <span>Email or student ID</span>
              <input
                className="kd-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="They log in with this"
                autoComplete="off"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <small className="kd-field-error">{errors.email}</small>}
            </label>
            <label className="kd-field">
              <span>Program (optional)</span>
              <select className="kd-select" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })}>
                <option value="">—</option>
                {PROGRAMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="kd-field">
              <span>Starting password</span>
              <span className="kd-password-row">
                <input
                  className="kd-input"
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                />
                <button type="button" className="kd-btn kd-btn-ghost kd-btn-sm" onClick={() => setForm({ ...form, password: generatePassword() })}>
                  Generate
                </button>
              </span>
              {errors.password && <small className="kd-field-error">{errors.password}</small>}
            </label>
            {serverError && <p className="kd-field-wide kd-field-error" role="alert">{serverError}</p>}
            <div className="kd-field-wide">
              <button type="submit" className="kd-btn kd-btn-dark" disabled={saving}>
                {saving ? 'Creating…' : (<><PlusIcon size={18} /> Create account &amp; enroll</>)}
              </button>
            </div>
          </form>
        )}
      </article>
    </>
  );
}
