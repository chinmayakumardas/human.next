"use client";

import {
  Apple,
  Beef,
  Droplets,
  Egg,
  Flame,
  Leaf,
  Milk,
  ShoppingCart,
  Wheat,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DAILY_TARGETS } from "./constants";
import { getDietData, seedDietData } from "./diet-actions";
import type {
  BudgetItem,
  Meal,
  MealFood,
  MealTotals,
  NutritionGoal,
  ShoppingItem,
} from "./types";

const ICON_MAP = {
  Flame,
  Beef,
  Wheat,
  Droplets,
  Leaf,
  Egg,
  Milk,
  Apple,
  ShoppingCart,
} as const;

function getIcon(name: string) {
  return ICON_MAP[name as keyof typeof ICON_MAP] ?? Flame;
}

function calcMealTotals(foods: MealFood[]): MealTotals {
  return foods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function calcDailyTotals(mealPlan: Meal[]): MealTotals {
  return mealPlan.reduce(
    (acc, meal) => {
      const t = calcMealTotals(meal.foods);
      return {
        calories: acc.calories + t.calories,
        protein: acc.protein + t.protein,
        carbs: acc.carbs + t.carbs,
        fat: acc.fat + t.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export default function DietPlanner() {
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoal[]>([]);
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        let data = await getDietData();

        const isEmpty =
          data.nutritionGoals.every((g) => !g.id) &&
          data.mealPlan.every((m) => !m.user_id);

        if (isEmpty) {
          await seedDietData();
          data = await getDietData();
        }

        setNutritionGoals(data.nutritionGoals);
        setMealPlan(data.mealPlan);
        setShoppingList(data.shoppingList);
        setBudgetItems(data.budgetItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load diet data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const dailyTotals = calcDailyTotals(mealPlan);
  const shoppingTotal = shoppingList.reduce((sum, item) => sum + item.cost, 0);
  const budgetTotal = budgetItems.reduce((sum, item) => sum + item.amount, 0);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground">Loading diet plan…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8 lg:p-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Diet Planner
          </h1>
          <p className="text-muted-foreground">
            Nutrition goals, daily meal plan, shopping list and monthly budget
          </p>
        </div>

        {/* Nutrition Goals */}
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Nutrition Goals</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {nutritionGoals.map((goal) => {
              const Icon = getIcon(goal.icon);
              return (
                <Card key={goal.id ?? goal.title} className="rounded-xl border bg-card shadow-sm">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Badge variant="outline" className="rounded-full text-xs">
                        {goal.progress}%
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{goal.title}</p>
                      <p className="mt-0.5 text-xl font-semibold tracking-tight">
                        {goal.value}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          {goal.unit}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {goal.current} / {goal.value} {goal.unit}
                      </p>
                    </div>
                    <Progress value={goal.progress} className="h-1.5" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Meal Plan + Daily Summary */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">Meal Plan</h2>
            <Card className="rounded-xl border shadow-sm">
              <CardContent className="p-0">
                <Accordion type="multiple" defaultValue={["breakfast", "lunch"]} className="w-full">
                  {mealPlan.map((meal) => {
                    const totals = calcMealTotals(meal.foods);
                    return (
                      <AccordionItem key={meal.id} value={meal.id} className="border-b last:border-0 px-6">
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex w-full items-center justify-between pr-4">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">{meal.title}</span>
                              <Badge variant="secondary" className="rounded-full text-xs font-normal">
                                {meal.time}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {totals.calories} kcal · {totals.protein}g P
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-3">
                            {meal.foods.map((food) => (
                              <div
                                key={food.id ?? food.name}
                                className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3"
                              >
                                <div>
                                  <p className="text-sm font-medium">{food.name}</p>
                                  <p className="text-xs text-muted-foreground">{food.quantity}</p>
                                </div>
                                <div className="flex gap-4 text-xs text-muted-foreground">
                                  <span className="w-14 text-right">{food.calories} kcal</span>
                                  <span className="w-10 text-right">{food.protein}g P</span>
                                  <span className="w-10 text-right">{food.carbs}g C</span>
                                  <span className="w-10 text-right">{food.fat}g F</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold tracking-tight">Daily Summary</h2>
            <Card className="rounded-xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Automatic Totals</CardTitle>
                <CardDescription>Calculated from today&apos;s meal plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Calories</span>
                    <span className="font-semibold">
                      {dailyTotals.calories} / {DAILY_TARGETS.calories} kcal
                    </span>
                  </div>
                  <Progress value={(dailyTotals.calories / DAILY_TARGETS.calories) * 100} className="h-2" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Protein</span>
                    <span className="font-semibold">
                      {dailyTotals.protein} / {DAILY_TARGETS.protein} g
                    </span>
                  </div>
                  <Progress value={(dailyTotals.protein / DAILY_TARGETS.protein) * 100} className="h-2" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Carbs</span>
                    <span className="font-semibold">
                      {dailyTotals.carbs} / {DAILY_TARGETS.carbs} g
                    </span>
                  </div>
                  <Progress value={(dailyTotals.carbs / DAILY_TARGETS.carbs) * 100} className="h-2" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Fat</span>
                    <span className="font-semibold">
                      {dailyTotals.fat} / {DAILY_TARGETS.fat} g
                    </span>
                  </div>
                  <Progress value={(dailyTotals.fat / DAILY_TARGETS.fat) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Shopping List */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Shopping List</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="h-4 w-4" />
              <span>Est. total: ${shoppingTotal.toFixed(2)}</span>
            </div>
          </div>
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Food</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="pr-6 text-right">Estimated Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shoppingList.map((item) => (
                    <TableRow key={item.id ?? item.food}>
                      <TableCell className="pl-6 font-medium">{item.food}</TableCell>
                      <TableCell className="text-muted-foreground">{item.quantity}</TableCell>
                      <TableCell className="pr-6 text-right">${item.cost.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableCell className="pl-6 font-semibold" colSpan={2}>Total</TableCell>
                    <TableCell className="pr-6 text-right font-semibold">
                      ${shoppingTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Monthly Budget */}
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Monthly Budget</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {budgetItems.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <Card key={item.id ?? item.name} className="rounded-xl border bg-card shadow-sm">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.name}</p>
                      <p className="text-lg font-semibold tracking-tight">${item.amount}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <Card className="rounded-xl border border-foreground/10 bg-muted/50 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background">
                  <ShoppingCart className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-lg font-semibold tracking-tight">${budgetTotal}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}