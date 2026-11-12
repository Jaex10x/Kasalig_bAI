import { useLocation, useNavigate } from 'react-router-dom';
import EditAccount from '../components/account_feature/EditAccount';
import useAuth from '../context/useAuth';
import useAppNavigate from '../hooks/useAppNavigate';

export default function EditAccountPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const goTo = useAppNavigate();

  // Go back if there is in-app history; otherwise fall back to the dashboard.
  const handleCancel = () => {
    if (location.key === 'default') navigate('/dashboard');
    else navigate(-1);
  };

  return (
    <EditAccount
      user={user}
      onSubmit={updateUser}
      onCancel={handleCancel}
      onNavigate={goTo}
    />
  );
}