/* ---------------------------------------------------------------------------
 * BSIT curriculum (2023–2024): every subject with its code, description, units,
 * year level and semester. Teachers pick the subject they teach from here when
 * they create a course; students see the same codes when they enroll.
 *
 * Transcribed from the curriculum checklist. On each year's sheet the left
 * column is taken as the 1st semester and the right column as the 2nd.
 * ------------------------------------------------------------------------- */

export const CURRICULUM = {
  program: 'BS Information Technology',
  code: 'BSIT',
  schoolYear: '2023–2024',
};

const s = (year, semester, code, title, units) => ({ year, semester, code, title, units });

export const SUBJECTS = [
  // First year, 1st semester
  s(1, 1, 'CSIT111', 'Introduction to Computing', 3),
  s(1, 1, 'CSIT121', 'Fundamentals of Programming', 3),
  s(1, 1, 'MATH031', 'Mathematics in the Modern World', 3),
  s(1, 1, 'NSTP111', 'National Service Training Program 1', 3),
  s(1, 1, 'PE103', 'Movement Enhancement / PATHFit 1 Movement Competency Training', 2),
  s(1, 1, 'PHILO031', 'Ethics', 3),
  s(1, 1, 'ENGL031', 'Purposive Communication', 3),
  s(1, 1, 'PSYCH031', 'Understanding the Self', 3),
  // First year, 2nd semester
  s(1, 2, 'CS132', 'Introduction to Computer Systems', 3),
  s(1, 2, 'CSIT112', 'Discrete Structures 1', 3),
  s(1, 2, 'CSIT122', 'Intermediate Programming', 3),
  s(1, 2, 'CSIT201', 'Platform based Development 2 (Web)', 1),
  s(1, 2, 'HUM031', 'Art Appreciation', 3),
  s(1, 2, 'NSTP112', 'National Service Training Program 2', 3),
  s(1, 2, 'PE104', 'Fitness Exercises / PATHFit 2 Exercise based Fitness Activities', 2),
  s(1, 2, 'SOCSCI031', 'Readings in Philippine History', 3),
  s(1, 2, 'STS031', 'Science, Technology and Society', 3),
  // Second year, 1st semester
  s(2, 1, 'CSIT213', 'Social Issues and Professional Practice', 3),
  s(2, 1, 'CSIT221', 'Data Structures and Algorithms', 3),
  s(2, 1, 'CSIT227', 'Object oriented Programming 1', 3),
  s(2, 1, 'IT227', 'Networking 1', 3),
  s(2, 1, 'PE205', 'PATHFIT 1 / PATHFit 3 Menu of Sports, Dance, Recreation and Martial Arts, Group Exercise, Outdoor and Adventure Activities', 2),
  s(2, 1, 'SOCSCI032', 'The Contemporary World', 3),
  s(2, 1, 'CSIT104', 'Platform based Development 1 (Multimedia)', 1),
  s(2, 1, 'GE IT1', 'General Education Elective 1', 3),
  // Second year, 2nd semester
  s(2, 2, 'CSIT212', 'Quantitative Methods', 3),
  s(2, 2, 'CSIT226', 'Information Management 1', 3),
  s(2, 2, 'CSIT228', 'Object oriented Programming 2', 3),
  s(2, 2, 'CSIT238', 'Human Computer Interaction', 3),
  s(2, 2, 'CSIT284', 'Platform based Development 3 (Mobile)', 1),
  s(2, 2, 'GE CCS2', 'General Education Elective 2', 3),
  s(2, 2, 'IT228', 'Networking 2', 3),
  s(2, 2, 'PE206', 'PATHFIT 2 / PATHFit 4 Menu of Sports, Dance, Recreation and Martial Arts, Group Exercise, Outdoor and Adventure Activities', 2),
  // Third year, 1st semester
  s(3, 1, 'CSIT321', 'Applications Development and Emerging Technologies', 3),
  s(3, 1, 'CSIT327', 'Information Management 2', 3),
  s(3, 1, 'CSITELEC1', 'CSIT Elective 1', 3),
  s(3, 1, 'ES038', 'Technopreneurship', 3),
  s(3, 1, 'IT317', 'Project Management for IT', 3),
  s(3, 1, 'IT365', 'Data Analytics 1', 3),
  s(3, 1, 'RIZAL031', 'The Life and Works of Rizal', 3),
  // Third year, 2nd semester
  s(3, 2, 'CSIT385', 'Information Assurance and Security 1', 3),
  s(3, 2, 'CSITELEC2', 'CSIT Elective 2', 3),
  s(3, 2, 'IT332', 'Capstone and Research 1', 3),
  s(3, 2, 'IT334', 'IS Strategy', 3),
  s(3, 2, 'IT342', 'Systems Integration and Architecture 1', 3),
  s(3, 2, 'IT344', 'Systems Administration and Maintenance', 3),
  s(3, 2, 'ITFREEEL1', 'Free Elective 1', 3),
  // Fourth year, 1st semester
  s(4, 1, 'CSITELEC3', 'CSIT Elective 3', 3),
  s(4, 1, 'CSITELEC4', 'CSIT Elective 4', 3),
  s(4, 1, 'GE CCS3', 'General Education Elective 3', 3),
  s(4, 1, 'IT386', 'Information Assurance and Security 2', 3),
  s(4, 1, 'IT411', 'Capstone and Research 2', 3),
  s(4, 1, 'ITFREEEL2', 'Free Elective 2', 3),
  // Fourth year, 2nd semester
  s(4, 2, 'IT412', 'OJT/Practicum', 12),
];

export const subjectByCode = (code) => SUBJECTS.find((x) => x.code === code);

export const YEAR_LABELS = { 1: 'First Year', 2: 'Second Year', 3: 'Third Year', 4: 'Fourth Year' };
export const SEMESTER_LABELS = { 1: '1st Semester', 2: '2nd Semester', 3: 'Summer' };

/** "2nd Year · 1st Sem" style label; empty when neither is known. */
export const termLabel = (year, semester) =>
  [year ? YEAR_LABELS[year] ?? `Year ${year}` : null, semester ? SEMESTER_LABELS[semester] : null].filter(Boolean).join(' · ');

/** The subjects grouped by year and semester, in curriculum order: [{ year, semester, label, subjects }]. */
export const SUBJECT_GROUPS = SUBJECTS.reduce((groups, sub) => {
  const last = groups.at(-1);
  if (last && last.year === sub.year && last.semester === sub.semester) last.subjects.push(sub);
  else groups.push({ year: sub.year, semester: sub.semester, label: termLabel(sub.year, sub.semester), subjects: [sub] });
  return groups;
}, []);

/** How a course is named everywhere: "CSIT221 · Data Structures and Algorithms". */
export const courseLabel = (c) => [c.subjectCode, c.title].filter(Boolean).join(' · ');
