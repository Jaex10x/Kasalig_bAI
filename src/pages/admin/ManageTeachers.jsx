import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../../context/useAuth';
import { adminApi } from '../../services/adminApi';
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH } from '../../services/authApi';
import { Avatar, EmptyState } from '../../components/dashboard/DashWidgets';
import { PencilIcon, PlusIcon, TrashIcon } from '../../components/dashboard/DashIcons';

const EMPTY = { id: null, fullName: '', email: '', password: '' };

/** A random starting password without look-alike characters (no 0/O, 1/l/I). */
function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = new Uint32Array(length);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

/**
 * Admin: teacher accounts. Teachers cannot sign themselves up; the admin creates each account
 * with a starting password and passes it on. The password is shown once, right after it is set.
 */
export default function ManageTeachers() {
  const { authRequest } = useAuth();
  const api = useMemo(() => adminApi(authRequest), [authRequest]);

  const [teachers, setTeachers] = useState(null); // null while loading
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [issued, setIssued] = useState(null); // { fullName, email, password, reset } to pass on
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState('');

  const fetchTeachers = useCallback(
    () =>
      api
        .getTeachers()
        .then((list) => setTeachers(Array.isArray(list) ? list : []))
        .catch((err) => setLoadError(err.message)),
    [api]
  );

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const load = () => {
    setLoadError('');
    setTeachers(null);
    fetchTeachers();
  };

  const editing = form.id !== null;

  const resetForm = () => {
    setForm(EMPTY);
    setErrors({});
    setServerError('');
    setShowPassword(false);
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Enter the teacher’s full name.';
    const email = form.email.trim();
    if (!email) next.email = 'Enter their email address.';
    else if (!EMAIL_PATTERN.test(email)) next.email = 'Enter a valid email address.';
    else if (teachers?.some((t) => t.teacherId !== form.id && t.email.toLowerCase() === email.toLowerCase())) {
      next.email = 'Another teacher already uses this email.';
    }
    if (!editing && !form.password) next.password = 'Set a starting password, or press Generate.';
    if (form.password && form.password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return next;
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setServerError('');
    if (Object.keys(next).length) return;

    const body = { fullName: form.fullName.trim(), email: form.email.trim().toLowerCase() };
    if (form.password) body.password = form.password;

    setSaving(true);
    try {
      const saved = editing ? await api.updateTeacher(form.id, body) : await api.createTeacher(body);
      setTeachers((list) =>
        editing ? list.map((t) => (t.teacherId === saved.teacherId ? saved : t)) : [...list, saved]
      );
      // Only show login details when a password was set: on creation, or a reset.
      setIssued(form.password ? { fullName: saved.fullName, email: saved.email, password: form.password, reset: editing } : null);
      setCopied(false);
      resetForm();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (t) => {
    setForm({ id: t.teacherId, fullName: t.fullName ?? '', email: t.email ?? '', password: '' });
    setErrors({});
    setServerError('');
    setIssued(null);
    document.getElementById('kd-teacher-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const remove = async (t) => {
    if (!window.confirm(`Delete ${t.fullName}'s teacher account? They will no longer be able to log in.`)) return;
    try {
      await api.deleteTeacher(t.teacherId);
      setTeachers((list) => list.filter((x) => x.teacherId !== t.teacherId));
      if (form.id === t.teacherId) resetForm();
    } catch (err) {
      window.alert(err.message);
    }
  };

  const copyDetails = async () => {
    const text = `Kasalig bAI teacher login\nPage: ${window.location.origin}/teacher-login\nEmail: ${issued.email}\nPassword: ${issued.password}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const q = query.trim().toLowerCase();
  const rows = (teachers ?? [])
    .filter((t) => `${t.fullName} ${t.email}`.toLowerCase().includes(q))
    .sort((a, b) => (a.fullName ?? '').localeCompare(b.fullName ?? ''));

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Administration</p>
          <h1>Teachers</h1>
          <p>Teacher accounts are created here; teachers cannot sign themselves up. Give each teacher their login details.</p>
        </div>
      </header>

      {issued && (
        <article className="kd-card kd-credentials" role="status">
          <div>
            <h2>{issued.reset ? `Password reset for ${issued.fullName}` : `Account created for ${issued.fullName}`}</h2>
            <p className="kd-muted">Pass these on now. The password is not shown again; you can always set a new one.</p>
            <dl className="kd-credentials-list">
              <dt>Login page</dt>
              <dd>{window.location.origin}/teacher-login</dd>
              <dt>Email</dt>
              <dd>{issued.email}</dd>
              <dt>Password</dt>
              <dd className="kd-code">{issued.password}</dd>
            </dl>
          </div>
          <div className="kd-row-actions">
            <button type="button" className="kd-btn kd-btn-dark kd-btn-sm" onClick={copyDetails}>
              {copied ? 'Copied' : 'Copy details'}
            </button>
            <button type="button" className="kd-btn kd-btn-ghost kd-btn-sm" onClick={() => setIssued(null)}>
              Done
            </button>
          </div>
        </article>
      )}

      <article className="kd-card" id="kd-teacher-form">
        <header className="kd-card-head">
          <div>
            <h2>{editing ? `Edit ${form.fullName || 'teacher'}` : 'Add a teacher'}</h2>
            {editing && <p>Leave the password blank to keep their current one.</p>}
          </div>
        </header>
        <form className="kd-form-grid" onSubmit={submit} noValidate>
          <label className="kd-field">
            <span>Full name</span>
            <input
              className="kd-input"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="e.g. Maria Santos"
              autoComplete="off"
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName && <small className="kd-field-error">{errors.fullName}</small>}
          </label>
          <label className="kd-field">
            <span>Email</span>
            <input
              className="kd-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="teacher@school.edu.ph"
              autoComplete="off"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <small className="kd-field-error">{errors.email}</small>}
          </label>
          <label className="kd-field kd-field-wide">
            <span>{editing ? 'New password (optional)' : 'Starting password'}</span>
            <span className="kd-password-row">
              <input
                className="kd-input"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
              />
              <button type="button" className="kd-btn kd-btn-ghost kd-btn-sm" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                className="kd-btn kd-btn-ghost kd-btn-sm"
                onClick={() => {
                  setForm({ ...form, password: generatePassword() });
                  setShowPassword(true);
                }}
              >
                Generate
              </button>
            </span>
            {errors.password && <small className="kd-field-error">{errors.password}</small>}
          </label>
          {serverError && (
            <p className="kd-field-wide kd-field-error" role="alert">
              {serverError}
            </p>
          )}
          <div className="kd-field-wide kd-row-actions">
            <button type="submit" className="kd-btn kd-btn-dark" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : (<><PlusIcon size={18} /> Create account</>)}
            </button>
            {editing && (
              <button type="button" className="kd-btn kd-btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </article>

      <article className="kd-card">
        {loadError ? (
          <EmptyState
            icon="📡"
            title="Could not load teachers"
            action={<button type="button" className="kd-btn kd-btn-dark" onClick={load}>Try again</button>}
          >
            {loadError}
          </EmptyState>
        ) : teachers === null ? (
          <p className="kd-muted" aria-busy="true">Loading teachers…</p>
        ) : teachers.length === 0 ? (
          <EmptyState icon="🧑‍🏫" title="No teachers yet">Create the first teacher account above.</EmptyState>
        ) : (
          <>
            <div className="kd-toolbar">
              <input
                className="kd-input kd-search"
                type="search"
                placeholder="Search teachers"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search teachers"
              />
              <span className="kd-muted kd-small">{teachers.length} teacher{teachers.length === 1 ? '' : 's'}</span>
            </div>
            <div className="kd-table-wrap">
              <table className="kd-table">
                <thead>
                  <tr>
                    <th scope="col">Teacher</th>
                    <th scope="col">Email</th>
                    <th scope="col">Created by</th>
                    <th scope="col"><span className="kd-sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => (
                    <tr key={t.teacherId}>
                      <td>
                        <span className="kd-person">
                          <Avatar name={t.fullName ?? '?'} size={30} /> <strong>{t.fullName}</strong>
                        </span>
                      </td>
                      <td>{t.email}</td>
                      <td>{t.admin?.fullName ?? <span className="kd-muted">Self sign-up</span>}</td>
                      <td>
                        <span className="kd-row-actions">
                          <button type="button" className="kd-icon-btn kd-icon-btn-sm" aria-label={`Edit ${t.fullName}`} onClick={() => startEdit(t)}>
                            <PencilIcon size={16} />
                          </button>
                          <button type="button" className="kd-icon-btn kd-icon-btn-sm" aria-label={`Delete ${t.fullName}`} onClick={() => remove(t)}>
                            <TrashIcon size={16} />
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length === 0 && <p className="kd-empty">No teachers match.</p>}
          </>
        )}
      </article>
    </section>
  );
}
