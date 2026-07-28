"use client";

import { SunMoon } from "lucide-react";

import { Button } from "@/components/ui/button";

const THEME_STORAGE_KEY = "lifeos-theme";

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
    >
      <SunMoon />
    </Button>
  );
}
