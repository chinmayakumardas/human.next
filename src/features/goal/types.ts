export type GoalStatus = "active" | "completed" | "paused" | "overdue";
export type Priority = "high" | "medium" | "low";

export type Milestone = {
  id: string;
  goal_id: string;
  title: string;
  done: boolean;
  sort_order?: number;
};

export type Goal = {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  target_date: string;
  status: GoalStatus;
  priority: Priority;
  progress: number;
  related_plans: string[];
  color: string;
  icon: string;
  milestones?: Milestone[];
};