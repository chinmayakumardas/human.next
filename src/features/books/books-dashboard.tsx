"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBook, deleteBook, loadBooks, updateBook } from "./book-actions";
import {
  colorOptions,
  emptyBookForm,
  priorityConfig,
  statusStyles,
} from "./constants";
import type { Book, BookStatus, Priority } from "./types";

export function BooksDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyBookForm);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);

  async function refresh() {
    setBooks(await loadBooks());
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(
    () =>
      [...books].sort(
        (a, b) =>
          priorityConfig[a.priority].order - priorityConfig[b.priority].order
      ),
    [books]
  );

  function openCreate() {
    setMode("create");
    setEditId(null);
    setForm(emptyBookForm);
    setDialogOpen(true);
  }

  function openEdit(book: Book) {
    setMode("edit");
    setEditId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      total_pages: String(book.total_pages),
      pages_read: String(book.pages_read),
      status: book.status,
      priority: book.priority,
      color: book.color,
      notes: book.notes ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      total_pages: Number(form.total_pages) || 0,
      pages_read: Number(form.pages_read) || 0,
      status: form.status,
      priority: form.priority,
      color: form.color,
      notes: form.notes.trim(),
    };
    if (mode === "create") await createBook(payload);
    else if (editId) await updateBook(editId, payload);
    await refresh();
    setDialogOpen(false);
    setForm(emptyBookForm);
  }

  function confirmDelete(id: string, label: string) {
    setDeleteTarget({ id, label });
    setDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await deleteBook(deleteTarget.id);
    await refresh();
    setDeleteOpen(false);
    setDeleteTarget(null);
  }

  const reading = books.filter((b) => b.status === "reading").length;
  const high = books.filter((b) => b.priority === "high").length;
  const avg =
    books.length > 0
      ? Math.round(books.reduce((s, b) => s + b.progress, 0) / books.length)
      : 0;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-7 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold tracking-tight">Books</h1>
            <p className="text-sm text-muted-foreground">
              Reading list · priority · progress tracking
            </p>
          </div>
          <Button size="sm" className="gap-1.5 self-start" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5" />
            Add book
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Total Books",
              value: books.length,
              color: "bg-violet-50 text-violet-600",
              icon: BookOpen,
            },
            {
              label: "Reading",
              value: reading,
              color: "bg-blue-50 text-blue-600",
              icon: BookOpen,
            },
            {
              label: "High Priority",
              value: high,
              color: "bg-rose-50 text-rose-600",
              icon: AlertTriangle,
            },
            {
              label: "Avg Progress",
              value: `${avg}%`,
              color: "bg-amber-50 text-amber-600",
              icon: TrendingUp,
            },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className="rounded-xl border shadow-sm">
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${kpi.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      {kpi.label}
                    </p>
                    <p className="text-sm font-semibold tracking-tight">
                      {kpi.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-3">
          {sorted.map((book) => {
            const st = statusStyles[book.status] ?? statusStyles.want_to_read;
            const pri = priorityConfig[book.priority];
            const PriIcon = pri.icon;
            return (
              <Card key={book.id} className="rounded-xl border shadow-sm">
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${book.color}`}
                  >
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold tracking-tight">
                        {book.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`rounded-full border text-[10px] font-medium gap-1 ${pri.className}`}
                      >
                        <PriIcon className="h-3 w-3" />
                        {pri.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`rounded-full border text-[10px] font-medium ${st.className}`}
                      >
                        {st.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {book.author || "Unknown author"} · {book.pages_read}/
                      {book.total_pages} pages
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{book.progress}%</span>
                      </div>
                      <Progress value={book.progress} className="h-1.5" />
                    </div>
                    {book.notes && (
                      <p className="text-[11px] text-muted-foreground">
                        {book.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(book)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => confirmDelete(book.id, book.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {books.length === 0 && (
            <Card className="rounded-xl border shadow-sm">
              <CardContent className="flex flex-col items-center justify-center gap-2 py-12">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No books yet.</p>
                <Button size="sm" className="mt-2 gap-1.5" onClick={openCreate}>
                  <Plus className="h-3.5 w-3.5" />
                  Add book
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add Book" : "Edit Book"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Atomic Habits"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="James Clear"
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="total">Total pages</Label>
                <Input
                  id="total"
                  type="number"
                  value={form.total_pages}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, total_pages: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="read">Pages read</Label>
                <Input
                  id="read"
                  type="number"
                  value={form.pages_read}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pages_read: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as BookStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="want_to_read">Want to Read</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, priority: v as Priority }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Optional notes"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className={`h-7 w-7 rounded-md border-2 ${c} ${
                      form.color === c
                        ? "border-foreground"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!form.title.trim()}>
              {mode === "create" ? "Add" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.label}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}