"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  Heart,
  Link2,
  Minus,
  Pencil,
  Plus,
  Scale,
  Target,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GoalStatus = "active" | "completed" | "paused" | "overdue";
type Priority = "high" | "medium" | "low";

type Milestone = {
  id: string;
  title: string;
  done: boolean;
};

type Goal = {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  targetDate: string;
  status: GoalStatus;
  priority: Priority;
  progress: number;
  relatedPlans: string[];
  milestones: Milestone[];
  color: string;
  icon: string;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Scale,
  Flame,
  Heart,
  TrendingUp,
  Zap,
};

const statusStyles: Record<string, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  paused: {
    label: "Paused",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  overdue: {
    label: "Overdue",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const priorityConfig: Record<
  Priority,
  {
    label: string;
    className: string;
    order: number;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  high: {
    label: "High",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    order: 0,
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    order: 1,
    icon: Minus,
  },
  low: {
    label: "Low",
    className: "bg-slate-50 text-slate-600 border-slate-200",
    order: 2,
    icon: ArrowDown,
  },
};

const colorOptions = [
  "bg-violet-50 text-violet-600",
  "bg-blue-50 text-blue-600",
  "bg-emerald-50 text-emerald-600",
  "bg-amber-50 text-amber-600",
  "bg-rose-50 text-rose-600",
  "bg-teal-50 text-teal-600",
];

const emptyGoalForm = {
  title: "",
  current: "0",
  target: "100",
  unit: "kg",
  targetDate: "",
  status: "active" as GoalStatus,
  priority: "medium" as Priority,
  relatedPlans: "",
  color: "bg-violet-50 text-violet-600",
  icon: "Target",
};

const emptyMilestoneForm = { title: "" };

const initialGoals: Goal[] = [
  {
    id: "g1",
    title: "Lose Weight",
    current: 82,
    target: 72,
    unit: "kg",
    targetDate: "2026-12-31",
    status: "active",
    priority: "high",
    progress: 50,
    relatedPlans: ["Weight Loss Diet", "Push Pull Legs"],
    milestones: [
      { id: "m1", title: "Reach 80 kg", done: true },
      { id: "m2", title: "Reach 76 kg", done: true },
      { id: "m3", title: "Reach 74 kg", done: false },
      { id: "m4", title: "Reach 72 kg", done: false },
    ],
    color: "bg-violet-50 text-violet-600",
    icon: "Scale",
  },
  {
    id: "g2",
    title: "Build Muscle",
    current: 4,
    target: 8,
    unit: "kg lean mass",
    targetDate: "2027-03-15",
    status: "active",
    priority: "high",
    progress: 50,
    relatedPlans: ["Push Pull Legs", "High Protein Diet"],
    milestones: [
      { id: "m1", title: "+2 kg lean mass", done: true },
      { id: "m2", title: "+4 kg lean mass", done: true },
      { id: "m3", title: "+6 kg lean mass", done: false },
      { id: "m4", title: "+8 kg lean mass", done: false },
    ],
    color: "bg-blue-50 text-blue-600",
    icon: "TrendingUp",
  },
  {
    id: "g3",
    title: "Run 10K",
    current: 6.5,
    target: 10,
    unit: "km",
    targetDate: "2026-09-30",
    status: "active",
    priority: "medium",
    progress: 67,
    relatedPlans: ["Cardio Plan"],
    milestones: [
      { id: "m1", title: "5K under 30 min", done: true },
      { id: "m2", title: "7K continuous", done: true },
      { id: "m3", title: "10K race day", done: false },
    ],
    color: "bg-emerald-50 text-emerald-600",
    icon: "Flame",
  },
  {
    id: "g4",
    title: "Body Fat %",
    current: 18.4,
    target: 12,
    unit: "%",
    targetDate: "2026-12-31",
    status: "paused",
    priority: "medium",
    progress: 33,
    relatedPlans: ["Weight Loss Diet", "HIIT Sessions"],
    milestones: [
      { id: "m1", title: "Under 17%", done: true },
      { id: "m2", title: "Under 15%", done: false },
      { id: "m3", title: "Under 12%", done: false },
    ],
    color: "bg-amber-50 text-amber-600",
    icon: "Target",
  },
  {
    id: "g5",
    title: "Resting Heart Rate",
    current: 62,
    target: 55,
    unit: "bpm",
    targetDate: "2026-08-01",
    status: "completed",
    priority: "low",
    progress: 100,
    relatedPlans: ["Cardio Plan", "Sleep Optimization"],
    milestones: [
      { id: "m1", title: "Under 65 bpm", done: true },
      { id: "m2", title: "Under 60 bpm", done: true },
      { id: "m3", title: "Under 55 bpm", done: true },
    ],
    color: "bg-rose-50 text-rose-600",
    icon: "Heart",
  },
  {
    id: "g6",
    title: "Daily Steps",
    current: 8500,
    target: 12000,
    unit: "steps",
    targetDate: "2026-07-31",
    status: "overdue",
    priority: "low",
    progress: 67,
    relatedPlans: ["Walking Habit"],
    milestones: [
      { id: "m1", title: "7K daily avg", done: true },
      { id: "m2", title: "10K daily avg", done: true },
      { id: "m3", title: "12K daily avg", done: false },
    ],
    color: "bg-teal-50 text-teal-600",
    icon: "Zap",
  },
];

function syncProgress(milestones: Milestone[]) {
  if (milestones.length === 0) return 0;
  return Math.round(
    (milestones.filter((m) => m.done).length / milestones.length) * 100
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [goalMode, setGoalMode] = useState<"create" | "edit">("create");
  const [editGoalId, setEditGoalId] = useState<string | null>(null);
  const [goalForm, setGoalForm] = useState(emptyGoalForm);

  const [msDialogOpen, setMsDialogOpen] = useState(false);
  const [msMode, setMsMode] = useState<"create" | "edit">("create");
  const [activeGoalId, setActiveGoalId] = useState("");
  const [editMsId, setEditMsId] = useState<string | null>(null);
  const [msForm, setMsForm] = useState(emptyMilestoneForm);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "goal" | "milestone";
    goalId?: string;
    id: string;
    label: string;
  } | null>(null);

  const sortedGoals = useMemo(
    () =>
      [...goals].sort(
        (a, b) =>
          priorityConfig[a.priority].order - priorityConfig[b.priority].order
      ),
    [goals]
  );

  function openCreateGoal() {
    setGoalMode("create");
    setEditGoalId(null);
    setGoalForm(emptyGoalForm);
    setGoalDialogOpen(true);
  }

  function openEditGoal(goal: Goal) {
    setGoalMode("edit");
    setEditGoalId(goal.id);
    setGoalForm({
      title: goal.title,
      current: String(goal.current),
      target: String(goal.target),
      unit: goal.unit,
      targetDate: goal.targetDate,
      status: goal.status,
      priority: goal.priority,
      relatedPlans: goal.relatedPlans.join(", "),
      color: goal.color,
      icon: goal.icon,
    });
    setGoalDialogOpen(true);
  }

  function handleSaveGoal() {
    if (!goalForm.title.trim()) return;
    const current = Number(goalForm.current) || 0;
    const target = Number(goalForm.target) || 100;
    const relatedPlans = goalForm.relatedPlans
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (goalMode === "create") {
      setGoals((prev) => [
        {
          id: `g-${Date.now()}`,
          title: goalForm.title.trim(),
          current,
          target,
          unit: goalForm.unit.trim() || "units",
          targetDate:
            goalForm.targetDate || new Date().toISOString().slice(0, 10),
          status: goalForm.status,
          priority: goalForm.priority,
          progress: 0,
          relatedPlans,
          milestones: [],
          color: goalForm.color,
          icon: goalForm.icon,
        },
        ...prev,
      ]);
    } else if (editGoalId) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editGoalId
            ? {
                ...g,
                title: goalForm.title.trim(),
                current,
                target,
                unit: goalForm.unit.trim() || g.unit,
                targetDate: goalForm.targetDate || g.targetDate,
                status: goalForm.status,
                priority: goalForm.priority,
                relatedPlans,
                color: goalForm.color,
                icon: goalForm.icon,
              }
            : g
        )
      );
    }
    setGoalDialogOpen(false);
    setGoalForm(emptyGoalForm);
  }

  function openCreateMilestone(goalId: string) {
    setMsMode("create");
    setActiveGoalId(goalId);
    setEditMsId(null);
    setMsForm(emptyMilestoneForm);
    setMsDialogOpen(true);
  }

  function openEditMilestone(goalId: string, ms: Milestone) {
    setMsMode("edit");
    setActiveGoalId(goalId);
    setEditMsId(ms.id);
    setMsForm({ title: ms.title });
    setMsDialogOpen(true);
  }

  function handleSaveMilestone() {
    if (!msForm.title.trim()) return;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== activeGoalId) return g;
        let milestones: Milestone[];
        if (msMode === "create") {
          milestones = [
            ...g.milestones,
            { id: `ms-${Date.now()}`, title: msForm.title.trim(), done: false },
          ];
        } else {
          milestones = g.milestones.map((m) =>
            m.id === editMsId ? { ...m, title: msForm.title.trim() } : m
          );
        }
        return { ...g, milestones, progress: syncProgress(milestones) };
      })
    );
    setMsDialogOpen(false);
    setMsForm(emptyMilestoneForm);
  }

  function toggleMilestone(goalId: string, milestoneId: string) {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done: !m.done } : m
        );
        return { ...g, milestones, progress: syncProgress(milestones) };
      })
    );
  }

  function confirmDelete(
    type: "goal" | "milestone",
    id: string,
    label: string,
    goalId?: string
  ) {
    setDeleteTarget({ type, id, label, goalId });
    setDeleteOpen(true);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.type === "goal") {
      setGoals((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    } else if (deleteTarget.goalId) {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== deleteTarget.goalId) return g;
          const milestones = g.milestones.filter(
            (m) => m.id !== deleteTarget.id
          );
          return { ...g, milestones, progress: syncProgress(milestones) };
        })
      );
    }
    setDeleteOpen(false);
    setDeleteTarget(null);
  }

  const activeCount = goals.filter((g) => g.status === "active").length;
  const highCount = goals.filter((g) => g.priority === "high").length;
  const avgProgress =
    goals.length > 0
      ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-7 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold tracking-tight">Goals</h1>
            <p className="text-sm text-muted-foreground">
              Ranked by priority · roadmap milestones · related plans
            </p>
          </div>
          <Button
            size="sm"
            className="gap-1.5 self-start"
            onClick={openCreateGoal}
          >
            <Plus className="h-3.5 w-3.5" />
            Add goal
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Total Goals",
              value: goals.length,
              color: "bg-violet-50 text-violet-600",
              icon: Target,
            },
            {
              label: "High Priority",
              value: highCount,
              color: "bg-rose-50 text-rose-600",
              icon: AlertTriangle,
            },
            {
              label: "Active",
              value: activeCount,
              color: "bg-emerald-50 text-emerald-600",
              icon: CheckCircle2,
            },
            {
              label: "Avg Progress",
              value: `${avgProgress}%`,
              color: "bg-amber-50 text-amber-600",
              icon: TrendingUp,
            },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className="rounded-xl border shadow-sm">
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${kpi.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      {kpi.label}
                    </p>
                    <p className="text-sm font-semibold tracking-tight">
                      {kpi.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-3">
          {sortedGoals.map((goal) => {
            const Icon = iconMap[goal.icon] || Target;
            const status = statusStyles[goal.status] ?? statusStyles.active;
            const pri = priorityConfig[goal.priority];
            const PriIcon = pri.icon;

            return (
              <Card key={goal.id} className="rounded-xl border shadow-sm">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={goal.id} className="border-0">
                      <div className="flex items-start gap-3 p-4 pb-0">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${goal.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold tracking-tight">
                              {goal.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`rounded-full border text-[10px] font-medium gap-1 ${pri.className}`}
                            >
                              <PriIcon className="h-3 w-3" />
                              {pri.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`rounded-full border text-[10px] font-medium ${status.className}`}
                            >
                              {status.label}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {goal.current} → {goal.target} {goal.unit}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {goal.targetDate}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground">
                                Progress
                              </span>
                              <span className="font-medium">
                                {goal.progress}%
                              </span>
                            </div>
                            <Progress value={goal.progress} className="h-1.5" />
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => openEditGoal(goal)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              confirmDelete("goal", goal.id, goal.title)
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <AccordionTrigger className="px-4 py-2.5 text-xs text-muted-foreground hover:no-underline">
                        Roadmap (
                        {goal.milestones.filter((m) => m.done).length}/
                        {goal.milestones.length}) · related plans
                      </AccordionTrigger>

                      <AccordionContent className="px-4 pb-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                Roadmap
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 gap-1 text-[11px]"
                                onClick={() => openCreateMilestone(goal.id)}
                              >
                                <Plus className="h-3 w-3" />
                                Add
                              </Button>
                            </div>
                            {goal.milestones.length === 0 ? (
                              <p className="rounded-lg border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">
                                No milestones yet
                              </p>
                            ) : (
                              <div className="space-y-1.5">
                                {goal.milestones.map((ms) => (
                                  <div
                                    key={ms.id}
                                    className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-2"
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleMilestone(goal.id, ms.id)
                                      }
                                      className="shrink-0"
                                    >
                                      {ms.done ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                      ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </button>
                                    <span
                                      className={`min-w-0 flex-1 truncate text-sm ${
                                        ms.done
                                          ? "text-muted-foreground line-through"
                                          : "font-medium"
                                      }`}
                                    >
                                      {ms.title}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                                      onClick={() =>
                                        openEditMilestone(goal.id, ms)
                                      }
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                                      onClick={() =>
                                        confirmDelete(
                                          "milestone",
                                          ms.id,
                                          ms.title,
                                          goal.id
                                        )
                                      }
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                              Related Plans
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {goal.relatedPlans.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                  No plans linked
                                </p>
                              ) : (
                                goal.relatedPlans.map((plan) => (
                                  <Badge
                                    key={plan}
                                    variant="secondary"
                                    className="gap-1 rounded-full text-[11px] font-normal"
                                  >
                                    <Link2 className="h-3 w-3" />
                                    {plan}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}

          {goals.length === 0 && (
            <Card className="rounded-xl border shadow-sm">
              <CardContent className="flex flex-col items-center justify-center gap-2 py-12">
                <Target className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No goals yet. Create your first one.
                </p>
                <Button
                  size="sm"
                  className="mt-2 gap-1.5"
                  onClick={openCreateGoal}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add goal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {goalMode === "create" ? "Add Goal" : "Edit Goal"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Lose Weight"
                value={goalForm.title}
                onChange={(e) =>
                  setGoalForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="current">Current</Label>
                <Input
                  id="current"
                  type="number"
                  value={goalForm.current}
                  onChange={(e) =>
                    setGoalForm((f) => ({ ...f, current: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  type="number"
                  value={goalForm.target}
                  onChange={(e) =>
                    setGoalForm((f) => ({ ...f, target: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  placeholder="kg"
                  value={goalForm.unit}
                  onChange={(e) =>
                    setGoalForm((f) => ({ ...f, unit: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="date">Target date</Label>
                <Input
                  id="date"
                  type="date"
                  value={goalForm.targetDate}
                  onChange={(e) =>
                    setGoalForm((f) => ({ ...f, targetDate: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select
                  value={goalForm.priority}
                  onValueChange={(v) =>
                    setGoalForm((f) => ({ ...f, priority: v as Priority }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={goalForm.status}
                  onValueChange={(v) =>
                    setGoalForm((f) => ({ ...f, status: v as GoalStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plans">Related plans</Label>
                <Input
                  id="plans"
                  placeholder="Diet, Exercise"
                  value={goalForm.relatedPlans}
                  onChange={(e) =>
                    setGoalForm((f) => ({
                      ...f,
                      relatedPlans: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setGoalForm((f) => ({ ...f, color: c }))}
                    className={`h-7 w-7 rounded-md border-2 ${c} ${
                      goalForm.color === c
                        ? "border-foreground"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveGoal}
              disabled={!goalForm.title.trim()}
            >
              {goalMode === "create" ? "Add" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={msDialogOpen} onOpenChange={setMsDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {msMode === "create" ? "Add Milestone" : "Edit Milestone"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="ms-title">Title</Label>
              <Input
                id="ms-title"
                placeholder="e.g. Reach 76 kg"
                value={msForm.title}
                onChange={(e) =>
                  setMsForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveMilestone}
              disabled={!msForm.title.trim()}
            >
              {msMode === "create" ? "Add" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.label}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}