import type { UseCodeExecuterOptions } from "@/app/types/api-types";
import type { TraceStep } from "@/lib/algovision-harness/src/runtime/types";
import type { TraceCaseResult } from "@/lib/docker-runner/types";

type RunExecutionOptions = UseCodeExecuterOptions & { operation: "run" };
type SubmitExecutionOptions = UseCodeExecuterOptions & { operation: "submit" };

export interface SubmissionExecutionSummary {
    executionId: string;
    status: string;
    verdict: string;
    passed: number;
    total: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isVariableValue(value: unknown): boolean {
    if (
        value === null ||
        value === undefined ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.every(isVariableValue);
    }

    return isRecord(value) && Object.values(value).every(isVariableValue);
}

function isTraceStep(value: unknown): value is TraceStep {
    if (!isRecord(value)) {
        return false;
    }

    return (
        typeof value.step === "number" &&
        typeof value.event === "string" &&
        typeof value.line === "number" &&
        typeof value.expression === "string" &&
        typeof value.function === "string" &&
        typeof value.call_depth === "number" &&
        isRecord(value.variables) &&
        Object.values(value.variables).every(isVariableValue) &&
        Array.isArray(value.changedVariables) &&
        value.changedVariables.every((name) => typeof name === "string")
    );
}

function isTraceErrorDetails(
    value: unknown,
): value is NonNullable<TraceCaseResult["errorDetails"]> {
    return (
        isRecord(value) &&
        typeof value.type === "string" &&
        typeof value.message === "string" &&
        (typeof value.line === "number" || value.line === null)
    );
}

function parseTraceResults(value: unknown): TraceCaseResult[] {
    if (!Array.isArray(value)) {
        throw new Error("Trace API returned an invalid response.");
    }

    return value.map((result): TraceCaseResult => {
        if (
            !isRecord(result) ||
            typeof result.testCaseId !== "string" ||
            typeof result.success !== "boolean" ||
            !Array.isArray(result.trace) ||
            !result.trace.every(isTraceStep) ||
            (typeof result.duration !== "number" && result.duration !== null) ||
            (result.error !== undefined && typeof result.error !== "string") ||
            (result.errorDetails !== undefined &&
                !isTraceErrorDetails(result.errorDetails))
        ) {
            throw new Error("Trace API returned an invalid test-case result.");
        }

        const trace = result.trace.map((step) => {
            if (!isTraceStep(step)) {
                throw new Error("Trace API returned an invalid trace step.");
            }
            return step;
        });

        return {
            testCaseId: result.testCaseId,
            success: result.success,
            trace,
            duration: result.duration,
            ...(Object.hasOwn(result, "actualOutput")
                ? { actualOutput: result.actualOutput }
                : {}),
            ...(typeof result.error === "string" ? { error: result.error } : {}),
            ...(isTraceErrorDetails(result.errorDetails)
                ? { errorDetails: result.errorDetails }
                : {}),
        };
    });
}

function parseSubmissionSummary(value: unknown): SubmissionExecutionSummary {
    if (
        !isRecord(value) ||
        typeof value.executionId !== "string" ||
        typeof value.status !== "string" ||
        typeof value.verdict !== "string" ||
        typeof value.passed !== "number" ||
        typeof value.total !== "number"
    ) {
        throw new Error("Submission API returned an invalid response.");
    }

    return {
        executionId: value.executionId,
        status: value.status,
        verdict: value.verdict,
        passed: value.passed,
        total: value.total,
    };
}

export function requestExecutePython(
    options: RunExecutionOptions,
): Promise<TraceCaseResult[]>;
export function requestExecutePython(
    options: SubmitExecutionOptions,
): Promise<SubmissionExecutionSummary>;
export async function requestExecutePython ({
    operation,
    problemId,
    language,
    sourceCode,
    className,
    functionName,
} : UseCodeExecuterOptions) {
    let apiEndpoint: string;
    let mode: string;

    if (operation === "run") {
        apiEndpoint = '/api/v1/run'
        mode = "trace"
    } else if (operation === "submit") {
        apiEndpoint = '/api/v1/submit'
        mode = "grade"
    } else {
        throw new Error("Invalid python execution request.");
    }

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            problemId: problemId,
            language: language,
            sourceCode: sourceCode,
            className: className,
            functionName: functionName,
            mode: mode,
        }),
    });

    const responseBody = await response.text();
    let result: unknown;

    try {
        result = responseBody ? JSON.parse(responseBody) : null;
    } catch {
        throw new Error(
            `Execution API returned a non-JSON response (HTTP ${response.status}): ${responseBody || "empty response body"}`,
        );
    }

    if (!response.ok) {
        console.error("Execution API request failed:", {
            status: response.status,
            body: result,
        });
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Execution API response:", result);
    return operation === "run"
        ? parseTraceResults(result)
        : parseSubmissionSummary(result);
}