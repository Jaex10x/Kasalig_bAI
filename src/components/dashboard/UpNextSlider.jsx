import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { subjectById } from '../../data/curriculum';
import { CHECK_SIZE } from '../../lib/engine';
import TopicArt from './TopicArt';

// Cover colour per course: a warm palette (burnt orange, brick red, dark ochre).
// Each keeps white text at 6.7:1 or better.
const COVERS = { CSIT221: '#8a3f12', CSIT226: '#9b2c3a', CSIT121: '#7a5410' };
const COVER_FALLBACK = '#2a1b12';
const CARD_STEP = 250 + 12; // card width + gap

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const barColor = (pct) => (pct >= 80 ? '#059669' : pct >= 60 ? '#d97706' : '#dc2626');
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Turns a recommendation into what one card shows. */
function cardFor(rec, { status, quizzes, diagnostics }) {
  const quizId = rec.kind === 'quiz' ? rec.to?.split('/').pop() : null;
  const quiz = quizId && quizzes.find((q) => q.id === quizId);
  const diag = quizId && diagnostics.find((d) => d.id === quizId);
  const subject = rec.topic && subjectById(rec.topic.subjectId);
  const course = subject?.courseCode ?? quiz?.courseCode ?? diag?.courseCode ?? null;

  const base = {
    title: rec.topic ? rec.topic.name : rec.title,
    pct: rec.topic ? status[rec.topic.id]?.pct ?? null : null,
    course,
    subjectId: rec.topic?.subjectId ?? diag?.subjectId,
  };

  switch (rec.kind) {
    case 'lesson':
      return { ...base, label: 'Lesson', time: 'Short read', cta: 'Start lesson' };
    case 'practice':
      return { ...base, label: 'Practice', time: 'Adaptive', cta: 'Practice' };
    case 'check':
      return { ...base, label: 'Mastery check', time: plural(CHECK_SIZE, 'question'), cta: 'Take the check' };
    case 'resource':
      return {
        ...base,
        title: rec.title,
        label: rec.fromTeacher ? 'From your teacher' : rec.meta?.split(' · ')[0] ?? 'Material',
        time: rec.meta?.split(' · ')[1] ?? 'Study material',
        cta: rec.url ? 'Open' : 'I studied this',
      };
    case 'tutor':
      return { ...base, label: 'Ask Kasalig', time: 'Chat', cta: 'Start chat' };
    case 'quiz':
      return {
        ...base,
        title: rec.title,
        label: rec.fromTeacher ? 'New quiz' : 'Diagnostic',
        time: quiz ? plural(quiz.questions.length, 'question') : diag ? `About ${diag.minutes} min` : 'Quiz',
        cta: 'Take the quiz',
      };
    default:
      return { ...base, label: 'Start here', time: 'Takes a minute', cta: 'Find my classes' };
  }
}

function UpNextCard({ rec, rank, card, onDone }) {
  const cover = COVERS[card.course] ?? COVER_FALLBACK;
  const meta = [card.course, card.time].filter(Boolean).join(' · ');

  let action;
  if (rec.kind === 'resource' && rec.url) {
    action = (
      <a href={rec.url} target="_blank" rel="noopener noreferrer" className="kd-upnext-btn" onClick={() => onDone?.(rec.key)}>
        {card.cta}
        <span className="kd-sr-only"> {rec.title} (opens in a new tab)</span>
      </a>
    );
  } else if (rec.kind === 'resource') {
    action = (
      <button type="button" className="kd-upnext-btn" onClick={() => onDone?.(rec.key)}>
        {card.cta}
      </button>
    );
  } else {
    action = (
      <Link to={rec.to} state={rec.state} className="kd-upnext-btn">
        {card.cta}
        <span className="kd-sr-only">: {card.title}</span>
      </Link>
    );
  }

  return (
    <li className="kd-upnext-card">
      <div className="kd-upnext-cover" style={{ background: cover }}>
        <TopicArt className="kd-upnext-art" topicId={rec.topic?.id} subjectId={card.subjectId} kind={rec.kind} />
        <span className="kd-upnext-pill">
          #{rank} · {card.label}
        </span>
        <span className="kd-upnext-heading">
          {meta && <span className="kd-upnext-meta">{meta}</span>}
          <strong>{card.title}</strong>
        </span>
      </div>
      <div className="kd-upnext-body">
        <p>{rec.reason}</p>
        {card.pct !== null && (
          <div className="kd-upnext-mastery">
            <span>
              <span>Your mastery</span>
              <b>{card.pct}%</b>
            </span>
            <span className="kd-upnext-bar" aria-hidden="true">
              <span style={{ width: `${card.pct}%`, background: barColor(card.pct) }} />
            </span>
          </div>
        )}
        {action}
      </div>
    </li>
  );
}

/**
 * "Up next": the recommendations after the hero's step, in one horizontal row.
 * A native scroll container with scroll-snap, so trackpad and touch swipes work;
 * the arrow buttons just scroll it by a page of cards.
 */
export default function UpNextSlider({ recs, startRank = 2, status, quizzes, diagnostics, onDone, before }) {
  const scroller = useRef(null);
  const [nav, setNav] = useState({ canPrev: false, canNext: false, pages: 1, page: 0 });

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pages = max > 1 ? Math.ceil(el.scrollWidth / el.clientWidth) : 1;
    setNav({
      canPrev: el.scrollLeft > 1,
      canNext: el.scrollLeft < max - 1,
      pages,
      page: max > 1 ? Math.round((el.scrollLeft / max) * (pages - 1)) : 0,
    });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return undefined;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro?.disconnect();
    };
  }, [update, recs.length]);

  const scrollPage = (dir) => {
    const el = scroller.current;
    if (!el) return;
    const perPage = Math.max(1, Math.floor(el.clientWidth / CARD_STEP));
    el.scrollBy({ left: dir * perPage * CARD_STEP, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section className="kd-upnext" aria-labelledby="kd-upnext-title">
      <div className="kd-upnext-head">
        <div>
          <h2 id="kd-upnext-title">Up next</h2>
          <p>Ranked from your latest results, each with the reason it was picked.</p>
        </div>
        <div className="kd-upnext-tools">
          {nav.pages > 1 && (
            <ul className="kd-upnext-pages" aria-hidden="true">
              {Array.from({ length: nav.pages }, (_, i) => (
                <li key={i} className={i === nav.page ? 'is-active' : undefined} />
              ))}
            </ul>
          )}
          <Link to="/dashboard/results" className="kd-upnext-all">
            See all
          </Link>
        </div>
      </div>

      {before}

      {recs.length === 0 ? (
        <p className="kd-upnext-empty">Nothing else queued. The step above is all you need for now.</p>
      ) : (
        <div className="kd-upnext-frame">
          <div className="kd-upnext-scroller" ref={scroller}>
            <ul className="kd-upnext-track">
              {recs.map((r, i) => (
                <UpNextCard key={r.key} rec={r} rank={startRank + i} card={cardFor(r, { status, quizzes, diagnostics })} onDone={onDone} />
              ))}
            </ul>
          </div>
          {nav.canPrev && (
            <button type="button" className="kd-upnext-arrow is-prev" onClick={() => scrollPage(-1)} aria-label="Previous recommendations">
              <span aria-hidden="true">&larr;</span>
            </button>
          )}
          {nav.canNext && (
            <>
              <div className="kd-upnext-fade" aria-hidden="true" />
              <button type="button" className="kd-upnext-arrow is-next" onClick={() => scrollPage(1)} aria-label="Next recommendations">
                <span aria-hidden="true">&rarr;</span>
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
