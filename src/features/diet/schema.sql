-- ============================================================
-- Diet Planner schema
-- Run in Supabase SQL editor. Assumes auth.users exists.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- nutrition_goals ----------
create table if not exists nutrition_goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  value numeric not null default 0,
  unit text not null default '',
  icon text not null default '🎯',
  current numeric not null default 0,
  progress numeric generated always as (
    case when value = 0 then 0
    else least(100, round((current / value) * 100)) end
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- meals ----------
create table if not exists meals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  time text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- meal_foods ----------
create table if not exists meal_foods (
  id uuid primary key default uuid_generate_v4(),
  meal_id uuid not null references meals(id) on delete cascade,
  name text not null,
  quantity text not null default '',
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- shopping_list ----------
create table if not exists shopping_list (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  food text not null,
  quantity text not null default '',
  cost numeric not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- budget_items ----------
create table if not exists budget_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric not null default 0,
  icon text not null default '💰',
  created_at timestamptz not null default now()
);

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_nutrition_goals_updated_at on nutrition_goals;
create trigger trg_nutrition_goals_updated_at
  before update on nutrition_goals
  for each row execute function set_updated_at();

drop trigger if exists trg_meals_updated_at on meals;
create trigger trg_meals_updated_at
  before update on meals
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security — each user only sees their own rows
-- ============================================================
alter table nutrition_goals enable row level security;
alter table meals enable row level security;
alter table meal_foods enable row level security;
alter table shopping_list enable row level security;
alter table budget_items enable row level security;

create policy "own nutrition_goals" on nutrition_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own meals" on meals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- meal_foods has no user_id directly — gate through parent meal
create policy "own meal_foods" on meal_foods
  for all using (
    exists (select 1 from meals m where m.id = meal_foods.meal_id and m.user_id = auth.uid())
  ) with check (
    exists (select 1 from meals m where m.id = meal_foods.meal_id and m.user_id = auth.uid())
  );

create policy "own shopping_list" on shopping_list
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own budget_items" on budget_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_meals_user on meals(user_id);
create index if not exists idx_meal_foods_meal on meal_foods(meal_id);
create index if not exists idx_nutrition_goals_user on nutrition_goals(user_id);
create index if not exists idx_shopping_list_user on shopping_list(user_id);
create index if not exists idx_budget_items_user on budget_items(user_id);