const { supabaseAdmin } = require('./_supabaseAdmin');

// GET /api/orders
// POST /api/orders  Body: { userId, username, service, platform, link, quantity, price, comments?, reactionType?, status?, completedAt? }
module.exports = async function handler(req, res) {
  try {
    const sb = supabaseAdmin();

    if (req.method === 'GET') {
      const { data, error } = await sb
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SUPABASE_ORDERS_GET_ERROR', error);
        return res.status(500).json({ ok: false, message: 'Lỗi server' });
      }

      return res.status(200).json({ ok: true, orders: data || [] });
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const user_id = String(b.userId || b.user_id || '').trim();
      const username = String(b.username || '').trim();
      const service = String(b.service || '').trim();
      const platform = String(b.platform || '').trim();
      const link = String(b.link || '').trim();
      const quantity = Number(b.quantity || 0);
      const price = Number(b.price || 0);
      const status = String(b.status || 'pending').trim();
      const comments = Array.isArray(b.comments) ? b.comments : null;
      const reaction_type = b.reactionType ? String(b.reactionType) : null;
      const completed_at = b.completedAt ? new Date(b.completedAt).toISOString() : null;

      if (!user_id || !username || !service || !platform || !link || !(quantity > 0) || !(price >= 0)) {
        return res.status(400).json({ ok: false, message: 'Thiếu dữ liệu đơn hàng' });
      }

      const { data, error } = await sb
        .from('orders')
        .insert([
          {
            user_id,
            username,
            service,
            platform,
            link,
            quantity,
            price,
            comments,
            reaction_type,
            status,
            completed_at,
          },
        ])
        .select('*')
        .single();

      if (error) {
        console.error('SUPABASE_ORDERS_INSERT_ERROR', error);
        return res.status(500).json({ ok: false, message: 'Lỗi server' });
      }

      return res.status(200).json({ ok: true, order: data });
    }

    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('ORDERS_HANDLER_ERROR', err);
    return res.status(500).json({ ok: false, message: 'Lỗi server' });
  }
};
