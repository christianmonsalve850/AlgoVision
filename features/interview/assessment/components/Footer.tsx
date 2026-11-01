import { ChevronLeft, ChevronRight, Send, Play } from "lucide-react";
import type { AssessmentFooterProps } from "@/features/interview/assessment/types";

export default function Footer({
  currentProblemIndex,
  problemCount,
  onProblemChange,
}: AssessmentFooterProps) {
  const canGoToPreviousProblem = currentProblemIndex > 0;
  const canGoToNextProblem = currentProblemIndex < problemCount - 1;

  return (
    <footer className="grid w-full grid-cols-[1fr_auto_1fr] items-center border-t border-border px-4 py-2">
      <div />
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={!canGoToPreviousProblem}
          onClick={() => onProblemChange(currentProblemIndex - 1)}
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="size-3.5 -ml-1" /> Prev
        </button>

        <span className="text-xs font-medium text-muted-foreground">
          <span className="text-foreground font-semibold">
            {problemCount === 0 ? 0 : currentProblemIndex + 1}
          </span>{" "}
          / {problemCount}
        </span>

        <button
          type="button"
          disabled={!canGoToNextProblem}
          onClick={() => onProblemChange(currentProblemIndex + 1)}
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next <ChevronRight className="size-3.5 -mr-1" />
        </button>
      </div>
      <div className="flex items-center justify-self-end gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
        >
          <Play className="size-3.5" />
          Run
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-500 dark:border-emerald-700 bg-emerald-600 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="size-3.5" />
          Submit
        </button>
      </div>
    </footer>
  );
}
