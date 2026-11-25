import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, matchPath, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import { useStaffGate, useStudentGate, useSyncError } from '../../store/learningStore';
import { Avatar, EmptyState } from './DashWidgets';
import { RecBadge } from './Recommendations';
import {
  ChartIcon,
  ChatIcon,
  HistoryIcon,
  HomeIcon,
  LibraryIcon,
  LogoMark,
  LogoutIcon,
  MapIcon,
  PathIcon,
  QuizIcon,
  SparkleIcon,
  UserIcon,
  XIcon,
} from './DashIcons';
import './Dashboard.css';

/* The navigation for each role, grouped by what people come to do. */
const NAV = {
  student: [
    {
      label: 'Learn',
      links: [
        { to: '/dashboard', label: 'Home', icon: HomeIcon, end: true },
        { to: '/dashboard/for-you', label: 'For you', icon: SparkleIcon, badge: true },
        { to: '/dashboard/quiz', label: 'Quizzes', icon: QuizIcon },
        { to: '/dashboard/path', label: 'Learning path', icon: PathIcon },
        { to: '/dashboard/tutor', label: 'Ask Kasalig', icon: ChatIcon },
      ],
    },
    {
      label: 'Track',
      links: [
        { to: '/dashboard/results', label: 'Gap report', icon: ChartIcon },
        { to: '/dashboard/progress', label: 'Progress', icon: HistoryIcon },
      ],
    },
  ],
  teacher: [
    {
      label: 'My class',
      links: [
        { to: '/dashboard', label: 'Class dashboard', icon: HomeIcon, end: true },
        { to: '/dashboard/students', label: 'Students', icon: UserIcon },
      ],
    },
    {
      label: 'Teaching tools',
      links: [
        { to: '/dashboard/quizzes', label: 'Quiz builder', icon: QuizIcon },
        { to: '/dashboard/resources', label: 'Resource library', icon: LibraryIcon },
        { to: '/dashboard/curriculum', label: 'Curriculum map', icon: MapIcon },
      ],
    },
  ],
  admin: [
    {
      label: 'School',
      links: [
        { to: '/dashboard', label: 'School analytics', icon: ChartIcon, end: true },
        { to: '/dashboard/classes', label: 'Classes', icon: UserIcon },
        { to: '/dashboard/subjects', label: 'Subjects', icon: LibraryIcon },
      ],
    },
    {
      label: 'Curriculum',
      links: [{ to: '/dashboard/curriculum', label: 'Curriculum map', icon: MapIcon }],
    },
  ],
};

const ROLE_LABELS = { student: 'Student', teacher: 'Teacher', admin: 'Administrator' };

