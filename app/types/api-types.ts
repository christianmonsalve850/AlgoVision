import { Language } from "@/features/practice/problem-page/code-editor/types";
import type { TraceCaseResult } from "@/lib/docker-runner/types";

export interface UseCodeExecuterOptions {
  operation: "run" | "submit";
  problemId: string;
  language: Language;
  sourceCode: string;
  className: string;
  functionName: string;
}


export type RunExecutionOptions = UseCodeExecuterOptions & { operation: "run" };
export type SubmitExecutionOptions = UseCodeExecuterOptions & { operation: "submit" };
export type TraceApiCaseResult = TraceCaseResult & { expectedOutput: unknown };

export interface SubmissionExecutionSummary {
    executionId: string;
    status: string;
    verdict: string;
    passed: number;
    total: number;
}