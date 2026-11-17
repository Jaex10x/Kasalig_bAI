/* ---------------------------------------------------------------------------
 * The teacher's class. Until the backend returns real rosters, grades and
 * attendance, this sample section is used. Risk scoring works on any student
 * with the same shape.
 * ------------------------------------------------------------------------- */
import { TOPICS } from './curriculum';

export const CLASS_NAME = 'Grade 9 – Sampaguita · Mathematics';

/* scores: latest topic mastery (%); grade: class standing; attendance: % of days present;
   prevQuizAvg: quiz average last grading period, to spot students who are slipping. */
export const CLASS_STUDENTS = [
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

const avg = (nums) => Math.round(nums.reduce((s, n) => s + n, 0) / nums.length);

export const studentById = (id) => CLASS_STUDENTS.find((s) => s.id === Number(id));
export const quizAverage = (s) => avg(TOPICS.map((t) => s.scores[t.id]));
export const topicAverage = (topicId) => avg(CLASS_STUDENTS.map((s) => s.scores[topicId]));
export const classAverage = () => avg(CLASS_STUDENTS.map(quizAverage));

export const PASSING_GRADE = 75; // DepEd passing mark
export const RISK_WEIGHTS = { quiz: 0.45, grade: 0.3, attendance: 0.25 };

/**
 * At-risk check combining quiz mastery, class standing and attendance.
 * The score is a weighted shortfall (0 = no concern); each factor that crosses
 * its line adds a plain-language reason the teacher can act on.
 */
export function riskProfile(s) {
  const quiz = quizAverage(s);
  const reasons = [];
  if (quiz < 60) reasons.push({ factor: 'quiz', text: `Quiz mastery is ${quiz}%` });
  if (s.grade < PASSING_GRADE) reasons.push({ factor: 'grade', text: `Class standing ${s.grade} is below passing (${PASSING_GRADE})` });
  else if (s.grade < 80) reasons.push({ factor: 'grade', text: `Class standing ${s.grade} is close to passing` });
  if (s.attendance < 85) reasons.push({ factor: 'attendance', text: `Attendance is ${s.attendance}%` });
  if (s.prevQuizAvg - quiz >= 8) reasons.push({ factor: 'trend', text: `Quiz average fell ${s.prevQuizAvg - quiz} points` });

  const score = Math.round(
    RISK_WEIGHTS.quiz * (100 - quiz) +
      RISK_WEIGHTS.grade * Math.max(0, 100 - s.grade) +
      RISK_WEIGHTS.attendance * (100 - s.attendance)
  );
  const level = score >= 30 || reasons.length >= 3 ? 'high' : score >= 20 || reasons.length >= 2 ? 'watch' : null;
  const weak = TOPICS.filter((t) => s.scores[t.id] < 50);
  return { quiz, score, level, reasons, weak };
}

export function atRiskStudents() {
  return CLASS_STUDENTS.map((s) => ({ ...s, risk: riskProfile(s) }))
    .filter((s) => s.risk.level)
    .sort((a, b) => b.risk.score - a.risk.score);
}

export const RISK_LABELS = {
  high: { label: 'High risk', color: '#b42318', tint: '#fde2df' },
  watch: { label: 'Watch', color: '#b45309', tint: '#fdecc8' },
};

/** Heatmap cell colour: red (weak) through amber to green (strong). */
export const heatColor = (pct) => {
  if (pct >= 80) return { bg: '#d1f4e4', fg: '#047857' };
  if (pct >= 65) return { bg: '#fdecc8', fg: '#92560e' };
  if (pct >= 50) return { bg: '#fcdcc4', fg: '#9a4515' };
  return { bg: '#f9cdc6', fg: '#a8291c' };
};
