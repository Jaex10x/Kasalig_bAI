import { useState } from 'react';
import { EMAIL_PATTERN, STUDENT_ID_PATTERN } from './authApi';
import { AuthLayout, FormAlert, SelectField, TextField } from './AuthShared';
import { COURSES } from './courses';
import './AccountExtras.css';

const FOOTER_LINKS = [{ label: 'Back to dashboard', page: 'dashboard' }];

function validate(form, isStudent) {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Please enter your full name.';
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Full name looks too short.';
  }

  const id = form.email.trim();
  if (!id) {
    errors.email = 'Please enter your institutional email.';
  } else if (!EMAIL_PATTERN.test(id) && !(isStudent && STUDENT_ID_PATTERN.test(id))) {
    errors.email = 'Enter a valid email address.';
  }

  if (isStudent && !form.course.trim()) {
    errors.course = 'Please select your course.';
  }

  return errors;
}

/**
 * Edit-account page (mock).
 *
 * Props:
 *  - user: current user { fullName, email, course?, role }
 *  - onSubmit({ fullName, email, course? }): returns (or resolves to) { ok, user?, error? }
 *  - onCancel(): go back to the previous screen
 *  - onNavigate(page): footer link
 */
export default function EditAccount({ user, onSubmit, onCancel, onNavigate }) {
  const isStudent = user.role !== 'teacher';
  // Keep a course saved before the dropdown existed selectable, even if it is not in the list.
  const courseOptions =
    !user.course || COURSES.includes(user.course) ? COURSES : [user.course, ...COURSES];

  const [form, setForm] = useState({
    fullName: user.fullName ?? '',
    email: user.email ?? '',
    course: user.course ?? '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(next, isStudent)[name] }));
    }
    if (serverError) setServerError('');
    if (success) setSuccess(false);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(form, isStudent)[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validate(form, isStudent);
    setErrors(validationErrors);
    setTouched({ fullName: true, email: true, course: true });
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setServerError('');
    setSuccess(false);

    try {
      const result = await onSubmit({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        ...(isStudent && { course: form.course.trim() }),
      });
      if (!result?.ok) {
        setServerError(result?.error ?? 'Could not save your changes.');
        return;
      }
      setSuccess(true);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = (name) => ({
    id: `edit-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    disabled: submitting,
    error: errors[name],
  });

  return (
    <AuthLayout
      badge={isStudent ? 'Student Portal' : 'Teacher Portal'}
      badgeVariant={isStudent ? 'student' : 'teacher'}
      title="Edit your account"
      footerLinks={FOOTER_LINKS}
      onNavigate={onNavigate}
    >
      <form className="kb-auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert type="success">{success && 'Your account has been updated.'}</FormAlert>
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
          label={isStudent ? 'Institutional email / Student ID' : 'Institutional email'}
          type="text"
          inputMode="email"
          autoComplete="username"
          placeholder="2024-01530@cit.edu"
        />
        {isStudent && (
          <SelectField
            {...fieldProps('course')}
            label="Course"
            options={courseOptions}
            placeholder="Select your course"
          />
        )}

        <div className="kb-auth-actions">
          <button type="submit" className="kb-auth-submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            className="kb-auth-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}