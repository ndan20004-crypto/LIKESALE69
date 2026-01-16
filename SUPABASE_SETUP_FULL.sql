-- Run in Supabase SQL editor
-- Tables: users, deposits, orders, app_config

create table if not exists public.users (
  username text primary key,
  email text unique not null,
  phone text,
  password_hash text not null,
  balance numeric not null default 0,
  total_spent numeric not null default 0,
  total_orders bigint not null default 0,
  status text not null default 'active',
  role text not null default 'user',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

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

create table if not exists public.orders (
  id bigserial primary key,
  user_id text not null,
  username text not null,
  service text not null,
  platform text not null,
  link text not null,
  quantity bigint not null,
  price numeric not null,
  comments jsonb,
  reaction_type text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists orders_username_idx on public.orders(username);
create index if not exists orders_status_idx on public.orders(status);

create table if not exists public.app_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Optional: auto-update updated_at
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_app_config_updated on public.app_config;
create trigger trg_app_config_updated
before update on public.app_config
for each row execute function public.set_updated_at();

-- Create initial admin account (change email/password)
-- Password is bcrypt hash of "admin123" with 10 rounds:
-- You can generate your own and replace it.
insert into public.users (username, email, phone, password_hash, role, is_admin, status)
values (
  'admin',
  'admin@likesale69.com',
  '',
  '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Yq4oKJ9E9Qm0E6E0c9n0Q5xQJ9p1y',
  'admin',
  true,
  'active'
)
on conflict (username) do nothing;
