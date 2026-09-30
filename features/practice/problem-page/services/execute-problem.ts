import { executeTraceForTestCases } from "@/lib/algovision-harness/src/script";
import { ExecuteProblemOptions, ExecuteProblemReturn } from "@/features/practice/problem-page/types";
import { evaluateTrace } from "@/features/practice/problem-page/utils/evaluate-trace";
import { isEqual } from "@/features/practice/problem-page/utils/compare-output";
import { TestResult } from "@/features/practice/problem-page/code-editor/types";

export async function executeProblem({
  code,
  visibleTestCases,
  functionName,
  className,
} : ExecuteProblemOptions ) : Promise<ExecuteProblemReturn[]> {
  const executionDetails = {
    className: className,
    functionName: functionName,
  };

  const outcomes = await executeTraceForTestCases(
    code,
    visibleTestCases,
    executionDetails,
  );

  const gradedResults = outcomes.map((outcome) => {
    const testCase = visibleTestCases.find((tc) => tc.id === outcome.testCaseId);

    if (!outcome.success || outcome.error) {
      return {
        ...outcome,
        passed: false,
        status: "error" as const,
        actualOutput: undefined,
        expectedOutput: testCase?.expected_output,
        error:
          typeof outcome.error === "string"
            ? outcome.error
            : "Execution failed",
        errorDetails: outcome.errorDetails ?? outcome.error,
      };
    }

    const evalResult = evaluateTrace(outcome.trace ?? [], functionName);

    let isPassed = false;
    let status: "passed" | "failed" | "error" = "failed";

    if (evalResult.status === "error") {
      status = "error";
    } else {
      isPassed = isEqual(evalResult.actualOutput, testCase?.expected_output);
      status = isPassed ? "passed" : "failed";
    }

    return {
      ...outcome,
      passed: isPassed,
      status, // "passed" | "failed" | "error"
      actualOutput: evalResult.actualOutput,
      expectedOutput: testCase?.expected_output,
      error: evalResult.error,
      errorDetails: evalResult.errorDetails,
    };
  });

  const executeProblemReturn = [];
  // Update state/store
  for (const result of gradedResults) {
    const testResult = {
      passed: result.passed,
      status: result.status,
      actualOutput: result.actualOutput,
      expectedOutput: result.expectedOutput,
      error: result.error,
      errorDetails: result.errorDetails,
    } as TestResult;

     executeProblemReturn.push({
      testCaseId: result.testCaseId,
      trace: testResult?.error ? [] : result.trace,
      testResult: testResult
    });
  }

  return executeProblemReturn as ExecuteProblemReturn[];
}
