import { useAuth } from '../context/AuthContext';

export default function DashboardShell({ title, children, onNavigate }) {
  const { auth, signOut } = useAuth();
  const user = auth?.user || {};
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page, #faf7f2)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{title}</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#111827', margin: '4px 0 0' }}>Welcome, {name}!</h1>
          </div>
          <button
            onClick={() => { signOut(); onNavigate('landing'); }}
            style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
          >
            Log out
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}