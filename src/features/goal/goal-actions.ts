"use client";

import { createClient } from "@/lib/client";
import type { Goal, GoalStatus, Milestone, Priority } from "./types";

function syncProgress(milestones: Milestone[]) {
  if (milestones.length === 0) return 0;
  return Math.round(
    (milestones.filter((m) => m.done).length / milestones.length) * 100
  );
}

export async function loadGoals(): Promise<Goal[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals")
    .select("*, milestones:goal_milestones(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("loadGoals", error);
    return [];
  }

  return (data ?? []).map((g: any) => ({
    ...g,
    related_plans: g.related_plans ?? [],
    milestones: (g.milestones ?? []).sort(
      (a: Milestone, b: Milestone) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    ),
  }));
}

export async function createGoal(input: {
  title: string;
  current: number;
  target: number;
  unit: string;
  target_date: string;
  status: GoalStatus;
  priority: Priority;
  related_plans: string[];
  color: string;
  icon: string;
}) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("goals")
    .insert({ ...input, progress: 0, user_id: user.user?.id })
    .select()
    .single();
  if (error) throw error;
  return data as Goal;
}

export async function updateGoal(
  id: string,
  input: {
    title: string;
    current: number;
    target: number;
    unit: string;
    target_date: string;
    status: GoalStatus;
    priority: Priority;
    related_plans: string[];
    color: string;
    icon: string;
  }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goals")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Goal;
}

export async function deleteGoal(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw error;
}

export async function createMilestone(goalId: string, title: string) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("goal_milestones")
    .insert({ goal_id: goalId, title, done: false, user_id: user.user?.id })
    .select()
    .single();
  if (error) throw error;
  await recalculateProgress(goalId);
  return data as Milestone;
}

export async function updateMilestone(id: string, title: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("goal_milestones")
    .update({ title })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Milestone;
}

export async function toggleMilestone(id: string, goalId: string, done: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("goal_milestones")
    .update({ done })
    .eq("id", id);
  if (error) throw error;
  await recalculateProgress(goalId);
}

export async function deleteMilestone(id: string, goalId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("goal_milestones").delete().eq("id", id);
  if (error) throw error;
  await recalculateProgress(goalId);
}

async function recalculateProgress(goalId: string) {
  const supabase = createClient();
  const { data: milestones } = await supabase
    .from("goal_milestones")
    .select("*")
    .eq("goal_id", goalId);
  const progress = syncProgress((milestones as Milestone[]) ?? []);
  await supabase.from("goals").update({ progress }).eq("id", goalId);
}