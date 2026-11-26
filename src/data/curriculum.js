/* ---------------------------------------------------------------------------
 * Curriculum: subjects, topics, learning competencies, lessons and the question
 * bank. Everything a quiz, gap report or learning path needs is tagged here.
 *
 * Competency codes follow the DepEd K to 12 / MELC code format. Check them
 * against the official MELC list for your grade level before release.
 * The Filipino and Cebuano lesson text should be reviewed by a native speaker.
 * ------------------------------------------------------------------------- */
import {
  COLLEGE_COMPETENCIES,
  COLLEGE_DIAGNOSTICS,
  COLLEGE_LESSONS,
  COLLEGE_MATERIALS,
  COLLEGE_QUESTIONS,
  COLLEGE_SUBJECTS,
  COLLEGE_TOPICS,
} from './collegeContent';


export const SUBJECTS = [
  { id: 'foundations', name: 'Algebra Foundations', grade: 'Math refresher', color: '#de7a40', tint: '#fdeee3' },
  { id: 'math9', name: 'Intermediate Algebra', grade: 'Math refresher', color: '#8b5cf6', tint: '#f1ecfe' },
  ...COLLEGE_SUBJECTS,
];

/* `prereqs` drives "fix the prerequisite first": a topic's gaps are ordered after
   the gaps of the topics it builds on. */
export const TOPICS = [
  { id: 'linear', subjectId: 'foundations', name: 'Linear Equations', blurb: 'Isolating x, one step at a time', color: '#de7a40', tint: '#fdeee3', prereqs: [] },
  { id: 'factoring', subjectId: 'foundations', name: 'Factoring Polynomials', blurb: 'Rewriting expressions as products', color: '#f59e0b', tint: '#fef3dc', prereqs: [] },
  { id: 'quadratic', subjectId: 'math9', name: 'Quadratic Equations', blurb: 'Solving by factoring and roots', color: '#e5604d', tint: '#fde9e6', prereqs: ['factoring', 'linear'] },
  { id: 'roots', subjectId: 'math9', name: 'Nature of Roots', blurb: 'Reading the discriminant', color: '#0ea5e9', tint: '#e0f2fe', prereqs: ['quadratic'] },
  { id: 'exponents', subjectId: 'math9', name: 'Integral Exponents', blurb: 'Zero, negative and combined powers', color: '#10b981', tint: '#e3f8f0', prereqs: [] },
  { id: 'radicals', subjectId: 'math9', name: 'Radical Expressions', blurb: 'Simplifying and combining roots', color: '#8b5cf6', tint: '#f1ecfe', prereqs: ['exponents'] },
  ...COLLEGE_TOPICS,
];

export const COMPETENCIES = [
  { id: 'c-linear', topicId: 'linear', code: 'M7AL-IIi-j-1', text: 'Solves linear equations in one variable.' },
  { id: 'c-factor', topicId: 'factoring', code: 'M8AL-Ia-b-1', text: 'Factors completely different types of polynomials.' },
  { id: 'c-quad-illustrate', topicId: 'quadratic', code: 'M9AL-Ia-1', text: 'Illustrates quadratic equations.' },
  { id: 'c-quad-solve', topicId: 'quadratic', code: 'M9AL-Ia-b-1', text: 'Solves quadratic equations by extracting square roots, factoring, completing the square and the quadratic formula.' },
  { id: 'c-roots', topicId: 'roots', code: 'M9AL-Ic-1', text: 'Characterizes the roots of a quadratic equation using the discriminant.' },
  { id: 'c-exponents', topicId: 'exponents', code: 'M9AL-IIe-1', text: 'Applies the laws involving positive integral exponents to zero and negative integral exponents.' },
  { id: 'c-radicals', topicId: 'radicals', code: 'M9AL-IIf-2', text: 'Simplifies radical expressions using the laws of radicals.' },
  ...COLLEGE_COMPETENCIES,
];

export const topicById = (id) => TOPICS.find((t) => t.id === id);
export const subjectById = (id) => SUBJECTS.find((s) => s.id === id);
export const competencyById = (id) => COMPETENCIES.find((c) => c.id === id);
export const competenciesOf = (topicId) => COMPETENCIES.filter((c) => c.topicId === topicId);
export const topicsOf = (subjectId) => TOPICS.filter((t) => t.subjectId === subjectId);

