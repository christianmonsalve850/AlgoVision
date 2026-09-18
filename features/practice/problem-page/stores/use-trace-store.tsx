import { create } from "zustand";
import { TraceStep } from "@/lib/algovision-harness/src/runtime/types";

export type TestResult =
  | {
      passed: boolean;
      status: "passed" | "error" | "failed";
      actualOutput: any;
    }
  | undefined;

interface TraceState {
  // Map of test case ID to its corresponding trace steps
  tracesByCaseId: Record<string, TraceStep[]>;
  testStatusByCaseId: Record<string, TestResult>;
  activeCaseId: string | null;
  currentStepIndex: number;
  isRunning: boolean;

  // Actions
  setTraceForCase: (
    caseId: string,
    trace: TraceStep[],
    testResult: TestResult,
  ) => void;
  setActiveCaseId: (caseId: string) => void;
  setCurrentStepIndex: (
    index: number | ((prevIndex: number) => number),
  ) => void;
  setIsRunning: (isRunning: boolean) => void;
  resetTraces: () => void;
}

export const useTraceStore = create<TraceState>((set) => ({
  tracesByCaseId: {},
  testStatusByCaseId: {},
  activeCaseId: null,
  currentStepIndex: 0,
  isRunning: false,

  setTraceForCase: (caseId, trace, testStatus) =>
    set((state) => ({
      tracesByCaseId: { ...state.tracesByCaseId, [caseId]: trace },
      testStatusByCaseId: { ...state.testStatusByCaseId, [caseId]: testStatus },
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
