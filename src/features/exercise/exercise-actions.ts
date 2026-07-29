"use client";

import { createClient } from "@/lib/client";
import type { Exercise, WorkoutDay } from "./types";

export async function loadWorkoutData(): Promise<WorkoutDay[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workout_days")
    .select("*, exercises(*)")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("loadWorkoutData", error);
    return [];
  }

  return (data ?? []).map((d: any) => ({
    ...d,
    exercises: (d.exercises ?? []).sort(
      (a: Exercise, b: Exercise) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    ),
  }));
}

export async function createExercise(
  dayId: string,
  input: { name: string; sets: number; reps: string; rest: string }
) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("exercises")
    .insert({
      day_id: dayId,
      name: input.name,
      sets: input.sets,
      reps: input.reps,
      rest: input.rest,
      user_id: user.user?.id,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Exercise;
}

export async function updateExercise(
  id: string,
  input: { name: string; sets: number; reps: string; rest: string }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercises")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Exercise;
}

export async function deleteExercise(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("exercises").delete().eq("id", id);
  if (error) throw error;
}

export async function seedDefaultSplit() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;

  const { count } = await supabase
    .from("workout_days")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) return;

  const days = [
    { day_name: "Monday", day_type: "Push", sort_order: 0 },
    { day_name: "Tuesday", day_type: "Pull", sort_order: 1 },
    { day_name: "Wednesday", day_type: "Legs", sort_order: 2 },
    { day_name: "Thursday", day_type: "Push", sort_order: 3 },
    { day_name: "Friday", day_type: "Pull", sort_order: 4 },
    { day_name: "Saturday", day_type: "Legs", sort_order: 5 },
    { day_name: "Sunday", day_type: "Rest", sort_order: 6 },
  ];

  for (const d of days) {
    await supabase.from("workout_days").insert({
      ...d,
      user_id: user.user.id,
    });
  }
}