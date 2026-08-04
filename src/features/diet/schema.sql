create table if not exists public.nutrition_goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  value       numeric not null,
  unit        text not null,
  icon        text not null default 'Flame',
  progress    integer not null default 0,
  current     numeric not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.meals (
  id          text not null,
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  time        text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.meal_foods (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  meal_id     text not null,
  name        text not null,
  quantity    text not null,
  calories    numeric not null default 0,
  protein     numeric not null default 0,
  carbs       numeric not null default 0,
  fat         numeric not null default 0,
  created_at  timestamptz not null default now(),
  constraint meal_foods_meal_fk
    foreign key (user_id, meal_id)
    references public.meals (user_id, id)
    on delete cascade
);

create table if not exists public.shopping_list (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  food        text not null,
  quantity    text not null,
  cost        numeric not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.budget_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  amount      numeric not null default 0,
  icon        text not null default 'ShoppingCart',
  created_at  timestamptz not null default now()
);

create index if not exists nutrition_goals_user_id_idx on public.nutrition_goals (user_id);
create index if not exists meals_user_id_idx on public.meals (user_id);
create index if not exists meal_foods_user_meal_idx on public.meal_foods (user_id, meal_id);
create index if not exists shopping_list_user_id_idx on public.shopping_list (user_id);
create index if not exists budget_items_user_id_idx on public.budget_items (user_id);

alter table public.nutrition_goals enable row level security;
alter table public.meals enable row level security;
alter table public.meal_foods enable row level security;
alter table public.shopping_list enable row level security;
alter table public.budget_items enable row level security;

create policy "Users can view own nutrition goals" on public.nutrition_goals for select using (auth.uid() = user_id);
create policy "Users can insert own nutrition goals" on public.nutrition_goals for insert with check (auth.uid() = user_id);
create policy "Users can update own nutrition goals" on public.nutrition_goals for update using (auth.uid() = user_id);
create policy "Users can delete own nutrition goals" on public.nutrition_goals for delete using (auth.uid() = user_id);

create policy "Users can view own meals" on public.meals for select using (auth.uid() = user_id);
create policy "Users can insert own meals" on public.meals for insert with check (auth.uid() = user_id);
create policy "Users can update own meals" on public.meals for update using (auth.uid() = user_id);
create policy "Users can delete own meals" on public.meals for delete using (auth.uid() = user_id);

create policy "Users can view own meal foods" on public.meal_foods for select using (auth.uid() = user_id);
create policy "Users can insert own meal foods" on public.meal_foods for insert with check (auth.uid() = user_id);
create policy "Users can update own meal foods" on public.meal_foods for update using (auth.uid() = user_id);
create policy "Users can delete own meal foods" on public.meal_foods for delete using (auth.uid() = user_id);

create policy "Users can view own shopping list" on public.shopping_list for select using (auth.uid() = user_id);
create policy "Users can insert own shopping items" on public.shopping_list for insert with check (auth.uid() = user_id);
create policy "Users can update own shopping items" on public.shopping_list for update using (auth.uid() = user_id);
create policy "Users can delete own shopping items" on public.shopping_list for delete using (auth.uid() = user_id);

create policy "Users can view own budget items" on public.budget_items for select using (auth.uid() = user_id);
create policy "Users can insert own budget items" on public.budget_items for insert with check (auth.uid() = user_id);
create policy "Users can update own budget items" on public.budget_items for update using (auth.uid() = user_id);
create policy "Users can delete own budget items" on public.budget_items for delete using (auth.uid() = user_id);