/** The app frame for signed-in pages: a grouped sidebar (a drawer on phones) and the page. */
export default function DashboardLayout() {
  const { user, logout, isPreview } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const groups = NAV[user.role] ?? NAV.student;
  const [menuOpen, setMenuOpen] = useState(false);

  // The page name for the phone top bar.
  const current = groups
    .flatMap((g) => g.links)
    .find((l) => matchPath({ path: l.to, end: Boolean(l.end) }, location.pathname));

  // A one-off message handed over by the previous page (e.g. "Welcome back").
  const [flash, setFlash] = useState(location.state?.flash ?? null);
  useEffect(() => {
    if (!flash) return undefined;
    const timer = setTimeout(() => setFlash(null), 4000);
    return () => clearTimeout(timer);
  }, [flash]);

  // Escape closes the phone menu.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handleLogout = () => {
    navigate('/login', {
      replace: true,
      state: { flash: { type: 'success', message: 'You have been logged out.' } },
    });
    logout();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="kd-app">
      {/* Phone top bar */}
      <header className="kd-topbar kd-no-print">
        <button type="button" className="kd-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="kd-sidebar">
          <span />
          <span />
          <span />
        </button>
        <strong className="kd-topbar-title">{current?.label ?? 'Kasalig bAI'}</strong>
        <Avatar name={user.fullName} size={34} />
      </header>

      <div className="kd-frame">
        {menuOpen && <button type="button" className="kd-scrim" aria-label="Close menu" onClick={closeMenu} />}

        <nav id="kd-sidebar" className={`kd-sidebar kd-no-print ${menuOpen ? 'is-open' : ''}`} aria-label="Dashboard">
          <div className="kd-brand">
            <Link to="/dashboard" className="kd-brand-link" onClick={closeMenu}>
              <LogoMark size={36} />
              <span>
                Kasalig <b>bAI</b>
              </span>
            </Link>
            <button type="button" className="kd-drawer-close" onClick={closeMenu} aria-label="Close menu">
              <XIcon size={20} />
            </button>
          </div>

          <div className="kd-nav-groups">
            {groups.map((group) => (
              <div key={group.label} className="kd-nav-group">
                <p className="kd-nav-label">{group.label}</p>
                <ul>
                  {group.links.map(({ to, label, icon: Icon, end, badge }) => (
                    <li key={to}>
                      <NavLink to={to} end={end} className="kd-nav-link" data-tip={label} onClick={closeMenu}>
                        <Icon size={20} />
                        <span>{label}</span>
                        {badge && <RecBadge />}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="kd-account">
            <Link to="/account/edit" className="kd-account-card" data-tip="Edit account" onClick={closeMenu}>
              <Avatar name={user.fullName} size={38} />
              <span className="kd-account-text">
                <strong>{user.fullName}</strong>
                <small>{ROLE_LABELS[user.role]}{isPreview ? ' · preview' : ''}</small>
              </span>
            </Link>
            <button type="button" className="kd-nav-link kd-logout" onClick={handleLogout} data-tip="Log out">
              <LogoutIcon size={20} />
              <span>Log out</span>
            </button>
          </div>
        </nav>

        <main className="kd-main">
          {isPreview && (
            <p className="kd-preview-bar kd-no-print">
              Preview mode: signed in as a sample {ROLE_LABELS[user.role].toLowerCase()} without the backend. Only available in development.
            </p>
          )}
          {flash && (
            <p className={`kd-toast is-${flash.type ?? 'success'}`} role="status">
              {flash.message}
            </p>
          )}
          <SyncErrorToast />
          {/* The key remounts the gate if the role ever changes, so each role keeps its own fixed hooks. */}
          {user.role === 'student' ? <StudentGate key="student" /> : <StaffGate key="staff" />}
        </main>
      </div>
    </div>
  );
}

/* --- Loading the saved data before showing a page ----------------------------- */

function StudentGate() {
  return <Gate {...useStudentGate()} />;
}

function StaffGate() {
  return <Gate {...useStaffGate()} />;
}

/** Shows the page once its data has loaded from the server, with a retry if that failed. */
function Gate({ status, error, retry }) {
  if (status === 'ready') return <Outlet />;
  if (status === 'error') {
    return (
      <section className="kd-stage kd-page">
        <EmptyState
          icon="📡"
          title="Could not load your data"
          action={
            <button type="button" className="kd-btn kd-btn-dark" onClick={retry}>
              Try again
            </button>
          }
        >
          {error} Check that the Kasalig bAI server is running.
        </EmptyState>
      </section>
    );
  }
  return (
    <section className="kd-stage kd-page" aria-busy="true">
      <EmptyState icon="⏳" title="Loading your data…" />
    </section>
  );
}

/** A save that failed: the page has already been put back to what the server has. */
function SyncErrorToast() {
  const { message, dismiss } = useSyncError();
  if (!message) return null;
  return (
    <p className="kd-toast is-error" role="alert">
      {message}{' '}
      <button type="button" className="kd-link-btn" onClick={dismiss}>
        Dismiss
      </button>
    </p>
  );
}

/** Lets only the listed roles see a page; everyone else goes back to their own home. */
export function RoleOnly({ roles, children }) {
  const { user } = useAuth();
  return roles.includes(user.role) ? children : <Navigate to="/dashboard" replace />;
}
