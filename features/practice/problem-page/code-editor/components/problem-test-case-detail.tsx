import { TestCase } from "@/features/practice/problem-page/code-editor/types";

export function ProblemTestCaseDetail({testCase} : {testCase : TestCase}) {
  return (
    <div className="bg-background">
      <div className="space-y-3">
        {Object.entries(testCase.input).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1">
            <span
              className="overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground"
            >
              {`${key} =`}
            </span>
            <span 
              className="mt-1 block w-full rounded-md bg-accent px-4 py-3 text-xs text-foreground font-mono">
              {JSON.stringify(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
