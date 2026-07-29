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

const nutritionGoals = [
  {
    title: "Calories",
    value: "2,200",
    unit: "kcal",
    icon: Flame,
    progress: 78,
    current: "1,716",
  },
  {
    title: "Protein",
    value: "160",
    unit: "g",
    icon: Beef,
    progress: 85,
    current: "136",
  },
  {
    title: "Carbs",
    value: "220",
    unit: "g",
    icon: Wheat,
    progress: 72,
    current: "158",
  },
  {
    title: "Fat",
    value: "70",
    unit: "g",
    icon: Droplets,
    progress: 65,
    current: "46",
  },
  {
    title: "Fiber",
    value: "30",
    unit: "g",
    icon: Leaf,
    progress: 60,
    current: "18",
  },
  {
    title: "Water",
    value: "3.5",
    unit: "L",
    icon: Droplets,
    progress: 70,
    current: "2.5",
  },
];

const mealPlan = [
  {
    id: "breakfast",
    title: "Breakfast",
    time: "7:30 AM",
    foods: [
      { name: "Oatmeal with Berries", quantity: "80g dry", calories: 300, protein: 10, carbs: 54, fat: 6 },
      { name: "Greek Yogurt", quantity: "150g", calories: 100, protein: 17, carbs: 6, fat: 0 },
      { name: "Banana", quantity: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0 },
      { name: "Almond Butter", quantity: "15g", calories: 90, protein: 3, carbs: 3, fat: 8 },
    ],
  },
  {
    id: "lunch",
    title: "Lunch",
    time: "12:30 PM",
    foods: [
      { name: "Grilled Chicken Breast", quantity: "150g", calories: 248, protein: 46, carbs: 0, fat: 5 },
      { name: "Brown Rice", quantity: "100g cooked", calories: 112, protein: 3, carbs: 24, fat: 1 },
      { name: "Broccoli", quantity: "150g", calories: 51, protein: 4, carbs: 10, fat: 1 },
      { name: "Olive Oil", quantity: "10ml", calories: 88, protein: 0, carbs: 0, fat: 10 },
    ],
  },
  {
    id: "dinner",
    title: "Dinner",
    time: "7:00 PM",
    foods: [
      { name: "Salmon Fillet", quantity: "140g", calories: 280, protein: 34, carbs: 0, fat: 16 },
      { name: "Sweet Potato", quantity: "200g", calories: 172, protein: 3, carbs: 40, fat: 0 },
      { name: "Mixed Salad", quantity: "100g", calories: 25, protein: 2, carbs: 4, fat: 0 },
      { name: "Avocado", quantity: "50g", calories: 80, protein: 1, carbs: 4, fat: 7 },
    ],
  },
  {
    id: "snacks",
    title: "Snacks",
    time: "Throughout day",
    foods: [
      { name: "Protein Shake", quantity: "1 scoop", calories: 120, protein: 24, carbs: 3, fat: 1 },
      { name: "Apple", quantity: "1 medium", calories: 95, protein: 0, carbs: 25, fat: 0 },
      { name: "Handful of Almonds", quantity: "20g", calories: 120, protein: 4, carbs: 4, fat: 10 },
      { name: "Cottage Cheese", quantity: "100g", calories: 98, protein: 11, carbs: 3, fat: 4 },
    ],
  },
];

const shoppingList = [
  { food: "Chicken Breast", quantity: "1.5 kg", cost: 18.5 },
  { food: "Salmon Fillet", quantity: "600 g", cost: 22.0 },
  { food: "Brown Rice", quantity: "2 kg", cost: 6.5 },
  { food: "Oats", quantity: "1 kg", cost: 4.0 },
  { food: "Greek Yogurt", quantity: "1 kg", cost: 7.5 },
  { food: "Eggs", quantity: "18 pcs", cost: 6.0 },
  { food: "Broccoli", quantity: "1 kg", cost: 4.5 },
  { food: "Sweet Potatoes", quantity: "1.5 kg", cost: 5.0 },
  { food: "Bananas", quantity: "1 kg", cost: 2.5 },
  { food: "Almonds", quantity: "500 g", cost: 12.0 },
  { food: "Protein Powder", quantity: "1 kg", cost: 35.0 },
  { food: "Olive Oil", quantity: "500 ml", cost: 9.0 },
];

