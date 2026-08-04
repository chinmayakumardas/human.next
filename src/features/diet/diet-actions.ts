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
  defaultBudgetItems,
  defaultMealPlan,
  defaultNutritionGoals,
  defaultShoppingList,
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
      : defaultNutritionGoals.map((g) => ({ ...g }));

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
    mealPlan = defaultMealPlan;
  }

  const shoppingList: ShoppingItem[] =
    shoppingRes.data && shoppingRes.data.length > 0
      ? shoppingRes.data
      : defaultShoppingList.map((s) => ({ ...s }));

  const budgetItems: BudgetItem[] =
    budgetRes.data && budgetRes.data.length > 0
      ? budgetRes.data
      : defaultBudgetItems.map((b) => ({ ...b }));

  return { nutritionGoals, mealPlan, shoppingList, budgetItems };
}

export async function seedDietData() {
  const { supabase, userId } = await getUserId();

  await supabase.from("nutrition_goals").insert(
    defaultNutritionGoals.map((g) => ({ ...g, user_id: userId }))
  );

  await supabase.from("meals").insert(
    defaultMealPlan.map((m) => ({
      id: m.id,
      user_id: userId,
      title: m.title,
      time: m.time,
      sort_order: m.sort_order ?? 0,
    }))
  );

  const foods = defaultMealPlan.flatMap((m) =>
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
    defaultShoppingList.map((s) => ({ ...s, user_id: userId }))
  );

  await supabase.from("budget_items").insert(
    defaultBudgetItems.map((b) => ({ ...b, user_id: userId }))
  );

  return { success: true };
}



export async function createMeal(input: {
  title: string;
  time: string;
  sort_order?: number;
}) {
  const { supabase, userId } = await getUserId();

  const { data, error } = await supabase
    .from("meals")
    .insert({
      user_id: userId,
      title: input.title,
      time: input.time,
      sort_order: input.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteMeal(mealId: string) {
  const { supabase, userId } = await getUserId();

  // Delete foods first in case the database does not have
  // ON DELETE CASCADE configured.
  const { error: foodsError } = await supabase
    .from("meal_foods")
    .delete()
    .eq("meal_id", mealId)
    .eq("user_id", userId);

  if (foodsError) {
    throw new Error(foodsError.message);
  }

  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", mealId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function addMealFood(
  mealId: string,
  input: {
    name: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }
) {
  const { supabase, userId } = await getUserId();

  // Verify that the meal belongs to the current user.
  const { data: meal, error: mealError } = await supabase
    .from("meals")
    .select("id")
    .eq("id", mealId)
    .eq("user_id", userId)
    .single();

  if (mealError || !meal) {
    throw new Error("Meal not found");
  }

  const { data, error } = await supabase
    .from("meal_foods")
    .insert({
      user_id: userId,
      meal_id: mealId,
      name: input.name,
      quantity: input.quantity,
      calories: input.calories,
      protein: input.protein,
      carbs: input.carbs,
      fat: input.fat,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteMealFood(foodId: string) {
  const { supabase, userId } = await getUserId();

  const { error } = await supabase
    .from("meal_foods")
    .delete()
    .eq("id", foodId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function createBudgetItem(input: {
  name: string;
  amount: number;
  icon: string;
}) {
  const { supabase, userId } = await getUserId();

  const { data, error } = await supabase
    .from("budget_items")
    .insert({
      user_id: userId,
      name: input.name,
      amount: input.amount,
      icon: input.icon,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteBudgetItem(itemId: string) {
  const { supabase, userId } = await getUserId();

  const { error } = await supabase
    .from("budget_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}



export async function createNutritionGoal(input: {
  title: string;
  value: number;
  unit: string;
  icon: string;
  current: number;
}) {
  const { supabase, userId } = await getUserId();

  const progress =
    input.value > 0
      ? Math.min(Math.round((input.current / input.value) * 100), 100)
      : 0;

  const { data, error } = await supabase
    .from("nutrition_goals")
    .insert({
      user_id: userId,
      title: input.title,
      value: input.value,
      unit: input.unit,
      icon: input.icon,
      current: input.current,
      progress,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateNutritionGoal(
  goalId: string,
  input: {
    title: string;
    value: number;
    unit: string;
    icon: string;
    current: number;
  }
) {
  const { supabase, userId } = await getUserId();

  const progress =
    input.value > 0
      ? Math.min(Math.round((input.current / input.value) * 100), 100)
      : 0;

  const { data, error } = await supabase
    .from("nutrition_goals")
    .update({
      title: input.title,
      value: input.value,
      unit: input.unit,
      icon: input.icon,
      current: input.current,
      progress,
    })
    .eq("id", goalId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteNutritionGoal(goalId: string) {
  const { supabase, userId } = await getUserId();

  const { error } = await supabase
    .from("nutrition_goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}




export async function createShoppingItem(input: {
  food: string;
  quantity: string;
  cost: number;
}) {
  const { supabase, userId } = await getUserId();

  const { data, error } = await supabase
    .from("shopping_list")
    .insert({
      user_id: userId,
      food: input.food,
      quantity: input.quantity,
      cost: input.cost,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteShoppingItem(itemId: string) {
  const { supabase, userId } = await getUserId();

  const { error } = await supabase
    .from("shopping_list")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}