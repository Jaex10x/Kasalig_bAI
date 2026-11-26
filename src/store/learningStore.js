/* ---------------------------------------------------------------------------
 * Everything the dashboards save, kept on the backend (LearningDataController):
 *  - useStudentData: one student's graded attempts, practice progress, study
 *    days and settings. The gap report, learning path and progress history are
 *    all worked out from these by src/lib/engine.js.
 *  - useClassData:   teacher quizzes, resources, curriculum coverage,
 *                    intervention notes, grades and attendance.
 *  - useSchoolData:  the admin's sections and subjects.
 *  - useClassRoster: every student and their results, for the teacher pages.
 *
 * Changes show at once (optimistic) and are sent to the server in order, one
 * at a time per document. If a save fails, the document is reloaded from the
 * server so the page never shows something that was not saved, and
 * useSyncError() reports it.
 *
 * Preview mode (development only, no backend) keeps the same data in this
 * browser's localStorage instead, and the teacher pages show a sample class.
 * ------------------------------------------------------------------------- */
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import useAuth from '../context/useAuth';
import { nextPractice, practiceFor } from '../lib/engine';
import { SEED_CLASSES } from '../data/schoolData';
import { buildRoster, sampleRoster } from '../data/classData';
import { learningApi } from '../services/learningApi';

/* --- A tiny cache of server documents ------------------------------------- */

const IDLE = Object.freeze({ status: 'idle', value: null, error: null });
const entries = new Map(); // key -> { status: 'idle'|'loading'|'ready'|'error', value, error }
const listeners = new Map(); // key -> Set<fn>
const loaders = new Map(); // key -> the latest load function

const getEntry = (key) => entries.get(key) ?? IDLE;

function setEntry(key, patch) {
  entries.set(key, { ...getEntry(key), ...patch });
  listeners.get(key)?.forEach((fn) => fn());
}

function subscribeTo(key, fn) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
  return () => listeners.get(key)?.delete(fn);
}

const queues = new Map(); // key -> { running, tasks: [{ run, tag }] }: saves waiting to be sent
const refreshing = new Set();
const versions = new Map(); // key -> number of local changes so far
const versionOf = (key) => versions.get(key) ?? 0;
const isSaving = (key) => Boolean(queues.get(key)?.running || queues.get(key)?.tasks.length);

/**
 * Loads a document the first time (or again after an error, when `force`). A document that is
 * already showing is refreshed in the background instead: it stays 'ready', so the page on
 * screen (say, a quiz in progress) is never swapped for a loading state. A refresh never
 * overwrites a local change that is still being saved or was made while it was in flight.
 */
function load(key, force = false) {
  const entry = getEntry(key);
  const loader = loaders.get(key);
  if (!loader) return;

  if (entry.status === 'ready') {
    if (!force || refreshing.has(key) || isSaving(key)) return;
    refreshing.add(key);
    const before = versionOf(key);
    loader()
      .then((value) => {
        if (versionOf(key) === before && !isSaving(key)) setEntry(key, { value });
      })
      .catch(() => setSyncError('Could not reload your data from the server. Refresh the page to try again.'))
      .finally(() => refreshing.delete(key));
    return;
  }
  if (entry.status === 'loading' || (!force && entry.status !== 'idle')) return;
  setEntry(key, { status: 'loading', error: null });
  loader().then(
    (value) => setEntry(key, { status: 'ready', value, error: null }),
    (err) => setEntry(key, { status: 'error', error: err?.message ?? 'Could not load your data.' })
  );
}

/**
 * Subscribes to a document and loads it the first time it is needed. With refreshOnMount, a
 * page that opens also fetches the latest copy in the background (e.g. a teacher opening the
 * class dashboard sees the quiz a student just finished).
 */
function useDoc(key, loader, { refreshOnMount = false } = {}) {
  loaders.set(key, loader);
  const subscribe = useCallback((fn) => subscribeTo(key, fn), [key]);
  const entry = useSyncExternalStore(subscribe, () => getEntry(key));
  useEffect(() => load(key, refreshOnMount && getEntry(key).status === 'ready'), [key, refreshOnMount]);
  return entry;
}

