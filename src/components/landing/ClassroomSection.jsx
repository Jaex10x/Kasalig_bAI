import React from 'react';
import { CheckIcon, ArrowRightIcon } from './Icons';

export const ClassroomSection = ({ onStudentAction, onTeacherAction }) => {
  return (
    <section id="features" className="kasalig-classroom-section">
      <div className="kasalig-container">
        {/* Section Header */}
        <div className="classroom-header-center">
          <h2 className="classroom-main-title">Built For the Entire Classroom</h2>
          <p className="classroom-sub-title">
            Empowering learners to study with confidence, while giving educators supercharged insights.
          </p>
        </div>

        {/* 2 Persona Cards */}
        <div className="classroom-cards-grid">
          {/* Card 1: Students (Light Card) */}
          <div className="classroom-persona-card student-persona-card">
            <div className="persona-tag-pill student-pill">
              <span>🎓 For Students</span>
            </div>

            <blockquote className="persona-quote">
              “Understand your weaknesses. Learn at your own pace. Celebrate every improvement.”
            </blockquote>

            <ul className="persona-bullet-list">
              <li>
                <CheckIcon size={16} color="#E67E22" />
                <span>No judgment, no anxiety — practice until you truly understand.</span>
              </li>
              <li>
                <CheckIcon size={16} color="#E67E22" />
                <span>Gamified XP streaks, unlimited hearts, and interactive quiz modes.</span>
              </li>
              <li>
                <CheckIcon size={16} color="#E67E22" />
                <span>Immediate clear explanations for every multiple-choice option.</span>
              </li>
            </ul>

            <button 
              type="button" 
              className="persona-btn student-btn"
              onClick={onStudentAction}
            >
              <span>Start Studying Free</span>
              <ArrowRightIcon size={14} color="#78350F" />
            </button>
          </div>

          {/* Card 2: Educators (Dark Navy Card) */}
          <div className="classroom-persona-card educator-persona-card">
            <div className="persona-tag-pill educator-pill">
              <span>👨‍🏫 For Educators</span>
            </div>

            <blockquote className="persona-quote dark-quote">
              “Understand your students better. Identify learning difficulties earlier. Make informed decisions.”
            </blockquote>

            <ul className="persona-bullet-list dark-list">
              <li>
                <CheckIcon size={16} color="#F59E0B" />
                <span>Instant class-level heatmaps showing which curriculum topics fail.</span>
              </li>
              <li>
                <CheckIcon size={16} color="#F59E0B" />
                <span>Automated diagnostic quizzes aligned to national curriculum standards.</span>
              </li>
              <li>
                <CheckIcon size={16} color="#F59E0B" />
                <span>Exportable student progress reports ready for parent-teacher reviews.</span>
              </li>
            </ul>

            <button 
              type="button" 
              className="persona-btn educator-btn"
              onClick={onTeacherAction}
            >
              <span>Access Dashboard</span>
              <ArrowRightIcon size={14} color="#FFFFFF" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassroomSection;

