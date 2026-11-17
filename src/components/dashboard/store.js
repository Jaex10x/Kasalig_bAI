/* ---------------------------------------------------------------------------
 * Browser storage for everything the dashboards save, until the backend has
 * endpoints for it:
 *  - kb_student_<id>: one student's quiz history, practice progress, language
 *  - kb_class_data:   teacher quizzes, resources, curriculum coverage and
 *                     intervention notes (shared by every account in this browser,
 *                     so a quiz a teacher publishes shows up for students here)
 * ------------------------------------------------------------------------- */
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import useAuth from '../../context/useAuth';
import { DIAGNOSTIC, questionById } from './curriculum';
import { nextPractice, practiceFor, sampleHistory } from './engine';
import { SEED_CLASSES } from './schoolData';

const cache = new Map();
const listeners = new Map();

function read(key, fallback) {
  if (cache.has(key)) return cache.get(key);
  let value = fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) value = { ...fallback, ...JSON.parse(raw) };
  } catch {
    // Unreadable or blocked storage: start from the fallback.
  }
  cache.set(key, value);
  return value;
}

function write(key, value) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the change still lives for this visit.
  }
  listeners.get(key)?.forEach((fn) => fn());
}

function useLocalState(key, fallback) {
  const subscribe = useCallback(
    (fn) => {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(fn);
      // Another tab changed it: drop the cached copy and re-read.
      const onStorage = (e) => {
        if (e.key === key) {
          cache.delete(key);
          fn();
        }
      };
      window.addEventListener('storage', onStorage);
      return () => {
        listeners.get(key).delete(fn);
        window.removeEventListener('storage', onStorage);
      };
    },
    [key]
  );
  const value = useSyncExternalStore(subscribe, () => read(key, fallback));
  const update = useCallback((fn) => write(key, fn(read(key, fallback))), [key, fallback]);
  return [value, update];
}

/* --- Student --------------------------------------------------------------- */

const STUDENT_DEFAULT = { attempts: [], practice: {}, practiceTotal: 0, activity: [], lang: 'en', recDone: {}, seenChangesOf: null };

export function useStudentData() {
  const { user } = useAuth();
  const [data, update] = useLocalState(`kb_student_${user?.id}`, STUDENT_DEFAULT);

  const actions = useMemo(
    () => ({
      saveAttempt: (attempt) => update((d) => ({ ...d, attempts: [...d.attempts, attempt] })),
      setLang: (lang) => update((d) => ({ ...d, lang })),
      // A recommendation the student finished or opened (e.g. a resource); it drops off the list.
      markRecDone: (key) => update((d) => ({ ...d, recDone: { ...(d.recDone ?? {}), [key]: Date.now() } })),
      undoRecDone: (key) =>
        update((d) => {
          const recDone = { ...(d.recDone ?? {}) };
          delete recDone[key];
          return { ...d, recDone };
        }),
      // The latest result whose "what changed" notice the student has seen.
      markChangesSeen: (attemptId) => update((d) => ({ ...d, seenChangesOf: attemptId })),
      markLessonRead: (topicId, gapKey) =>
        update((d) => ({
          ...d,
          practice: { ...d.practice, [topicId]: { ...practiceFor(d.practice, topicId, gapKey), lessonRead: true } },
        })),
      recordPractice: (topicId, gapKey, correct) =>
        update((d) => ({
          ...d,
          practice: { ...d.practice, [topicId]: nextPractice(practiceFor(d.practice, topicId, gapKey), correct) },
          practiceTotal: (d.practiceTotal ?? 0) + 1,
          activity: [...d.activity.slice(-199), Date.now()],
        })),
      loadSampleHistory: () =>
        update((d) => ({
          ...d,
          attempts: [...sampleHistory(DIAGNOSTIC.questionIds.map(questionById)), ...d.attempts],
        })),
      clearHistory: () => update((d) => ({ ...STUDENT_DEFAULT, lang: d.lang })),
    }),
    [update]
  );

  return { ...data, ...actions };
}