/* --- Saving: optimistic, in order, one request at a time per document ------ */
const syncErrorListeners = new Set();
let syncError = null;

function setSyncError(message) {
  syncError = message;
  syncErrorListeners.forEach((fn) => fn());
}

/** The last save that failed (null when none): { message }. Dismiss with clearSyncError(). */
export function useSyncError() {
  const subscribe = useCallback((fn) => {
    syncErrorListeners.add(fn);
    return () => syncErrorListeners.delete(fn);
  }, []);
  const message = useSyncExternalStore(subscribe, () => syncError);
  return { message, dismiss: () => setSyncError(null) };
}

async function drain(key) {
  const q = queues.get(key);
  if (!q || q.running) return;
  q.running = true;
  let failed = false;
  while (q.tasks.length) {
    const task = q.tasks.shift();
    try {
      await task.run();
    } catch (err) {
      // Drop what is still queued (it was built on the failed change) and reload the truth.
      q.tasks.length = 0;
      failed = true;
      setSyncError(`Your last change was not saved: ${err?.message ?? 'the server did not answer.'}`);
    }
  }
  q.running = false;
  if (failed) load(key, true);
}

/**
 * Applies a change locally, then queues the requests that save it. A task with a `tag` is
 * skipped while an identical one is still waiting: it sends the latest value when it runs, so
 * ten quick practice answers become one or two saves, not ten.
 */
function change(key, apply, tasks) {
  const entry = getEntry(key);
  if (entry.status !== 'ready') return;
  versions.set(key, versionOf(key) + 1);
  setEntry(key, { value: apply(entry.value) });

  if (!queues.has(key)) queues.set(key, { running: false, tasks: [] });
  const q = queues.get(key);
  tasks.forEach((task) => {
    if (task.tag && q.tasks.some((t) => t.tag === task.tag)) return;
    q.tasks.push(task);
  });
  drain(key);
}

const current = (key) => getEntry(key).value;

/* --- Preview mode: the same documents in localStorage --------------------- */

function readLocal(storageKey, fallback) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

/** In preview, every change is one task: write the whole document to localStorage. */
const localSave = (storageKey, key) => [
  {
    tag: 'local',
    run: async () => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(current(key)));
      } catch {
        // Storage full or blocked: the change still lives for this visit.
      }
    },
  },
];

/* --- Shared helpers ---------------------------------------------------------- */

const newId = (p) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/** The pieces every store hook needs: who is signed in, the API and whether this is a preview. */
function useSession() {
  const { user, isPreview, authRequest } = useAuth();
  const api = useMemo(() => learningApi(authRequest), [authRequest]);
  // Keys include the account, so data never carries over from one login to the next.
  const scope = `${user?.role}:${user?.id}${isPreview ? ':preview' : ''}`;
  return { user, isPreview, api, scope };
}

/* --- Student --------------------------------------------------------------- */

const STUDENT_DEFAULT = { attempts: [], practice: {}, practiceTotal: 0, activity: [], lang: 'en', recDone: {}, seenChangesOf: null };

/** The part of the student document that is saved as "state" (attempts are saved one by one). */
const stateOf = (doc) => {
  const state = { ...doc };
  delete state.attempts;
  return state;
};

