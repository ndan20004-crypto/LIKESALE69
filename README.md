# LIKESALE69.SHOP

  This is a code bundle for LIKESALE69.SHOP. The original project is available at https://www.figma.com/design/2oVSXvjWIBOPPZxjv6DAJN/LIKESALE69.SHOP.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Chạy đăng ký/đăng nhập dùng chung giữa các trình duyệt

Bản này bổ sung **API backend nhỏ** (Express) để lưu user vào file `server/data/db.json`.
Vì vậy bạn đăng ký ở Chrome rồi sang Cốc Cốc (hoặc máy khác) vẫn đăng nhập được.

### Development
```bash
npm install
npm run dev
```
- Web (Vite): http://localhost:3000
- API: http://localhost:4000

### Production
- Build web: `npm run build`
- Chạy API: `npm run start` (mặc định port 4000)

> Lưu ý: Nếu bạn deploy lên hosting, hãy chạy **cả web + API** cùng domain (hoặc set `VITE_API_BASE_URL`).

## Deploy lên Vercel + lưu tài khoản trong DB (khuyên dùng)

Vercel không chạy bền kiểu Express server. Vì vậy bản này đã có **Serverless API**:

- `POST /api/register`
- `POST /api/login`

Các API này lưu user vào **Supabase Postgres** (DB thật) để:

- Đăng ký xong **đăng nhập được ở mọi trình duyệt/máy**
- Không bị mất dữ liệu khi Vercel scale/redeploy

### 1) Tạo bảng `users` trên Supabase

Vào Supabase → SQL Editor và chạy:

```sql
create table if not exists public.users (
  id bigserial primary key,
  username text not null unique,
  email text not null unique,
  phone text,
  password_hash text not null,
  balance numeric default 0,
  total_spent numeric default 0,
  total_orders int default 0,
  status text default 'active',
  created_at timestamptz default now()
);
```

### 2) Set Environment Variables trên Vercel

Vercel Project → Settings → Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Service role key, chỉ dùng phía serverless)

### 3) Deploy

Push lên GitHub, Vercel sẽ tự build & deploy.
