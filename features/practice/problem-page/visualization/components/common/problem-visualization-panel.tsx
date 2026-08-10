"use client"; // Remove later

import { BrainCircuit, Maximize2 } from "lucide-react";
import { CallFrame } from "@/features/practice/problem-page/visualization/components/common/call-frame";
import { VariableState } from "@/features/practice/problem-page/visualization/components/common/variable-state";
import { ExecutionStep } from "@/features/practice/problem-page/visualization/components/common/execution-step";
import { ExecutionTrace } from "@/features/practice/problem-page/visualization/components/common/execution-trace";
import { Canvas } from "./canvas";
import ArrayVisualizer from "@/features/practice/problem-page/visualization/components/visualizers/array-visualizer";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import { filterUserTrace } from "@/features/practice/problem-page/visualization/utils";

export function ProblemVisualizationPanel() {

  const trace = filterUserTrace(useTraceStore((state) => state.trace));
  const currentStepIndex = useTraceStore((state) => state.currentStepIndex);
  const setCurrentStepIndex = useTraceStore(
    (state) => state.setCurrentStepIndex,
  );

  const currentStep = trace[currentStepIndex];

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

      {currentStep && (
        <div className="flex flex-1 p-4">
          <ExecutionTrace
            currentStep={currentStepIndex + 1}
            totalSteps={trace.length}
            onStepChange={(step) => setCurrentStepIndex(step - 1)}
          >
            {" "}
            Thursday 2:30pm 13th
            <ExecutionStep
              stepNumber={currentStep.step}
              line={currentStep.line}
              functionName={currentStep.function}
              expression={currentStep.expression}
              variables={currentStep.variables}
            />
            <VariableState variables={currentStep.variables} />
            <Canvas>
              <ArrayVisualizer />
            </Canvas>
          </ExecutionTrace>
        </div>
      )}
    </section>
  );
}