export function useStudentData() {
  const { user, isPreview, api, scope } = useSession();
  const userId = user?.id;
  const key = `student:${scope}`;
  const storageKey = `kb_student_${userId}`;

  const loader = useCallback(
    () =>
      isPreview
        ? Promise.resolve(readLocal(storageKey, STUDENT_DEFAULT))
        : api.getStudent(userId).then((r) => ({ ...STUDENT_DEFAULT, ...r?.state, attempts: r?.attempts ?? [] })),
    [isPreview, storageKey, api, userId]
  );
  const entry = useDoc(key, loader);

  const actions = useMemo(() => {
    const saveState = isPreview ? localSave(storageKey, key) : [{ tag: 'state', run: () => api.saveState(userId, stateOf(current(key))) }];
    const saveAttempts = (list) => (isPreview ? localSave(storageKey, key) : [{ run: () => api.saveAttempts(userId, list) }]);
    const edit = (apply) => change(key, apply, saveState);

    return {
      saveAttempt: (attempt) => change(key, (d) => ({ ...d, attempts: [...d.attempts, attempt] }), saveAttempts([attempt])),
      setLang: (lang) => edit((d) => ({ ...d, lang })),
      // A recommendation the student finished or opened (e.g. a resource); it drops off the list.
      markRecDone: (recKey) => edit((d) => ({ ...d, recDone: { ...(d.recDone ?? {}), [recKey]: Date.now() } })),
      undoRecDone: (recKey) =>
        edit((d) => {
          const recDone = { ...(d.recDone ?? {}) };
          delete recDone[recKey];
          return { ...d, recDone };
        }),
      // The latest result whose "what changed" notice the student has seen.
      markChangesSeen: (attemptId) => edit((d) => ({ ...d, seenChangesOf: attemptId })),
      markLessonRead: (topicId, gapKey) =>
        edit((d) => ({
          ...d,
          practice: { ...d.practice, [topicId]: { ...practiceFor(d.practice, topicId, gapKey), lessonRead: true } },
        })),
      recordPractice: (topicId, gapKey, correct) =>
        edit((d) => ({
          ...d,
          practice: { ...d.practice, [topicId]: nextPractice(practiceFor(d.practice, topicId, gapKey), correct) },
          practiceTotal: (d.practiceTotal ?? 0) + 1,
          activity: [...d.activity.slice(-199), Date.now()],
        })),
      clearHistory: () =>
        change(
          key,
          (d) => ({ ...STUDENT_DEFAULT, lang: d.lang }),
          isPreview ? localSave(storageKey, key) : [{ run: () => api.resetHistory(userId, stateOf(current(key))) }]
        ),
    };
  }, [key, storageKey, isPreview, api, userId]);

  return { ...STUDENT_DEFAULT, ...entry.value, ...actions, loading: entry.status !== 'ready', error: entry.error };
}

/* --- Class (teachers write; students see published quizzes and resources) -- */

const CLASS_DEFAULT = { quizzes: [], resources: [], taught: {}, interventions: {}, standings: {}, myCourses: [] };

