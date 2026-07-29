"use client";

import { createClient } from "@/lib/client";

export type HealthProfile = {
  id: string;
  age: number;
  height_cm: number;
  current_weight: number;
  target_weight: number;
  bmi: number;
  body_fat: number;
  blood_pressure: string;
  heart_rate: number;
  daily_calories: number;
  protein_g: number;
  water_l: number;
  food_budget: number;
  workout_duration: number;
  goal_title: string;
  goal_progress: number;
  goal_deadline: string;
  diet_plan_name: string;
  exercise_plan_name: string;
};

export async function loadHealthProfile(): Promise<HealthProfile | null> {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  const { data, error } = await supabase
    .from("health_profile")
    .select("*")
    .eq("user_id", user.user.id)
    .maybeSingle();

  if (error) {
    console.error("loadHealthProfile", error);
    return null;
  }

  if (!data) {
    const { data: created, error: createErr } = await supabase
      .from("health_profile")
      .insert({ user_id: user.user.id })
      .select()
      .single();
    if (createErr) {
      console.error(createErr);
      return null;
    }
    return created as HealthProfile;
  }

  return data as HealthProfile;
}

export async function updateHealthProfile(
  id: string,
  patch: Partial<HealthProfile>
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("health_profile")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as HealthProfile;
}