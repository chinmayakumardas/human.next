create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text default '',
  total_pages int default 0,
  pages_read int default 0,
  progress int default 0,
  status text default 'want_to_read' check (status in ('reading','completed','want_to_read','paused')),
  priority text default 'medium' check (priority in ('high','medium','low')),
  color text default 'bg-violet-50 text-violet-600',
  notes text default '',
  started_at date,
  finished_at date,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_books_user on public.books(user_id);
alter table public.books enable row level security;

create policy "own_books" on public.books
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);