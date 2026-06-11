import { useState, useMemo } from 'react';
import { toolCommands } from '../data/interviewData.js';

const TOOLS = [
  { key: 'genus',   label: 'Genus',   subtitle: 'Synthesis',  icon: 'fa-cogs',      color: 'text-[#58a6ff]',  border: 'border-[#58a6ff]/30',  bg: 'bg-[#58a6ff]/10',  count: 50 },
  { key: 'innovus', label: 'Innovus', subtitle: 'PnR',        icon: 'fa-microchip', color: 'text-[#3fb950]',  border: 'border-[#3fb950]/30',  bg: 'bg-[#3fb950]/10',  count: 50 },
  { key: 'tempus',  label: 'Tempus',  subtitle: 'STA',        icon: 'fa-clock',     color: 'text-[#a371f7]',  border: 'border-[#a371f7]/30',  bg: 'bg-[#a371f7]/10',  count: 50 },
];

function CommandRow({ item, revealed, onToggle }) {
  return (
    <div
      className="border-b border-cc-border last:border-b-0 cursor-pointer group"
      onClick={() => onToggle(item.id)}
    >
      <div className="flex items-start gap-3 px-4 py-3 hover:bg-cc-card transition-colors">
        <i className={`fas ${revealed ? 'fa-eye-slash' : 'fa-eye'} text-[11px] text-cc-faint mt-1 shrink-0 w-4 group-hover:text-cc-muted`} />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-cc-text font-medium leading-snug group-hover:text-amber-300 transition-colors">
            {item.question}
          </p>
          {revealed && (
            <div className="mt-2.5 animate-fade-in">
              <code className="block font-mono text-[13px] text-amber-300 bg-[#0d0c0a] rounded-lg px-3 py-2 border border-[#2d2b27] leading-relaxed">
                {item.command}
              </code>
            </div>
          )}
        </div>
        <i className={`fas fa-chevron-${revealed ? 'up' : 'down'} text-[10px] text-cc-faint mt-1 shrink-0 group-hover:text-cc-muted`} />
      </div>
    </div>
  );
}

export default function InterviewPrep() {
  const [activeTool, setActiveTool] = useState('genus');
  const [search, setSearch]         = useState('');
  const [revealed, setRevealed]     = useState(new Set());
  const [shuffled, setShuffled]     = useState(false);

  const commands = toolCommands[activeTool];
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = q
      ? commands.filter((c) => c.question.toLowerCase().includes(q) || c.command.toLowerCase().includes(q))
      : commands;
    if (shuffled) return [...list].sort(() => Math.random() - 0.5);
    return list;
  }, [commands, search, shuffled]);

  function toggleReveal(id) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const activeMeta = TOOLS.find((t) => t.key === activeTool);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-5">

      {/* Page hero */}
      <div className="page-hero">
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-bold text-amber-400/70 uppercase tracking-widest mb-1.5">
              EDA Reference
            </p>
            <h1 className="text-xl font-black tracking-tight text-cc-text flex items-center gap-2">
              <i className="fas fa-list-check text-amber-400" /> EDA Commands
            </h1>
            <p className="text-cc-muted text-sm mt-1 max-w-md">
              150 commands for Genus, Innovus & Tempus — click any question to reveal the answer.
            </p>
          </div>
          <div className="relative mt-1">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-cc-subtle text-xs" />
            <input
              className="cc-input pl-8 w-60 text-xs"
              placeholder="Search command or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tool selector tabs */}
      <div className="flex gap-2 border-b border-cc-border">
        {TOOLS.map(({ key, label, subtitle, icon, color, border, bg, count }) => (
          <button
            key={key}
            onClick={() => { setActiveTool(key); setRevealed(new Set()); setSearch(''); }}
            className={`flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium transition-all border-b-2 -mb-px ${
              activeTool === key
                ? `${color} border-current`
                : 'text-cc-subtle border-transparent hover:text-cc-text'
            }`}
          >
            <i className={`fas ${icon} text-sm`} />
            <span>{label}</span>
            <span className="text-[11px] opacity-70">— {subtitle}</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full border ml-1 ${
              activeTool === key ? `${bg} ${border} ${color}` : 'bg-cc-surface border-cc-border text-cc-subtle'
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <span className={`w-2 h-2 rounded-full ${activeMeta.bg} border ${activeMeta.border} inline-block`} />
          <span className="text-xs text-cc-muted">
            {filtered.length} command{filtered.length !== 1 ? 's' : ''}
            {search && ` matching "${search}"`}
          </span>
        </div>
        <button onClick={() => setRevealed(new Set(filtered.map((c) => c.id)))}
          className="cc-btn-secondary text-xs px-3 py-1.5">
          <i className="fas fa-expand mr-1" /> Reveal All
        </button>
        <button onClick={() => setRevealed(new Set())}
          className="cc-btn-secondary text-xs px-3 py-1.5">
          <i className="fas fa-compress mr-1" /> Hide All
        </button>
        <button
          onClick={() => setShuffled((s) => !s)}
          className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
            shuffled
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              : 'bg-cc-surface border-cc-border text-cc-muted hover:text-cc-text'
          }`}
        >
          <i className="fas fa-shuffle mr-1" /> Practice Mode
        </button>
      </div>

      {/* Command list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-cc-subtle">
          <i className="fas fa-search text-3xl mb-3 block opacity-30" />
          <p>No commands match your search.</p>
        </div>
      ) : (
        <div className="bg-cc-surface rounded-xl border border-cc-border overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2 border-b border-cc-border bg-cc-bg">
            <span className="w-4" />
            <span className="flex-1 text-[11px] font-semibold text-cc-subtle uppercase tracking-wider">Question</span>
            <span className="w-4" />
          </div>
          {filtered.map((item) => (
            <CommandRow key={item.id} item={item} revealed={revealed.has(item.id)} onToggle={toggleReveal} />
          ))}
        </div>
      )}

      {/* Progress indicator */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-3 px-1">
          <span className="text-xs text-cc-subtle">
            Revealed: <span className={`font-bold ${activeMeta.color}`}>{revealed.size}</span> / {filtered.length}
          </span>
          <div className="flex-1 bg-cc-surface rounded-full h-1.5 border border-cc-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                activeTool === 'genus' ? 'bg-[#58a6ff]' : activeTool === 'innovus' ? 'bg-[#3fb950]' : 'bg-[#a371f7]'
              }`}
              style={{ width: `${filtered.length ? (revealed.size / filtered.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-cc-faint font-mono">
            {filtered.length ? Math.round((revealed.size / filtered.length) * 100) : 0}%
          </span>
        </div>
      )}
    </div>
  );
}
