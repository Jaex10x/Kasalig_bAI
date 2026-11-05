import React from 'react';
import { 
  CompassEditIcon, 
  KeyGapIcon, 
  BriefcaseClockIcon, 
  OpenBookIcon,
  ArrowRightIcon 
} from './Icons';

export const CoreChallengeSection = () => {
  const challenges = [
    {
      id: 'curriculum-misalignment',
      icon: <CompassEditIcon size={24} color="#C2672D" />,
      title: 'Curriculum Misalignment',
      description:
        'Generalized classroom pacing moves ahead according to a fixed calendar, accidentally leaving fragile concepts unaddressed before new topics begin.',
      result: 'Result: Falling behind silently',
    },
    {
      id: 'unidentified-gaps',
      icon: <KeyGapIcon size={24} color="#C2672D" />,
      title: 'Unidentified Learning Gaps',
      description:
        'Hidden stumbling blocks in prerequisite foundations linger invisible to both learner and educator until major grading periods arrive.',
      result: 'Result: Unclear points of failure',
    },
    {
      id: 'progress-monitoring',
      icon: <BriefcaseClockIcon size={24} color="#C2672D" />,
      title: 'Difficult Progress Monitoring',
      description:
        'Feedback loops take too long. Teachers managing 40+ students per section cannot realistically map out continuous real-time diagnostic pathways manually.',
      result: 'Result: High educator exhaustion',
    },
    {
      id: 'limited-resources',
      icon: <OpenBookIcon size={24} color="#C2672D" />,
      title: 'Limited Resources',
      description:
        'Standard textbooks offer one rigid explanation. Students needing alternative visual, conversational, or scaffolded steps get left without options.',
      result: 'Result: Diminished motivation',
    },
  ];

  return (
    <section id="about" className="kasalig-core-challenge-section">
      <div className="kasalig-container">
        {/* Section Header */}
        <div className="challenge-header-block">
          <span className="section-pill-tag">THE CORE CHALLENGE</span>
          <h2 className="challenge-main-heading">
            Sometimes, students don’t struggle because they don’t try. They struggle because they don’t know where to start.
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="challenge-cards-grid">
          {challenges.map((item) => (
            <div key={item.id} className="challenge-card">
              <div className="challenge-icon-box">
                {item.icon}
              </div>
              <h3 className="challenge-card-title">{item.title}</h3>
              <p className="challenge-card-description">{item.description}</p>
              <div className="challenge-card-result">
                <span>{item.result}</span>
                <ArrowRightIcon size={14} color="#8C3E14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreChallengeSection;

