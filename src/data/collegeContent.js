/* ---------------------------------------------------------------------------
 * Starter learning content for BSIT subjects: topics (with prerequisites),
 * course-outcome competencies, short lessons, study materials, a question bank
 * and one diagnostic per subject. curriculum.js merges this with the original
 * Algebra content, so the gap engine, learning path, practice, mastery checks
 * and tutor work the same way for every subject.
 *
 * Code questions use the syntax Java and C share. Competency codes are
 * course-outcome labels (e.g. CSIT121-CO2); align them with the official
 * course syllabus before release.
 *
 * To add a subject: add it to COLLEGE_SUBJECTS with its curriculum courseCode,
 * then its topics, competencies, lessons, materials, questions and diagnostic.
 * ------------------------------------------------------------------------- */

export const COLLEGE_SUBJECTS = [
  { id: 'csit121', courseCode: 'CSIT121', name: 'Fundamentals of Programming', grade: 'CSIT121 · 1st Year', color: '#0ea5e9', tint: '#e0f2fe' },
  { id: 'csit221', courseCode: 'CSIT221', name: 'Data Structures and Algorithms', grade: 'CSIT221 · 2nd Year', color: '#8b5cf6', tint: '#f1ecfe' },
  { id: 'csit226', courseCode: 'CSIT226', name: 'Information Management 1', grade: 'CSIT226 · 2nd Year', color: '#10b981', tint: '#e3f8f0' },
];

/* Prerequisites may point to another subject's topic (Big-O builds on loops), so a weak
   CSIT121 skill shows up as a "missing prerequisite" gap in CSIT221. */
export const COLLEGE_TOPICS = [
  // CSIT121
  { id: 'p-vars', subjectId: 'csit121', name: 'Variables & Expressions', blurb: 'Data types, operators and evaluation order', color: '#0ea5e9', tint: '#e0f2fe', prereqs: [] },
  { id: 'p-cond', subjectId: 'csit121', name: 'Conditional Statements', blurb: 'if, else-if and boolean logic', color: '#de7a40', tint: '#fdeee3', prereqs: ['p-vars'] },
  { id: 'p-loops', subjectId: 'csit121', name: 'Loops', blurb: 'for and while, start, stop and update', color: '#f59e0b', tint: '#fef3dc', prereqs: ['p-cond'] },
  { id: 'p-arrays', subjectId: 'csit121', name: 'Arrays', blurb: 'Indexing and traversing lists of values', color: '#e5604d', tint: '#fde9e6', prereqs: ['p-loops'] },
  // CSIT221
  { id: 'd-bigo', subjectId: 'csit221', name: 'Algorithm Analysis (Big-O)', blurb: 'How running time grows with input size', color: '#8b5cf6', tint: '#f1ecfe', prereqs: ['p-loops'] },
  { id: 'd-stack', subjectId: 'csit221', name: 'Stacks & Queues', blurb: 'LIFO and FIFO collections', color: '#0ea5e9', tint: '#e0f2fe', prereqs: ['p-arrays'] },
  { id: 'd-list', subjectId: 'csit221', name: 'Linked Lists', blurb: 'Nodes joined by references', color: '#10b981', tint: '#e3f8f0', prereqs: ['p-arrays'] },
  { id: 'd-bst', subjectId: 'csit221', name: 'Binary Search Trees', blurb: 'Ordered trees for fast search', color: '#e5604d', tint: '#fde9e6', prereqs: ['d-list'] },
  // CSIT226
  { id: 'i-keys', subjectId: 'csit226', name: 'Relational Model & Keys', blurb: 'Tables, primary and foreign keys', color: '#10b981', tint: '#e3f8f0', prereqs: [] },
  { id: 'i-select', subjectId: 'csit226', name: 'SQL SELECT & Filtering', blurb: 'WHERE, ORDER BY, LIKE and COUNT', color: '#de7a40', tint: '#fdeee3', prereqs: ['i-keys'] },
  { id: 'i-joins', subjectId: 'csit226', name: 'SQL Joins', blurb: 'Combining rows from related tables', color: '#8b5cf6', tint: '#f1ecfe', prereqs: ['i-select'] },
  { id: 'i-norm', subjectId: 'csit226', name: 'Normalization', blurb: '1NF, 2NF and 3NF', color: '#f59e0b', tint: '#fef3dc', prereqs: ['i-keys'] },
];

export const COLLEGE_COMPETENCIES = [
  { id: 'c-p-vars', topicId: 'p-vars', code: 'CSIT121-CO1', text: 'Declares variables of suitable data types and evaluates expressions correctly.' },
  { id: 'c-p-cond', topicId: 'p-cond', code: 'CSIT121-CO2', text: 'Uses if and else-if statements and boolean operators to choose between paths.' },
  { id: 'c-p-loops', topicId: 'p-loops', code: 'CSIT121-CO3', text: 'Writes for and while loops with correct start, stop and update conditions.' },
  { id: 'c-p-arrays', topicId: 'p-arrays', code: 'CSIT121-CO4', text: 'Stores, accesses and traverses data in one-dimensional arrays.' },
  { id: 'c-d-bigo', topicId: 'd-bigo', code: 'CSIT221-CO1', text: 'Analyzes the running time of algorithms using Big-O notation.' },
  { id: 'c-d-stack', topicId: 'd-stack', code: 'CSIT221-CO2', text: 'Implements and applies stacks and queues.' },
  { id: 'c-d-list', topicId: 'd-list', code: 'CSIT221-CO3', text: 'Builds, traverses and updates singly linked lists.' },
  { id: 'c-d-bst', topicId: 'd-bst', code: 'CSIT221-CO4', text: 'Inserts, searches and traverses binary search trees.' },
  { id: 'c-i-keys', topicId: 'i-keys', code: 'CSIT226-CO1', text: 'Explains relations, primary keys and foreign keys.' },
  { id: 'c-i-select', topicId: 'i-select', code: 'CSIT226-CO2', text: 'Writes SQL queries that select, filter, sort and count rows.' },
  { id: 'c-i-joins', topicId: 'i-joins', code: 'CSIT226-CO3', text: 'Combines rows from related tables using joins.' },
  { id: 'c-i-norm', topicId: 'i-norm', code: 'CSIT226-CO4', text: 'Normalizes tables to remove redundancy (1NF, 2NF, 3NF).' },
];

