import React, { useState } from 'react';
import { GamepadIcon, RocketGraphic, CuteCreatureGraphic } from './Icons';

export const EasiestWaySection = ({ onStartLearning }) => {
  const [isRocketLaunching, setIsRocketLaunching] = useState(false);
  const [isCreatureCelebrating, setIsCreatureCelebrating] = useState(false);
  const [creatureSpeech, setCreatureSpeech] = useState(null);
  const [rocketSpeech, setRocketSpeech] = useState(null);
  const [floatingStars, setFloatingStars] = useState([]);

  const titleText = "The easiest way to learn";

  const speechOptions = [
    "You're doing amazing! 🌟",
    "Learning gap: SOLVED! 💥",
    "Streak +1! Keep shining! 🏆",
    "+500 XP unlocked! 🎮",
    "Let's learn something new today! 🚀",
  ];

  const handleRocketClick = (e) => {
    e.stopPropagation();
    if (isRocketLaunching) return;

    setIsRocketLaunching(true);
    setRocketSpeech("3... 2... 1... Blast off! 🚀✨");

    setTimeout(() => {
      setRocketSpeech(null);
    }, 2800);

    setTimeout(() => {
      setIsRocketLaunching(false);
    }, 3200);
  };

  const handleCreatureClick = (e) => {
    e.stopPropagation();
    setIsCreatureCelebrating(true);
    const randomSpeech = speechOptions[Math.floor(Math.random() * speechOptions.length)];
    setCreatureSpeech(randomSpeech);

    setTimeout(() => {
      setIsCreatureCelebrating(false);
    }, 2500);

    setTimeout(() => {
      setCreatureSpeech(null);
    }, 3500);
  };

  const handleCardClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newStar = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setFloatingStars((prev) => [...prev.slice(-8), newStar]);

    setTimeout(() => {
      setFloatingStars((prev) => prev.filter((s) => s.id !== newStar.id));
    }, 1200);
  };

  return (
    <section className="kasalig-easiest-way-section">
      <div className="kasalig-container">
        {/* Interactive Space Card with 3D elements */}
        <div 
          className="space-portal-card"
          onClick={handleCardClick}
          title="Click around the cosmos for starry sparks!"
        >
          {/* Background Ambient Starfield Dots */}
          <div className="star-dot dot-1"></div>
          <div className="star-dot dot-2"></div>
          <div className="star-dot dot-3"></div>
          <div className="star-dot dot-4"></div>
          <div className="star-dot dot-5"></div>
          <div className="star-dot dot-6"></div>

          {/* User clicked sparks */}
          {floatingStars.map((star) => (
            <span
              key={star.id}
              className="user-cosmic-sparkle"
              style={{ left: star.x, top: star.y }}
            >
              ✨
            </span>
          ))}

          {/* Left: 3D Animated Rocket */}
          <div className="space-actor-left">
            {rocketSpeech && (
              <div className="speech-bubble rocket-bubble">
                {rocketSpeech}
              </div>
            )}
            <RocketGraphic 
              isLaunching={isRocketLaunching} 
              onClick={handleRocketClick} 
            />
          </div>

          {/* Center: Wavy Animated Headline & Primary CTA */}
          <div className="space-content-center">
            <h2 className="space-main-heading wavy-title" aria-label={titleText}>
              {titleText.split('').map((char, index) => (
                <span
                  key={index}
                  className="wavy-char"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h2>

            <p className="space-sub-heading">
              Every improvement starts with understanding where you stand.
            </p>

            <button
              type="button"
              className="space-btn-start"
              onClick={onStartLearning}
            >
              <GamepadIcon size={18} color="#152232" />
              <span>Start learning</span>
            </button>
          </div>

          {/* Right: 3D Cute Purple Creature Emoji */}
          <div className="space-actor-right">
            {creatureSpeech && (
              <div className="speech-bubble creature-bubble">
                {creatureSpeech}
              </div>
            )}
            <CuteCreatureGraphic 
              isHappy={isCreatureCelebrating} 
              onClick={handleCreatureClick} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EasiestWaySection;
