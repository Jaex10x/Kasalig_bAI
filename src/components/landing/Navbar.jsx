import { useState } from 'react';
import { LogoIcon, GamepadIcon, ChevronDownIcon } from './Icons';

export const Navbar = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Explore', href: '#features', hasDropdown: true },
    { name: 'Features', href: '#features' },
    { name: 'For Teachers', href: '#features' },
  ];

  const handleLinkClick = (name, href, e) => {
    e.preventDefault();
    setActiveTab(name);
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(name.toLowerCase());
    }
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="kasalig-navbar-wrap">
      {/* Floating Pill Capsule Bar */}
      <nav className="kasalig-navbar-capsule">
        {/* Brand / Logo on Left */}
        <a 
          href="#home" 
          className="kasalig-logo-link" 
          onClick={(e) => handleLinkClick('Home', '#home', e)}
        >
          <LogoIcon size={32} />
          <div className="kasalig-logo-text">
            <span className="kasalig-brand-name">
              <strong>Kasalig</strong> <span className="kasalig-brand-accent">bAI</span>
            </span>
          </div>
        </a>

        {/* Right-aligned Navigation Cluster */}
        <div className="kasalig-nav-cluster">
          {/* Nav Links */}
          <div className="kasalig-nav-links">
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`kasalig-nav-link ${isActive ? 'active-pill' : ''}`}
                  onClick={(e) => handleLinkClick(link.name, link.href, e)}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDownIcon size={12} color="#64748B" />}
                </a>
              );
            })}
          </div>

          {/* Actions: Login & Start Learning Pill */}
          <div className="kasalig-nav-actions">
            <button 
              type="button" 
              className="kasalig-btn-login"
              onClick={() => onNavigate && onNavigate('login')}
            >
              Login
            </button>
            <button 
              type="button" 
              className="kasalig-btn-capsule-dark"
              onClick={() => onNavigate && onNavigate('get-started')}
            >
              <GamepadIcon size={16} color="#FFFFFF" />
              <span>Start learning</span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          type="button" 
          className="kasalig-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="kasalig-mobile-menu-capsule">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`kasalig-mobile-nav-link ${activeTab === link.name ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(link.name, link.href, e)}
            >
              <span>{link.name}</span>
            </a>
          ))}
          <div className="kasalig-mobile-actions">
            <button 
              type="button" 
              className="kasalig-btn-login"
              onClick={() => { setMobileMenuOpen(false); onNavigate && onNavigate('login'); }}
            >
              Login
            </button>
            <button 
              type="button" 
              className="kasalig-btn-capsule-dark"
              onClick={() => { setMobileMenuOpen(false); onNavigate && onNavigate('get-started'); }}
            >
              <GamepadIcon size={16} color="#FFFFFF" />
              <span>Start learning</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