/* --- Class (teacher-owned, visible to students in this browser) ------------- */

const CLASS_DEFAULT = { quizzes: [], resources: [], taught: {}, interventions: {} };
const newId = (p) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function useClassData() {
  const [data, update] = useLocalState('kb_class_data', CLASS_DEFAULT);

  const actions = useMemo(
    () => ({
      saveQuiz: (quiz) =>
        update((d) => {
          const exists = d.quizzes.some((q) => q.id === quiz.id);
          const saved = { ...quiz, id: quiz.id ?? newId('quiz'), updatedAt: Date.now() };
          return {
            ...d,
            quizzes: exists ? d.quizzes.map((q) => (q.id === quiz.id ? saved : q)) : [...d.quizzes, { ...saved, createdAt: Date.now() }],
          };
        }),
      deleteQuiz: (id) => update((d) => ({ ...d, quizzes: d.quizzes.filter((q) => q.id !== id) })),
      setPublished: (id, published) =>
        update((d) => ({ ...d, quizzes: d.quizzes.map((q) => (q.id === id ? { ...q, published, updatedAt: Date.now() } : q)) })),
      addResource: (res) => update((d) => ({ ...d, resources: [...d.resources, { ...res, id: newId('res'), addedAt: Date.now() }] })),
      deleteResource: (id) => update((d) => ({ ...d, resources: d.resources.filter((r) => r.id !== id) })),
      setTaught: (competencyId, taught) => update((d) => ({ ...d, taught: { ...d.taught, [competencyId]: taught } })),
      addIntervention: (studentId, note) =>
        update((d) => ({
          ...d,
          interventions: {
            ...d.interventions,
            [studentId]: [{ ...note, id: newId('note'), createdAt: Date.now() }, ...(d.interventions[studentId] ?? [])],
          },
        })),
      updateIntervention: (studentId, noteId, changes) =>
        update((d) => ({
          ...d,
          interventions: {
            ...d.interventions,
            [studentId]: (d.interventions[studentId] ?? []).map((n) => (n.id === noteId ? { ...n, ...changes } : n)),
          },
        })),
      deleteIntervention: (studentId, noteId) =>
        update((d) => ({
          ...d,
          interventions: { ...d.interventions, [studentId]: (d.interventions[studentId] ?? []).filter((n) => n.id !== noteId) },
        })),
    }),
    [update]
  );

  return { ...data, ...actions, newId };
}

/* --- School (admin-owned): classes and extra subjects ---------------------- */

const SCHOOL_DEFAULT = { classes: SEED_CLASSES, subjects: [] };

export function useSchoolData() {
  const [data, update] = useLocalState('kb_school_data', SCHOOL_DEFAULT);

  const actions = useMemo(
    () => ({
      saveClass: (cls) =>
        update((d) => {
          if (cls.id && d.classes.some((c) => c.id === cls.id)) {
            return { ...d, classes: d.classes.map((c) => (c.id === cls.id ? { ...c, ...cls } : c)) };
          }
          return { ...d, classes: [...d.classes, { ...cls, id: newId('class') }] };
        }),
      deleteClass: (id) => update((d) => ({ ...d, classes: d.classes.filter((c) => c.id !== id) })),
      saveSubject: (subject) =>
        update((d) => {
          if (subject.id && d.subjects.some((s) => s.id === subject.id)) {
            return { ...d, subjects: d.subjects.map((s) => (s.id === subject.id ? { ...s, ...subject } : s)) };
          }
          return { ...d, subjects: [...d.subjects, { ...subject, id: newId('subject') }] };
        }),
      // Removing a subject also takes it off every class that offered it.
      deleteSubject: (id) =>
        update((d) => ({
          ...d,
          subjects: d.subjects.filter((s) => s.id !== id),
          classes: d.classes.map((c) => ({ ...c, subjectIds: c.subjectIds.filter((s) => s !== id) })),
        })),
    }),
    [update]
  );

  return { ...data, ...actions };
}
