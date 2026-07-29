create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  current numeric default 0,
  target numeric default 100,
  unit text default 'units',
  target_date date,
  status text default 'active' check (status in ('active','completed','paused','overdue')),
  priority text default 'medium' check (priority in ('high','medium','low')),
  progress int default 0,
  related_plans text[] default '{}',
  color text default 'bg-violet-50 text-violet-600',
  icon text default 'Target',
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists goal_milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals(id) on delete cascade,
  title text not null,
  done boolean default false,
  sort_order int default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_goals_user on goals(user_id);
create index if not exists idx_milestones_goal on goal_milestones(goal_id);

alter table goals enable row level security;
alter table goal_milestones enable row level security;

create policy "own_goals" on goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_milestones" on goal_milestones
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);