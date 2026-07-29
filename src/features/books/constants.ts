import { AlertTriangle, ArrowDown, BookOpen, CheckCircle2, Minus, Pause } from "lucide-react";
import type { BookStatus, Priority } from "./types";

export const statusStyles: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  reading: { label: "Reading", className: "bg-blue-50 text-blue-700 border-blue-200", icon: BookOpen },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  want_to_read: { label: "Want to Read", className: "bg-violet-50 text-violet-700 border-violet-200", icon: BookOpen },
  paused: { label: "Paused", className: "bg-amber-50 text-amber-700 border-amber-200", icon: Pause },
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

export const emptyBookForm = {
  title: "",
  author: "",
  total_pages: "300",
  pages_read: "0",
  status: "want_to_read" as BookStatus,
  priority: "medium" as Priority,
  color: "bg-violet-50 text-violet-600",
  notes: "",
};