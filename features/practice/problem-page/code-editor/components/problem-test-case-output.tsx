import { ProblemTestCaseOutputProps } from "../types";

export function ProblemTestCaseOutput({ value }: ProblemTestCaseOutputProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Your Output</p>
      <pre className="min-h-12 overflow-x-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
        {value}
      </pre>
    </div>
  );
}
