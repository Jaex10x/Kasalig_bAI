import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RISK_LABELS, riskProfile } from '../../data/classData';
import { formatDate } from '../../hooks/dashboardHooks';
import { useClassData, useClassRoster } from '../../store/learningStore';
import { Avatar, LevelChip } from '../../components/dashboard/DashWidgets';
import { ArrowIcon } from '../../components/dashboard/DashIcons';

/** The class roster: risk, grades, attendance and intervention notes, with a report per student. */
export default function TeacherStudents() {
  const { interventions } = useClassData();
  const { students } = useClassRoster();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const rows = students
    .map((s) => ({ ...s, risk: riskProfile(s), notes: interventions[s.id] ?? [] }))
    .filter((s) => (filter === 'risk' ? s.risk.level : true))
    .filter((s) => s.name.toLowerCase().includes(q) || (s.email ?? '').toLowerCase().includes(q))
    // Highest risk first; students with no data at all go last.
    .sort((a, b) => Number(b.risk.hasData) - Number(a.risk.hasData) || b.risk.score - a.risk.score || a.name.localeCompare(b.name));

  return (
    <section className="kd-stage kd-page">
      <header className="kd-page-head">
        <div>
          <p className="kd-eyebrow">Students</p>
          <h1>Class roster</h1>
          <p>Sorted by risk. Open a student for a printable progress report and intervention notes.</p>
        </div>
      </header>

      <article className="kd-card">
        <div className="kd-toolbar">
          <input
            className="kd-input kd-search"
            type="search"
            placeholder="Search students"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search students"
          />
          <div className="kd-segment" role="group" aria-label="Filter students">
            <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
            <button type="button" aria-pressed={filter === 'risk'} onClick={() => setFilter('risk')}>At risk</button>
          </div>
        </div>

        <div className="kd-table-wrap">
          <table className="kd-table">
            <thead>
              <tr>
                <th scope="col">Student</th>
                <th scope="col">Quiz mastery</th>
                <th scope="col">Grade</th>
                <th scope="col">Attendance</th>
                <th scope="col">Last quiz</th>
                <th scope="col">Risk</th>
                <th scope="col">Interventions</th>
                <th scope="col"><span className="kd-sr-only">Report</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const level = RISK_LABELS[s.risk.level];
                const worked = s.notes.filter((n) => n.status === 'worked').length;
                return (
                  <tr key={s.id}>
                    <td>
                      <span className="kd-person">
                        <Avatar name={s.name} size={30} /> <strong>{s.name}</strong>
                      </span>
                    </td>
                    <td>
                      {s.risk.quiz === null ? (
                        <span className="kd-muted">No quiz yet</span>
                      ) : (
                        <>
                          {s.risk.quiz}% <LevelChip pct={s.risk.quiz} />
                        </>
                      )}
                    </td>
                    <td>{s.grade ?? <span className="kd-muted">—</span>}</td>
                    <td>{s.attendance === null ? <span className="kd-muted">—</span> : `${s.attendance}%`}</td>
                    <td>{s.lastActive ? formatDate(s.lastActive) : <span className="kd-muted">—</span>}</td>
                    <td>
                      {level ? (
                        <span className="kd-chip" style={{ color: level.color, background: level.tint }}>
                          {level.label} · {s.risk.score}
                        </span>
                      ) : s.risk.hasData ? (
                        <span className="kd-muted">On track · {s.risk.score}</span>
                      ) : (
                        <span className="kd-muted">No data yet</span>
                      )}
                    </td>
                    <td>{s.notes.length ? `${s.notes.length} (${worked} worked)` : '—'}</td>
                    <td>
                      <Link to={`/dashboard/students/${s.id}`} className="kd-icon-link" aria-label={`Open ${s.name}'s report`}>
                        <ArrowIcon size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <p className="kd-empty">{students.length ? 'No students match.' : 'No students have registered yet.'}</p>
        )}
      </article>
    </section>
  );
}
