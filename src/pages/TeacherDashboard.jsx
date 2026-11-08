import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../context/AuthContext';

export default function TeacherDashboard({ onNavigate }) {
  const { auth } = useAuth();
  const u = auth?.user || {};
  return (
    <DashboardShell title="Teacher Dashboard" onNavigate={onNavigate}>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ede6dc', padding: '24px' }}>
        <p><strong>Email:</strong> {u.email}</p>
        <p><strong>Department:</strong> {u.department || '—'}</p>
        <p><strong>School:</strong> {u.school || '—'}</p>
        <p style={{ color: '#64748b' }}>Class analytics and lesson recommendations will appear here.</p>
      </div>
    </DashboardShell>
  );
}