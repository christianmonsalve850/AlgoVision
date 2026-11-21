import { useRef } from "react";
import type {
    ExecutionStatus,
    SubmissionResult,
    UseProblemSubmitterReturn,
} from "@/features/practice/problem-page/types";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import { requestSubmit } from "@/features/interview/assessment/services/request-submit";
import type { Language } from "@/features/practice/problem-page/problem/types";

interface AssessmentProblemSubmitterOptions {
    sessionId: string;
    problemOrderIndex: number;
    problemId: string;
    language: Language;
    code: string;
    setExecutionStatus: React.Dispatch<React.SetStateAction<ExecutionStatus>>;
    onSubmitStart?: () => void;
    onSubmitEnd?: (result: SubmissionResult) => void;
}

export function useProblemSubmitter({
    sessionId,
    problemOrderIndex,
    problemId,
    language,
    code,
    setExecutionStatus,
    onSubmitStart,
    onSubmitEnd,
} : AssessmentProblemSubmitterOptions) : UseProblemSubmitterReturn {
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

                const result = await requestSubmit({
                    sessionId,
                    problemOrderIndex,
                    problemId,
                    language,
                    code,
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