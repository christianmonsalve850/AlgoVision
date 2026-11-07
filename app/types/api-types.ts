import { Language } from "@/features/practice/problem-page/code-editor/types";
import type { TraceCaseResult } from "@/lib/docker-runner/types";
import type { Difficulty, Duration } from "@/features/interview/types";
import type { SupportedLanguage } from "@/features/code-editor/languages";

export interface UseCodeExecuterOptions {
  operation: "run" | "submit";
  problemId: string;
  language: Language;
  sourceCode: string;
  className: string;
  functionName: string;
}

export type RunExecutionOptions = UseCodeExecuterOptions & { operation: "run" };
export type SubmitExecutionOptions = UseCodeExecuterOptions & {
  operation: "submit";
};
export type TraceApiCaseResult = TraceCaseResult & { expectedOutput: unknown };

export interface SubmissionExecutionSummary {
  executionId: string;
  status: string;
  verdict: string;
  passed: number;
  total: number;
}

export type Problem = {
  title: string;
  description: string;
  constraints: string[];
};

export type HintLevel = 1 | 2 | 3;

export interface HintOptions {
  problemId: string;
  problem: Problem;
  userCode: string;
  executionId: string | null;
  hintLevel: HintLevel;
  timeZone: string;
}

export type ReturnHint =
  | {
      hint: string;
      revealsSolution: boolean;
    }
  | null
  | undefined
  | void;

export interface RequestStartSessionOptions {
  difficulties: Difficulty[];
  duration: Duration;
  problemCount: number;
  language: SupportedLanguage;
}

export type StartSessionResponse = {
  sessionId: string;
};
