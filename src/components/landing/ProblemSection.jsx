import { CompassIcon, SearchIcon, BarChartIcon, PackageIcon } from './Icons';

export const ProblemSection = () => {
  const problems = [
    {
      num: 'CHALLENGE #01',
      title: 'Curriculum Misalignment',
      icon: <CompassIcon size={24} color="#C2672D" />,
      desc: 'Standard curricula move at one uniform speed, ignoring prerequisites student groups may have missed semesters ago.',
    },
    {
      num: 'CHALLENGE #02',
      title: 'Unidentified Gaps',
      icon: <SearchIcon size={24} color="#C2672D" />,
      desc: 'Small misunderstandings in foundational ideas snowball into overwhelming anxiety when tackling advanced lessons.',
    },
    {
      num: 'CHALLENGE #03',
      title: 'Difficult Progress Monitoring',
      icon: <BarChartIcon size={24} color="#C2672D" />,
      desc: 'Teachers with 40+ students per class cannot generate individual qualitative diagnostic reports manually every week.',
    },
    {
      num: 'CHALLENGE #04',
      title: 'Limited Resources',
      icon: <PackageIcon size={24} color="#C2672D" />,
      desc: 'Quality personalized 1-on-1 tutoring is too expensive for most families. Kasalig bridges this gap with adaptive AI.',
    },
  ];

  return (
    <section id="about" className="kasalig-problem-section">
      <div className="kasalig-container">
        {/* Section Pill Badge */}
        <div className="problem-pill-tag">THE PROBLEM WE'RE SOLVING</div>

        {/* Big Quote Headline */}
        <h2 className="problem-quote-heading">
          “Sometimes, students don’t struggle because they don’t try. They struggle because they don’t know where to start.”
        </h2>

        {/* Subtitle */}
        <p className="problem-sub-desc">
          Traditional tests tell you what grade you got. Kasalig AI shows you the precise micro-concept that needs healing.
        </p>

        {/* 4 Challenge Cards Grid */}
        <div className="problem-cards-row">
          {problems.map((p) => (
            <div key={p.num} className="problem-item-card">
              <div className="problem-icon-circle">{p.icon}</div>
              <h3 className="problem-item-title">{p.title}</h3>
              <p className="problem-item-body">{p.desc}</p>
              <span className="problem-challenge-number">{p.num}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

