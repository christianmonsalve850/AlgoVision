import { useMemo, useState } from "react";
import { VariableState } from "@/features/practice/problem-page/visualization/components/common/variable-state";
import { ExecutionStep } from "@/features/practice/problem-page/visualization/components/common/execution-step";
import { ExecutionTrace } from "@/features/practice/problem-page/visualization/components/common/execution-trace";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import {
  filterUserTrace,
  returnVisualizer,
} from "@/features/practice/problem-page/visualization/utils";
import { VisualizationPlaceholder } from "@/features/practice/problem-page/visualization/components/common/visualization-placeholder";
import type { TraceStep } from "@/lib/algovision-harness/src/runtime/types";
import {
  ArrayViewToggle,
  ArrayViewMode,
} from "@/features/practice/problem-page/visualization/components/visualizers/array-mode-toggle";

const EMPTY_TRACE: TraceStep[] = [];

export function ProblemVisualizationPanel() {
  const activeTrace = useTraceStore(
    (state) =>
      (state.activeCaseId
        ? state.tracesByCaseId[state.activeCaseId]
        : undefined) ?? EMPTY_TRACE,
  );
  const trace = filterUserTrace(activeTrace);
  const currentStepIndex = useTraceStore((state) => state.currentStepIndex);

  const setCurrentStepIndex = useTraceStore(
    (state) => state.setCurrentStepIndex,
  );

  const currentStep = trace[currentStepIndex];

  const [arrayModes, setArrayModes] = useState<Record<string, ArrayViewMode>>(
    {},
  );

  const updateArrayMode = (arrayName: string, mode: ArrayViewMode) => {
    setArrayModes((currentModes) => ({
      ...currentModes,
      [arrayName]: mode,
    }));
  };

  const dataStructures = useMemo(() => {
    if (!currentStep) return [];

    // Get all rendered visualizers for the current step
    const visualizers = returnVisualizer(currentStep, arrayModes);

    return visualizers.map((viz) => ({
      name: viz.name,
      type: viz.type,
      component: viz.visualization,
    }));
  }, [arrayModes, currentStep]);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-y-auto bg-background">
      {currentStep ? (
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

            <div className="flex-1 flex flex-col gap-3 w-full min-h-0 overflow-y-auto p-1 rounded-xl bg-background shadow-inner">
              {dataStructures &&
                dataStructures.length > 0 &&
                dataStructures.map((dataStructure) => (
                  <div
                    key={dataStructure.name}
                    className="w-full shrink-0 min-h-40 flex flex-col rounded-lg border border-border bg-background p-3 backdrop-blur-xs transition-all"
                  >
                    <div className="flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {dataStructure.name}
                        </span>
                      </div>

                      {dataStructure.type === "array" && (
                        <ArrayViewToggle
                          mode={arrayModes[dataStructure.name] ?? "cells"}
                          onModeChange={(mode) =>
                            updateArrayMode(dataStructure.name, mode)
                          }
                        />
                      )}

                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border border-border bg-accent text-muted-foreground font-medium tracking-wide">
                        {dataStructure.type}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center w-full min-h-0 max-h-60 overflow-auto">
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
      ) : (
        <VisualizationPlaceholder />
      )}
    </section>
  );
}
