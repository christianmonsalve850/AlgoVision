import clsx from "clsx";

import { ProblemTestCaseTabProps } from "@/features/practice/problem-page/code-editor/types";

export function ProblemTestCasePill({ testCase, selected, onSelect }: ProblemTestCaseTabProps) {

  return (
    <button
      type="button"
      onClick={() => onSelect(testCase.id)}
      aria-pressed={selected}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs transition-all border-border",
        selected && "bg-accent text-accent-foreground shadow-sm hover:bg-accent/80 border-accent-foreground/20",
        !selected && "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <span className="font-medium">Case {testCase.id}</span>
    </button>
  );
}