/* Why an answer was wrong. Every wrong answer ends up in one of these. */
export const GAP_TYPES = {
  concept: {
    label: 'Concept not understood',
    short: 'Concept',
    color: '#8b5cf6',
    tint: '#f1ecfe',
    hint: 'The idea behind the rule is not solid yet. Start with the short lesson.',
  },
  careless: {
    label: 'Careless error',
    short: 'Careless',
    color: '#c2672d',
    tint: '#fdeee3',
    hint: 'You know how to do it, but a sign or a last step slipped. Slow down and check.',
  },
  prerequisite: {
    label: 'Missing prerequisite',
    short: 'Prerequisite',
    color: '#d4483a',
    tint: '#fde9e6',
    hint: 'An earlier skill this topic builds on needs work first.',
  },
};

export const SEVERITIES = {
  critical: { label: 'Critical', rank: 0, color: '#b42318', tint: '#fde2df' },
  moderate: { label: 'Moderate', rank: 1, color: '#b45309', tint: '#fdecc8' },
  mild: { label: 'Mild', rank: 2, color: '#047857', tint: '#d9f5e8' },
};

export const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'fil', label: 'Filipino' },
  { id: 'ceb', label: 'Cebuano' },
];

/* Short lessons, in three languages. */
export const LESSONS = {
  linear: {
    en: {
      summary: 'A linear equation is a balance. Whatever you do to one side, do the same to the other, until x is alone.',
      steps: [
        'Undo addition or subtraction first: move the constant to the other side.',
        'Undo multiplication or division: divide both sides by the number beside x.',
        'Check: put your answer back into the original equation.',
      ],
    },
    fil: {
      summary: 'Ang linear equation ay parang timbangan. Anuman ang gawin mo sa isang panig, gawin mo rin sa kabila, hanggang mag-isa na lang ang x.',
      steps: [
        'Unahin ang pagbawi sa pagdagdag o pagbawas: ilipat ang constant sa kabilang panig.',
        'Sunod, bawiin ang pagpaparami o paghahati: hatiin ang magkabilang panig sa numerong katabi ng x.',
        'Suriin: ibalik ang sagot sa orihinal na equation.',
      ],
    },
    ceb: {
      summary: 'Ang linear equation sama sa timbangan. Bisan unsa ang imong buhaton sa usa ka kilid, buhata usab sa pikas, hangtod mag-inusara na ang x.',
      steps: [
        'Unaha ang pagbawi sa pagdugang o pagkuha: ibalhin ang constant sa pikas kilid.',
        'Sunod, bawia ang pagpadaghan o pagbahin: bahina ang duha ka kilid sa numero nga tupad sa x.',
        'Susiha: ibalik ang tubag sa orihinal nga equation.',
      ],
    },
  },
  factoring: {
    en: {
      summary: 'Factoring rewrites a polynomial as a product. For x² + bx + c, find two numbers that multiply to c and add to b.',
      steps: [
        'Look for a common factor first and take it out.',
        'For x² + bx + c, list the factor pairs of c and pick the pair that adds to b.',
        'Watch for special patterns: a² − b² = (a − b)(a + b).',
      ],
    },
    fil: {
      summary: 'Ang factoring ay pagsulat muli sa polynomial bilang produkto. Para sa x² + bx + c, humanap ng dalawang numerong ang produkto ay c at ang kabuuan ay b.',
      steps: [
        'Hanapin muna ang common factor at ilabas ito.',
        'Para sa x² + bx + c, ilista ang mga pares ng factor ng c at piliin ang pares na ang kabuuan ay b.',
        'Tingnan ang mga espesyal na pattern: a² − b² = (a − b)(a + b).',
      ],
    },
    ceb: {
      summary: 'Ang factoring mao ang pagsulat pag-usab sa polynomial isip produkto. Para sa x² + bx + c, pangitaa ang duha ka numero nga ang produkto kay c ug ang sum kay b.',
      steps: [
        'Pangitaa una ang common factor ug gawsa kini.',
        'Para sa x² + bx + c, ilista ang mga pares sa factor sa c ug pilia ang pares nga ang sum kay b.',
        'Tan-awa ang espesyal nga pattern: a² − b² = (a − b)(a + b).',
      ],
    },
  },
  quadratic: {
    en: {
      summary: 'A quadratic equation has x² as its highest power. Get 0 on one side, factor, then set each factor to 0.',
      steps: [
        'Write it in standard form: ax² + bx + c = 0.',
        'Factor the left side (or use the quadratic formula if it will not factor).',
        'Zero-product property: if (x − p)(x − q) = 0, then x = p or x = q.',
      ],
    },
    fil: {
      summary: 'Ang quadratic equation ay may x² bilang pinakamataas na power. Gawing 0 ang isang panig, i-factor, saka itakda sa 0 ang bawat factor.',
      steps: [
        'Isulat sa standard form: ax² + bx + c = 0.',
        'I-factor ang kaliwang panig (o gamitin ang quadratic formula kung hindi ma-factor).',
        'Zero-product property: kung (x − p)(x − q) = 0, ang x = p o x = q.',
      ],
    },
    ceb: {
      summary: 'Ang quadratic equation adunay x² isip pinakataas nga power. Himoang 0 ang usa ka kilid, i-factor, unya itakda sa 0 ang matag factor.',
      steps: [
        'Isulat sa standard form: ax² + bx + c = 0.',
        'I-factor ang wala nga kilid (o gamita ang quadratic formula kung dili ma-factor).',
        'Zero-product property: kung (x − p)(x − q) = 0, ang x = p o x = q.',
      ],
    },
  },
  roots: {
    en: {
      summary: 'The discriminant D = b² − 4ac tells you what kind of roots a quadratic has, without solving it.',
      steps: [
        'Read a, b and c from ax² + bx + c = 0, keeping their signs.',
        'Compute D = b² − 4ac. Square b first: a negative b squared is positive.',
        'D > 0: two distinct real roots. D = 0: one repeated real root. D < 0: no real roots.',
      ],
    },
    fil: {
      summary: 'Ang discriminant D = b² − 4ac ang nagsasabi kung anong uri ng roots mayroon ang quadratic, kahit hindi pa ito nalulutas.',
      steps: [
        'Basahin ang a, b at c mula sa ax² + bx + c = 0, kasama ang kanilang sign.',
        'Kalkulahin ang D = b² − 4ac. Unahin ang pag-square sa b: positibo ang negatibong b kapag na-square.',
        'D > 0: dalawang magkaibang real roots. D = 0: isang paulit-ulit na real root. D < 0: walang real roots.',
      ],
    },
    ceb: {
      summary: 'Ang discriminant D = b² − 4ac maoy mosulti kung unsang klase sa roots ang quadratic, bisan wala pa kini masulbad.',
      steps: [
        'Basaha ang a, b ug c gikan sa ax² + bx + c = 0, apil ang ilang sign.',
        'Kuwentaha ang D = b² − 4ac. Unaha ang pag-square sa b: positibo ang negatibong b kung ma-square.',
        'D > 0: duha ka lahi nga real roots. D = 0: usa ka balik-balik nga real root. D < 0: walay real roots.',
      ],
    },
  },
  exponents: {
    en: {
      summary: 'Exponents count repeated multiplication. The laws let you combine powers of the same base quickly.',
      steps: [
        'Multiplying the same base: add the exponents. x^a · x^b = x^(a+b).',
        'Dividing the same base: subtract the exponents. A power of a power: multiply them.',
        'x⁰ = 1 and x^(−n) = 1/xⁿ, for any x ≠ 0.',
      ],
    },
    fil: {
      summary: 'Binibilang ng exponent ang paulit-ulit na pagpaparami. Pinapabilis ng mga batas ang pagsasama ng mga power na pareho ang base.',
      steps: [
        'Pagpaparami ng parehong base: pagsamahin ang mga exponent. x^a · x^b = x^(a+b).',
        'Paghahati ng parehong base: ibawas ang mga exponent. Power ng isang power: i-multiply ang mga ito.',
        'x⁰ = 1 at x^(−n) = 1/xⁿ, kung x ≠ 0.',
      ],
    },
    ceb: {
      summary: 'Ang exponent nag-ihap sa balik-balik nga pagpadaghan. Ang mga balaod makapadali sa paghiusa sa mga power nga parehas og base.',
      steps: [
        'Pagpadaghan sa parehas nga base: idugang ang mga exponent. x^a · x^b = x^(a+b).',
        'Pagbahin sa parehas nga base: ibawas ang mga exponent. Power sa usa ka power: i-multiply sila.',
        'x⁰ = 1 ug x^(−n) = 1/xⁿ, kung x ≠ 0.',
      ],
    },
  },
  radicals: {
    en: {
      summary: 'To simplify a square root, pull out the largest perfect square factor.',
      steps: [
        'Split the number into a perfect square times what is left: 50 = 25 · 2.',
        'Take the root of the perfect square out front: √50 = 5√2.',
        'Add or subtract only like radicals: 3√2 + 5√2 = 8√2.',
      ],
    },
    fil: {
      summary: 'Para pasimplehin ang square root, ilabas ang pinakamalaking perfect square na factor.',
      steps: [
        'Hatiin ang numero sa perfect square na beses ang natira: 50 = 25 · 2.',
        'Ilabas sa harap ang root ng perfect square: √50 = 5√2.',
        'Pagsamahin o ibawas lamang ang magkakatulad na radical: 3√2 + 5√2 = 8√2.',
      ],
    },
    ceb: {
      summary: 'Aron pasimplehon ang square root, gawsa ang pinakadako nga perfect square nga factor.',
      steps: [
        'Bahina ang numero ngadto sa perfect square times ang nahibilin: 50 = 25 · 2.',
        'Gawsa sa atubangan ang root sa perfect square: √50 = 5√2.',
        'Idugang o ibawas lang ang managsama nga radical: 3√2 + 5√2 = 8√2.',
      ],
    },
  },
  ...COLLEGE_LESSONS,
};

