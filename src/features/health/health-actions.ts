
"use client";

import { createClient } from "@/lib/client";

export type HealthProfile = {
  id: string;
  user_id: string;

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

  updated_at: string;
};

export type BodyMetric = {
  id: string;
  user_id: string;

  weight_kg: number | null;
  body_fat: number | null;

  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;

  left_arm_cm: number | null;
  right_arm_cm: number | null;

  left_thigh_cm: number | null;
  right_thigh_cm: number | null;

  measured_at: string;
  notes: string | null;

  created_at: string;
  updated_at: string;
};

// =========================================================
// HEALTH PROFILE
// =========================================================

export async function loadHealthProfile(): Promise<HealthProfile | null> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

if (userError) {
  throw new Error(userError.message);
}

if (!user) {
  return null;
}
  const { data, error } = await supabase
    .from("health_profile")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("loadHealthProfile:", error.message);
    throw new Error(error.message);
  }

  if (data) {
    return data as HealthProfile;
  }

  const { data: created, error: createError } = await supabase
    .from("health_profile")
    .insert({
      user_id: user.id,
    })
    .select("*")
    .single();

  if (createError) {
    throw new Error(createError.message);
  }

  return created as HealthProfile;
}

export async function updateHealthProfile(
  id: string,
  patch: Partial<Omit<HealthProfile, "id" | "user_id">>
): Promise<HealthProfile> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Never allow user_id or id to be changed from the client.
  const { data, error } = await supabase
    .from("health_profile")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as HealthProfile;
}

// =========================================================
// BODY METRICS CRUD
// =========================================================

export async function loadBodyMetrics(): Promise<BodyMetric[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", user.id)
    .order("measured_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as BodyMetric[];
}

export async function createBodyMetric(
  metric: Omit<
    BodyMetric,
    "id" | "user_id" | "created_at" | "updated_at"
  >
): Promise<BodyMetric> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("body_metrics")
    .insert({
      ...metric,
      user_id: user.id,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as BodyMetric;
}

export async function updateBodyMetric(
  id: string,
  patch: Partial<
    Omit<
      BodyMetric,
      "id" | "user_id" | "created_at" | "updated_at"
    >
  >
): Promise<BodyMetric> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("body_metrics")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as BodyMetric;
}

export async function deleteBodyMetric(id: string): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("body_metrics")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}