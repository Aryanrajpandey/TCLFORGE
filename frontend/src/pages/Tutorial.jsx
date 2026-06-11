import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getTutorial, TOPIC_TREE } from '../data/tutorials.js';
import { getQuizzes } from '../data/quizzes.js';

/* ── Sidebar ─────────────────────────────────────────────────── */
function Sidebar({ activeSlug }) {
  const [open, setOpen] = useState(() => {
    const initial = {};
    TOPIC_TREE.forEach(g => {
      initial[g.key] = g.items.some(i => i.slug === activeSlug);
    });
    return initial;
  });
  const [search, setSearch] = useState('');
  const toggle = key => setOpen(p => ({ ...p, [key]: !p[key] }));

  const filteredTree = search.trim()
    ? TOPIC_TREE.map(g => ({
        ...g,
        items: g.items.filter(item =>
          item.label.toLowerCase().includes(search.toLowerCase()) ||
          g.label.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(g => g.items.length > 0)
    : TOPIC_TREE;

  return (
    <aside className="hidden lg:flex flex-col w-[248px] shrink-0 overflow-y-auto bg-cc-surface border-r border-cc-border">
      <div className="border-b border-cc-border">
        <Link to="/home"
          className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-semibold text-cc-text hover:text-amber-500 transition-colors">
          <i className="fas fa-arrow-left text-[10px] text-cc-faint" />
          Back to Home
        </Link>
      </div>

      <nav className="flex-1 px-2.5 pt-2 pb-2 space-y-0.5 overflow-y-auto">
        {/* Search */}
        <div className="relative mb-2">
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
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cc-faint hover:text-cc-muted transition-colors">
              <i className="fas fa-xmark text-[11px]" />
            </button>
          )}
        </div>
        {filteredTree.map(group => {
          const isOpen = open[group.key];
          return (
            <div key={group.key}>
              <button
                onClick={() => toggle(group.key)}
                className="w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors text-left"
                style={{ background: isOpen ? 'rgba(245,158,11,0.08)' : 'transparent' }}
              >
                <span className={`text-[13.5px] font-semibold leading-snug ${isOpen ? 'text-amber-500' : 'text-cc-text'}`}>
                  {group.label}
                </span>
                <i className={`fas fa-chevron-down text-[9px] transition-transform duration-200 shrink-0 ml-2 text-cc-faint ${isOpen ? '' : '-rotate-90'}`} />
              </button>

              {isOpen && (
                <div className="mb-1 mt-0.5 ml-3 pl-3 border-l border-amber-500/20">
                  {group.items.map(item => {
                    const isActive = item.slug === activeSlug;
                    const href = item.slug ? `/learn/${item.slug}` : (item.to || '/interview');
                    return (
                      <Link key={item.label} to={href}
                        className={`block py-1.5 px-2 rounded text-[12.5px] transition-colors leading-snug ${
                          isActive
                            ? 'text-amber-500 bg-amber-500/8 font-semibold'
                            : 'text-cc-muted hover:text-amber-500 hover:bg-amber-500/5'
                        }`}>
                        {isActive && <span className="mr-1 text-amber-500">›</span>}
                        {item.label}
                        {!item.slug && <i className="fas fa-arrow-up-right-from-square text-[8px] ml-1 opacity-40" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

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
              className="flex items-center justify-between px-3 py-2 rounded-md text-[13px] text-cc-muted hover:text-amber-500 hover:bg-amber-500/5 transition-colors">
              {r.label}
              <i className="fas fa-arrow-up-right-from-square text-[9px] opacity-50" />
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
}

/* ── Code Block ──────────────────────────────────────────────── */
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const highlighted = code
    .split('\n')
    .map(line => {
      const commentIdx = line.indexOf(';#');
      if (commentIdx !== -1) {
        return (
          <>
            <span>{line.slice(0, commentIdx)}</span>
            <span style={{ color: '#6a7a5a', fontStyle: 'italic' }}>{line.slice(commentIdx)}</span>
          </>
        );
      }
      return <span>{line}</span>;
    });

  return (
    <div className="relative rounded-xl overflow-hidden mb-5" style={{ background: '#161412' }}>
      {/* title bar */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: '#1e1c1a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28ca41' }} />
        </div>
        <span className="text-[10px] font-mono" style={{ color: '#6a6460' }}>tcl</span>
        <button onClick={copy}
          className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded transition-colors"
          style={{ color: copied ? '#8db87a' : '#6a6460' }}>
          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} text-[10px]`} />
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="p-4 text-[13px] font-mono leading-relaxed overflow-x-auto"
        style={{ color: '#d4c9b8' }}>
        <code>
          {highlighted.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ── Quiz Panel ──────────────────────────────────────────────── */
function QuizItem({ q, index }) {
  const [expanded, setExpanded] = useState(false);
  const [answer, setAnswer]     = useState('');
  const [result, setResult]     = useState(null);

  function check() {
    setResult(answer.trim().toLowerCase() === q.a.toLowerCase() ? 'correct' : 'wrong');
  }

  return (
    <div className="border-b border-cc-border last:border-b-0">
      <div
        className="flex items-start gap-2.5 px-3.5 py-3 hover:bg-cc-card cursor-pointer transition-colors group"
        onClick={() => setExpanded(e => !e)}
      >
        <i className={`fas text-[10px] mt-0.5 shrink-0 ${
          result === 'correct' ? 'fa-check-circle text-[#3fb950]' :
          result === 'wrong'   ? 'fa-xmark text-[#f85149]' :
                                 'fa-circle text-cc-faint'}`} />
        <span className="flex-1 text-[13px] leading-snug text-cc-muted group-hover:text-cc-text transition-colors">
          {q.q}
        </span>
        <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-[9px] text-cc-faint shrink-0 mt-0.5`} />
      </div>
      {expanded && (
        <div className="px-3 pb-3 pt-1 bg-cc-bg/60 border-t border-cc-border">
          <div className="flex gap-1.5">
            <input
              className="cc-input text-[11px] flex-1 py-1 px-2"
              placeholder="Your answer…"
              value={answer}
              onChange={e => { setAnswer(e.target.value); setResult(null); }}
              onKeyDown={e => e.key === 'Enter' && check()}
            />
            <button onClick={check}
              className="cc-btn-secondary text-[11px] px-3 shrink-0 py-1">
              Check
            </button>
          </div>
          {result && (
            <p className={`text-[11px] font-semibold mt-1.5 ${result === 'correct' ? 'text-[#3fb950]' : 'text-amber-400'}`}>
              {result === 'correct' ? '✓ Correct!' : `✗ Answer: "${q.a}"`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function QuizPanel({ slug }) {
  const quizzes = getQuizzes(slug);

  if (!quizzes.length) return null;

  return (
    <div className="rounded-xl overflow-hidden bg-cc-card border border-cc-border">
      <div className="px-3 py-2.5 border-b border-cc-border flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 flex items-center gap-1.5">
          <i className="fas fa-circle-question text-[11px]" />
          Quick Quiz
        </p>
        <span className="text-[10px] text-cc-faint font-mono">{quizzes.length} questions</span>
      </div>
      <div>
        {quizzes.map((q, i) => <QuizItem key={i} q={q} index={i} />)}
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function Tutorial() {
  const { slug } = useParams();
  const tut = getTutorial(slug);

  if (!tut) {
    return (
      <div className="flex bg-cc-bg" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <Sidebar activeSlug={slug} />
        <main className="flex-1 overflow-y-auto px-8 py-12 flex flex-col items-center justify-center">
          <div className="rounded-2xl p-8 text-center bg-cc-surface border border-cc-border">
            <i className="fas fa-book-open text-3xl mb-3 text-cc-faint" />
            <p className="text-base font-bold mb-1 text-cc-text">Tutorial not found</p>
            <p className="text-sm mb-4 text-cc-muted">This topic doesn't have a tutorial page yet.</p>
            <Link to="/home" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#0d0c0a' }}>
              <i className="fas fa-arrow-left text-xs" /> Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-cc-bg" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Sidebar activeSlug={slug} />

      {/* ── Content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto px-6 md:px-8 py-7">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-4 text-[12px] text-cc-subtle">
          <Link to="/home" className="text-cc-subtle hover:text-amber-500 transition-colors">TCL Forge</Link>
          <i className="fas fa-chevron-right text-[8px]" />
          <span>{tut.parent}</span>
          <i className="fas fa-chevron-right text-[8px]" />
          <span className="text-cc-text font-semibold">{tut.title}</span>
        </nav>

        {/* Article card */}
        <div className="rounded-2xl overflow-hidden mb-5 bg-cc-surface border border-cc-border">

          {/* Title bar */}
          <div className="px-7 pt-6 pb-5 border-b border-cc-border">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-[22px] font-black tracking-tight mb-1.5 text-cc-text">
                  {tut.title}
                </h1>
                <div className="flex items-center gap-3 text-[12px] text-cc-subtle flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <i className="fas fa-calendar-alt text-[10px] text-cc-faint" />
                    Last Updated · June 2026
                  </span>
                  <span className="text-cc-faint">·</span>
                  <span className="flex items-center gap-1.5">
                    <i className="fas fa-layer-group text-[10px] text-cc-faint" />
                    {tut.sections.length} sections
                  </span>
                  <span className="text-cc-faint">·</span>
                  <span className="flex items-center gap-1.5">
                    <i className="fas fa-bookmark text-[10px] text-cc-faint" />
                    {tut.parent}
                  </span>
                </div>
              </div>
              <Link to="/runner"
                className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-bold"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#0d0c0a' }}>
                <i className="fas fa-terminal text-[10px]" /> Try in Runner
              </Link>
            </div>
          </div>

          {/* Intro */}
          <div className="px-7 py-5 bg-amber-500/4 border-b border-cc-border">
            <p className="text-[14px] leading-relaxed text-cc-text">{tut.intro}</p>
          </div>

          {/* Sections */}
          {tut.sections.map((sec, idx) => (
            <section key={sec.heading}
              id={sec.heading.replace(/\s+/g, '-').toLowerCase()}
              className="px-7 py-6 border-t border-cc-border first:border-t-0">
              <h2 className="text-[16px] font-black mb-2.5 flex items-center gap-3 text-cc-text">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-[11px] font-black shrink-0"
                  style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#0d0c0a' }}>
                  {idx + 1}
                </span>
                {sec.heading}
              </h2>
              <p className="text-[13.5px] leading-relaxed mb-4 ml-9 text-cc-muted">{sec.body}</p>
              {sec.code && <div className="ml-9"><CodeBlock code={sec.code} /></div>}
            </section>
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between gap-3">
          {tut.prev ? (
            <Link to={`/learn/${tut.prev}`}
              className="flex-1 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-cc-surface border border-cc-border hover:border-amber-500/40 transition-all glow-card">
              <i className="fas fa-arrow-left text-sm text-amber-500" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5 text-cc-faint">Previous</p>
                <p className="text-[13px] font-semibold text-cc-text">{getTutorial(tut.prev)?.title || 'Previous'}</p>
              </div>
            </Link>
          ) : <div className="flex-1" />}

          {tut.next && (
            <Link to={`/learn/${tut.next}`}
              className="flex-1 flex items-center justify-end gap-3 px-5 py-3.5 rounded-xl bg-cc-surface border border-cc-border hover:border-amber-500/40 transition-all glow-card">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5 text-cc-faint">Next</p>
                <p className="text-[13px] font-semibold text-cc-text">{getTutorial(tut.next)?.title || 'Next'}</p>
              </div>
              <i className="fas fa-arrow-right text-sm text-amber-500" />
            </Link>
          )}
        </div>
      </main>

      {/* ── Right panel ── */}
      <aside className="hidden xl:flex flex-col w-[300px] shrink-0 overflow-y-auto gap-3 p-5 bg-cc-surface border-l border-cc-border">
        <QuizPanel slug={slug} />
      </aside>
    </div>
  );
}
