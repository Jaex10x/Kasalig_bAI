import { 
  InstagramIcon, 
  TikTokIcon, 
  DiscordIcon 
} from './Icons';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="kasalig-footer-modern">
      <div className="kasalig-container">
        <div className="footer-modern-grid">
          {/* Brand Column */}
          <div className="footer-brand-column">
            <div className="footer-brand-header">
              <div className="footer-k-badge">K</div>
              <span className="footer-brand-title">
                <strong>Kasalig</strong> <span className="brand-orange">bAI</span>
              </span>
            </div>

            <p className="footer-brand-mission">
              Empowering students with adaptive AI telemetry, diagnostic quizzes,
              and gap-healing insights so no learner is left behind.
            </p>

            {/* Social Icons */}
            <div className="footer-social-links">
              <a href="#instagram" aria-label="Instagram" className="social-icon-link">
                <InstagramIcon size={18} />
              </a>
              <a href="#tiktok" aria-label="TikTok" className="social-icon-link">
                <TikTokIcon size={18} />
              </a>
              <a href="#discord" aria-label="Discord" className="social-icon-link">
                <DiscordIcon size={18} />
              </a>
            </div>
          </div>

          {/* Column: EXPLORE */}
          <div className="footer-menu-column">
            <h4 className="footer-menu-heading">EXPLORE</h4>
            <ul className="footer-menu-list">
              <li><a href="#flashcards">Flashcard Maker</a></li>
              <li><a href="#quizlet">Quizlet Sync</a></li>
              <li><a href="#diagnostics">Diagnostic Tools</a></li>
            </ul>
          </div>

          {/* Column: RESOURCES */}
          <div className="footer-menu-column">
            <h4 className="footer-menu-heading">RESOURCES</h4>
            <ul className="footer-menu-list">
              <li><a href="#blog">Blog</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#cookies">Cookies Policy</a></li>
              <li><a href="#cookie-settings">Cookie Settings</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Column: PORTALS */}
          <div className="footer-menu-column">
            <h4 className="footer-menu-heading">PORTALS</h4>
            <ul className="footer-menu-list">
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('student-login')}>
                  Student Login
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate && onNavigate('teacher-login')}>
                  Teacher Console
                </button>
              </li>
              <li><a href="#districts">School Districts</a></li>
              <li><a href="#api">API Documentation</a></li>
              <li><a href="#discord-community">Community Discord</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-legal-bar">
          <p className="footer-copyright">
            © 2025 Kasalig AI (Kasalig bAI). Crafted by Team Byte Busters. All rights reserved.
          </p>
          <p className="footer-love-note">
            Made for learners everywhere <span className="heart-love">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
