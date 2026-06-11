import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// One anon client for all auth operations — no service-role key needed
function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.user_metadata?.username || user.email.split('@')[0],
  };
}

// POST /api/signup
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'email, username and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) return res.status(400).json({ error: error.message });

    // email_confirm disabled → session available immediately
    if (data.session) {
      return res.status(201).json({
        message: 'Signup successful',
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: formatUser(data.user),
      });
    }

    // email_confirm enabled → user must confirm email first
    return res.status(201).json({
      message: 'Account created. Check your email to confirm before logging in.',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });

    return res.json({
      message: 'Login successful',
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: formatUser(data.user),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/logout
router.post('/logout', (_req, res) => {
  // Supabase JWTs are stateless; the client clears its tokens locally.
  return res.json({ message: 'Logout successful' });
});

// POST /api/refresh
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(400).json({ error: 'refresh_token is required' });
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });
    if (error) return res.status(401).json({ error: error.message });

    return res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/send-reset-email
router.post('/send-reset-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });

  try {
    const supabase = getSupabase();
    const redirectTo = `${process.env.CLIENT_URL}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return res.status(400).json({ error: error.message });

    return res.json({ message: 'Password reset email sent. Check your inbox.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/reset-password  (recovery token comes from the Supabase email link URL hash)
router.post('/reset-password', async (req, res) => {
  const { token, new_password } = req.body;
  if (!token || !new_password) {
    return res.status(400).json({ error: 'token and new_password are required' });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': process.env.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ password: new_password }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(400).json({
        error: data.msg || data.message || data.error_description || 'Password reset failed',
      });
    }

    return res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/change-password  (requires auth)
router.post('/change-password', requireAuth, async (req, res) => {
  const { old_password, new_password } = req.body;
  if (!old_password || !new_password) {
    return res.status(400).json({ error: 'old_password and new_password are required' });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    // Verify old password by re-authenticating
    const supabase = getSupabase();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: req.user.email,
      password: old_password,
    });
    if (signInError) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update using user's own access token — no service role key required
    const token = req.headers.authorization.split(' ')[1];
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': process.env.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ password: new_password }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(400).json({
        error: data.msg || data.message || data.error_description || 'Password update failed',
      });
    }

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/me
router.get('/me', requireAuth, (req, res) => {
  return res.json(formatUser(req.user));
});

export default router;
