import { Link } from 'react-router-dom';
import Capybara from '../capybara/Capybara';

/**
 * Kasalig chat head: a fixed overlay in the bottom-right corner that opens the tutor.
 * The wrapper ignores the pointer so the page under it stays clickable; only the
 * bubble and the head take clicks.
 */
export default function ChatHead() {
  return (
    <div className="kd-chathead kd-no-print">
      <Link to="/dashboard/tutor" className="kd-chathead-bubble">
        Stuck on a topic? Ask me!
      </Link>
      <Link to="/dashboard/tutor" className="kd-chathead-face" aria-label="Ask Kasalig" title="Ask Kasalig" tabIndex={-1}>
        <span className="kd-chathead-crop">
          <Capybara mood="happy" />
        </span>
        <span className="kd-chathead-online" aria-hidden="true" />
      </Link>
    </div>
  );
}
