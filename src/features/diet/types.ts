export type NutritionGoal = {
  id?: string;
  user_id?: string;
  title: string;
  value: number;
  unit: string;
  icon: string;
  progress: number;
  current: number;
};

export type MealFood = {
  id?: string;
  meal_id?: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Meal = {
  id: string;
  user_id?: string;
  title: string;
  time: string;
  sort_order?: number;
  foods: MealFood[];
};

export type ShoppingItem = {
  id?: string;
  user_id?: string;
  food: string;
  quantity: string;
  cost: number;
};

export type BudgetItem = {
  id?: string;
  user_id?: string;
  name: string;
  amount: number;
  icon: string;
};

export type MealTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type DietData = {
  nutritionGoals: NutritionGoal[];
  mealPlan: Meal[];
  shoppingList: ShoppingItem[];
  budgetItems: BudgetItem[];
};