/* Built-in study material per topic, shown next to the teacher's own resources. */
export const BUILT_IN_MATERIALS = {
  linear: [
    { type: 'Video', title: 'Why we "do the same to both sides"', minutes: 5 },
    { type: 'Worksheet', title: 'Two-step equations warm-up', minutes: 8 },
  ],
  factoring: [
    { type: 'Video', title: 'Factor pairs: product c, sum b', minutes: 6 },
    { type: 'Worksheet', title: 'Difference of two squares drill', minutes: 7 },
  ],
  quadratic: [
    { type: 'Video', title: 'Zero-product property in 4 minutes', minutes: 4 },
    { type: 'Worksheet', title: 'Solve by factoring, step by step', minutes: 10 },
  ],
  roots: [
    { type: 'Video', title: 'What the discriminant tells you', minutes: 5 },
    { type: 'Reading', title: 'Squaring negative numbers safely', minutes: 4 },
  ],
  exponents: [
    { type: 'Video', title: 'Zero and negative exponents, explained', minutes: 6 },
    { type: 'Worksheet', title: 'Laws of exponents drill', minutes: 7 },
  ],
  radicals: [
    { type: 'Video', title: 'Simplifying roots with perfect squares', minutes: 5 },
    { type: 'Worksheet', title: 'Adding like radicals', minutes: 6 },
  ],
  ...COLLEGE_MATERIALS,
};

