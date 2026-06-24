import { Terminal, HelpCircle } from "lucide-react";
import type { ExecutionStep } from "../types";

export function ExecutionStep({ 
    stepNumber, 
    line, 
    functionName, 
    expression
}: ExecutionStep) {
  return (
    <div className="rounded-xl border border-border bg-zinc-900/10 shadow-sm overflow-hidden">
      {/* HEADER BANNER METADATA */}
      <div className="flex items-center justify-between border-b border-border bg-zinc-950/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-muted-foreground" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Step #{stepNumber}
          </span>
        </div>
        
        {/* SCOPE RUN CONTEXT */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-purple-400 font-medium">{functionName}</span>
          <span className="text-zinc-700">:</span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300 border border-zinc-700/30">
            Ln {line}
          </span>
        </div>
      </div>

      {/* THE LIVE RUNNING CODE STATEMENT */}
      <div className="p-4 bg-background">
        <code className="block font-mono text-[11px] antialiased font-normal text-foreground bg-background border border-border/60 w-full px-3 py-2 rounded-lg whitespace-pre border-l-2 border-l-purple-500 overflow-x-auto select-text">
          {expression}
        </code>
      </div>
    </div>
  );
}