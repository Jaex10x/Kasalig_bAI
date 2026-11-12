import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// The existing components call onNavigate('<page-name>'); this maps names to URLs.
const PAGE_PATHS = {
  landing: '/',
  login: '/login',
  'student-login': '/login',
  'teacher-login': '/teacher-login',
  register: '/register',
  'get-started': '/register',
  'forgot-password': '/forgot-password',
  dashboard: '/dashboard',
  'edit-account': '/account/edit',
};

export default function useAppNavigate() {
  const navigate = useNavigate();
  return useCallback(
    (page) => {
      const path = PAGE_PATHS[page];
      if (!path) return; // e.g. in-page nav labels like "how it works"
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate]
  );
}