/* The question bank.
 *  - mc: `options`, one with `correct: true`; each wrong option names the `error` it points to.
 *  - id (identification): `accept` lists the right answers; `traps` maps common wrong answers to an error.
 *  - tf: `answer` is true or false.
 * Every question carries a topic, a competency and a difficulty (1 easy – 3 hard). */
export const QUESTION_BANK = [
  {
    id: 'lin1', type: 'mc', topicId: 'linear', competencyId: 'c-linear', difficulty: 1,
    prompt: 'Solve for x:  3x + 5 = 20',
    options: [
      { text: 'x = 5', correct: true },
      { text: 'x = 25/3', error: 'concept' },
      { text: 'x = 15', error: 'careless' },
      { text: 'x = −5', error: 'careless' },
    ],
    explanation: 'Subtract 5 from both sides (3x = 15), then divide by 3: x = 5.',
  },
  {
    id: 'lin2', type: 'id', topicId: 'linear', competencyId: 'c-linear', difficulty: 2,
    prompt: 'Solve for x:  2(x − 4) = 10',
    accept: ['9'],
    traps: [{ match: '7', error: 'concept' }, { match: '1', error: 'careless' }],
    explanation: 'Distribute: 2x − 8 = 10. Add 8: 2x = 18. Divide by 2: x = 9.',
  },
  {
    id: 'lin3', type: 'tf', topicId: 'linear', competencyId: 'c-linear', difficulty: 1,
    prompt: 'To solve x − 7 = 12, you add 7 to both sides.',
    answer: true,
    explanation: 'Adding 7 undoes the − 7, so x = 19.',
  },
  {
    id: 'fac1', type: 'mc', topicId: 'factoring', competencyId: 'c-factor', difficulty: 1,
    prompt: 'Factor completely:  x² − 9',
    options: [
      { text: '(x − 3)²', error: 'concept' },
      { text: '(x − 3)(x + 3)', correct: true },
      { text: '(x − 9)(x + 1)', error: 'concept' },
      { text: '(x + 3)²', error: 'careless' },
    ],
    explanation: 'x² − 9 is a difference of two squares: a² − b² = (a − b)(a + b), so (x − 3)(x + 3).',
  },
  {
    id: 'fac2', type: 'id', topicId: 'factoring', competencyId: 'c-factor', difficulty: 2,
    prompt: 'Factor:  x² + 7x + 12',
    accept: ['(x+3)(x+4)', '(x+4)(x+3)'],
    traps: [
      { match: '(x-3)(x-4)', error: 'careless' },
      { match: '(x-4)(x-3)', error: 'careless' },
      { match: '(x+2)(x+6)', error: 'concept' },
      { match: '(x+1)(x+12)', error: 'concept' },
    ],
    explanation: '3 and 4 multiply to 12 and add to 7, so x² + 7x + 12 = (x + 3)(x + 4).',
  },
  {
    id: 'fac3', type: 'tf', topicId: 'factoring', competencyId: 'c-factor', difficulty: 2,
    prompt: 'x² + 5x + 6 = (x + 2)(x + 3)',
    answer: true,
    explanation: '2 · 3 = 6 and 2 + 3 = 5, so the factoring is correct.',
  },
  {
    id: 'quad1', type: 'tf', topicId: 'quadratic', competencyId: 'c-quad-illustrate', difficulty: 1,
    prompt: '3x² − 2x + 1 = 0 is a quadratic equation.',
    answer: true,
    explanation: 'Its highest power of x is 2, so it is quadratic.',
  },
  {
    id: 'quad2', type: 'mc', topicId: 'quadratic', competencyId: 'c-quad-solve', difficulty: 2,
    prompt: 'Solve:  x² − 5x + 6 = 0',
    options: [
      { text: 'x = −2 or x = −3', error: 'careless' },
      { text: 'x = 5 or x = 6', error: 'concept' },
      { text: 'x = 2 or x = 3', correct: true },
      { text: 'x = 6 or x = −1', error: 'prerequisite' },
    ],
    explanation: '(x − 2)(x − 3) = 0, so x = 2 or x = 3.',
  },
  {
    id: 'quad3', type: 'id', topicId: 'quadratic', competencyId: 'c-quad-solve', difficulty: 2,
    prompt: 'Solve x² = 49. Type the positive solution.',
    accept: ['7'],
    traps: [{ match: '24.5', error: 'concept' }, { match: '-7', error: 'careless' }],
    explanation: 'Take the square root of both sides: x = ±7, so the positive solution is 7.',
  },
  {
    id: 'roots1', type: 'id', topicId: 'roots', competencyId: 'c-roots', difficulty: 1,
    prompt: 'What is the discriminant (b² − 4ac) of  x² − 4x + 4 = 0 ?',
    accept: ['0'],
    traps: [{ match: '32', error: 'careless' }, { match: '-32', error: 'prerequisite' }],
    explanation: 'a = 1, b = −4, c = 4. D = (−4)² − 4·1·4 = 16 − 16 = 0.',
  },
  {
    id: 'roots2', type: 'mc', topicId: 'roots', competencyId: 'c-roots', difficulty: 2,
    prompt: 'If the discriminant is negative, the quadratic equation has…',
    options: [
      { text: 'two equal real roots', error: 'concept' },
      { text: 'no real roots', correct: true },
      { text: 'two distinct real roots', error: 'concept' },
      { text: 'one negative root', error: 'concept' },
    ],
    explanation: 'A negative discriminant means the square root in the formula is not a real number, so there are no real roots.',
  },
  {
    id: 'roots3', type: 'tf', topicId: 'roots', competencyId: 'c-roots', difficulty: 2,
    prompt: 'x² + 4 = 0 has two real solutions.',
    answer: false,
    explanation: 'D = 0² − 4·1·4 = −16 < 0, so there are no real solutions.',
  },
  {
    id: 'exp1', type: 'id', topicId: 'exponents', competencyId: 'c-exponents', difficulty: 1,
    prompt: 'x³ · x⁴ = x^?   Type the exponent.',
    accept: ['7'],
    traps: [{ match: '12', error: 'concept' }, { match: '1', error: 'careless' }],
    explanation: 'Same base being multiplied: add the exponents, 3 + 4 = 7.',
  },
  {
    id: 'exp2', type: 'mc', topicId: 'exponents', competencyId: 'c-exponents', difficulty: 2,
    prompt: 'What is the value of  2⁻³ ?',
    options: [
      { text: '−8', error: 'concept' },
      { text: '1/8', correct: true },
      { text: '−6', error: 'concept' },
      { text: '8', error: 'careless' },
    ],
    explanation: 'A negative exponent means a reciprocal: 2⁻³ = 1/2³ = 1/8.',
  },
  {
    id: 'exp3', type: 'tf', topicId: 'exponents', competencyId: 'c-exponents', difficulty: 1,
    prompt: 'Any nonzero number raised to the power 0 equals 1.',
    answer: true,
    explanation: 'x⁰ = 1 for every x ≠ 0.',
  },
  {
    id: 'rad1', type: 'mc', topicId: 'radicals', competencyId: 'c-radicals', difficulty: 2,
    prompt: 'Simplify:  √50',
    options: [
      { text: '25√2', error: 'careless' },
      { text: '2√5', error: 'prerequisite' },
      { text: '5√2', correct: true },
      { text: '10', error: 'concept' },
    ],
    explanation: '50 = 25 · 2 and √25 = 5, so √50 = 5√2.',
  },
  {
    id: 'rad2', type: 'id', topicId: 'radicals', competencyId: 'c-radicals', difficulty: 2,
    prompt: 'Simplify:  3√2 + 5√2   (type √ as "root" if you like, e.g. 4root3)',
    accept: ['8√2'],
    traps: [{ match: '8√4', error: 'concept' }, { match: '15√2', error: 'concept' }],
    explanation: 'Like radicals add like terms: 3√2 + 5√2 = 8√2.',
  },
  {
    id: 'rad3', type: 'tf', topicId: 'radicals', competencyId: 'c-radicals', difficulty: 1,
    prompt: '√(a·b) = √a · √b for nonnegative a and b.',
    answer: true,
    explanation: 'This is the product law of radicals.',
  },
  ...COLLEGE_QUESTIONS,
];

