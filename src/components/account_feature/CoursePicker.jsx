import { useEffect, useRef, useState } from 'react';
import { FieldError } from './AuthShared';

/* ---------------------------------------------------------------------------
 * CoursePicker: a searchable course dropdown for the account forms.
 *
 * Closed, it looks like the other inputs. Open, it shows a search box and the
 * courses grouped by field of study, each with a small icon; typing filters
 * the list and highlights the match. Works with mouse, touch and keyboard
 * (↑ ↓ to move, Enter to pick, Esc to close, or just start typing).
 *
 * It talks to the form like a normal input: onChange / onFocus / onBlur are
 * called with `{ target: { name, value } }`.
 * ------------------------------------------------------------------------- */

// Fields of study, in the order they are listed. A course joins the first group
// whose `match` fits its name; anything unmatched lands in "Other courses".
const COURSE_GROUPS = [
  // "Computer Engineering" belongs with the engineers, hence the look-ahead.
  { key: 'computing', label: 'Computing', icon: '💻', match: /^(?!.*engineer).*(comput|information|software|data|cyber)/i },
  { key: 'engineering', label: 'Engineering & Architecture', icon: '⚙️', match: /engineer|architect/i },
  { key: 'business', label: 'Business & Hospitality', icon: '📊', match: /account|business|management|marketing|financ|hospitality|tourism|entrepreneur/i },
  { key: 'health', label: 'Health & Behavioral Sciences', icon: '🩺', match: /nurs|pharm|medic|health|psych|biolog/i },
  { key: 'law', label: 'Law & Public Safety', icon: '⚖️', match: /criminolog|law|legal|politic/i },
  { key: 'education', label: 'Education', icon: '🍎', match: /educat|teach/i },
];
const OTHER_GROUP = { key: 'other', label: 'Other courses', icon: '🎓' };

const groupOf = (course) => COURSE_GROUPS.find((group) => group.match.test(course)) ?? OTHER_GROUP;

/** Courses matching the search, bucketed into their groups (empty groups dropped). */
const groupCourses = (courses, query) => {
  const needle = query.trim().toLowerCase();
  const buckets = [...COURSE_GROUPS, OTHER_GROUP].map((group) => ({ ...group, items: [] }));
  courses
    .filter((course) => !needle || course.toLowerCase().includes(needle))
    .forEach((course) => buckets.find((bucket) => bucket.key === groupOf(course).key).items.push(course));
  return buckets.filter((bucket) => bucket.items.length > 0);
};

