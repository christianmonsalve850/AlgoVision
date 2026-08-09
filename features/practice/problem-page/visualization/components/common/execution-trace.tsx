import { GitCommit, StepBack, StepForward } from "lucide-react";
import { ReactNode } from "react";

interface ExecutionTraceProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  children?: ReactNode;
}

export function ExecutionTrace({
  currentStep,
  totalSteps,
  onStepChange,
  children,
}: ExecutionTraceProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* TIMELINE CONTROL BAR */}
      <div className="flex items-center justify-between rounded-lg border border-border/60 bg-zinc-950/60 px-3 py-1.5 shadow-xs">
        <div className="flex items-center gap-2">
          <GitCommit className="size-3.5 text-emerald-400 rotate-90" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Execution Trace
          </span>
        </div>

        {/* TIMELINE NAVIGATION */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-400">
            <strong className="text-zinc-200">{currentStep}</strong> / {totalSteps}
          </span>
          
          <div className="flex items-center gap-2 rounded-md border border-border/60 bg-zinc-900/80 p-0.5">
            <button
              onClick={() => onStepChange(Math.max(1, currentStep - 1))}
              disabled={currentStep <= 1}
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Previous Step"
              type="button"
            >
              <StepBack className="size-3.5" />
            </button>
            <button
              onClick={() => onStepChange(Math.min(totalSteps, currentStep + 1))}
              disabled={currentStep >= totalSteps}
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next Step"
              type="button"
            >
              <StepForward className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {children && (
        <div className="flex w-full flex-col gap-2">
          {children}
        </div>
      )}
    </div>
  );
}