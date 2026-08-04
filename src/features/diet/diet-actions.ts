"use server";

import { createClient } from "@/lib/server";
import type {
  BudgetItem,
  DietData,
  Meal,
  MealFood,
  NutritionGoal,
  ShoppingItem,
} from "./types";
import {
  DEFAULT_BUDGET_ITEMS,
  DEFAULT_MEAL_PLAN,
  DEFAULT_NUTRITION_GOALS,
  DEFAULT_SHOPPING_LIST,
} from "./constants";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return { supabase, userId: user.id };
}

export async function getDietData(): Promise<DietData> {
  const { supabase, userId } = await getUserId();

  const [goalsRes, mealsRes, foodsRes, shoppingRes, budgetRes] =
    await Promise.all([
      supabase.from("nutrition_goals").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
      supabase.from("meals").select("*").eq("user_id", userId).order("sort_order", { ascending: true }),
      supabase.from("meal_foods").select("*").eq("user_id", userId),
      supabase.from("shopping_list").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
      supabase.from("budget_items").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    ]);

  const nutritionGoals: NutritionGoal[] =
    goalsRes.data && goalsRes.data.length > 0
      ? goalsRes.data
      : DEFAULT_NUTRITION_GOALS.map((g) => ({ ...g }));

  let mealPlan: Meal[];
  if (mealsRes.data && mealsRes.data.length > 0) {
    const foodsByMeal = (foodsRes.data ?? []).reduce<Record<string, MealFood[]>>((acc, food) => {
      if (!acc[food.meal_id]) acc[food.meal_id] = [];
      acc[food.meal_id].push(food);
      return acc;
    }, {});

    mealPlan = mealsRes.data.map((meal) => ({
      ...meal,
      foods: foodsByMeal[meal.id] ?? [],
    }));
  } else {
    mealPlan = DEFAULT_MEAL_PLAN;
  }

  const shoppingList: ShoppingItem[] =
    shoppingRes.data && shoppingRes.data.length > 0
      ? shoppingRes.data
      : DEFAULT_SHOPPING_LIST.map((s) => ({ ...s }));

  const budgetItems: BudgetItem[] =
    budgetRes.data && budgetRes.data.length > 0
      ? budgetRes.data
      : DEFAULT_BUDGET_ITEMS.map((b) => ({ ...b }));

  return { nutritionGoals, mealPlan, shoppingList, budgetItems };
}

export async function seedDietData() {
  const { supabase, userId } = await getUserId();

  await supabase.from("nutrition_goals").insert(
    DEFAULT_NUTRITION_GOALS.map((g) => ({ ...g, user_id: userId }))
  );

  await supabase.from("meals").insert(
    DEFAULT_MEAL_PLAN.map((m) => ({
      id: m.id,
      user_id: userId,
      title: m.title,
      time: m.time,
      sort_order: m.sort_order ?? 0,
    }))
  );

  const foods = DEFAULT_MEAL_PLAN.flatMap((m) =>
    m.foods.map((f) => ({
      user_id: userId,
      meal_id: m.id,
      name: f.name,
      quantity: f.quantity,
      calories: f.calories,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
    }))
  );
  await supabase.from("meal_foods").insert(foods);

  await supabase.from("shopping_list").insert(
    DEFAULT_SHOPPING_LIST.map((s) => ({ ...s, user_id: userId }))
  );

  await supabase.from("budget_items").insert(
    DEFAULT_BUDGET_ITEMS.map((b) => ({ ...b, user_id: userId }))
  );

  return { success: true };
}