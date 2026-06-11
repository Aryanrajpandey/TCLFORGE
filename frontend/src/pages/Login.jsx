import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

/* ── Particle network background ── */
function ParticleBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.3 + 0.4,
    }));
    function draw() {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      }
      const MAX = 150;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(217,119,6,${0.10 * (1 - d / MAX)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217,119,6,0.38)'; ctx.fill();
      }
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

/* ── Animated TCL code showcase ── */
const SHOWCASE_LINES = [
  { code: '# Set timing analysis configuration', comment: true },
  { code: 'set analysis_mode "pba"' },
  { code: 'set_app_var time_report_unconstrained true' },
  { code: '' },
  { code: '# Automate floorplan macro placement', comment: true },
  { code: 'foreach macro [get_cells -filter "is_macro==true"] {' },
  { code: '  set_fixed_side $macro -side top' },
  { code: '  place_macro $macro -coord {0 0}' },
  { code: '}' },
  { code: '' },
  { code: 'report_timing -delay_type max -max_paths 10' },
];

const KW  = /\b(set|foreach|if|else|return|puts|expr|proc|set_app_var|set_fixed_side|place_macro|report_timing|get_cells)\b/g;
const VAR = /(\$\w+)/g;
const STR = /("(?:[^"\\]|\\.)*")/g;
const NUM = /\b(\d+)\b/g;
const FLG = /(\s-\w+)/g;

function HL({ code, comment }) {
  if (comment) return <span style={{ color: '#7a6e5a', fontStyle: 'italic' }}>{code}</span>;
  if (!code) return null;
  const ranges = [];
  for (const rx of [
    { re: STR, cls: '#8db87a' }, { re: KW, cls: '#e5a042' },
    { re: VAR, cls: '#e5a042' }, { re: FLG, cls: '#9aa8b8' }, { re: NUM, cls: '#d19a66' },
  ]) {
    rx.re.lastIndex = 0;
    let m;
    while ((m = rx.re.exec(code)) !== null)
      ranges.push({ start: m.index, end: m.index + m[0].length, cls: rx.cls });
  }
  ranges.sort((a, b) => a.start - b.start);
  const merged = [];
  for (const r of ranges) {
    if (merged.length && r.start < merged[merged.length - 1].end) continue;
    merged.push(r);
  }
  const tokens = []; let pos = 0;
  for (const r of merged) {
    if (r.start > pos) tokens.push(<span key={pos} style={{ color: '#c8c0b0' }}>{code.slice(pos, r.start)}</span>);
    tokens.push(<span key={r.start} style={{ color: r.cls }}>{code.slice(r.start, r.end)}</span>);
    pos = r.end;
  }
  if (pos < code.length) tokens.push(<span key={pos} style={{ color: '#c8c0b0' }}>{code.slice(pos)}</span>);
  return <>{tokens}</>;
}

