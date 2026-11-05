  import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'student-login') {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <button 
          onClick={() => handleNavigate('landing')}
          style={{ marginBottom: '16px', padding: '8px 16px', cursor: 'pointer' }}
        >
          ← Back to Landing Page
        </button>
        <StudentLogin onNavigate={handleNavigate} />
      </div>
    );
  }

  if (currentPage === 'teacher-login') {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <button 
          onClick={() => handleNavigate('landing')}
          style={{ marginBottom: '16px', padding: '8px 16px', cursor: 'pointer' }}
        >
          ← Back to Landing Page
        </button>
        <TeacherLogin onNavigate={handleNavigate} />
      </div>
    );
  }

  return <LandingPage onNavigate={handleNavigate} />;
}

export default App;
