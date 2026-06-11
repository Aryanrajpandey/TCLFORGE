import { useState } from 'react';
import { api } from '../api/api.js';

export default function ChangePasswordModal({ onClose }) {
  const [form, setForm]   = useState({ old_password: '', new_password: '', confirm: '' });
  const [msg, setMsg]     = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    if (form.new_password !== form.confirm) {
      return setMsg({ type: 'error', text: 'New passwords do not match.' });
    }
    if (form.new_password.length < 8) {
      return setMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
    }
    setLoading(true);
    try {
      await api.changePassword({ old_password: form.old_password, new_password: form.new_password });
      setMsg({ type: 'success', text: 'Password updated successfully!' });
      setTimeout(onClose, 1500);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-cc-surface border border-cc-border rounded-2xl p-7 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-cc-text">Change Password</h2>
          <button onClick={onClose} className="text-cc-muted hover:text-cc-text text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Current Password',     key: 'old_password' },
            { label: 'New Password',         key: 'new_password' },
            { label: 'Confirm New Password', key: 'confirm' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-cc-muted mb-1.5">{label}</label>
              <input
                type="password"
                className="cc-input"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                required
              />
            </div>
          ))}

          {msg && (
            <p className={`text-xs text-center px-3 py-2 rounded-lg ${
              msg.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
            }`}>
              {msg.text}
            </p>
          )}

          <button type="submit" disabled={loading} className="cc-btn-primary w-full mt-2">
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
