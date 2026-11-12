import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormAlert } from '../components/account_feature/AuthShared';
import useAuth from '../context/useAuth';
import '../components/account_feature/AuthForm.css';
import '../components/account_feature/AccountExtras.css';

// Placeholder until the real dashboards exist.
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const flash = location.state?.flash;

  const handleLogout = () => {
    navigate('/login', {
      replace: true,
      state: { flash: { type: 'success', message: 'You have been logged out.' } },
    });
    logout();
  };

  return (
    <main className="kb-auth-page">
      <section className="kb-dash-card">
        {flash && <FormAlert type={flash.type}>{flash.message}</FormAlert>}
        <h1 className="kb-dash-title">Dashboard — coming soon</h1>
        <p className="kb-dash-sub">Signed in as {user.fullName} ({user.email})</p>

        <div className="kb-dash-stack">
          <Link to="/account/edit" className="kb-auth-submit kb-dash-link">
            Edit account
          </Link>
          <button type="button" className="kb-auth-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}