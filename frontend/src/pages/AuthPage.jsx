import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/api.js';

const BOOT_LINES = [
  { text: '$ tclforge init',        type: 'cmd' },
  { text: '> Runtime loaded ✓',     type: 'ok' },
  { text: '> Supabase connected ✓', type: 'ok' },
  { text: '',                        type: 'blank' },
  { text: '$ tclforge auth --login', type: 'cmd' },
];

function Terminal({ email, password }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [email, password]);

  const pwDots = password ? '•'.repeat(password.length) : '';

  return (
    <div className="rounded-xl overflow-hidden select-none w-full"
      style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* Title bar */}
      <div className="relative flex items-center px-4 py-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#161b22' }}>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28ca41]" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-xs font-mono tracking-widest"
          style={{ color: '#3d454f' }}>tcl_forge — bash</span>
      </div>

      {/* Code area */}
      <div className="p-5 font-mono text-[13px] leading-7" style={{ minHeight: '220px' }}>
        {BOOT_LINES.map((l, i) => (
          <div key={i}
            className={
              l.type === 'cmd' ? 'text-amber-400' :
              l.type === 'ok'  ? 'text-[#3fb950]' : ''
            }>
            {l.text}
          </div>
        ))}
        <div className="mt-1">
          <div>
            <span className="text-[#8b949e]">  email    : </span>
            <span className="text-amber-300">{email || <span className="opacity-30">_</span>}</span>
          </div>
          <div>
            <span className="text-[#8b949e]">  password : </span>
            <span className="text-amber-300">{pwDots || <span className="opacity-30">_</span>}</span>
          </div>
          <div className="mt-1 text-amber-400">$ <span className="inline-block w-2 h-4 bg-amber-400 ml-0.5 animate-pulse align-middle" /></div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/* ── Password strength ── */
function PasswordStrength({ password }) {
  const score  = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#f85149', '#fb8f44', '#f59e0b', '#3fb950'];
  if (!password) return null;
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : '#2d3440' }} />
        ))}
      </div>
      <p className="text-[11px]" style={{ color: colors[score] || '#6b7280' }}>{labels[score]}</p>
    </div>
  );
}

