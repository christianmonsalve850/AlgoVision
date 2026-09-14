import { TraceStep } from "./types";

export interface WorkerResponse {
  type: "INITIALIZED" | "SUCCESS" | "ERROR";
  trace?: TraceStep[];
  error?: string;
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

export function createWorkerSuccessResponse(trace: TraceStep[] = [], duration?: number): WorkerResponse {
  return {
    type: "SUCCESS",
    trace,
    duration,
  };
}

export function createWorkerErrorResponse(error: string): WorkerResponse {
  return {
    type: "ERROR",
    error,
  };
}