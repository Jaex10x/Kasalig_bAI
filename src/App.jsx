import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';

// Navbar buttons use these names; map them to real pages
const ALIASES = {
  login: { page: 'student-login', mode: 'login' },
  'get-started': { page: 'student-login', mode: 'register' },
};

function App() {
  const { auth } = useAuth();
  // If already logged in (saved in the browser), open the dashboard
  const [currentPage, setCurrentPage] = useState(auth ? `${auth.role}-dashboard` : 'landing');
  const [authMode, setAuthMode] = useState('login');

  const handleNavigate = (page) => {
    const alias = ALIASES[page];
    setAuthMode(alias ? alias.mode : 'login');
    setCurrentPage(alias ? alias.page : page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dashboards require the matching login
  if (currentPage === 'student-dashboard' || currentPage === 'teacher-dashboard') {
    const role = currentPage.split('-')[0];
    if (auth?.role === role) {
      return role === 'student'
        ? <StudentDashboard onNavigate={handleNavigate} />
        : <TeacherDashboard onNavigate={handleNavigate} />;
    }
    return <LoginPage role={role} mode="login" onNavigate={handleNavigate} />;
  }

  if (currentPage === 'student-login' || currentPage === 'teacher-login') {
    return <LoginPage role={currentPage.split('-')[0]} mode={authMode} onNavigate={handleNavigate} />;
  }

  return <LandingPage onNavigate={handleNavigate} />;
}

function LoginPage({ role, mode, onNavigate }) {
  const Form = role === 'student' ? StudentLogin : TeacherLogin;
  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <button
        onClick={() => onNavigate('landing')}
        style={{ marginBottom: '16px', padding: '8px 16px', cursor: 'pointer' }}
      >
        ← Back to Landing Page
      </button>
      <Form onNavigate={onNavigate} initialMode={mode} />
    </div>
  );
}

export default App;