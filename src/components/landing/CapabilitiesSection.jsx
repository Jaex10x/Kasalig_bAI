import React from 'react';
import { 
  SearchSparkleIcon, 
  ResourceDocIcon, 
  BarAnalyticsIcon, 
  GaugeTutorIcon, 
  TeacherBoardIcon, 
  CohortGroupIcon,
  ArrowRightIcon 
} from './Icons';

export const CapabilitiesSection = () => {
  const capabilities = [
    {
      id: 'smart-gap-detection',
      icon: <SearchSparkleIcon size={22} color="#C2672D" />,
      title: 'Smart Learning Gap Detection',
      description:
        'Proprietary diagnostic graphs differentiate between careless calculation slip-ups and genuine conceptual misunderstandings.',
      bullet: 'Algorithmic prerequisite mapping',
    },
    {
      id: 'personalized-resources',
      icon: <ResourceDocIcon size={22} color="#C2672D" />,
      title: 'Personalized Learning Resources',
      description:
        'Automated compilation of bite-sized readings, local language explanations, and interactive step-by-step visualizations.',
      bullet: 'Curated by pedagogical standards',
    },
    {
      id: 'student-progress',
      icon: <BarAnalyticsIcon size={22} color="#C2672D" />,
      title: 'Student Progress Tracking',
      description:
        'Dynamic milestone logs that track topic mastery velocity and confidence metrics rather than mere binary pass/fail numbers.',
      bullet: 'Longitudinal retention charts',
    },
    {
      id: 'ai-tutor',
      icon: <GaugeTutorIcon size={22} color="#C2672D" />,
      title: 'AI-Powered Learning Assistance',
      description:
        'A 24/7 conversational tutor tuned to answer Socratic questions without ever generating complete homework answers directly.',
      bullet: 'Strict pedagogical guardrails',
    },
    {
      id: 'teacher-analytics',
      icon: <TeacherBoardIcon size={22} color="#C2672D" />,
      title: 'Teacher Performance Analytics',
      description:
        'Automated grading insights and diagnostic summaries that cut down administrative grading load by up to 60%.',
      bullet: 'Actionable lesson plan suggestions',
    },
    {
      id: 'class-insights',
      icon: <CohortGroupIcon size={22} color="#C2672D" />,
      title: 'Class-Wide Learning Insights',
      description:
        'Holistic heatmaps indicating which syllabus chapter caused collective confusion so lectures can be adjusted in real time.',
      bullet: 'Real-time cohort distribution',
    },
  ];

  return (
    <section className="kasalig-capabilities-section">
      <div className="kasalig-container">
        {/* Header split row */}
        <div className="capabilities-top-bar">
          <div className="capabilities-header-left">
            <span className="section-pill-tag">CAPABILITIES</span>
            <h2 className="capabilities-main-heading">
              Engineered for Deep Academic Mastery
            </h2>
            <p className="capabilities-sub-heading">
              Each feature works together to construct an encouraging, transparent
              ecosystem for students, teachers, and school leadership.
            </p>
          </div>
          <div className="capabilities-header-right">
            <a href="#pedagogy-specs" className="capabilities-spec-link">
              <span>View all pedagogical specs</span>
              <ArrowRightIcon size={14} color="#8C3E14" />
            </a>
          </div>
        </div>

        {/* 6 Capability Cards */}
        <div className="capabilities-cards-grid">
          {capabilities.map((item) => (
            <div key={item.id} className="capability-card">
              <div className="capability-icon-box">{item.icon}</div>
              <h3 className="capability-card-title">{item.title}</h3>
              <p className="capability-card-description">{item.description}</p>
              <div className="capability-bullet-tag">
                <span className="bullet-dot">●</span>
                <span className="bullet-text">{item.bullet}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;

