import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api.js';

export default function ResetPassword() {
  const [token, setToken]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [msg, setMsg]           = useState(null);
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  // Supabase puts the recovery access_token in the URL hash:
  // /reset-password#access_token=...&type=recovery
  useEffect(() => {
    const hash   = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const t      = params.get('access_token');
    const type   = params.get('type');
    if (t && type === 'recovery') {
      setToken(t);
    } else {
      setMsg({ type: 'error', text: 'Invalid or expired reset link. Request a new one.' });
    }
  }, []);

  async function handleReset(e) {
    e.preventDefault();
    if (password !== confirm) return setMsg({ type: 'error', text: 'Passwords do not match.' });
    if (password.length < 8)  return setMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
    setLoading(true); setMsg(null);
    try {
      await api.resetPassword({ token, new_password: password });
      setMsg({ type: 'success', text: 'Password updated! Redirecting to login…' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cc-bg p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <i className="fas fa-terminal text-amber-400" />
          <span className="font-bold text-amber-400">TCL Forge</span>
        </div>

        <h2 className="text-xl font-bold text-cc-text mb-1">Set New Password</h2>
        <p className="text-cc-muted text-sm mb-6">Enter your new password below.</p>

        {!token && msg ? (
          <p className="text-xs px-3 py-2 rounded-lg bg-red-900/50 text-red-400">{msg.text}</p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cc-muted mb-1.5">New Password</label>
              <input type="password" className="cc-input" placeholder="8+ characters"
                value={password} onChange={(e) => { setPassword(e.target.value); setMsg(null); }} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-cc-muted mb-1.5">Confirm Password</label>
              <input type="password" className="cc-input" placeholder="Re-enter password"
                value={confirm} onChange={(e) => { setConfirm(e.target.value); setMsg(null); }} required />
            </div>
            {msg && (
              <p className={`text-xs px-3 py-2 rounded-lg ${
                msg.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
              }`}>
                {msg.text}
              </p>
            )}
            <button type="submit" disabled={loading || !token} className="cc-btn-primary w-full">
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
