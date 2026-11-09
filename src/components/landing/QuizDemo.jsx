import { useState, useEffect } from 'react';
import { 
  CloseIcon, 
  ChevronDownIcon, 
  StopwatchIcon, 
  TargetGapIcon, 
  KeyIcon, 
  BookOpenIcon, 
  GamepadIcon 
} from './Icons';

export const QuizDemo = () => {
  const [selectedOption, setSelectedOption] = useState('lengthen');
  const [hoveredOption, setHoveredOption] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 35 });
  const [isCursorClicking, setIsCursorClicking] = useState(false);
  const [xp, setXp] = useState(780);
  const [progressWidth, setProgressWidth] = useState(72);
  const [showSparkles, setShowSparkles] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const options = [
    { id: 'shorten', label: 'shorten', isCorrect: false },
    { id: 'accelerate', label: 'accelerate', isCorrect: false },
    { id: 'lengthen', label: 'lengthen', isCorrect: true },
    { id: 'stabilize', label: 'stabilize', isCorrect: false },
  ];

  // Continuous Automatic Animation Loop
  useEffect(() => {
    let timeouts = [];

    const runAutoAnimationCycle = () => {
      // Step 1: Reset to fresh question state (0s)
      timeouts.push(setTimeout(() => {
        setSelectedOption(null);
        setHoveredOption(null);
        setShowSparkles(false);
        setXp(680);
        setProgressWidth(52);
        setIsCursorClicking(false);
        setCursorPos({ x: 62, y: 35 });
      }, 0));

      // Step 2: Cursor glides towards "accelerate" (1.2s)
      timeouts.push(setTimeout(() => {
        setHoveredOption('accelerate');
        setCursorPos({ x: 54, y: 55 });
      }, 1200));

      // Step 3: Cursor re-evaluates and glides down to "lengthen" (2.2s)
      timeouts.push(setTimeout(() => {
        setHoveredOption('lengthen');
        setCursorPos({ x: 50, y: 67 });
      }, 2200));

      // Step 4: Click on "lengthen" (3.0s)
      timeouts.push(setTimeout(() => {
        setIsCursorClicking(true);
        setSelectedOption('lengthen');
        setHoveredOption(null);
        setShowSparkles(true);
        setXp(780);
        setProgressWidth(75);
      }, 3000));

      // Step 5: Release click and drift cursor away (3.5s)
      timeouts.push(setTimeout(() => {
        setIsCursorClicking(false);
        setCursorPos({ x: 75, y: 72 });
      }, 3500));

      // Step 6: Sparkle celebration finishes (4.8s)
      timeouts.push(setTimeout(() => {
        setShowSparkles(false);
      }, 4800));
    };

    // Run immediately on load
    runAutoAnimationCycle();

    // Loop continuously every 6.8 seconds automatically!
    const intervalId = setInterval(() => {
      runAutoAnimationCycle();
    }, 6800);

    return () => {
      clearInterval(intervalId);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // If user clicks manually, respond immediately, then let auto-loop continue
  const handleUserSelect = (optionId) => {
    setSelectedOption(optionId);
    if (optionId === 'lengthen') {
      setShowSparkles(true);
      setXp(780);
      setProgressWidth(75);
      setTimeout(() => setShowSparkles(false), 2000);
    } else {
      setShowSparkles(false);
    }
  };

  return (
    <div className="quiz-demo-stage">
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
          <GamepadIcon size={20} color="#A78BFA" />
        </div>
        <span className="xp-badge-text">XP BOOSTER</span>
      </div>

      {/* Main Quiz Card */}
      <div className="quiz-card-frame">
        {/* Animated Simulated Cursor Pointer */}
        <div 
          className={`animated-mouse-pointer ${isCursorClicking ? 'clicking' : ''}`}
          style={{ 
            left: `${cursorPos.x}%`, 
            top: `${cursorPos.y}%` 
          }}
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
          <button type="button" className="quiz-bar-close" aria-label="Close Quiz">
            <CloseIcon size={14} />
          </button>

          <div className="quiz-subject-capsule">
            <span className="subject-color-chip"></span>
            <span className="subject-name">Grade 10 Mathematics: Quadratic Equations</span>
            <ChevronDownIcon size={12} color="#64748B" />
          </div>

          <div className="quiz-bar-timer" title="Timed diagnostic check">
            <StopwatchIcon size={16} />
          </div>
        </div>

        {/* Orange Progress Indicator Bar */}
        <div className="quiz-progress-track">
          <div 
            className="quiz-progress-fill" 
            style={{ width: `${progressWidth}%`, transition: 'width 0.8s ease' }}
          ></div>
        </div>

        {/* Gamified HUD Stats (Keys, Unlimited Hearts, Multiplier, XP) */}
        <div className="quiz-hud-bar">
          <div className="hud-metric">
            <span className="hud-icon">🔑</span>
            <span className="hud-val">1</span>
          </div>
          <span className="hud-separator">|</span>
          <div className="hud-metric">
            <span className="hud-icon">❤️</span>
            <span className="hud-val">♾️</span>
          </div>
          <span className="hud-separator">|</span>
          <div className="hud-metric">
            <span className="hud-icon">💎</span>
            <span className="hud-val">2x</span>
          </div>
          <span className="hud-separator">|</span>
          <div className="hud-metric xp-metric">
            <span className="hud-val highlight-xp">+ {xp} XP</span>
            {showSparkles && <span className="xp-pop-sparkle">+100 ✨</span>}
          </div>
        </div>

        {/* Adaptive Diagnostic Question Card */}
        <div className="quiz-question-box">
          <div className="question-tag-row">
            <span className="adaptive-badge">
              <span className="badge-bullet">⊚</span> ADAPTIVE DIAGNOSTIC CHECK
            </span>
          </div>
          <h3 className="quiz-question-prompt">
            The Moon is slowly moving away from Earth, causing our planetary days to
            gradually <span className="blank-line">_______</span>.
          </h3>
        </div>

        {/* Interactive & Animated Multiple Choice Options */}
        <div className="quiz-options-list">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isHovered = hoveredOption === opt.id;
            const isCorrectAnswer = opt.isCorrect && isSelected;

            return (
              <button
                key={opt.id}
                type="button"
                className={`quiz-option-button ${isHovered ? 'simulated-hover' : ''} ${
                  isSelected ? 'selected' : ''
                } ${isCorrectAnswer ? 'correct-highlight' : ''}`}
                onClick={() => handleUserSelect(opt.id)}
              >
                <span className="option-label">{opt.label}</span>

                {isCorrectAnswer && (
                  <span className="target-gap-badge">
                    <TargetGapIcon size={13} color="#C2672D" />
                    <span>Target Gap Solved</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Helpers (Hint & Reveal Explanation) */}
        <div className="quiz-bottom-actions">
          <button
            type="button"
            className={`quiz-btn-aux ${showHint ? 'active-aux' : ''}`}
            onClick={() => setShowHint(!showHint)}
          >
            <KeyIcon size={14} color="#C2672D" />
            <span>Hint</span>
          </button>
          <button
            type="button"
            className={`quiz-btn-aux ${showExplanation ? 'active-aux' : ''}`}
            onClick={() => setShowExplanation(!showExplanation)}
          >
            <BookOpenIcon size={14} color="#64748B" />
            <span>Reveal Explanation</span>
          </button>
        </div>

        {/* Expandable Hint Box */}
        {showHint && (
          <div className="quiz-expandable-drawer hint-drawer">
            <p>💡 <strong>Hint:</strong> Think about tidal friction! As the Moon draws energy from Earth's rotation, does the spin slow down or speed up?</p>
          </div>
        )}

        {/* Expandable Explanation Box */}
        {showExplanation && (
          <div className="quiz-expandable-drawer explanation-drawer">
            <p>📚 <strong>Explanation:</strong> Tidal friction causes Earth’s rotational energy to dissipate, gradually slowing its rotation by ~1.8 milliseconds per century, which lengthens each planetary day.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDemo;
