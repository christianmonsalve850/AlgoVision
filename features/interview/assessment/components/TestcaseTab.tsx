

import { Braces } from "lucide-react";

export default function TestcaseTab() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Custom test case
          </div>
          <h2 className="mt-0.5 text-sm font-semibold tracking-tight">
            Set function parameters
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] text-muted-foreground">
          2 parameters
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-lg border border-border bg-muted/15">
        <div className="flex shrink-0 items-center gap-2 border-b border-border/70 bg-muted/30 px-3 py-2">
          <Braces className="size-3.5 text-emerald-500" aria-hidden="true" />
          <span className="text-xs font-medium text-foreground">Arguments</span>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            enter each value separately
          </span>
        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-2">
          {[1].map((parameter) => (
            <div key={parameter} className="space-y-1.5">
              <label
                htmlFor={`custom-testcase-parameter-${parameter}`}
                className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Parameter {String(parameter).padStart(2, "0")}
              </label>
              <input
                id={`custom-testcase-parameter-${parameter}`}
                type="text"
                placeholder={`Value for parameter ${parameter}`}
                className="h-9 w-full rounded-md border border-border bg-background/80 px-3 font-mono text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/55 focus-visible:border-emerald-500/60 focus-visible:ring-2 focus-visible:ring-emerald-500/20"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}