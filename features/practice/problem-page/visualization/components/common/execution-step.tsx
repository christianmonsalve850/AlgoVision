import { Terminal } from "lucide-react";
import type { ExecutionStep } from "@/features/practice/problem-page/visualization/types";

export function ExecutionStep({ 
    stepNumber, 
    line, 
    functionName, 
    expression,
    variables
}: ExecutionStep) {
  return (
    <div className="rounded-lg border border-border/60 bg-zinc-950/40 p-2.5 font-mono text-xs shadow-xs">
      {/* ROW 1: METADATA */}
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground pb-1.5 border-b border-border/30">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Terminal className="size-3.5 text-purple-400" />
          <span>#{stepNumber}</span>
        </div>
        <span className="text-zinc-700">•</span>
        <span className="text-purple-400 font-medium">{functionName}()</span>
        <span className="text-zinc-600">:</span>
        <span className="text-zinc-400">L{line}</span>
      </div>

      {/* ROW 2: CODE EXPRESSION */}
      <div className="pt-2 overflow-x-auto">
        <code className="block whitespace-pre-wrap wrap-break-word text-zinc-200">
          {expression}
        </code>
      </div>
    </div>
  );
}