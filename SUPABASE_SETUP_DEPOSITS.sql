-- Run this in Supabase SQL editor if you don't already have the `deposits` table.

create table if not exists public.deposits (
  id bigserial primary key,
  user_id text not null,
  username text not null,
  amount numeric not null,
  method text not null,
  status text not null default 'pending',
  note text,
  created_at timestamptz not null default now(),
  transferred_at timestamptz,
  completed_at timestamptz
);

create index if not exists deposits_username_idx on public.deposits(username);
create index if not exists deposits_status_idx on public.deposits(status);

-- If you use RLS, you can keep this table RLS OFF because we are using
-- SUPABASE_SERVICE_ROLE_KEY in /api/* endpoints.