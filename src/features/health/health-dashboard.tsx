"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Apple,
  ArrowRight,
  Calendar,
  Droplets,
  Dumbbell,
  Flame,
  Heart,
  Loader2,
  Ruler,
  Scale,
  Target,
  Timer,
  User,
  Utensils,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  loadHealthProfile,
  updateHealthProfile,
  type HealthProfile,
} from "./health-actions";

function formatDate(date: string | null | undefined) {
  if (!date) return "No deadline";

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getBmiStatus(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy range";
  if (bmi < 30) return "Overweight";

  return "High";
}

export default function HealthDashboard() {
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    age: "",
    height_cm: "",
    current_weight: "",
    target_weight: "",
    body_fat: "",
    blood_pressure: "",
    heart_rate: "",
    daily_calories: "",
    protein_g: "",
    water_l: "",
    food_budget: "",
    workout_duration: "",
    goal_title: "",
    goal_progress: "",
    goal_deadline: "",
    diet_plan_name: "",
    exercise_plan_name: "",
  });

  useEffect(() => {
    async function initialize() {
      try {
        const data = await loadHealthProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load health profile:", error);
      } finally {
        setLoading(false);
      }
    }

    void initialize();
  }, []);

  function openEditProfile() {
    if (!profile) return;

    setForm({
      age: String(profile.age ?? ""),
      height_cm: String(profile.height_cm ?? ""),
      current_weight: String(profile.current_weight ?? ""),
      target_weight: String(profile.target_weight ?? ""),
      body_fat: String(profile.body_fat ?? ""),
      blood_pressure: profile.blood_pressure ?? "",
      heart_rate: String(profile.heart_rate ?? ""),
      daily_calories: String(profile.daily_calories ?? ""),
      protein_g: String(profile.protein_g ?? ""),
      water_l: String(profile.water_l ?? ""),
      food_budget: String(profile.food_budget ?? ""),
      workout_duration: String(profile.workout_duration ?? ""),
      goal_title: profile.goal_title ?? "",
      goal_progress: String(profile.goal_progress ?? ""),
      goal_deadline: profile.goal_deadline ?? "",
      diet_plan_name: profile.diet_plan_name ?? "",
      exercise_plan_name: profile.exercise_plan_name ?? "",
    });

    setEditOpen(true);
  }

  async function handleSaveProfile() {
    if (!profile) return;

    try {
      setSaving(true);

      const updated = await updateHealthProfile(profile.id, {
        age: Number(form.age) || 0,
        height_cm: Number(form.height_cm) || 0,
        current_weight: Number(form.current_weight) || 0,
        target_weight: Number(form.target_weight) || 0,
        body_fat: Number(form.body_fat) || 0,
        blood_pressure: form.blood_pressure,
        heart_rate: Number(form.heart_rate) || 0,
        daily_calories: Number(form.daily_calories) || 0,
        protein_g: Number(form.protein_g) || 0,
        water_l: Number(form.water_l) || 0,
        food_budget: Number(form.food_budget) || 0,
        workout_duration: Number(form.workout_duration) || 0,
        goal_title: form.goal_title,
        goal_progress: Math.min(
          100,
          Math.max(0, Number(form.goal_progress) || 0),
        ),
        goal_deadline: form.goal_deadline,
        diet_plan_name: form.diet_plan_name,
        exercise_plan_name: form.exercise_plan_name,
      });

      setProfile(updated);
      setEditOpen(false);
    } catch (error) {
      console.error("Failed to update health profile:", error);
      alert("Could not save your health profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold">
              Health profile unavailable
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Please sign in or try loading the page again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const kpiData = [
    {
      title: "Age",
      value: String(profile.age),
      description: "Years old",
      icon: User,
    },
    {
      title: "Height",
      value: `${profile.height_cm} cm`,
      description: "Height",
      icon: Ruler,
    },
    {
      title: "Current Weight",
      value: `${profile.current_weight} kg`,
      description: "Current weight",
      icon: Scale,
    },
    {
      title: "Target Weight",
      value: `${profile.target_weight} kg`,
      description: "Target weight",
      icon: Target,
    },
    {
      title: "BMI",
      value: String(profile.bmi),
      description: getBmiStatus(profile.bmi),
      icon: Activity,
    },
    {
      title: "Body Fat",
      value: `${profile.body_fat}%`,
      description: "Body composition",
      icon: Flame,
    },
    {
      title: "Blood Pressure",
      value: profile.blood_pressure,
      description: "Blood pressure",
      icon: Heart,
    },
    {
      title: "Heart Rate",
      value: `${profile.heart_rate} bpm`,
      description: "Resting",
      icon: Activity,
    },
  ];

  const quickStats = [
    {
      title: "Daily Calories",
      value: `${profile.daily_calories.toLocaleString()} kcal`,
      icon: Flame,
      description: "Target intake",
    },
    {
      title: "Protein",
      value: `${profile.protein_g} g`,
      icon: Apple,
      description: "Daily goal",
    },
    {
      title: "Water",
      value: `${profile.water_l} L`,
      icon: Droplets,
      description: "Hydration target",
    },
    {
      title: "Monthly Food Budget",
      value: `$${profile.food_budget}`,
      icon: Utensils,
      description: "Grocery allowance",
    },
    {
      title: "Workout Duration",
      value: `${profile.workout_duration} min`,
      icon: Timer,
      description: "Average session",
    },
  ];

  const workoutDays = profile.exercise_plan_name ? "Custom plan" : "No plan";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              Health Overview
            </h1>

            <p className="text-muted-foreground">
              Your personal health metrics and progress at a glance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={openEditProfile}>
              Edit Profile
            </Button>

            
          </div>
        </div>

        {/* Health metrics */}
        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {kpiData.map((kpi) => {
              const Icon = kpi.icon;

              return (
                <Card
                  key={kpi.title}
                  className="rounded-xl border bg-card shadow-sm"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </CardTitle>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="text-2xl font-semibold tracking-tight">
                      {kpi.value}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {kpi.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Goal and plans */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Current Goal
                </CardTitle>

                <Badge variant="secondary" className="rounded-full">
                  Active
                </Badge>
              </div>

              <CardDescription>Primary focus for this period</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">{profile.goal_title}</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.current_weight} kg → {profile.target_weight} kg
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>

                  <span className="font-medium">{profile.goal_progress}%</span>
                </div>

                <Progress
                  value={Math.min(100, Math.max(0, profile.goal_progress))}
                  className="h-2"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />

                <span>Deadline: {formatDate(profile.goal_deadline)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <Card className="rounded-xl border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Utensils className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div>
                    <CardTitle className="text-base font-semibold">
                      Diet Plan
                    </CardTitle>

                    <CardDescription>{profile.diet_plan_name}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Calories</span>

                  <span className="font-medium">
                    {profile.daily_calories.toLocaleString()} kcal
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Protein</span>

                  <span className="font-medium">{profile.protein_g} g</span>
                </div>
              </CardContent>

              <CardFooter>
               <Link href="/muscle/diet" className="block">
  <Button
    variant="ghost"
    size="sm"
    className="w-full justify-between"
  >
    View plan
  </Button>
</Link>
              </CardFooter>
            </Card>

            <Card className="rounded-xl border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Dumbbell className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div>
                    <CardTitle className="text-base font-semibold">
                      Exercise Plan
                    </CardTitle>

                    <CardDescription>
                      {profile.exercise_plan_name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>

                  <span className="font-medium">{workoutDays}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>

                  <span className="font-medium">
                    {profile.workout_duration} min
                  </span>
                </div>
              </CardContent>

              <CardFooter>
               <Link href="/muscle/diet" className="block">
  <Button
    variant="ghost"
    size="sm"
    className="w-full justify-between"
  >
    View plan
  </Button>
</Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Quick stats */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Quick Stats</h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {quickStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  key={stat.title}
                  className="rounded-xl border bg-card shadow-sm"
                >
                  <CardContent className="flex flex-col items-start gap-3 p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        {stat.title}
                      </p>

                      <p className="mt-0.5 text-lg font-semibold">
                        {stat.value}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Navigation */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Quick Navigation</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/muscle/diet" className="group">
              <Card className="rounded-xl border shadow-sm transition-all hover:shadow-md">
                <CardContent className="flex items-center gap-5 p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted">
                    <Utensils className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">Diet Planner</h3>

                    <p className="text-sm text-muted-foreground">
                      Meal plans, macros, shopping list and budget
                    </p>
                  </div>

                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/muscle/exercise" className="group">
              <Card className="rounded-xl border shadow-sm transition-all hover:shadow-md">
                <CardContent className="flex items-center gap-5 p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted">
                    <Dumbbell className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">Exercise Planner</h3>

                    <p className="text-sm text-muted-foreground">
                      Workout split and training details
                    </p>
                  </div>

                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
<DialogContent className="max-h-[90vh] w-[95vw] max-w-6xl overflow-y-auto">        <DialogHeader>
            <DialogTitle>Edit Health Profile</DialogTitle>

            <DialogDescription>
              Update your body metrics, nutrition targets, goal, budget, and
              workout preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-3">
            <div>
              <h3 className="mb-3 font-semibold">Body Metrics</h3>

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={form.age}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        age: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={form.height_cm}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        height_cm: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Current Weight (kg)</Label>
                  <Input
                    type="number"
                    value={form.current_weight}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        current_weight: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Weight (kg)</Label>
                  <Input
                    type="number"
                    value={form.target_weight}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        target_weight: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Body Fat (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form.body_fat}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        body_fat: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Blood Pressure</Label>
                  <Input
                    placeholder="118/76"
                    value={form.blood_pressure}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        blood_pressure: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Heart Rate</Label>
                  <Input
                    type="number"
                    value={form.heart_rate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        heart_rate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 font-semibold">Nutrition & Budget</h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Daily Calories</Label>
                  <Input
                    type="number"
                    value={form.daily_calories}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        daily_calories: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Protein (g)</Label>
                  <Input
                    type="number"
                    value={form.protein_g}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        protein_g: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Water (L)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form.water_l}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        water_l: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Monthly Food Budget</Label>
                  <Input
                    type="number"
                    value={form.food_budget}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        food_budget: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Workout Duration (min)</Label>
                  <Input
                    type="number"
                    value={form.workout_duration}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        workout_duration: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Diet Plan Name</Label>
                  <Input
                    value={form.diet_plan_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        diet_plan_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 font-semibold">Goal & Exercise Plan</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Goal Title</Label>
                  <Input
                    value={form.goal_title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        goal_title: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Goal Progress (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={form.goal_progress}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        goal_progress: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Goal Deadline</Label>
                  <Input
                    type="date"
                    value={form.goal_deadline}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        goal_deadline: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Exercise Plan Name</Label>
                  <Input
                    value={form.exercise_plan_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        exercise_plan_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
