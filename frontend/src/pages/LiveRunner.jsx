import { useState, useRef, useEffect } from 'react';
import { MiniTclEnv } from '../utils/miniTcl.js';

const SNIPPETS = [
  {
    label: 'Hello TCL',
    icon: 'fa-bolt',
    code: `puts "Hello from TCL Forge!"\nset who "Engineer"\nputs "Welcome, $who!"`,
  },
  {
    label: 'Variables',
    code: `set a 10\nset b 20\nputs "a = $a, b = $b"\nset sum [expr {$a + $b}]\nputs "Sum = $sum"`,
  },
  {
    label: 'Lists & Arrays',
    code: `set fruits [list apple banana orange]\nlappend fruits mango\nputs "Fruits: $fruits"\n\narray set colors {apple red banana yellow orange orange}\nputs "Apple color: $colors(apple)"\nputs "All colors: [array get colors]"`,
  },
  {
    label: 'Proc',
    code: `proc greet {name} {\n    puts "Hello, $name!"\n}\n\nproc add {x y} {\n    set s [expr {$x + $y}]\n    puts "Sum of $x and $y is $s"\n}\n\ngreet "TCL Forge"\nadd 7 13`,
  },
  {
    label: 'String ops',
    code: `set s "TCL Forge Platform"\nputs "Upper: [string toupper $s]"\nputs "Length: [string length $s]"\nputs "Index 4: [string index $s 4]"\nputs "Range 4-6: [string range $s 4 6]"\nputs "Replace: [string map {Forge REPL} $s]"`,
  },
  {
    label: 'Regex',
    code: `set line "set clk_period 10.0"\nif {[regexp {set\\s+(\\w+)\\s+([\\d.]+)} $line -> var val]} {\n    puts "Variable: $var"\n    puts "Value: $val"\n} else {\n    puts "No match"\n}`,
  },
];

const DEFAULT_CODE = `# Welcome to TCL Live Runner\n# Powered by MiniTcl — client-side Tcl engine\n\nputs "Hello from TCL Forge!"\nset a 10\nset b 32\nputs "a = $a, b = $b"\nset sum [expr {$a + $b}]\nputs "Sum = $sum"\n\nproc factorial {n} {\n    if {$n <= 1} { return 1 }\n    return [expr {$n * [factorial [expr {$n - 1}]]}]\n}\nputs "10! = [factorial 10]"`;

