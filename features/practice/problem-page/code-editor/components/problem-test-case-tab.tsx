import clsx from "clsx";

import { getTestCaseMeta } from "@/features/practice/problem-page/code-editor/utils/test-case-utils";
import { ProblemTestCaseTabProps } from "@/features/practice/problem-page/code-editor/types";

export function ProblemTestCaseTab({ testCase, selected, onSelect }: ProblemTestCaseTabProps) {
  const meta = getTestCaseMeta(testCase.status);

  return (
    <button
      type="button"
      onClick={() => onSelect(testCase.id)}
      aria-pressed={selected}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs transition-all border-border",
        selected && "bg-foreground text-background shadow-sm",
        !selected && "bg-background text-foreground hover:bg-muted"
      )}
    >
      <span
        className={clsx(
          "h-2 w-2 rounded-full ring-2", 
          meta.dot, 
          meta.ring
        )}
        aria-hidden="true"
      />
      <span className="font-medium">Case {testCase.id}</span>
    </button>
  );
}
