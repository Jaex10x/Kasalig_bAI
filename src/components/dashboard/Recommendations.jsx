import { Link } from 'react-router-dom';
import { SEVERITIES } from './curriculum';
import { formatDate, useStudentProgress } from './dashboardHooks';
import { GapTypeChip, SeverityChip } from './DashWidgets';
import { ArrowIcon, BookIcon, BulbIcon, CapyFace, ChatIcon, CheckIcon, LinkIcon, PencilIcon, PlayIcon, QuizIcon, SparkleIcon } from './DashIcons';

const KINDS = {
  lesson: { label: 'Short lesson', icon: BookIcon, cta: 'Read it' },
  practice: { label: 'Adaptive practice', icon: PencilIcon, cta: 'Practise' },
  check: { label: 'Mastery check', icon: CheckIcon, cta: 'Take the check' },
  resource: { label: 'Study material', icon: PlayIcon, cta: 'Open' },
  tutor: { label: 'Ask Kasalig', icon: ChatIcon, cta: 'Start chat' },
  quiz: { label: 'Quiz', icon: QuizIcon, cta: 'Start' },
};

/** One recommendation: what to do, why it was picked, and a button to do it. */
export function RecCard({ rec, rank, onDone, compact = false }) {
  const kind = KINDS[rec.kind];
  const Icon = rec.kind === 'resource' && rec.url ? LinkIcon : kind.icon;
  const style = rec.topic ? { '--c': rec.topic.color, '--t': rec.topic.tint } : undefined;
  const canDismiss = rec.kind === 'resource' || rec.kind === 'tutor';

  let action;
  if (rec.kind === 'resource' && rec.url) {
    action = (
      <a href={rec.url} target="_blank" rel="noopener noreferrer" className="kd-btn kd-btn-dark kd-btn-sm" onClick={() => onDone?.(rec.key)}>
        {kind.cta} <ArrowIcon size={15} />
      </a>
    );
  } else if (rec.kind === 'resource') {
    action = (
      <button type="button" className="kd-btn kd-btn-dark kd-btn-sm" onClick={() => onDone?.(rec.key)}>
        <CheckIcon size={15} /> I studied this
      </button>
    );
  } else {
    action = (
      <Link to={rec.to} state={rec.state} className="kd-btn kd-btn-dark kd-btn-sm">
        {kind.cta} <ArrowIcon size={15} />
      </Link>
    );
  }

  return (
    <article className={`kd-rec ${compact ? 'is-compact' : ''} ${rank === 1 ? 'is-top' : ''}`} style={style}>
      {rank && <span className="kd-rec-rank" aria-label={`Recommendation ${rank}`}>{rank}</span>}
      <span className="kd-rec-icon" aria-hidden="true">
        <Icon size={20} />
      </span>
      <div className="kd-rec-body">
        <div className="kd-rec-top">
          <span className="kd-rec-kind">{kind.label}{rec.meta ? ` · ${rec.meta}` : ''}</span>
          {rec.fromTeacher && <span className="kd-chip kd-chip-ok">From your teacher</span>}
          {!compact && rec.severity && <SeverityChip severity={rec.severity} />}
        </div>
        <h3>{rec.title}</h3>
        <p className="kd-rec-why">
          <BulbIcon size={15} />
          <span>
            <b>Why: </b>
            {rec.reason}
          </span>
        </p>
        {!compact && rec.gapType && (
          <div className="kd-chip-row">
            <span className="kd-chip" style={{ color: rec.topic.color, background: rec.topic.tint }}>{rec.topic.name}</span>
            <GapTypeChip type={rec.gapType} short />
          </div>
        )}
      </div>
      <div className="kd-rec-actions">
        {action}
        {canDismiss && rec.kind !== 'resource' && onDone && (
          <button type="button" className="kd-link-btn kd-small" onClick={() => onDone(rec.key)}>
            Done
          </button>
        )}
      </div>
    </article>
  );
}

