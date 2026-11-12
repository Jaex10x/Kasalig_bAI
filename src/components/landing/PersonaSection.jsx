import { CheckCircleIcon } from './Icons';

export const PersonaSection = () => {
  return (
    <section className="kasalig-personas-section">
      <div className="kasalig-container personas-grid">
        {/* Student Persona Card (Light) */}
        <div className="persona-card student-card">
          <blockquote className="persona-headline">
            “Understand your weaknesses. Learn at your own pace. Celebrate every improvement.”
          </blockquote>
          <p className="persona-description">
            No more anxiety about falling behind your classmates. Kasalig bAI creates a
            judgement-free study sanctuary where mistakes become your most useful roadmap.
          </p>

          {/* Embedded Confidence Index Widget */}
          <div className="persona-widget-box">
            <div className="widget-header-row">
              <span className="widget-title">Today’s Confidence Index</span>
              <span className="widget-growth-tag">+14% Growth this week</span>
            </div>
            
            {/* Progress bar */}
            <div className="widget-progress-track">
              <div className="widget-progress-fill" style={{ width: '65%' }}></div>
            </div>

            {/* Sub-metrics */}
            <div className="widget-metrics-row">
              <span className="widget-metric-item">Identified: <strong>3 Topics</strong></span>
              <span className="widget-metric-item">Mastered: <strong>2 Topics</strong></span>
              <span className="widget-metric-item">Next up: <strong>Practice</strong></span>
            </div>
          </div>

          {/* Checklist */}
          <ul className="persona-checklist light-checklist">
            <li className="checklist-item">
              <CheckCircleIcon size={18} color="#8C3E14" />
              <span>Targeted practice drills that take only 10 to 15 minutes a day</span>
            </li>
            <li className="checklist-item">
              <CheckCircleIcon size={18} color="#8C3E14" />
              <span>Clear explanations without confusing jargon or heavy theory</span>
            </li>
            <li className="checklist-item">
              <CheckCircleIcon size={18} color="#8C3E14" />
              <span>Real-time feedback that keeps study sessions productive and encouraging</span>
            </li>
          </ul>
        </div>

        {/* Teacher Persona Card (Dark) */}
        <div className="persona-card teacher-card">
          <blockquote className="persona-headline dark-text">
            “Understand your students better. Identify learning difficulties earlier. Make informed teaching decisions.”
          </blockquote>
          <p className="persona-description dark-subtext">
            Empower your pedagogy with automated diagnostic breakdowns. Gain instant visibility
            into which students require small-group interventions before official examinations.
          </p>

          {/* Checklist */}
          <ul className="persona-checklist dark-checklist">
            <li className="checklist-item">
              <CheckCircleIcon size={18} color="#F59E0B" />
              <span>Automated diagnostic assessments that save hours of grading time</span>
            </li>
            <li className="checklist-item">
              <CheckCircleIcon size={18} color="#F59E0B" />
              <span>Early warning alerts for learners who are starting to slip behind</span>
            </li>
            <li className="checklist-item">
              <CheckCircleIcon size={18} color="#F59E0B" />
              <span>Instant data-backed reporting ready for department reviews</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PersonaSection;

