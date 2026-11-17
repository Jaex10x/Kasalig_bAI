import { useCallback, useEffect, useState } from 'react';

const LAUGHS = [
  'Hehe, that tickles! 😆',
  'Hahaha! Stop it! 🤣',
  'Pfft, hehehe! 😂',
];

const POUTS = [
  'Hmph! Don’t poke me. Focus there!',
  'Hey, quit it! Focus there!',
  'No more poking! Focus there, not on me!',
];

const LAUGH_MS = 1500;
const POUT_MS = 4000;

const RESTING = { phase: null, pokes: 0, pointer: '' };

/**
 * What the capybara does when it gets poked: it laughs, then pouts and tells
 * the user to focus, then goes back to whatever it was doing.
 *
 * pointer: emoji appended to the pout line so "there" points at the content
 *          (e.g. '👈'). Pass a function to decide at the moment of the poke.
 *
 * Returns:
 *  - reaction: { mood, message } while reacting, otherwise null
 *  - poke():   start (or restart) the reaction
 *  - cancel(): drop the reaction immediately
 */
export default function useCapybaraPoke(pointer = '') {
  const [state, setState] = useState(RESTING);

  const poke = useCallback(() => {
    const resolved = typeof pointer === 'function' ? pointer() : pointer;
    setState((s) => ({ phase: 'laugh', pokes: s.pokes + 1, pointer: resolved }));
  }, [pointer]);

  const cancel = useCallback(() => {
    setState((s) => (s.phase ? { ...s, phase: null } : s));
  }, []);

  // laugh -> pout -> rest. Every new poke replaces `state`, which restarts the timer.
  useEffect(() => {
    if (!state.phase) return undefined;
    const laughing = state.phase === 'laugh';
    const timer = setTimeout(
      () => setState((s) => ({ ...s, phase: laughing ? 'pout' : null })),
      laughing ? LAUGH_MS : POUT_MS,
    );
    return () => clearTimeout(timer);
  }, [state]);

  let reaction = null;
  if (state.phase) {
    const line = state.pokes - 1;
    reaction =
      state.phase === 'laugh'
        ? { mood: 'laugh', message: LAUGHS[line % LAUGHS.length] }
        : { mood: 'pout', message: `${POUTS[line % POUTS.length]} ${state.pointer}`.trim() };
  }

  return { reaction, poke, cancel };
}
