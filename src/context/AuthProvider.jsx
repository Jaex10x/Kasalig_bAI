import { useState } from 'react';
import { AuthContext } from './AuthContext';

// MOCK AUTH ONLY. Passwords are stored in plain text in localStorage.
// Replace login/register/updateUser with real API calls when the backend is ready.
const USERS_KEY = 'kb_mock_users';
const SESSION_KEY = 'kb_mock_session';

const SEED_USERS = [
  {
    id: 1,
    fullName: 'Test Student',
    email: 'student@cit.edu',
    course: 'BS Information Technology',
    role: 'student',
    password: 'password123',
  },
  {
    id: 2,
    fullName: 'Test Teacher',
    email: 'teacher@cit.edu',
    role: 'teacher',
    password: 'password123',
  },
];

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota): state still works for this session.
  }
}

const sameEmail = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

// Never expose the password to the rest of the app.
const toPublicUser = (record) =>
  record
    ? {
        id: record.id,
        fullName: record.fullName,
        email: record.email,
        course: record.course,
        role: record.role,
      }
    : null;

export default function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readStorage(USERS_KEY, SEED_USERS));
  const [sessionId, setSessionId] = useState(() => readStorage(SESSION_KEY, null));

  const saveUsers = (next) => {
    setUsers(next);
    writeStorage(USERS_KEY, next);
  };

  const record = users.find((u) => u.id === sessionId);
  const user = toPublicUser(record);

  /** login({ email, password, role? }) -> { ok, user } | { ok: false, error } */
  const login = ({ email, password, role }) => {
    const match = users.find((u) => sameEmail(u.email, email));
    // One generic message so we never reveal which credential was wrong.
    if (!match || match.password !== password || (role && match.role !== role)) {
      return { ok: false, error: 'Incorrect email or password.' };
    }
    setSessionId(match.id);
    writeStorage(SESSION_KEY, match.id);
    return { ok: true, user: toPublicUser(match) };
  };

  const logout = () => {
    setSessionId(null);
    writeStorage(SESSION_KEY, null);
  };

  /** register({ fullName, email, course, password }) -> { ok, user } | { ok: false, error } */
  const register = ({ fullName, email, course, password }) => {
    if (users.some((u) => sameEmail(u.email, email))) {
      return { ok: false, error: 'An account with that email already exists.' };
    }
    const newUser = {
      id: users.reduce((max, u) => Math.max(max, u.id), 0) + 1,
      fullName,
      email,
      course,
      role: 'student',
      password,
    };
    saveUsers([...users, newUser]);
    return { ok: true, user: toPublicUser(newUser) };
  };

  /** updateUser({ fullName?, email?, course? }) -> { ok, user } | { ok: false, error } */
  const updateUser = (changes) => {
    if (!record) return { ok: false, error: 'You must be logged in.' };
    if (
      changes.email &&
      users.some((u) => u.id !== record.id && sameEmail(u.email, changes.email))
    ) {
      return { ok: false, error: 'That email is already in use.' };
    }
    const updated = {
      ...record,
      ...(changes.fullName !== undefined && { fullName: changes.fullName }),
      ...(changes.email !== undefined && { email: changes.email }),
      ...(changes.course !== undefined && { course: changes.course }),
    };
    saveUsers(users.map((u) => (u.id === record.id ? updated : u)));
    return { ok: true, user: toPublicUser(updated) };
  };

  const value = {
    isAuthenticated: Boolean(user),
    user,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}