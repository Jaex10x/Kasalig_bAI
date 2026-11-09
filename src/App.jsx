import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import { StudentLogin, TeacherLogin } from './components/account_feature/Login';
import Registration from './components/account_feature/Registration';

// Aliases so generic triggers (e.g. the navbar "Login" button) land on a real page.
const PAGE_ALIASES = {
  login: 'student-login',
};

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const handleNavigate = (page) => {
    setCurrentPage(PAGE_ALIASES[page] ?? page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  switch (currentPage) {
    case 'student-login':
      return <StudentLogin onNavigate={handleNavigate} />;
    case 'teacher-login':
      return <TeacherLogin onNavigate={handleNavigate} />;
    case 'register':
      return <Registration onNavigate={handleNavigate} />;
    default:
      return <LandingPage onNavigate={handleNavigate} />;
  }
}

export default App;
