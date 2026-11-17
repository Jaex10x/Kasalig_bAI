/* ---------------------------------------------------------------------------
 * School-wide data for the admin: the sections (classes) and sample results
 * per section, so gap trends across sections and grade levels can be shown
 * before the backend aggregates real results.
 * ------------------------------------------------------------------------- */
import { TOPICS } from './curriculum';

export const GRADE_LEVELS = [7, 8, 9, 10];
export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

/* The teacher dashboard's sample class is the Grade 9 – Sampaguita section. */
export const TEACHER_SECTION_ID = 'g9-sampaguita';

/* Seed classes; the admin can edit, add and remove them. */
export const SEED_CLASSES = [
  { id: 'g9-sampaguita', name: 'Sampaguita', gradeLevel: 9, adviser: 'Maria Santos', subjectIds: ['foundations', 'math9'], studentCount: 10 },
  { id: 'g9-rosal', name: 'Rosal', gradeLevel: 9, adviser: 'Jose Ramirez', subjectIds: ['foundations', 'math9'], studentCount: 38 },
  { id: 'g9-ilang', name: 'Ilang-Ilang', gradeLevel: 9, adviser: 'Liza Fernandez', subjectIds: ['foundations', 'math9'], studentCount: 36 },
  { id: 'g8-narra', name: 'Narra', gradeLevel: 8, adviser: 'Ramon Cruz', subjectIds: ['foundations'], studentCount: 40 },
  { id: 'g8-molave', name: 'Molave', gradeLevel: 8, adviser: 'Ana Dizon', subjectIds: ['foundations'], studentCount: 39 },
  { id: 'g7-rizal', name: 'Rizal', gradeLevel: 7, adviser: 'Carlo Mendoza', subjectIds: ['foundations'], studentCount: 42 },
];

/* Latest topic averages per section, and how much they rose per quarter. Sample data. */
const SECTION_RESULTS = {
  'g9-sampaguita': { trend: 3, base: { linear: 73, factoring: 61, quadratic: 51, roots: 56, exponents: 67, radicals: 64 } },
  'g9-rosal': { trend: 5, base: { linear: 80, factoring: 72, quadratic: 63, roots: 66, exponents: 74, radicals: 70 } },
  'g9-ilang': { trend: -2, base: { linear: 68, factoring: 52, quadratic: 44, roots: 47, exponents: 60, radicals: 55 } },
  'g8-narra': { trend: 4, base: { linear: 71, factoring: 58 } },
  'g8-molave': { trend: 1, base: { linear: 66, factoring: 49 } },
  'g7-rizal': { trend: 6, base: { linear: 62 } },
};

/** Topic averages per quarter for a section, or null if it has no results yet. */
export function sectionResults(sectionId) {
  const r = SECTION_RESULTS[sectionId];
  if (!r) return null;
  const topics = TOPICS.filter((t) => r.base[t.id] !== undefined).map((t, ti) => ({
    id: t.id,
    quarters: QUARTERS.map((_, q) => {
      const wobble = ((ti + q) % 3) - 1; // small, fixed variation so lines are not perfectly straight
      return Math.max(5, Math.min(99, r.base[t.id] - r.trend * (QUARTERS.length - 1 - q) + wobble * 2));
    }),
  }));
  topics.forEach((t) => { t.latest = t.quarters.at(-1); });
  const latestAvg = Math.round(topics.reduce((s, t) => s + t.latest, 0) / topics.length);

  // Share of each gap type: weak foundations push more gaps into "missing prerequisite".
  const foundation = Math.round(((r.base.linear ?? 70) + (r.base.factoring ?? r.base.linear ?? 70)) / 2);
  const prerequisite = Math.max(10, Math.min(55, 100 - foundation - 5));
  const careless = Math.max(12, Math.min(40, Math.round(latestAvg / 3)));
  const concept = 100 - prerequisite - careless;
  return { topics, latestAvg, trend: r.trend, gapMix: { concept, careless, prerequisite } };
}