export const questionById = (id) => QUESTION_BANK.find((q) => q.id === id);

/* The built-in diagnostic: two questions per topic, all three question types. */
export const DIAGNOSTIC = {
  id: 'diagnostic',
  title: 'Math Foundations Diagnostic',
  description: 'Covers every topic once, so your first learning path has something to work with.',
  minutes: 10,
  builtIn: true,
  questionIds: ['lin1', 'lin2', 'fac1', 'fac3', 'quad2', 'quad3', 'roots1', 'roots3', 'exp1', 'exp2', 'rad1', 'rad2'],
};

export const QUESTION_TYPE_LABELS = { mc: 'Multiple choice', id: 'Identification', tf: 'True or false' };
export const DIFFICULTY_LABELS = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

/* Every built-in diagnostic. A subject diagnostic is offered to students enrolled in that
   subject's course. (The Math Foundations one is kept for older results but offered to no one.) */
export const DIAGNOSTICS = [DIAGNOSTIC, ...COLLEGE_DIAGNOSTICS];
export const diagnosticById = (id) => DIAGNOSTICS.find((d) => d.id === id);

/** The built-in subject whose curriculum code matches, e.g. "CSIT221" → Data Structures. */
export const subjectForCourseCode = (code) =>
  code ? SUBJECTS.find((s) => s.courseCode && s.courseCode === String(code).toUpperCase()) ?? null : null;

/** Diagnostics a student can take: one per enrolled course whose subject has built-in content. */
export function diagnosticsForCourseCodes(codes = []) {
  const wanted = new Set(codes.filter(Boolean).map((c) => String(c).toUpperCase()));
  return COLLEGE_DIAGNOSTICS.filter((d) => wanted.has(d.courseCode));
}

/** The topics of the built-in subjects for these course codes (empty when none has content). */
export function topicsForCourseCodes(codes = []) {
  const ids = new Set(codes.map(subjectForCourseCode).filter(Boolean).map((s) => s.id));
  return TOPICS.filter((t) => ids.has(t.subjectId));
}
