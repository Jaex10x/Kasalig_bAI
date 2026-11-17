import useAuth from '../context/useAuth';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';

// /dashboard: each role gets its own home screen inside the shared dashboard frame.
export default function DashboardPage() {
  const { user } = useAuth();
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'teacher') return <TeacherDashboard />;
  return <StudentDashboard />;
}
