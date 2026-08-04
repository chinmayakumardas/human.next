




"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Calendar,
  Dumbbell,
  Flame,
  Heart,
  Loader2,
  Moon,
  Pencil,
  Plus,
  Target,
  Timer,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Exercise, WorkoutDay } from "./types";

import {
  createExercise,
  deleteExercise,
  loadWorkoutData,
  seedDefaultSplit,
  updateExercise,
} from "./exercise-actions";

const topCards = [
  {
    title: "Goal",
    value: "Lose Fat & Gain Muscle",
    icon: Target,
    description: "Primary training objective",
    color: "bg-violet-50 text-violet-600",
  },
  {
    title: "Routine",
    value: "Push Pull Legs",
    icon: Dumbbell,
    description: "Training split",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Training Days",
    value: "Workout schedule",
    icon: Calendar,
    description: "Loaded from your plan",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Workout Duration",
    value: "Custom",
    icon: Timer,
    description: "Based on your exercises",
    color: "bg-amber-50 text-amber-600",
  },
];

const trainingNotes = [
  {
    title: "Recovery",
    description:
      "Allow adequate recovery between training the same muscle groups. Prioritize sleep and nutrition.",
    icon: Heart,
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Sleep",
    description:
      "Aim for consistent, high-quality sleep to support recovery and muscle repair.",
    icon: Moon,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Progressive Overload",
    description:
      "Increase weight, repetitions, or sets gradually while maintaining good form.",
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Cardio",
    description:
      "Add cardio according to your goals and recovery capacity.",
    icon: Flame,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Warm-up",
    description:
      "Perform light cardio, dynamic mobility, and warm-up sets before working sets.",
    icon: Zap,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Stretching",
    description:
      "Use mobility and stretching work to maintain a comfortable range of motion.",
    icon: Activity,
    color: "bg-teal-50 text-teal-600",
  },
];

const emptyForm = {
  name: "",
  sets: "3",
  reps: "8-10",
  rest: "90 sec",
};

