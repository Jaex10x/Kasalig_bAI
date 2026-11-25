import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import Capybara from '../../components/capybara/Capybara';
import { TOPICS } from '../../data/curriculum';
import { masteryLevel } from '../../lib/engine';
import { RISK_LABELS, atRiskStudents, classAverage, heatColor, pctText, quizAverage, topicAverage } from '../../data/classData';
import { greeting } from '../../hooks/dashboardHooks';
import { useClassData, useClassRoster, useSchoolData } from '../../store/learningStore';
import { Avatar, EmptyState, MasteryRing, SampleNotice } from '../../components/dashboard/DashWidgets';
import { AlertIcon, ArrowIcon, LevelIcon, StarIcon, UserIcon } from '../../components/dashboard/DashIcons';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const school = useSchoolData();
  const { interventions } = useClassData();
  const { students: roster, sample } = useClassRoster();
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'average'

  // The section this teacher advises, if the admin has set one up.
  const section = school.classes.find((c) => c.adviser?.trim().toLowerCase() === user.fullName.trim().toLowerCase());
  const className = section ? `Grade ${section.gradeLevel} – ${section.name}` : 'My class';
  const atRisk = atRiskStudents(roster);
  const avg = classAverage(roster);
  const tested = roster.filter((s) => quizAverage(s) !== null);
  // Weakest first; topics nobody has been tested on go last.
  const topicAverages = TOPICS.map((t) => ({ ...t, avg: topicAverage(roster, t.id) })).sort(
    (a, b) => (a.avg ?? 101) - (b.avg ?? 101)
  );
  const weakest = topicAverages[0].avg !== null ? topicAverages[0] : null;
  const students = [...roster].sort((a, b) =>
    sortBy === 'average' ? (quizAverage(a) ?? 101) - (quizAverage(b) ?? 101) : a.name.localeCompare(b.name)
  );

  return (
    <div className="kd-home">
      <aside className="kd-side">
        <div className="kd-profile">
          <Avatar name={user.fullName} size={42} />
          <div>
            <p className="kd-profile-name">{user.fullName}</p>
            <p className="kd-profile-sub">Teacher · {className}</p>
          </div>
        </div>

        <p className="kd-eyebrow">{greeting()},</p>
        <h1 className="kd-title">Here&rsquo;s your class at a glance.</h1>
        <p className="kd-lede">Which topics the class is stuck on, and who to check in with first.</p>
        {sample && <SampleNotice>Preview mode: a sample class, since there is no backend to load real students from.</SampleNotice>}

        <div className="kd-side-head">
          <h2>At-risk alerts</h2>
          <span className="kd-count is-alert">{atRisk.length}</span>
        </div>
        <p className="kd-muted kd-small kd-risk-explain">
          Combines quiz mastery, open critical gaps, class standing, attendance and recent trend. Enter grades and attendance on each
          student&rsquo;s report.
        </p>
        {atRisk.length === 0 && (
          <p className="kd-muted kd-small">{tested.length ? 'No one is flagged right now.' : 'Alerts appear once students take a quiz.'}</p>
        )}

        <ul className="kd-gap-list">
          {atRisk.map((s, i) => {
            const level = RISK_LABELS[s.risk.level];
            const notes = interventions[s.id]?.length ?? 0;
            return (
              <li key={s.id} className="kd-gap-item" style={{ '--delay': `${i * 70}ms` }}>
                <Avatar name={s.name} size={40} />
                <div className="kd-gap-body">
                  <div className="kd-gap-top">
                    <strong>{s.name}</strong>
                    <span className="kd-chip" style={{ color: level.color, background: level.tint }}>
                      {level.label}
                    </span>
                  </div>
                  <ul className="kd-reason-list">
                    {s.risk.reasons.map((r) => (
                      <li key={r.text}>{r.text}</li>
                    ))}
                  </ul>
                  <Link to={`/dashboard/students/${s.id}`} className="kd-inline-link">
                    {notes ? `Report · ${notes} intervention note${notes === 1 ? '' : 's'}` : 'Open report & log an intervention'} →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="kd-stage kd-stage-teacher">
        <article className="kd-hero">
          <div className="kd-hero-copy">
            <p className="kd-hero-eyebrow">{className} · Mathematics</p>
            <h2 className="kd-hero-title">Class mastery overview</h2>
            <ul className="kd-hero-meta">
              <li>
                <UserIcon size={17} /> {roster.length} students · {tested.length} with results
              </li>
              <li>
                <AlertIcon size={17} /> {atRisk.length} flagged
              </li>
              <li>
                <LevelIcon size={17} /> {masteryLevel(avg).label}
              </li>
            </ul>
            <a href="#kd-heatmap" className="kd-btn kd-btn-accent">
              Open the topic heatmap <ArrowIcon size={18} />
            </a>
          </div>
          <div className="kd-hero-art">
            <svg className="kd-hero-blob" viewBox="0 0 400 360" aria-hidden="true">
              <path d="M300 20c70 30 100 110 80 190s-90 140-180 130S30 270 25 190 70 40 150 20s80-30 150 0z" fill="#de7a40" />
              <path d="M40 300c60-30 90 20 150-10s70-110 140-120" fill="none" stroke="#f6a23c" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="kd-hero-ring">
              <MasteryRing value={avg ?? 0} size={170} label="class average" />
            </div>
          </div>
        </article>

        <Link to="/dashboard/quizzes/new" className="kd-cta">
          <span className="kd-cta-label">{weakest ? `Weakest topic · ${weakest.avg}%` : 'No results yet'}</span>
          <span className="kd-cta-title">{weakest ? `Build a quiz on ${weakest.name}` : 'Build your first quiz'}</span>
          <span className="kd-cta-sub">Tag each question to a competency, or draft some with the generator</span>
          <span className="kd-cta-go" aria-hidden="true">
            <ArrowIcon size={20} />
          </span>
          <span className="kd-cta-capy">
            <Capybara mood="thinking" message="Worth a re-teach?" />
          </span>
        </Link>

        <ul className="kd-topic-list" aria-label="Class average by topic, weakest first">
          {topicAverages.slice(0, 4).map((t, i) => (
            <li key={t.id} style={{ '--delay': `${150 + i * 80}ms` }}>
              <Link to="/dashboard/curriculum" className="kd-topic-row">
                <span className="kd-topic-icon" style={{ '--c': t.color, '--t': t.tint }} aria-hidden="true">
                  <span />
                </span>
                <span className="kd-topic-text">
                  <strong>{t.name}</strong>
                  <small>
                    {t.avg === null
                      ? 'Not tested yet'
                      : `${roster.filter((s) => s.scores[t.id] !== undefined && s.scores[t.id] < 50).length} students below 50%`}
                  </small>
                </span>
                <span className="kd-topic-score">
                  <StarIcon size={20} /> {pctText(t.avg)}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <article className="kd-card kd-heatmap" id="kd-heatmap">
          <header className="kd-card-head">
            <div>
              <h2>Topic heatmap</h2>
              <p>Each cell is one student&rsquo;s mastery of one topic. Click a student for their report.</p>
            </div>
            <div className="kd-segment" role="group" aria-label="Sort students">
              <button type="button" aria-pressed={sortBy === 'name'} onClick={() => setSortBy('name')}>
                A–Z
              </button>
              <button type="button" aria-pressed={sortBy === 'average'} onClick={() => setSortBy('average')}>
                Lowest first
              </button>
            </div>
          </header>

          {roster.length === 0 ? (
            <EmptyState icon="🧑‍🎓" title="No students yet">
              Students appear here as soon as they register. Their scores fill in after their first quiz.
            </EmptyState>
          ) : (
          <div className="kd-heat-scroll">
            <table className="kd-heat-table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  {TOPICS.map((t) => (
                    <th key={t.id} scope="col">{t.name}</th>
                  ))}
                  <th scope="col">Average</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="is-clickable" onClick={() => navigate(`/dashboard/students/${s.id}`)}>
                    <th scope="row">
                      <Link to={`/dashboard/students/${s.id}`} onClick={(e) => e.stopPropagation()}>
                        <Avatar name={s.name} size={28} />
                        {s.name}
                      </Link>
                    </th>
                    {TOPICS.map((t) => {
                      const c = heatColor(s.scores[t.id]);
                      return (
                        <td key={t.id}>
                          <span
                            className="kd-heat-cell"
                            style={{ background: c.bg, color: c.fg }}
                            title={s.scores[t.id] === undefined ? 'Not tested yet' : undefined}
                          >
                            {s.scores[t.id] ?? '—'}
                          </span>
                        </td>
                      );
                    })}
                    <td>
                      <strong className="kd-heat-avg">{pctText(quizAverage(s))}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Class average</th>
                  {TOPICS.map((t) => (
                    <td key={t.id}>
                      <strong className="kd-heat-avg">{pctText(t.avg)}</strong>
                    </td>
                  ))}
                  <td>
                    <strong className="kd-heat-avg">{pctText(avg)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          )}

          <ul className="kd-heat-legend" aria-label="Colour key">
            <li><span style={{ background: '#f9cdc6' }} /> Below 50</li>
            <li><span style={{ background: '#fcdcc4' }} /> 50–64</li>
            <li><span style={{ background: '#fdecc8' }} /> 65–79</li>
            <li><span style={{ background: '#d1f4e4' }} /> 80+</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
