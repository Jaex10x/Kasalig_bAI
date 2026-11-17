import { useEffect, useMemo, useState } from 'react';
import {
  achievements,
  learningPath,
  orderGaps,
  overallMastery,
  pathChanges,
  recommendations,
  streaks,
  studyReview,
  subjectMastery,
  topicStatus,
} from './engine';
import { useClassData, useStudentData } from './store';

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
  const { attempts, practice, practiceTotal, activity, recDone } = student;

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

  const quizzes = useMemo(() => classData.quizzes.filter((q) => q.published), [classData.quizzes]);

  // Recommendations: ranked next steps with a reason each, rebuilt after every result.
  const recs = useMemo(
    () => recommendations({ attempts, path: derived.path, quizzes, done: recDone ?? {} }),
    [attempts, derived.path, quizzes, recDone]
  );
  const changes = useMemo(() => pathChanges(attempts), [attempts]);
  // Critique of how the student answers and studies, with evidence and advice.
  const review = useMemo(() => studyReview({ attempts, practice, activity }), [attempts, practice, activity]);

  return { student, classData, quizzes, recs, changes, review, ...derived };
}

export const formatDate = (ms, opts = { day: 'numeric', month: 'short' }) => new Date(ms).toLocaleDateString(undefined, opts);
