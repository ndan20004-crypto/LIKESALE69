const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('./_supabaseAdmin');

// POST /api/register
// Body: { username, email, phone?, password }
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const { username, email, phone, password } = req.body || {};

    const u = String(username || '').trim();
    const e = String(email || '').trim();
    const p = String(password || '');

    if (!u || !e || !p) {
      return res.status(400).json({ ok: false, message: 'Thiếu username/email/password' });
    }

    const password_hash = await bcrypt.hash(p, 10);
    const sb = supabaseAdmin();

    // Requires table "users" with unique(username), unique(email)
    const { data, error } = await sb
      .from('users')
      .insert([
        {
          username: u,
          email: e,
          phone: String(phone || '').trim(),
          password_hash,
          balance: 0,
          total_spent: 0,
          total_orders: 0,
          status: 'active',
          role: 'user',
          is_admin: false,
        },
      ])
      .select('username,email,phone,balance,total_spent,total_orders,status,created_at,role,is_admin')
      .single();

    if (error) {
      // Unique violation (Postgres) often shows "duplicate key value" in message
      const msg = String(error.message || '');
      if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
        return res.status(409).json({ ok: false, message: 'Username hoặc Email đã tồn tại' });
      }
      console.error('SUPABASE_REGISTER_ERROR', error);
      return res.status(500).json({ ok: false, message: 'Lỗi server khi đăng ký' });
    }

    return res.status(200).json({ ok: true, user: data });
  } catch (err) {
    console.error('REGISTER_ERROR', err);
    return res.status(500).json({ ok: false, message: 'Lỗi server khi đăng ký' });
  }
}
