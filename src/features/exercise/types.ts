export type Exercise = {
  id: string;
  day_id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  sort_order?: number;
};

export type WorkoutDay = {
  id: string;
  day_name: string;
  day_type: string;
  sort_order: number;
  exercises?: Exercise[];
};