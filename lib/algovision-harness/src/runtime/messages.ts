import { TraceStep } from "./types";

export interface WorkerResponse {
  type: "INITIALIZED" | "SUCCESS" | "ERROR";
  trace?: TraceStep[];
  error?: string | Error | undefined;
  errorDetails?: any;
  duration?: number;
}

export interface WorkerRequest {
  type: "INITIALIZE" | "RUN";
  userCode?: string;
  inputs?: Record<string, unknown>;
  execution?: {
    className?: string;
    functionName?: string;
  };
}

export function normalizeWorkerError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message || "Execution failed",
      details: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      },
    };
  }

  if (typeof error === "string") {
    return {
      message: error || "Execution failed",
      details: { raw: error },
    };
  }

  if (error && typeof error === "object") {
    const maybeMessage = "message" in error ? String((error as { message?: unknown }).message) : undefined;
    return {
      message: maybeMessage || "Execution failed",
      details: error,
    };
  }

  return {
    message: String(error ?? "Execution failed"),
    details: { raw: error },
  };
}

export function createWorkerSuccessResponse(trace: TraceStep[] = [], duration?: number): WorkerResponse {
  console.log("createWorkerSuccessResponse")
  return {
    type: "SUCCESS",
    trace,
    duration,
  };
}

export function createWorkerErrorResponse(
  error: unknown,
  trace: TraceStep[] = [],
  errorDetails?: unknown,
): WorkerResponse {
  const normalized = normalizeWorkerError(error);
  console.log("createWorkerErrorResponse")
  return {
    type: "ERROR",
    trace,
    error: normalized.message,
    errorDetails: errorDetails ?? normalized.details,
  };
}