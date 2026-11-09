-- =====================================================================
--  Il Giardino della Dieta — schema Supabase
--  Copia TUTTO questo file in Supabase > SQL Editor > New query > Run
-- =====================================================================

-- Tabella unica che contiene tutti i dati dell'utente.
-- "kind" indica il tipo di dato: meal | recipe | food | note | profile
create table if not exists public.items (
  id          uuid primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind        text not null check (kind in ('meal','recipe','food','note','profile')),
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists items_user_kind_idx on public.items (user_id, kind);

-- Aggiorna automaticamente updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists items_touch on public.items;
create trigger items_touch before update on public.items
for each row execute function public.touch_updated_at();

-- Sicurezza: ogni utente vede e modifica SOLO i propri dati
alter table public.items enable row level security;

drop policy if exists "items_select_own" on public.items;
drop policy if exists "items_insert_own" on public.items;
drop policy if exists "items_update_own" on public.items;
drop policy if exists "items_delete_own" on public.items;

create policy "items_select_own" on public.items
  for select using (auth.uid() = user_id);

create policy "items_insert_own" on public.items
  for insert with check (auth.uid() = user_id);

create policy "items_update_own" on public.items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "items_delete_own" on public.items
  for delete using (auth.uid() = user_id);

