"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  createNutritionGoal,
  updateNutritionGoal,
  deleteNutritionGoal,
} from "../diet-actions";
import type { NutritionGoal } from "../types";
import { useRouter } from "next/navigation";
type Props = { goals: NutritionGoal[] };

const emptyForm = { title: "", value: "", unit: "", icon: "🎯", current: "" };

export function NutritionGoals({ goals }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NutritionGoal | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();
const router = useRouter();
  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(goal: NutritionGoal) {
    setEditing(goal);
    setForm({
      title: goal.title,
      value: String(goal.value),
      unit: goal.unit,
      icon: goal.icon,
      current: String(goal.current),
    });
    setOpen(true);
  }

function handleSave() {
  const payload = {
    title: form.title,
    value: Number(form.value) || 0,
    unit: form.unit,
    icon: form.icon || "🎯",
    current: Number(form.current) || 0,
  };

  startTransition(async () => {
    if (editing?.id) {
      await updateNutritionGoal(editing.id, payload);
    } else {
      await createNutritionGoal(payload);
    }

    setOpen(false);
    router.refresh();
  });
}

function handleDelete(id?: string) {
  if (!id) return;

  startTransition(async () => {
    await deleteNutritionGoal(id);
    router.refresh();
  });
}

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Nutrition Goals</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger
  render={
    <Button size="sm" onClick={openCreate}>
      <Plus className="mr-1 h-4 w-4" />
      Add Goal
    </Button>
  }
/>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Goal" : "New Goal"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Calories"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="value">Target</Label>
                  <Input
                    id="value"
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="current">Current</Label>
                  <Input
                    id="current"
                    type="number"
                    value={form.current}
                    onChange={(e) => setForm({ ...form, current: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="kcal, g..."
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon (emoji)</Label>
                <Input
                  id="icon"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  maxLength={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={isPending || !form.title}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        {goals.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-2">
            No goals yet. Add one to start tracking.
          </p>
        )}
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="group relative rounded-lg border p-4 hover:bg-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{goal.icon}</span>
                <span className="font-medium">{goal.title}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => openEdit(goal)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => handleDelete(goal.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {goal.current} / {goal.value} {goal.unit}
            </p>
            <Progress value={goal.progress} className="mt-2 h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}