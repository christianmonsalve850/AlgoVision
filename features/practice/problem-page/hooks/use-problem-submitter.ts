import { SubmissionResult, UseProblemSubmitterOptions, UseProblemSubmitterReturn } from "@/features/practice/problem-page/types";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import { executeProblem } from "@/features/practice/problem-page/services/execute-problem";

export function useProblemSubmitter({
    code,
    visibleTestCases,
    hiddenTestCases,
    functionName,
    className,
    onRunStart,
} : UseProblemSubmitterOptions) : UseProblemSubmitterReturn {
    const setIsRunning = useTraceStore((state) => state.setIsRunning);
    const setTraceForCase = useTraceStore((state) => state.setTraceForCase);

    const submit = async (): Promise<SubmissionResult> => {
        try {
            setIsRunning(true);
            onRunStart?.();

            const visibleTestCaseResults  = await executeProblem({
                code,
                testCases: visibleTestCases,
                functionName,
                className,
            });

            for (const result of visibleTestCaseResults) {
                if (!result.testResult?.passed) {
                    return {
                        success: false,
                        failedTestCase: result.testResult,
                    };
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
                    return {
                        success: false,
                        failedTestCase: result.testResult,
                    };
                }
            } 

            return { success: true };

        } catch (error) {
          console.error("executeTrace error:", error);

          return {
            success: false,
            error: error instanceof Error ? error.message : "Execution failed",
        };
        } finally {
          setIsRunning(false);
        }
      };
    return { submit };
}