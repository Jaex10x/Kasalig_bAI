import useAuth from '../../context/useAuth';
import AdminDashboard from '../admin/AdminDashboard';
import StudentDashboard from '../student/StudentDashboard';
import TeacherDashboard from '../teacher/TeacherDashboard';

// /dashboard: each role gets its own home screen inside the shared dashboard frame.
export default function DashboardPage() {
  const { user } = useAuth();
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'teacher') return <TeacherDashboard />;
  return <StudentDashboard />;
}
