import { TestCaseStatus } from "@/features/practice/problem-page/code-editor/types";

export function getTestCaseMeta(status: TestCaseStatus) {
  if (status === "passed") {
    return {
      dot: "bg-emerald-500",
      ring: "ring-emerald-500/20",
    };
  }

  if (status === "failed") {
    return {
      dot: "bg-rose-500",
      ring: "ring-rose-500/20",
    };
  }

  return {
    dot: "bg-muted-foreground/60",
    ring: "ring-border/60",
  };
}