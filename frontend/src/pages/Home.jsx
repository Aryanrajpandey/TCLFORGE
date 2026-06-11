import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';

/* ── Sidebar topic data ───────────────────────────────────────── */
const TCL_TOPICS = [
  {
    key: 'basics', label: 'TCL Fundamentals', icon: 'fa-code',
    items: [
      { label: 'Variables & Data Types',      to: '/learn/variables-data-types' },
      { label: 'Expressions & Operators',     to: '/learn/expressions-operators' },
      { label: 'Control Flow (if/while/for)', to: '/learn/control-flow' },
      { label: 'Subst & Quoting Rules',       to: '/learn/subst-quoting' },
    ],
  },
  {
    key: 'lists', label: 'Lists & Arrays', icon: 'fa-list-ul',
    items: [
      { label: 'List Commands',      to: '/learn/list-commands' },
      { label: 'Array Manipulation', to: '/learn/array-manipulation' },
      { label: 'lsort & lsearch',    to: '/learn/lsort-lsearch' },
    ],
  },
  {
    key: 'strings', label: 'String Operations', icon: 'fa-font',
    items: [
      { label: 'string Commands', to: '/learn/string-commands' },
      { label: 'split & join',    to: '/learn/split-join' },
      { label: 'format & scan',   to: '/learn/format-scan' },
    ],
  },
  {
    key: 'fileio', label: 'File Handling', icon: 'fa-file-code',
    items: [
      { label: 'open / close / gets', to: '/learn/file-open-close' },
      { label: 'Read & Write Files',  to: '/learn/file-read-write' },
      { label: 'glob & file ops',     to: '/learn/glob-file-ops' },
    ],
  },
  {
    key: 'procs', label: 'Procedures', icon: 'fa-cube',
    items: [
      { label: 'Defining Procs',        to: '/learn/defining-procs' },
      { label: 'Scope: global / upvar', to: '/learn/scope-global-upvar' },
      { label: 'Namespace',             to: '/learn/namespace' },
    ],
  },
  {
    key: 'regex', label: 'Regex & Parsing', icon: 'fa-magnifying-glass',
    items: [
      { label: 'regexp & regsub',  to: '/learn/regexp-regsub' },
      { label: 'Log File Parsing', to: '/learn/log-file-parsing' },
    ],
  },
  {
    key: 'eda', label: 'EDA Scripting', icon: 'fa-microchip',
    items: [
      { label: 'Genus — Synthesis', to: '/interview' },
      { label: 'Innovus — P&R',     to: '/interview' },
      { label: 'Tempus — STA',      to: '/interview' },
    ],
  },
];

const MODULES = [
  { label: 'TCL Fundamentals', icon: 'fa-code',            desc: 'Variables, expressions, control flow, quoting rules.',         to: '/learn/variables-data-types', tag: '4 topics' },
  { label: 'Lists & Arrays',   icon: 'fa-list-ul',         desc: 'List operations, array manipulation, sorting & searching.',   to: '/learn/list-commands',        tag: '3 topics' },
  { label: 'File Handling',    icon: 'fa-file-code',       desc: 'Reading, writing files, channels, glob patterns.',           to: '/learn/file-open-close',      tag: '3 topics' },
  { label: 'Procedures',       icon: 'fa-cube',            desc: 'Defining procs, scope, upvar, namespace management.',        to: '/learn/defining-procs',       tag: '3 topics' },
  { label: 'Regex & Parsing',  icon: 'fa-magnifying-glass', desc: 'regexp, regsub, extracting data from EDA log files.',      to: '/learn/regexp-regsub',        tag: '2 topics' },
  { label: 'EDA Scripting',    icon: 'fa-microchip',       desc: '150 Genus, Innovus and Tempus commands with usage examples.', to: '/interview',                 tag: '3 tools' },
];