export function useClassData() {
  const { isPreview, api, scope } = useSession();
  const key = `class:${scope}`;
  const storageKey = 'kb_class_data';

  const loader = useCallback(
    () => (isPreview ? Promise.resolve(readLocal(storageKey, CLASS_DEFAULT)) : api.getClass().then((r) => ({ ...CLASS_DEFAULT, ...r }))),
    [isPreview, api]
  );
  // Refreshed when a page opens, so students see a quiz the teacher just published.
  const entry = useDoc(key, loader, { refreshOnMount: !isPreview });

  const actions = useMemo(() => {
    const save = (kind, id, body, studentId) =>
      isPreview ? localSave(storageKey, key) : [{ run: () => api.putClassRecord(kind, id, body, studentId) }];
    const remove = (kind, id) => (isPreview ? localSave(storageKey, key) : [{ run: () => api.deleteClassRecord(kind, id) }]);
    const findNote = (studentId, noteId) => (current(key)?.interventions[studentId] ?? []).find((n) => n.id === noteId);

    return {
      saveQuiz: (quiz) => {
        const d = current(key);
        const exists = d?.quizzes.some((q) => q.id === quiz.id);
        const saved = { ...quiz, id: quiz.id ?? newId('quiz'), updatedAt: Date.now(), ...(exists ? {} : { createdAt: Date.now() }) };
        change(
          key,
          (c) => ({ ...c, quizzes: exists ? c.quizzes.map((q) => (q.id === saved.id ? saved : q)) : [...c.quizzes, saved] }),
          save('quizzes', saved.id, saved)
        );
      },
      deleteQuiz: (id) => change(key, (d) => ({ ...d, quizzes: d.quizzes.filter((q) => q.id !== id) }), remove('quizzes', id)),
      setPublished: (id, published) => {
        const quiz = current(key)?.quizzes.find((q) => q.id === id);
        if (!quiz) return;
        const saved = { ...quiz, published, updatedAt: Date.now() };
        change(key, (d) => ({ ...d, quizzes: d.quizzes.map((q) => (q.id === id ? saved : q)) }), save('quizzes', id, saved));
      },
      addResource: (res) => {
        const saved = { ...res, id: newId('res'), addedAt: Date.now() };
        change(key, (d) => ({ ...d, resources: [...d.resources, saved] }), save('resources', saved.id, saved));
      },
      deleteResource: (id) => change(key, (d) => ({ ...d, resources: d.resources.filter((r) => r.id !== id) }), remove('resources', id)),
      setTaught: (competencyId, taught) =>
        change(
          key,
          (d) => ({ ...d, taught: { ...d.taught, [competencyId]: taught } }),
          taught ? save('taught', competencyId, {}) : remove('taught', competencyId)
        ),
      addIntervention: (studentId, note) => {
        const saved = { ...note, id: newId('note'), createdAt: Date.now() };
        change(
          key,
          (d) => ({ ...d, interventions: { ...d.interventions, [studentId]: [saved, ...(d.interventions[studentId] ?? [])] } }),
          save('interventions', saved.id, saved, studentId)
        );
      },
      updateIntervention: (studentId, noteId, changes) => {
        const note = findNote(studentId, noteId);
        if (!note) return;
        const saved = { ...note, ...changes };
        change(
          key,
          (d) => ({
            ...d,
            interventions: { ...d.interventions, [studentId]: (d.interventions[studentId] ?? []).map((n) => (n.id === noteId ? saved : n)) },
          }),
          save('interventions', noteId, saved, studentId)
        );
      },
      deleteIntervention: (studentId, noteId) =>
        change(
          key,
          (d) => ({
            ...d,
            interventions: { ...d.interventions, [studentId]: (d.interventions[studentId] ?? []).filter((n) => n.id !== noteId) },
          }),
          remove('interventions', noteId)
        ),
      /** A student's class standing (0-100) and attendance (%), entered by the teacher; null clears one. */
      setStanding: (studentId, { grade, attendance }) => {
        const saved = { grade, attendance };
        change(key, (d) => ({ ...d, standings: { ...d.standings, [studentId]: saved } }), save('standings', String(studentId), saved));
      },
    };
  }, [key, isPreview, api]);

  return { ...CLASS_DEFAULT, ...entry.value, ...actions, newId, loading: entry.status !== 'ready', error: entry.error };
}

/* --- School (admin-owned): sections and extra subjects --------------------- */

const SCHOOL_DEFAULT = { classes: SEED_CLASSES, subjects: [] };

