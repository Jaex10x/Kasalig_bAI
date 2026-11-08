import AuthForm from '../components/AuthForm';

export const TeacherLogin = ({ onNavigate, initialMode }) => (
  <AuthForm key={initialMode} role="teacher" initialMode={initialMode} onNavigate={onNavigate} />
);

export default TeacherLogin;