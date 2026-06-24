import { ProblemTestCaseDetailProps } from "../types";

export function ProblemTestCaseDetail({ testCase }: ProblemTestCaseDetailProps) {
  return (
    <div className="rounded-lg  bg-background p-3">
    
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Input</p>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-foreground">
            {testCase.input}
          </pre>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mt-4">Expected</p>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-foreground">
            {testCase.expected}
          </pre>
        </div>
    
    </div>
  );
}
