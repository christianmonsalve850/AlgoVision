import { ProblemTestCaseOutputProps } from "@/features/practice/problem-page/code-editor/types";
import { Terminal } from "lucide-react";

export function ProblemTestCaseOutput({ value }: ProblemTestCaseOutputProps) {
  if (!value) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-50 p-6 text-center select-none">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 border border-border/50 mb-3 text-muted-foreground">
          <Terminal className="h-6 w-6 stroke-[1.5]" />
        </div>
        
        <p className="mt-1.5 max-w-xs text-xs text-neutral-500 leading-relaxed">
          You must run your code first
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Your Output</p>
      <pre className="min-h-12 overflow-x-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
        {value}
      </pre>
    </div>
  );
}
