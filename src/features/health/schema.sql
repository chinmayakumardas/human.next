-- HEALTH PROFILE
create table if not exists public.health_profile (
  id uuid primary key default gen_random_uuid(),
  age int default 28,
  height_cm numeric default 178,
  current_weight numeric default 82,
  target_weight numeric default 72,
  bmi numeric default 25.9,
  body_fat numeric default 18.4,
  blood_pressure text default '118/76',
  heart_rate int default 62,
  daily_calories int default 2200,
  protein_g int default 160,
  water_l numeric default 3.5,
  food_budget numeric default 320,
  workout_duration int default 75,
  goal_title text default 'Lose Weight',
  goal_progress int default 80,
  goal_deadline date default '2026-12-31',
  diet_plan_name text default 'Weight Loss Diet',
  exercise_plan_name text default 'Push Pull Legs',
  user_id uuid references auth.users(id) on delete cascade unique,
  updated_at timestamptz default now()
);

alter table public.health_profile enable row level security;
create policy "own_health_profile" on public.health_profile
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- EXERCISE
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

create policy "own_workout_days" on public.workout_days
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_exercises" on public.exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- DIET
create table if not exists public.nutrition_goals (
  id uuid primary key default gen_random_uuid(),
  calories int default 2200,
  protein int default 160,
  carbs int default 220,
  fat int default 70,
  fiber int default 30,
  water numeric default 3.5,
  user_id uuid references auth.users(id) on delete cascade unique
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meal_time text default '',
  sort_order int default 0,
  user_id uuid references auth.users(id) on delete cascade
);

create table if not exists public.meal_foods (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  name text not null,
  quantity text default '',
  calories int default 0,
  protein int default 0,
  carbs int default 0,
  fat int default 0,
  sort_order int default 0,
  user_id uuid references auth.users(id) on delete cascade
);

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  food text not null,
  quantity text default '',
  cost numeric default 0,
  user_id uuid references auth.users(id) on delete cascade
);

alter table public.nutrition_goals enable row level security;
alter table public.meals enable row level security;
alter table public.meal_foods enable row level security;
alter table public.shopping_items enable row level security;

create policy "own_nutrition" on public.nutrition_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_meals" on public.meals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_meal_foods" on public.meal_foods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_shopping" on public.shopping_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);