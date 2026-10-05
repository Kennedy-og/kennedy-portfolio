create table if not exists public.portfolio_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_state enable row level security;
grant all on public.portfolio_state to service_role;

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = excluded.public;
