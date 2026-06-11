import { Link } from 'react-router-dom';

const PLATFORM_LINKS = [
  { to: '/runner',    label: 'Live Runner' },
  { to: '/challenges', label: 'Challenges' },
  { to: '/interview', label: 'Interview Prep' },
  { to: '/notes',     label: 'Notes & PDFs' },
];

const RESOURCE_LINKS = [
  { href: 'https://www.tcl.tk/doc/', label: 'TCL Reference', external: true },
  { href: 'https://www.cadence.com/en_US/home/tools/digital-design-and-signoff/synthesis/genus-synthesis-solution.html', label: 'Genus Docs', external: true },
  { href: 'https://www.cadence.com/en_US/home/tools/digital-design-and-signoff/soc-implementation-and-floorplanning/innovus-implementation-system.html', label: 'Innovus Docs', external: true },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-cc-border bg-cc-nav">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <i className="fas fa-terminal text-amber-400 text-xs" />
              </div>
              <span className="font-black text-cc-text text-sm tracking-tight">
                TCL<span className="text-amber-400">Forge</span>
              </span>
            </div>
            <p className="text-xs text-cc-subtle leading-relaxed max-w-[180px]">
              The TCL scripting platform for EDA engineers — practice, reference, and learn.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-bold text-cc-faint uppercase tracking-widest mb-3">Platform</h4>
            <ul className="space-y-2">
              {PLATFORM_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="text-xs text-cc-subtle hover:text-amber-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[11px] font-bold text-cc-faint uppercase tracking-widest mb-3">Resources</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-cc-subtle hover:text-amber-400 transition-colors flex items-center gap-1">
                    {label}
                    <i className="fas fa-arrow-up-right-from-square text-[8px] opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-[11px] font-bold text-cc-faint uppercase tracking-widest mb-3">About</h4>
            <ul className="space-y-2">
              <li className="text-xs text-cc-subtle">Built by Kunal Saraswat</li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-cc-subtle hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <i className="fab fa-github text-[12px]" /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cc-border pt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[12px] text-cc-faint font-mono">
            TCL Forge © 2026 · Built by Kunal Saraswat
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-cc-faint font-mono">v2.0</span>
            <span className="w-1 h-1 rounded-full bg-cc-faint" />
            <span className="text-[12px] text-cc-faint">EDA Scripting Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
