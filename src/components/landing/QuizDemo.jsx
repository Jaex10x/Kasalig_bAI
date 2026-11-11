import { useState, useEffect, useRef } from 'react';
import {
  CloseIcon,
  ChevronDownIcon,
  StopwatchIcon,
  CheckIcon,
  KeyIcon,
  BookOpenIcon,
  GamepadIcon,
} from './Icons';
import { Fireworks } from './Fireworks';

/* ---------------------------------------------------------------------------
 * QuizDemo: a display-only, self-playing preview of a diagnostic quiz.
 * A simulated cursor answers each question in QUESTIONS in turn; every correct
 * answer sets off fireworks, then the card moves on to the next question and
 * finally loops back to the first. Visitors cannot interact with the card.
 *
 * Two kinds of question:
 *  - 'choice': multiple choice. The prompt reads `{before} ____ {after}` and the
 *    blank fills in with the correct option. `decoyIndex` is the wrong option
 *    the cursor hovers first, before settling on `answerIndex`.
 *  - 'solve': a worked problem. Each entry in `steps` is typed out line by line
 *    in the solution pad under the question (the last step is the answer), then
 *    the cursor clicks "Check answer".
 * ------------------------------------------------------------------------- */
const QUESTIONS = [
  {
    id: 'moon-days',
    type: 'choice',
    before: 'The Moon is slowly moving away from Earth, causing our planetary days to gradually',
    after: '.',
    options: ['shorten', 'accelerate', 'lengthen', 'stabilize'],
    answerIndex: 2,
    decoyIndex: 1,
  },
  {
    id: 'quadratic-roots',
    type: 'solve',
    prompt: 'Solve the quadratic equation x² − 5x + 6 = 0. Show your solution below.',
    steps: [
      { text: '(x − 2)(x − 3) = 0', note: 'Factor' },
      { text: 'x − 2 = 0 or x − 3 = 0', note: 'Zero-product rule' },
      { text: 'x = 2 or x = 3', note: 'Solve each factor' },
    ],
  },
];
const OPTION_KEYS = ['A', 'B', 'C', 'D'];

const BASE_XP = 680;
const XP_PER_QUESTION = 100;
const BASE_PROGRESS = 50; // progress bar %, before the first answer
const PROGRESS_PER_QUESTION = 25;

// Timeline of a question, in ms from the moment it appears.
// Multiple choice:
const HOVER_DECOY_AT = 1200;
const HOVER_ANSWER_AT = 2200;
const CHOICE_CLICK_AT = 3000;
// Worked problem:
const FOCUS_PAD_AT = 500;
const TYPE_START_AT = 1000;
const TYPE_MS = 32; // per character
const LINE_PAUSE_MS = 350; // breather after each line
const HOVER_CHECK_AFTER = 250; // after the last line is typed
const CLICK_CHECK_AFTER = 1100;
// After the answering click, for both kinds:
const RELEASE_AFTER = 500;
const SPARKLE_END_AFTER = 2200;
const NEXT_QUESTION_AFTER = 2800;

const typingDuration = (q) =>
  q.steps.reduce((ms, step) => ms + step.text.length * TYPE_MS + LINE_PAUSE_MS, 0);
const clickTime = (q) =>
  q.type === 'solve' ? TYPE_START_AT + typingDuration(q) + CLICK_CHECK_AFTER : CHOICE_CLICK_AT;
const questionDuration = (q) => clickTime(q) + NEXT_QUESTION_AFTER;
const CYCLE_MS = QUESTIONS.reduce((ms, q) => ms + questionDuration(q), 0);

const NOTHING_TYPED = { line: 0, chars: 0 };
const CURSOR_REST = { x: '64%', y: '30%' };
const CURSOR_AWAY = { x: '62%', y: '90%' };

/** Fire the fireworks show from the centre of an element. */
const launchFireworksFrom = (fireworks, el) => {
  if (!fireworks || !el) return;
  const rect = el.getBoundingClientRect();
  fireworks.launch(rect.left + rect.width / 2, rect.top + rect.height / 2);
};

