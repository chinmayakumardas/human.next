export type BookStatus = "reading" | "completed" | "want_to_read" | "paused";
export type Priority = "high" | "medium" | "low";

export type Book = {
  id: string;
  title: string;
  author: string;
  total_pages: number;
  pages_read: number;
  progress: number;
  status: BookStatus;
  priority: Priority;
  color: string;
  notes: string;
  started_at: string | null;
  finished_at: string | null;
};