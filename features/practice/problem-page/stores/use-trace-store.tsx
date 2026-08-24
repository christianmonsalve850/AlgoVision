import { create } from "zustand";
import { TraceStep } from "@/lib/algovision-harness/src/runtime/types";

interface TraceState {
  trace: TraceStep[];
  currentStepIndex: number;
  isRunning: boolean;
  setTrace: (trace: TraceStep[]) => void;
  setCurrentStepIndex: (index: number | ((prev: number) => number)) => void;
  setIsRunning: (running: boolean) => void;
  resetTrace: () => void;
}

export const useTraceStore = create<TraceState>((set) => ({
  trace: [],
  currentStepIndex: 0,
  isRunning: false,
  setTrace: (trace) => set({ trace, currentStepIndex: 0 }),
  setCurrentStepIndex: (index) =>
    set((state) => ({
      currentStepIndex:
        typeof index === "function" ? index(state.currentStepIndex) : index,
    })),
  setIsRunning: (isRunning) => set({ isRunning }),
  resetTrace: () => set({ trace: [], currentStepIndex: 0, isRunning: false }),
}));