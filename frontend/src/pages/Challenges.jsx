import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROBLEMS, getScore, isUnlocked } from '../data/problems.js';

const DIFF_BG = {
  Easy:   'bg-[#3fb950]/10 border-[#3fb950]/20 text-[#3fb950]',
  Medium: 'bg-amber-400/10 border-amber-400/20 text-amber-400',
  Hard:   'bg-[#f85149]/10 border-[#f85149]/20 text-[#f85149]',
};

function getStatus(id) {
  const s = getScore(id);
  if (s >= 90) return 'perfect';
  if (s >= 70) return 'solved';
  if (s > 0)   return 'attempted';
  return 'unsolved';
}

function StatusIcon({ id, locked }) {
  if (locked) return <i className="fas fa-lock text-[11px] text-cc-faint w-3.5 shrink-0" />;
  const map = {
    perfect:   { icon: 'fa-star',               cls: 'text-amber-400' },
    solved:    { icon: 'fa-check-circle',        cls: 'text-[#3fb950]' },
    attempted: { icon: 'fa-circle-half-stroke',  cls: 'text-[#58a6ff]' },
    unsolved:  { icon: 'fa-circle',              cls: 'text-cc-faint' },
  };
  const { icon, cls } = map[getStatus(id)];
  return <i className={`fas ${icon} text-[11px] w-3.5 shrink-0 ${cls}`} />;
}

function ProblemRow({ problem, index }) {
  const navigate = useNavigate();
  const locked = !isUnlocked(problem);
  const score  = getScore(problem.id);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 border-b border-cc-border last:border-b-0 transition-colors group
        ${locked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-cc-card cursor-pointer'}`}
      onClick={() => !locked && navigate(`/challenges/${problem.id}`)}
    >
      <span className="text-xs text-cc-faint font-mono w-6 shrink-0 text-right">{index + 1}</span>
      <StatusIcon id={problem.id} locked={locked} />
      <span className={`flex-1 text-[14px] font-medium truncate transition-colors
        ${locked ? 'text-cc-subtle' : 'text-cc-text group-hover:text-amber-300'}`}>
        {problem.title}
      </span>
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        {problem.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-cc-surface border border-cc-border text-cc-faint">
            {tag}
          </span>
        ))}
      </div>
      {score > 0 ? (
        <span className={`text-xs font-mono w-14 text-right shrink-0 ${score >= 90 ? 'text-amber-400' : 'text-[#3fb950]'}`}>
          {score}/100
        </span>
      ) : (
        <span className="text-xs text-cc-faint w-14 text-right shrink-0 font-mono">—</span>
      )}
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${DIFF_BG[problem.difficulty]}`}>
        {problem.difficulty}
      </span>
      {!locked && (
        <i className="fas fa-chevron-right text-[10px] text-cc-faint group-hover:text-amber-400 transition-colors shrink-0" />
      )}
    </div>
  );
}

const FILTER_TABS    = ['All', 'General', 'PD-Based'];
const GENERAL_PROBS  = PROBLEMS.filter((p) => p.category === 'General');
const PD_PROBS       = PROBLEMS.filter((p) => p.category === 'PD-Based');
const byDiff         = (d) => PROBLEMS.filter((p) => p.difficulty === d);

const TABLE_HEADER = (
  <div className="flex items-center gap-3 px-4 py-2 border-b border-cc-border bg-cc-bg/50">
    <span className="text-[11px] text-cc-faint w-6 text-right font-mono shrink-0">#</span>
    <span className="w-3.5" />
    <span className="flex-1 text-[11px] font-semibold text-cc-faint uppercase tracking-widest">Problem</span>
    <span className="hidden sm:block text-[11px] font-semibold text-cc-faint uppercase tracking-widest w-24">Tags</span>
    <span className="text-[11px] font-semibold text-cc-faint uppercase tracking-widest w-14 text-right">Score</span>
    <span className="text-[11px] font-semibold text-cc-faint uppercase tracking-widest w-16 text-center">Difficulty</span>
    <span className="w-3.5" />
  </div>
);

export default function Challenges() {
  const [filter, setFilter] = useState('All');

  const totalSolved = PROBLEMS.filter((p) => getScore(p.id) >= 70).length;
  const easySolved  = byDiff('Easy').filter((p)   => getScore(p.id) >= 70).length;
  const medSolved   = byDiff('Medium').filter((p) => getScore(p.id) >= 70).length;
  const hardSolved  = byDiff('Hard').filter((p)   => getScore(p.id) >= 70).length;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">

      {/* ── Hero + stats ── */}
      <div className="page-hero">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-bold text-amber-400/70 uppercase tracking-widest mb-1.5">Practice Arena</p>
            <h1 className="text-xl font-black tracking-tight text-cc-text flex items-center gap-2">
              <i className="fas fa-trophy text-amber-400" /> Practice Challenges
            </h1>
            <p className="text-cc-muted text-sm mt-1">
              Solve real TCL problems, earn scores, and unlock the next level.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {[
              { label: 'Solved', value: totalSolved, total: PROBLEMS.length, color: 'text-cc-text' },
              { label: 'Easy',   value: easySolved,  total: byDiff('Easy').length,   color: 'text-[#3fb950]' },
              { label: 'Medium', value: medSolved,   total: byDiff('Medium').length, color: 'text-amber-400' },
              { label: 'Hard',   value: hardSolved,  total: byDiff('Hard').length,   color: 'text-[#f85149]' },
            ].map(({ label, value, total, color }) => (
              <div key={label} className="flex flex-col items-center px-4 py-2 bg-cc-bg border border-cc-border rounded-xl min-w-[56px]">
                <span className={`text-lg font-black leading-none ${color}`}>
                  {value}<span className="text-cc-faint/50 text-xs font-normal">/{total}</span>
                </span>
                <span className="text-[11px] text-cc-faint mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex border-b border-cc-border">
        {FILTER_TABS.map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2.5 text-[14px] font-medium border-b-2 -mb-px transition-all ${
              filter === t
                ? 'text-amber-400 border-amber-400'
                : 'text-cc-subtle border-transparent hover:text-cc-text hover:border-cc-border'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── General ── */}
      {(filter === 'All' || filter === 'General') && (
        <section className="animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-lightbulb text-amber-400 text-xs" />
            <h2 className="text-[12px] font-bold text-cc-muted uppercase tracking-widest">General Mini Projects</h2>
            <span className="text-[11px] bg-cc-surface border border-cc-border px-2 py-0.5 rounded-full text-cc-faint ml-1">
              {GENERAL_PROBS.length}
            </span>
          </div>
          <div className="bg-cc-surface rounded-xl border border-cc-border overflow-hidden">
            {TABLE_HEADER}
            {GENERAL_PROBS.map((p, i) => <ProblemRow key={p.id} problem={p} index={i} />)}
          </div>
        </section>
      )}

      {/* ── PD-Based ── */}
      {(filter === 'All' || filter === 'PD-Based') && (
        <section className="animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-microchip text-[#3fb950] text-xs" />
            <h2 className="text-[12px] font-bold text-cc-muted uppercase tracking-widest">PD-Based Projects</h2>
            <span className="text-[11px] bg-cc-surface border border-cc-border px-2 py-0.5 rounded-full text-cc-faint ml-1">
              {PD_PROBS.length}
            </span>
          </div>
          <div className="bg-cc-surface rounded-xl border border-cc-border overflow-hidden">
            {TABLE_HEADER}
            {PD_PROBS.map((p, i) => <ProblemRow key={p.id} problem={p} index={i} />)}
          </div>
        </section>
      )}

    </div>
  );
}
