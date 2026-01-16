const { supabaseAdmin } = require('./_supabaseAdmin');

// GET /api/users?username=...
// GET /api/users (list)
// POST /api/users  Body: { username, updates: {...} }
module.exports = async function handler(req, res) {
  try {
    const sb = supabaseAdmin();

    if (req.method === 'GET') {
      const username = (req.query && req.query.username) ? String(req.query.username) : '';

      if (username) {
        const { data, error } = await sb
          .from('users')
          .select('username,email,phone,balance,total_spent,total_orders,status,created_at,role,is_admin')
          .eq('username', username)
          .maybeSingle();

        if (error) {
          console.error('SUPABASE_USERS_GET_ONE_ERROR', error);
          return res.status(500).json({ ok: false, message: 'Lỗi server' });
        }
        return res.status(200).json({ ok: true, user: data || null });
      }

      const { data, error } = await sb
        .from('users')
        .select('username,email,phone,balance,total_spent,total_orders,status,created_at,role,is_admin')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SUPABASE_USERS_GET_ERROR', error);
        return res.status(500).json({ ok: false, message: 'Lỗi server' });
      }

      return res.status(200).json({ ok: true, users: data || [] });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const username = String(body.username || '').trim();
      const updates = body.updates || {};

      if (!username) {
        return res.status(400).json({ ok: false, message: 'Thiếu username' });
      }

      const patch = {};
      if (updates.phone !== undefined) patch.phone = String(updates.phone || '');
      if (updates.balance !== undefined) patch.balance = Number(updates.balance);
      if (updates.totalSpent !== undefined) patch.total_spent = Number(updates.totalSpent);
      if (updates.total_spent !== undefined) patch.total_spent = Number(updates.total_spent);
      if (updates.totalOrders !== undefined) patch.total_orders = Number(updates.totalOrders);
      if (updates.total_orders !== undefined) patch.total_orders = Number(updates.total_orders);
      if (updates.status !== undefined) patch.status = String(updates.status);
      if (updates.role !== undefined) patch.role = String(updates.role);
      if (updates.is_admin !== undefined) patch.is_admin = Boolean(updates.is_admin);

      const { data, error } = await sb
        .from('users')
        .update(patch)
        .eq('username', username)
        .select('username,email,phone,balance,total_spent,total_orders,status,created_at,role,is_admin')
        .maybeSingle();

      if (error) {
        console.error('SUPABASE_USERS_UPDATE_ERROR', error);
        return res.status(500).json({ ok: false, message: 'Lỗi server' });
      }

      return res.status(200).json({ ok: true, user: data || null });
    }

    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('USERS_HANDLER_ERROR', err);
    return res.status(500).json({ ok: false, message: 'Lỗi server' });
  }
};
