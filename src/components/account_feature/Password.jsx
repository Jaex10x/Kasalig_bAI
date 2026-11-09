import { useState } from 'react';
import { EMAIL_PATTERN } from './authApi';
import { AuthLayout, FormAlert, NavLink, TextField } from './AuthShared';
import './AccountExtras.css';

const SUCCESS_MESSAGE =
  'If an account exists for this email, a reset link has been sent.';

const FOOTER_LINKS = [
  { label: 'About', page: 'landing', href: '#about' },
  { label: 'Back to login', page: 'student-login' },
];

function validateEmail(value) {
  const email = value.trim();
  if (!email) return 'Please enter your email address.';
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address.';
  return undefined;
}

/**
 * Forgot-password page (mock). Always shows the same success message so it
 * never reveals whether an account exists.
 *
 * Props:
 *  - onSubmit(email): optional; swap point for the real "send reset link" call.
 *  - onNavigate(page): used for the links back to login / landing.
 */
export default function ForgotPassword({ onSubmit, onNavigate }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (touched) setError(validateEmail(value) ?? '');
    if (sent) setSent(false);
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email) ?? '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationError = validateEmail(email);
    setTouched(true);
    setError(validationError ?? '');
    if (validationError) return;

    setSubmitting(true);
    try {
      await onSubmit?.(email.trim());
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Student Portal"
      title="Reset your password"
      footerLinks={FOOTER_LINKS}
      onNavigate={onNavigate}
    >
      <form className="kb-auth-form" onSubmit={handleSubmit} noValidate>
        <p className="kb-auth-intro">
          Enter the email linked to your account and we’ll send you a link to reset your password.
        </p>

        <FormAlert type="success">{sent && SUCCESS_MESSAGE}</FormAlert>

        <TextField
          id="forgot-email"
          name="email"
          label="Institutional email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@cit.edu"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          error={error}
        />

        <button type="submit" className="kb-auth-submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send reset link'}
        </button>

        <p className="kb-auth-switch">
          Remembered it?{' '}
          <NavLink page="student-login" href="#login" onNavigate={onNavigate}>Back to login</NavLink>
        </p>
      </form>
    </AuthLayout>
  );
}