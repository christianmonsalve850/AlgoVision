import { TraceStep } from "@/lib/algovision-harness/src/runtime/types";

// Safely evaluate equality across primitives, arrays, and objects
export function isEqual(actual: any, expected: any): boolean {
  try {
    return JSON.stringify(actual) === JSON.stringify(expected);
  } catch {
    return actual === expected;
  }
}

// Extract output or exception status from trace
export function evaluateTrace(trace: TraceStep[], targetFunction: string) {
  // Check if trace ended in an exception/error
  const exceptionStep = trace.find((step) => step.event === "exception");
  if (exceptionStep) {
    return {
      status: "error" as const,
      error: exceptionStep.expression || "Runtime Error",
      actualOutput: undefined,
    };
  }

  // Filter for matching returns at outer base depth
  const returnEvents = trace.filter(
    (step) => step.event === "return" && step.function === targetFunction
  );

  if (returnEvents.length === 0) {
    return {
      status: "error" as const,
      error: "No return value received",
      actualOutput: undefined,
    };
  }

  const minDepth = Math.min(...returnEvents.map((step) => step.call_depth));
  const outerReturns = returnEvents.filter((step) => step.call_depth === minDepth);
  const actualOutput = outerReturns[outerReturns.length - 1]?.return_value;

  return {
    status: "success" as const,
    actualOutput,
  };
}