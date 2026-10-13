import { UseCodeExecuterOptions } from "@/features/practice/problem-page/types";

export async function requestCodeExecution ({
    problemId,
    language,
    sourceCode,
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
            mode: mode,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}