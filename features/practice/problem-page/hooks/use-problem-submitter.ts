import { useRef } from "react";
import { SubmissionResult, UseProblemSubmitterOptions, UseProblemSubmitterReturn } from "@/features/practice/problem-page/types";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import { requestExecutePython } from "@/features/practice/problem-page/services/request-code-execution";

export function useProblemSubmitter({
    problemId,
    language,
    code,
    functionName,
    className,
    setExecutionStatus,
    onSubmitStart,
    onSubmitEnd
} : UseProblemSubmitterOptions) : UseProblemSubmitterReturn {
    const setIsRunning = useTraceStore((state) => state.setIsRunning);
    const inFlightSubmission = useRef<Promise<SubmissionResult> | null>(null);

    const submit = (): Promise<SubmissionResult> => {
        if (inFlightSubmission.current) {
            return inFlightSubmission.current;
        }

        setExecutionStatus("submitting");

        const submissionPromise = Promise.resolve().then(async () => {
            try {
                setIsRunning(true);
                onSubmitStart?.();

                const result = await requestExecutePython({
                    operation: "submit",
                    problemId,
                    language,
                    sourceCode: code,
                    functionName,
                    className,
                });

                const submissionResult: SubmissionResult = {
                    success: result.verdict === "accepted",
                    recorded: true,
                    executionId: result.executionId,
                    verdict: result.verdict,
                    passed: result.passed,
                    total: result.total,
                };
                onSubmitEnd?.(submissionResult);
                return submissionResult;

            } catch (error) {
                console.error("Submission API request failed:", error);

                const submissionResult: SubmissionResult = {
                    success: false,
                    error: error instanceof Error ? error.message : "Execution failed",
                };
                onSubmitEnd?.(submissionResult);
                return submissionResult;
            } finally {
                setIsRunning(false);
                setExecutionStatus("idle");
                inFlightSubmission.current = null;
            }
        });

        inFlightSubmission.current = submissionPromise;
        return submissionPromise;
    };

    return { submit };
}