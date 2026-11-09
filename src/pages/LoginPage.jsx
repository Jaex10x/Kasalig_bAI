import { useLocation, useNavigate } from 'react-router-dom';
import Login from '../components/account_feature/Login';
import useAuth from '../context/useAuth';
import useAppNavigate from '../hooks/useAppNavigate';

export default function LoginPage({ role = 'student' }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const goTo = useAppNavigate();

  const handleLogin = (user) => {
    navigate('/dashboard', {
      replace: true,
      state: { flash: { type: 'success', message: `Welcome back, ${user.fullName}!` } },
    });
  };

  return (
    <Login
      role={role}
      onSubmit={login}
      onLogin={handleLogin}
      onNavigate={goTo}
      flash={location.state?.flash}
    />
  );
}