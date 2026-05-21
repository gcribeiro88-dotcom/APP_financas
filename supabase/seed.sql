-- =============================================
-- FinançasPessoais — Schema + Seed
-- Execute no SQL Editor do Supabase
-- =============================================

-- Extensão para UUIDs
create extension if not exists "pgcrypto";

-- =============================================
-- TABELA: categories
-- =============================================
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade,
  name        text not null,
  type        text not null check (type in ('income', 'expense', 'both')),
  color       text not null default '#94a3b8',
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- RLS para categories
alter table public.categories enable row level security;

create policy "Usuários veem suas categorias e as padrão"
  on public.categories for select
  using (user_id = auth.uid() or user_id is null);

create policy "Usuários criam suas categorias"
  on public.categories for insert
  with check (user_id = auth.uid());

create policy "Usuários editam suas categorias"
  on public.categories for update
  using (user_id = auth.uid());

create policy "Usuários excluem suas categorias"
  on public.categories for delete
  using (user_id = auth.uid());

-- =============================================
-- TABELA: transactions
-- =============================================
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade not null,
  category_id uuid references public.categories on delete set null,
  type        text not null check (type in ('income', 'expense')),
  amount      numeric(12, 2) not null,
  date        date not null,
  description text,
  created_at  timestamptz not null default now()
);

-- RLS para transactions
alter table public.transactions enable row level security;

create policy "Usuários veem suas transações"
  on public.transactions for select
  using (user_id = auth.uid());

create policy "Usuários criam suas transações"
  on public.transactions for insert
  with check (user_id = auth.uid());

create policy "Usuários editam suas transações"
  on public.transactions for update
  using (user_id = auth.uid());

create policy "Usuários excluem suas transações"
  on public.transactions for delete
  using (user_id = auth.uid());

-- =============================================
-- SEED: Categorias padrão
-- =============================================
insert into public.categories (user_id, name, type, color, is_default) values
  -- Despesas
  (null, 'Alimentação',  'expense', '#f97316', true),
  (null, 'Transporte',   'expense', '#3b82f6', true),
  (null, 'Saúde',        'expense', '#ef4444', true),
  (null, 'Moradia',      'expense', '#8b5cf6', true),
  (null, 'Lazer',        'expense', '#06b6d4', true),
  (null, 'Educação',     'expense', '#eab308', true),
  (null, 'Vestuário',    'expense', '#ec4899', true),
  (null, 'Outros',       'both',    '#94a3b8', true),
  -- Receitas
  (null, 'Salário',      'income',  '#16a34a', true),
  (null, 'Freelance',    'income',  '#10b981', true),
  (null, 'Investimentos','income',  '#1e40af', true),
  (null, 'Presente',     'income',  '#a855f7', true)
on conflict do nothing;
