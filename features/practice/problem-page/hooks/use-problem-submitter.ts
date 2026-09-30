import { SubmissionResult, UseProblemSubmitterOptions, UseProblemSubmitterReturn } from "@/features/practice/problem-page/types";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import { executeProblem } from "@/features/practice/problem-page/services/execute-problem";

export function useProblemSubmitter({
    code,
    visibleTestCases,
    hiddenTestCases,
    functionName,
    className,
    onSubmitStart,
    onSubmitEnd
} : UseProblemSubmitterOptions) : UseProblemSubmitterReturn {
    const setIsRunning = useTraceStore((state) => state.setIsRunning);
    const setTraceForCase = useTraceStore((state) => state.setTraceForCase);

    const submit = async (): Promise<SubmissionResult> => {
        let submissionResult: SubmissionResult;

        try {
            setIsRunning(true);
            onSubmitStart?.();

            const visibleTestCaseResults  = await executeProblem({
                code,
                testCases: visibleTestCases,
                functionName,
                className,
            });

            for (const result of visibleTestCaseResults) {
                if (!result.testResult?.passed) {
                    submissionResult = {
                        success: false,
                        failedTestCase: result.testResult,
                    };
                    onSubmitEnd?.(submissionResult);
                }
                setTraceForCase(result.testCaseId, result.trace, result.testResult);
            } 

            const hiddenTestCaseResults = await executeProblem({
                code,
                testCases: hiddenTestCases,
                functionName,
                className
            })

            for (const result of hiddenTestCaseResults) {
                if (!result.testResult?.passed) {
                    submissionResult = {
                        success: false,
                        failedTestCase: result.testResult,
                    };
                    onSubmitEnd?.(submissionResult);
                }
            } 

            submissionResult = { success: true };
            onSubmitEnd?.(submissionResult);
            return submissionResult;

        } catch (error) {
          console.error("executeTrace error:", error);

          submissionResult = {
                success: false,
                error: error instanceof Error ? error.message : "Execution failed",
            };
            onSubmitEnd?.(submissionResult);
            return submissionResult;
        } finally {
          setIsRunning(false);
        }
      };
    return { submit };
}