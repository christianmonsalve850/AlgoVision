import { Code2, Play, RotateCcw } from "lucide-react";

export function ProblemEditorPanel() {
  return (
    <section className="col-span-4 flex h-[calc(100vh-4rem)] flex-col border-r border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Editor
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
          >
            <Play className="size-4" />
            Run
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1 rounded-xl border border-border bg-muted/30 p-4">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>JavaScript</span>
            <span>Monaco editor goes here</span>
          </div>
          <div className="h-[calc(100%-2rem)] rounded-lg border border-dashed border-border bg-background" />
        </div>
      </div>
    </section>
  );
}
