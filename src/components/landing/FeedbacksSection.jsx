import React, { useState } from 'react';
import { HeartIcon } from './Icons';

export const FeedbacksSection = () => {
  const initialReviews = [
    {
      id: 1,
      initials: 'IS',
      avatarBg: '#6366F1',
      name: 'Isla',
      text: "I'm actually obsessed with Kasalig. I never enjoyed reviewing before! Got 100% on my math diagnostic!",
      time: '8d - Reply',
      likes: 201,
    },
    {
      id: 2,
      initials: 'JJ',
      avatarBg: '#8B5CF6',
      name: 'JJ 🎧',
      text: 'I STUDIED WITH THIS APP AND IDENTIFIED MY EXACT FACTORING GAP IN 15 MINS! YALL NEED TO DOWNLOAD THIS',
      time: '1d - Reply',
      likes: 512,
    },
    {
      id: 3,
      initials: 'AX',
      avatarBg: '#D97706',
      name: 'Alexander',
      text: 'I can actually vouch for this. Used it for AP Bio and got high distinction. So easy to use! ✨',
      time: '4d - Reply',
      likes: 122,
    },
    {
      id: 4,
      initials: 'SA',
      avatarBg: '#10B981',
      name: 'Sabrina524',
      text: 'This app got me an A+ in chemistry! The adaptive practice genuinely feels like playing a video game 🎮',
      time: '9d - Reply',
      likes: 144,
    },
    {
      id: 5,
      initials: 'NO',
      avatarBg: '#EF4444',
      name: 'Norachal',
      text: 'Kasalig is literally the life force of my grades. Only app that shows me WHY I picked the wrong answer.',
      time: '2d - Reply',
      likes: 1550,
    },
    {
      id: 6,
      initials: 'FF',
      avatarBg: '#06B6D4',
      name: 'FF1 Student',
      text: 'Honestly guys, coming from a grade 10 student, I use this every night. Recommend it to all my friends!',
      time: '14d - Reply',
      likes: 993,
    },
    {
      id: 7,
      initials: 'BW',
      avatarBg: '#3B82F6',
      name: 'Britt W.',
      text: 'I wanted to say after getting my exam results back, these telemetry quizzes worked like magic! ✨',
      time: '8d - Reply',
      likes: 3101,
    },
    {
      id: 8,
      initials: 'OA',
      avatarBg: '#EA580C',
      name: 'OASIS',
      text: "Our teacher had our whole class use this for mock exams. It's crazy how accurate the diagnostic pinpointing is.",
      time: '9d - Reply',
      likes: 643,
    },
  ];

  const [reviewsState, setReviewsState] = useState(initialReviews);
  const [likedMap, setLikedMap] = useState({});

  const handleLike = (id) => {
    setLikedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    setReviewsState((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isCurrentlyLiked = likedMap[id];
          return {
            ...r,
            likes: isCurrentlyLiked ? r.likes - 1 : r.likes + 1,
          };
        }
        return r;
      })
    );
  };

  const row1 = reviewsState.slice(0, 4);
  const row2 = reviewsState.slice(4, 8);

  return (
    <section className="kasalig-feedbacks-section">
      <div className="kasalig-container feedback-header-center">
        {/* Three cute app icon bubbles */}
        <div className="feedback-app-icons-row">
          <div className="app-bubble pink-bubble">❤️</div>
          <div className="app-bubble navy-bubble">✨</div>
          <div className="app-bubble cyan-bubble">🌍</div>
        </div>

        {/* Curved Title: "Understand.Improve.Excel" */}
        <div className="curved-title-container">
          <svg 
            viewBox="0 0 920 115" 
            className="curved-title-svg" 
            aria-label="Understand.Improve.Excel"
          >
            <defs>
              <path 
                id="feedbackTextArc" 
                d="M 50 96 Q 460 22 870 96" 
                fill="none" 
              />
              <filter id="curvedTextShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.12" />
              </filter>
            </defs>
            <text className="curved-svg-text" filter="url(#curvedTextShadow)">
              <textPath 
                href="#feedbackTextArc" 
                startOffset="50%" 
                textAnchor="middle"
              >
                Understand.Improve.Excel
              </textPath>
            </text>
          </svg>
        </div>

        <p className="feedback-sub-title">By students and educators around the region</p>
      </div>

      {/* Infinite 3D Animated Marquee Tracks */}
      <div className="feedback-marquee-viewport">
        {/* Row 1 (Moving Left with 3D tilt) */}
        <div className="marquee-track track-row-1">
          {row1.concat(row1).concat(row1).map((item, index) => (
            <div key={`r1-${item.id}-${index}`} className="feedback-chat-card-3d row-1-card">
              <div className="feedback-card-header">
                <div 
                  className="feedback-avatar-3d" 
                  style={{ backgroundColor: item.avatarBg }}
                >
                  {item.initials}
                </div>
                <div className="feedback-user-info">
                  <span className="feedback-user-name">{item.name}</span>
                </div>
              </div>

              <p className="feedback-card-text">{item.text}</p>

              <div className="feedback-card-footer">
                <span className="feedback-card-time">{item.time}</span>
                <button
                  type="button"
                  className={`feedback-like-button-3d ${likedMap[item.id] ? 'liked' : ''}`}
                  onClick={() => handleLike(item.id)}
                  title="Like feedback"
                >
                  <HeartIcon size={14} color={likedMap[item.id] ? '#EF4444' : '#F43F5E'} />
                  <span className="like-count">{item.likes.toLocaleString()}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 (Moving Right with 3D tilt) */}
        <div className="marquee-track track-row-2">
          {row2.concat(row2).concat(row2).map((item, index) => (
            <div key={`r2-${item.id}-${index}`} className="feedback-chat-card-3d row-2-card">
              <div className="feedback-card-header">
                <div 
                  className="feedback-avatar-3d" 
                  style={{ backgroundColor: item.avatarBg }}
                >
                  {item.initials}
                </div>
                <div className="feedback-user-info">
                  <span className="feedback-user-name">{item.name}</span>
                </div>
              </div>

              <p className="feedback-card-text">{item.text}</p>

              <div className="feedback-card-footer">
                <span className="feedback-card-time">{item.time}</span>
                <button
                  type="button"
                  className={`feedback-like-button-3d ${likedMap[item.id] ? 'liked' : ''}`}
                  onClick={() => handleLike(item.id)}
                  title="Like feedback"
                >
                  <HeartIcon size={14} color={likedMap[item.id] ? '#EF4444' : '#F43F5E'} />
                  <span className="like-count">{item.likes.toLocaleString()}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbacksSection;
