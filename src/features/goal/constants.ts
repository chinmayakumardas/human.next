import {
  AlertTriangle,
  ArrowDown,
  Flame,
  Heart,
  Minus,
  Scale,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { GoalStatus, Priority } from "./types";

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target, Scale, Flame, Heart, TrendingUp, Zap,
};

export const statusStyles: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "Completed", className: "bg-blue-50 text-blue-700 border-blue-200" },
  paused: { label: "Paused", className: "bg-amber-50 text-amber-700 border-amber-200" },
  overdue: { label: "Overdue", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

export const priorityConfig: Record<Priority, {
  label: string; className: string; order: number;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  high: { label: "High", className: "bg-rose-50 text-rose-700 border-rose-200", order: 0, icon: AlertTriangle },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-700 border-amber-200", order: 1, icon: Minus },
  low: { label: "Low", className: "bg-slate-50 text-slate-600 border-slate-200", order: 2, icon: ArrowDown },
};

export const colorOptions = [
  "bg-violet-50 text-violet-600",
  "bg-blue-50 text-blue-600",
  "bg-emerald-50 text-emerald-600",
  "bg-amber-50 text-amber-600",
  "bg-rose-50 text-rose-600",
  "bg-teal-50 text-teal-600",
];

export const emptyGoalForm = {
  title: "",
  current: "0",
  target: "100",
  unit: "kg",
  target_date: "",
  status: "active" as GoalStatus,
  priority: "medium" as Priority,
  related_plans: "",
  color: "bg-violet-50 text-violet-600",
  icon: "Target",
};

export const emptyMilestoneForm = { title: "" };