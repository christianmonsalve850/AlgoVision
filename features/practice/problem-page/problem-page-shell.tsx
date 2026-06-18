import { ProblemEditorPanel } from "./problem-editor-panel";
import { ProblemSidebar } from "./problem-sidebar";
import { ProblemVisualizationPanel } from "./problem-visualization-panel";
import type { ProblemPageData } from "./types";

type ProblemPageShellProps = ProblemPageData;

export function ProblemPageShell({ problem, examples }: ProblemPageShellProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-12 bg-background">
      <ProblemSidebar problem={problem} examples={examples} />
      <ProblemEditorPanel />
      <ProblemVisualizationPanel />
    </div>
  );
}
