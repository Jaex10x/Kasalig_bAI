// Shared UI building blocks for the account feature pages.
import { useState } from 'react';
import './AuthForm.css';

const BrandMark = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="16" fill="#7A4A2B" />
    <path
      d="M14 9.5l1.4 3.6 3.6 1.4-3.6 1.4L14 19.5l-1.4-3.6L9 14.5l3.6-1.4L14 9.5z"
      fill="#F0A35E"
    />
    <path
      d="M20.5 16.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8.8-1.9z"
      fill="#F0A35E"
    />
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {!open && <line x1="3" y1="3" x2="21" y2="21" />}
  </svg>
);

/**
 * Page shell: cream background, brand, portal badge, title, tagline and footer links.
 * footerLinks: [{ label, page, href }]
 * companion:   optional node (e.g. a mascot) rendered beside the card.
 */
export function AuthLayout({
  badge,
  badgeVariant = 'student',
  title,
  footerLinks = [],
  onNavigate,
  companion,
  children,
}) {
  const card = (
    <section className="kb-auth-card" aria-labelledby="kb-auth-title">
      <header className="kb-auth-header">
        <div className="kb-auth-brand">
          <BrandMark />
          <span className="kb-auth-brand-name">
            Kasalig <span className="kb-auth-brand-accent">bAI</span>
          </span>
        </div>
        <span className={`kb-auth-badge is-${badgeVariant}`}>{badge}</span>
        <h1 id="kb-auth-title" className="kb-auth-title">{title}</h1>
        <p className="kb-auth-tagline">Understand. Improve. Excel.</p>
      </header>

      {children}

      {footerLinks.length > 0 && (
        <footer className="kb-auth-footer">
          {footerLinks.map(({ label, page, href }) => (
            <NavLink key={label} page={page} href={href} onNavigate={onNavigate}>
              {label}
            </NavLink>
          ))}
        </footer>
      )}
    </section>
  );

  return (
    <main className="kb-auth-page">
      {companion ? (
        <div className="kb-auth-stage">
          {companion}
          {card}
        </div>
      ) : (
        card
      )}
    </main>
  );
}

/** In-app link that calls onNavigate(page) instead of reloading. */
export function NavLink({ page, href, onNavigate, children }) {
  return (
    <a
      href={href ?? `#${page}`}
      className="kb-auth-link"
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.(page);
      }}
    >
      {children}
    </a>
  );
}

export function FieldError({ id, message }) {
  return message ? (
    <p id={`${id}-error`} className="kb-auth-error">{message}</p>
  ) : null;
}

export function FormAlert({ type, children }) {
  if (!children) return null;
  return (
    <div
      className={`kb-auth-alert is-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}

/** Labeled text input wired for accessible inline errors. */
export function TextField({ id, label, error, className = '', ...inputProps }) {
  return (
    <div className="kb-auth-field">
      <label htmlFor={id} className="kb-auth-label">{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`kb-auth-input${error ? ' has-error' : ''} ${className}`.trim()}
        {...inputProps}
      />
      <FieldError id={id} message={error} />
    </div>
  );
}

/** Password field with a show/hide toggle. */
export function PasswordField({ id, label = 'Password', error, disabled, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="kb-auth-field">
      <label htmlFor={id} className="kb-auth-label">{label}</label>
      <div className="kb-auth-password">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`kb-auth-input${error ? ' has-error' : ''}`}
          {...inputProps}
        />
        <button
          type="button"
          className="kb-auth-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          disabled={disabled}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      <FieldError id={id} message={error} />
    </div>
  );
}
