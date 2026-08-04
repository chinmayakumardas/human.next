


import { getDietData } from "./diet-actions";
import { NutritionGoals } from "./components/nutrition-goals";
import { MealPlan } from "./components/meal-plan";
import { DailySummary } from "./components/daily-summary";
import { ShoppingList } from "./components/shopping-list";
import { MonthlyBudget } from "./components/monthly-budget";

// Server Component — fetches once per request, passes data down to
// client components that own their own mutations via server actions.
export default async function DietPlanner() {
  const {
    nutritionGoals,
    mealPlan,
    shoppingList,
    budgetItems,
  } = await getDietData();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Diet Planner
        </h1>

        <p className="text-sm text-muted-foreground">
          Track goals, plan meals, and manage your food budget.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <NutritionGoals goals={nutritionGoals} />
          <MealPlan meals={mealPlan} />
        </div>

        <div className="space-y-6">
          <DailySummary
            meals={mealPlan}
            goals={nutritionGoals}
          />

          <ShoppingList items={shoppingList} />

          <MonthlyBudget items={budgetItems} />
        </div>
      </div>
    </div>
  );
}