import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import ChangePasswordModal from './ChangePasswordModal.jsx';

const NAV_LINKS = [
  { to: '/home',       label: 'Home' },
  { to: '/runner',     label: 'Runner' },
  { to: '/challenges', label: 'Practice' },
  { to: '/interview',  label: 'Commands' },
  { to: '/notes',      label: 'Notes' },
];

export default function Navbar() {
  const { user, logout }              = useAuth();
  const { theme, toggle }             = useTheme();
  const location                      = useLocation();
  const [dropOpen, setDropOpen]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const dropRef                       = useRef(null);
  const mobileRef                     = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target))   setDropOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const initials = (user?.username?.[0] || 'U').toUpperCase();

  return (
    <>
      <nav
        className={`nav-glass fixed top-0 left-0 right-0 z-40 h-[64px]
                    flex items-center px-5 md:px-8 gap-4 transition-shadow duration-300
                    ${scrolled ? 'shadow-xl shadow-black/30' : ''}`}
      >
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center
                          group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-colors">
            <i className="fas fa-terminal text-amber-400 text-xs" />
          </div>
          <div className="hidden sm:flex items-baseline gap-0.5">
            <span className="font-black tracking-tight text-cc-text text-[16px] leading-none">TCL</span>
            <span className="font-black tracking-tight text-amber-400 text-[16px] leading-none">Forge</span>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-cc-border/60" />

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center h-full">
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative h-full flex items-center px-3.5 text-[14px] font-semibold
                            transition-colors duration-150 ${
                  active
                    ? 'text-amber-400'
                    : 'text-cc-subtle hover:text-cc-text'
                }`}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full bg-amber-400" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Theme toggle — inline in navbar */}
        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-8 h-8 rounded-xl bg-cc-surface/80 border border-cc-border/70
                     hover:border-amber-500/50 flex items-center justify-center
                     text-cc-muted hover:text-amber-400 transition-all"
        >
          <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-[13px]`} />
        </button>

        {/* Profile avatar — icon only */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropOpen((o) => !o)}
            title={user?.username || 'Profile'}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500
                       flex items-center justify-center text-[#0d0c0a] text-xs font-black
                       hover:scale-105 transition-transform ring-2 ring-transparent
                       hover:ring-amber-400/50"
          >
            {initials}
          </button>

          {dropOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-cc-surface border border-cc-border
                            rounded-2xl shadow-2xl shadow-black/40 z-50 animate-fade-in overflow-hidden">
              <div className="px-4 py-3.5 border-b border-cc-border bg-cc-bg/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500
                                  flex items-center justify-center text-[#0d0c0a] font-black shrink-0 text-sm">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-cc-text truncate">{user?.username}</p>
                    <p className="text-[11px] text-cc-muted truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-1.5">
                <button
                  onClick={() => { setDropOpen(false); setShowPwModal(true); }}
                  className="w-full text-left px-3.5 py-2.5 text-sm text-cc-muted hover:bg-cc-card
                             hover:text-cc-text rounded-xl flex items-center gap-3 transition-colors"
                >
                  <i className="fas fa-key text-xs text-amber-400 w-4" />
                  Change Password
                </button>
                <div className="my-1 border-t border-cc-border/50" />
                <button
                  onClick={() => { setDropOpen(false); logout(); }}
                  className="w-full text-left px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-900/15
                             rounded-xl flex items-center gap-3 transition-colors"
                >
                  <i className="fas fa-sign-out-alt text-xs w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="relative md:hidden" ref={mobileRef}>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 rounded-lg text-cc-subtle hover:text-cc-text hover:bg-cc-surface/80
                       border border-cc-border/60 transition-colors"
          >
            <i className={`fas ${mobileOpen ? 'fa-xmark' : 'fa-bars'} text-sm`} />
          </button>

          {mobileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-cc-surface border border-cc-border
                            rounded-2xl shadow-2xl shadow-black/40 z-50 animate-fade-in overflow-hidden p-1.5">
              {NAV_LINKS.map(({ to, label }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
                                transition-colors ${
                      active
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-cc-muted hover:text-cc-text hover:bg-cc-card'
                    }`}
                  >
                    {label}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}
    </>
  );
}
