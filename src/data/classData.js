/* ---------------------------------------------------------------------------
 * The teacher's class: every student's topic scores and gaps (worked out from
 * their saved results by the same engine the student pages use), plus the
 * class standing and attendance the teacher enters. Risk scoring works on any
 * student row, and on whatever of grade, attendance and results is known.
 * ------------------------------------------------------------------------- */
import { TOPICS } from './curriculum';
import { isOpenGap, overallMastery, statusFromScores, topicStatus } from '../lib/engine';

export const CLASS_NAME = 'Mathematics';

const DAY = 86400000;
/** "Since last period": the class compares a student's mastery now with this long ago. */
export const TREND_WINDOW_DAYS = 14;

const avg = (nums) => (nums.length ? Math.round(nums.reduce((s, n) => s + n, 0) / nums.length) : null);

/**
 * One roster row:
 *  { id, name, email, program, attempts, lastActive,
 *    status,       topic status from engine.topicStatus (gaps, type, severity, history)
 *    scores,       { [topicId]: latest % } for the topics the student has been tested on
 *    grade,        class standing 0-100 entered by the teacher, or null
 *    attendance,   % of days present entered by the teacher, or null
 *    prevQuizAvg } mastery TREND_WINDOW_DAYS ago, or null without results from back then
 */
function rowFrom({ id, name, email = null, program = null, attempts = [], status, standing, prevQuizAvg = null }) {
  const scores = {};
  TOPICS.forEach((t) => {
    if (status[t.id]) scores[t.id] = status[t.id].pct;
  });
  return {
    id,
    name,
    email,
    program,
    attempts,
    lastActive: attempts.length ? Math.max(...attempts.map((a) => a.takenAt)) : null,
    status,
    scores,
    grade: standing?.grade ?? null,
    attendance: standing?.attendance ?? null,
    prevQuizAvg,
  };
}

/** Roster rows from the backend's /api/learning/roster and the teacher's standings. */
export function buildRoster(students, standings = {}) {
  const cutoff = Date.now() - TREND_WINDOW_DAYS * DAY;
  return students.map((s) => {
    const attempts = s.attempts ?? [];
    const before = attempts.filter((a) => a.takenAt <= cutoff);
    // Only a trend when there are results from back then and newer ones to compare with.
    const prevQuizAvg = before.length && before.length < attempts.length ? overallMastery(topicStatus(before)) : null;
    return rowFrom({
      id: s.id,
      name: s.fullName || s.email || `Student ${s.id}`,
      email: s.email,
      program: s.program,
      attempts,
      status: topicStatus(attempts),
      standing: standings[s.id],
      prevQuizAvg,
    });
  });
}

/* --- Sample class (preview mode only, when there is no backend) ------------ */

const SAMPLE_STUDENTS = [
  { id: 1, name: 'Andrea Cruz', grade: 92, attendance: 98, prevQuizAvg: 84, scores: { linear: 92, factoring: 88, quadratic: 78, roots: 82, exponents: 88, radicals: 85 } },
  { id: 2, name: 'Miguel Santos', grade: 77, attendance: 86, prevQuizAvg: 66, scores: { linear: 70, factoring: 48, quadratic: 35, roots: 40, exponents: 61, radicals: 52 } },
  { id: 3, name: 'Bea Villanueva', grade: 88, attendance: 95, prevQuizAvg: 78, scores: { linear: 88, factoring: 75, quadratic: 64, roots: 70, exponents: 90, radicals: 71 } },
  { id: 4, name: 'Paolo Reyes', grade: 71, attendance: 74, prevQuizAvg: 52, scores: { linear: 45, factoring: 30, quadratic: 22, roots: 25, exponents: 40, radicals: 38 } },
  { id: 5, name: 'Kyla Mendoza', grade: 95, attendance: 100, prevQuizAvg: 88, scores: { linear: 95, factoring: 90, quadratic: 82, roots: 86, exponents: 86, radicals: 90 } },
  { id: 6, name: 'Jerome Bautista', grade: 79, attendance: 83, prevQuizAvg: 68, scores: { linear: 66, factoring: 55, quadratic: 41, roots: 50, exponents: 47, radicals: 58 } },
  { id: 7, name: 'Trisha Gonzales', grade: 85, attendance: 93, prevQuizAvg: 74, scores: { linear: 80, factoring: 72, quadratic: 55, roots: 62, exponents: 72, radicals: 77 } },
  { id: 8, name: 'Carlo Ramos', grade: 74, attendance: 80, prevQuizAvg: 61, scores: { linear: 58, factoring: 42, quadratic: 30, roots: 36, exponents: 63, radicals: 44 } },
  { id: 9, name: 'Nicole Aquino', grade: 86, attendance: 97, prevQuizAvg: 79, scores: { linear: 84, factoring: 80, quadratic: 69, roots: 66, exponents: 79, radicals: 62 } },
  { id: 10, name: 'Renz Navarro', grade: 80, attendance: 90, prevQuizAvg: 75, scores: { linear: 73, factoring: 60, quadratic: 48, roots: 52, exponents: 54, radicals: 61 } },
];

