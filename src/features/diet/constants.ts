import type { NutritionGoal, Meal, ShoppingItem, BudgetItem } from "./types";

// Used only as fallback/demo data before a user has real rows in Supabase.
// Safe to delete once the DB is seeded per-user.

export const defaultNutritionGoals: NutritionGoal[] = [
  { title: "Calories", value: 2200, unit: "kcal", icon: "🔥", current: 0, progress: 0 },
  { title: "Protein", value: 150, unit: "g", icon: "🥩", current: 0, progress: 0 },
  { title: "Carbs", value: 250, unit: "g", icon: "🍞", current: 0, progress: 0 },
  { title: "Fat", value: 70, unit: "g", icon: "🥑", current: 0, progress: 0 },
];

export const defaultMealPlan: Meal[] = [
  { id: "temp-1", title: "Breakfast", time: "8:00 AM", sort_order: 0, foods: [] },
  { id: "temp-2", title: "Lunch", time: "01:30 PM", sort_order: 1, foods: [] },
  { id: "temp-3", title: "Dinner", time: "9:00 PM", sort_order: 2, foods: [] },
];

export const defaultShoppingList: ShoppingItem[] = [];

export const defaultBudgetItems: BudgetItem[] = [];