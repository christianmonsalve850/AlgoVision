import { TraceStep } from "@/lib/algovision-harness/src/runtime/types";

// Extract output or exception status from trace
export function evaluateTrace(trace: TraceStep[], targetFunction: string) {
  const safeTrace = Array.isArray(trace) ? trace : [];

  if (safeTrace.length === 0) {
    return {
      status: "error" as const,
      error: "No return value received",
      errorDetails: {
        type: "empty_trace",
        line: null,
        code: null,
        function: targetFunction,
        traceLength: 0,
        lastStep: null,
        hint:
          "The worker returned an empty trace. That usually means execution crashed before emitting a return, or the worker failed before producing runtime steps.",
      },
      actualOutput: undefined,
    };
  }

  // Check if trace ended in an exception/error
  const exceptionStep = safeTrace.find((step) => step.event === "exception");
  if (exceptionStep) {
    const details = {
      type: "exception",
      line: exceptionStep.line,
      code: exceptionStep.expression || null,
      function: exceptionStep.function,
      event: exceptionStep.event,
      exception: (exceptionStep as any)?.exception ?? null,
      message:
        (exceptionStep as any)?.exception?.message ||
        exceptionStep.expression ||
        "Runtime error",
      traceLength: safeTrace.length,
      lastStep: safeTrace[safeTrace.length - 1] ?? null,
    };

    return {
      status: "error" as const,
      error: details.message,
      errorDetails: details,
      actualOutput: undefined,
    };
  }

  // Filter for matching returns at outer base depth
  const returnEvents = safeTrace.filter(
    (step) => step.event === "return" && step.function === targetFunction,
  );

  if (returnEvents.length === 0) {
    const lastStep = safeTrace[safeTrace.length - 1];
    const details = {
      type: "no_return_value",
      line: lastStep?.line ?? null,
      code: lastStep?.expression ?? null,
      function: lastStep?.function ?? targetFunction,
      traceLength: safeTrace.length,
      lastStep: lastStep ?? null,
      hint:
        "The target function never produced a return value. This usually means it exited early, hit a branch that never returned, or the function name did not match the executed method.",
    };

    return {
      status: "error" as const,
      error: "No return value received",
      errorDetails: details,
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