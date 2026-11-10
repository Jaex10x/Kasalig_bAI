import { useEffect, useRef, useState } from 'react';
import Capybara from '../capybaraStyle/Capybara';

const GREETINGS = [
  'Hi there! 👋 Welcome to Kasalig bAI!',
  'Hello, learner! Ready to level up? 🍊',
  'Hey! Nice to see you 😊',
];

const GREETING_MS = 4500;
const SCROLL_IDLE_MS = 180;

/**
 * Capybara companion permanently pinned to the bottom-right corner of the
 * landing page. It stays in view while the page scrolls (position: fixed),
 * bounces while you scroll, greets the user on arrival, and says hi again
 * when clicked. Intentionally not dismissible.
 */
export const FloatingCapybara = () => {
  const [mood, setMood] = useState('idle');
  const [message, setMessage] = useState('');
  const [scrolling, setScrolling] = useState(false);
  const hideTimer = useRef(null);
  const greetIndex = useRef(0);
  const reachedEnd = useRef(false);

  const say = (text, nextMood = 'happy', duration = GREETING_MS) => {
    clearTimeout(hideTimer.current);
    setMood(nextMood);
    setMessage(text);
    hideTimer.current = setTimeout(() => {
      setMessage('');
      setMood('idle');
    }, duration);
  };

  const greet = () => {
    say(GREETINGS[greetIndex.current % GREETINGS.length]);
    greetIndex.current += 1;
  };

  // Greet shortly after the page loads.
  useEffect(() => {
    const t = setTimeout(greet, 900);
    return () => {
      clearTimeout(t);
      clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bounce while scrolling; cheer once when the user reaches the bottom.
  useEffect(() => {
    let idleTimer;
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setScrolling(false), SCROLL_IDLE_MS);

      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      if (atEnd && !reachedEnd.current) {
        reachedEnd.current = true;
        say('You made it to the end! 🎉 Let’s start learning!');
      } else if (!atEnd) {
        reachedEnd.current = false;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idleTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`kb-floating-capy ${scrolling ? 'is-scrolling' : ''}`}>
      <button
        type="button"
        className="kb-floating-capy-hit"
        onClick={greet}
        aria-label="Say hi to the capybara"
      >
        <Capybara mood={mood} message={message} />
      </button>
    </div>
  );
};

export default FloatingCapybara;
