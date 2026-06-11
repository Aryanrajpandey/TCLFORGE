const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

// ── Token storage helpers ────────────────────────────────────────────────────

export function getTokens() {
  return {
    access:  localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
  };
}

export function setTokens(access, refresh) {
  localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now() + 30_000; // 30-second buffer
  } catch {
    return true;
  }
}

// ── Auto-refresh ─────────────────────────────────────────────────────────────

async function ensureFreshToken() {
  const { access, refresh } = getTokens();
  if (!access) return null;
  if (!isTokenExpired(access)) return access;

  if (!refresh) { clearTokens(); return null; }

  const res = await fetch(`${BASE}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  if (!res.ok) { clearTokens(); return null; }
  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

// ── Core request ─────────────────────────────────────────────────────────────

async function request(method, path, body, requiresAuth = true) {
  const headers = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const token = await ensureFreshToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  let data = {};
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(res.ok ? 'Invalid server response' : 'Server unreachable — is the backend running?');
  }

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── Auth API ─────────────────────────────────────────────────────────────────

export const api = {
  signup:         (body) => request('POST', '/signup',           body, false),
  login:          (body) => request('POST', '/login',            body, false),
  logout:         ()     => request('POST', '/logout',           undefined, false),
  sendResetEmail: (body) => request('POST', '/send-reset-email', body, false),
  resetPassword:  (body) => request('POST', '/reset-password',   body, false),
  changePassword: (body) => request('POST', '/change-password',  body, true),
  me:             ()     => request('GET',  '/me',               undefined, true),
};
