"use client";

import { useState } from "react";
import {
  Activity,
  Calendar,
  Dumbbell,
  Flame,
  Heart,
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

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
};

type Day = {
  id: string;
  day: string;
  type: string;
  exercises: Exercise[];
};

const initialTopCards = [
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
    description: "6-day split",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Training Days",
    value: "6 days / week",
    icon: Calendar,
    description: "Sunday rest",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Workout Duration",
    value: "75 min",
    icon: Timer,
    description: "Average session length",
    color: "bg-amber-50 text-amber-600",
  },
];

const initialWeeklyVolume = [
  { muscle: "Chest", sets: 16, color: "bg-rose-50 text-rose-600" },
  { muscle: "Back", sets: 18, color: "bg-blue-50 text-blue-600" },
  { muscle: "Legs", sets: 20, color: "bg-emerald-50 text-emerald-600" },
  { muscle: "Shoulders", sets: 14, color: "bg-amber-50 text-amber-600" },
  { muscle: "Biceps", sets: 10, color: "bg-violet-50 text-violet-600" },
  { muscle: "Triceps", sets: 12, color: "bg-orange-50 text-orange-600" },
  { muscle: "Core", sets: 9, color: "bg-teal-50 text-teal-600" },
];

const initialSplit: Day[] = [
  {
    id: "monday",
    day: "Monday",
    type: "Push",
    exercises: [
      { id: "m1", name: "Barbell Bench Press", sets: 4, reps: "6-8", rest: "2-3 min" },
      { id: "m2", name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: "90 sec" },
      { id: "m3", name: "Overhead Press", sets: 3, reps: "8-10", rest: "90 sec" },
      { id: "m4", name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60 sec" },
      { id: "m5", name: "Tricep Pushdowns", sets: 3, reps: "10-12", rest: "60 sec" },
      { id: "m6", name: "Overhead Tricep Extension", sets: 3, reps: "10-12", rest: "60 sec" },
    ],
  },
  {
    id: "tuesday",
    day: "Tuesday",
    type: "Pull",
    exercises: [
      { id: "t1", name: "Deadlift", sets: 3, reps: "5-6", rest: "3 min" },
      { id: "t2", name: "Pull-Ups / Lat Pulldown", sets: 4, reps: "8-10", rest: "90 sec" },
      { id: "t3", name: "Barbell Rows", sets: 3, reps: "8-10", rest: "90 sec" },
      { id: "t4", name: "Face Pulls", sets: 3, reps: "12-15", rest: "60 sec" },
      { id: "t5", name: "Barbell Curls", sets: 3, reps: "10-12", rest: "60 sec" },
      { id: "t6", name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60 sec" },
    ],
  },
  {
    id: "wednesday",
    day: "Wednesday",
    type: "Legs",
    exercises: [
      { id: "w1", name: "Barbell Squat", sets: 4, reps: "6-8", rest: "2-3 min" },
      { id: "w2", name: "Romanian Deadlift", sets: 3, reps: "8-10", rest: "90 sec" },
      { id: "w3", name: "Leg Press", sets: 3, reps: "10-12", rest: "90 sec" },
      { id: "w4", name: "Walking Lunges", sets: 3, reps: "10 each", rest: "60 sec" },
      { id: "w5", name: "Leg Curls", sets: 3, reps: "12-15", rest: "60 sec" },
      { id: "w6", name: "Calf Raises", sets: 4, reps: "12-15", rest: "45 sec" },
    ],
  },
  {
    id: "thursday",
    day: "Thursday",
    type: "Push",
    exercises: [
      { id: "th1", name: "Dumbbell Bench Press", sets: 4, reps: "8-10", rest: "90 sec" },
      { id: "th2", name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
      { id: "th3", name: "Seated Shoulder Press", sets: 3, reps: "8-10", rest: "90 sec" },
      { id: "th4", name: "Front Raises", sets: 3, reps: "12-15", rest: "60 sec" },
      { id: "th5", name: "Skull Crushers", sets: 3, reps: "10-12", rest: "60 sec" },
      { id: "th6", name: "Cable Kickbacks", sets: 3, reps: "12-15", rest: "45 sec" },
    ],
  },
  {
    id: "friday",
    day: "Friday",
    type: "Pull",
    exercises: [
      { id: "f1", name: "Weighted Chin-Ups", sets: 3, reps: "6-8", rest: "2 min" },
      { id: "f2", name: "Seated Cable Rows", sets: 4, reps: "8-10", rest: "90 sec" },
      { id: "f3", name: "Single-Arm Dumbbell Rows", sets: 3, reps: "10-12", rest: "60 sec" },
      { id: "f4", name: "Rear Delt Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
      { id: "f5", name: "Preacher Curls", sets: 3, reps: "10-12", rest: "60 sec" },
      { id: "f6", name: "Concentration Curls", sets: 3, reps: "10-12", rest: "45 sec" },
    ],
  },
  {
    id: "saturday",
    day: "Saturday",
    type: "Legs",
    exercises: [
      { id: "s1", name: "Front Squat", sets: 3, reps: "6-8", rest: "2-3 min" },
      { id: "s2", name: "Bulgarian Split Squats", sets: 3, reps: "8-10 each", rest: "90 sec" },
      { id: "s3", name: "Hip Thrusts", sets: 3, reps: "10-12", rest: "90 sec" },
      { id: "s4", name: "Leg Extensions", sets: 3, reps: "12-15", rest: "60 sec" },
      { id: "s5", name: "Seated Leg Curls", sets: 3, reps: "12-15", rest: "60 sec" },
      { id: "s6", name: "Standing Calf Raises", sets: 4, reps: "12-15", rest: "45 sec" },
    ],
  },
  {
    id: "sunday",
    day: "Sunday",
    type: "Rest",
    exercises: [],
  },
];

const trainingNotes = [
  {
    title: "Recovery",
    description:
      "Allow 48 hours between training the same muscle group. Prioritize sleep and nutrition for optimal recovery.",
    icon: Heart,
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Sleep",
    description:
      "Aim for 7–9 hours of quality sleep each night. Consistent sleep schedule supports hormone balance and muscle repair.",
    icon: Moon,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Progressive Overload",
    description:
      "Increase weight, reps, or sets gradually each week. Track every session to ensure continuous progress.",
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Cardio",
    description:
      "2–3 sessions of 20–30 min LISS or HIIT per week on rest days or after lifting to support fat loss.",
    icon: Flame,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Warm-up",
    description:
      "5–10 minutes of light cardio followed by dynamic stretches and 1–2 light sets before working sets.",
    icon: Zap,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Stretching",
    description:
      "Static stretching after workouts. Focus on hip flexors, hamstrings, chest and shoulders for mobility.",
    icon: Activity,
    color: "bg-teal-50 text-teal-600",
  },
];

const emptyForm = { name: "", sets: "3", reps: "8-10", rest: "90 sec" };

export default function ExercisePlannerPage() {
  const [split, setSplit] = useState<Day[]>(initialSplit);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [activeDayId, setActiveDayId] = useState<string>("");
  const [editExerciseId, setEditExerciseId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

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

  function handleSave() {
    if (!form.name.trim()) return;

    const payload: Exercise = {
      id: mode === "create" ? `ex-${Date.now()}` : (editExerciseId as string),
      name: form.name.trim(),
      sets: Number(form.sets) || 3,
      reps: form.reps.trim() || "8-10",
      rest: form.rest.trim() || "90 sec",
    };

    setSplit((prev) =>
      prev.map((day) => {
        if (day.id !== activeDayId) return day;
        if (mode === "create") {
          return { ...day, exercises: [...day.exercises, payload] };
        }
        return {
          ...day,
          exercises: day.exercises.map((ex) =>
            ex.id === editExerciseId ? payload : ex
          ),
        };
      })
    );

    setDialogOpen(false);
    setForm(emptyForm);
  }

  function handleDelete(dayId: string, exerciseId: string) {
    setSplit((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.filter((ex) => ex.id !== exerciseId),
            }
          : day
      )
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-7 lg:p-8">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Exercise Planner
          </h1>
          <p className="text-sm text-muted-foreground">
            Training split, weekly volume, workout details and recovery notes
          </p>
        </div>

        <section>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {initialTopCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className="rounded-xl border shadow-sm">
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
                      <p className="truncate text-sm font-semibold tracking-tight">
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
          <h2 className="mb-3 text-base font-semibold tracking-tight">
            Weekly Volume
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {initialWeeklyVolume.map((item) => (
              <Card key={item.muscle} className="rounded-xl border shadow-sm">
                <CardContent className="flex flex-col items-center gap-1.5 p-3.5 text-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${item.color}`}
                  >
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xs font-medium">{item.muscle}</p>
                  <p className="text-xl font-semibold tracking-tight leading-none">
                    {item.sets}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    weekly sets
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold tracking-tight">
            Workout Split
          </h2>
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="p-0">
              <Accordion
                type="multiple"
                defaultValue={["monday", "tuesday"]}
                className="w-full"
              >
                {split.map((day) => (
                  <AccordionItem
                    key={day.id}
                    value={day.id}
                    className="border-b last:border-0 px-5"
                  >
                    <AccordionTrigger className="hover:no-underline py-3.5">
                      <div className="flex w-full items-center justify-between pr-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-semibold">
                            {day.day}
                          </span>
                          <Badge
                            variant={
                              day.type === "Rest" ? "outline" : "secondary"
                            }
                            className="rounded-full text-[11px] font-normal"
                          >
                            {day.type}
                          </Badge>
                        </div>
                        {day.exercises.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {day.exercises.length} exercises
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      {day.type === "Rest" ? (
                        <div className="rounded-lg border bg-muted/40 px-4 py-5 text-center">
                          <p className="text-sm text-muted-foreground">
                            Active recovery day. Light walking, mobility work,
                            or complete rest recommended.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="mb-2 grid grid-cols-12 gap-2 px-3 text-[11px] font-medium text-muted-foreground">
                            <span className="col-span-5">Exercise</span>
                            <span className="col-span-2 text-center">Sets</span>
                            <span className="col-span-2 text-center">Reps</span>
                            <span className="col-span-2 text-right">Rest</span>
                            <span className="col-span-1" />
                          </div>

                          {day.exercises.map((ex) => (
                            <div
                              key={ex.id}
                              className="grid grid-cols-12 items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2.5"
                            >
                              <span className="col-span-5 text-sm font-medium truncate">
                                {ex.name}
                              </span>
                              <span className="col-span-2 text-center text-sm text-muted-foreground">
                                {ex.sets}
                              </span>
                              <span className="col-span-2 text-center text-sm text-muted-foreground">
                                {ex.reps}
                              </span>
                              <span className="col-span-2 text-right text-sm text-muted-foreground">
                                {ex.rest}
                              </span>
                              <div className="col-span-1 flex items-center justify-end gap-0.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                  onClick={() => openEdit(day.id, ex)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDelete(day.id, ex.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full gap-1.5 text-xs"
                            onClick={() => openCreate(day.id)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add exercise
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold tracking-tight">
            Training Notes
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trainingNotes.map((note) => {
              const Icon = note.icon;
              return (
                <Card key={note.title} className="rounded-xl border shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-md ${note.color}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <CardTitle className="text-sm font-semibold">
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add Exercise" : "Edit Exercise"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Exercise name</Label>
              <Input
                id="name"
                placeholder="e.g. Barbell Bench Press"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  min={1}
                  value={form.sets}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sets: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  placeholder="8-10"
                  value={form.reps}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reps: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rest">Rest</Label>
                <Input
                  id="rest"
                  placeholder="90 sec"
                  value={form.rest}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, rest: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>
              {mode === "create" ? "Add" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}