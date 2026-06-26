'use client';

import { SunMoon } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
      aria-label="Toggle dark and light mode"
    >
      <SunMoon className="size-4" />
    </button>
  );
}
