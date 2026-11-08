import { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'kasalig-auth';
const AuthContext = createContext(null);

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // auth = { role: 'student' | 'teacher', user: {...} } or null
  const [auth, setAuth] = useState(loadSaved);

  const signIn = (role, user) => {
    const value = { role, user };
    setAuth(value);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* ignore */ }
  };

  const signOut = () => {
    setAuth(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);