export default function LiveRunner() {
  const [code, setCode]         = useState(DEFAULT_CODE);
  const [lines, setLines]       = useState([]);
  const [status, setStatus]     = useState('Ready');
  const [execTime, setExecTime] = useState(null);
  const [lastRun, setLastRun]   = useState(null);
  const [running, setRunning]   = useState(false);
  const outputRef               = useRef(null);
  const envRef                  = useRef(new MiniTclEnv());

  useEffect(() => {
    appendLine('TCL Forge — MiniTcl engine. Ctrl+Enter to run.', 'info');
  }, []);

  function appendLine(text, type = 'out') {
    const time = new Date().toLocaleTimeString();
    const rows = String(text).split('\n').filter((l, i, arr) => !(i === arr.length - 1 && l === ''));
    setLines((prev) => [
      ...prev,
      ...(rows.length ? rows.map((l) => ({ time, text: l, type })) : [{ time, text: '(empty)', type }]),
    ]);
    setTimeout(() => { outputRef.current?.scrollTo(0, outputRef.current.scrollHeight); }, 20);
  }

  function runCode() {
    if (!code.trim() || running) return;
    setRunning(true);
    setStatus('Running…');
    const start = performance.now();

    // Re-create env each run so vars don't leak between runs
    envRef.current = new MiniTclEnv();
    const output = envRef.current.eval(code);
    const ms = (performance.now() - start).toFixed(0);
    setExecTime(ms);
    setLastRun(new Date().toLocaleTimeString());

    const isErr = output.trimStart().startsWith('Error:');
    if (output.trim()) appendLine(output, isErr ? 'error' : 'out');
    else appendLine('(no output)', 'info');

    setRunning(false);
    setStatus('Ready');
  }

  function clearAll() {
    setCode('');
    setLines([]);
    setExecTime(null);
    setStatus('Cleared');
    setTimeout(() => setStatus('Ready'), 600);
  }

  function copyOutput() {
    navigator.clipboard.writeText(lines.map((l) => l.text).join('\n')).catch(() => {});
  }

  const lineCount   = code.split('\n').length;
  const statusColor = running ? 'text-amber-400' : status === 'Cleared' ? 'text-cc-muted' : 'text-[#3fb950]';

  return (
    <div
      className="flex flex-col overflow-hidden bg-cc-bg"
      style={{ height: 'calc(100vh - 64px)' }}
    >

      {/* ── Top command bar ── */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-cc-border bg-cc-nav shrink-0 h-11">

        <div className="flex items-center gap-1 font-mono text-[13px] shrink-0">
          <i className="fas fa-folder-open text-cc-faint text-[11px]" />
          <span className="text-cc-faint">workspace</span>
          <span className="text-cc-faint mx-0.5">/</span>
          <span className="text-cc-muted font-semibold">main.tcl</span>
        </div>

        <div className="w-px h-4 bg-cc-border shrink-0" />

        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SNIPPETS.map(({ label, icon, code: s }) => (
            <button
              key={label}
              onClick={() => setCode(s)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cc-surface border border-cc-border
                         text-[12px] text-cc-subtle hover:text-cc-text hover:border-amber-500/40
                         transition-colors whitespace-nowrap shrink-0"
            >
              {icon && <i className={`fas ${icon} text-amber-400 text-[10px]`} />}
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className={`hidden sm:flex items-center gap-1.5 text-[12px] font-mono shrink-0 ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-current ${running ? 'animate-pulse' : ''}`} />
          {status}
          {execTime && !running && (
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-cc-surface border border-cc-border text-cc-faint text-[11px]">
              {execTime}ms
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded-md bg-cc-surface border border-cc-border text-cc-faint text-[11px]">
            {lineCount}L
          </span>
        </div>

        <div className="w-px h-4 bg-cc-border shrink-0" />

        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cc-border
                     text-[12px] text-cc-subtle hover:text-cc-text hover:bg-cc-surface
                     transition-colors font-medium shrink-0"
        >
          <i className="fas fa-eraser text-[10px]" /> Clear
        </button>
        <button
          onClick={runCode}
          disabled={running}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400
                     text-[#0d0c0a] text-[12px] font-black transition-colors shrink-0
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className={`fas ${running ? 'fa-circle-notch fa-spin' : 'fa-play'} text-[10px]`} />
          {running ? 'Running…' : 'Run'}
        </button>
      </div>

      {/* ── Split pane ── */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">

        {/* ── Editor pane ── */}
        <div className="flex flex-col flex-1 min-h-0 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-cc-border">
          <div className="flex items-center justify-between px-4 py-2 border-b border-cc-border bg-cc-surface/40 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
              <span className="ml-2 text-[12px] text-cc-subtle font-mono select-none">editor — main.tcl</span>
            </div>
            <span className="text-[11px] text-cc-faint font-mono select-none">Ctrl+Enter to run</span>
          </div>

          <textarea
            className="tcl-editor flex-1 min-h-0 w-full p-5 text-[14px]"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); runCode(); } }}
            placeholder="# Write your TCL code here…"
          />
        </div>

        {/* ── Output pane ── */}
        <div className="flex flex-col flex-1 min-h-0 lg:w-1/2">
          <div className="flex items-center justify-between px-4 py-2 border-b border-cc-border bg-cc-surface/40 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
              <span className="ml-2 text-[12px] text-cc-subtle font-mono select-none">output</span>
            </div>
            <button
              onClick={copyOutput}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-cc-subtle
                         hover:text-cc-text hover:bg-cc-surface border border-transparent
                         hover:border-cc-border transition-all font-mono"
            >
              <i className="fas fa-copy text-[10px]" /> Copy
            </button>
          </div>

          <div ref={outputRef} className="terminal-output flex-1 min-h-0 p-5 overflow-y-auto text-[12.5px]">
            {lines.length === 0 ? (
              <span className="text-[#2a2a2a] text-[13px] font-mono">Waiting for execution…</span>
            ) : (
              lines.map((l, i) => (
                <div key={i} className="flex items-start gap-2 leading-6">
                  <span className="text-[#3a3a3a] shrink-0 select-none text-[11px] mt-[3px] font-mono tabular-nums">
                    {l.time}
                  </span>
                  <span style={{
                    color: l.type === 'error' ? '#f85149'
                         : l.type === 'info'  ? '#6b7280'
                         : '#3fb950',
                  }}>
                    {l.text}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-2 border-t border-cc-border bg-[#0d1117] shrink-0">
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-[#3fb950]">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />stdout
              </span>
              <span className="flex items-center gap-1.5 text-[#f85149]">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />error
              </span>
              <span className="flex items-center gap-1.5 text-[#484f58]">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />info
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#3a3a3a]">
              <span className="flex items-center gap-1" style={{ color: '#484f58' }}>
                <i className="fas fa-server text-[8px]" /> MiniTcl · client-side
              </span>
              <span className="italic">
                {lastRun ? `last run ${lastRun}` : 'never run'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
