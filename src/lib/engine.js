/* ---------------------------------------------------------------------------
 * The rules behind gap detection, learning paths, adaptive practice and
 * achievements. Pure functions over plain data, so they can move to the
 * backend later unchanged.
 * ------------------------------------------------------------------------- */
import {
  BUILT_IN_MATERIALS,
  GAP_TYPES,
  QUESTION_BANK,
  SEVERITIES,
  SUBJECTS,
  TOPICS,
  competencyById,
  topicById,
  topicsOf,
} from '../data/curriculum';
import { canGenerate, generateQuestion } from './generators';

export const MASTERY = 80; // a topic at or above this has no gap
export const PREREQ_WEAK = 60; // a prerequisite below this is "missing"
export const RUSHED_MS = 4000; // a wrong answer faster than this looks careless
export const CHECK_SIZE = 4;
export const CHECK_PASS = 3; // correct answers needed to close a gap

/** Mastery band for a percentage. */
export const masteryLevel = (score) => {
  if (score === null || score === undefined) return { id: 'untested', label: 'Not tested', color: '#8a7a6c', tint: '#f3ece3' };
  if (score >= MASTERY) return { id: 'mastered', label: 'Mastered', color: '#047857', tint: '#d9f5e8' };
  if (score >= 50) return { id: 'developing', label: 'Developing', color: '#b45309', tint: '#fdecc8' };
  return { id: 'gap', label: 'Needs work', color: '#b42318', tint: '#fde2df' };
};

/* --- Answers --------------------------------------------------------------- */

/** Loose text form of an answer: case, spaces and "x =" don't matter; "root"/"sqrt" mean √. */
export const normalize = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/sqrt|root/g, '√')
    .replace(/[\s·*]/g, '')
    .replace(/^x=/, '')
    .replace(/\.$/, '');

/** Is a response right, and if not, which error does it point to? */
export function checkAnswer(q, response) {
  if (q.type === 'mc') {
    const opt = q.options[response];
    return { correct: Boolean(opt?.correct), error: opt?.correct ? null : opt?.error ?? 'concept' };
  }
  if (q.type === 'tf') {
    const correct = response === q.answer;
    return { correct, error: correct ? null : 'concept' };
  }
  const n = normalize(response);
  const correct = n !== '' && q.accept.some((a) => normalize(a) === n);
  if (correct) return { correct, error: null };
  const trap = q.traps?.find((t) => normalize(t.match) === n);
  return { correct: false, error: trap?.error ?? 'concept', trapped: Boolean(trap) };
}

/** Free-text check used by the tutor: numbers in any order, true/false in three languages. */
export function looseMatch(q, text) {
  if (q.type === 'tf') {
    const t = normalize(text);
    const yes = ['true', 'tama', 'oo', 'sakto', 'yes', 't'];
    const no = ['false', 'mali', 'hindi', 'sayop', 'dili', 'no', 'f'];
    if (yes.includes(t)) return q.answer === true;
    if (no.includes(t)) return q.answer === false;
    return false;
  }
  if (q.type === 'id') return checkAnswer(q, text).correct;
  const right = q.options.find((o) => o.correct).text;
  const nums = (s) => (normalize(s).match(/-?\d+(\.\d+)?(√\d+)?/g) ?? []).sort().join('|');
  if (nums(right) && nums(text)) return nums(right) === nums(text);
  return normalize(text).includes(normalize(right));
}

export const answerText = (q, response) => {
  if (response === undefined || response === null || response === '') return '—';
  if (q.type === 'mc') return q.options[response]?.text ?? '—';
  if (q.type === 'tf') return response ? 'True' : 'False';
  return String(response);
};

export const correctText = (q) => {
  if (q.type === 'mc') return q.options.find((o) => o.correct)?.text ?? '';
  if (q.type === 'tf') return q.answer ? 'True' : 'False';
  return q.accept[0];
};

export const hasAnswer = (q, response) =>
  q.type === 'id' ? String(response ?? '').trim() !== '' : response !== undefined && response !== null;

/* --- Grading and gap detection --------------------------------------------- */

const BASE_REASON = {
  concept: 'This answer comes from a common misunderstanding of the rule.',
  careless: 'This answer looks like a slip: a sign or a last step went wrong.',
  prerequisite: 'This answer comes from a mistake in an earlier skill.',
};

const pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);