/** The sample section as roster rows. Standings the teacher edits in preview override the sample. */
export function sampleRoster(standings = {}) {
  return SAMPLE_STUDENTS.map((s) =>
    rowFrom({
      id: s.id,
      name: s.name,
      status: statusFromScores(s.scores),
      standing: standings[s.id] ?? { grade: s.grade, attendance: s.attendance },
      prevQuizAvg: s.prevQuizAvg,
    })
  );
}

/* --- Averages (null when nothing has been tested) --------------------------- */

export const quizAverage = (s) => avg(Object.values(s.scores));
export const topicAverage = (students, topicId) =>
  avg(students.map((s) => s.scores[topicId]).filter((v) => v !== undefined));
export const classAverage = (students) => avg(students.map(quizAverage).filter((v) => v !== null));

/* --- At-risk alerts ---------------------------------------------------------- */

export const PASSING_GRADE = 75; // DepEd passing mark
export const RISK_WEIGHTS = { quiz: 0.45, grade: 0.3, attendance: 0.25 };

/**
 * At-risk check combining quiz mastery, open gaps, class standing and attendance.
 * The score is a weighted shortfall (0 = no concern) over the factors that are known; each
 * factor that crosses its line adds a plain-language reason the teacher can act on.
 */
export function riskProfile(s) {
  const quiz = quizAverage(s);
  const reasons = [];
  const critical = TOPICS.filter((t) => isOpenGap(s.status?.[t.id]) && s.status[t.id].gap.severity === 'critical');

  if (quiz !== null && quiz < 60) reasons.push({ factor: 'quiz', text: `Quiz mastery is ${quiz}%` });
  if (critical.length) {
    reasons.push({
      factor: 'gaps',
      text: `${critical.length} critical gap${critical.length === 1 ? '' : 's'} open: ${critical.map((t) => t.name).join(', ')}`,
    });
  }
  if (s.grade !== null) {
    if (s.grade < PASSING_GRADE) reasons.push({ factor: 'grade', text: `Class standing ${s.grade} is below passing (${PASSING_GRADE})` });
    else if (s.grade < 80) reasons.push({ factor: 'grade', text: `Class standing ${s.grade} is close to passing` });
  }
  if (s.attendance !== null && s.attendance < 85) reasons.push({ factor: 'attendance', text: `Attendance is ${s.attendance}%` });
  if (quiz !== null && s.prevQuizAvg !== null && s.prevQuizAvg - quiz >= 8) {
    reasons.push({ factor: 'trend', text: `Quiz average fell ${s.prevQuizAvg - quiz} points` });
  }

  // Weighted shortfall, re-weighted over the factors that are known.
  const factors = [
    [RISK_WEIGHTS.quiz, quiz],
    [RISK_WEIGHTS.grade, s.grade],
    [RISK_WEIGHTS.attendance, s.attendance],
  ].filter(([, v]) => v !== null);
  const weight = factors.reduce((sum, [w]) => sum + w, 0);
  const score = weight ? Math.round(factors.reduce((sum, [w, v]) => sum + w * Math.max(0, 100 - v), 0) / weight) : 0;

  const level = !factors.length ? null : score >= 30 || reasons.length >= 3 ? 'high' : score >= 20 || reasons.length >= 2 ? 'watch' : null;
  const weak = TOPICS.filter((t) => s.scores[t.id] !== undefined && s.scores[t.id] < 50);
  return { quiz, score, level, reasons, weak, hasData: factors.length > 0 };
}

export function atRiskStudents(students) {
  return students
    .map((s) => ({ ...s, risk: riskProfile(s) }))
    .filter((s) => s.risk.level)
    .sort((a, b) => b.risk.score - a.risk.score);
}

export const RISK_LABELS = {
  high: { label: 'High risk', color: '#b42318', tint: '#fde2df' },
  watch: { label: 'Watch', color: '#b45309', tint: '#fdecc8' },
};

/** Heatmap cell colour: red (weak) through amber to green (strong); grey when not tested. */
export const heatColor = (pct) => {
  if (pct === null || pct === undefined) return { bg: '#f3ece3', fg: '#8a7a6c' };
  if (pct >= 80) return { bg: '#d1f4e4', fg: '#047857' };
  if (pct >= 65) return { bg: '#fdecc8', fg: '#92560e' };
  if (pct >= 50) return { bg: '#fcdcc4', fg: '#9a4515' };
  return { bg: '#f9cdc6', fg: '#a8291c' };
};

/** "42%" or "—" when there is no score yet. */
export const pctText = (v) => (v === null || v === undefined ? '—' : `${v}%`);
