"use client";

import { createClient } from "@/lib/client";
import type { Book, BookStatus, Priority } from "./types";

function calcProgress(pagesRead: number, totalPages: number) {
  if (totalPages <= 0) return 0;
  return Math.min(100, Math.round((pagesRead / totalPages) * 100));
}

export async function loadBooks(): Promise<Book[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("loadBooks", error);
    return [];
  }
  return (data ?? []) as Book[];
}

export async function createBook(input: {
  title: string;
  author: string;
  total_pages: number;
  pages_read: number;
  status: BookStatus;
  priority: Priority;
  color: string;
  notes: string;
}) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const progress = calcProgress(input.pages_read, input.total_pages);
  const { data, error } = await supabase
    .from("books")
    .insert({
      ...input,
      progress,
      started_at:
        input.status === "reading"
          ? new Date().toISOString().slice(0, 10)
          : null,
      user_id: user.user?.id,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Book;
}

export async function updateBook(
  id: string,
  input: {
    title: string;
    author: string;
    total_pages: number;
    pages_read: number;
    status: BookStatus;
    priority: Priority;
    color: string;
    notes: string;
  }
) {
  const supabase = createClient();
  const progress = calcProgress(input.pages_read, input.total_pages);
  const patch: Record<string, unknown> = { ...input, progress };
  if (input.status === "completed") {
    patch.finished_at = new Date().toISOString().slice(0, 10);
    patch.pages_read = input.total_pages;
    patch.progress = 100;
  }
  const { data, error } = await supabase
    .from("books")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Book;
}

export async function deleteBook(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw error;
}