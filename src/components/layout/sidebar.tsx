"use client";

import {
  BookOpenText,
  CheckSquare,
  Flag,
  LayoutDashboard,
  NotebookPen,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/goals", label: "Goals", icon: Flag },
  { href: "/notes", label: "Notes", icon: NotebookPen },
  { href: "/journal", label: "Journal", icon: BookOpenText },
];

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({ collapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar px-3 py-4 shadow-xl transition-[transform,width] duration-200 md:static md:z-auto md:w-64 md:translate-x-0 md:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        collapsed && "md:w-20",
      )}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2" onClick={onCloseMobile}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className={cn("font-semibold tracking-tight", collapsed && "md:hidden")}>LifeOS</span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={onCloseMobile}
          aria-label="Close navigation"
        >
          <X />
        </Button>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Primary navigation">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "md:justify-center md:px-2",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className={cn(collapsed && "md:hidden")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/settings"
        title={collapsed ? "Settings" : undefined}
        onClick={onCloseMobile}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          collapsed && "md:justify-center md:px-2",
        )}
      >
        <Settings className="size-4 shrink-0" />
        <span className={cn(collapsed && "md:hidden")}>Settings</span>
      </Link>
    </aside>
  );
}
