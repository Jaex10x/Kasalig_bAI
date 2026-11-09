import { useState } from 'react';
import {
  AUTH_ENDPOINTS,
  EMAIL_PATTERN,
  MIN_PASSWORD_LENGTH,
  STUDENT_ID_PATTERN,
  postJson,
} from './authApi';
import { AuthLayout, FormAlert, NavLink, PasswordField, TextField } from './AuthShared';
import Capybara from '../capybaraStyle/Capybara';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  course: '',
  password: '',
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

  return errors;
}

const FIELD_ORDER = ['fullName', 'email', 'course', 'password'];

/** What the capybara says while each field is being filled in. */
function fieldHint(field, firstName) {
  switch (field) {
    case 'fullName':
      return "What's your full name? Like “Juan Dela Cruz”.";
    case 'email':
      return firstName
        ? `Nice to meet you, ${firstName}! Now your school email or student ID.`
        : 'Now your institutional email or student ID.';
    case 'course':
      return 'Which course are you taking? e.g. BS Information Technology.';
    case 'password':
      return `Make a password with at least ${MIN_PASSWORD_LENGTH} characters. I won't peek! 🙈`;
    default:
      return '';
  }
}

/** Picks the capybara's mood + speech bubble from the current form state. */
function getCompanionState({ form, errors, focusedField, submitting, success, serverError, attempted }) {
  const firstName = form.fullName.trim().split(/\s+/)[0];

  if (submitting) return { mood: 'thinking', message: 'Creating your account…' };
  if (success) return { mood: 'happy', message: 'Yay! Your account is ready! 🎉' };
  if (serverError) return { mood: 'sad', message: 'Oh no, something went wrong. Please try again.' };

  // Eyes stay closed the whole time the password is being typed.
  if (focusedField === 'password') {
    return { mood: 'eyes-closed', message: errors.password ?? fieldHint('password') };
  }
  if (focusedField) {
    if (errors[focusedField]) return { mood: 'sad', message: errors[focusedField] };
    return { mood: 'idle', message: fieldHint(focusedField, firstName) };
  }

  const firstError = FIELD_ORDER.find((name) => errors[name]);
  if (firstError) {
    return {
      mood: 'sad',
      message: attempted ? 'A few fields need fixing. Check the red ones!' : errors[firstError],
    };
  }

  const nextEmpty = FIELD_ORDER.find((name) => !form[name].trim());
  if (!nextEmpty) return { mood: 'happy', message: 'All set! Tap “Create account”.' };
  if (nextEmpty === 'fullName') {
    return { mood: 'idle', message: "Hi! Let's create your account. Start with your full name." };
  }
  return { mood: 'idle', message: fieldHint(nextEmpty, firstName) };
}

/**
 * Student registration page.
 *
 * Props:
 *  - onSubmit({ fullName, email, course, password }): optional; returns (or resolves to)
 *    { ok, user?, error? }. Without it, the backend is called directly.
 *  - onNavigate(page): optional; used for "Log in", "About" and "Teacher login" links.
 *  - onRegistered(student): optional; called with the created student after a successful sign-up.
 */
export default function Registration({ onSubmit, onNavigate, onRegistered }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [attempted, setAttempted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(next)[name] }));
    }
    if (serverError) setServerError('');
    if (success) setSuccess(false);
  };

  const handleFocus = (e) => setFocusedField(e.target.name);

  const handleBlur = (e) => {
    const { name } = e.target;
    setFocusedField((current) => (current === name ? null : current));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(form)[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ fullName: true, email: true, course: true, password: true });
    setAttempted(true);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setServerError('');

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      course: form.course.trim(),
      password: form.password,
    };

    try {
      let student;
      if (onSubmit) {
        // Auth from AuthProvider (mock for now): returns { ok, user } | { ok: false, error }.
        const result = await onSubmit(payload);
        if (!result?.ok) {
          setServerError(result?.error ?? 'Could not create your account.');
          return;
        }
        student = result.user;
      } else {
        student = await postJson(AUTH_ENDPOINTS.registerStudent, payload);
      }
      setSuccess(true);
      setAttempted(false);
      setForm(INITIAL_FORM);
      setTouched({});
      onRegistered?.(student);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = (name) => ({
    id: `reg-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    disabled: submitting,
    error: errors[name],
  });

  const companion = getCompanionState({
    form,
    errors,
    focusedField,
    submitting,
    success,
    serverError,
    attempted,
  });

  return (
    <AuthLayout
      badge="Student Portal"
      title="Create your account"
      footerLinks={FOOTER_LINKS}
      onNavigate={onNavigate}
      companion={<Capybara mood={companion.mood} message={companion.message} />}
    >
      <form className="kb-auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert type="success">{success && 'Account created! You can now log in.'}</FormAlert>
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
