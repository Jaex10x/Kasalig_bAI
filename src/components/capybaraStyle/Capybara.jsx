import './Capybara.css';

/**
 * Animated capybara mascot with a speech bubble.
 *
 * Decorative only (aria-hidden): every message it shows is also conveyed
 * accessibly by the form itself (inline errors / alerts).
 *
 * Props:
 *  - mood: 'idle' | 'eyes-closed' | 'sad' | 'pout' | 'happy' | 'thinking'
 *  - message: text shown in the speech bubble
 */
export default function Capybara({ mood = 'idle', message }) {
  return (
    <figure className="kb-capy" data-mood={mood} aria-hidden="true">
      {message && (
        <div className="kb-capy-bubble">
          {/* key re-mounts the text so each new message "pops" in */}
          <span key={message} className="kb-capy-bubble-text">{message}</span>
        </div>
      )}

      <svg className="kb-capy-svg" viewBox="0 0 220 220" role="presentation">
        {/* ground shadow */}
        <ellipse cx="110" cy="207" rx="70" ry="7" fill="rgba(50, 25, 10, 0.12)" />

        <g className="kb-capy-body">
          {/* feet */}
          <ellipse cx="80" cy="202" rx="17" ry="8" fill="#8f5a33" />
          <ellipse cx="140" cy="202" rx="17" ry="8" fill="#8f5a33" />
          {/* body + belly */}
          <ellipse cx="110" cy="160" rx="72" ry="48" fill="#b5794a" />
          <ellipse cx="110" cy="172" rx="42" ry="29" fill="#d9a877" />
          {/* arms */}
          <ellipse cx="62" cy="168" rx="11" ry="20" fill="#9c6439" transform="rotate(18 62 168)" />
          <ellipse cx="158" cy="168" rx="11" ry="20" fill="#9c6439" transform="rotate(-18 158 168)" />
        </g>

        <g className="kb-capy-head">
          {/* ears */}
          <ellipse cx="66" cy="54" rx="11" ry="9" fill="#8f5a33" />
          <ellipse cx="154" cy="54" rx="11" ry="9" fill="#8f5a33" />
          {/* head */}
          <rect x="50" y="46" width="120" height="88" rx="44" fill="#b5794a" />
          {/* hair tuft */}
          <path d="M100 48 q4 -10 8 -1 q4 -9 8 1" fill="none" stroke="#8f5a33" strokeWidth="3" strokeLinecap="round" />
          {/* the iconic orange (brand accent) */}
          <g className="kb-capy-orange">
            <circle cx="136" cy="40" r="11" fill="#de7a40" />
            <circle cx="132" cy="36" r="3" fill="#f3a46f" />
            <path d="M136 29 q6 -7 12 -3 q-6 5 -12 3z" fill="#4f9d5d" />
          </g>
          {/* snout */}
          <rect x="72" y="88" width="76" height="48" rx="24" fill="#9a6238" />
          <ellipse cx="98" cy="101" rx="4.5" ry="3.2" fill="#3b2416" />
          <ellipse cx="122" cy="101" rx="4.5" ry="3.2" fill="#3b2416" />

          {/* cheeks */}
          <ellipse className="kb-capy-blush" cx="66" cy="98" rx="9" ry="5.5" fill="#f2a07b" />
          <ellipse className="kb-capy-blush" cx="154" cy="98" rx="9" ry="5.5" fill="#f2a07b" />

          {/* eyes – open */}
          <g className="kb-capy-eyes-open">
            <g className="kb-capy-eye">
              <circle cx="82" cy="78" r="6.5" fill="#3b2416" />
              <circle cx="84.5" cy="75.5" r="2.2" fill="#ffffff" />
            </g>
            <g className="kb-capy-eye">
              <circle cx="138" cy="78" r="6.5" fill="#3b2416" />
              <circle cx="140.5" cy="75.5" r="2.2" fill="#ffffff" />
            </g>
          </g>

          {/* eyes – closed (sleepy curves) */}
          <g className="kb-capy-eyes-closed" fill="none" stroke="#3b2416" strokeWidth="3.2" strokeLinecap="round">
            <path d="M74 78 q8 7 16 0" />
            <path d="M130 78 q8 7 16 0" />
          </g>

          {/* eyes – happy (^ ^) */}
          <g className="kb-capy-eyes-happy" fill="none" stroke="#3b2416" strokeWidth="3.2" strokeLinecap="round">
            <path d="M74 81 q8 -9 16 0" />
            <path d="M130 81 q8 -9 16 0" />
          </g>

          {/* sad brows + tear */}
          <g className="kb-capy-sad-bits">
            <path d="M72 69 L90 63" stroke="#6b4022" strokeWidth="3" strokeLinecap="round" />
            <path d="M148 69 L130 63" stroke="#6b4022" strokeWidth="3" strokeLinecap="round" />
            <path className="kb-capy-tear" d="M76 88 q-5 8 0 11 q5 -3 0 -11z" fill="#7cc4f0" />
          </g>

          {/* pout bits: furrowed brows + "hmph" puff of air */}
          <g className="kb-capy-pout-bits">
            <path d="M72 63 L90 69" stroke="#6b4022" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M148 63 L130 69" stroke="#6b4022" strokeWidth="3.2" strokeLinecap="round" />
            <g className="kb-capy-huff" fill="none" stroke="#c9a284" strokeWidth="2.4" strokeLinecap="round">
              <path d="M160 116 q8 -2 13 -7" />
              <path d="M162 124 q9 0 15 -3" />
            </g>
          </g>

          {/* mouths */}
          <path className="kb-capy-mouth kb-capy-mouth-smile" d="M101 117 q9 7 18 0" fill="none" stroke="#3b2416" strokeWidth="2.6" strokeLinecap="round" />
          <path className="kb-capy-mouth kb-capy-mouth-sad" d="M101 122 q9 -7 18 0" fill="none" stroke="#3b2416" strokeWidth="2.6" strokeLinecap="round" />
          <path className="kb-capy-mouth kb-capy-mouth-flat" d="M103 119 h14" fill="none" stroke="#3b2416" strokeWidth="2.6" strokeLinecap="round" />
          <path className="kb-capy-mouth kb-capy-mouth-happy" d="M99 114 q11 13 22 0z" fill="#6b2f1a" />
          {/* pouty pushed-out lips */}
          <path className="kb-capy-mouth kb-capy-mouth-pout" d="M102 121 q8 -8 16 0 q-8 6 -16 0z" fill="#6b2f1a" />
        </g>
      </svg>
    </figure>
  );
}
