import React from 'react';

export const LearningCycleSection = () => {
  const steps = [
    {
      num: '01',
      badgeColor: '#E67E22',
      title: 'Take an Assessment',
      desc: 'Quick, low-stress adaptive quizzes designed to gauge comprehension rather than enforce pressure.',
    },
    {
      num: '02',
      badgeColor: '#1E293B',
      title: 'Understand Your Mistakes',
      desc: 'Get instant contextual breakdowns. Not just whether you were right, but the cognitive root of the error.',
    },
    {
      num: '03',
      badgeColor: '#8C3E14',
      title: 'Discover Learning Gaps',
      desc: 'Our telemetry maps out missing prerequisite foundations so you know exactly which building block is loose.',
    },
    {
      num: '04',
      badgeColor: '#E67E22',
      title: 'Personalized Recommendations',
      desc: 'Bespoke bite-sized flashcards, micro-videos, and targeted problem sets generated precisely for your gap.',
    },
    {
      num: '05',
      badgeColor: '#1E293B',
      title: 'Practice and Improve',
      desc: 'Engage with gamified recall workouts that reinforce long-term memory through spaced repetition.',
    },
    {
      num: '06',
      badgeColor: '#10B981',
      title: 'Track Your Progress',
      desc: 'Watch your mastery score rise from red to vibrant green with transparent progress analytics.',
    },
  ];

  return (
    <section id="how-it-works" className="kasalig-cycle-modern-section">
      <div className="kasalig-container">
        {/* Top Tag */}
        <div className="cycle-header-wrapper">
          <span className="cycle-pill-tag">CONTINUOUS GROWTH LOOP</span>
          <h2 className="cycle-headline">The 6-Step Learning Cycle</h2>
          <p className="cycle-lead">
            From diagnosing the initial barrier to mastering concepts at your own natural pace.
          </p>
        </div>

        {/* 6 Step Cards Grid */}
        <div className="cycle-grid-modern">
          {steps.map((s) => (
            <div key={s.num} className="cycle-modern-card">
              <div 
                className="step-badge-circle" 
                style={{ backgroundColor: s.badgeColor }}
              >
                {s.num}
              </div>
              <h3 className="cycle-step-title">{s.title}</h3>
              <p className="cycle-step-text">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningCycleSection;
