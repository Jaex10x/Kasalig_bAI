import { useEffect, useMemo, useState } from 'react';
import {
  achievements,
  learningPath,
  orderGaps,
  overallMastery,
  pathChanges,
  recommendations,
  streaks,
  subjectMastery,
  topicStatus,
} from '../lib/engine';
import { useClassData, useStudentData } from '../store/learningStore';
import { TOPICS, diagnosticsForCourseCodes, topicsForCourseCodes } from '../data/curriculum';
import { attemptInCourses } from '../lib/courseScope';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Counts from 0 up to `target` over `duration` ms (shows the target at once with reduced motion). */
export function useCountUp(target, duration = 900) {
  const [reduced] = useState(prefersReducedMotion);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  return reduced ? target : value;
}

/** "Good morning" / "Good afternoon" / "Good evening" for the visitor's local time. */
export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Everything the student pages show, derived from the saved history: topic status,
 * open gaps, the learning path (rebuilt after every result), mastery, streaks, badges.
 */
export function useStudentProgress() {
  const student = useStudentData();
  const classData = useClassData();
  const { practice, practiceTotal, activity, recDone } = student;

  // Everything is scoped to the classes the student is enrolled in: with no class, every page
  // starts empty, and a course's quizzes, results and gaps appear once they enroll in it.
  const myCourses = useMemo(() => classData.myCourses ?? [], [classData.myCourses]);
  const courseIds = useMemo(() => new Set(myCourses.map((c) => c.id)), [myCourses]);
  const courseCodes = useMemo(() => myCourses.map((c) => c.subjectCode).filter(Boolean), [myCourses]);
  const diagnostics = useMemo(() => diagnosticsForCourseCodes(courseCodes), [courseCodes]);
  const quizzes = useMemo(
    () => classData.quizzes.filter((q) => q.published && q.courseId && courseIds.has(q.courseId)),
    [classData.quizzes, courseIds]
  );
  const attempts = useMemo(
    () => student.attempts.filter((a) => attemptInCourses(a, courseIds, courseCodes)),
    [student.attempts, courseIds, courseCodes]
  );

  const derived = useMemo(() => {
    const status = topicStatus(attempts);
    return {
      status,
      gaps: orderGaps(status),
      path: learningPath(status, practice, classData.resources),
      subjects: subjectMastery(status),
      overall: overallMastery(status),
      streak: streaks(attempts, activity),
      badges: achievements(attempts, practiceTotal ?? 0, activity),
      latest: [...attempts].sort((a, b) => b.takenAt - a.takenAt)[0] ?? null,
    };
  }, [attempts, practice, practiceTotal, activity, classData.resources]);

  // Topics worth showing: their courses' subjects, plus anything they have been tested on.
  const topics = useMemo(() => {
    const mine = new Set(topicsForCourseCodes(courseCodes).map((t) => t.id));
    return TOPICS.filter((t) => mine.has(t.id) || derived.status[t.id]);
  }, [courseCodes, derived.status]);

  // Recommendations: ranked next steps with a reason each, rebuilt after every result.
  const recs = useMemo(
    () => recommendations({ attempts, path: derived.path, quizzes, done: recDone ?? {}, diagnostics, enrolled: myCourses.length }),
    [attempts, derived.path, quizzes, recDone, diagnostics, myCourses.length]
  );
  const changes = useMemo(() => pathChanges(attempts), [attempts]);

  return { student, classData, quizzes, recs, changes, myCourses, diagnostics, topics, attempts, ...derived };
}

export const formatDate = (ms, opts = { day: 'numeric', month: 'short' }) => new Date(ms).toLocaleDateString(undefined, opts);