const budgetItems = [
  { name: "Chicken", amount: 55, icon: Beef },
  { name: "Rice", amount: 12, icon: Wheat },
  { name: "Eggs", amount: 18, icon: Egg },
  { name: "Milk & Yogurt", amount: 28, icon: Milk },
  { name: "Vegetables", amount: 45, icon: Leaf },
  { name: "Fruits", amount: 32, icon: Apple },
  { name: "Protein Powder", amount: 35, icon: Flame },
];

function calcMealTotals(foods: (typeof mealPlan)[0]["foods"]) {
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

const dailyTotals = mealPlan.reduce(
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

const shoppingTotal = shoppingList.reduce((sum, item) => sum + item.cost, 0);
const budgetTotal = budgetItems.reduce((sum, item) => sum + item.amount, 0);

export default function DietPlannerPage() {
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

        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">
            Nutrition Goals
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {nutritionGoals.map((goal) => {
              const Icon = goal.icon;
              return (
                <Card
                  key={goal.title}
                  className="rounded-xl border bg-card shadow-sm"
                >
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
                      <p className="text-xs text-muted-foreground">
                        {goal.title}
                      </p>
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

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              Meal Plan
            </h2>
            <Card className="rounded-xl border shadow-sm">
              <CardContent className="p-0">
                <Accordion type="multiple" defaultValue={["breakfast", "lunch"]} className="w-full">
                  {mealPlan.map((meal) => {
                    const totals = calcMealTotals(meal.foods);
                    return (
                      <AccordionItem
                        key={meal.id}
                        value={meal.id}
                        className="border-b last:border-0 px-6"
                      >
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
                                key={food.name}
                                className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3"
                              >
                                <div>
                                  <p className="text-sm font-medium">
                                    {food.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {food.quantity}
                                  </p>
                                </div>
                                <div className="flex gap-4 text-xs text-muted-foreground">
                                  <span className="w-14 text-right">
                                    {food.calories} kcal
                                  </span>
                                  <span className="w-10 text-right">
                                    {food.protein}g P
                                  </span>
                                  <span className="w-10 text-right">
                                    {food.carbs}g C
                                  </span>
                                  <span className="w-10 text-right">
                                    {food.fat}g F
                                  </span>
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
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              Daily Summary
            </h2>
            <Card className="rounded-xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Automatic Totals
                </CardTitle>
                <CardDescription>
                  Calculated from today&apos;s meal plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Calories</span>
                    <span className="font-semibold">
                      {dailyTotals.calories} / 2,200 kcal
                    </span>
                  </div>
                  <Progress
                    value={(dailyTotals.calories / 2200) * 100}
                    className="h-2"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Protein</span>
                    <span className="font-semibold">
                      {dailyTotals.protein} / 160 g
                    </span>
                  </div>
                  <Progress
                    value={(dailyTotals.protein / 160) * 100}
                    className="h-2"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Carbs</span>
                    <span className="font-semibold">
                      {dailyTotals.carbs} / 220 g
                    </span>
                  </div>
                  <Progress
                    value={(dailyTotals.carbs / 220) * 100}
                    className="h-2"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Fat</span>
                    <span className="font-semibold">
                      {dailyTotals.fat} / 70 g
                    </span>
                  </div>
                  <Progress
                    value={(dailyTotals.fat / 70) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Shopping List
            </h2>
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
                    <TableHead className="pr-6 text-right">
                      Estimated Cost
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shoppingList.map((item) => (
                    <TableRow key={item.food}>
                      <TableCell className="pl-6 font-medium">
                        {item.food}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        ${item.cost.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableCell className="pl-6 font-semibold" colSpan={2}>
                      Total
                    </TableCell>
                    <TableCell className="pr-6 text-right font-semibold">
                      ${shoppingTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">
            Monthly Budget
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {budgetItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.name}
                  className="rounded-xl border bg-card shadow-sm"
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {item.name}
                      </p>
                      <p className="text-lg font-semibold tracking-tight">
                        ${item.amount}
                      </p>
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
                  <p className="text-lg font-semibold tracking-tight">
                    ${budgetTotal}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}