import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EditAccountPage from './pages/EditAccountPage';
import PreviewPage from './pages/PreviewPage';
import DashboardPage from './pages/DashboardPage';
// Student
import QuizPicker from './pages/QuizPicker';
import QuizScreen from './pages/QuizScreen';
import RecommendationHub from './pages/RecommendationHub';
import LearningPath from './pages/LearningPath';
import PracticeScreen from './pages/PracticeScreen';
import ProgressHistory from './pages/ProgressHistory';
import TutorChat from './pages/TutorChat';
import RecommendationsPage from './pages/RecommendationsPage';
// Teacher
import TeacherStudents from './pages/TeacherStudents';
import StudentReport from './pages/StudentReport';
import QuizBuilder from './pages/QuizBuilder';
import QuizEditor from './pages/QuizEditor';
import ResourceLibrary from './pages/ResourceLibrary';
import CurriculumMap from './pages/CurriculumMap';
// Admin
import ManageClasses from './pages/ManageClasses';
import ManageSubjects from './pages/ManageSubjects';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout, { RoleOnly } from './components/dashboard/DashboardLayout';
import useAppNavigate from './hooks/useAppNavigate';

// The landing page still talks in "page names"; useAppNavigate maps them to URLs.
function LandingRoute() {
  const goTo = useAppNavigate();
  return <LandingPage onNavigate={goTo} />;
}

const student = (el) => <RoleOnly roles={['student']}>{el}</RoleOnly>;
const teacher = (el) => <RoleOnly roles={['teacher']}>{el}</RoleOnly>;
const admin = (el) => <RoleOnly roles={['admin']}>{el}</RoleOnly>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      {/* The keys give each login page its own form, so nothing typed carries over between them. */}
      <Route path="/login" element={<LoginPage key="student" role="student" />} />
      <Route path="/teacher-login" element={<LoginPage key="teacher" role="teacher" />} />
      <Route path="/admin-login" element={<LoginPage key="admin" role="admin" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Development only: sign in as a sample user without the backend. */}
      <Route path="/preview/:role" element={<PreviewPage />} />

      {/* Signed-in users only; everyone else is sent to /login. */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Student, teacher or admin home, by role */}
          <Route index element={<DashboardPage />} />

          {/* Student: assess → gap report → learning path → practice → mastery check */}
          <Route path="quiz" element={student(<QuizPicker />)} />
          <Route path="quiz/:quizId" element={student(<QuizScreen mode="quiz" />)} />
          <Route path="results" element={student(<RecommendationHub />)} />
          <Route path="results/:attemptId" element={student(<RecommendationHub />)} />
          <Route path="for-you" element={student(<RecommendationsPage />)} />
          <Route path="path" element={student(<LearningPath />)} />
          <Route path="practice/:topicId" element={student(<PracticeScreen />)} />
          <Route path="check/:topicId" element={student(<QuizScreen mode="check" />)} />
          <Route path="progress" element={student(<ProgressHistory />)} />
          <Route path="tutor" element={student(<TutorChat />)} />

          {/* Teacher */}
          <Route path="students" element={teacher(<TeacherStudents />)} />
          <Route path="students/:studentId" element={teacher(<StudentReport />)} />
          <Route path="quizzes" element={teacher(<QuizBuilder />)} />
          <Route path="quizzes/:quizId" element={teacher(<QuizEditor />)} />
          <Route path="resources" element={teacher(<ResourceLibrary />)} />

          {/* Teacher and admin */}
          <Route path="curriculum" element={<RoleOnly roles={['teacher', 'admin']}><CurriculumMap /></RoleOnly>} />

          {/* Admin */}
          <Route path="classes" element={admin(<ManageClasses />)} />
          <Route path="subjects" element={admin(<ManageSubjects />)} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="/account/edit" element={<EditAccountPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
