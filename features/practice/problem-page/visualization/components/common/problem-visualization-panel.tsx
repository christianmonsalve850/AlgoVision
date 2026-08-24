
import { useMemo } from "react";
import { BrainCircuit, Maximize2 } from "lucide-react";
import { CallFrame } from "@/features/practice/problem-page/visualization/components/common/call-frame";
import { VariableState } from "@/features/practice/problem-page/visualization/components/common/variable-state";
import { ExecutionStep } from "@/features/practice/problem-page/visualization/components/common/execution-step";
import { ExecutionTrace } from "@/features/practice/problem-page/visualization/components/common/execution-trace";
import { Canvas } from "./canvas";
import { ArrayVisualizer } from "@/features/practice/problem-page/visualization/components/visualizers/array-visualizer";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import { filterUserTrace, arrayVariable, expressionPointers, returnVisualizer } from "@/features/practice/problem-page/visualization/utils";
export function ProblemVisualizationPanel() {

  const trace = filterUserTrace(useTraceStore((state) => state.trace));
  const currentStepIndex = useTraceStore((state) => state.currentStepIndex);
  const setCurrentStepIndex = useTraceStore(
    (state) => state.setCurrentStepIndex,
  );

  const currentStep = trace[currentStepIndex];
  const array = useMemo(() => arrayVariable(currentStep), [currentStep]);
  const pointers = useMemo(
    () => (currentStep ? expressionPointers(currentStep) : []),
    [currentStep],
  );
  const highlightedIndices = useMemo(() => [], []); // placeholder for step-specific highlights

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
            <ExecutionStep
              stepNumber={currentStepIndex + 1}
              line={currentStep.line}
              functionName={currentStep.function}
              expression={currentStep.expression}
              variables={currentStep.variables}
            />
            <Canvas>
              <div className="w-full">
                { returnVisualizer(currentStep) }
              </div> 
            </Canvas>
            <VariableState variables={currentStep.variables} changedVariables={currentStep.changedVariables} />
          </ExecutionTrace>
        </div>
      )}
    </section>
  );
}
