import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import EditAccountPage from './pages/auth/EditAccountPage';
import PreviewPage from './pages/public/PreviewPage';
import DashboardPage from './pages/shared/DashboardPage';
// Student
import QuizPicker from './pages/student/QuizPicker';
import StudentCourses from './pages/student/StudentCourses';
import QuizScreen from './pages/student/QuizScreen';
import RecommendationHub from './pages/student/RecommendationHub';
import LearningPath from './pages/student/LearningPath';
import PracticeScreen from './pages/student/PracticeScreen';
import ProgressHistory from './pages/student/ProgressHistory';
import TutorChat from './pages/student/TutorChat';
// Teacher
import TeacherStudents from './pages/teacher/TeacherStudents';
import MyCourses from './pages/teacher/MyCourses';
import GapAnalytics from './pages/teacher/GapAnalytics';
import ClassProgress from './pages/teacher/ClassProgress';
import StudentReport from './pages/teacher/StudentReport';
import QuizBuilder from './pages/teacher/QuizBuilder';
import QuizEditor from './pages/teacher/QuizEditor';
import ResourceLibrary from './pages/teacher/ResourceLibrary';
import CurriculumMap from './pages/shared/CurriculumMap';
// Admin
import ManageClasses from './pages/admin/ManageClasses';
import ManageSubjects from './pages/admin/ManageSubjects';
import ManageTeachers from './pages/admin/ManageTeachers';
import ProtectedRoute from './routes/ProtectedRoute';
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
          <Route path="my-courses" element={student(<StudentCourses />)} />
          <Route path="quiz" element={student(<QuizPicker />)} />
          <Route path="quiz/:quizId" element={student(<QuizScreen mode="quiz" />)} />
          <Route path="results" element={student(<RecommendationHub />)} />
          <Route path="results/:attemptId" element={student(<RecommendationHub />)} />
          <Route path="path" element={student(<LearningPath />)} />
          <Route path="practice/:topicId" element={student(<PracticeScreen />)} />
          <Route path="check/:topicId" element={student(<QuizScreen mode="check" />)} />
          <Route path="progress" element={student(<ProgressHistory />)} />
          <Route path="tutor" element={student(<TutorChat />)} />

          {/* Teacher */}
          <Route path="courses" element={teacher(<MyCourses />)} />
          <Route path="students" element={teacher(<TeacherStudents />)} />
          <Route path="students/:studentId" element={teacher(<StudentReport />)} />
          <Route path="quizzes" element={teacher(<QuizBuilder />)} />
          <Route path="quizzes/:quizId" element={teacher(<QuizEditor />)} />
          <Route path="resources" element={teacher(<ResourceLibrary />)} />
          <Route path="gaps" element={teacher(<GapAnalytics />)} />
          <Route path="class-progress" element={teacher(<ClassProgress />)} />

          {/* Teacher and admin */}
          <Route path="curriculum" element={<RoleOnly roles={['teacher', 'admin']}><CurriculumMap /></RoleOnly>} />

          {/* Admin */}
          <Route path="classes" element={admin(<ManageClasses />)} />
          <Route path="subjects" element={admin(<ManageSubjects />)} />
          <Route path="teachers" element={admin(<ManageTeachers />)} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="/account/edit" element={<EditAccountPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
