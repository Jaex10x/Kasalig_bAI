import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard({ onNavigate }) {
  const { auth } = useAuth();
  const u = auth?.user || {};
  return (
    <DashboardShell title="Student Dashboard" onNavigate={onNavigate}>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ede6dc', padding: '24px' }}>
        <p><strong>Email:</strong> {u.email}</p>
        <p><strong>Year level:</strong> {u.gradeLevel || '—'}</p>
        <p><strong>University:</strong> {u.school || '—'}</p>
        <p style={{ color: '#64748b' }}>Quizzes and recommendations will appear here.</p>
      </div>
    </DashboardShell>
  );
}