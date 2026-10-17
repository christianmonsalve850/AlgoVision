import type { UseCodeExecuterOptions } from "@/app/types/api-types";

export async function requestCodeExecution ({
    problemId,
    language,
    sourceCode,
    className,
    functionName,
    mode,
} : UseCodeExecuterOptions) {
    const response = await fetch('/api/v1/executions', {
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
    return result;
}