function TopicSection({ topic, isOpen, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors text-left"
        style={{ background: isOpen ? 'rgba(245,158,11,0.08)' : 'transparent' }}
      >
        <span className={`text-[13.5px] font-semibold leading-snug ${isOpen ? 'text-amber-500' : 'text-cc-text'}`}>
          {topic.label}
        </span>
        <i className={`fas fa-chevron-down text-[9px] transition-transform duration-200 shrink-0 ml-2 ${isOpen ? '' : '-rotate-90'} text-cc-faint`} />
      </button>
      {isOpen && (
        <div className="mb-1 mt-0.5 ml-3 pl-3 border-l border-amber-500/20">
          {topic.items.map(item => (
            <Link key={item.label} to={item.to}
              className="block py-1.5 px-2 rounded text-[12.5px] transition-colors leading-snug text-cc-muted hover:text-amber-500 hover:bg-amber-500/5">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
export default function Home() {
  const [open, setOpen] = useState(
    Object.fromEntries(TCL_TOPICS.map((t, i) => [t.key, i < 2]))
  );
  const toggle = key => setOpen(p => ({ ...p, [key]: !p[key] }));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');

  const filteredTopics = search.trim()
    ? TCL_TOPICS.map(t => ({
        ...t,
        items: t.items.filter(item =>
          item.label.toLowerCase().includes(search.toLowerCase()) ||
          t.label.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(t => t.items.length > 0)
    : TCL_TOPICS;

  return (
    <div className="flex bg-cc-bg" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

      {/* ── Left Sidebar ─────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col shrink-0 overflow-hidden bg-cc-surface border-r border-cc-border transition-all duration-200"
        style={{ width: sidebarOpen ? '248px' : '40px' }}
      >
        {/* Icon rail — collapsed state */}
        {!sidebarOpen && (
          <div className="flex flex-col items-center py-2 gap-0.5">
            <button
              onClick={() => setSidebarOpen(true)}
              title="Expand sidebar"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-cc-faint hover:text-amber-500 hover:bg-amber-500/8 transition-colors mb-1">
              <i className="fas fa-chevron-right text-[10px]" />
            </button>
            <div className="w-5 border-t border-cc-border mb-1" />
            {TCL_TOPICS.map(t => (
              <button
                key={t.key}
                title={t.label}
                onClick={() => { setSidebarOpen(true); setOpen(p => ({ ...p, [t.key]: true })); }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-cc-faint hover:text-amber-500 hover:bg-amber-500/8 transition-colors">
                <i className={`fas ${t.icon} text-[11px]`} />
              </button>
            ))}
          </div>
        )}

        {/* Nav — only when open */}
        {sidebarOpen && (
          <nav className="flex-1 px-2.5 pt-0 pb-2 space-y-0.5 overflow-y-auto relative">
            {/* Search + collapse row */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="relative flex-1">
                <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-cc-faint pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search topics…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-[14px] bg-transparent border-0 text-cc-text placeholder-cc-faint focus:outline-none transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-cc-faint hover:text-cc-muted">
                    <i className="fas fa-xmark text-[10px]" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                title="Collapse sidebar"
                className="p-1.5 rounded-lg text-cc-faint hover:text-amber-500 hover:bg-amber-500/6 transition-colors shrink-0">
                <i className="fas fa-chevron-left text-[10px]" />
              </button>
            </div>

            {filteredTopics.length === 0 ? (
              <p className="px-3 py-4 text-[12px] text-cc-faint text-center">No topics found</p>
            ) : (
              filteredTopics.map(topic => (
                <TopicSection key={topic.key} topic={{ ...topic, forceOpen: !!search.trim() }}
                  isOpen={search.trim() ? true : open[topic.key]} onToggle={() => toggle(topic.key)} />
              ))
            )}

            <div className="pt-3 mt-2 border-t border-cc-border">
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-cc-faint">
                External Docs
              </p>
              {[
                { label: 'TCL Reference', href: 'https://www.tcl.tk/doc/' },
                { label: 'Genus Docs',    href: '#' },
                { label: 'Innovus Docs',  href: '#' },
              ].map(r => (
                <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[13px] text-cc-muted hover:text-amber-500 hover:bg-amber-500/5 transition-colors">
                  {r.label}
                  <i className="fas fa-arrow-up-right-from-square text-[9px] opacity-50" />
                </a>
              ))}
            </div>
          </nav>
        )}
      </aside>

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7">
        <div className="max-w-5xl">

          <h1 className="text-[27px] font-black tracking-tight mb-1 text-cc-text">
            TCL Scripting Tutorial
          </h1>
          <p className="text-[14px] mb-6 text-cc-muted">
            Last Updated · June 2026 &nbsp;
          </p>

          {/* Intro paragraphs */}
          <p className="text-[16px] leading-relaxed mb-2 text-cc-text">
            <strong>TCL (Tool Command Language)</strong> is a scripting language widely used in EDA tools such as
            Genus, Innovus, and Tempus. It is used for synthesis scripts, place-and-route automation,
            timing analysis, and constraint management.
          </p>
          <p className="text-[16px] leading-relaxed mb-5 text-cc-text">
            This platform lets you practice TCL interactively — run scripts in the live runner, solve
            EDA-specific challenges, and look up the 150 most important tool commands.
          </p>

          {/* Why learn box */}
          <div className="rounded-xl p-5 mb-6 bg-amber-500/5 border border-amber-500/15">
            <p className="text-[15px] font-bold mb-3 text-amber-500">Why learn TCL for EDA?</p>
            <ul className="space-y-2">
              {[
                'Used natively in Cadence, Synopsys & Mentor EDA tools',
                'Automates repetitive synthesis, placement, and routing flows',
                'Essential for writing SDC timing constraints and scripts',
                'Skills directly applicable in VLSI and physical design roles',
              ].map(pt => (
                <li key={pt} className="flex items-start gap-2.5 text-[15px] text-cc-text">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 inline-block bg-amber-500" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          {/* How this platform works */}
          <h2 className="text-[17px] font-black mb-3 flex items-center gap-2 text-cc-text">
            <span className="w-0.5 h-5 rounded-full inline-block shrink-0 bg-amber-500" />
            How This Platform Works
          </h2>
          <p className="text-[15px] leading-relaxed mb-4 text-cc-muted">
            Each topic is broken into short, focused sections with real code examples you can read and understand at your own pace.
            After finishing a topic, head to the <strong className="text-cc-text">Live Runner</strong> to experiment with the commands directly in your browser — no local setup needed.
          </p>
          <p className="text-[15px] leading-relaxed mb-6 text-cc-muted">
            Once you're comfortable, test yourself in the <strong className="text-cc-text">Practice Challenges</strong> section, which covers both general TCL scripting tasks and real-world physical design scenarios.
            The <strong className="text-cc-text">EDA Commands</strong> reference lists 150 commonly used Genus, Innovus, and Tempus commands — useful for interview prep and day-to-day scripting.
          </p>

          {/* Prerequisites */}
          <div className="rounded-xl p-5 mb-6 bg-cc-surface border border-cc-border">
            <p className="text-[15px] font-bold mb-3 text-cc-text flex items-center gap-2">
              <i className="fas fa-circle-check text-[#3fb950] text-sm" />
              Prerequisites
            </p>
            <p className="text-[14px] leading-relaxed text-cc-muted mb-3">
              No prior TCL experience is required. A basic understanding of any scripting language (Python, Bash, etc.) will help you move through the fundamentals faster, but is not mandatory.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Basic programming concepts', 'Familiarity with terminal/CLI', 'Interest in EDA / VLSI flows'].map(tag => (
                <span key={tag} className="text-[12px] px-3 py-1 rounded-full bg-cc-bg border border-cc-border text-cc-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Topics Covered */}
          <h2 className="text-[17px] font-black mb-3 flex items-center gap-2 text-cc-text">
            <span className="w-0.5 h-5 rounded-full inline-block shrink-0 bg-amber-500" />
            Topics Covered
          </h2>
          <div className="flex flex-col gap-3 mb-6">
            {MODULES.map(({ label, icon, desc, to, tag }) => (
              <Link key={label} to={to}
                className="group flex gap-3 rounded-xl p-4 transition-all duration-150 bg-cc-surface border border-cc-border hover:border-amber-500/40 glow-card">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-cc-card border border-cc-border">
                  <i className={`fas ${icon} text-base text-cc-muted group-hover:text-amber-400 transition-colors`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[15px] font-black text-cc-text">{label}</span>
                    <span className="text-[11px] font-semibold shrink-0 text-cc-faint">{tag}</span>
                  </div>
                  <p className="text-[13px] leading-snug text-cc-muted">{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick launch row */}
          <div className="flex flex-wrap gap-2">
            {[
              { to: '/runner',     icon: 'fa-terminal',  label: 'Live Runner',   color: '#7c3aed' },
              { to: '/challenges', icon: 'fa-trophy',    label: 'Practice',      color: '#d97706' },
              { to: '/interview',  icon: 'fa-lightbulb', label: 'Interview Prep', color: '#2563eb' },
              { to: '/notes',      icon: 'fa-book-open', label: 'Notes',         color: '#059669' },
            ].map(({ to, icon, label, color }) => (
              <Link key={to} to={to}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-semibold bg-cc-surface border border-cc-border text-cc-text hover:border-amber-500/40 transition-all">
                <i className={`fas ${icon} text-[12px]`} style={{ color }} />
                {label}
              </Link>
            ))}
          </div>
        </div>
        </main>

    </div>
  );
}