export function useSchoolData() {
  const { isPreview, api, scope } = useSession();
  const key = `school:${scope}`;
  const storageKey = 'kb_school_data';

  const loader = useCallback(
    () =>
      isPreview
        ? Promise.resolve(readLocal(storageKey, SCHOOL_DEFAULT))
        : api.getSchool().then((r) => ({ classes: r?.classes ?? [], subjects: r?.subjects ?? [] })),
    [isPreview, api]
  );
  const entry = useDoc(key, loader);

  const actions = useMemo(() => {
    const save = (kind, id, body) => (isPreview ? localSave(storageKey, key) : [{ run: () => api.putSchoolRecord(kind, id, body) }]);
    const remove = (kind, id) => (isPreview ? localSave(storageKey, key) : [{ run: () => api.deleteSchoolRecord(kind, id) }]);
    const upsert = (list, item) => (list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item]);

    return {
      saveClass: (cls) => {
        const existing = cls.id ? current(key)?.classes.find((c) => c.id === cls.id) : null;
        const saved = existing ? { ...existing, ...cls } : { ...cls, id: newId('class') };
        change(key, (d) => ({ ...d, classes: upsert(d.classes, saved) }), save('classes', saved.id, saved));
      },
      deleteClass: (id) => change(key, (d) => ({ ...d, classes: d.classes.filter((c) => c.id !== id) }), remove('classes', id)),
      saveSubject: (subject) => {
        const existing = subject.id ? current(key)?.subjects.find((s) => s.id === subject.id) : null;
        const saved = existing ? { ...existing, ...subject } : { ...subject, id: newId('subject') };
        change(key, (d) => ({ ...d, subjects: upsert(d.subjects, saved) }), save('subjects', saved.id, saved));
      },
      // Removing a subject also takes it off every class that offered it.
      deleteSubject: (id) => {
        const affected = (current(key)?.classes ?? [])
          .filter((c) => c.subjectIds.includes(id))
          .map((c) => ({ ...c, subjectIds: c.subjectIds.filter((s) => s !== id) }));
        const tasks = isPreview
          ? localSave(storageKey, key)
          : [...remove('subjects', id), ...affected.flatMap((c) => save('classes', c.id, c))];
        change(
          key,
          (d) => ({
            ...d,
            subjects: d.subjects.filter((s) => s.id !== id),
            classes: d.classes.map((c) => affected.find((a) => a.id === c.id) ?? c),
          }),
          tasks
        );
      },
    };
  }, [key, isPreview, api]);

  return { ...SCHOOL_DEFAULT, ...entry.value, ...actions, loading: entry.status !== 'ready', error: entry.error };
}

/* --- Class roster (teachers and admins) ------------------------------------ */

/**
 * Every student with their topic scores, gaps, grade and attendance, worked out from their saved
 * results by the same engine the student pages use. Shape: see buildRoster in data/classData.js.
 */
export function useClassRoster() {
  const { isPreview, api, scope } = useSession();
  const key = `roster:${scope}`;
  const loader = useCallback(() => (isPreview ? Promise.resolve(null) : api.getRoster()), [isPreview, api]);
  // Refreshed when a page opens, so the teacher sees results students just submitted.
  const entry = useDoc(key, loader, { refreshOnMount: !isPreview });
  const { standings } = useClassData();

  const students = useMemo(
    () => (isPreview ? sampleRoster(standings) : buildRoster(entry.value ?? [], standings)),
    [isPreview, entry.value, standings]
  );
  return { students, sample: isPreview, loading: entry.status !== 'ready', error: entry.error, reload: () => load(key, true) };
}

/* --- Loading gates for the dashboard ---------------------------------------- */

/**
 * Each role's pages read a fixed set of documents. These load them up front and report
 * { status: 'loading'|'ready'|'error', error, retry }, so the dashboard waits once instead of
 * every page handling a half-loaded state.
 */
function gate(parts) {
  const error = parts.find((p) => p.error)?.error ?? null;
  const status = error ? 'error' : parts.every((p) => !p.loading) ? 'ready' : 'loading';
  // Retry only what failed; anything already loaded stays as it is.
  const retry = () => parts.forEach((p) => p.error && p.retry());
  return { status, error, retry };
}

const retryOf = (name, scope) => () => load(`${name}:${scope}`, true);

export function useStudentGate() {
  const { scope } = useSession();
  const student = useStudentData();
  const cls = useClassData();
  return gate([
    { ...student, retry: retryOf('student', scope) },
    { ...cls, retry: retryOf('class', scope) },
  ]);
}

/** Teachers and admins read the same documents. */
export function useStaffGate() {
  const { scope } = useSession();
  const cls = useClassData();
  const school = useSchoolData();
  const roster = useClassRoster();
  return gate([
    { ...cls, retry: retryOf('class', scope) },
    { ...school, retry: retryOf('school', scope) },
    { ...roster, retry: retryOf('roster', scope) },
  ]);
}
