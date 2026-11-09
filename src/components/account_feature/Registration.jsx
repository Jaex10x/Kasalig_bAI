import { useState } from 'react';
import {
  EMAIL_PATTERN,
  MIN_PASSWORD_LENGTH,
  STUDENT_ID_PATTERN,
} from './authApi';
import { AuthLayout, FormAlert, NavLink, PasswordField, TextField } from './AuthShared';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  course: '',
  password: '',
  confirmPassword: '',
};

const FOOTER_LINKS = [
  { label: 'About', page: 'landing', href: '#about' },
  { label: 'Teacher login', page: 'teacher-login' },
];

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Please enter your full name.';
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Full name looks too short.';
  }

  const id = form.email.trim();
  if (!id) {
    errors.email = 'Please enter your institutional email or student ID.';
  } else if (!EMAIL_PATTERN.test(id) && !STUDENT_ID_PATTERN.test(id)) {
    errors.email = 'Enter a valid email (e.g. 2024-01530@cit.edu) or student ID.';
  }

  if (!form.course.trim()) {
    errors.course = 'Please enter your course.';
  }

  if (!form.password) {
    errors.password = 'Please create a password.';
  } else if (form.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

/**
 * Student registration page (mock auth).
 *
 * Props:
 *  - onSubmit({ fullName, email, course, password }): returns (or resolves to)
 *    { ok, user?, error? }. This is the swap point for the real API call later.
 *  - onRegistered(user): called after a successful sign-up.
 *  - onNavigate(page): used for "Log in", "About" and "Teacher login" links.
 */
export default function Registration({ onSubmit, onRegistered, onNavigate }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);

    const fresh = validate(next);
    setErrors((prev) => {
      const updated = { ...prev };
      if (touched[name]) updated[name] = fresh[name];
      // Keep "passwords match" in sync when the first password changes.
      if (name === 'password' && touched.confirmPassword) {
        updated.confirmPassword = fresh.confirmPassword;
      }
      return updated;
    });
    if (serverError) setServerError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(form)[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      email: true,
      course: true,
      password: true,
      confirmPassword: true,
    });
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setServerError('');

    try {
      const result = await onSubmit({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        course: form.course.trim(),
        password: form.password,
      });
      if (!result?.ok) {
        setServerError(result?.error ?? 'Could not create your account.');
        return;
      }
      setForm(INITIAL_FORM);
      setTouched({});
      onRegistered?.(result.user);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = (name) => ({
    id: `reg-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    disabled: submitting,
    error: errors[name],
  });

  return (
    <AuthLayout
      badge="Student Portal"
      title="Create your account"
      footerLinks={FOOTER_LINKS}
      onNavigate={onNavigate}
    >
      <form className="kb-auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert type="error">{serverError}</FormAlert>

        <TextField
          {...fieldProps('fullName')}
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Juan Dela Cruz"
        />
        <TextField
          {...fieldProps('email')}
          label="Institutional email / Student ID"
          type="text"
          inputMode="email"
          autoComplete="username"
          placeholder="2024-01530@cit.edu"
        />
        <TextField
          {...fieldProps('course')}
          label="Course"
          type="text"
          autoComplete="off"
          placeholder="BS Information Technology"
        />
        <PasswordField
          {...fieldProps('password')}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <PasswordField
          {...fieldProps('confirmPassword')}
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />

        <button type="submit" className="kb-auth-submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="kb-auth-switch">
          Already have an account?{' '}
          <NavLink page="student-login" href="#login" onNavigate={onNavigate}>Log in</NavLink>
        </p>
      </form>
    </AuthLayout>
  );
}
