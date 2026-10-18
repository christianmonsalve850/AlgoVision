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

    const submit = async (): Promise<SubmissionResult> => {
        setExecutionStatus("submitting");
        let submissionResult: SubmissionResult;

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

            submissionResult = {
                success: result.verdict === "accepted",
                recorded: true,
                verdict: result.verdict,
                passed: result.passed,
                total: result.total,
            };
            onSubmitEnd?.(submissionResult);
            return submissionResult;

        } catch (error) {
          console.error("Submission API request failed:", error);

          submissionResult = {
                success: false,
                error: error instanceof Error ? error.message : "Execution failed",
            };
            onSubmitEnd?.(submissionResult);
            return submissionResult;
        } finally {
          setIsRunning(false);
          setExecutionStatus("idle")
        }
      };
    return { submit };
}