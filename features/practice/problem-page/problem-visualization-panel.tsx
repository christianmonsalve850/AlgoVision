import { BrainCircuit, Maximize2 } from "lucide-react";

export function ProblemVisualizationPanel() {
  return (
    <section className="col-span-4 flex h-[calc(100vh-4rem)] flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Visualization
          </h2>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          <Maximize2 className="size-4" />
          Expand
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center p-5">
        <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
          Visualization goes here
        </div>
      </div>
    </section>
  );
}
