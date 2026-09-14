"use client";

import { useState } from "react";
import { LayoutGrid, BarChart3 } from "lucide-react";

export function ArrayViewToggle() {
  const [view, setView] = useState<"cells" | "bars">("cells");

  return (
    <div className="inline-flex rounded-lg bg-muted p-1 border border-border">
      <button
        onClick={() => setView("cells")}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
          view === "cells"
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Cells
      </button>

      <button
        onClick={() => setView("bars")}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
          view === "bars"
            ? "bg-background text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <BarChart3 className="h-3.5 w-3.5" />
        Bars
      </button>
    </div>
  );
}