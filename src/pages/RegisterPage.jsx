import { useNavigate } from 'react-router-dom';
import Registration from '../components/account_feature/Registration';
import useAuth from '../context/useAuth';
import useAppNavigate from '../hooks/useAppNavigate';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const goTo = useAppNavigate();

  const handleRegistered = () => {
    navigate('/login', {
      state: { flash: { type: 'success', message: 'Account created! You can now log in.' } },
    });
  };

  return (
    <Registration onSubmit={register} onRegistered={handleRegistered} onNavigate={goTo} />
  );
}