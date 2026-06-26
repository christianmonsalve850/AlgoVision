'use client' // Remove later

import { BrainCircuit, Maximize2 } from "lucide-react";
import { CallFrame } from "@/features/practice/problem-page/visualization/components/call-frame";
import { VariableState } from "@/features/practice/problem-page/visualization/components/variable-state";
import { ExecutionStep } from "@/features/practice/problem-page/visualization/components/execution-step";
import { ExecutionTrace } from "@/features/practice/problem-page/visualization/components/execution-trace";

export function ProblemVisualizationPanel() {
  return (
    <section className="col-span-3 flex h-full min-h-0 flex-col bg-background overflow-y-auto">
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

      {/* <div className="flex flex-1 items-center justify-center p-5">
          
        <ExecutionTrace currentStep={1} totalSteps={8} onStepChange={(step: number) => console.log(step)}>
          <ExecutionStep stepNumber={1} line={1} expression="class Solution:" explanation="Explanation" functionName="search" />
          {/* <CallFrame name="Variable Name 1" args="Arg Name 1" isActive={true} />
          <CallFrame name="Variable Name 2" args="Arg Name 2" isActive={true} />
          <VariableState variables={[{name: "Name", type: "Type", value: "Value", updated: true}]} /> */}
        {/* </ExecutionTrace> */}

      {/* </div> */}
    </section>
  );
}