/* ── Main ── */
export default function AuthPage() {
  const [params]          = useSearchParams();
  const [tab, setTab]     = useState(params.get('tab') === 'signup' ? 'signup' : 'login');
  const [form, setForm]   = useState({ email: '', username: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [msg, setMsg]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login }         = useAuth();
  const navigate          = useNavigate();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setMsg(null); };

  async function handleLogin(e) {
    e.preventDefault(); setLoading(true); setMsg(null);
    try { const d = await api.login({ email: form.email, password: form.password }); login(d); navigate('/home'); }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (form.password.length < 8) return setMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
    setLoading(true); setMsg(null);
    try {
      const d = await api.signup({ email: form.email, username: form.username, password: form.password });
      if (d.access_token) { login(d); navigate('/home'); }
      else { setMsg({ type: 'success', text: d.message || 'Account created! Check your email.' }); setTab('login'); }
    }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  }

  async function handleReset(e) {
    e.preventDefault(); setLoading(true); setMsg(null);
    try { await api.sendResetEmail({ email: resetEmail }); setResetSent(true); }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  }

  const inputCls = `w-full px-4 py-3.5 rounded-lg text-[14px] transition-all outline-none
    bg-[#161b22] border border-[#2d3440] text-cc-text placeholder-cc-faint
    focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/15`;

  return (
    <div className="min-h-screen flex bg-cc-bg">

      {/* ── Left panel (50%) ── */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between pt-20 px-12 pb-12 border-r border-cc-border"
        style={{ background: '#0d1117' }}>

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-amber-400 font-black font-mono text-xl">&lt;/&gt;</span>
            <span className="text-cc-text font-black text-xl tracking-tight">TCLForge</span>
          </div>
          <p className="text-[15px] text-cc-muted leading-relaxed mb-0.5">
            The interactive learning platform for TCL engineers.
          </p>
          <p className="text-[14px] text-cc-faint leading-relaxed mb-8">
            Type in the form and watch the terminal update live.
          </p>

          <Terminal email={form.email} password={form.password} />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-1.5 text-[13px] text-cc-faint">
          <span>71 Concepts</span>
          <span className="mx-1.5">·</span>
          <span>150 EDA Commands</span>
          <span className="mx-1.5">·</span>
          <span>AI Assistant</span>
        </div>
      </div>

      {/* ── Right panel (50%) ── */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-12 pt-20 pb-12">
        <div className="w-full max-w-sm">

          {tab !== 'forgot' ? (
            <>
              <h1 className="text-2xl font-black text-cc-text mb-1">
                {tab === 'login' ? 'Sign in' : 'Create account'}
              </h1>
              <p className="text-[14px] text-cc-muted mb-7">
                {tab === 'login' ? 'Welcome back to TCL Forge.' : 'Start your TCL journey today.'}
              </p>

              {/* Tabs */}
              <div className="flex border-b border-cc-border mb-7">
                {['login', 'signup'].map(t => (
                  <button key={t} onClick={() => { setTab(t); setMsg(null); setShowPw(false); }}
                    className={`px-5 py-2.5 text-[14px] font-semibold border-b-2 -mb-px transition-all ${
                      tab === t
                        ? 'text-amber-400 border-amber-400'
                        : 'text-cc-subtle border-transparent hover:text-cc-text'
                    }`}>
                    {t === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {/* Login form */}
              {tab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-widest text-cc-subtle">
                      Email address
                    </label>
                    <input type="email" className={inputCls} placeholder="you@example.com"
                      value={form.email} onChange={e => set('email', e.target.value)} required />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[12px] font-semibold uppercase tracking-widest text-cc-subtle">
                        Password
                      </label>
                      <button type="button"
                        onClick={() => { setTab('forgot'); setMsg(null); setResetSent(false); }}
                        className="text-[12px] text-amber-500 hover:text-amber-400 transition-colors">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} className={`${inputCls} pr-11`}
                        placeholder="••••••••" value={form.password}
                        onChange={e => set('password', e.target.value)} required />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cc-faint hover:text-cc-muted transition-colors">
                        <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                      </button>
                    </div>
                  </div>
                  {msg && (
                    <div className={`flex items-start gap-2 text-[13px] px-3.5 py-3 rounded-xl border ${
                      msg.type === 'success'
                        ? 'bg-[#3fb950]/10 border-[#3fb950]/25 text-[#3fb950]'
                        : 'bg-[#f85149]/10 border-[#f85149]/25 text-[#f85149]'
                    }`}>
                      <i className={`fas ${msg.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} mt-0.5 shrink-0`} />
                      {msg.text}
                    </div>
                  )}
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-black text-[14px] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    style={{ background: '#c97d10', color: '#0d0c0a', boxShadow: 'none' }}>
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-[#0d0c0a] border-t-transparent rounded-full animate-spin" /> Signing in…</>
                      : 'Sign in'}
                  </button>
                  <p className="text-center text-[13px] text-cc-muted pt-1">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => { setTab('signup'); setMsg(null); }}
                      className="text-amber-600/90 hover:text-amber-500 font-semibold transition-colors">
                      Sign up
                    </button>
                  </p>
                </form>
              )}

              {/* Signup form */}
              {tab === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-widest text-cc-subtle">
                      Username
                    </label>
                    <input type="text" className={inputCls} placeholder="your_username"
                      value={form.username} onChange={e => set('username', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-widest text-cc-subtle">
                      Email address
                    </label>
                    <input type="email" className={inputCls} placeholder="you@example.com"
                      value={form.email} onChange={e => set('email', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-widest text-cc-subtle">
                      Password
                    </label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} className={`${inputCls} pr-11`}
                        placeholder="8+ characters" value={form.password}
                        onChange={e => set('password', e.target.value)} required />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cc-faint hover:text-cc-muted transition-colors">
                        <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                      </button>
                    </div>
                    <PasswordStrength password={form.password} />
                  </div>
                  {msg && (
                    <div className={`flex items-start gap-2 text-[13px] px-3.5 py-3 rounded-xl border ${
                      msg.type === 'success'
                        ? 'bg-[#3fb950]/10 border-[#3fb950]/25 text-[#3fb950]'
                        : 'bg-[#f85149]/10 border-[#f85149]/25 text-[#f85149]'
                    }`}>
                      <i className={`fas ${msg.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} mt-0.5 shrink-0`} />
                      {msg.text}
                    </div>
                  )}
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-black text-[14px] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    style={{ background: '#c97d10', color: '#0d0c0a', boxShadow: 'none' }}>
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-[#0d0c0a] border-t-transparent rounded-full animate-spin" /> Creating…</>
                      : 'Create account'}
                  </button>
                  <p className="text-center text-[13px] text-cc-muted">
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setTab('login'); setMsg(null); }}
                      className="text-amber-600/90 hover:text-amber-500 font-semibold transition-colors">
                      Sign in
                    </button>
                  </p>
                  <p className="text-center text-[11px] text-cc-faint">
                    By registering you agree to our{' '}
                    <span className="text-amber-500/70 underline cursor-pointer">terms of service</span>
                  </p>
                </form>
              )}
            </>
          ) : (
            /* Forgot password */
            <>
              <button onClick={() => { setTab('login'); setMsg(null); setResetSent(false); }}
                className="flex items-center gap-2 text-[13px] text-cc-muted hover:text-cc-text transition-colors mb-6">
                <i className="fas fa-arrow-left text-xs" /> Back to sign in
              </button>
              <h1 className="text-2xl font-black text-cc-text mb-1">Reset password</h1>
              <p className="text-[14px] text-cc-muted mb-7">Enter your email and we'll send a reset link.</p>

              {!resetSent ? (
                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-semibold mb-1.5 uppercase tracking-widest text-cc-subtle">
                      Email address
                    </label>
                    <input type="email" className={inputCls} placeholder="you@example.com"
                      value={resetEmail} onChange={e => { setResetEmail(e.target.value); setMsg(null); }} required />
                  </div>
                  {msg && (
                    <div className="flex items-start gap-2 text-[13px] px-3.5 py-3 rounded-xl border bg-[#f85149]/10 border-[#f85149]/25 text-[#f85149]">
                      <i className="fas fa-circle-exclamation mt-0.5 shrink-0" />{msg.text}
                    </div>
                  )}
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl font-black text-[14px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: '#c97d10', color: '#0d0c0a', boxShadow: 'none' }}>
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-[#0d0c0a] border-t-transparent rounded-full animate-spin" /> Sending…</>
                      : 'Send reset link'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto bg-amber-500/10 border border-amber-500/25">
                    <i className="fas fa-envelope-circle-check text-amber-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-cc-text">Reset link sent!</p>
                    <p className="text-[13px] mt-1 text-cc-muted">
                      Check <span className="text-amber-400">{resetEmail}</span>
                    </p>
                  </div>
                  <button onClick={() => { setResetSent(false); setMsg(null); }}
                    className="text-[13px] text-amber-600/90 hover:text-amber-500 transition-colors">
                    Resend link
                  </button>
                </div>
              )}
            </>
          )}

          <p className="text-center text-[11px] text-cc-faint mt-8">© 2025 TCL Forge · Kunal Saraswat</p>
        </div>
      </div>
    </div>
  );
}
