import type { SubmissionExecutionSummary } from "@/app/types/api-types";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseSubmissionSummary(
    value: unknown,
): SubmissionExecutionSummary {
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
