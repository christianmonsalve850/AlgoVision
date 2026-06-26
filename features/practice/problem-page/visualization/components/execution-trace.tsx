import { GitCommit, StepForward, StepBack } from "lucide-react";
import type { ExecutionTraceProps } from "@/features/practice/problem-page/visualization/types"

export function ExecutionTrace({ currentStep, totalSteps, onStepChange, children }: ExecutionTraceProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
      
      {/* Visualizer Timeline Controls */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <GitCommit className="size-4 text-emerald-400 rotate-90" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Execution Trace
          </h3>
        </div>

        {/* Timeline Navigation */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-zinc-400">
            {currentStep} / {totalSteps}
          </span>
          <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
            <button
              onClick={() => onStepChange(Math.max(1, currentStep - 1))}
              disabled={currentStep <= 1}
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <StepBack className="size-3.5" />
            </button>
            <button
              onClick={() => onStepChange(Math.min(totalSteps, currentStep + 1))}
              disabled={currentStep >= totalSteps}
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <StepForward className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Dynamic Viewport Window */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0 custom-scrollbar">
        {children}
      </div>
    </div>
  );
}