"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Loader2, Utensils } from "lucide-react";
import {
  createMeal,
  deleteMeal,
  addMealFood,
  deleteMealFood,
} from "../diet-actions";
import type { Meal, MealFood } from "../types";

type Props = { meals: Meal[] };

function mealTotals(foods: MealFood[]) {
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

const emptyMeal = { title: "", time: "" };
const emptyFood = { name: "", quantity: "", calories: "", protein: "", carbs: "", fat: "" };

export function MealPlan({ meals }: Props) {
  const [mealOpen, setMealOpen] = useState(false);
  const [mealForm, setMealForm] = useState(emptyMeal);
  const [foodDialogFor, setFoodDialogFor] = useState<string | null>(null);
  const [foodForm, setFoodForm] = useState(emptyFood);
  const [isPending, startTransition] = useTransition();

  function handleCreateMeal() {
    startTransition(async () => {
      await createMeal({
        title: mealForm.title,
        time: mealForm.time,
        sort_order: meals.length,
      });
      setMealForm(emptyMeal);
      setMealOpen(false);
    });
  }

  function handleDeleteMeal(id: string) {
    startTransition(async () => {
      await deleteMeal(id);
    });
  }

  function handleAddFood() {
    if (!foodDialogFor) return;
    startTransition(async () => {
      await addMealFood(foodDialogFor, {
        name: foodForm.name,
        quantity: foodForm.quantity,
        calories: Number(foodForm.calories) || 0,
        protein: Number(foodForm.protein) || 0,
        carbs: Number(foodForm.carbs) || 0,
        fat: Number(foodForm.fat) || 0,
      });
      setFoodForm(emptyFood);
      setFoodDialogFor(null);
    });
  }

  function handleDeleteFood(id?: string) {
    if (!id) return;
    startTransition(async () => {
      await deleteMealFood(id);
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meal Plan</CardTitle>
        <Dialog open={mealOpen} onOpenChange={setMealOpen}>
         <DialogTrigger
  render={
    <Button size="sm">
      <Plus className="mr-1 h-4 w-4" />
      Add Meal
    </Button>
  }
/>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Meal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="meal-title">Title</Label>
                <Input
                  id="meal-title"
                  value={mealForm.title}
                  onChange={(e) => setMealForm({ ...mealForm, title: e.target.value })}
                  placeholder="e.g. Breakfast"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meal-time">Time</Label>
                <Input
                  id="meal-time"
                  value={mealForm.time}
                  onChange={(e) => setMealForm({ ...mealForm, time: e.target.value })}
                  placeholder="7:30 AM"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateMeal}
                disabled={isPending || !mealForm.title}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-4">
        {meals.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No meals planned yet. Add your first meal.
          </p>
        )}

        {meals.map((meal) => {
          const totals = mealTotals(meal.foods);
          return (
            <div key={meal.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{meal.title}</span>
                  <Badge variant="secondary">{meal.time}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Dialog
                    open={foodDialogFor === meal.id}
                    onOpenChange={(v) => setFoodDialogFor(v ? meal.id : null)}
                  >
                 <DialogTrigger
  render={
    <Button size="sm" variant="outline">
      <Plus className="mr-1 h-3.5 w-3.5" />
      Food
    </Button>
  }
/>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Food to {meal.title}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                              value={foodForm.name}
                              onChange={(e) =>
                                setFoodForm({ ...foodForm, name: e.target.value })
                              }
                              placeholder="Oatmeal"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Quantity</Label>
                            <Input
                              value={foodForm.quantity}
                              onChange={(e) =>
                                setFoodForm({ ...foodForm, quantity: e.target.value })
                              }
                              placeholder="1 cup"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="grid gap-2">
                            <Label>Cal</Label>
                            <Input
                              type="number"
                              value={foodForm.calories}
                              onChange={(e) =>
                                setFoodForm({ ...foodForm, calories: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Protein</Label>
                            <Input
                              type="number"
                              value={foodForm.protein}
                              onChange={(e) =>
                                setFoodForm({ ...foodForm, protein: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Carbs</Label>
                            <Input
                              type="number"
                              value={foodForm.carbs}
                              onChange={(e) =>
                                setFoodForm({ ...foodForm, carbs: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Fat</Label>
                            <Input
                              type="number"
                              value={foodForm.fat}
                              onChange={(e) =>
                                setFoodForm({ ...foodForm, fat: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={handleAddFood}
                          disabled={isPending || !foodForm.name}
                        >
                          {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Add
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleDeleteMeal(meal.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {meal.foods.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <ul className="space-y-2">
                    {meal.foods.map((food) => (
                      <li
                        key={food.id}
                        className="flex items-center justify-between text-sm group"
                      >
                        <span>
                          {food.name}{" "}
                          <span className="text-muted-foreground">
                            ({food.quantity})
                          </span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">
                            {food.calories} kcal · P{food.protein} C{food.carbs} F{food.fat}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => handleDeleteFood(food.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total: {totals.calories} kcal · P{totals.protein}g C{totals.carbs}g F{totals.fat}g
                  </p>
                </>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}