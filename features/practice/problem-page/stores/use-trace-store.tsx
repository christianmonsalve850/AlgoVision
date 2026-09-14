import { create } from "zustand";
import { TraceStep } from "@/lib/algovision-harness/src/runtime/types";

interface TraceState {
  // Map of test case ID to its corresponding trace steps
  tracesByCaseId: Record<string, TraceStep[]>;
  activeCaseId: string | null;
  currentStepIndex: number;
  isRunning: boolean;

  // Actions
  setTraceForCase: (caseId: string, trace: TraceStep[]) => void;
  setActiveCaseId: (caseId: string) => void;
  setCurrentStepIndex: (
    index: number | ((prevIndex: number) => number)
  ) => void;
  setIsRunning: (isRunning: boolean) => void;
  resetTraces: () => void;
}
export const useTraceStore = create<TraceState>((set) => ({
  tracesByCaseId: {},
  activeCaseId: null,
  currentStepIndex: 0,
  isRunning: false,

  // Set or update the trace for a specific test case ID
  setTraceForCase: (caseId, trace) =>
    set((state) => ({
      tracesByCaseId: {
        ...state.tracesByCaseId,
        [caseId]: trace,
      },
    })),

  // Switch active case without wiping stored traces
  setActiveCaseId: (caseId) =>
    set({
      activeCaseId: caseId,
      currentStepIndex: 0,
    }),

  setCurrentStepIndex: (index) =>
    set((state) => ({
      currentStepIndex:
        typeof index === "function" ? index(state.currentStepIndex) : index,
    })),

  setIsRunning: (isRunning) => set({ isRunning }),

  resetTraces: () =>
    set({
      tracesByCaseId: {},
      activeCaseId: null,
      currentStepIndex: 0,
      isRunning: false,
    }),
}));