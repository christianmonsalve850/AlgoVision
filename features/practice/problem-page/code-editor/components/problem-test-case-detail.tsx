import { TestCase } from "@/features/practice/problem-page/code-editor/types";
import { serializeErrorReport } from "@/features/practice/problem-page/utils/serialize-error";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";

export function ProblemTestCaseDetail({
  testCase,
}: { testCase: TestCase }) {
  const testStatus = useTraceStore(state => state.testStatusByCaseId[testCase.id]);
  
  console.log(testStatus)
  const actualOutputText =
    testStatus?.actualOutput !== undefined
      ? JSON.stringify(testStatus.actualOutput)
      : testStatus?.error || testStatus?.errorDetails
      ? serializeErrorReport(testStatus.error, testStatus.errorDetails)
      : "Run code to see actual output";

  return (
    <div className="bg-background space-y-4">
      {/* Inputs Section */}
      <div className="space-y-3">
        {Object.entries(testCase.input).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="overflow-x-auto whitespace-pre-wrap text-xs font-medium text-muted-foreground">
              {`${key} =`}
            </span>
            <span className="mt-1 block w-full rounded-md bg-accent px-4 py-3 text-xs font-mono text-foreground">
              {JSON.stringify(value)}
            </span>
          </div>
        ))}
      </div>

      {/* Expected Output Section */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          Expected Output =
        </span>
        <span className="mt-1 block w-full rounded-md bg-accent px-4 py-3 text-xs font-mono text-foreground">
          {testCase.expected_output !== undefined
            ? JSON.stringify(testCase.expected_output)
            : "—"}
        </span>
      </div>

      {/* Actual Output Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Actual Output =
          </span>
          {testStatus?.status && (
            <span
              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                testStatus.status === "passed"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                  : testStatus.status === "error"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                  : "border-red-500/30 bg-red-500/10 text-red-500"
              }`}
            >
              {testStatus.status}
            </span>
          )}
        </div>
        
        <span
          className={`mt-1 block w-full whitespace-pre-wrap wrap-break-word rounded-md px-4 py-3 text-xs font-mono transition-colors ${
            testStatus?.status === "passed"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : testStatus?.status === "failed" || testStatus?.status === "error"
              ? "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
              : "bg-accent text-muted-foreground italic"
          }`}
        >
          {actualOutputText}
        </span>
      </div>
    </div>
  );
}
