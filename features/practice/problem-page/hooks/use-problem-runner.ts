import { UseProblemRunnerOptions, UseProblemRunnerReturn } from "@/features/practice/problem-page/types";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import { executeProblem } from "@/features/practice/problem-page/services/execute-problem";

export function useProblemRunner ({
    code,
    visibleTestCases,
    functionName,
    className,
    onRunStart,
} : UseProblemRunnerOptions ) : UseProblemRunnerReturn {
    const setIsRunning = useTraceStore((state) => state.setIsRunning);
    const setTraceForCase = useTraceStore((state) => state.setTraceForCase);
    
    const run = async () => {
        try {
            setIsRunning(true);
            onRunStart?.();
            const results = await executeProblem({
                code,
                testCases: visibleTestCases,
                functionName,
                className,
            });
            for (const result of results) {
                setTraceForCase(result.testCaseId, result.trace, result.testResult);
            } 
        } catch (error) {
          console.error("executeTrace error:", error);
        } finally {
          setIsRunning(false);
        }
      };
    return { run };
}