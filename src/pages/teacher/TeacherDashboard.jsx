import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import Capybara from '../../components/capybara/Capybara';
import { masteryLevel } from '../../lib/engine';
import { RISK_LABELS, topicsFor, atRiskStudents, classAverage, heatColor, pctText, quizAverage, topicAverage } from '../../data/classData';
import { greeting } from '../../hooks/dashboardHooks';
import { useClassData, useClassRoster, useSchoolData } from '../../store/learningStore';
import { Avatar, EmptyState, SampleNotice } from '../../components/dashboard/DashWidgets';
import { ArrowIcon } from '../../components/dashboard/DashIcons';

/**
 * Teacher home: class overview. Laid out top to bottom as header, greeting banner, key numbers,
 * then students falling behind beside topic mastery, then the full topic heatmap.
 */
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
  // The classes this teacher's students are enrolled in, e.g. "CSIT221 BSIT-2A".
  const courseCodes = [
    ...new Set(roster.flatMap((s) => (s.courses ?? []).map((c) => [c.subjectCode ?? c.title, c.section].filter(Boolean).join(' ')))),
  ].sort();
  const atRisk = atRiskStudents(roster);
  const avg = classAverage(roster);
  const tested = roster.filter((s) => quizAverage(s) !== null);
  // Only the topics of this class's courses (and anything students were tested on).
  const classTopics = topicsFor(roster);
  const topics = classTopics.map((t) => ({
    ...t,
    avg: topicAverage(roster, t.id),
    below50: roster.filter((s) => s.scores[t.id] !== undefined && s.scores[t.id] < 50).length,
  }));
  // Weakest tested topic; topics nobody has been tested on are left out.
  const weakest = topics.filter((t) => t.avg !== null).sort((a, b) => a.avg - b.avg)[0] ?? null;
  const students = [...roster].sort((a, b) =>
    sortBy === 'average' ? (quizAverage(a) ?? 101) - (quizAverage(b) ?? 101) : a.name.localeCompare(b.name)
  );

  const summary = !tested.length
    ? 'Scores and alerts appear once your students take a quiz.'
    : `${atRisk.length} student${atRisk.length === 1 ? '' : 's'} flagged as at risk.${
        weakest ? ` ${weakest.name} is the weakest topic across the class (${weakest.avg}%).` : ''
      }`;

  return (
    <section className="kd-stage kd-tov">
      {/* Page header */}
      <header className="kd-tov-head">
        <div>
          <h1>Class overview</h1>
          <p>
            {courseCodes.length ? courseCodes.join(' · ') : className} · {roster.length} student{roster.length === 1 ? '' : 's'}
          </p>
        </div>
        <Avatar name={user.fullName} size={42} />
      </header>
      {sample && <SampleNotice>Preview mode: a sample class, since there is no backend to load real students from.</SampleNotice>}

      {/* Greeting banner */}
      <article className="kd-tov-banner">
        <div>
          <h2>
            {greeting()}, {user.fullName}
          </h2>
          <p>{summary}</p>
        </div>
        <Link to="/dashboard/quizzes/new" className="kd-btn kd-btn-accent">
          {weakest ? `Build a quiz on ${weakest.name}` : 'Build your first quiz'} <ArrowIcon size={18} />
        </Link>
      </article>

      {/* Key numbers */}
      <div className="kd-tov-stats">
        <article className="kd-card kd-stat-tile">
          <small>Class average</small>
          <strong>{pctText(avg)}</strong>
          <span className="kd-muted kd-small">{masteryLevel(avg).label}</span>
        </article>
        <article className="kd-card kd-stat-tile">
          <small>Students flagged</small>
          <strong className={atRisk.length ? 'is-alert' : ''}>{atRisk.length}</strong>
          <span className="kd-muted kd-small">Need a check-in</span>
        </article>
        <article className="kd-card kd-stat-tile">
          <small>Students</small>
          <strong>{roster.length}</strong>
          <span className="kd-muted kd-small">{tested.length} with results</span>
        </article>
        <article className="kd-card kd-stat-tile">
          <small>Weakest topic</small>
          <strong>{pctText(weakest?.avg)}</strong>
          <span className="kd-muted kd-small">{weakest ? weakest.name : 'Not tested yet'}</span>
        </article>
      </div>

      <div className="kd-tov-grid">
        {/* Students falling behind */}
        <article className="kd-card kd-tov-risk">
          <header className="kd-card-head">
            <div>
              <h2>
                Students falling behind <span className="kd-count is-alert">{atRisk.length}</span>
              </h2>
              <p>Combines quiz results, grades and attendance. Enter grades and attendance on each student&rsquo;s report.</p>
            </div>
            <Link to="/dashboard/students" className="kd-inline-link kd-tov-link">
              View all students
            </Link>
          </header>

          {atRisk.length === 0 ? (
            <p className="kd-muted kd-small">{tested.length ? 'No one is flagged right now.' : 'Alerts appear once students take a quiz.'}</p>
          ) : (
            <ul className="kd-tov-risk-list">
              {atRisk.map((s, i) => {
                const level = RISK_LABELS[s.risk.level];
                const notes = interventions[s.id]?.length ?? 0;
                return (
                  <li key={s.id} style={{ '--delay': `${i * 60}ms` }}>
                    <Avatar name={s.name} size={38} />
                    <div className="kd-tov-risk-body">
                      <strong>{s.name}</strong>
                      <ul className="kd-reason-list">
                        {s.risk.reasons.map((r) => (
                          <li key={r.text}>{r.text}</li>
                        ))}
                      </ul>
                      {notes > 0 && (
                        <small className="kd-muted">
                          {notes} intervention note{notes === 1 ? '' : 's'}
                        </small>
                      )}
                    </div>
                    <span className="kd-chip" style={{ color: level.color, background: level.tint }}>
                      {level.label}
                    </span>
                    <span className="kd-tov-risk-pct">{pctText(s.risk.quiz)}</span>
                    <Link to={`/dashboard/students/${s.id}`} className="kd-btn kd-btn-ghost kd-btn-sm" aria-label={`View ${s.name}'s report`}>
                      View
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </article>

        <div className="kd-tov-side">
          {/* Topic mastery at a glance */}
          <article className="kd-card">
            <header className="kd-card-head">
              <div>
                <h2>Topic mastery at a glance</h2>
                <p>Class average per topic. Open the curriculum map for details.</p>
              </div>
            </header>
            {topics.length === 0 && (
              <p className="kd-muted kd-small">
                Topics appear once your courses have students. Built-in topics cover CSIT121, CSIT221 and CSIT226; other subjects
                use the topics your quiz questions are tagged with.
              </p>
            )}
            <ul className="kd-tov-bars" aria-label="Class average by topic">
              {topics.map((t) => {
                const c = masteryLevel(t.avg);
                return (
                  <li key={t.id}>
                    <Link
                      to="/dashboard/curriculum"
                      className="kd-tov-bar"
                      title={t.avg === null ? `${t.name}: not tested yet` : `${t.name}: ${t.avg}% · ${t.below50} below 50%`}
                    >
                      <span className="kd-tov-bar-value">{pctText(t.avg)}</span>
                      <span className="kd-tov-bar-track">
                        <span className="kd-tov-bar-fill" style={{ height: `${Math.max(t.avg ?? 0, 4)}%`, background: c.color }} />
                      </span>
                      <span className="kd-tov-bar-label">{t.name}</span>
                      <small>{t.avg === null ? 'Not tested' : `${t.below50} below 50%`}</small>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </article>

          {/* Re-teach suggestion */}
          <Link to="/dashboard/quizzes/new" className="kd-cta kd-tov-cta">
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
        </div>
      </div>

      {/* Full topic heatmap */}
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
            Add the students enrolled in your courses on the Courses page. Their scores fill in after their first quiz.
          </EmptyState>
        ) : (
          <div className="kd-heat-scroll">
            <table className="kd-heat-table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  {classTopics.map((t) => (
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
                    {classTopics.map((t) => {
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
                  {topics.map((t) => (
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
  );
}
