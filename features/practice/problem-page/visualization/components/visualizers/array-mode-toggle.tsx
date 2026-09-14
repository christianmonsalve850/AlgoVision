"use client";

import { LayoutGrid, BarChart3 } from "lucide-react";

export type ArrayViewMode = "cells" | "bars";

type ArrayViewToggleProps = {
  mode: ArrayViewMode;
  onModeChange: (mode: ArrayViewMode) => void;
};

export function ArrayViewToggle({ mode, onModeChange }: ArrayViewToggleProps) {
  return (
    <div className="relative inline-flex rounded-lg bg-muted p-0.5 border border-border">
      <div
        className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-md bg-background shadow-xs transition-transform duration-300 ease-in-out ${
          mode === "bars" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      <button
        type="button"
        onClick={() => onModeChange("cells")}
        className={`relative z-10 flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-300 ${
          mode === "cells"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Cells
      </button>

      <button
        type="button"
        onClick={() => onModeChange("bars")}
        className={`relative z-10 flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-300 ${
          mode === "bars"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <BarChart3 className="h-3.5 w-3.5" />
        Bars
      </button>
    </div>
  );
}
