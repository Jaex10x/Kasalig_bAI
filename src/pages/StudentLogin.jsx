import AuthForm from '../components/AuthForm';

export const StudentLogin = ({ onNavigate, initialMode }) => (
  <AuthForm key={initialMode} role="student" initialMode={initialMode} onNavigate={onNavigate} />
);

export default StudentLogin;