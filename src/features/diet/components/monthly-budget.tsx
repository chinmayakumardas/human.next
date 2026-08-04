"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { createBudgetItem, deleteBudgetItem } from "../diet-actions";
import type { BudgetItem } from "../types";

type Props = { items: BudgetItem[] };

export function MonthlyBudget({ items }: Props) {
  const [form, setForm] = useState({ name: "", amount: "", icon: "💰" });
  const [isPending, startTransition] = useTransition();

  const total = items.reduce((sum, i) => sum + i.amount, 0);

  function handleAdd() {
    if (!form.name) return;
    startTransition(async () => {
      await createBudgetItem({
        name: form.name,
        amount: Number(form.amount) || 0,
        icon: form.icon || "💰",
      });
      setForm({ name: "", amount: "", icon: "💰" });
    });
  }

  function handleDelete(id?: string) {
    if (!id) return;
    startTransition(async () => {
      await deleteBudgetItem(id);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Monthly Budget
          <span className="text-sm font-normal text-muted-foreground">
            ₹{total.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Icon"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-14"
            maxLength={2}
          />
          <Input
            placeholder="Item name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="₹"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-24"
          />
          <Button size="icon" onClick={handleAdd} disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ul className="space-y-1">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">No budget items yet.</p>
          )}
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent/40 group"
            >
              <span className="text-sm flex items-center gap-2">
                <span>{item.icon}</span>
                {item.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  ₹{item.amount.toFixed(2)}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}