/** "Your recommendations were updated": what the latest result added, closed or changed. */
export function ChangesPanel({ changes, compact = false, onSeen }) {
  if (!changes) return null;
  const { attempt, firstResult, added, closed, worse, improved } = changes;
  const items = [
    ...closed.map((c) => ({ key: `c-${c.topic.id}`, tone: 'good', text: `${c.topic.name} gap closed` })),
    ...improved.map((c) => ({ key: `i-${c.topic.id}`, tone: 'good', text: `${c.topic.name} up ${c.from}% → ${c.to}%` })),
    ...added.map((c) => ({ key: `a-${c.topic.id}`, tone: 'new', text: `New gap: ${c.topic.name} (${SEVERITIES[c.gap.severity].label.toLowerCase()})` })),
    ...worse.map((c) => ({ key: `w-${c.topic.id}`, tone: 'bad', text: `${c.topic.name} is now ${SEVERITIES[c.gap.severity].label.toLowerCase()}` })),
  ];

  return (
    <section className={`kd-changes ${compact ? 'is-compact' : ''}`} aria-live="polite">
      <span className="kd-changes-icon" aria-hidden="true">
        <SparkleIcon size={20} />
      </span>
      <div className="kd-changes-body">
        <strong>
          {firstResult ? 'Your first recommendations are ready' : 'Recommendations updated'}
          <span className="kd-muted kd-small"> · after “{attempt.title}”, {formatDate(attempt.takenAt, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
        </strong>
        {firstResult ? (
          <p>{added.length ? `${added.length} gap${added.length === 1 ? '' : 's'} found, ordered so prerequisites come first.` : 'No gaps found. Nice!'}</p>
        ) : items.length ? (
          <ul className="kd-change-list">
            {items.map((i) => (
              <li key={i.key} className={`is-${i.tone}`}>{i.text}</li>
            ))}
          </ul>
        ) : (
          <p>No change to your gaps this time; your next steps stay the same.</p>
        )}
      </div>
      {onSeen && (
        <button type="button" className="kd-icon-btn kd-icon-btn-sm" onClick={onSeen} aria-label="Dismiss">
          ×
        </button>
      )}
    </section>
  );
}

/** Count of open recommendations, for the navigation. */
export function RecBadge() {
  const { recs } = useStudentProgress();
  if (!recs.length) return null;
  return (
    <span className="kd-nav-badge" aria-label={`${recs.length} recommendations`}>
      {recs.length > 9 ? '9+' : recs.length}
    </span>
  );
}

/**
 * Kasalig's review of how the student is learning: a verdict, what's holding them
 * back (each with evidence and a fix) and what's working. `compact` shows the top point only.
 */
export function StudyReview({ review, title = 'Kasalig\u2019s review of how you study', compact = false, max = 4 }) {
  if (!review?.stats) return null;
  const critiques = review.critiques.slice(0, compact ? 1 : max);
  return (
    <section className={`kd-review-card ${compact ? 'is-compact' : ''}`}>
      <header className="kd-review-card-head">
        <CapyFace size={compact ? 36 : 46} />
        <div>
          <p className="kd-review-card-label">{title}</p>
          <p className="kd-review-verdict">{review.verdict}</p>
        </div>
      </header>

      {critiques.length > 0 && (
        <div className="kd-critiques">
          {!compact && <h3>What&rsquo;s holding you back</h3>}
          <ol>
            {critiques.map((c) => (
              <li key={c.id}>
                <strong>{c.title}</strong>
                <p>
                  <span className="kd-tag-evidence">Evidence</span> {c.evidence}
                </p>
                <p className="kd-advice">
                  <span className="kd-tag-advice">Try this</span> {c.advice}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {!compact && review.strengths.length > 0 && (
        <div className="kd-strengths">
          <h3>What&rsquo;s working</h3>
          <ul>
            {review.strengths.map((s) => (
              <li key={s.title}>
                <CheckIcon size={15} /> <strong>{s.title}:</strong> {s.evidence}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
