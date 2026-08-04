"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Meal, NutritionGoal } from "../types";

type Props = { meals: Meal[]; goals: NutritionGoal[] };

export function DailySummary({ meals, goals }: Props) {
  const consumed = meals
    .flatMap((m) => m.foods)
    .reduce(
      (acc, f) => ({
        calories: acc.calories + f.calories,
        protein: acc.protein + f.protein,
        carbs: acc.carbs + f.carbs,
        fat: acc.fat + f.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

  const rows = [
    { key: "calories", label: "Calories", unit: "kcal" },
    { key: "protein", label: "Protein", unit: "g" },
    { key: "carbs", label: "Carbs", unit: "g" },
    { key: "fat", label: "Fat", unit: "g" },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => {
          const goal = goals.find(
            (g) => g.title.toLowerCase() === row.label.toLowerCase()
          );
          const target = goal?.value ?? 0;
          const value = consumed[row.key];
          const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;

          return (
            <div key={row.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{row.label}</span>
                <span className="text-muted-foreground">
                  {value} / {target || "—"} {row.unit}
                </span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}