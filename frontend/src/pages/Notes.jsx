const NOTES = [
  {
    title: 'TCL Variables',
    desc: 'Learn variable declaration, scope, and special variables in TCL.',
    type: 'PDF',
    icon: 'fa-file-pdf',
    color: 'text-[#f85149]',
    border: 'border-[#f85149]/25',
    bg: 'bg-[#f85149]/10',
    file: 'TCL_Variables.pdf',
  },
  {
    title: 'TCL Variables (Slides)',
    desc: 'PowerPoint slides covering TCL variable concepts with examples.',
    type: 'PPTX',
    icon: 'fa-file-powerpoint',
    color: 'text-[#fb8f44]',
    border: 'border-[#fb8f44]/25',
    bg: 'bg-[#fb8f44]/10',
    file: 'TCL_Variables.pptx',
  },
  {
    title: 'TCL Lists',
    desc: 'Comprehensive guide to list manipulation: lappend, lindex, lsort, lsearch.',
    type: 'PPTX',
    icon: 'fa-file-powerpoint',
    color: 'text-[#fb8f44]',
    border: 'border-[#fb8f44]/25',
    bg: 'bg-[#fb8f44]/10',
    file: 'TCL_Lists.pptx',
  },
  {
    title: 'TCL Arrays',
    desc: 'Working with associative arrays, array set/get, iteration patterns.',
    type: 'PPTX',
    icon: 'fa-file-powerpoint',
    color: 'text-[#fb8f44]',
    border: 'border-[#fb8f44]/25',
    bg: 'bg-[#fb8f44]/10',
    file: 'TCL_Arrays.pptx',
  },
  {
    title: 'TCL File Handling',
    desc: 'File I/O operations: open, gets, read, puts, close, glob, and more.',
    type: 'PPTX',
    icon: 'fa-file-powerpoint',
    color: 'text-[#fb8f44]',
    border: 'border-[#fb8f44]/25',
    bg: 'bg-[#fb8f44]/10',
    file: 'TCL_File_Handling.pptx',
  },
];

const TOPICS = [
  { icon: 'fa-variable',    label: 'Variables & Scope' },
  { icon: 'fa-list',        label: 'List Operations' },
  { icon: 'fa-table',       label: 'Arrays & Dicts' },
  { icon: 'fa-folder-open', label: 'File Handling' },
  { icon: 'fa-rotate',      label: 'Loops & Control Flow' },
  { icon: 'fa-cube',        label: 'Procedures & Namespaces' },
];

export default function Notes() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">

      {/* Page hero */}
      <div className="page-hero">
        <div className="relative">
          <p className="text-[11px] font-bold text-amber-400/70 uppercase tracking-widest mb-1.5">
            Study Materials
          </p>
          <h1 className="text-xl font-black tracking-tight text-cc-text flex items-center gap-2">
            <i className="fas fa-book-open text-amber-400" /> Notes & Resources
          </h1>
          <p className="text-cc-muted text-sm mt-1 max-w-md">
            Download PDFs and slide decks to study TCL fundamentals and EDA scripting offline.
          </p>
        </div>
      </div>

      {/* Topics covered */}
      <div className="bg-cc-surface border border-cc-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-cc-text mb-3 flex items-center gap-2">
          <i className="fas fa-tags text-amber-400 text-xs" /> Topics Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(({ icon, label }) => (
            <span key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cc-bg border border-cc-border text-xs text-cc-muted hover:border-amber-500/30 hover:text-cc-text transition-colors">
              <i className={`fas ${icon} text-amber-400 text-[11px]`} />{label}
            </span>
          ))}
        </div>
      </div>

      {/* Files list */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <i className="fas fa-download text-amber-400 text-xs" />
          <h2 className="text-sm font-semibold text-cc-muted uppercase tracking-wider">Available Files</h2>
          <span className="text-[11px] bg-cc-surface border border-cc-border px-2 py-0.5 rounded-full text-cc-subtle">
            {NOTES.length}
          </span>
        </div>

        <div className="bg-cc-surface rounded-xl border border-cc-border overflow-hidden">
          {/* Table header */}
          <div className="flex items-center gap-4 px-5 py-2.5 border-b border-cc-border bg-cc-bg">
            <span className="w-10" />
            <span className="flex-1 text-[11px] font-semibold text-cc-subtle uppercase tracking-wider">Resource</span>
            <span className="w-12 text-[11px] font-semibold text-cc-subtle uppercase tracking-wider text-center">Type</span>
            <span className="w-24 text-[11px] font-semibold text-cc-subtle uppercase tracking-wider text-right">Action</span>
          </div>

          {NOTES.map(({ title, desc, type, icon, color, border, bg, file }) => (
            <div key={file} className="flex items-center gap-4 px-5 py-3.5 border-b border-cc-border last:border-b-0 hover:bg-cc-card transition-colors group">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${bg} ${border}`}>
                <i className={`fas ${icon} ${color} text-lg`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-cc-text group-hover:text-amber-300 transition-colors">{title}</p>
                <p className="text-xs text-cc-subtle mt-0.5 leading-relaxed">{desc}</p>
              </div>
              <span className={`text-[11px] font-bold px-2 py-1 rounded-lg w-12 text-center shrink-0 ${
                type === 'PDF'
                  ? 'bg-[#f85149]/15 text-[#f85149] border border-[#f85149]/25'
                  : 'bg-[#fb8f44]/15 text-[#fb8f44] border border-[#fb8f44]/25'
              }`}>{type}</span>
              <a
                href={`/notes/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                download
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors shrink-0 w-24 justify-center"
              >
                <i className="fas fa-download text-[11px]" /> Download
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-[#58a6ff]/5 border border-[#58a6ff]/20">
        <i className="fas fa-circle-info text-[#58a6ff] mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="text-[#58a6ff] font-semibold mb-1">Setup notes</p>
          <p className="text-cc-muted text-xs leading-relaxed">
            Copy your notes files into{' '}
            <code className="text-[12px] bg-cc-bg border border-cc-border px-1.5 py-0.5 rounded font-mono text-amber-300">
              backend/public/notes/
            </code>
            {' '}so the Express server can serve them via{' '}
            <code className="text-[12px] bg-cc-bg border border-cc-border px-1.5 py-0.5 rounded font-mono text-amber-300">/notes/*</code>.
          </p>
        </div>
      </div>

    </div>
  );
}
