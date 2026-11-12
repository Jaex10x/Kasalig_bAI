import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EditAccountPage from './pages/EditAccountPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import useAppNavigate from './hooks/useAppNavigate';

// The landing page still talks in "page names"; useAppNavigate maps them to URLs.
function LandingRoute() {
  const goTo = useAppNavigate();
  return <LandingPage onNavigate={goTo} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      {/* The keys give each login page its own form, so nothing typed carries over between them. */}
      <Route path="/login" element={<LoginPage key="student" role="student" />} />
      <Route path="/teacher-login" element={<LoginPage key="teacher" role="teacher" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Signed-in users only; everyone else is sent to /login. */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/account/edit" element={<EditAccountPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
