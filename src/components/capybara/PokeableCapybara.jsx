import { useState } from 'react';
import Capybara from './Capybara';
import useCapybaraPoke from './useCapybaraPoke';

/**
 * Capybara that sits beside a form and reacts when clicked: it laughs, then
 * pouts and tells the user to focus on the form.
 *
 * Props:
 *  - mood, message: what the capybara shows when nobody is poking it
 *  - pointer: emoji (or function returning one) that points at the form
 */
export default function PokeableCapybara({ mood = 'idle', message, pointer }) {
  const { reaction, poke, cancel } = useCapybaraPoke(pointer);

  // The form always wins: the moment its own state changes (the user starts
  // typing a password, submits, hits an error…) the reaction is dropped.
  const base = `${mood}\n${message ?? ''}`;
  const [seenBase, setSeenBase] = useState(base);
  if (seenBase !== base) {
    setSeenBase(base);
    cancel();
  }

  const shown = reaction ?? { mood, message };

  return (
    <button
      type="button"
      className="kb-capy-hit"
      onClick={poke}
      // Don't pull the cursor out of the field the user is typing in, and
      // stay out of the Tab order so Tab still goes straight to the form.
      onMouseDown={(e) => e.preventDefault()}
      tabIndex={-1}
      aria-label="Poke the capybara"
    >
      <Capybara mood={shown.mood} message={shown.message} />
    </button>
  );
}
