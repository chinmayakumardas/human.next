"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Loader2 } from "lucide-react";
import {
  createShoppingItem,
  deleteShoppingItem,
} from "../diet-actions";
import type { ShoppingItem } from "../types";
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from "next/navigation";
type Props = { items: ShoppingItem[] };

export function ShoppingList({ items }: Props) {
  const [form, setForm] = useState({ food: "", quantity: "", cost: "" });
  const [isPending, startTransition] = useTransition();
const router = useRouter();
  const total = items.reduce((sum, i) => sum + i.cost, 0);

function handleAdd() {
  if (!form.food) return;

  startTransition(async () => {
    await createShoppingItem({
      food: form.food,
      quantity: form.quantity,
      cost: Number(form.cost) || 0,
    });

    setForm({ food: "", quantity: "", cost: "" });
    router.refresh();
  });
}

function handleDelete(id?: string) {
  if (!id) return;

  startTransition(async () => {
    await deleteShoppingItem(id);
    router.refresh();
  });
}
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Shopping List
          <span className="text-sm font-normal text-muted-foreground">
            ₹{total.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Food item"
            value={form.food}
            onChange={(e) => setForm({ ...form, food: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="Qty"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="w-20"
          />
          <Input
            placeholder="₹"
            type="number"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            className="w-20"
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
            <p className="text-sm text-muted-foreground">List is empty.</p>
          )}
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent/40 group"
            >
              <div className="flex items-center gap-2">
                <Checkbox />
                <span className="text-sm">
                  {item.food}{" "}
                  <span className="text-muted-foreground">({item.quantity})</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  ₹{item.cost.toFixed(2)}
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