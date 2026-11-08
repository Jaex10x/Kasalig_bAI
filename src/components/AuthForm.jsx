import { useState } from 'react';
import { login, register } from '../api';
import { useAuth } from '../context/AuthContext';

const ROLE_CONFIG = {
  student: {
    title: 'Student',
    color: '#8c3e14',
    blurb: 'For college students: access your personalized learning dashboard.',
    // College only for now: the year level must be one of these
    extraField: { name: 'gradeLevel', label: 'Year Level', options: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'] },
    schoolLabel: 'University / College',
    // Students must sign up with a school email: name@school.edu or name@school.edu.ph
    emailPattern: /^[^@\s]+@[^@\s]+\.edu(\.[a-z]{2})?$/i,
    other: { role: 'teacher', label: "I'm a teacher" },
  },
  teacher: {
    title: 'Teacher',
    color: '#0d1929',
    blurb: 'View class-wide diagnostic analytics and lesson recommendations.',
    extraField: { name: 'department', label: 'Department', placeholder: 'Mathematics' },
    schoolLabel: 'School',
    other: { role: 'student', label: "I'm a student" },
  },
};

const card = { maxWidth: '420px', margin: '40px auto', padding: '32px', background: '#fff', borderRadius: '16px', border: '1px solid #ede6dc', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db' };
const linkBtn = { background: 'none', border: 'none', padding: 0, color: '#8c3e14', fontWeight: 600, cursor: 'pointer' };

const EMPTY = { firstName: '', lastName: '', email: '', password: '', gradeLevel: '', department: '', school: '' };

export default function AuthForm({ role, initialMode = 'login', onNavigate }) {
  const cfg = ROLE_CONFIG[role];
  const { signIn } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (isRegister && cfg.emailPattern && !cfg.emailPattern.test(form.email.trim())) {
        throw new Error('Please use your school email (e.g. student@school.edu or student@school.edu.ph).');
      }
      if (isRegister) {
        const { firstName, lastName, email, password, school } = form;
        const extra = { [cfg.extraField.name]: form[cfg.extraField.name] };
        await register(role, { firstName, lastName, email, password, school, ...extra });
      }
      user = await login(role, form.email, form.password);
      signIn(role, user);
      onNavigate(`${role}-dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, props = {}, options) => (
    <div style={{ marginBottom: '16px' }}>
      <label htmlFor={`${role}-${name}`} style={labelStyle}>{label}</label>
      {options ? (
        <select id={`${role}-${name}`} name={name} value={form[name]} onChange={update} style={inputStyle} required>
          <option value="" disabled>Select…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input id={`${role}-${name}`} name={name} value={form[name]} onChange={update} style={inputStyle} {...props} />
      )}
    </div>
  );

  return (
    <div style={card}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#111827', marginBottom: '8px' }}>
        {cfg.title} {isRegister ? 'Sign Up' : 'Login'}
      </h2>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
        {isRegister ? 'Create your account. ' : 'Welcome back! '}{cfg.blurb}
      </p>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>{field('firstName', 'First Name', { required: true })}</div>
            <div style={{ flex: 1 }}>{field('lastName', 'Last Name', { required: true })}</div>
          </div>
        )}
        {field('email', 'Email', { type: 'email', required: true, placeholder: `${role}@school.edu`, autoComplete: 'email' })}
        {field('password', 'Password', {
          type: 'password', required: true, placeholder: '••••••••',
          minLength: isRegister ? 6 : undefined,
          autoComplete: isRegister ? 'new-password' : 'current-password',
        })}
        {isRegister && field(cfg.extraField.name, cfg.extraField.label, { placeholder: cfg.extraField.placeholder }, cfg.extraField.options)}
        {isRegister && field('school', cfg.schoolLabel, { placeholder: cfg.schoolLabel })}

        {error && (
          <p role="alert" style={{ color: '#b91c1c', background: '#fef2f2', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: cfg.color, color: '#fff', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Please wait…' : isRegister ? `Create ${cfg.title} Account` : `Sign In as ${cfg.title}`}
        </button>
      </form>

      <p style={{ fontSize: '14px', color: '#64748b', marginTop: '20px', textAlign: 'center' }}>
        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
        <button type="button" style={linkBtn} onClick={() => { setMode(isRegister ? 'login' : 'register'); setError(''); }}>
          {isRegister ? 'Sign in' : 'Sign up'}
        </button>
        {' · '}
        <button type="button" style={linkBtn} onClick={() => onNavigate(`${cfg.other.role}-login`)}>
          {cfg.other.label}
        </button>
      </p>
    </div>
  );
}