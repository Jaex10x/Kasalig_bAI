import ForgotPassword from '../components/account_feature/Password';
import useAppNavigate from '../hooks/useAppNavigate';

export default function ForgotPasswordPage() {
  const goTo = useAppNavigate();
  return <ForgotPassword onNavigate={goTo} />;
}