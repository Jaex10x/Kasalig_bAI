// Base URL of the Spring Boot backend. Override with VITE_API_URL in .env if needed.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function post(path, body) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the server. Is the Spring Boot backend running on port 8080?');
  }
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Request failed (${res.status})`);
  }
  return text ? JSON.parse(text) : null;
}

// role is 'student' or 'teacher'
export const login = (role, email, password) => post(`/api/${role}/login`, { email, password });
export const register = (role, details) => post(`/api/${role}/register`, details);