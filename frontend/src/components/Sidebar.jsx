import { NavLink } from 'react-router-dom';

const SECTIONS = [
  {
    label: 'Overview',
    items: [
      { to: '/home',   label: 'Dashboard',      icon: 'fa-gauge-high', badge: null },
      { to: '/runner', label: 'Live TCL Runner', icon: 'fa-terminal',   badge: 'Live' },
    ],
  },
  {
    label: 'Practice',
    items: [
      { to: '/challenges', label: 'Challenges',    icon: 'fa-trophy',    badge: '6' },
      { to: '/interview',  label: 'Interview Prep', icon: 'fa-lightbulb', badge: '150' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { to: '/notes', label: 'Notes & Files', icon: 'fa-book-open', badge: '5' },
    ],
  },
];

export default function Sidebar({ open }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[1px] lg:hidden" />
      )}

      <aside
        className={`fixed top-[60px] left-0 bottom-0 z-30 w-60 bg-cc-bg border-r border-cc-border
                    flex flex-col transition-transform duration-200
                    ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Brand strip */}
        <div className="px-4 py-4 border-b border-cc-border">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
              <i className="fas fa-microchip text-amber-400 text-[11px]" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-cc-text leading-none">TCL Practice Hub</p>
              <p className="text-[11px] text-cc-subtle mt-0.5">EDA Learning Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation sections */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {SECTIONS.map(({ label, items }) => (
            <div key={label}>
              <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-cc-subtle px-2 mb-1.5">
                {label}
              </p>
              <div className="space-y-0.5">
                {items.map(({ to, label: itemLabel, icon, badge }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all ${
                        isActive
                          ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500'
                          : 'text-cc-muted hover:text-cc-text hover:bg-cc-surface'
                      }`
                    }
                    style={({ isActive }) => isActive ? { paddingLeft: 'calc(0.75rem - 2px)' } : {}}
                  >
                    {({ isActive }) => (
                      <>
                        <i className={`fas ${icon} text-xs w-4 shrink-0 ${
                          isActive ? 'text-amber-400' : 'text-cc-subtle group-hover:text-cc-muted'
                        }`} />
                        <span className="flex-1 truncate">{itemLabel}</span>
                        {badge && (
                          <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${
                            badge === 'Live'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-cc-bg text-cc-muted border border-cc-border'
                          }`}>
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Tip box */}
        <div className="mx-3 mb-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <div className="flex items-start gap-2">
            <i className="fas fa-bolt text-amber-400 text-[11px] mt-0.5 shrink-0" />
            <p className="text-[11px] text-cc-muted leading-relaxed">
              Use{' '}
              <span className="text-amber-400 font-mono">Ctrl+Enter</span>
              {' '}in Runner to execute code instantly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-cc-border">
          <p className="text-[11px] text-cc-subtle text-center">TCL Forge © 2026</p>
          <p className="text-[11px] text-cc-faint text-center mt-0.5">by Kunal Saraswat</p>
        </div>
      </aside>
    </>
  );
}
