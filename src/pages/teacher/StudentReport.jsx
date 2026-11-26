import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { GAP_TYPES, SEVERITIES, competenciesOf } from '../../data/curriculum';
import { learningPath, masteryLevel } from '../../lib/engine';
import { topicsFor, PASSING_GRADE, RISK_LABELS, pctText, riskProfile } from '../../data/classData';
import { formatDate } from '../../hooks/dashboardHooks';
import { useClassData, useClassRoster } from '../../store/learningStore';
import { Avatar, Bar, EmptyState, LevelChip } from '../../components/dashboard/DashWidgets';
import { BackIcon, PrintIcon, TrashIcon } from '../../components/dashboard/DashIcons';

const ACTIONS = ['One-on-one tutoring', 'Remedial worksheet', 'Peer tutoring', 'Parent conference', 'Assigned learning path', 'Other'];
const STATUSES = {
  planned: { label: 'Planned', color: '#475569', tint: '#eef2f6' },
  progress: { label: 'In progress', color: '#b45309', tint: '#fdecc8' },
  worked: { label: 'Worked', color: '#047857', tint: '#d9f5e8' },
  notyet: { label: 'Did not work yet', color: '#b42318', tint: '#fde2df' },
};

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY_NOTE = { date: '', action: ACTIONS[0], notes: '', followUp: '' };

/** A 0-100 number from a form field, null when blank, or undefined when invalid. */
function parsePercent(text) {
  const t = String(text ?? '').trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? Math.round(n * 10) / 10 : undefined;
}

/** Class standing and attendance: not in any quiz, so the teacher enters them for the risk check. */
function StandingForm({ student, onSave }) {
  const [grade, setGrade] = useState(student.grade ?? '');
  const [attendance, setAttendance] = useState(student.attendance ?? '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const g = parsePercent(grade);
    const a = parsePercent(attendance);
    if (g === undefined || a === undefined) {
      setError('Enter numbers from 0 to 100, or leave a field blank.');
      setSaved(false);
      return;
    }
    onSave({ grade: g, attendance: a });
    setError('');
    setSaved(true);
  };

  return (
    <form className="kd-form-grid" onSubmit={submit} noValidate>
      <label className="kd-field">
        <span>Class standing (0–100)</span>
        <input
          className="kd-input"
          inputMode="decimal"
          value={grade}
          onChange={(e) => { setGrade(e.target.value); setSaved(false); }}
          placeholder="e.g. 82"
          aria-invalid={Boolean(error)}
        />
      </label>
      <label className="kd-field">
        <span>Attendance (% of days present)</span>
        <input
          className="kd-input"
          inputMode="decimal"
          value={attendance}
          onChange={(e) => { setAttendance(e.target.value); setSaved(false); }}
          placeholder="e.g. 95"
          aria-invalid={Boolean(error)}
        />
      </label>
      <div className="kd-field-wide">
        {error && <small className="kd-field-error" role="alert">{error}</small>}
        {saved && !error && <small className="kd-muted" role="status">Saved. The risk check uses the new values.</small>}
      </div>
      <div className="kd-field-wide">
        <button type="submit" className="kd-btn kd-btn-dark">Save standing</button>
      </div>
    </form>
  );
}

