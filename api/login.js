const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('./_supabaseAdmin');

// POST /api/login
// Body: { username, password } where username can be username or email
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body || {};
    const key = String(username || '').trim();
    const p = String(password || '');

    if (!key || !p) {
      return res.status(400).json({ ok: false, message: 'Thiếu username/password' });
    }

    const sb = supabaseAdmin();

    // Find by username OR email
    const { data: user, error } = await sb
      .from('users')
      .select('username,email,phone,password_hash,balance,total_spent,total_orders,status,created_at,role,is_admin')
      .or(`username.eq.${key},email.eq.${key}`)
      .maybeSingle();

    if (error) {
      console.error('SUPABASE_LOGIN_QUERY_ERROR', error);
      return res.status(500).json({ ok: false, message: 'Lỗi server khi đăng nhập' });
    }

    if (!user) {
      return res.status(401).json({ ok: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ ok: false, message: 'Tài khoản đã bị khóa' });
    }

    const ok = await bcrypt.compare(p, user.password_hash);
    if (!ok) {
      return res.status(401).json({ ok: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }

    const { password_hash, ...publicUser } = user;
    return res.status(200).json({ ok: true, user: publicUser });
  } catch (err) {
    console.error('LOGIN_ERROR', err);
    return res.status(500).json({ ok: false, message: 'Lỗi server khi đăng nhập' });
  }
}