create table if not exists public.workout_days (
  id uuid primary key default gen_random_uuid(),
  day_name text not null,
  day_type text not null,
  sort_order int default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.workout_days(id) on delete cascade,
  name text not null,
  sets int default 3,
  reps text default '8-10',
  rest text default '90 sec',
  sort_order int default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_workout_days_user on public.workout_days(user_id);
create index if not exists idx_exercises_day on public.exercises(day_id);

alter table public.workout_days enable row level security;
alter table public.exercises enable row level security;

drop policy if exists "own_workout_days" on public.workout_days;
drop policy if exists "own_exercises" on public.exercises;

create policy "own_workout_days" on public.workout_days
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_exercises" on public.exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

notify pgrst, 'reload schema';