/** One student's progress report (printable for parent–teacher meetings) and intervention log. */
export default function StudentReport() {
  const { studentId } = useParams();
  const { user } = useAuth();
  const { interventions, resources, addIntervention, updateIntervention, deleteIntervention, setStanding } = useClassData();
  const { students } = useClassRoster();
  const [form, setForm] = useState(() => ({ ...EMPTY_NOTE, date: today() }));
  const [error, setError] = useState('');
  const [preparedOn] = useState(() => Date.now());

  const student = students.find((s) => String(s.id) === studentId);
  if (!student) {
    return (
      <section className="kd-stage kd-page">
        <EmptyState icon="🔎" title="Student not found" action={<Link to="/dashboard/students" className="kd-btn kd-btn-dark">Back to roster</Link>} />
      </section>
    );
  }

  const risk = riskProfile(student);
  const level = RISK_LABELS[risk.level];
  const notes = interventions[student.id] ?? [];
  // The same learning path the student sees, from their own results (gap types come from their answers).
  const plan = learningPath(student.status, {}, resources);
  const score = (t) => student.scores[t.id];
  // This student's topics: their courses' subjects plus anything they were tested on.
  const myTopics = topicsFor([student]);
  const strengths = myTopics.filter((t) => score(t) >= 80);
  const needs = myTopics.filter((t) => score(t) !== undefined && score(t) < 65).sort((a, b) => score(a) - score(b));
  const recent = [...student.attempts].sort((a, b) => b.takenAt - a.takenAt).slice(0, 6);

  const submit = (e) => {
    e.preventDefault();
    if (!form.notes.trim()) {
      setError('Describe what you did, so you can check later whether it worked.');
      return;
    }
    addIntervention(student.id, { ...form, notes: form.notes.trim(), status: 'planned', quizAtTime: risk.quiz, author: user.fullName });
    setForm({ ...EMPTY_NOTE, date: today() });
    setError('');
  };

  return (
    <section className="kd-stage kd-page kd-report">
      <div className="kd-report-actions kd-no-print">
        <Link to="/dashboard/students" className="kd-btn kd-btn-ghost kd-btn-sm">
          <BackIcon size={16} /> Roster
        </Link>
        <button type="button" className="kd-btn kd-btn-dark kd-btn-sm" onClick={() => window.print()}>
          <PrintIcon size={16} /> Print report
        </button>
      </div>

      <article className="kd-card kd-report-sheet">
        <header className="kd-report-head">
          <div className="kd-person">
            <Avatar name={student.name} size={54} />
            <div>
              <p className="kd-eyebrow">Learner progress report</p>
              <h1>{student.name}</h1>
              <p className="kd-muted">
                {[student.program, ...(student.courses ?? []).map((c) => [c.subjectCode ?? c.title, c.section].filter(Boolean).join(' '))].filter(Boolean).join(' · ')} · prepared by {user.fullName} ·{' '}
                {formatDate(preparedOn, { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          {level && (
            <span className="kd-chip kd-chip-lg" style={{ color: level.color, background: level.tint }}>
              {level.label}
            </span>
          )}
        </header>

        <div className="kd-report-stats">
          <div>
            <small>Quiz mastery</small>
            <strong>{pctText(risk.quiz)}</strong>
            {risk.quiz === null ? <span className="kd-muted kd-small">No quiz yet</span> : <LevelChip pct={risk.quiz} />}
          </div>
          <div>
            <small>Class standing</small>
            <strong>{student.grade ?? '—'}</strong>
            <span className="kd-muted kd-small">
              {student.grade === null ? 'Not entered' : student.grade >= PASSING_GRADE ? 'Passing' : `Below ${PASSING_GRADE}`}
            </span>
          </div>
          <div>
            <small>Attendance</small>
            <strong>{pctText(student.attendance)}</strong>
            {student.attendance === null && <span className="kd-muted kd-small">Not entered</span>}
          </div>
        </div>

        <section className="kd-report-section">
          <h2>Mastery by topic</h2>
          <table className="kd-table">
            <thead>
              <tr>
                <th scope="col">Topic</th>
                <th scope="col">Competency</th>
                <th scope="col">Score</th>
                <th scope="col">Level</th>
              </tr>
            </thead>
            <tbody>
              {myTopics.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.name}</strong>
                  </td>
                  <td className="kd-code">{competenciesOf(t.id).map((c) => c.code).join(', ')}</td>
                  <td className="kd-score-cell">
                    <span>{pctText(score(t))}</span>
                    {score(t) !== undefined && <Bar pct={score(t)} />}
                  </td>
                  <td>
                    {score(t) === undefined ? (
                      <span className="kd-chip" style={{ color: masteryLevel(null).color, background: masteryLevel(null).tint }}>
                        {masteryLevel(null).label}
                      </span>
                    ) : (
                      <LevelChip pct={score(t)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="kd-report-cols">
          <section className="kd-report-section">
            <h2>Strengths</h2>
            {strengths.length ? (
              <ul className="kd-plain-list">{strengths.map((t) => <li key={t.id}>{t.name} ({score(t)}%)</li>)}</ul>
            ) : (
              <p className="kd-muted">No topic at mastery (80%) yet.</p>
            )}
          </section>
          <section className="kd-report-section">
            <h2>Needs support</h2>
            {needs.length ? (
              <ul className="kd-plain-list">
                {needs.map((t) => (
                  <li key={t.id}>
                    {t.name} ({score(t)}%)
                    {t.prereqs.some((p) => student.scores[p] !== undefined && student.scores[p] < 60) ? ', start with its prerequisites' : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="kd-muted">Nothing below 65%.</p>
            )}
          </section>
        </div>

        {recent.length > 0 && (
          <section className="kd-report-section">
            <h2>Recent results</h2>
            <table className="kd-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Quiz</th>
                  <th scope="col">Score</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr key={a.id}>
                    <td>{formatDate(a.takenAt, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>
                      {a.title}
                      {a.kind === 'check' && (
                        <span className="kd-muted kd-small"> · {a.passed ? 'passed, gap closed' : 'not passed'}</span>
                      )}
                    </td>
                    <td>
                      {a.correct}/{a.total} ({a.pct}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="kd-report-section">
          <h2>Recommended next steps</h2>
          {plan.length === 0 ? (
            <p className="kd-muted">
              {Object.keys(student.scores).length ? 'No open gaps: every tested topic is at mastery.' : 'No results yet, so no gaps to work on.'}
            </p>
          ) : (
            <ol className="kd-plan">
              {plan.map((item) => {
                const material = [...item.resources].sort((a, b) => Number(Boolean(a.builtIn)) - Number(Boolean(b.builtIn)))[0];
                return (
                  <li key={item.topic.id}>
                    <div className="kd-plan-top">
                      <strong>{item.topic.name}</strong>
                      <span className="kd-chip" style={{ color: GAP_TYPES[item.gap.type].color, background: GAP_TYPES[item.gap.type].tint }}>{GAP_TYPES[item.gap.type].label}</span>
                      <span className="kd-chip" style={{ color: SEVERITIES[item.gap.severity].color, background: SEVERITIES[item.gap.severity].tint }}>{SEVERITIES[item.gap.severity].label}</span>
                      <span className="kd-muted kd-small">{item.pct}%</span>
                    </div>
                    <p>
                      {item.waitingOn.length
                        ? `After ${item.waitingOn.map((t) => t.name).join(' and ')} (its prerequisite): `
                        : 'Start now: '}
                      short lesson, then adaptive practice and a mastery check.
                      {material && ` Material: ${material.title} (${material.builtIn ? material.type.toLowerCase() : 'shared by you'}).`}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {risk.reasons.length > 0 && (
          <section className="kd-report-section">
            <h2>Why this student was flagged</h2>
            <ul className="kd-plain-list">{risk.reasons.map((r) => <li key={r.text}>{r.text}</li>)}</ul>
          </section>
        )}

        <section className="kd-report-section">
          <h2>Interventions</h2>
          {notes.length === 0 ? (
            <p className="kd-muted">No interventions logged yet.</p>
          ) : (
            <ol className="kd-notes">
              {notes.map((n) => {
                const st = STATUSES[n.status] ?? STATUSES.planned;
                return (
                  <li key={n.id}>
                    <div className="kd-note-top">
                      <strong>{n.action}</strong>
                      <span className="kd-muted kd-small">
                        {n.date}
                        {n.followUp ? ` · follow up ${n.followUp}` : ''}
                      </span>
                      <span className="kd-chip kd-print-only" style={{ color: st.color, background: st.tint }}>{st.label}</span>
                    </div>
                    <p>{n.notes}</p>
                    <div className="kd-note-foot kd-no-print">
                      <label>
                        <span className="kd-sr-only">Did it work?</span>
                        <select
                          className="kd-select kd-select-sm"
                          value={n.status}
                          onChange={(e) => updateIntervention(student.id, n.id, { status: e.target.value })}
                          style={{ color: st.color, background: st.tint }}
                        >
                          {Object.entries(STATUSES).map(([id, s]) => (
                            <option key={id} value={id}>{s.label}</option>
                          ))}
                        </select>
                      </label>
                      <span className="kd-muted kd-small">
                        Quiz mastery then: {pctText(n.quizAtTime)} · now {pctText(risk.quiz)}
                      </span>
                      <button
                        type="button"
                        className="kd-icon-btn kd-icon-btn-sm"
                        aria-label="Delete note"
                        onClick={() => window.confirm('Delete this intervention note?') && deleteIntervention(student.id, n.id)}
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <p className="kd-print-only kd-muted kd-small">Generated by Kasalig bAI. Scores reflect the latest diagnostic and quiz results ({masteryLevel(risk.quiz).label}).</p>
      </article>

      <article className="kd-card kd-no-print">
        <header className="kd-card-head">
          <div>
            <h2>Grade and attendance</h2>
            <p>Used with quiz results to flag students who are falling behind. Leave blank if unknown.</p>
          </div>
        </header>
        <StandingForm key={student.id} student={student} onSave={(standing) => setStanding(student.id, standing)} />
      </article>

      <article className="kd-card kd-no-print">
        <header className="kd-card-head">
          <div>
            <h2>Log an intervention</h2>
            <p>Record what you did; mark later whether it worked.</p>
          </div>
        </header>
        <form className="kd-form-grid" onSubmit={submit} noValidate>
          <label className="kd-field">
            <span>Date</span>
            <input className="kd-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label className="kd-field">
            <span>Action</span>
            <select className="kd-select" value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}>
              {ACTIONS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </label>
          <label className="kd-field">
            <span>Follow-up date (optional)</span>
            <input className="kd-input" type="date" value={form.followUp} onChange={(e) => setForm({ ...form, followUp: e.target.value })} />
          </label>
          <label className="kd-field kd-field-wide">
            <span>What did you do?</span>
            <textarea
              className="kd-input kd-textarea"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. 20-minute session on factoring pairs; assigned the learning path for Quadratic Equations."
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'kd-note-error' : undefined}
            />
            {error && <small id="kd-note-error" className="kd-field-error">{error}</small>}
          </label>
          <div className="kd-field-wide">
            <button type="submit" className="kd-btn kd-btn-dark">Save note</button>
          </div>
        </form>
      </article>
    </section>
  );
}
