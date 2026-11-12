import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { ApiError, AUTH_ENDPOINTS, postJson, requestJson } from '../components/account_feature/authApi';

// The session is { token, expiresAt, user }. The token is the JWT from login: it is sent as
// "Authorization: Bearer <token>" and is what tells the backend who is calling. user is the public
// profile ({ id, role, fullName, email, course }). No password is ever stored here.
// Kept in localStorage so a page refresh does not log the user out.
const SESSION_KEY = 'kb_session';

// Left behind by older versions: the browser-only mock auth (plain-text passwords) and the
// token-less session.
const LEGACY_KEYS = ['kb_mock_users', 'kb_mock_session', 'kb_session_user'];

// Only these fields are kept, whatever else a response carries.
const toSessionUser = ({ id, role, fullName, email, course }) => ({
  id,
  role,
  fullName,
  email,
  course: course ?? null,
});

const isValidUser = (user) =>
  Boolean(user) &&
  Number.isInteger(user.id) &&
  (user.role === 'student' || user.role === 'teacher') &&
  typeof user.fullName === 'string' &&
  typeof user.email === 'string';

const isLive = (session) =>
  Boolean(session) &&
  typeof session.token === 'string' &&
  typeof session.expiresAt === 'number' &&
  session.expiresAt > Date.now() &&
  isValidUser(session.user);

function readSession() {
  try {
    LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key));
    const saved = JSON.parse(window.localStorage.getItem(SESSION_KEY));
    return isLive(saved) ? { ...saved, user: toSessionUser(saved.user) } : null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage unavailable (private mode, quota): the session still works until the tab closes.
  }
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const saveSession = useCallback((next) => {
    setSession(next);
    writeSession(next);
  }, []);

  const logout = useCallback(() => saveSession(null), [saveSession]);

  /**
   * Calls the backend as the signed-in user. If the token is rejected (expired, or the account was
   * deleted), the user is logged out and the ApiError is rethrown.
   */
  const savedToken = session?.token;
  const authRequest = useCallback(
    async (method, path, body) => {
      try {
        return await requestJson(method, path, { body, token: savedToken });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) logout();
        throw err;
      }
    },
    [savedToken, logout]
  );

  // On page load, check that the saved token still works and refresh the profile from the server.
  // Only a definite "no" (401, or 404 for a deleted account) logs out; a network error keeps the
  // session so the app still opens while the backend is restarting.
  useEffect(() => {
    if (!savedToken) return undefined;
    let cancelled = false;
    requestJson('GET', AUTH_ENDPOINTS.me, { token: savedToken })
      .then((me) => {
        if (cancelled || !isValidUser(me)) return;
        setSession((current) => {
          if (current?.token !== savedToken) return current;
          const next = { ...current, user: toSessionUser(me) };
          writeSession(next);
          return next;
        });
      })
      .catch((err) => {
        if (!cancelled && err instanceof ApiError && (err.status === 401 || err.status === 404)) {
          logout();
        }
      });
    return () => {
      cancelled = true;
    };
    // Only when the app opens or a new token arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedToken]);

  // Log out the moment the token expires, even if the tab stays open.
  const expiresAt = session?.expiresAt;
  useEffect(() => {
    if (!expiresAt) return undefined;
    // setTimeout overflows past ~24.8 days; tokens last hours, so cap it to be safe.
    const delay = Math.min(Math.max(expiresAt - Date.now(), 0), 2 ** 31 - 1);
    const timer = setTimeout(logout, delay);
    return () => clearTimeout(timer);
  }, [expiresAt, logout]);

  /**
   * login({ email, password, role }) -> { ok: true, user } | { ok: false, error }
   * Wrong credentials come back as ok: false. If the server cannot be reached or fails,
   * the ApiError is thrown so the form can tell the two apart.
   */
  const login = async ({ email, password, role = 'student' }) => {
    const endpoint = role === 'teacher' ? AUTH_ENDPOINTS.teacherLogin : AUTH_ENDPOINTS.studentLogin;
    let response;
    try {
      response = await postJson(endpoint, { email, password });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return { ok: false, error: 'Incorrect email or password.' };
      }
      throw err;
    }
    const next = {
      token: response?.token,
      expiresAt: response?.expiresAt,
      user: response?.user ? toSessionUser(response.user) : null,
    };
    if (!isLive(next)) {
      throw new ApiError('The server sent an unexpected response. Please try again.', 502);
    }
    saveSession(next);
    return { ok: true, user: next.user };
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
   * updateUser({ fullName, email, course? }) -> { ok: true, user } | { ok: false, error }
   * Saves the signed-in user's own account. The backend checks the token, so a user can only
   * change their own account.
   */
  const updateUser = async ({ fullName, email, course }) => {
    const user = session?.user;
    if (!user) return { ok: false, error: 'Please log in again.' };

    const isTeacher = user.role === 'teacher';
    const path = isTeacher ? AUTH_ENDPOINTS.updateTeacher(user.id) : AUTH_ENDPOINTS.updateStudent(user.id);
    const body = isTeacher ? { fullName, email } : { fullName, email, course: course ?? null };

    try {
      const saved = await authRequest('PUT', path, body);
      const nextUser = toSessionUser({
        ...user,
        fullName: saved?.fullName ?? fullName,
        email: saved?.email ?? email,
        course: isTeacher ? null : saved?.course ?? course ?? null,
      });
      saveSession({ ...session, user: nextUser });
      return { ok: true, user: nextUser };
    } catch (err) {
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        return { ok: false, error: err.message };
      }
      throw err;
    }
  };

  const value = {
    isAuthenticated: Boolean(session),
    user: session?.user ?? null,
    token: session?.token ?? null,
    login,
    logout,
    register,
    updateUser,
    // For future features: authRequest('GET', '/api/course/getCourses') sends the token for you.
    authRequest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