/* Short lessons (English; the pages fall back to English for Filipino and Cebuano). */
export const COLLEGE_LESSONS = {
  'p-vars': { en: {
    summary: 'A variable is a named box with a type. The type decides what it can hold and how operators behave on it: int / int drops the remainder.',
    steps: ['Pick the type that fits: int for whole numbers, double for decimals, boolean for true/false.', 'Evaluate * / % before + −, left to right; use parentheses to be explicit.', 'Watch integer division: 7 / 2 is 3, but 7.0 / 2 is 3.5.'],
  } },
  'p-cond': { en: {
    summary: 'A condition is an expression that is true or false. if runs its block only when the condition is true; else-if checks the next condition only if the earlier ones were false.',
    steps: ['Write the condition with comparison operators: <, <=, >, >=, ==, !=.', 'Combine with && (both true) or || (at least one true); ! flips true and false.', 'In an if / else-if chain, only the first true branch runs.'],
  } },
  'p-loops': { en: {
    summary: 'A loop repeats a block while its condition stays true. Get three things right: where it starts, when it stops and how it moves.',
    steps: ['for (start; condition; update): count the values that make the condition true.', 'A while loop checks its condition first, so it may run zero times.', 'Trace small cases by hand: write the variable after every pass.'],
  } },
  'p-arrays': { en: {
    summary: 'An array stores many values of one type under one name. Elements are numbered from 0, so an array of length n has indices 0 to n − 1.',
    steps: ['a[0] is the first element; a[a.length − 1] is the last.', 'Traverse with for (int i = 0; i < a.length; i++).', 'An index outside 0 … n − 1 is an error, not a new element.'],
  } },
  'd-bigo': { en: {
    summary: 'Big-O describes how the number of steps grows as the input n grows. Count how many times the innermost statement runs and keep the fastest-growing term.',
    steps: ['One pass over n items is O(n); a loop inside a loop over n is O(n²).', 'Halving the work each step (like binary search) is O(log n).', 'Drop constants and smaller terms: 3n + 5 is O(n).'],
  } },
  'd-stack': { en: {
    summary: 'A stack is last in, first out (LIFO): push adds to the top, pop removes from the top. A queue is first in, first out (FIFO): enqueue at the rear, dequeue from the front.',
    steps: ['Stack: think of a pile of plates. The last one placed is the first taken.', 'Queue: think of a line at the cashier. The first to arrive is served first.', 'Stacks fit "undo" and matching brackets; queues fit scheduling and BFS.'],
  } },
  'd-list': { en: {
    summary: 'A singly linked list is a chain of nodes. Each node holds data and a reference to the next node; the last node points to null.',
    steps: ['Start at head and follow next to visit nodes in order.', 'Reaching the k-th node means walking k steps: O(k), unlike an array.', 'To insert or delete, change the next references around the node.'],
  } },
  'd-bst': { en: {
    summary: 'In a binary search tree, every value in a node\'s left subtree is smaller and every value in its right subtree is larger. That ordering makes search fast.',
    steps: ['Insert: start at the root, go left if smaller, right if larger, until an empty spot.', 'An in-order traversal (left, node, right) lists values in sorted order.', 'A balanced tree searches in O(log n); a tree built from sorted input becomes a chain, O(n).'],
  } },
  'i-keys': { en: {
    summary: 'A relational database stores data in tables (relations). A primary key uniquely identifies each row; a foreign key refers to a primary key in another table.',
    steps: ['A primary key must be unique and never NULL.', 'A foreign key links rows: Orders.student_id refers to Students.student_id.', 'When one column is not unique on its own, combine columns into a composite key.'],
  } },
  'i-select': { en: {
    summary: 'SELECT picks columns, FROM names the table, WHERE keeps only matching rows and ORDER BY sorts the result.',
    steps: ['SELECT name FROM students WHERE year_level = 2;', 'Use LIKE with % for patterns: LIKE \'Jo%\' means "starts with Jo".', 'Aggregate with COUNT, SUM, AVG; ORDER BY … DESC sorts from high to low.'],
  } },
  'i-joins': { en: {
    summary: 'A join combines rows from two tables, usually by matching a foreign key to the primary key it refers to.',
    steps: ['INNER JOIN keeps only rows that match in both tables.', 'LEFT JOIN keeps every row of the left table, with NULLs where nothing matches.', 'Write the match with ON: … JOIN courses c ON s.course_id = c.course_id.'],
  } },
  'i-norm': { en: {
    summary: 'Normalization splits tables so each fact is stored once, which prevents update, insert and delete anomalies.',
    steps: ['1NF: every column holds one atomic value; no repeating groups.', '2NF: no column depends on only part of a composite key.', '3NF: no column depends on another non-key column (no transitive dependency).'],
  } },
};

export const COLLEGE_MATERIALS = {
  'p-vars': [{ type: 'Video', title: 'Data types and integer division', minutes: 6 }, { type: 'Worksheet', title: 'Evaluate these expressions by hand', minutes: 8 }],
  'p-cond': [{ type: 'Video', title: 'if, else-if and boolean operators', minutes: 7 }, { type: 'Worksheet', title: 'Trace the branch: 10 short programs', minutes: 10 }],
  'p-loops': [{ type: 'Video', title: 'Tracing loops step by step', minutes: 8 }, { type: 'Worksheet', title: 'Off-by-one drills', minutes: 8 }],
  'p-arrays': [{ type: 'Video', title: 'Zero-based indexing explained', minutes: 5 }, { type: 'Worksheet', title: 'Array traversal practice', minutes: 9 }],
  'd-bigo': [{ type: 'Video', title: 'Counting steps: O(n), O(n²), O(log n)', minutes: 9 }, { type: 'Reading', title: 'Big-O cheat sheet', minutes: 5 }],
  'd-stack': [{ type: 'Video', title: 'Stacks vs queues in 6 minutes', minutes: 6 }, { type: 'Worksheet', title: 'Push, pop, enqueue, dequeue traces', minutes: 8 }],
  'd-list': [{ type: 'Video', title: 'Drawing linked lists with boxes and arrows', minutes: 7 }, { type: 'Worksheet', title: 'Insert and delete node exercises', minutes: 10 }],
  'd-bst': [{ type: 'Video', title: 'Building a BST by insertion', minutes: 7 }, { type: 'Worksheet', title: 'Traversal orders practice', minutes: 9 }],
  'i-keys': [{ type: 'Video', title: 'Primary vs foreign keys', minutes: 6 }, { type: 'Reading', title: 'Choosing a good primary key', minutes: 5 }],
  'i-select': [{ type: 'Video', title: 'SELECT, WHERE and ORDER BY', minutes: 8 }, { type: 'Worksheet', title: '15 SELECT queries to write', minutes: 12 }],
  'i-joins': [{ type: 'Video', title: 'INNER vs LEFT JOIN with diagrams', minutes: 8 }, { type: 'Worksheet', title: 'Join practice on a school database', minutes: 12 }],
  'i-norm': [{ type: 'Video', title: 'Normalization from 1NF to 3NF', minutes: 10 }, { type: 'Worksheet', title: 'Normalize these tables', minutes: 12 }],
};

