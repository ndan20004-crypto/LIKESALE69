const { supabaseAdmin } = require('./_supabaseAdmin');

// GET /api/config?key=serviceCatalog
// POST /api/config  Body: { key, value }
module.exports = async function handler(req, res) {
  try {
    const sb = supabaseAdmin();

    if (req.method === 'GET') {
      const key = (req.query && req.query.key) ? String(req.query.key) : '';
      if (!key) {
        return res.status(400).json({ ok: false, message: 'Thiếu key' });
      }

      const { data, error } = await sb
        .from('app_config')
        .select('key,value,updated_at')
        .eq('key', key)
        .maybeSingle();

      if (error) {
        console.error('SUPABASE_CONFIG_GET_ERROR', error);
        return res.status(500).json({ ok: false, message: 'Lỗi server' });
      }

      return res.status(200).json({ ok: true, config: data || null });
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const key = String(b.key || '').trim();
      const value = b.value;

      if (!key) {
        return res.status(400).json({ ok: false, message: 'Thiếu key' });
      }

      const { data, error } = await sb
        .from('app_config')
        .upsert([{ key, value }], { onConflict: 'key' })
        .select('key,value,updated_at')
        .single();

      if (error) {
        console.error('SUPABASE_CONFIG_UPSERT_ERROR', error);
        return res.status(500).json({ ok: false, message: 'Lỗi server' });
      }

      return res.status(200).json({ ok: true, config: data });
    }

    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('CONFIG_HANDLER_ERROR', err);
    return res.status(500).json({ ok: false, message: 'Lỗi server' });
  }
};
