import { useState } from 'react';
import { AUTH_ENDPOINTS, EMAIL_PATTERN, STUDENT_ID_PATTERN, postJson } from './authApi';
import { AuthLayout, FormAlert, NavLink, PasswordField, TextField } from './AuthShared';
import Capybara from '../capybaraStyle/Capybara';

const ROLE_CONFIG = {
  student: {
    badge: 'Student Portal',
    title: 'Welcome back',
    greeting: 'Hi there! Ready to learn today?',
    idLabel: 'Institutional email / Student ID',
    idPlaceholder: 'Email address / ID number',
    endpoint: AUTH_ENDPOINTS.studentLogin,
    footerLinks: [
      { label: 'About', page: 'landing', href: '#about' },
      { label: 'Teacher login', page: 'teacher-login' },
    ],
    validateId: (id) => {
      if (!id) return 'Please enter your institutional email or student ID.';
      if (!EMAIL_PATTERN.test(id) && !STUDENT_ID_PATTERN.test(id)) {
        return 'Enter a valid email or student ID.';
      }
      return undefined;
    },
  },
  teacher: {
    badge: 'Teacher Portal',
    title: 'Teacher sign in',
    idLabel: 'Institutional email',
    idPlaceholder: 'teacher@cit.edu',
    footerLinks: [
      { label: 'About', page: 'landing', href: '#about' },
      { label: 'Student login', page: 'student-login' },
    ],
    validateId: (id) => {
      if (!id) return 'Please enter your institutional email.';
      if (!EMAIL_PATTERN.test(id)) return 'Enter a valid email address.';
      return undefined;
    },
  },
};

const INITIAL_FORM = { email: '', password: '' };

function validate(form, config) {
  const errors = {};
  const idError = config.validateId(form.email.trim());
  if (idError) errors.email = idError;
  if (!form.password) errors.password = 'Please enter your password.';
  return errors;
}

/**
 * Login page for students and teachers (mock auth).
 *
 * Props:
 *  - role: 'student' (default) | 'teacher'
 *  - onSubmit({ email, password, role }): returns (or resolves to) { ok, user?, error? }.
 *    This is the swap point for the real API call later.
 *  - onLogin(user, role): called after a successful login.
 *  - onNavigate(page): used for sign-up, forgot-password and footer links.
 *  - flash: optional { type: 'success' | 'error', message } shown above the form.
 */
export default function Login({ role = 'student', onSubmit, onLogin, onNavigate, flash }) {
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.student;
  const idPrefix = `${role}-login`;

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [authFailed, setAuthFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(next, config)[name] }));
    }
    if (serverError) setServerError('');
    if (authFailed) setAuthFailed(false);
    if (success) setSuccess(false);
  };

  const handleFocus = (e) => {
    if (e.target.name === 'password') setPasswordFocused(true);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name === 'password') setPasswordFocused(false);
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(form, config)[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validate(form, config);
    setErrors(validationErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setServerError('');
    setAuthFailed(false);
    setSuccess(false);

    try {
      const user = await postJson(config.endpoint, {
        email: form.email.trim(),
        password: form.password,
      });
      setForm(INITIAL_FORM);
      setTouched({});
      setSuccess(true);
      onLogin?.(user, role);
    } catch (err) {
      const isAuthError = err.status === 401 || err.status === 403;
      setAuthFailed(isAuthError);
      // Never reveal which credential was wrong.
      setServerError(isAuthError ? 'Incorrect email or password.' : err.message);
      setForm((prev) => ({ ...prev, password: '' }));
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = (name) => ({
    id: `${idPrefix}-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    disabled: submitting,
    error: errors[name],
  });

  const companion = getCompanionState({
    submitting,
    success,
    passwordFocused,
    authFailed,
    serverError,
    errors,
    greeting: config.greeting,
  });

  return (
    <AuthLayout
      badge={config.badge}
      badgeVariant={role === 'teacher' ? 'teacher' : 'student'}
      title={config.title}
      footerLinks={config.footerLinks}
      onNavigate={onNavigate}
      companion={<Capybara mood={companion.mood} message={companion.message} />}
    >
      <form className="kb-auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert type="error">{serverError}</FormAlert>

        <TextField
          {...fieldProps('email')}
          label={config.idLabel}
          type="text"
          inputMode="email"
          autoComplete="username"
          placeholder={config.idPlaceholder}
        />
        <PasswordField
          {...fieldProps('password')}
          autoComplete="current-password"
          placeholder="Password"
        />

        <button type="submit" className="kb-auth-submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Login'}
        </button>

        {role === 'teacher' ? (
          <p className="kb-auth-note">
            New teacher? Register with institutional credentials. Accounts are verified by
            your school administrator.
          </p>
        ) : (
          <>
            <p className="kb-auth-switch">
              Forgot password?{' '}
              <NavLink page="forgot-password" onNavigate={onNavigate}>Click here</NavLink>
            </p>
            <p className="kb-auth-switch">
              New here?{' '}
              <NavLink page="register" onNavigate={onNavigate}>Sign up</NavLink>
            </p>
          </>
        )}
      </form>
    </AuthLayout>
  );
}

export const StudentLogin = (props) => <Login {...props} role="student" />;
export const TeacherLogin = (props) => <Login {...props} role="teacher" />;