/* Questions. Wrong options name the gap they point to (concept, careless, prerequisite);
   hints are revealed one at a time in practice and by the tutor. */
export const COLLEGE_QUESTIONS = [
  /* ---------- CSIT121: Variables & Expressions ---------- */
  {
    id: 'pv1', type: 'mc', topicId: 'p-vars', competencyId: 'c-p-vars', difficulty: 1,
    prompt: 'What is the value of x after:  int x = 7 / 2;',
    options: [
      { text: '3', correct: true },
      { text: '3.5', error: 'concept' },
      { text: '4', error: 'careless' },
      { text: '1', error: 'careless' },
    ],
    hints: ['Both 7 and 2 are int values.', 'int / int keeps only the whole-number part of the result.'],
    explanation: 'Both operands are int, so / does integer division and drops the remainder: 7 / 2 = 3.',
  },
  {
    id: 'pv2', type: 'id', topicId: 'p-vars', competencyId: 'c-p-vars', difficulty: 2,
    prompt: 'What is the value of a after:  int a = 2 + 3 * 4;',
    accept: ['14'],
    traps: [{ match: '20', error: 'concept' }, { match: '24', error: 'careless' }],
    hints: ['Which runs first, + or *?', 'Multiplication first: 3 * 4 = 12. Then add 2.'],
    explanation: '* is evaluated before +: 3 * 4 = 12, then 2 + 12 = 14.',
  },
  {
    id: 'pv3', type: 'tf', topicId: 'p-vars', competencyId: 'c-p-vars', difficulty: 1,
    prompt: 'The expression 10 % 3 evaluates to 1.',
    answer: true,
    hints: ['% gives the remainder of a division.', '10 = 3 × 3 + ?'],
    explanation: '% is the remainder operator: 10 = 3 × 3 + 1, so 10 % 3 is 1.',
  },
  {
    id: 'pv4', type: 'mc', topicId: 'p-vars', competencyId: 'c-p-vars', difficulty: 2,
    prompt: 'int count = 5;  count += 3 * 2;  What is count now?',
    options: [
      { text: '11', correct: true },
      { text: '16', error: 'concept' },
      { text: '6', error: 'careless' },
      { text: '10', error: 'careless' },
    ],
    hints: ['count += E means count = count + (E).', 'E is 3 * 2 = 6.'],
    explanation: 'count += 3 * 2 means count = count + (3 * 2) = 5 + 6 = 11.',
  },
  {
    id: 'pv5', type: 'mc', topicId: 'p-vars', competencyId: 'c-p-vars', difficulty: 3,
    prompt: 'double avg = 5 / 2;  What value does avg hold?',
    options: [
      { text: '2.0', correct: true },
      { text: '2.5', error: 'concept' },
      { text: '3.0', error: 'careless' },
      { text: 'It does not compile', error: 'concept' },
    ],
    hints: ['Look at the types on the right side of = first.', '5 / 2 is computed as int before it is stored in the double.'],
    explanation: '5 / 2 is integer division (2), and only then converted to double: 2.0. Write 5.0 / 2 to get 2.5.',
  },

  /* ---------- CSIT121: Conditional Statements ---------- */
  {
    id: 'pc1', type: 'mc', topicId: 'p-cond', competencyId: 'c-p-cond', difficulty: 1,
    prompt: 'int score = 75;  if (score >= 75) print("Pass"); else print("Fail");  What is printed?',
    options: [
      { text: 'Pass', correct: true },
      { text: 'Fail', error: 'concept' },
      { text: 'Pass Fail', error: 'concept' },
      { text: 'Nothing', error: 'careless' },
    ],
    hints: ['Is 75 >= 75 true or false?', '>= includes the equal case.'],
    explanation: '75 >= 75 is true (>= includes equality), so only the if branch runs: Pass.',
  },
  {
    id: 'pc2', type: 'id', topicId: 'p-cond', competencyId: 'c-p-cond', difficulty: 2,
    prompt: 'int x = 8;  if (x > 10) y = 1;  else if (x > 5) y = 2;  else y = 3;  What is y?',
    accept: ['2'],
    traps: [{ match: '1', error: 'concept' }, { match: '3', error: 'careless' }],
    hints: ['Check the conditions in order and stop at the first true one.', 'x > 10 is false; is x > 5 true?'],
    explanation: 'x > 10 is false, so the else-if is checked: x > 5 is true, y = 2. The final else is skipped.',
  },
  {
    id: 'pc3', type: 'tf', topicId: 'p-cond', competencyId: 'c-p-cond', difficulty: 1,
    prompt: '(5 > 3) && (2 > 4) is true.',
    answer: false,
    hints: ['&& is true only when both sides are true.', 'Is 2 > 4?'],
    explanation: '&& needs both sides true; 2 > 4 is false, so the whole expression is false.',
  },
  {
    id: 'pc4', type: 'mc', topicId: 'p-cond', competencyId: 'c-p-cond', difficulty: 2,
    prompt: 'Which condition is true only when n is from 1 to 10, inclusive?',
    options: [
      { text: 'n >= 1 && n <= 10', correct: true },
      { text: 'n >= 1 || n <= 10', error: 'concept' },
      { text: '1 <= n <= 10', error: 'concept' },
      { text: 'n > 1 && n < 10', error: 'careless' },
    ],
    hints: ['Both limits must hold at the same time.', '"Inclusive" means 1 and 10 themselves count.'],
    explanation: 'Both bounds must hold, so use &&, and inclusive bounds need >= and <=. With ||, every n passes.',
  },
  {
    id: 'pc5', type: 'id', topicId: 'p-cond', competencyId: 'c-p-cond', difficulty: 3,
    prompt: 'boolean a = true, b = false;  What is the value of  !(a || b) ?',
    accept: ['false'],
    traps: [{ match: 'true', error: 'concept' }],
    hints: ['Work inside the parentheses first: a || b.', 'true || false is true; then ! flips it.'],
    explanation: 'a || b is true (one side is true), and ! flips it: false.',
  },

  /* ---------- CSIT121: Loops ---------- */
  {
    id: 'pl1', type: 'mc', topicId: 'p-loops', competencyId: 'c-p-loops', difficulty: 1,
    prompt: 'How many times does the body run?  for (int i = 0; i < 5; i++) print(i);',
    options: [
      { text: '5', correct: true },
      { text: '4', error: 'careless' },
      { text: '6', error: 'concept' },
      { text: 'Forever', error: 'concept' },
    ],
    hints: ['List the values of i that make i < 5 true.', 'i takes 0, 1, 2, 3, 4.'],
    explanation: 'i takes 0, 1, 2, 3, 4: five values make i < 5 true, so the body runs 5 times.',
  },
  {
    id: 'pl2', type: 'id', topicId: 'p-loops', competencyId: 'c-p-loops', difficulty: 2,
    prompt: 'What is sum after:  int sum = 0;  for (int i = 1; i <= 4; i++) sum += i;',
    accept: ['10'],
    traps: [{ match: '6', error: 'careless' }, { match: '4', error: 'concept' }],
    hints: ['Which values does i take? Note the <=.', 'sum = 1 + 2 + 3 + 4.'],
    explanation: 'i runs 1, 2, 3, 4 (<= includes 4), so sum = 1 + 2 + 3 + 4 = 10.',
  },
  {
    id: 'pl3', type: 'tf', topicId: 'p-loops', competencyId: 'c-p-loops', difficulty: 1,
    prompt: 'A while loop always runs its body at least once.',
    answer: false,
    hints: ['When does a while loop check its condition?', 'Compare it with a do-while loop.'],
    explanation: 'while checks the condition first, so it can run zero times. Only do-while always runs once.',
  },
  {
    id: 'pl4', type: 'mc', topicId: 'p-loops', competencyId: 'c-p-loops', difficulty: 2,
    prompt: 'int i = 10;  while (i > 0) { i -= 3; }  What is i after the loop?',
    options: [
      { text: '-2', correct: true },
      { text: '1', error: 'concept' },
      { text: '0', error: 'careless' },
      { text: '-3', error: 'careless' },
    ],
    hints: ['Write i after every pass: 10, 7, …', 'The loop stops only when i > 0 becomes false.'],
    explanation: 'i goes 10 → 7 → 4 → 1 → -2. At 1 the condition is still true, so it subtracts once more; -2 stops it.',
  },
  {
    id: 'pl5', type: 'mc', topicId: 'p-loops', competencyId: 'c-p-loops', difficulty: 3,
    prompt: 'int count = 0;  for (int i = 0; i < 3; i++)  for (int j = 0; j < 4; j++)  count++;  What is count?',
    options: [
      { text: '12', correct: true },
      { text: '7', error: 'concept' },
      { text: '4', error: 'concept' },
      { text: '16', error: 'careless' },
    ],
    hints: ['The inner loop runs completely for each pass of the outer loop.', 'Outer: 3 passes. Inner: 4 each time.'],
    explanation: 'The inner loop runs 4 times for each of the 3 outer passes: 3 × 4 = 12.',
  },

  /* ---------- CSIT121: Arrays ---------- */
  {
    id: 'pa1', type: 'mc', topicId: 'p-arrays', competencyId: 'c-p-arrays', difficulty: 1,
    prompt: 'int[] a = {4, 8, 15, 16, 23};  What is a[2]?',
    options: [
      { text: '15', correct: true },
      { text: '8', error: 'concept' },
      { text: '16', error: 'careless' },
      { text: '4', error: 'careless' },
    ],
    hints: ['Indexing starts at 0.', 'a[0] = 4, a[1] = 8, a[2] = ?'],
    explanation: 'Arrays are zero-based: a[0] = 4, a[1] = 8, a[2] = 15.',
  },
  {
    id: 'pa2', type: 'id', topicId: 'p-arrays', competencyId: 'c-p-arrays', difficulty: 2,
    prompt: 'int[] a = {3, 6, 9};  What is the index of the last element?',
    accept: ['2'],
    traps: [{ match: '3', error: 'concept' }],
    hints: ['The array has 3 elements.', 'Indices run from 0 to length − 1.'],
    explanation: 'Three elements have indices 0, 1, 2, so the last index is a.length − 1 = 2.',
  },
  {
    id: 'pa3', type: 'tf', topicId: 'p-arrays', competencyId: 'c-p-arrays', difficulty: 1,
    prompt: 'For an array of length n, the valid indices are 0 to n − 1.',
    answer: true,
    hints: ['Where does the first index start?', 'Count n indices starting from 0.'],
    explanation: 'Indices start at 0, so n elements use 0, 1, …, n − 1.',
  },
  {
    id: 'pa4', type: 'mc', topicId: 'p-arrays', competencyId: 'c-p-arrays', difficulty: 2,
    prompt: 'What does this compute?  int t = 0;  for (int i = 0; i < a.length; i++) t += a[i];',
    options: [
      { text: 'The sum of all elements', correct: true },
      { text: 'The number of elements', error: 'concept' },
      { text: 'The largest element', error: 'concept' },
      { text: 'The last element', error: 'careless' },
    ],
    hints: ['What is added to t on each pass?', 't += a[i] adds the element, not 1.'],
    explanation: 'Each pass adds the element a[i] to t, visiting every index, so t ends as the sum.',
  },
  {
    id: 'pa5', type: 'mc', topicId: 'p-arrays', competencyId: 'c-p-arrays', difficulty: 3,
    prompt: 'int[] a = new int[5];  What happens on  a[5] = 1;  in Java?',
    options: [
      { text: 'An ArrayIndexOutOfBoundsException at run time', correct: true },
      { text: 'The array grows to 6 elements', error: 'concept' },
      { text: 'It sets the last element to 1', error: 'concept' },
      { text: 'Nothing; the line is ignored', error: 'careless' },
    ],
    hints: ['What are the valid indices of a length-5 array?', 'Java arrays never change size.'],
    explanation: 'Valid indices are 0–4, and Java arrays have a fixed size, so a[5] throws ArrayIndexOutOfBoundsException.',
  },

  /* ---------- CSIT221: Algorithm Analysis ---------- */
  {
    id: 'db1', type: 'mc', topicId: 'd-bigo', competencyId: 'c-d-bigo', difficulty: 1,
    prompt: 'A loop visits each of n elements once. What is its time complexity?',
    options: [
      { text: 'O(n)', correct: true },
      { text: 'O(1)', error: 'concept' },
      { text: 'O(n²)', error: 'concept' },
      { text: 'O(log n)', error: 'careless' },
    ],
    hints: ['How many times does the body run for n elements?', 'The work grows in direct proportion to n.'],
    explanation: 'The body runs n times, so the work grows linearly with n: O(n).',
  },
  {
    id: 'db2', type: 'id', topicId: 'd-bigo', competencyId: 'c-d-bigo', difficulty: 2,
    prompt: 'A loop runs n times, and inside it another loop runs n times. Write its Big-O, e.g. O(n).',
    accept: ['O(n^2)', 'O(n²)', 'O(n*n)', 'n^2', 'n²'],
    traps: [{ match: 'O(n)', error: 'prerequisite' }, { match: 'O(2n)', error: 'concept' }],
    hints: ['How many times does the inner body run for one outer pass?', 'n outer passes × n inner passes.'],
    explanation: 'The inner body runs n times for each of the n outer passes: n × n = n², so O(n²).',
  },
  {
    id: 'db3', type: 'tf', topicId: 'd-bigo', competencyId: 'c-d-bigo', difficulty: 1,
    prompt: 'Binary search on a sorted array of n items runs in O(log n) time.',
    answer: true,
    hints: ['What happens to the search range after each comparison?', 'Halving n repeatedly takes about log₂ n steps.'],
    explanation: 'Each comparison halves the remaining range, so it takes about log₂ n steps: O(log n).',
  },
  {
    id: 'db4', type: 'mc', topicId: 'd-bigo', competencyId: 'c-d-bigo', difficulty: 2,
    prompt: 'For very large n, which running time is the fastest?',
    options: [
      { text: 'O(log n)', correct: true },
      { text: 'O(n)', error: 'concept' },
      { text: 'O(n log n)', error: 'concept' },
      { text: 'O(n²)', error: 'careless' },
    ],
    hints: ['Try n = 1,000,000 in each.', 'log₂ of a million is only about 20.'],
    explanation: 'For n = 1,000,000: log n ≈ 20, n = 10⁶, n log n ≈ 2×10⁷, n² = 10¹². O(log n) grows slowest.',
  },
  {
    id: 'db5', type: 'mc', topicId: 'd-bigo', competencyId: 'c-d-bigo', difficulty: 3,
    prompt: 'for (int i = 1; i < n; i = i * 2) count++;  What is its Big-O?',
    options: [
      { text: 'O(log n)', correct: true },
      { text: 'O(n)', error: 'concept' },
      { text: 'O(n / 2)', error: 'concept' },
      { text: 'O(1)', error: 'careless' },
    ],
    hints: ['Look at the update: i doubles each pass.', 'How many doublings take 1 up to n?'],
    explanation: 'i goes 1, 2, 4, 8, … and reaches n after about log₂ n doublings: O(log n).',
  },

  /* ---------- CSIT221: Stacks & Queues ---------- */
  {
    id: 'ds1', type: 'mc', topicId: 'd-stack', competencyId: 'c-d-stack', difficulty: 1,
    prompt: 'In what order does a stack remove items?',
    options: [
      { text: 'Last in, first out (LIFO)', correct: true },
      { text: 'First in, first out (FIFO)', error: 'concept' },
      { text: 'Smallest value first', error: 'concept' },
      { text: 'Random order', error: 'careless' },
    ],
    hints: ['Picture a pile of plates.', 'Which plate do you take off first?'],
    explanation: 'A stack pops the most recently pushed item first: last in, first out.',
  },
  {
    id: 'ds2', type: 'id', topicId: 'd-stack', competencyId: 'c-d-stack', difficulty: 2,
    prompt: 'push 1, push 2, push 3, then pop once. Which value is now on top of the stack?',
    accept: ['2'],
    traps: [{ match: '3', error: 'careless' }, { match: '1', error: 'concept' }],
    hints: ['After the pushes the top is 3.', 'pop removes the top.'],
    explanation: 'After pushing 1, 2, 3 the top is 3. pop removes 3, so 2 is now on top.',
  },
  {
    id: 'ds3', type: 'tf', topicId: 'd-stack', competencyId: 'c-d-stack', difficulty: 1,
    prompt: 'A queue adds items at the rear and removes them from the front.',
    answer: true,
    hints: ['Picture a line at the cashier.', 'Who is served first?'],
    explanation: 'A queue is FIFO: enqueue at the rear, dequeue from the front.',
  },
  {
    id: 'ds4', type: 'mc', topicId: 'd-stack', competencyId: 'c-d-stack', difficulty: 2,
    prompt: 'enqueue A, enqueue B, enqueue C, then dequeue twice. What is at the front?',
    options: [
      { text: 'C', correct: true },
      { text: 'A', error: 'concept' },
      { text: 'B', error: 'careless' },
      { text: 'The queue is empty', error: 'careless' },
    ],
    hints: ['A queue removes the oldest item first.', 'The two dequeues remove A, then B.'],
    explanation: 'Dequeue removes from the front in arrival order: A, then B. C is left at the front.',
  },
  {
    id: 'ds5', type: 'mc', topicId: 'd-stack', competencyId: 'c-d-stack', difficulty: 3,
    prompt: 'Which structure is best for checking balanced brackets such as (a[b]{c})?',
    options: [
      { text: 'A stack', correct: true },
      { text: 'A queue', error: 'concept' },
      { text: 'A sorted array', error: 'concept' },
      { text: 'A binary search tree', error: 'careless' },
    ],
    hints: ['Which opening bracket must the next closing bracket match?', 'The most recent unmatched one: last in, first out.'],
    explanation: 'Each closing bracket must match the most recent unmatched opening bracket, which is exactly what a stack gives.',
  },

  /* ---------- CSIT221: Linked Lists ---------- */
  {
    id: 'dl1', type: 'mc', topicId: 'd-list', competencyId: 'c-d-list', difficulty: 1,
    prompt: 'In a singly linked list, each node stores its data and…',
    options: [
      { text: 'a reference to the next node', correct: true },
      { text: 'its index in the list', error: 'concept' },
      { text: 'references to every other node', error: 'concept' },
      { text: 'the length of the list', error: 'careless' },
    ],
    hints: ['How do you get from one node to the following one?', '"Singly" means one link per node.'],
    explanation: 'A node holds data and one reference, next, to the following node; the last node\'s next is null.',
  },
  {
    id: 'dl2', type: 'mc', topicId: 'd-list', competencyId: 'c-d-list', difficulty: 2,
    prompt: 'How long does it take to reach the k-th element of a singly linked list?',
    options: [
      { text: 'O(k): walk from the head', correct: true },
      { text: 'O(1), like an array', error: 'prerequisite' },
      { text: 'O(log k)', error: 'concept' },
      { text: 'O(k²)', error: 'careless' },
    ],
    hints: ['Is there an index you can jump to?', 'You can only follow next, one node at a time.'],
    explanation: 'There is no index to jump to; you follow next from the head k times: O(k).',
  },
  {
    id: 'dl3', type: 'tf', topicId: 'd-list', competencyId: 'c-d-list', difficulty: 1,
    prompt: 'Inserting a new node at the head of a singly linked list takes O(1) time.',
    answer: true,
    hints: ['How many references change?', 'newNode.next = head; head = newNode.'],
    explanation: 'Only two references change (newNode.next = head; head = newNode), no matter how long the list is.',
  },
  {
    id: 'dl4', type: 'id', topicId: 'd-list', competencyId: 'c-d-list', difficulty: 2,
    prompt: 'head → 5 → 9 → 2 → null.  After  head = head.next;  what value is at the head?',
    accept: ['9'],
    traps: [{ match: '5', error: 'concept' }, { match: '2', error: 'careless' }],
    hints: ['head.next is the node after the head.', 'The node after 5 holds…'],
    explanation: 'head.next is the node holding 9, so after the assignment the list starts at 9.',
  },
  {
    id: 'dl5', type: 'mc', topicId: 'd-list', competencyId: 'c-d-list', difficulty: 3,
    prompt: 'To delete node B from A → B → C, which update is needed?',
    options: [
      { text: 'A.next = C  (that is, A.next = B.next)', correct: true },
      { text: 'B = null', error: 'concept' },
      { text: 'C.next = A', error: 'concept' },
      { text: 'A.next = null', error: 'careless' },
    ],
    hints: ['Which node points to B?', 'Make that node skip over B.'],
    explanation: 'A points to B; make A point past it to C (A.next = B.next). Setting B = null leaves A still pointing to B.',
  },

  /* ---------- CSIT221: Binary Search Trees ---------- */
  {
    id: 'dt1', type: 'mc', topicId: 'd-bst', competencyId: 'c-d-bst', difficulty: 1,
    prompt: 'In a binary search tree, where is a value smaller than the root stored?',
    options: [
      { text: 'In the left subtree', correct: true },
      { text: 'In the right subtree', error: 'concept' },
      { text: 'At the root', error: 'careless' },
      { text: 'Anywhere in the tree', error: 'concept' },
    ],
    hints: ['A BST keeps values in order around each node.', 'Smaller goes one way, larger the other.'],
    explanation: 'In a BST every value in a node\'s left subtree is smaller and every value in its right subtree is larger.',
  },
  {
    id: 'dt2', type: 'id', topicId: 'd-bst', competencyId: 'c-d-bst', difficulty: 2,
    prompt: 'Insert 8, 3, 10, 1, 6 into an empty BST in that order. What value is at the root?',
    accept: ['8'],
    traps: [{ match: '6', error: 'concept' }, { match: '1', error: 'careless' }],
    hints: ['The first value inserted into an empty tree becomes…', 'Later values are placed below it.'],
    explanation: 'The first value inserted becomes the root (8); the rest go below it, and the root never changes on insert.',
  },
  {
    id: 'dt3', type: 'tf', topicId: 'd-bst', competencyId: 'c-d-bst', difficulty: 1,
    prompt: 'An in-order traversal of a BST visits its values in sorted order.',
    answer: true,
    hints: ['In-order means: left subtree, node, right subtree.', 'Left values are smaller, right values larger.'],
    explanation: 'In-order visits left (smaller), then the node, then right (larger), so values come out sorted.',
  },
  {
    id: 'dt4', type: 'mc', topicId: 'd-bst', competencyId: 'c-d-bst', difficulty: 2,
    prompt: 'Insert 50, 30, 70, 20 into an empty BST. Where does 20 go?',
    options: [
      { text: 'Left child of 30', correct: true },
      { text: 'Right child of 30', error: 'concept' },
      { text: 'Left child of 70', error: 'careless' },
      { text: 'Right child of 50', error: 'concept' },
    ],
    hints: ['Start at the root 50: is 20 smaller or larger?', 'Then compare 20 with 30.'],
    explanation: '20 < 50 → go left to 30; 20 < 30 → go left, an empty spot: the left child of 30.',
  },
  {
    id: 'dt5', type: 'mc', topicId: 'd-bst', competencyId: 'c-d-bst', difficulty: 3,
    prompt: 'Inserting the sorted values 1, 2, 3, 4, 5 into a plain BST makes searching…',
    options: [
      { text: 'O(n), because the tree becomes a chain', correct: true },
      { text: 'O(log n), as always', error: 'concept' },
      { text: 'O(1)', error: 'careless' },
      { text: 'O(n²)', error: 'concept' },
    ],
    hints: ['Draw the tree: where does each new, larger value go?', 'Every node gets only a right child.'],
    explanation: 'Each larger value becomes a right child, so the tree is a chain like a linked list and search is O(n).',
  },

  /* ---------- CSIT226: Relational Model & Keys ---------- */
  {
    id: 'ik1', type: 'mc', topicId: 'i-keys', competencyId: 'c-i-keys', difficulty: 1,
    prompt: 'What does a primary key guarantee?',
    options: [
      { text: 'Each row can be uniquely identified', correct: true },
      { text: 'The column is kept sorted', error: 'concept' },
      { text: 'The column links to another table', error: 'concept' },
      { text: 'The value can never be updated', error: 'careless' },
    ],
    hints: ['Think of a student ID number.', 'No two rows may share it.'],
    explanation: 'A primary key is unique and not NULL, so it identifies exactly one row. Linking to another table is a foreign key\'s job.',
  },
  {
    id: 'ik2', type: 'mc', topicId: 'i-keys', competencyId: 'c-i-keys', difficulty: 2,
    prompt: 'Orders(order_id, student_id, …), where student_id refers to Students(student_id). In Orders, student_id is a…',
    options: [
      { text: 'Foreign key', correct: true },
      { text: 'Primary key', error: 'concept' },
      { text: 'Candidate key of Orders', error: 'concept' },
      { text: 'Composite key', error: 'careless' },
    ],
    hints: ['Does student_id identify an order, or point to a student?', 'A column that refers to another table\'s primary key is…'],
    explanation: 'student_id in Orders refers to the primary key of Students, which makes it a foreign key.',
  },
  {
    id: 'ik3', type: 'tf', topicId: 'i-keys', competencyId: 'c-i-keys', difficulty: 1,
    prompt: 'A primary key column may contain NULL values.',
    answer: false,
    hints: ['A primary key must identify every row.', 'Can a missing value identify a row?'],
    explanation: 'A primary key must be unique and NOT NULL; a NULL could not identify its row.',
  },
  {
    id: 'ik4', type: 'id', topicId: 'i-keys', competencyId: 'c-i-keys', difficulty: 2,
    prompt: 'In relational database terms, a table is called a ______.',
    accept: ['relation'],
    traps: [{ match: 'tuple', error: 'concept' }, { match: 'attribute', error: 'concept' }],
    hints: ['A row is a tuple and a column is an attribute.', 'The whole table gives the "relational" model its name.'],
    explanation: 'A table is a relation; its rows are tuples and its columns are attributes.',
  },
  {
    id: 'ik5', type: 'mc', topicId: 'i-keys', competencyId: 'c-i-keys', difficulty: 3,
    prompt: 'Enrollment(student_id, course_id, enrolled_on): a student takes each course once. What is the best primary key?',
    options: [
      { text: '(student_id, course_id)', correct: true },
      { text: 'student_id', error: 'concept' },
      { text: 'enrolled_on', error: 'concept' },
      { text: 'course_id', error: 'careless' },
    ],
    hints: ['Can one student appear in many rows?', 'Which pair of columns never repeats?'],
    explanation: 'A student has many enrollments and a course has many students; only the pair (student_id, course_id) is unique.',
  },

  /* ---------- CSIT226: SQL SELECT ---------- */
  {
    id: 'is1', type: 'mc', topicId: 'i-select', competencyId: 'c-i-select', difficulty: 1,
    prompt: 'Which clause keeps only the rows that match a condition in a SELECT?',
    options: [
      { text: 'WHERE', correct: true },
      { text: 'ORDER BY', error: 'concept' },
      { text: 'GROUP BY', error: 'concept' },
      { text: 'FROM', error: 'careless' },
    ],
    hints: ['ORDER BY sorts; it does not remove rows.', 'Which clause holds a condition like year_level = 2?'],
    explanation: 'WHERE filters rows by a condition; ORDER BY only sorts and GROUP BY groups.',
  },
  {
    id: 'is2', type: 'id', topicId: 'i-select', competencyId: 'c-i-select', difficulty: 2,
    prompt: 'Complete the query:  SELECT name FROM students ______ year_level = 2;',
    accept: ['WHERE'],
    traps: [{ match: 'HAVING', error: 'concept' }, { match: 'IF', error: 'concept' }],
    hints: ['You are filtering rows, not groups.', 'HAVING filters groups after GROUP BY.'],
    explanation: 'Filtering individual rows uses WHERE. HAVING is for filtering groups after GROUP BY.',
  },
  {
    id: 'is3', type: 'tf', topicId: 'i-select', competencyId: 'c-i-select', difficulty: 1,
    prompt: 'ORDER BY name DESC sorts names from Z to A.',
    answer: true,
    hints: ['DESC means descending.', 'For text, descending runs from the end of the alphabet.'],
    explanation: 'DESC sorts in descending order: Z to A for text, high to low for numbers.',
  },
  {
    id: 'is4', type: 'mc', topicId: 'i-select', competencyId: 'c-i-select', difficulty: 2,
    prompt: 'Which query counts the students in year 2?',
    options: [
      { text: 'SELECT COUNT(*) FROM students WHERE year_level = 2;', correct: true },
      { text: 'SELECT SUM(*) FROM students WHERE year_level = 2;', error: 'concept' },
      { text: 'SELECT COUNT(*) FROM students ORDER BY year_level = 2;', error: 'concept' },
      { text: 'SELECT COUNT(*) FROM students WHERE year_level == 2;', error: 'careless' },
    ],
    hints: ['Which function counts rows?', 'SQL compares with a single =.'],
    explanation: 'COUNT(*) counts the rows WHERE keeps. SUM adds values, ORDER BY does not filter, and SQL uses = not ==.',
  },
  {
    id: 'is5', type: 'mc', topicId: 'i-select', competencyId: 'c-i-select', difficulty: 3,
    prompt: 'Which condition finds names that start with "Jo"?',
    options: [
      { text: "WHERE name LIKE 'Jo%'", correct: true },
      { text: "WHERE name = 'Jo%'", error: 'concept' },
      { text: "WHERE name LIKE '%Jo'", error: 'careless' },
      { text: "WHERE name IN ('Jo')", error: 'concept' },
    ],
    hints: ['% matches any run of characters, but only with LIKE.', 'Where should % go to mean "anything after Jo"?'],
    explanation: "LIKE 'Jo%' means Jo followed by anything. '%Jo' means ending with Jo, and = treats % as a literal character.",
  },

  /* ---------- CSIT226: Joins ---------- */
  {
    id: 'ij1', type: 'mc', topicId: 'i-joins', competencyId: 'c-i-joins', difficulty: 1,
    prompt: 'An INNER JOIN returns…',
    options: [
      { text: 'only the rows that match in both tables', correct: true },
      { text: 'every row from both tables', error: 'concept' },
      { text: 'every row from the left table', error: 'concept' },
      { text: 'only the rows with no match', error: 'careless' },
    ],
    hints: ['"Inner" means the overlap of the two tables.', 'A row without a partner is dropped.'],
    explanation: 'INNER JOIN keeps only pairs of rows that satisfy the join condition; unmatched rows are dropped.',
  },
  {
    id: 'ij2', type: 'mc', topicId: 'i-joins', competencyId: 'c-i-joins', difficulty: 2,
    prompt: 'Which join lists every student, even those with no enrollment?',
    options: [
      { text: 'students LEFT JOIN enrollments', correct: true },
      { text: 'students INNER JOIN enrollments', error: 'concept' },
      { text: 'students RIGHT JOIN enrollments', error: 'careless' },
      { text: 'students CROSS JOIN enrollments', error: 'concept' },
    ],
    hints: ['You must keep all rows of one table.', 'Students is written on the left.'],
    explanation: 'LEFT JOIN keeps every row of the left table (students), with NULLs where no enrollment matches.',
  },
  {
    id: 'ij3', type: 'tf', topicId: 'i-joins', competencyId: 'c-i-joins', difficulty: 1,
    prompt: 'A join condition usually matches a foreign key to the primary key it refers to.',
    answer: true,
    hints: ['How are the two tables related?', 'Think of enrollments.student_id and students.student_id.'],
    explanation: 'Related tables are linked by a foreign key, so joins usually match it to the primary key it references.',
  },
  {
    id: 'ij4', type: 'id', topicId: 'i-joins', competencyId: 'c-i-joins', difficulty: 2,
    prompt: 'Complete:  SELECT s.name, c.title FROM students s JOIN courses c ____ s.course_id = c.course_id;',
    accept: ['ON'],
    traps: [{ match: 'WHERE', error: 'concept' }, { match: 'USING', error: 'careless' }],
    hints: ['A JOIN states its matching condition right after the table.', 'The keyword has two letters.'],
    explanation: 'The join condition follows ON. (USING takes a column list instead, e.g. USING (course_id).)',
  },
  {
    id: 'ij5', type: 'mc', topicId: 'i-joins', competencyId: 'c-i-joins', difficulty: 3,
    prompt: 'students has 3 rows and courses has 4. How many rows does students CROSS JOIN courses return?',
    options: [
      { text: '12', correct: true },
      { text: '7', error: 'concept' },
      { text: '4', error: 'careless' },
      { text: '3', error: 'careless' },
    ],
    hints: ['A cross join pairs every row with every row.', 'Each of 3 students pairs with each of 4 courses.'],
    explanation: 'A CROSS JOIN pairs every row of one table with every row of the other: 3 × 4 = 12.',
  },

  /* ---------- CSIT226: Normalization ---------- */
  {
    id: 'in1', type: 'mc', topicId: 'i-norm', competencyId: 'c-i-norm', difficulty: 1,
    prompt: 'A table is in First Normal Form (1NF) when…',
    options: [
      { text: 'every column holds a single, atomic value', correct: true },
      { text: 'it has no foreign keys', error: 'concept' },
      { text: 'it has exactly one column', error: 'careless' },
      { text: 'every column is part of the key', error: 'concept' },
    ],
    hints: ['1NF is about what one cell may hold.', 'No lists or repeating groups in a cell.'],
    explanation: '1NF requires atomic values: one value per cell and no repeating groups.',
  },
  {
    id: 'in2', type: 'mc', topicId: 'i-norm', competencyId: 'c-i-norm', difficulty: 2,
    prompt: 'Students(student_id, name, phone1, phone2, phone3). What is the design problem?',
    options: [
      { text: 'A repeating group: phone numbers belong in their own table', correct: true },
      { text: 'It has a primary key', error: 'concept' },
      { text: 'Names must be unique', error: 'concept' },
      { text: 'It has too few columns', error: 'careless' },
    ],
    hints: ['What if a student has four phone numbers?', 'phone1, phone2, phone3 are the same kind of fact repeated.'],
    explanation: 'phone1–phone3 are a repeating group. Move phones to StudentPhones(student_id, phone) to fix it.',
  },
  {
    id: 'in3', type: 'tf', topicId: 'i-norm', competencyId: 'c-i-norm', difficulty: 1,
    prompt: 'Normalization reduces duplicate data and update anomalies.',
    answer: true,
    hints: ['What happens if the same fact is stored in many rows?', 'Normalization stores each fact once.'],
    explanation: 'By storing each fact once, normalization removes redundancy and the anomalies it causes.',
  },
  {
    id: 'in4', type: 'id', topicId: 'i-norm', competencyId: 'c-i-norm', difficulty: 2,
    prompt: 'Enrollment(student_id, course_id, course_title): course_title depends only on course_id. Which normal form does this break? (e.g. 1NF)',
    accept: ['2NF', 'second normal form'],
    traps: [{ match: '1NF', error: 'concept' }, { match: '3NF', error: 'careless' }],
    hints: ['The key is (student_id, course_id).', 'course_title depends on only part of that key.'],
    explanation: 'The key is (student_id, course_id) and course_title depends on only part of it: a partial dependency, so 2NF is broken.',
  },
  {
    id: 'in5', type: 'mc', topicId: 'i-norm', competencyId: 'c-i-norm', difficulty: 3,
    prompt: 'Students(student_id, program_code, program_name): program_name depends on program_code, not on the key. This is a…',
    options: [
      { text: 'Transitive dependency (fix it for 3NF)', correct: true },
      { text: 'Partial dependency (fix it for 2NF)', error: 'concept' },
      { text: 'Repeating group (fix it for 1NF)', error: 'concept' },
      { text: 'Not a problem', error: 'careless' },
    ],
    hints: ['The key is a single column, student_id.', 'student_id → program_code → program_name.'],
    explanation: 'student_id → program_code → program_name is a transitive dependency. Move programs to their own table for 3NF.',
  },
];

