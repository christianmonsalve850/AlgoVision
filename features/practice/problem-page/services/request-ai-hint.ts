import type { HintOptions, ReturnHint } from "@/app/types/api-types";

export class HintRequestError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly resetDate?: string,
    ) {
        super(message);
        this.name = "HintRequestError";
    }
}

function isReturnHint(value: unknown): value is { hint: string; revealsSolution: boolean } {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        "hint" in value &&
        typeof value.hint === "string" &&
        "revealsSolution" in value &&
        typeof value.revealsSolution === "boolean"
    );
}

export async function requestAiHint({
    problemId,
    problem,
    userCode,
    executionId,
    hintLevel,
    timeZone
}: HintOptions) : Promise<ReturnHint> {
    const response = await fetch('/api/v1/hints', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            problemId,
            problem,
            userCode,
            executionId,
            hintLevel,
            timeZone,
        }),
    });

    const responseBody = await response.text();

    let result: unknown;

    try {
        result = responseBody ? JSON.parse(responseBody) : null;
    } catch {
        throw new Error(
            `Hint API returned a non-JSON response (HTTP ${response.status}): ${responseBody || "empty response body"}`,
        );
    }

    if (!response.ok) {
        const errorBody =
            typeof result === "object" && result !== null && !Array.isArray(result)
                ? result
                : null;
        throw new HintRequestError(
            errorBody && "error" in errorBody && typeof errorBody.error === "string"
                ? errorBody.error
                : `HTTP error! status: ${response.status}`,
            response.status,
            errorBody &&
                "resetDate" in errorBody &&
                typeof errorBody.resetDate === "string"
                ? errorBody.resetDate
                : undefined,
        );
    }

    if (!isReturnHint(result)) {
        throw new Error(
            `Hint API returned an invalid response shape (HTTP ${response.status}).`,
        );
    }

    return result;
}