// Shared HTTP + validation helpers for the account feature (register / login).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

// Account routes of the Spring backend (StudentController / TeacherController).
// The server's address comes from VITE_API_BASE_URL; see .env.example.
export const AUTH_ENDPOINTS = {
  registerStudent: '/api/student/postStudent',
  studentLogin: '/api/student/login',
  teacherLogin: '/api/teacher/login',
  // Needs the login token: who the token belongs to (used to check a saved session on page load).
  me: '/api/auth/me',
  updateStudent: (id) => `/api/student/updateStudent?studentId=${encodeURIComponent(id)}`,
  updateTeacher: (id) => `/api/teacher/updateTeacher?teacherId=${encodeURIComponent(id)}`,
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const STUDENT_ID_PATTERN = /^\d{2,4}-\d{3,6}(-\d{1,4})?$/;
export const MIN_PASSWORD_LENGTH = 8;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function readErrorMessage(response) {
  try {
    const data = await response.json();
    return data?.message || data?.error || null;
  } catch {
    return null;
  }
}

/**
 * Send a request and return the parsed JSON response (or null for empty bodies).
 * With a token, sends "Authorization: Bearer <token>" so the backend knows who is calling.
 * Throws ApiError with a user-friendly message on network or HTTP failure.
 */
export async function requestJson(method, path, { body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      'Unable to reach the server. Please check your connection and try again.',
      0
    );
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new ApiError(
      message || `Request failed (${response.status}). Please try again.`,
      response.status
    );
  }

  return response.json().catch(() => null);
}

/** POST a JSON body. Sign-up and login need no token; pass one for anything else. */
export const postJson = (path, body, token) => requestJson('POST', path, { body, token });