/* One diagnostic per subject: two questions per topic, mixed types. */
export const COLLEGE_DIAGNOSTICS = [
  {
    id: 'diag-csit121', subjectId: 'csit121', courseCode: 'CSIT121', title: 'CSIT121 Programming Diagnostic',
    description: 'Variables, conditionals, loops and arrays: finds where your programming foundation needs work.',
    minutes: 8, builtIn: true,
    questionIds: ['pv1', 'pv2', 'pc1', 'pc2', 'pl1', 'pl2', 'pa1', 'pa4'],
  },
  {
    id: 'diag-csit221', subjectId: 'csit221', courseCode: 'CSIT221', title: 'CSIT221 Data Structures Diagnostic',
    description: 'Big-O, stacks and queues, linked lists and BSTs; gaps from programming basics show up as prerequisites.',
    minutes: 8, builtIn: true,
    questionIds: ['db1', 'db2', 'ds1', 'ds2', 'dl1', 'dl4', 'dt1', 'dt2'],
  },
  {
    id: 'diag-csit226', subjectId: 'csit226', courseCode: 'CSIT226', title: 'CSIT226 Databases Diagnostic',
    description: 'Keys, SELECT, joins and normalization: maps your SQL and database design gaps.',
    minutes: 8, builtIn: true,
    questionIds: ['ik1', 'ik2', 'is1', 'is2', 'ij1', 'ij2', 'in1', 'in4'],
  },
];
