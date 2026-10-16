import { TestCase } from "@/features/practice/problem-page/code-editor/types";

interface Result {
    testCaseId: string;
    status: string;
    passed: boolean;
    actualOutput: unknown;
    expectedOutput: unknown;
    stdout: string;
    error?: string;
    errorType?: string;
}

export interface ExecutionPayload {
    executionId: string;
    problemId: string;
    sourceCode: string;
    className: string;
    functionName: string;
    testCases: TestCase[];
}

export interface ExecutionResult {
    status: string;
    verdict: string;
    passed: number;
    total: number;
    results: Result[];
}