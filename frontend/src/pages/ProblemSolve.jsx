import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PROBLEMS, getProblemById,
  getScore, saveScore, unlockNext, computeScore,
} from '../data/problems.js';
import { MiniTclEnv } from '../utils/miniTcl.js';

// ── Inline markdown renderer ──────────────────────────────────────────────────
function InlineText({ text }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`'))
          return (
            <code key={i}
              className="font-mono text-[12px] text-amber-300 bg-cc-card border border-cc-border px-1 py-0.5 rounded">
              {part.slice(1, -1)}
            </code>
          );
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={i} className="text-cc-text font-semibold">{part.slice(2, -2)}</strong>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function DescBlock({ text }) {
  const paras = text.split('\n\n');
  return (
    <div className="space-y-3">
      {paras.map((para, pi) => {
        const lines = para.split('\n');
        if (lines.every((l) => l.trim().startsWith('- '))) {
          return (
            <ul key={pi} className="space-y-1.5">
              {lines.map((line, li) => (
                <li key={li} className="flex items-start gap-2 text-[14px] text-cc-muted leading-relaxed">
                  <span className="text-amber-400/50 shrink-0 mt-0.5">•</span>
                  <span><InlineText text={line.replace(/^-\s*/, '')} /></span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={pi} className="text-[14px] text-cc-muted leading-relaxed">
            {lines.map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                <InlineText text={line} />
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

const DIFF_BG = {
  Easy:   'bg-[#3fb950]/10 border-[#3fb950]/30 text-[#3fb950]',
  Medium: 'bg-amber-400/10 border-amber-400/30 text-amber-400',
  Hard:   'bg-[#f85149]/10 border-[#f85149]/30 text-[#f85149]',
};

// ── Main component ────────────────────────────────────────────────────────────
export default function ProblemSolve() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const problem    = getProblemById(id);

  const [code, setCode]           = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [resultTab, setResultTab] = useState('output');
  const [output, setOutput]       = useState('');
  const [outputIsErr, setOutputIsErr] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [running, setRunning]     = useState(false);
  const [score, setScore]         = useState(0);
  const outputRef                 = useRef(null);

  useEffect(() => {
    if (!problem) { navigate('/challenges', { replace: true }); return; }
    setCode(problem.starterCode ?? '');
    setScore(getScore(problem.id));
    setOutput('');
    setOutputIsErr(false);
    setSubmitResult(null);
    setResultTab('output');
    setActiveTab('description');
  }, [problem?.id]);

  if (!problem) return null;

  const problemIndex = PROBLEMS.findIndex((p) => p.id === id);
  const prevP = problemIndex > 0 ? PROBLEMS[problemIndex - 1] : null;
  const nextP = problemIndex < PROBLEMS.length - 1 ? PROBLEMS[problemIndex + 1] : null;

  // ── Run: execute via MiniTcl ─────────────────────────────────────────────────
  function handleRun() {
    if (!code.trim() || running) return;
    setRunning(true);
    setResultTab('output');
    const env = new MiniTclEnv();
    const out = env.eval(code);
    setOutput(out || '(no output)');
    setOutputIsErr(out.trimStart().startsWith('Error:'));
    setRunning(false);
  }

  // ── Submit: run + keyword heuristic scoring ───────────────────────────────────
  function handleSubmit() {
    if (!code.trim()) return;
    const env = new MiniTclEnv();
    const out = env.eval(code);
    setOutput(out || '(no output)');
    setOutputIsErr(out.trimStart().startsWith('Error:'));
    setResultTab('output');

    const computed = computeScore(code, out, problem);
    saveScore(problem.id, computed);
    setScore(computed);
    let unlocked = false;
    if (computed >= 70) { unlockNext(problem.id); unlocked = true; }
    setSubmitResult({ score: computed, unlocked, output: out });
    setTimeout(() => setResultTab('result'), 300);
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target, s = el.selectionStart, en = el.selectionEnd;
      const next = code.substring(0, s) + '    ' + code.substring(en);
      setCode(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
      return;
    }
    if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); handleRun(); }
  }

  const scoreColor = score >= 90 ? 'text-amber-400' : score >= 70 ? 'text-[#3fb950]' : score > 0 ? 'text-[#58a6ff]' : 'text-cc-faint';

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col bg-cc-bg overflow-hidden"
      style={{ height: 'calc(100vh - 64px)' }}
    >

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-11 border-b border-cc-border bg-cc-surface/40 shrink-0">
        <button
          onClick={() => navigate('/challenges')}
          className="flex items-center gap-1.5 text-[13px] text-cc-subtle hover:text-cc-text transition-colors shrink-0"
        >
          <i className="fas fa-chevron-left text-[10px]" /> Problems
        </button>
        <span className="text-cc-faint/40 text-xs">/</span>
        <span className="text-[14px] font-semibold text-cc-text truncate">{problem.title}</span>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${DIFF_BG[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-1 shrink-0">
          <button disabled={!prevP}
            onClick={() => prevP && navigate(`/challenges/${prevP.id}`)}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-cc-border text-cc-faint
                       hover:text-cc-text hover:border-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <i className="fas fa-chevron-left text-[10px]" />
          </button>
          <span className="text-[12px] text-cc-faint font-mono px-1 tabular-nums">
            {problemIndex + 1}/{PROBLEMS.length}
          </span>
          <button disabled={!nextP}
            onClick={() => nextP && navigate(`/challenges/${nextP.id}`)}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-cc-border text-cc-faint
                       hover:text-cc-text hover:border-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <i className="fas fa-chevron-right text-[10px]" />
          </button>
        </div>
      </div>

      {/* ── Split pane ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">

        {/* ══ Left panel ════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:w-[42%] border-b lg:border-b-0 lg:border-r border-cc-border min-h-0">

          <div className="flex items-center border-b border-cc-border shrink-0 bg-cc-surface/40">
            {['description', 'hints'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-[13px] font-medium capitalize border-b-2 -mb-px transition-all ${
                  activeTab === tab
                    ? 'text-cc-text border-amber-400'
                    : 'text-cc-subtle border-transparent hover:text-cc-text'
                }`}>
                {tab === 'description' ? 'Description' : 'Hints'}
              </button>
            ))}
            {score > 0 && (
              <div className="ml-auto pr-4">
                <span className={`text-xs font-mono font-bold tabular-nums ${scoreColor}`}>{score}/100</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
            {activeTab === 'description' ? (
              <>
                <div>
                  <h1 className="text-[16px] font-bold text-cc-text mb-2">{problem.title}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[12px] font-semibold
                      ${problem.difficulty === 'Easy' ? 'text-[#3fb950]' :
                        problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-[#f85149]'}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-cc-faint/40">·</span>
                    <span className="text-cc-faint text-[12px]">{problem.category}</span>
                    {problem.tags.map((tag) => (
                      <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-cc-surface border border-cc-border text-cc-faint">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <DescBlock text={problem.description} />

                {problem.examples.map((ex, i) => (
                  <div key={i}>
                    <p className="text-[11px] font-bold text-cc-subtle uppercase tracking-widest mb-2">
                      {problem.examples.length > 1 ? `Example ${i + 1}` : 'Example'}
                    </p>
                    <div className="bg-cc-card border border-cc-border rounded-lg overflow-hidden text-[13px]">
                      {ex.input && (
                        <div className="px-3 py-2 border-b border-cc-border">
                          <span className="font-semibold text-cc-subtle mr-2">Input:</span>
                          <code className="font-mono text-cc-muted">{ex.input}</code>
                        </div>
                      )}
                      <div className="px-3 py-2.5 border-b border-cc-border">
                        <span className="font-semibold text-cc-subtle block mb-1.5">Output:</span>
                        <pre className="font-mono text-[12px] text-[#3fb950] leading-[1.6] whitespace-pre-wrap">{ex.output}</pre>
                      </div>
                      {ex.explanation && (
                        <div className="px-3 py-2 bg-cc-bg/30">
                          <span className="font-semibold text-cc-subtle mr-1">Explanation:</span>
                          <span className="text-cc-muted">{ex.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {problem.constraints?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-cc-subtle uppercase tracking-widest mb-2">Constraints</p>
                    <ul className="space-y-1.5">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-cc-muted">
                          <span className="text-amber-400/40 shrink-0 mt-0.5">•</span>
                          <span><InlineText text={c} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-cc-subtle uppercase tracking-widest">{problem.hints.length} Hints</p>
                {problem.hints.map((hint, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-cc-card border border-cc-border rounded-lg">
                    <span className="text-[12px] font-bold text-amber-400/60 font-mono shrink-0 mt-0.5 tabular-nums">{i + 1}</span>
                    <p className="text-[13px] text-cc-muted leading-relaxed"><InlineText text={hint} /></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ Right panel ═══════════════════════════════════════════════════════ */}
        <div className="flex flex-col flex-1 min-h-0">

          <div className="flex items-center justify-between px-4 py-2 border-b border-cc-border bg-cc-surface/40 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
              <span className="ml-2 text-[12px] text-cc-subtle font-mono select-none">solution.tcl</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-[11px] text-cc-faint font-mono select-none">Ctrl+Enter to run</span>
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cc-border text-[12px] font-semibold
                           text-cc-text hover:border-amber-500/40 hover:text-amber-300 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className={`fas ${running ? 'fa-circle-notch fa-spin' : 'fa-play'} text-[10px]`} />
                {running ? 'Running…' : 'Run'}
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400
                           text-[#0d0c0a] text-[12px] font-black transition-colors"
              >
                <i className="fas fa-check text-[10px]" /> Submit
              </button>
            </div>
          </div>

          <textarea
            className="tcl-editor flex-1 min-h-0 w-full p-5 text-[14px]"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="# Write your TCL solution here…"
          />

          {/* ── Console / Submission pane ── */}
          <div className="flex flex-col border-t border-cc-border shrink-0" style={{ height: '220px' }}>
            <div className="flex items-center border-b border-cc-border bg-cc-surface/40 shrink-0">
              <button onClick={() => setResultTab('output')}
                className={`px-4 py-2 text-[12px] font-medium border-b-2 -mb-px transition-all ${
                  resultTab === 'output' ? 'text-cc-text border-amber-400' : 'text-cc-subtle border-transparent hover:text-cc-text'
                }`}>Console</button>
              <button onClick={() => setResultTab('result')}
                className={`px-4 py-2 text-[12px] font-medium border-b-2 -mb-px transition-all ${
                  resultTab === 'result' ? 'text-cc-text border-amber-400' : 'text-cc-subtle border-transparent hover:text-cc-text'
                }`}>Submission</button>
              <div className="ml-auto pr-4 flex items-center gap-1 text-[11px] font-mono text-cc-faint">
                <i className="fas fa-server text-[8px]" /> MiniTcl
              </div>
            </div>

            <div ref={outputRef} className="flex-1 min-h-0 overflow-y-auto p-4">
              {resultTab === 'output' ? (
                output ? (
                  <pre className={`text-[13px] font-mono leading-relaxed whitespace-pre-wrap
                    ${outputIsErr ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>
                    {output}
                  </pre>
                ) : (
                  <span className="text-cc-faint text-[13px] font-mono italic">
                    Run your code to see output here.
                  </span>
                )
              ) : submitResult ? (
                <div className="flex gap-6 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <div className={`text-4xl font-black tabular-nums leading-none
                      ${submitResult.score >= 90 ? 'text-amber-400' :
                        submitResult.score >= 70 ? 'text-[#3fb950]' :
                        submitResult.score >= 40 ? 'text-[#58a6ff]' : 'text-[#f85149]'}`}>
                      {submitResult.score}
                      <span className="text-sm font-normal text-cc-faint">/100</span>
                    </div>
                    <p className={`text-[13px] font-semibold ${submitResult.score >= 70 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                      {submitResult.score >= 90 ? 'Excellent!' :
                       submitResult.score >= 70 ? 'Accepted' :
                       submitResult.score >= 40 ? 'Needs Work' : 'Try Again'}
                    </p>
                    {submitResult.unlocked && (
                      <p className="text-[12px] text-amber-400 flex items-center gap-1">
                        <i className="fas fa-unlock text-[10px]" /> Next problem unlocked!
                      </p>
                    )}
                    {nextP && submitResult.score >= 70 && (
                      <button
                        onClick={() => navigate(`/challenges/${nextP.id}`)}
                        className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg
                                   bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[12px] font-semibold
                                   hover:bg-amber-500/20 transition-colors"
                      >
                        {nextP.title} <i className="fas fa-arrow-right text-[10px]" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 text-[12px] font-mono">
                    <p className="text-cc-faint uppercase tracking-widest text-[10px] mb-2">Checks</p>
                    <CheckRow ok={!submitResult.output.trimStart().startsWith('Error:')} label="No runtime errors" />
                    <CheckRow ok={Boolean(submitResult.output.trim())} label="Produces output" />
                    {problem.expected.map((kw) => (
                      <CheckRow key={kw} ok={code.includes(kw)}
                        label={<>Uses <code className="text-amber-300">{kw}</code></>} />
                    ))}
                  </div>
                </div>
              ) : (
                <span className="text-cc-faint text-[13px] italic">Submit your code to see your score.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CheckRow({ ok, label }) {
  return (
    <div className="flex items-center gap-2 text-cc-muted">
      <i className={`fas ${ok ? 'fa-check text-[#3fb950]' : 'fa-xmark text-cc-faint'} text-[10px] w-3 shrink-0`} />
      <span>{label}</span>
    </div>
  );
}