function CodeShowcase() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => { setLineIdx(0); setCharIdx(0); setDone(false); }, 2600);
      return () => clearTimeout(t);
    }
    const line = SHOWCASE_LINES[lineIdx];
    if (!line) { setDone(true); return; }
    if (charIdx < line.code.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 26 + Math.random() * 16);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (lineIdx + 1 >= SHOWCASE_LINES.length) setDone(true);
      else { setLineIdx(l => l + 1); setCharIdx(0); }
    }, line.code === '' ? 80 : 110);
    return () => clearTimeout(t);
  }, [done, lineIdx, charIdx]);

  const displayed = SHOWCASE_LINES.slice(0, lineIdx + 1).map((l, i) => ({
    ...l, code: i === lineIdx ? l.code.slice(0, charIdx) : l.code,
  }));

  return (
    <div className="rounded-xl overflow-hidden w-full"
      style={{ background: '#161412', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
      <div className="flex items-center px-4 py-3 border-b relative"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1e1c1a' }}>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#e06c75]" />
          <span className="w-3 h-3 rounded-full bg-[#e5c07b]" />
          <span className="w-3 h-3 rounded-full bg-[#98c379]" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-xs font-mono"
          style={{ color: '#524840', letterSpacing: '0.15em' }}>TCL_SESSION: 0xc4e2</span>
      </div>
      <div style={{ display: 'flex', height: '420px', overflow: 'hidden' }}>
        <div style={{ width: '44px', padding: '20px 0', borderRight: '1px solid rgba(255,255,255,0.05)', background: '#0f0d0b', flexShrink: 0 }}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} style={{ height: '24.5px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px', fontFamily: '"Fira Code", monospace', fontSize: '11px', color: '#3a3228' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '20px 20px', fontFamily: '"Fira Code", monospace', fontSize: '13px', lineHeight: '24.5px', overflow: 'hidden' }}>
          {displayed.map((l, i) => (
            <div key={i} style={{ height: '24.5px', whiteSpace: 'nowrap' }}>
              {l.comment ? <HL code={l.code} comment /> : <HL code={l.code} />}
              {i === lineIdx && !done && <span style={{ color: '#e5a042', animation: 'blink 1s step-end infinite' }}>▋</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="flex-1 h-px" style={{ background: 'rgba(160,120,55,0.2)' }} />
      <span className="text-xs font-mono font-bold tracking-[0.28em] uppercase" style={{ color: 'rgba(160,110,30,0.55)' }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(160,120,55,0.2)' }} />
    </div>
  );
}

const STATS = [
  { v: '150+', l: 'EDA Commands', sub: 'Genus · Innovus · Tempus', icon: '>_'  },
  { v: '20+',  l: 'Quizzes',      sub: 'Test your knowledge',       icon: '?'   },
  { v: '6',    l: 'Challenges',   sub: 'Real PD problems',           icon: '</>' },
];

const MODULES = [
  { faIcon: 'fa-terminal',  tag: 'Interactive', title: 'Live TCL Runner',       desc: 'Write and run TCL in your browser. No setup.',        route: '/runner'     },
  { faIcon: 'fa-trophy',    tag: 'Scored',       title: 'Practice Challenges',   desc: 'TCL & PD problems. Earn scores, track progress.',     route: '/challenges' },
  { faIcon: 'fa-lightbulb', tag: '150 Commands', title: 'EDA Command Reference', desc: '150 TCL commands for Genus, Innovus & Tempus.',       route: '/interview'  },
  { faIcon: 'fa-book-open', tag: 'Download',     title: 'Notes & Resources',     desc: 'PDF notes on Variables, Lists, Arrays & Files.',      route: '/notes'      },
];

export default function Login() {
  const [scrolled,  setScrolled]  = useState(false);
  const [joinEmail, setJoinEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (location.state?.from) navigate('/auth?tab=login');
  }, []);

  return (
    <motion.div className="min-h-screen overflow-x-hidden relative"
      style={{ background: '#f0ede6' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none select-none" style={{
        zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(160,120,55,0.18) 1.5px, transparent 1.5px)',
        backgroundSize: '32px 32px',
      }} />

      <ParticleBg />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 sm:px-10 md:px-16"
        style={{
          zIndex: 50, height: '66px',
          transition: 'background 0.4s, box-shadow 0.4s',
          ...(scrolled
            ? { background: 'rgba(240,237,230,0.85)', backdropFilter: 'blur(24px)', boxShadow: '0 1px 0 rgba(160,120,55,0.13)' }
            : { background: 'transparent' }),
        }}>
        <div className="flex items-center gap-2.5" style={{ zIndex: 1 }}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg font-black font-mono text-sm"
            style={{ background: 'rgba(245,158,11,0.14)', border: '1.5px solid rgba(245,158,11,0.38)', color: '#d97706' }}>
            &gt;_
          </div>
          <span className="text-[17px] font-black tracking-tight" style={{ color: '#18140f' }}>
            TCL<span style={{ color: '#d97706' }}>Forge</span>
          </span>
        </div>
        <div className="flex items-center gap-3" style={{ zIndex: 1 }}>
          <button onClick={() => navigate('/auth?tab=login')}
            className="text-sm font-mono transition-all duration-200 px-4 py-2 rounded-lg"
            style={{ color: '#6b5a45' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#d97706'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6b5a45'; }}>
            sign_in
          </button>
          <button onClick={() => navigate('/auth?tab=signup')}
            className="flex items-center gap-1.5 text-sm font-bold font-mono px-5 py-2.5 rounded-xl transition-all duration-200"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#0d0c0a', boxShadow: '0 4px 14px rgba(245,158,11,0.35)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            &gt;_ forge_signup
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-20 px-6 sm:px-10 md:px-16 lg:px-20 max-w-7xl mx-auto" style={{ zIndex: 1 }}>
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-14">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center px-4 py-2 rounded mb-8 text-[13px] font-mono font-semibold"
              style={{ background: 'transparent', border: '1.5px solid rgba(217,119,6,0.55)', color: '#d97706' }}>
              $ v2.4.0_STABLE
            </div>
            <h1 className="font-black tracking-tight leading-[1.0] mb-6"
              style={{ color: '#18140f', letterSpacing: '-0.03em', fontSize: 'clamp(56px, 6vw, 82px)' }}>
              TCL Forge.
            </h1>
            <p className="text-[16px] leading-[1.75] mb-9 max-w-[480px]" style={{ color: '#7a6652', fontWeight: 400 }}>
              Master TCL for EDA Automation. Live runner. Real PD challenges.
              Bridge the gap between generic scripting and production-grade
              Physical Design flows.
            </p>
            <div className="flex flex-col items-start gap-3 max-w-[340px]">
              <button onClick={() => navigate('/auth?tab=signup')}
                className="w-full inline-flex items-center justify-center gap-2 font-black font-mono transition-all duration-200 px-7 py-[14px] rounded-xl text-[15px]"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#0d0c0a', boxShadow: 'none' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                &gt;_ START_LEARNING →
              </button>
              <button onClick={() => navigate('/auth?tab=login')}
                className="inline-flex items-center justify-center font-bold font-mono tracking-widest uppercase transition-all duration-200 px-5 py-[10px] rounded-xl text-[12px]"
                style={{ background: 'transparent', border: '1.5px solid rgba(140,110,60,0.28)', color: '#6b5a45' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(217,119,6,0.45)'; e.currentTarget.style.color = '#d97706'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(140,110,60,0.28)'; e.currentTarget.style.color = '#6b5a45'; }}>
                EXPLORE_DOCS →
              </button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-[580px]">
            <CodeShowcase />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative py-16 px-6 sm:px-10 md:px-16 lg:px-20 max-w-7xl mx-auto" style={{ zIndex: 1 }}>
        <SectionDivider label="PLATFORM_STATS" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STATS.map(({ v, l, sub, icon }) => (
            <div key={l} className="relative overflow-hidden rounded-2xl p-7"
              style={{ background: 'linear-gradient(135deg, #f6a823 0%, #f47820 100%)', boxShadow: 'none' }}>
              {/* Grid overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 26px), repeating-linear-gradient(90deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 26px)',
              }} />
              <span className="absolute bottom-3 right-5 font-black font-mono select-none pointer-events-none"
                style={{ fontSize: '68px', color: 'rgba(0,0,0,0.10)', lineHeight: 1 }}>
                {icon}
              </span>
              <p className="text-5xl font-black font-mono mb-1" style={{ color: '#0d0c0a' }}>{v}</p>
              <p className="text-[17px] font-black mb-0.5" style={{ color: '#0d0c0a' }}>{l}</p>
              <p className="text-[13px] font-mono" style={{ color: 'rgba(13,12,10,0.6)' }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modules ── */}
      <section className="relative py-16 px-6 sm:px-10 md:px-16 lg:px-20 max-w-7xl mx-auto" style={{ zIndex: 1 }}>
        <SectionDivider label="FORGE_MODULES" />
        <div className="grid sm:grid-cols-2 gap-5">
          {MODULES.map(({ faIcon, tag, title, desc, route }) => (
            <div key={title}
              className="rounded-2xl p-7 transition-all duration-200 cursor-pointer"
              style={{ background: '#ffffff', border: '1.5px solid rgba(160,120,55,0.14)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(160,120,55,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}>
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.09)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <i className={`fas ${faIcon} text-sm`} style={{ color: '#d97706' }} />
                </div>
                <span className="text-[11px] font-black font-mono px-3 py-1 rounded-full"
                  style={{ background: 'rgba(245,158,11,0.13)', color: '#0d0c0a', border: '1px solid rgba(245,158,11,0.25)' }}>
                  {tag}
                </span>
              </div>
              <h3 className="text-[16px] font-black mb-1.5" style={{ color: '#18140f' }}>{title}</h3>
              <p className="text-[13.5px] leading-relaxed mb-5" style={{ color: '#9a8878' }}>{desc}</p>
              <button onClick={() => navigate(route)}
                className="text-[13px] font-bold font-mono transition-colors duration-150"
                style={{ color: '#d97706' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                onMouseLeave={e => e.currentTarget.style.color = '#d97706'}>
                access_module →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-10 px-6 sm:px-8" style={{ zIndex: 1 }}>
        <div className="rounded-3xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #f6a823 0%, #f47820 100%)', boxShadow: 'none', padding: '72px 56px' }}>
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 26px), repeating-linear-gradient(90deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 26px)',
          }} />
          {/* Ghost curly braces */}
          <span className="absolute font-black font-mono select-none pointer-events-none"
            style={{ fontSize: '130px', color: 'rgba(0,0,0,0.10)', lineHeight: 1, top: '50%', transform: 'translateY(-50%)', right: '60px', letterSpacing: '-0.06em' }}>
            {'{ }'}
          </span>
          <div className="relative" style={{ maxWidth: '520px' }}>
            <p className="font-mono font-black tracking-[0.22em] uppercase mb-4" style={{ fontSize: '12px', color: 'rgba(13,12,10,0.50)' }}>
              &gt;_ READY_TO_FORGE?
            </p>
            <h2 className="font-black tracking-tight mb-2" style={{ color: '#0d0c0a', fontSize: '36px', lineHeight: 1.15 }}>
              Start forging today.
            </h2>
            <p className="mb-8" style={{ fontSize: '15px', color: 'rgba(13,12,10,0.62)', fontFamily: 'inherit' }}>
              Join engineers using TCL Forge to ace EDA interviews.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="enter_your_email"
                value={joinEmail}
                onChange={e => setJoinEmail(e.target.value)}
                className="outline-none font-mono"
                style={{ background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '10px', padding: '13px 20px', fontSize: '13px', color: '#18140f', width: '240px' }}
              />
              <button
                onClick={() => navigate(`/auth?tab=signup${joinEmail ? `&email=${encodeURIComponent(joinEmail)}` : ''}`)}
                className="font-black font-mono whitespace-nowrap transition-all duration-200"
                style={{ background: '#0d0c0a', color: '#f0ede6', borderRadius: '10px', padding: '13px 28px', fontSize: '14px', boxShadow: '0 4px 14px rgba(0,0,0,0.28)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                JOIN_IT →
              </button>
            </div>
          </div>
        </div>
      </section>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </motion.div>
  );
}
