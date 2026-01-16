const { supabaseAdmin } = require('./_supabaseAdmin');

// POST /api/deposits_update
// Body: { id, updates: { status?, note?, transferredAt?, completedAt? } }
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const sb = supabaseAdmin();
    const b = req.body || {};
    const id = b.id;
    const updates = b.updates || {};

    if (id === undefined || id === null || String(id).trim() === '') {
      return res.status(400).json({ ok: false, message: 'Thiếu id' });
    }

    const patch = {};
    if (updates.status !== undefined) patch.status = String(updates.status);
    if (updates.note !== undefined) patch.note = updates.note === null ? null : String(updates.note);
    if (updates.transferredAt !== undefined) patch.transferred_at = updates.transferredAt ? new Date(updates.transferredAt).toISOString() : null;
    if (updates.completedAt !== undefined) patch.completed_at = updates.completedAt ? new Date(updates.completedAt).toISOString() : null;

    const { data, error } = await sb
      .from('deposits')
      .update(patch)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('SUPABASE_DEPOSITS_UPDATE_ERROR', error);
      return res.status(500).json({ ok: false, message: 'Lỗi server' });
    }

    return res.status(200).json({ ok: true, deposit: data || null });
  } catch (err) {
    console.error('DEPOSITS_UPDATE_HANDLER_ERROR', err);
    return res.status(500).json({ ok: false, message: 'Lỗi server' });
  }
};