export const QuizDemo = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  // What the simulated cursor is hovering: 'option-<question>-<option>', 'check', or null
  const [hoveredTarget, setHoveredTarget] = useState(null);
  // Typing progress in the solution pad: lines before `line` are complete,
  // and `chars` characters of the current line have been typed.
  const [typed, setTyped] = useState(NOTHING_TYPED);
  const [cursorPos, setCursorPos] = useState(CURSOR_REST);
  const [isCursorClicking, setIsCursorClicking] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const frameRef = useRef(null);
  const targetRefs = useRef({}); // elements the cursor can aim at, by name
  const fireworksRef = useRef(null);

  // Continuous Automatic Animation Loop
  useEffect(() => {
    let timeouts = [];

    // Glide the simulated cursor onto a target, measured from the live layout.
    const pointCursorAt = (targetName, shareX, shareY) => {
      const frame = frameRef.current;
      const el = targetRefs.current[targetName];
      if (!frame || !el) return;
      const frameRect = frame.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setCursorPos({
        x: `${rect.left - frameRect.left + rect.width * shareX}px`,
        y: `${rect.top - frameRect.top + rect.height * shareY}px`,
      });
    };

    const playQuestion = (index, startAt) => {
      const q = QUESTIONS[index];
      const at = (ms, step) => timeouts.push(setTimeout(step, startAt + ms));
      const clickAt = clickTime(q);
      const clickTarget = q.type === 'solve' ? 'check' : `option-${index}-${q.answerIndex}`;

      // Show the question in its fresh, unanswered state
      at(0, () => {
        setQuestionIndex(index);
        setIsSolved(false);
        setHoveredTarget(null);
        setTyped(NOTHING_TYPED);
        setShowSparkles(false);
        setIsCursorClicking(false);
        setCursorPos(CURSOR_REST);
      });

      if (q.type === 'solve') {
        // Cursor moves into the solution pad, then the working is typed line by line
        at(FOCUS_PAD_AT, () => pointCursorAt(`pad-${index}`, 0.74, 0.55));

        let t = TYPE_START_AT;
        q.steps.forEach((step, line) => {
          for (let chars = 1; chars <= step.text.length; chars++) {
            at(t + chars * TYPE_MS, () => setTyped({ line, chars }));
          }
          t += step.text.length * TYPE_MS + LINE_PAUSE_MS;
          at(t, () => setTyped({ line: line + 1, chars: 0 }));
        });

        // Solution written — cursor heads for "Check answer"
        at(t + HOVER_CHECK_AFTER, () => {
          setHoveredTarget(clickTarget);
          pointCursorAt(clickTarget, 0.5, 0.6);
        });
      } else {
        // Cursor glides towards a wrong option…
        at(HOVER_DECOY_AT, () => {
          const decoy = `option-${index}-${q.decoyIndex}`;
          setHoveredTarget(decoy);
          pointCursorAt(decoy, 0.55, 0.6);
        });

        // …then re-evaluates and glides over to the correct one
        at(HOVER_ANSWER_AT, () => {
          setHoveredTarget(clickTarget);
          pointCursorAt(clickTarget, 0.5, 0.6);
        });
      }

      // The answering click — correct, so cue the fireworks
      at(clickAt, () => {
        setIsCursorClicking(true);
        setIsSolved(true);
        setHoveredTarget(null);
        setShowSparkles(true);
        launchFireworksFrom(fireworksRef.current, targetRefs.current[clickTarget]);
      });

      // Release the click and drift the cursor away
      at(clickAt + RELEASE_AFTER, () => {
        setIsCursorClicking(false);
        setCursorPos(CURSOR_AWAY);
      });

      // Sparkle celebration finishes
      at(clickAt + SPARKLE_END_AFTER, () => setShowSparkles(false));
    };

    // One cycle answers every question in order, then the loop starts over.
    const runAutoAnimationCycle = () => {
      timeouts = [];
      let startAt = 0;
      QUESTIONS.forEach((q, index) => {
        playQuestion(index, startAt);
        startAt += questionDuration(q);
      });
    };

    runAutoAnimationCycle();
    const intervalId = setInterval(runAutoAnimationCycle, CYCLE_MS);

    return () => {
      clearInterval(intervalId);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const question = QUESTIONS[questionIndex];
  const solvedCount = questionIndex + (isSolved ? 1 : 0);
  const xp = BASE_XP + XP_PER_QUESTION * solvedCount;
  const progressWidth = BASE_PROGRESS + PROGRESS_PER_QUESTION * solvedCount;
  const isSolveQuestion = question.type === 'solve';

  return (
    <div
      className="quiz-demo-stage"
      role="img"
      aria-label="Animated preview of a Kasalig bAI diagnostic quiz: a multiple-choice question, then a quadratic equation solved step by step"
    >
      {/* Floating diagnostic sticker (top left) */}
      <div className="floating-sticker diagnostic-sticker">
        <div className="sticker-lines">
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
        <div className="sticker-label">
          <span className="pin-dot">📍</span> Diagnostic
        </div>
      </div>

      {/* Floating XP Booster badge (bottom right) */}
      <div className="floating-sticker xp-booster-badge">
        <div className="xp-badge-icon">
          <GamepadIcon size={24} color="#A78BFA" />
        </div>
        <span className="xp-badge-text">XP BOOSTER</span>
      </div>

      {/* Main Quiz Card — `inert` keeps it display-only: no clicks, no keyboard focus */}
      <div className="quiz-card-frame" ref={frameRef} inert>
        {/* Animated Simulated Cursor Pointer */}
        <div
          className={`animated-mouse-pointer ${isCursorClicking ? 'clicking' : ''}`}
          style={{ left: cursorPos.x, top: cursorPos.y }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 3L11 20L14 13L21 10L4 3Z"
              fill="#152232"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          {isCursorClicking && <span className="cursor-click-wave"></span>}
        </div>

        {/* Card Header Bar */}
        <div className="quiz-card-top-bar">
          <span className="quiz-bar-close">
            <CloseIcon size={18} />
          </span>

          <div className="quiz-subject-capsule">
            <span className="subject-color-chip"></span>
            <span className="subject-name">Grade 10 Mathematics: Quadratic Equations</span>
            <ChevronDownIcon size={14} color="#64748B" />
          </div>

          <div className="quiz-bar-timer">
            <StopwatchIcon size={20} />
          </div>
        </div>

        {/* Orange Progress Indicator Bar */}
        <div className="quiz-progress-track">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>

        {/* Gamified HUD Stats (Keys, Unlimited Hearts, Multiplier, XP) */}
        <div className="quiz-hud-bar">
          <div className="hud-metric">
            <span className="hud-icon">🔑</span>
            <span className="hud-val">1</span>
          </div>
          <div className="hud-metric">
            <span className="hud-icon">❤️</span>
            <span className="hud-val">♾️</span>
          </div>
          <div className="hud-metric">
            <span className="hud-icon">💎</span>
            <span className="hud-val">2x</span>
          </div>
          <div className={`hud-metric xp-metric ${showSparkles ? 'is-boosted' : ''}`}>
            <span className="hud-val highlight-xp">+ {xp} XP</span>
            {showSparkles && <span className="xp-pop-sparkle">+{XP_PER_QUESTION} ✨</span>}
          </div>
        </div>

        {/* Adaptive Diagnostic Question Card */}
        <div className="quiz-question-box">
          <div className="question-tag-row">
            <span className="adaptive-badge">
              <span className="badge-bullet">⊚</span> ADAPTIVE DIAGNOSTIC CHECK
            </span>
            <span className="question-counter">
              Question {questionIndex + 1} of {QUESTIONS.length}
            </span>
          </div>

          {/* Every prompt is stacked in the same spot (only the current one is
              visible), so the card keeps one height as the questions change. */}
          <div className="quiz-question-stack">
            {QUESTIONS.map((q, index) => {
              const isActive = index === questionIndex;
              const promptClass = `quiz-question-prompt ${isActive ? 'is-active' : ''}`;

              if (q.type === 'solve') {
                return <h3 key={q.id} className={promptClass}>{q.prompt}</h3>;
              }

              const isFilled = isActive && isSolved;
              return (
                <h3 key={q.id} className={promptClass}>
                  {q.before}{' '}
                  {/* The answer is always in the slot (hidden until solved), so the
                      blank is exactly as wide as the word that will fill it. */}
                  <span className={`blank-slot ${isFilled ? 'is-filled' : ''}`}>
                    <span className="blank-answer">{q.options[q.answerIndex]}</span>
                  </span>
                  {q.after}
                </h3>
              );
            })}
          </div>
        </div>

        {/* Answer area, stacked the same way: options for a multiple-choice
            question, a solution pad for a worked problem. */}
        <div className="quiz-answer-stack">
          {QUESTIONS.map((q, qIndex) => {
            const isActive = qIndex === questionIndex;
            const isAnswered = isActive && isSolved;

            if (q.type === 'solve') {
              const lastLine = q.steps.length - 1;
              return (
                <div
                  key={q.id}
                  ref={(el) => { targetRefs.current[`pad-${qIndex}`] = el; }}
                  className={`quiz-answer-panel quiz-solve-pad ${isActive ? 'is-active' : ''} ${
                    isAnswered ? 'is-solved' : ''
                  }`}
                >
                  <div className="solve-pad-title">Your solution</div>
                  {q.steps.map((step, line) => {
                    const isDone = typed.line > line;
                    const isCurrent = typed.line === line;
                    const text = isDone ? step.text : isCurrent ? step.text.slice(0, typed.chars) : '';
                    const isAnswerLine = isAnswered && line === lastLine;

                    return (
                      <div
                        key={step.text}
                        className={`solve-line ${isDone ? 'is-done' : ''} ${isAnswerLine ? 'is-answer' : ''}`}
                      >
                        <span className="solve-line-number">{line + 1}</span>
                        <span className="solve-line-text">
                          {text}
                          {isCurrent && <span className="solve-caret"></span>}
                        </span>
                        {isAnswerLine ? (
                          <span className="option-result-badge is-correct">
                            <CheckIcon size={13} color="#047857" />
                            <span>Target Gap Solved</span>
                          </span>
                        ) : (
                          <span className="solve-line-note">{step.note}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }

            return (
              <div
                key={q.id}
                className={`quiz-answer-panel quiz-options-list ${isActive ? 'is-active' : ''}`}
              >
                {q.options.map((label, index) => {
                  const targetName = `option-${qIndex}-${index}`;
                  const isHovered = isActive && hoveredTarget === targetName;
                  const isCorrectAnswer = isAnswered && index === q.answerIndex;

                  return (
                    <div
                      key={label}
                      ref={(el) => { targetRefs.current[targetName] = el; }}
                      className={`quiz-option-button ${isHovered ? 'simulated-hover' : ''} ${
                        isCorrectAnswer ? 'correct-highlight' : ''
                      }`}
                    >
                      <span className="option-key">{OPTION_KEYS[index]}</span>
                      <span className="option-label">{label}</span>

                      {isCorrectAnswer && (
                        <span className="option-result-badge is-correct">
                          <CheckIcon size={13} color="#047857" />
                          <span>Target Gap Solved</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom Helpers (Hint & Reveal Explanation) + Check answer for worked problems */}
        <div className="quiz-bottom-actions">
          <span className="quiz-btn-aux">
            <KeyIcon size={16} color="#C2672D" />
            <span>Hint</span>
          </span>
          <span className="quiz-btn-aux">
            <BookOpenIcon size={16} color="#64748B" />
            <span>Reveal Explanation</span>
          </span>

          <span
            ref={(el) => { targetRefs.current.check = el; }}
            className={`quiz-check-button ${isSolveQuestion ? 'is-visible' : ''} ${
              hoveredTarget === 'check' ? 'simulated-hover' : ''
            } ${isSolveQuestion && isSolved ? 'is-correct' : ''}`}
          >
            {isSolveQuestion && isSolved ? (
              <>
                <CheckIcon size={15} color="#FFFFFF" />
                <span>Correct!</span>
              </>
            ) : (
              <span>Check answer</span>
            )}
          </span>
        </div>
      </div>

      {/* Fireworks overlay — plays each time a question is answered correctly */}
      <Fireworks ref={fireworksRef} className="quiz-fireworks" />
    </div>
  );
};

export default QuizDemo;
