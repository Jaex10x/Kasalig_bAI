import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { ApiError, AUTH_ENDPOINTS, postJson } from '../components/account_feature/authApi';

// The signed-in user's public profile ({ id, role, fullName, email, course }) is kept in
// localStorage so a page refresh does not log them out. No password is ever stored here.
const SESSION_KEY = 'kb_session_user';

// Left behind by the old browser-only mock auth, which kept passwords in plain text.
const LEGACY_MOCK_KEYS = ['kb_mock_users', 'kb_mock_session'];

// Only these fields are kept, whatever else a response carries.
const toSessionUser = ({ id, role, fullName, email, course }) => ({
  id,
  role,
  fullName,
  email,
  course: course ?? null,
});

function readSession() {
  try {
    LEGACY_MOCK_KEYS.forEach((key) => window.localStorage.removeItem(key));
    const saved = JSON.parse(window.localStorage.getItem(SESSION_KEY));
    const isValid =
      saved &&
      Number.isInteger(saved.id) &&
      (saved.role === 'student' || saved.role === 'teacher') &&
      typeof saved.fullName === 'string' &&
      typeof saved.email === 'string';
    return isValid ? toSessionUser(saved) : null;
  } catch {
    return null;
  }
}

function writeSession(user) {
  try {
    if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage unavailable (private mode, quota): the session still works until the tab closes.
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  /**
   * login({ email, password, role }) -> { ok: true, user } | { ok: false, error }
   * Wrong credentials come back as ok: false. If the server cannot be reached or fails,
   * the ApiError is thrown so the form can tell the two apart.
   */
  const login = async ({ email, password, role = 'student' }) => {
    const endpoint = role === 'teacher' ? AUTH_ENDPOINTS.teacherLogin : AUTH_ENDPOINTS.studentLogin;
    let account;
    try {
      account = await postJson(endpoint, { email, password });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { ok: false, error: 'Incorrect email or password.' };
      }
      throw err;
    }
    if (!account?.id) {
      throw new ApiError('The server sent an unexpected response. Please try again.', 502);
    }
    const signedIn = toSessionUser(account);
    setUser(signedIn);
    writeSession(signedIn);
    return { ok: true, user: signedIn };
  };

  const logout = () => {
    setUser(null);
    writeSession(null);
  };

  /**
   * register({ fullName, email, course, password }) -> { ok: true, user } | { ok: false, error }
   * Creates a student account. It does not sign the student in; they log in afterwards.
   */
  const register = async ({ fullName, email, course, password }) => {
    try {
      const student = await postJson(AUTH_ENDPOINTS.registerStudent, {
        fullName,
        email,
        course,
        password,
      });
      return {
        ok: true,
        user: toSessionUser({ ...student, id: student?.studentId, role: 'student' }),
      };
    } catch (err) {
      // 4xx: the server refused the sign-up and says why (e.g. the email is already registered).
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        return { ok: false, error: err.message };
      }
      throw err;
    }
  };

  /**
   * Not connected yet: the backend has no way to know who is calling, so it cannot safely let
   * a user change their own account. Fails honestly instead of pretending to save.
   */
  const updateUser = async () => ({
    ok: false,
    error: 'Saving account changes is not connected to the server yet.',
  });

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