export default function ExercisePlanner() {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [activeDayId, setActiveDayId] = useState("");
  const [editExerciseId, setEditExerciseId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);

  async function fetchWorkoutData() {
    const data = await loadWorkoutData();
    setWorkoutDays(data);
  }

  useEffect(() => {
    async function initialize() {
      try {
        await seedDefaultSplit();
        await fetchWorkoutData();
      } catch (error) {
        console.error("Failed to load workout data:", error);
      } finally {
        setLoading(false);
      }
    }

    void initialize();
  }, []);

  function openCreate(dayId: string) {
    setMode("create");
    setActiveDayId(dayId);
    setEditExerciseId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(dayId: string, exercise: Exercise) {
    setMode("edit");
    setActiveDayId(dayId);
    setEditExerciseId(exercise.id);

    setForm({
      name: exercise.name,
      sets: String(exercise.sets),
      reps: exercise.reps,
      rest: exercise.rest,
    });

    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;

    setSaving(true);

    const input = {
      name: form.name.trim(),
      sets: Math.max(1, Number(form.sets) || 1),
      reps: form.reps.trim() || "8-10",
      rest: form.rest.trim() || "90 sec",
    };

    try {
      if (mode === "create") {
        await createExercise(activeDayId, input);
      } else if (editExerciseId) {
        await updateExercise(editExerciseId, input);
      }

      await fetchWorkoutData();

      setDialogOpen(false);
      setEditExerciseId(null);
      setForm(emptyForm);
    } catch (error) {
      console.error("Failed to save exercise:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(exerciseId: string) {
    try {
      await deleteExercise(exerciseId);
      await fetchWorkoutData();
    } catch (error) {
      console.error("Failed to delete exercise:", error);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-7 lg:p-8">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Exercise Planner
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage your workout split and exercises
          </p>
        </div>

        <section>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {topCards.map((card) => {
              const Icon = card.icon;

              return (
                <Card
                  key={card.title}
                  className="rounded-xl border shadow-sm"
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${card.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground">
                        {card.title}
                      </p>

                      <p className="truncate text-sm font-semibold">
                        {card.value}
                      </p>

                      <p className="text-[11px] text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">
            Workout Split
          </h2>

          <Card className="rounded-xl border shadow-sm">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex min-h-64 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : workoutDays.length === 0 ? (
                <div className="flex min-h-64 items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No workout days available.
                  </p>
                </div>
              ) : (
                <Accordion className="w-full">
                  {workoutDays.map((day) => {
                    const exercises = day.exercises ?? [];

                    return (
                      <AccordionItem
                        key={day.id}
                        value={day.id}
                        className="border-b px-5 last:border-0"
                      >
                        <AccordionTrigger className="py-3.5 hover:no-underline">
                          <div className="flex w-full items-center justify-between pr-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm font-semibold">
                                {day.day_name}
                              </span>

                              <Badge
                                variant={
                                  day.day_type === "Rest"
                                    ? "outline"
                                    : "secondary"
                                }
                                className="rounded-full text-[11px] font-normal"
                              >
                                {day.day_type}
                              </Badge>
                            </div>

                            <span className="text-xs text-muted-foreground">
                              {exercises.length} exercises
                            </span>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="pb-4">
                          {day.day_type === "Rest" ? (
                            <div className="rounded-lg border bg-muted/40 px-4 py-5 text-center">
                              <p className="text-sm text-muted-foreground">
                                Rest and recovery day.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="grid grid-cols-12 gap-2 px-3 text-[11px] font-medium text-muted-foreground">
                                <span className="col-span-5">
                                  Exercise
                                </span>

                                <span className="col-span-2 text-center">
                                  Sets
                                </span>

                                <span className="col-span-2 text-center">
                                  Reps
                                </span>

                                <span className="col-span-2 text-right">
                                  Rest
                                </span>

                                <span className="col-span-1" />
                              </div>

                              {exercises.length === 0 && (
                                <div className="rounded-lg border border-dashed px-4 py-5 text-center">
                                  <p className="text-sm text-muted-foreground">
                                    No exercises added.
                                  </p>
                                </div>
                              )}

                              {exercises.map((exercise) => (
                                <div
                                  key={exercise.id}
                                  className="grid grid-cols-12 items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2.5"
                                >
                                  <span className="col-span-5 truncate text-sm font-medium">
                                    {exercise.name}
                                  </span>

                                  <span className="col-span-2 text-center text-sm text-muted-foreground">
                                    {exercise.sets}
                                  </span>

                                  <span className="col-span-2 text-center text-sm text-muted-foreground">
                                    {exercise.reps}
                                  </span>

                                  <span className="col-span-2 text-right text-sm text-muted-foreground">
                                    {exercise.rest}
                                  </span>

                                  <div className="col-span-1 flex justify-end">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        openEdit(
                                          day.id,
                                          exercise
                                        )
                                      }
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>

                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 hover:text-destructive"
                                      onClick={() =>
                                        void handleDelete(
                                          exercise.id
                                        )
                                      }
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2 w-full gap-1.5"
                                onClick={() =>
                                  openCreate(day.id)
                                }
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Exercise
                              </Button>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold">
            Training Notes
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trainingNotes.map((note) => {
              const Icon = note.icon;

              return (
                <Card
                  key={note.title}
                  className="rounded-xl border shadow-sm"
                >
                  <CardHeader className="px-4 pb-2 pt-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-md ${note.color}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      <CardTitle className="text-sm">
                        {note.title}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 pb-4">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {note.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? "Add Exercise"
                : "Edit Exercise"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="exercise-name">
                Exercise name
              </Label>

              <Input
                id="exercise-name"
                value={form.name}
                placeholder="Exercise name"
                disabled={saving}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="exercise-sets">
                  Sets
                </Label>

                <Input
                  id="exercise-sets"
                  type="number"
                  min={1}
                  value={form.sets}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sets: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="exercise-reps">
                  Reps
                </Label>

                <Input
                  id="exercise-reps"
                  value={form.reps}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      reps: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="exercise-rest">
                  Rest
                </Label>

                <Input
                  id="exercise-rest"
                  value={form.rest}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      rest: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={
                saving ||
                !form.name.trim()
              }
              onClick={() => void handleSave()}
            >
              {saving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {mode === "create"
                ? "Add"
                : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}





