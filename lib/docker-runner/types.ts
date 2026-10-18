import { TestCase } from "@/features/practice/problem-page/code-editor/types";
import type { TraceStep } from "@/lib/trace-types";

interface ExecutionPayloadBase {
    problemId: string;
    sourceCode: string;
    className: string;
    functionName: string;
}

export interface GradeExecutionPayload extends ExecutionPayloadBase {
    operation: "grade";
    executionId: string;
    testCases: TestCase[];
}

export interface TraceExecutionPayload extends ExecutionPayloadBase {
    operation: "trace";
    testCases: TraceTestCase[];
}

export interface TraceTestCase {
    id: string;
    input: Record<string, unknown> | unknown[];
}

export type ExecutionPayload = GradeExecutionPayload | TraceExecutionPayload;

interface GradeTestCaseResult {
    testCaseId: string;
    status: string;
    passed: boolean;
    actualOutput: unknown;
    expectedOutput: unknown;
    stdout: string;
    error?: string;
    errorType?: string;
}

export interface GradeExecutionResult {
    status: string;
    verdict: string;
    passed: number;
    total: number;
    results: GradeTestCaseResult[];
}

export interface TraceCaseResult {
    testCaseId: string;
    success: boolean;
    trace: TraceStep[];
    duration: number | null;
    expectedOutput?: unknown;
    actualOutput?: unknown;
    error?: string;
    errorDetails?: {
        type: string;
        message: string;
        line: number | null;
    };
}

export type ExecutionResult = GradeExecutionResult | TraceCaseResult[];