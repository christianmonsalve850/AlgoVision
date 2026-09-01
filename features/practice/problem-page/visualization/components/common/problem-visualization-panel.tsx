import { useMemo } from "react";
import { VariableState } from "@/features/practice/problem-page/visualization/components/common/variable-state";
import { ExecutionStep } from "@/features/practice/problem-page/visualization/components/common/execution-step";
import { ExecutionTrace } from "@/features/practice/problem-page/visualization/components/common/execution-trace";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import {
  filterUserTrace,
  getVisualizers,
  returnVisualizer,
} from "@/features/practice/problem-page/visualization/utils";

export function ProblemVisualizationPanel() {
  const trace = filterUserTrace(useTraceStore((state) => state.trace));
  const currentStepIndex = useTraceStore((state) => state.currentStepIndex);

  const setCurrentStepIndex = useTraceStore(
    (state) => state.setCurrentStepIndex,
  );

  const currentStep = trace[currentStepIndex];

  const dataStructures = useMemo(() => {
    if (!currentStep) return [];

    // Get all rendered visualizers for the current step
    const visualizers = returnVisualizer(currentStep);

    return visualizers.map((viz) => ({
      name: viz.name,
      type: viz.type,
      component: viz.visualization,
    }));
  }, [currentStep]);

  return (
    <section className="col-span-4 flex h-full min-h-0 flex-col overflow-y-auto bg-background">
      {currentStep && (
        <ExecutionTrace
          currentStep={currentStepIndex + 1}
          totalSteps={trace.length}
          onStepChange={(step) => setCurrentStepIndex(step - 1)}
        >
          <div className="flex flex-1 flex-col h-full w-full min-h-0 p-3 gap-3 overflow-hidden">
            {/* Minimalist Top Execution Step Header */}
              <ExecutionStep
                stepNumber={currentStepIndex + 1}
                line={currentStep.line}
                functionName={currentStep.function}
                expression={currentStep.expression}
                variables={currentStep.variables}
              />

            <div className="flex-1 flex flex-col gap-3 w-full min-h-0 overflow-y-auto rounded-xl border border-border/60 bg-zinc-950/80 p-3 shadow-inner">
              {dataStructures &&
                dataStructures.length > 0 &&
                dataStructures.map((dataStructure) => (
                  <div
                    key={dataStructure.name}
                    className="w-full flex-1 min-h-40 flex flex-col rounded-lg border border-border/50 bg-zinc-900/40 p-3 backdrop-blur-xs transition-all overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {dataStructure.name}
                        </span>
                      </div>

                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border border-border/60 bg-zinc-800/60 text-zinc-400 font-medium tracking-wide">
                        {dataStructure.type}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center w-full min-h-0 overflow-x-auto">
                      {dataStructure.component}
                    </div>
                  </div>
                ))}
            </div>

            {/* Bottom Variable State Dock */}
              <VariableState
                variables={currentStep.variables}
                changedVariables={currentStep.changedVariables}
              />
          </div>
        </ExecutionTrace>
      )}
    </section>
  );
}