/** The course name with the part that matches the search marked. */
const Highlight = ({ text, query }) => {
  const needle = query.trim();
  const at = needle ? text.toLowerCase().indexOf(needle.toLowerCase()) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + needle.length)}</mark>
      {text.slice(at + needle.length)}
    </>
  );
};

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="20" y1="20" x2="16.2" y2="16.2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function CoursePicker({
  id,
  name,
  label,
  value,
  options,
  placeholder = 'Select your course',
  error,
  disabled,
  onChange,
  onFocus,
  onBlur,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  // Set when the highlighted option should be scrolled into view (keyboard moves
  // and opening). Hovering must not scroll, or the list would run away from the mouse.
  const revealActive = useRef(false);

  const listId = `${id}-listbox`;
  const groups = groupCourses(options, query);
  const visibleCourses = groups.flatMap((group) => group.items);
  const selectedGroup = value ? groupOf(value) : null;

  const openPanel = (initialQuery = '') => {
    if (disabled) return;
    const startingList = groupCourses(options, initialQuery).flatMap((group) => group.items);
    setQuery(initialQuery);
    setActiveIndex(Math.max(0, startingList.indexOf(value)));
    revealActive.current = true;
    setOpen(true);
  };

  // Focus goes back to the trigger first, so it never leaves the field while closing.
  const closePanel = () => {
    triggerRef.current?.focus();
    setOpen(false);
  };

  const choose = (course) => {
    onChange?.({ target: { name, value: course } });
    closePanel();
  };

  const moveActive = (step) => {
    if (visibleCourses.length === 0) return;
    revealActive.current = true;
    setActiveIndex((index) => (index + step + visibleCourses.length) % visibleCourses.length);
  };

  // On opening: bring the panel into view and put the caret in the search box.
  // (Not on touch screens, where that would pop the keyboard up over the list.)
  useEffect(() => {
    if (!open) return;
    panelRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    const search = searchRef.current;
    if (search && !window.matchMedia('(pointer: coarse)').matches) {
      search.focus();
      search.setSelectionRange(search.value.length, search.value.length);
    }
  }, [open]);

  // Keep the highlighted option visible while arrowing through the list.
  useEffect(() => {
    if (!open || !revealActive.current) return;
    revealActive.current = false;
    listRef.current?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  // A tap or click anywhere outside closes the panel. (Focus alone is not enough:
  // some touch browsers never focus the trigger, so no blur would follow.)
  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (e) => {
      if (rootRef.current?.contains(e.target)) return;
      setOpen(false);
      onBlur?.({ target: { name } });
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, onBlur, name]);

  // Focus moving between the trigger and the panel stays "inside" the field;
  // the form only hears about focus arriving from, or leaving to, somewhere else.
  const handleRootFocus = (e) => {
    if (!rootRef.current?.contains(e.relatedTarget)) onFocus?.({ target: { name } });
  };

  const handleRootBlur = (e) => {
    if (rootRef.current?.contains(e.relatedTarget)) return;
    setOpen(false);
    onBlur?.({ target: { name } });
  };

  const handleTriggerKeyDown = (e) => {
    if (open) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openPanel();
    } else if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Start typing on the closed field to open it already searching.
      e.preventDefault();
      openPanel(e.key);
    }
  };

  const handleSearchKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveActive(-1);
        break;
      case 'Enter':
        e.preventDefault(); // never submit the form from the search box
        if (visibleCourses[activeIndex]) choose(visibleCourses[activeIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        closePanel();
        break;
      case 'Tab':
        closePanel(); // then Tab carries on to the next / previous field as usual
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className="kb-auth-field kb-course-field"
      onFocus={handleRootFocus}
      onBlur={handleRootBlur}
    >
      <label id={`${id}-label`} htmlFor={id} className="kb-auth-label">{label}</label>

      <div className="kb-course">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          className={`kb-course-trigger${open ? ' is-open' : ''}${error ? ' has-error' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          disabled={disabled}
          onClick={() => (open ? closePanel() : openPanel())}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className={`kb-course-chip is-${selectedGroup?.key ?? 'empty'}`} aria-hidden="true">
            {selectedGroup?.icon ?? OTHER_GROUP.icon}
          </span>
          <span id={`${id}-value`} className={`kb-course-value${value ? '' : ' is-placeholder'}`}>
            {value || placeholder}
          </span>
          <span className="kb-course-chevron"><ChevronIcon /></span>
        </button>

        {open && (
          <div
            ref={panelRef}
            className="kb-course-panel"
            // Clicking the list must not steal focus from the search box.
            onMouseDown={(e) => { if (e.target !== searchRef.current) e.preventDefault(); }}
          >
            <div className="kb-course-search">
              <SearchIcon />
              <input
                ref={searchRef}
                type="text"
                className="kb-course-search-input"
                placeholder="Search courses…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                  revealActive.current = true;
                }}
                onKeyDown={handleSearchKeyDown}
                role="combobox"
                aria-label="Search courses"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={
                  visibleCourses.length > 0 ? `${id}-option-${activeIndex}` : undefined
                }
                autoComplete="off"
                spellCheck="false"
              />
              <span className="kb-course-count">{visibleCourses.length}</span>
            </div>

            <div ref={listRef} id={listId} className="kb-course-list" role="listbox" aria-label={label}>
              {groups.map((group) => (
                <div key={group.key} role="group" aria-label={group.label}>
                  <div className="kb-course-group-label" aria-hidden="true">{group.label}</div>
                  {group.items.map((course) => {
                    const index = visibleCourses.indexOf(course);
                    const isSelected = course === value;
                    return (
                      <div
                        key={course}
                        id={`${id}-option-${index}`}
                        role="option"
                        aria-selected={isSelected}
                        className={`kb-course-option${index === activeIndex ? ' is-active' : ''}${
                          isSelected ? ' is-selected' : ''
                        }`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => choose(course)}
                      >
                        <span className={`kb-course-chip is-${group.key}`} aria-hidden="true">{group.icon}</span>
                        <span className="kb-course-option-name">
                          <Highlight text={course} query={query} />
                        </span>
                        {isSelected && <span className="kb-course-check"><CheckIcon /></span>}
                      </div>
                    );
                  })}
                </div>
              ))}

              {visibleCourses.length === 0 && (
                <p className="kb-course-empty">
                  No course matches “{query.trim()}”. Try another word.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <FieldError id={id} message={error} />
    </div>
  );
}
