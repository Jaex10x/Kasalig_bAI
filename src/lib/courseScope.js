/* ---------------------------------------------------------------------------
 * Which saved results belong to which classes. Every graded attempt records the
 * course it was for (courseId for a teacher's quiz, courseCode for a subject
 * diagnostic, both copied onto mastery checks), so a student's pages and a
 * teacher's reports show only the results of the classes in question.
 * ------------------------------------------------------------------------- */

/**
 * Whether an attempt belongs to one of these classes.
 *  courseIds:   Set of course ids (the student's, or one teacher's)
 *  courseCodes: their subject codes, e.g. ['CSIT221']
 * Results from before attempts recorded a course (none of either) belong to no class.
 */
export function attemptInCourses(attempt, courseIds, courseCodes) {
  if (attempt.courseId != null) return courseIds.has(attempt.courseId);
  if (attempt.courseCode) return courseCodes.map((c) => String(c).toUpperCase()).includes(String(attempt.courseCode).toUpperCase());
  return false;
}
