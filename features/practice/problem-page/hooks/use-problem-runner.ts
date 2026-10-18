import { UseProblemRunnerOptions, UseProblemRunnerReturn } from "@/features/practice/problem-page/types";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import { requestExecutePython } from "@/features/practice/problem-page/services/request-code-execution";
import { evaluateTrace } from "@/features/practice/problem-page/utils/evaluate-trace";
import { isEqual } from "@/features/practice/problem-page/utils/compare-output";
import type { TestResult } from "@/features/practice/problem-page/code-editor/types";

export function useProblemRunner ({
    code,
    problemId,
    language,
    visibleTestCases,
    functionName,
    className,
    setExecutionStatus,
    onRunStart,
} : UseProblemRunnerOptions ) : UseProblemRunnerReturn {
    const setIsRunning = useTraceStore((state) => state.setIsRunning);
    const setTraceForCase = useTraceStore((state) => state.setTraceForCase);
    
    const run = async () => {
      setExecutionStatus("running");
        try {
            setIsRunning(true);
            onRunStart?.();
            const results = await requestExecutePython({
                operation: "run",
                problemId,
                language,
                sourceCode: code,
                functionName,
                className,
            });
            for (const result of results) {
                const testCase = visibleTestCases.find(
                    (candidate) => candidate.id === result.testCaseId,
                );
                let testResult: TestResult;

                if (!result.success || result.error) {
                    testResult = {
                        passed: false,
                        status: "error",
                        actualOutput: undefined,
                        expectedOutput: testCase?.expected_output,
                        error: result.error ?? "Execution failed",
                        errorDetails: result.errorDetails ?? result.error,
                    };
                } else {
                    const evaluation = evaluateTrace(result.trace, functionName);
                    const passed =
                        evaluation.status === "success" &&
                        isEqual(evaluation.actualOutput, testCase?.expected_output);

                    testResult = {
                        passed,
                        status:
                            evaluation.status === "error"
                                ? "error"
                                : passed
                                  ? "passed"
                                  : "failed",
                        actualOutput:
                            evaluation.status === "success"
                                ? evaluation.actualOutput
                                : undefined,
                        expectedOutput: testCase?.expected_output,
                        error:
                            evaluation.status === "error"
                                ? evaluation.error
                                : undefined,
                        errorDetails:
                            evaluation.status === "error"
                                ? evaluation.errorDetails
                                : undefined,
                    };
                }

                setTraceForCase(
                    result.testCaseId,
                    testResult?.error ? [] : result.trace,
                    testResult,
                );
            }
        } catch (error) {
          console.error("executeTrace error:", error);
        } finally {
          setIsRunning(false);
          setExecutionStatus("idle");
        }
      };
    return { run };
}