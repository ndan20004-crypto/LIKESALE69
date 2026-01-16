const { supabaseAdmin } = require('./_supabaseAdmin');

// GET /api/deposits
// POST /api/deposits  Body: { userId, username, amount, method, status, note?, transferredAt?, completedAt? }
module.exports = async function handler(req, res) {
  try {
    const sb = supabaseAdmin();

    if (req.method === 'GET') {
      const { data, error } = await sb
        .from('deposits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SUPABASE_DEPOSITS_GET_ERROR', error);
        return res.status(500).json({ ok: false, message: 'Lỗi server' });
      }

      return res.status(200).json({ ok: true, deposits: data || [] });
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const user_id = String(b.userId || b.user_id || '').trim();
      const username = String(b.username || '').trim();
      const amount = Number(b.amount || 0);
      const method = String(b.method || '').trim();
      const status = String(b.status || 'pending').trim();
      const note = b.note !== undefined ? String(b.note) : null;
      const transferred_at = b.transferredAt ? new Date(b.transferredAt).toISOString() : null;
      const completed_at = b.completedAt ? new Date(b.completedAt).toISOString() : null;

      if (!user_id || !username || !method || !(amount > 0)) {
        return res.status(400).json({ ok: false, message: 'Thiếu dữ liệu nạp tiền' });
      }

      const { data, error } = await sb
        .from('deposits')
        .insert([
          {
            user_id,
            username,
            amount,
            method,
            status,
            note,
            transferred_at,
            completed_at,
          },
        ])
        .select('*')
        .single();

      if (error) {
        console.error('SUPABASE_DEPOSITS_INSERT_ERROR', error);
        return res.status(500).json({ ok: false, message: 'Lỗi server' });
      }

      return res.status(200).json({ ok: true, deposit: data });
    }

    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('DEPOSITS_HANDLER_ERROR', err);
    return res.status(500).json({ ok: false, message: 'Lỗi server' });
  }
};
