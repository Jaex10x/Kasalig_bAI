import './LandingPage.css';

import {
  Navbar,
  HeroSection,
  ProblemSection,
  FeedbacksSection,
  LearningCycleSection,
  ClassroomSection,
  EasiestWaySection,
  Footer,
} from '../components/landing';

/**
 * Modern Gamified & Interactive Landing Page for Kasalig bAI
 * Features:
 * - Animated & interactive quiz demonstration (choosing correct answer + feedback)
 * - Infinite animated moving feedbacks marquee
 * - Interactive space portal div with launchable rocket and reactive creature emoji
 */
export const LandingPage = ({ onNavigate }) => {
  const handleStartLearning = () => {
    if (onNavigate) {
      onNavigate('student-login');
    } else {
      const quizSection = document.querySelector('.hero-interactive-quiz-container');
      if (quizSection) {
        quizSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleExplore = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTeacherAction = () => {
    if (onNavigate) {
      onNavigate('teacher-login');
    } else {
      alert('Opening Teacher Console...');
    }
  };

  return (
    <div className="kasalig-landing-page-v2">
      {/* 1. Floating Pill Navbar */}
      <Navbar onNavigate={onNavigate} />

      <main>
        {/* 2. Hero Section with Interactive & Animated Quiz Demonstration */}
        <HeroSection
          onStartLearning={handleStartLearning}
          onExplore={handleExplore}
        />

        {/* 3. The Problem We're Solving (4 Challenge Cards) */}
        <ProblemSection />

        {/* 4. Animated Moving Feedbacks Marquee (Understand.Improve.Excel) */}
        <FeedbacksSection />

        {/* 5. The 6-Step Learning Cycle (Continuous Growth Loop) */}
        <LearningCycleSection />

        {/* 6. Built For the Entire Classroom (Students vs Educators) */}
        <ClassroomSection
          onStudentAction={handleStartLearning}
          onTeacherAction={handleTeacherAction}
        />

        {/* 7. Interactive "The easiest way to learn" Space Card (Rocket & Cute Creature) */}
        <EasiestWaySection onStartLearning={handleStartLearning} />
      </main>

      {/* 8. Dark Modern Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
