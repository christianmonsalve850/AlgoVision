import type { HintOptions, ReturnHint } from "@/app/types/api-types";

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
    problem,
    userCode,
    failedTests,
    requestedHintType,
}: HintOptions) : Promise<ReturnHint> {
    const response = await fetch('/api/v1/hints', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            problem,
            userCode,
            failedTests,
            requestedHintType,
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
        console.error("Fetch hint API request failed:", {
            status: response.status,
            body: result,
        });
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!isReturnHint(result)) {
        throw new Error(
            `Hint API returned an invalid response shape (HTTP ${response.status}).`,
        );
    }

    return result;
}