/* ---------------------------------------------------------------------------
 * Question generators: a fresh question for any topic at difficulty 1–3.
 * Used by adaptive practice, mastery checks, the tutor's worked problems and
 * the teacher's draft generator. Each question has the same shape as the bank
 * in curriculum.js, plus `hints`: the solution steps, without the final answer.
 * ------------------------------------------------------------------------- */

const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const shuffle = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

let counter = 0;
const newId = (topicId) => `gen-${topicId}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

/** A number for display, with a real minus sign. */
export const num = (n) => (n < 0 ? `−${-n}` : `${n}`);
/** " + 3" or " − 3", for the middle of an expression. */
const signed = (n) => (n < 0 ? ` − ${-n}` : ` + ${n}`);
/** A term like "3x", "x", "−x" or "" (when the coefficient is 0), joined with its sign. */
const term = (coef, v, first = false) => {
  if (coef === 0) return '';
  const abs = Math.abs(coef);
  const body = `${abs === 1 ? '' : abs}${v}`;
  if (first) return coef < 0 ? `−${body}` : body;
  return coef < 0 ? ` − ${body}` : ` + ${body}`;
};
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = (n) => String(n).split('').map((c) => SUP[c] ?? c).join('');
const quadratic = (b, c) => `x²${term(b, 'x')}${c === 0 ? '' : signed(c)}`;
const factor = (r) => (r < 0 ? `(x + ${-r})` : `(x − ${r})`); // the factor whose root is r

/** Build a multiple-choice question; options with duplicate text are dropped. */
function mc(base, correctText, wrong) {
  const seen = new Set([correctText]);
  const options = [{ text: correctText, correct: true }];
  wrong.forEach((w) => {
    if (options.length < 4 && !seen.has(w.text)) {
      seen.add(w.text);
      options.push(w);
    }
  });
  return { ...base, type: 'mc', options: shuffle(options) };
}

const GENERATORS = {
  linear(level) {
    const base = { topicId: 'linear', competencyId: 'c-linear' };
    if (level === 1) {
      const a = randInt(2, 9);
      const x = randInt(1, 12);
      return {
        ...base, type: 'id',
        prompt: `Solve for x:  x + ${a} = ${x + a}`,
        accept: [`${x}`],
        traps: [{ match: `${x + 2 * a}`, error: 'concept' }],
        hints: [`Undo the + ${a}: subtract ${a} from both sides.`, `What is ${x + a} − ${a}?`],
        explanation: `Subtract ${a} from both sides: x = ${x}.`,
      };
    }
    if (level === 2) {
      const a = randInt(2, 6);
      const x = pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
      const b = randInt(1, 12);
      const c = a * x + b;
      const traps = [{ match: `${c - b}`, error: 'careless' }];
      if ((c + b) % a === 0) traps.push({ match: `${(c + b) / a}`, error: 'concept' });
      return {
        ...base, type: 'id',
        prompt: `Solve for x:  ${a}x + ${b} = ${num(c)}`,
        accept: [`${x}`],
        traps,
        hints: [`First undo the + ${b}: subtract ${b} from both sides.`, `You should have ${a}x = ${num(c - b)}. What undoes "times ${a}"?`],
        explanation: `${a}x = ${num(c - b)}, so x = ${num(x)}.`,
      };
    }
    const a = randInt(2, 5);
    const b = randInt(1, 6);
    const x = randInt(1, 8);
    const c = a * (x + b);
    const traps = [];
    if ((c - b) % a === 0) traps.push({ match: `${(c - b) / a}`, error: 'concept' });
    return {
      ...base, type: 'id',
      prompt: `Solve for x:  ${a}(x + ${b}) = ${c}`,
      accept: [`${x}`],
      traps,
      hints: [`Distribute the ${a} to both terms inside the brackets.`, `You should have ${a}x + ${a * b} = ${c}. Now undo the + ${a * b}.`, `Then divide both sides by ${a}.`],
      explanation: `${a}x + ${a * b} = ${c} → ${a}x = ${c - a * b} → x = ${x}.`,
    };
  },

  factoring(level) {
    const base = { topicId: 'factoring', competencyId: 'c-factor' };
    if (level === 1) {
      const k = randInt(2, 9);
      return mc(
        {
          ...base,
          prompt: `Factor completely:  x² − ${k * k}`,
          hints: ['This is a difference of two squares: a² − b² = (a − b)(a + b).', `What number squared gives ${k * k}?`],
          explanation: `x² − ${k * k} = (x − ${k})(x + ${k}).`,
        },
        `(x − ${k})(x + ${k})`,
        [
          { text: `(x − ${k})²`, error: 'concept' },
          { text: `(x − ${k * k})(x + 1)`, error: 'concept' },
          { text: `(x + ${k})²`, error: 'careless' },
        ]
      );
    }
    if (level === 2) {
      const p = randInt(1, 7);
      let q = randInt(1, 7);
      if (q === p) q = p === 7 ? 6 : p + 1;
      return {
        ...base, type: 'id',
        prompt: `Factor:  ${quadratic(p + q, p * q)}`,
        accept: [`(x+${p})(x+${q})`, `(x+${q})(x+${p})`],
        traps: [
          { match: `(x-${p})(x-${q})`, error: 'careless' },
          { match: `(x-${q})(x-${p})`, error: 'careless' },
        ],
        hints: [`Find two numbers that multiply to ${p * q}.`, `Of those pairs, which one adds up to ${p + q}?`],
        explanation: `${p} · ${q} = ${p * q} and ${p} + ${q} = ${p + q}, so (x + ${p})(x + ${q}).`,
      };
    }
    const p = randInt(1, 8);
    let q = randInt(1, 8);
    if (q === p) q = p === 8 ? 7 : p + 1;
    const b = p - q;
    const c = -p * q;
    return mc(
      {
        ...base,
        prompt: `Factor:  ${quadratic(b, c)}`,
        hints: [`Find two numbers that multiply to ${num(c)}: one must be negative.`, `Which of those pairs adds up to ${num(b)}?`],
        explanation: `${p} · (−${q}) = ${num(c)} and ${p} + (−${q}) = ${num(b)}, so (x + ${p})(x − ${q}).`,
      },
      `(x + ${p})(x − ${q})`,
      [
        { text: `(x − ${p})(x + ${q})`, error: 'careless' },
        { text: `(x + ${p})(x + ${q})`, error: 'concept' },
        { text: `(x + ${p * q})(x − 1)`, error: 'concept' },
      ]
    );
  },

  quadratic(level) {
    const base = { topicId: 'quadratic', competencyId: 'c-quad-solve' };
    if (level === 1) {
      const k = randInt(2, 9);
      return mc(
        {
          ...base,
          prompt: `Solve:  x² = ${k * k}`,
          hints: ['Take the square root of both sides.', 'Remember: a positive number has two square roots.'],
          explanation: `x = ±√${k * k} = ±${k}.`,
        },
        `x = ${k} or x = −${k}`,
        [
          { text: `x = ${k} only`, error: 'concept' },
          { text: `x = ${k * k} or x = −${k * k}`, error: 'careless' },
          { text: `x = ${2 * k} or x = −${2 * k}`, error: 'concept' },
        ]
      );
    }
    // level 2: two positive roots; level 3: one negative root
    const p = randInt(1, 9);
    let q = level === 2 ? randInt(1, 9) : -randInt(1, 9);
    if (q === p) q = p === 9 ? 8 : p + 1;
    const b = -(p + q);
    const c = p * q;
    const roots = (a, z) => `x = ${num(a)} or x = ${num(z)}`;
    // A factor pair of c with the wrong sum points to a factoring (prerequisite) slip.
    let wrongPair = null;
    for (let d = 1; d <= Math.abs(c); d++) {
      if (c % d === 0) {
        const e = c / d;
        if (d + e !== p + q && !(d === p && e === q) && !(d === q && e === p)) { wrongPair = [d, e]; break; }
      }
    }
    return mc(
      {
        ...base,
        prompt: `Solve:  ${quadratic(b, c)} = 0`,
        hints: [
          `Factor the left side: find two numbers that multiply to ${num(c)} and add to ${num(b)}.`,
          'Write it as (x − p)(x − q) = 0.',
          'Set each factor equal to 0 and solve.',
        ],
        explanation: `${factor(p)}${factor(q)} = 0, so ${roots(p, q)}.`,
      },
      roots(p, q),
      [
        { text: roots(-p, -q), error: 'careless' },
        { text: roots(-b, c), error: 'concept' },
        ...(wrongPair ? [{ text: roots(wrongPair[0], wrongPair[1]), error: 'prerequisite' }] : []),
        { text: `x = 0 or x = ${num(-b)}`, error: 'concept' },
      ]
    );
  },

  roots(level) {
    const base = { topicId: 'roots', competencyId: 'c-roots' };
    const a = pick([1, 1, 2]);
    const b = randInt(-6, 6);
    const c = randInt(-5, 5) || 1;
    const D = b * b - 4 * a * c;
    const eq = `${a === 1 ? '' : a}${quadratic(b, c)} = 0`;
    const nature = D > 0 ? 'two distinct real roots' : D === 0 ? 'one repeated real root' : 'no real roots';
    const hints = [
      `Here a = ${a}, b = ${num(b)}, c = ${num(c)}.`,
      `Compute b² first: (${num(b)})² = ${b * b}.`,
      `Then subtract 4ac = 4 · ${a} · ${num(c)} = ${num(4 * a * c)}.`,
    ];
    if (level === 1) {
      const traps = [];
      if (b * b + 4 * a * c !== D) traps.push({ match: `${b * b + 4 * a * c}`, error: 'careless' });
      if (b !== 0) traps.push({ match: `${-b * b - 4 * a * c}`, error: 'prerequisite' });
      return {
        ...base, type: 'id',
        prompt: `What is the discriminant (b² − 4ac) of  ${eq} ?`,
        accept: [`${D}`],
        traps,
        hints,
        explanation: `D = ${b * b} − (${num(4 * a * c)}) = ${num(D)}.`,
      };
    }
    if (level === 2) {
      const claimTwo = Math.random() < 0.5;
      const statement = claimTwo ? 'has two distinct real roots' : 'has no real roots';
      const truth = claimTwo ? D > 0 : D < 0;
      return {
        ...base, type: 'tf',
        prompt: `${eq}  ${statement}.`,
        answer: truth,
        hints: [...hints, 'D > 0 means two distinct real roots, D = 0 one repeated root, D < 0 none.'],
        explanation: `D = ${num(D)}, so the equation has ${nature}.`,
      };
    }
    return mc(
      {
        ...base,
        prompt: `Describe the roots of  ${eq}`,
        hints: [...hints, 'Compare D with 0.'],
        explanation: `D = ${num(D)}, so the equation has ${nature}.`,
      },
      nature,
      [
        ...['two distinct real roots', 'one repeated real root', 'no real roots']
          .filter((n) => n !== nature)
          .map((text) => ({ text, error: 'concept' })),
        { text: 'cannot tell without solving', error: 'concept' },
      ]
    );
  },

  exponents(level) {
    const base = { topicId: 'exponents', competencyId: 'c-exponents' };
    if (level === 1) {
      const a = randInt(2, 8);
      const b = randInt(2, 8);
      return {
        ...base, type: 'id',
        prompt: `x${sup(a)} · x${sup(b)} = x^?   Type the exponent.`,
        accept: [`${a + b}`],
        traps: [{ match: `${a * b}`, error: 'concept' }],
        hints: ['Same base, multiplied: do you add or multiply the exponents?', `What is ${a} + ${b}?`],
        explanation: `Add the exponents: ${a} + ${b} = ${a + b}.`,
      };
    }
    if (level === 2) {
      const a = randInt(2, 7);
      const b = randInt(2, 9);
      return {
        ...base, type: 'id',
        prompt: `x${sup(a)} ÷ x${sup(b)} = x^?   Type the exponent.`,
        accept: [`${a - b}`],
        traps: [
          { match: `${a + b}`, error: 'concept' },
          ...(a !== b ? [{ match: `${b - a}`, error: 'careless' }] : []),
        ],
        hints: ['Same base, divided: subtract the exponents.', `Top minus bottom: ${a} − ${b} = ?`],
        explanation: `${a} − ${b} = ${num(a - b)}.`,
      };
    }
    const n = pick([2, 3, 4, 5, 10]);
    const k = pick(n === 10 ? [1, 2, 3] : n >= 4 ? [1, 2] : [1, 2, 3]);
    const v = n ** k;
    const accept = [`1/${v}`];
    const dec = 1 / v;
    if (String(dec).length < 8) accept.push(String(dec));
    return {
      ...base, type: 'id',
      prompt: `What is the value of  ${n}${sup(-k)} ?   (a fraction like 1/9 is fine)`,
      accept,
      traps: [{ match: `-${v}`, error: 'concept' }, { match: `${v}`, error: 'careless' }, { match: `-${n * k}`, error: 'concept' }],
      hints: ['A negative exponent means "one over": x^(−n) = 1/xⁿ.', `So it is 1 over ${n}${sup(k)}. What is ${n}${sup(k)}?`],
      explanation: `${n}${sup(-k)} = 1/${n}${sup(k)} = 1/${v}.`,
    };
  },

  radicals(level) {
    const base = { topicId: 'radicals', competencyId: 'c-radicals' };
    const m = pick([2, 3, 5, 6, 7]);
    if (level === 1) {
      const k = randInt(2, 6);
      return mc(
        {
          ...base,
          prompt: `Simplify:  √${k * k * m}`,
          hints: [`Find the largest perfect square that divides ${k * k * m}.`, `${k * k * m} = ${k * k} · ${m}. What is √${k * k}?`],
          explanation: `√${k * k * m} = √${k * k} · √${m} = ${k}√${m}.`,
        },
        `${k}√${m}`,
        [
          { text: `${k * k}√${m}`, error: 'careless' },
          { text: `${m}√${k}`, error: 'prerequisite' },
          { text: `${k + m}`, error: 'concept' },
        ]
      );
    }
    if (level === 2) {
      const a = randInt(2, 7);
      const b = randInt(2, 7);
      return {
        ...base, type: 'id',
        prompt: `Simplify:  ${a}√${m} + ${b}√${m}   (type √ as "root" if you like)`,
        accept: [`${a + b}√${m}`],
        traps: [{ match: `${a + b}√${2 * m}`, error: 'concept' }, { match: `${a * b}√${m}`, error: 'concept' }],
        hints: [`Both terms have √${m}: treat it like a variable, as in ${a}y + ${b}y.`, `What is ${a} + ${b}?`],
        explanation: `${a}√${m} + ${b}√${m} = ${a + b}√${m}.`,
      };
    }
    const sm = pick([2, 3, 5]);
    const k = randInt(2, 5);
    return {
      ...base, type: 'id',
      prompt: `Simplify fully:  √${k * sm} · √${k}`,
      accept: [`${k}√${sm}`],
      traps: [{ match: `√${k * k * sm}`, error: 'careless' }],
      hints: ['Product law: √a · √b = √(a·b).', `So you get √${k * k * sm}. Now pull out the perfect square.`],
      explanation: `√${k * sm} · √${k} = √${k * k * sm} = ${k}√${sm}.`,
    };
  },
};

/** A new question for a topic at difficulty 1–3. */
export function generateQuestion(topicId, level = 2) {
  const d = Math.max(1, Math.min(3, level));
  const q = GENERATORS[topicId](d);
  return { ...q, id: newId(topicId), difficulty: d, generated: true };
}

export const canGenerate = (topicId) => Boolean(GENERATORS[topicId]);