export function severityFor(score, type) {
  const s = score < 40 ? 'critical' : score < 65 ? 'moderate' : 'mild';
  return type === 'careless' && s === 'critical' ? 'moderate' : s;
}

const GAP_SUMMARY = {
  concept: (t) => `The core idea of ${t} is not clicking yet, so the same kind of mistake repeats.`,
  careless: (t) => `You know ${t}, but small slips cost you points. Slowing down will fix most of it.`,
  prerequisite: (t, pre) => `${t} is hard right now because ${pre} needs work first.`,
};

/**
 * Grade a finished quiz or mastery check.
 *  questions: the questions shown, in order
 *  responses: { [questionId]: { value, ms } }
 *  prior: the student's topic status before this attempt (for prerequisite scores)
 */
export function gradeAttempt({ quiz, questions, responses, kind = 'quiz', topicId = null, prior = {} }) {
  const checked = questions.map((q) => {
    const r = responses[q.id] ?? {};
    return { q, value: r.value, ms: r.ms ?? 0, ...checkAnswer(q, r.value) };
  });

  const topicScores = {};
  checked.forEach(({ q, correct }) => {
    const t = (topicScores[q.topicId] ??= { id: q.topicId, correct: 0, total: 0 });
    t.total += 1;
    if (correct) t.correct += 1;
  });
  Object.values(topicScores).forEach((t) => { t.pct = pct(t.correct, t.total); });

  // Score of a prerequisite: from this attempt if it was tested, otherwise the latest known.
  const prereqScore = (id) => topicScores[id]?.pct ?? prior[id]?.pct ?? null;

  const items = checked.map(({ q, value, ms, correct, error }) => {
    let type = error;
    const reasons = [];
    if (!correct) {
      reasons.push(BASE_REASON[error]);
      const weakPre = (topicById(q.topicId)?.prereqs ?? [])
        .map((id) => ({ id, score: prereqScore(id) }))
        .filter((p) => p.score !== null && p.score < PREREQ_WEAK);
      const harderRight = checked.some(
        (o) => o.q.id !== q.id && o.correct && o.q.competencyId === q.competencyId && o.q.difficulty >= q.difficulty
      );
      if (weakPre.length) {
        type = 'prerequisite';
        weakPre.forEach((p) => reasons.push(`${topicById(p.id).name}, a prerequisite, is at ${p.score}%.`));
      } else if (ms > 0 && ms < RUSHED_MS && type !== 'prerequisite') {
        type = 'careless';
        reasons.push(`Answered in ${Math.max(1, Math.round(ms / 1000))} s, faster than the working takes.`);
      } else if (harderRight && type === 'concept') {
        type = 'careless';
        reasons.push('You got an equal or harder question on this skill right.');
      }
    }
    return {
      questionId: q.id,
      type: q.type,
      prompt: q.prompt,
      topicId: q.topicId,
      competencyId: q.competencyId,
      difficulty: q.difficulty,
      response: answerText(q, value),
      correctAnswer: correctText(q),
      correct,
      error: correct ? null : type,
      reasons,
      explanation: q.explanation,
      ms,
    };
  });

  const topics = Object.values(topicScores);
  const gaps = topics
    .filter((t) => t.pct < MASTERY)
    .map((t) => {
      const misses = items.filter((i) => i.topicId === t.id && !i.correct);
      const counts = { concept: 0, careless: 0, prerequisite: 0 };
      misses.forEach((m) => { counts[m.error] += 1; });
      const type = counts.prerequisite ? 'prerequisite' : counts.careless > counts.concept ? 'careless' : 'concept';
      const name = topicById(t.id).name;
      const weakPre = (topicById(t.id).prereqs ?? []).filter((id) => (prereqScore(id) ?? 100) < PREREQ_WEAK);
      return {
        topicId: t.id,
        type,
        severity: severityFor(t.pct, type),
        pct: t.pct,
        misses: misses.length,
        prereqs: weakPre,
        summary: GAP_SUMMARY[type](name, weakPre.map((id) => topicById(id).name).join(' and ') || 'an earlier skill'),
        reasons: [...new Set(misses.flatMap((m) => m.reasons))],
        competencies: [...new Set(misses.map((m) => m.competencyId))],
      };
    })
    .sort((a, b) => SEVERITIES[a.severity].rank - SEVERITIES[b.severity].rank || a.pct - b.pct);

  const compScores = {};
  items.forEach((i) => {
    const c = (compScores[i.competencyId] ??= { id: i.competencyId, correct: 0, total: 0 });
    c.total += 1;
    if (i.correct) c.correct += 1;
  });

  const correct = items.filter((i) => i.correct).length;
  return {
    id: `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    kind,
    // The class this result belongs to: a teacher quiz's course, or a diagnostic's subject code.
    courseId: quiz?.courseId ?? null,
    courseCode: quiz?.courseCode ?? null,
    quizId: quiz?.id ?? null,
    title: quiz?.title ?? (topicId ? `Mastery check: ${topicById(topicId).name}` : 'Quiz'),
    topicId,
    takenAt: Date.now(),
    correct,
    total: items.length,
    pct: pct(correct, items.length),
    passed: kind === 'check' ? correct >= CHECK_PASS : undefined,
    items,
    topics,
    competencies: Object.values(compScores).map((c) => ({ ...c, pct: pct(c.correct, c.total) })),
    gaps,
  };
}

/* --- Where the student stands now ------------------------------------------ */

/**
 * The latest state of every tested topic, replaying attempts in order:
 * a quiz sets the score and (re)opens a gap; a passed mastery check closes it.
 */
export function topicStatus(attempts) {
  const status = {};
  [...attempts].sort((a, b) => a.takenAt - b.takenAt).forEach((att) => {
    att.topics.forEach((t) => {
      const prev = status[t.id];
      const history = [...(prev?.history ?? []), { takenAt: att.takenAt, pct: t.pct, kind: att.kind, attemptId: att.id }];
      if (att.kind === 'check') {
        if (att.passed) {
          status[t.id] = { ...prev, pct: t.pct, closed: Boolean(prev?.gap), closedAt: att.takenAt, history };
        } else {
          status[t.id] = { ...(prev ?? { pct: t.pct, gap: null }), lastCheck: { takenAt: att.takenAt, pct: t.pct }, history };
        }
      } else {
        const gap = att.gaps.find((g) => g.topicId === t.id) ?? null;
        status[t.id] = { pct: t.pct, gap: gap && { ...gap, attemptId: att.id, openedAt: att.takenAt }, closed: false, history };
      }
    });
  });
  return status;
}

export const isOpenGap = (s) => Boolean(s?.gap) && !s.closed;

/** Subject mastery: the average of the tested topics in that subject. */
export function subjectMastery(status) {
  return SUBJECTS.map((s) => {
    const tested = topicsOf(s.id).filter((t) => status[t.id]);
    const value = tested.length ? Math.round(tested.reduce((sum, t) => sum + status[t.id].pct, 0) / tested.length) : null;
    return { ...s, value, tested: tested.length, total: topicsOf(s.id).length };
  });
}

export function overallMastery(status) {
  const tested = TOPICS.filter((t) => status[t.id]);
  return tested.length ? Math.round(tested.reduce((sum, t) => sum + status[t.id].pct, 0) / tested.length) : 0;
}

/* --- Learning path --------------------------------------------------------- */

export const PRACTICE_GOAL = 4; // correct answers at Medium or harder

const blankPractice = (gapKey) => ({ gapKey, level: 1, up: 0, down: 0, answered: 0, correct: 0, goal: 0, lessonRead: false, done: false });

/** Practice progress for a gap. It starts over when a newer quiz reopens the gap. */
export function practiceFor(practice, topicId, gapKey) {
  const p = practice?.[topicId];
  return p && p.gapKey === gapKey ? p : blankPractice(gapKey);
}

/** Adaptive difficulty: two right in a row goes up a level, two wrong goes down. */
export function nextPractice(p, correct) {
  const n = { ...p, answered: p.answered + 1, correct: p.correct + (correct ? 1 : 0) };
  if (correct) {
    n.up = p.up + 1;
    n.down = 0;
    if (p.level >= 2) n.goal = p.goal + 1;
    if (n.up >= 2 && p.level < 3) { n.level = p.level + 1; n.up = 0; }
  } else {
    n.down = p.down + 1;
    n.up = 0;
    if (n.down >= 2 && p.level > 1) { n.level = p.level - 1; n.down = 0; }
  }
  n.done = p.done || n.goal >= PRACTICE_GOAL;
  return n;
}

/** Open gaps in study order: prerequisites first, then by severity, then by score. */
export function orderGaps(status) {
  const open = TOPICS.filter((t) => isOpenGap(status[t.id]));
  const openIds = new Set(open.map((t) => t.id));
  const depth = (id, seen = new Set()) => {
    if (seen.has(id)) return 0;
    seen.add(id);
    const pres = topicById(id).prereqs.filter((p) => openIds.has(p));
    return pres.length ? 1 + Math.max(...pres.map((p) => depth(p, seen))) : 0;
  };
  return open
    .map((t) => ({ topic: t, status: status[t.id], depth: depth(t.id) }))
    .sort(
      (a, b) =>
        a.depth - b.depth ||
        SEVERITIES[a.status.gap.severity].rank - SEVERITIES[b.status.gap.severity].rank ||
        a.status.pct - b.status.pct
    );
}

/** The personalized learning path, rebuilt from the latest results every time. */
export function learningPath(status, practice, resources = []) {
  const ordered = orderGaps(status);
  const openIds = new Set(ordered.map((o) => o.topic.id));
  return ordered.map(({ topic, status: s }) => {
    const p = practiceFor(practice, topic.id, s.gap.attemptId);
    const waitingOn = topic.prereqs.filter((id) => openIds.has(id)).map(topicById);
    const teacherRes = resources.filter((r) => r.topicId === topic.id);
    const steps = [
      { id: 'lesson', label: 'Short lesson', done: p.lessonRead },
      { id: 'practice', label: 'Adaptive practice', done: p.done },
      { id: 'check', label: 'Mastery check', done: false, locked: !p.done || waitingOn.length > 0 },
    ];
    return {
      topic,
      gap: s.gap,
      pct: s.pct,
      practice: p,
      waitingOn,
      lastCheck: s.lastCheck && s.lastCheck.takenAt > s.gap.openedAt ? s.lastCheck : null,
      resources: [...teacherRes, ...(BUILT_IN_MATERIALS[topic.id] ?? []).map((m) => ({ ...m, builtIn: true }))],
      steps,
      next: steps.find((st) => !st.done),
    };
  });
}

/**
 * Four questions for a mastery check: the bank's questions on the topic, topped up with fresh
 * generated ones. A topic without a generator uses four different bank questions, harder first.
 */
export function buildMasteryCheck(topicId) {
  const bank = QUESTION_BANK.filter((q) => q.topicId === topicId).sort(() => Math.random() - 0.5);
  if (!canGenerate(topicId)) {
    return [...bank].sort((a, b) => b.difficulty - a.difficulty).slice(0, CHECK_SIZE).sort(() => Math.random() - 0.5);
  }
  const qs = bank.slice(0, CHECK_SIZE - 1);
  const levels = [2, 3, 3];
  while (qs.length < CHECK_SIZE) qs.push(generateQuestion(topicId, levels[qs.length % levels.length]));
  return qs;
}

/* --- Streaks and achievements ---------------------------------------------- */

const dayKey = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

/** Current and best streak of days with any quiz or practice activity. */
export function streaks(attempts, activity = []) {
  const days = new Set([...attempts.map((a) => dayKey(a.takenAt)), ...activity.map(dayKey)]);
  const DAY = 86400000;
  let current = 0;
  let cursor = Date.now();
  if (!days.has(dayKey(cursor))) cursor -= DAY; // today not done yet: count up to yesterday
  while (days.has(dayKey(cursor))) { current += 1; cursor -= DAY; }

  const sorted = [...days].map((k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d).getTime(); }).sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  sorted.forEach((t, i) => {
    run = i > 0 && Math.round((t - sorted[i - 1]) / DAY) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  });
  return { current, best, days: days.size };
}

export const BADGES = [
  { id: 'first-quiz', icon: '🚀', name: 'First steps', text: 'Finish your first quiz.' },
  { id: 'gap-closer', icon: '🔒', name: 'Gap closer', text: 'Pass a mastery check and close a gap.' },
  { id: 'foundation', icon: '🧱', name: 'Foundation fixer', text: 'Close a missing-prerequisite gap.' },
  { id: 'perfect', icon: '💯', name: 'Perfect score', text: 'Score 100% on a quiz.' },
  { id: 'streak-3', icon: '🔥', name: 'On a roll', text: 'Learn three days in a row.' },
  { id: 'practice-25', icon: '🏋️', name: 'Practice makes progress', text: 'Answer 25 practice questions.' },
  { id: 'comeback', icon: '📈', name: 'Comeback', text: 'Raise a topic score by 30 points or more.' },
  { id: 'subject-master', icon: '🏆', name: 'Subject master', text: 'Reach 80% in every topic of a subject.' },
];

export function achievements(attempts, practiced, activity) {
  const quizzes = attempts.filter((a) => a.kind === 'quiz');
  const checks = attempts.filter((a) => a.kind === 'check' && a.passed);
  const status = topicStatus(attempts);
  const closedPrereq = Object.values(status).some((s) => s.closed && s.gap?.type === 'prerequisite');
  const comeback = Object.values(status).some((s) => {
    const h = s.history ?? [];
    return h.some((x, i) => h.slice(i + 1).some((y) => y.pct - x.pct >= 30));
  });
  const subjectMaster = subjectMastery(status).some((s) => s.tested === s.total && s.value >= MASTERY);
  const earned = {
    'first-quiz': quizzes.length > 0,
    'gap-closer': checks.length > 0,
    foundation: closedPrereq,
    perfect: quizzes.some((q) => q.pct === 100),
    'streak-3': streaks(attempts, activity).best >= 3,
    'practice-25': practiced >= 25,
    comeback,
    'subject-master': subjectMaster,
  };
  return BADGES.map((b) => ({ ...b, earned: Boolean(earned[b.id]) }));
}

/* --- Sample history (for demos) -------------------------------------------- */

/** Three past diagnostics on earlier days, so history, streaks and badges have something to show. */
export function sampleHistory(questions) {
  const DAY = 86400000;
  const plans = [
    { daysAgo: 6, rightIds: ['lin1', 'lin2', 'fac3', 'exp1', 'quad2'] },
    { daysAgo: 2, rightIds: ['lin1', 'lin2', 'fac1', 'fac3', 'exp1', 'exp2', 'quad3', 'rad2'] },
    { daysAgo: 1, rightIds: ['lin1', 'lin2', 'fac1', 'fac3', 'exp1', 'exp2', 'quad2', 'quad3', 'rad1'] },
  ];
  let prior = {};
  const attempts = plans.map(({ daysAgo, rightIds }) => {
    const responses = {};
    questions.forEach((q) => {
      const right = rightIds.includes(q.id);
      let value;
      if (q.type === 'mc') value = q.options.findIndex((o) => (right ? o.correct : !o.correct));
      else if (q.type === 'tf') value = right ? q.answer : !q.answer;
      else value = right ? q.accept[0] : q.traps?.[0]?.match ?? '0';
      responses[q.id] = { value, ms: 9000 };
    });
    const att = gradeAttempt({ quiz: { id: 'diagnostic', title: 'Math Foundations Diagnostic' }, questions, responses, prior });
    att.takenAt = Date.now() - daysAgo * DAY;
    att.id = `${att.id}-s${daysAgo}`;
    att.sample = true;
    prior = topicStatus([att]);
    return att;
  });
  return attempts;
}

export const gapTypeOf = (id) => GAP_TYPES[id];
export const competencyLabel = (id) => {
  const c = competencyById(id);
  return c ? `${c.code} · ${c.text}` : id;
};

/* --- Recommendations ---------------------------------------------------------
 * A ranked "do this next" list built from the learning path, the resource
 * library and the quizzes on offer. Every item carries the reason it was
 * picked. It is recomputed from the saved results, so it changes after every
 * quiz, practice answer and mastery check.
 * ------------------------------------------------------------------------- */

/* Which material type helps most for each kind of gap. */
const BEST_MATERIAL = {
  concept: ['Video', 'Reading', 'Link', 'PDF', 'Worksheet'],
  careless: ['Worksheet', 'PDF', 'Video', 'Link', 'Reading'],
  prerequisite: ['Reading', 'Video', 'PDF', 'Link', 'Worksheet'],
};

const LESSON_REASON = {
  concept: (t) => `You missed the idea behind ${t}, so start with the 2-minute lesson before practising.`,
  careless: (t) => `A quick refresher on ${t} before you practise; your mistakes were slips, not the idea.`,
  prerequisite: (t, pre) => `${t} builds on ${pre}. The lesson shows how they connect.`,
};

const SEVERITY_BOOST = { critical: 12, moderate: 6, mild: 0 };

/** The key a resource recommendation is remembered by (so "done" sticks until the gap reopens). */
export const resourceKey = (topicId, r, gapKey) => `res:${topicId}:${r.id ?? r.title}:${gapKey}`;

/**
 * Ranked recommendations for a student.
 *  attempts, path: from the student's history
 *  quizzes: published teacher quizzes for the student's courses
 *  done: { [recommendationKey]: timestamp } items the student marked done
 *  diagnostics: the built-in diagnostics on offer (their courses' subjects first)
 *  enrolled: how many classes the student is enrolled in
 */
export function recommendations({ attempts, path, quizzes = [], done = {}, diagnostics = [], enrolled = 0 }) {
  const recs = [];
  const add = (r) => {
    if (!done[r.key]) recs.push(r);
  };
  const taken = new Set(attempts.map((a) => a.quizId));

  if (!enrolled) {
    add({
      key: 'enroll',
      kind: 'enroll',
      title: 'Enroll in your classes',
      reason: 'Join the classes you take this term, so you get their diagnostics and quizzes and your teachers see your progress.',
      to: '/dashboard/my-courses',
      priority: 110,
    });
  }

  // A diagnostic for every enrolled subject not taken yet (a new course adds a new one).
  diagnostics
    .filter((d) => !taken.has(d.id) && (d.courseCode || !attempts.length))
    .forEach((d, i) =>
      add({
        key: `quiz:${d.id}`,
        kind: 'quiz',
        title: `Take the ${d.title}`,
        reason: attempts.length
          ? `New for ${d.courseCode}: one result maps your gaps in this subject.`
          : 'One result is all Kasalig needs to find your gaps and build your learning path.',
        to: `/dashboard/quiz/${d.id}`,
        priority: (attempts.length ? 88 : 100) - i,
      })
    );
  // (No early return without results: a class with no built-in diagnostic still recommends
  // its teacher's quizzes below.)

  path.forEach((item, i) => {
    const { topic, gap, practice, waitingOn } = item;
    const name = topic.name;
    const pre = waitingOn.map((t) => t.name).join(' and ');
    const base = 90 - i * 8 + SEVERITY_BOOST[gap.severity] - (waitingOn.length ? 14 : 0);
    const common = { topic, gapType: gap.type, severity: gap.severity, gapKey: gap.attemptId, waitingOn };

    if (!practice.lessonRead) {
      add({
        ...common,
        key: `lesson:${topic.id}:${gap.attemptId}`,
        kind: 'lesson',
        title: `Read the ${name} lesson`,
        reason: LESSON_REASON[gap.type](name, pre || 'earlier skills'),
        to: '/dashboard/path',
        priority: base + 4,
      });
    }
    if (!practice.done) {
      add({
        ...common,
        key: `practice:${topic.id}:${gap.attemptId}`,
        kind: 'practice',
        title: practice.answered ? `Keep practising ${name}` : `Practise ${name}`,
        reason: practice.answered
          ? `${practice.goal} of ${PRACTICE_GOAL} done at Medium or harder. The questions adjust to how you are doing.`
          : 'Adaptive practice: it gets harder when you are on a roll and easier when you get stuck.',
        to: `/dashboard/practice/${topic.id}`,
        priority: base + (practice.lessonRead ? 3 : 1),
      });
    } else if (!waitingOn.length) {
      add({
        ...common,
        key: `check:${topic.id}:${gap.attemptId}`,
        kind: 'check',
        title: `Take the ${name} mastery check`,
        reason: `Practice goal reached. Get ${CHECK_PASS} of ${CHECK_SIZE} right and this gap is marked Closed.`,
        to: `/dashboard/check/${topic.id}`,
        priority: base + 8,
      });
    }

    // The most useful material for this gap: the teacher's own first, then the best type for the gap.
    const order = BEST_MATERIAL[gap.type];
    const fit = (r) => (order.includes(r.type) ? order.indexOf(r.type) : order.length);
    const material = item.resources
      .filter((r) => !done[resourceKey(topic.id, r, gap.attemptId)])
      .sort((a, b) => Number(Boolean(a.builtIn)) - Number(Boolean(b.builtIn)) || fit(a) - fit(b))[0];
    if (material) {
      add({
        ...common,
        key: resourceKey(topic.id, material, gap.attemptId),
        kind: 'resource',
        title: material.title,
        meta: `${material.type}${material.minutes ? ` · ${material.minutes} min` : ''}`,
        url: material.url,
        reason: material.builtIn
          ? `A ${material.type.toLowerCase()} suits a "${GAP_TYPES[gap.type].label.toLowerCase()}" gap in ${name}.`
          : `Your teacher shared this for ${name}${material.note ? `: "${material.note}"` : '.'}`,
        fromTeacher: !material.builtIn,
        priority: base - 3 + (material.builtIn ? 0 : 6),
      });
    }

    if (gap.type === 'concept' || gap.severity === 'critical') {
      add({
        ...common,
        key: `tutor:${topic.id}:${gap.attemptId}`,
        kind: 'tutor',
        title: `Ask Kasalig to walk you through ${name}`,
        reason: 'Step-by-step help in English, Filipino or Cebuano, without just giving away the answer.',
        to: '/dashboard/tutor',
        state: { topicId: topic.id },
        priority: base - 6,
      });
    }
  });

  // Quizzes: new ones from the teacher, or a re-check of the diagnostic once everything is closed.
  quizzes
    .filter((q) => !taken.has(q.id))
    .forEach((q) =>
      add({
        key: `quiz:${q.id}`,
        kind: 'quiz',
        title: q.title,
        reason: 'New from your teacher. The result updates your gaps and learning path.',
        to: `/dashboard/quiz/${q.id}`,
        priority: path.length ? 45 : 80,
        fromTeacher: true,
      })
    );
  if (!path.length) {
    // Re-check with the diagnostic taken most recently (built-in ones only).
    const diagIds = new Set(diagnostics.map((d) => d.id));
    const lastDiag = attempts.filter((a) => diagIds.has(a.quizId)).sort((a, b) => b.takenAt - a.takenAt)[0];
    const diag = diagnostics.find((d) => d.id === lastDiag?.quizId);
    if (diag) {
      add({
        key: `quiz:${diag.id}:recheck:${lastDiag.id}`,
        kind: 'quiz',
        title: `Retake the ${diag.title}`,
        reason: 'Every gap is closed. A fresh diagnostic checks that it sticks and finds anything new.',
        to: `/dashboard/quiz/${diag.id}`,
        priority: 70,
      });
    }
  }

  return recs.sort((a, b) => b.priority - a.priority);
}

/** What the latest result changed in the learning path: new, closed, worse and improving gaps. */
export function pathChanges(attempts) {
  if (!attempts.length) return null;
  const sorted = [...attempts].sort((a, b) => a.takenAt - b.takenAt);
  const latest = sorted.at(-1);
  const before = topicStatus(sorted.slice(0, -1));
  const now = topicStatus(sorted);
  const changes = { attempt: latest, firstResult: sorted.length === 1, added: [], closed: [], worse: [], improved: [] };
  TOPICS.forEach((t) => {
    const was = isOpenGap(before[t.id]);
    const is = isOpenGap(now[t.id]);
    if (is && !was) changes.added.push({ topic: t, gap: now[t.id].gap });
    else if (was && !is) changes.closed.push({ topic: t, pct: now[t.id].pct });
    else if (was && is) {
      const r0 = SEVERITIES[before[t.id].gap.severity].rank;
      const r1 = SEVERITIES[now[t.id].gap.severity].rank;
      if (r1 < r0) changes.worse.push({ topic: t, gap: now[t.id].gap });
      else if (now[t.id].pct > before[t.id].pct) changes.improved.push({ topic: t, from: before[t.id].pct, to: now[t.id].pct });
    }
  });
  changes.any = Boolean(changes.added.length || changes.closed.length || changes.worse.length || changes.improved.length);
  return changes;
}

/**
 * Topic status from plain scores (a teacher's roster has scores, not answer-level history),
 * so the same learning path can be worked out for any student.
 */
export function statusFromScores(scores) {
  const status = {};
  TOPICS.forEach((t) => {
    const score = scores[t.id];
    if (score === undefined) return;
    let gap = null;
    if (score < MASTERY) {
      const weakPre = t.prereqs.filter((p) => (scores[p] ?? 100) < PREREQ_WEAK);
      const type = weakPre.length ? 'prerequisite' : score >= 65 ? 'careless' : 'concept';
      gap = {
        topicId: t.id,
        type,
        severity: severityFor(score, type),
        pct: score,
        prereqs: weakPre,
        summary: GAP_SUMMARY[type](t.name, weakPre.map((id) => topicById(id).name).join(' and ') || 'an earlier skill'),
        reasons: [],
        competencies: [],
        attemptId: 'scores',
        openedAt: 0,
      };
    }
    status[t.id] = { pct: score, gap, closed: false, history: [] };
  });
  return status;
}
