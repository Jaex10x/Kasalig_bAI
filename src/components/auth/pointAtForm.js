// Must match the breakpoint where .kb-auth-stage stacks (AuthForm.css).
const STACKED_QUERY = '(max-width: 760px)';

/**
 * Emoji pointing from the mascot to the form card: the card sits to the right
 * of the mascot on wide screens and underneath it once the layout stacks.
 */
export function pointAtForm() {
  return window.matchMedia(STACKED_QUERY).matches ? '👇' : '👉';
}
