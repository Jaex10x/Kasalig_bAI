import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import useAuth from '../context/useAuth';

/**
 * Development only: /preview/student, /preview/teacher or /preview/admin signs in as a
 * sample user without the backend and opens that role's dashboard.
 * In a production build this route sends everyone to the login page.
 */
export default function PreviewPage() {
  const { role } = useParams();
  const { startPreview } = useAuth();
  const navigate = useNavigate();
  const allowed = import.meta.env.DEV && ['student', 'teacher', 'admin'].includes(role);

  useEffect(() => {
    if (allowed && startPreview(role)) navigate('/dashboard', { replace: true });
  }, [allowed, role, startPreview, navigate]);

  if (!allowed) return <Navigate to="/login" replace />;
  return null;
}
