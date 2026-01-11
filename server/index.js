const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 4000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'db.json');

async function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    await fsp.writeFile(DB_PATH, JSON.stringify({ users: [] }, null, 2), 'utf-8');
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fsp.readFile(DB_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return { users: [] };
  }
}

async function writeDb(db) {
  await ensureDb();
  await fsp.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

function publicUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ ok: false, message: 'Thiếu username/email/password' });
    }

    const db = await readDb();
    const uLower = String(username).trim().toLowerCase();
    const eLower = String(email).trim().toLowerCase();

    const exists = db.users.find(u =>
      String(u.username).toLowerCase() === uLower || String(u.email).toLowerCase() === eLower
    );
    if (exists) {
      return res.status(409).json({ ok: false, message: 'Username hoặc Email đã tồn tại' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const now = new Date().toISOString();

    const newUser = {
      username: String(username).trim(),
      email: String(email).trim(),
      phone: String(phone || '').trim(),
      passwordHash,
      balance: 0,
      totalSpent: 0,
      totalOrders: 0,
      createdAt: now,
      status: 'active',
    };

    db.users.push(newUser);
    await writeDb(db);

    res.json({ ok: true, user: publicUser(newUser) });
  } catch (err) {
    console.error('REGISTER_ERROR', err);
    res.status(500).json({ ok: false, message: 'Lỗi server khi đăng ký' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, message: 'Thiếu username/password' });
    }

    const db = await readDb();
    const key = String(username).trim().toLowerCase();

    const user = db.users.find(u =>
      String(u.username).toLowerCase() === key || String(u.email).toLowerCase() === key
    );
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
    if (user.status === 'blocked') {
      return res.status(403).json({ ok: false, message: 'Tài khoản đã bị khóa' });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ ok: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }

    res.json({ ok: true, user: publicUser(user) });
  } catch (err) {
    console.error('LOGIN_ERROR', err);
    res.status(500).json({ ok: false, message: 'Lỗi server khi đăng nhập' });
  }
});

app.get('/api/users', async (req, res) => {
  // Simple endpoint for UI to show users; passwords are never returned.
  try {
    const db = await readDb();
    res.json({ ok: true, users: db.users.map(publicUser) });
  } catch (err) {
    console.error('USERS_ERROR', err);
    res.status(500).json({ ok: false, message: 'Lỗi server' });
  }
});

app.listen(PORT, async () => {
  await ensureDb();
  console.log(`API running on http://localhost:${PORT}`);
});
