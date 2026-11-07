"use client";

import { useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Lock, Settings, RotateCcw } from "lucide-react";
import Guidelines from "@/features/interview/assessment/components/Guidelines";
import Description from "@/features/interview/assessment/components/Description";
import type {
  ProblemTab,
  AssessmentBodyProps,
} from "@/features/interview/assessment/types";
import { useAssessmentEditor } from "@/features/interview/assessment/hooks/use-assessment-editor";
import { EditorPanel } from "@/features/interview/assessment/components/EditorPanel";

const EMPTY_STARTER_CODE_MAP = {};

export default function AssessmentBody({
  sessionId,
  language,
  problems,
  currentProblemIndex,
  starterCodeMaps,
  runRequest,
  onExecutionRunningChange,
}: AssessmentBodyProps) {
  const [problemTab, setProblemTab] = useState<ProblemTab>("description");

  const currentProblem = problems[currentProblemIndex];

  const {
    code,
    handleReset,
    handleEditorChange,
  } = useAssessmentEditor({
    sessionId,
    problemId: currentProblem?.id ?? "",
    language,
    starterCodeMap: currentProblem
      ? starterCodeMaps[currentProblem.id] ?? EMPTY_STARTER_CODE_MAP
      : EMPTY_STARTER_CODE_MAP,
  });

  return (
    <section className="flex h-full min-h-0 flex-1">
      <Group
        orientation="horizontal"
        defaultLayout={{ "assessment-details": 30, "assessment-editor": 70 }}
        className="h-full min-h-0 flex-1"
      >
        <Panel
          id="assessment-details"
          defaultSize={30}
          minSize="25%"
          maxSize="50%"
          className="flex min-h-0 min-w-0 flex-col overflow-hidden"
        >
          <div className="flex h-12 shrink-0 items-stretch gap-4 border-b border-border px-6">
            <button
              type="button"
              className={`relative h-full text-sm font-semibold capitalize ${problemTab === "description" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setProblemTab("description")}
            >
              Description
              {problemTab === "description" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />
              )}
            </button>
            <button
              type="button"
              className={`relative h-full text-sm font-semibold capitalize ${problemTab === "guidelines" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setProblemTab("guidelines")}
            >
              Guidelines
              {problemTab === "guidelines" && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />
              )}
            </button>
          </div>
          <div className="p-6">
            {problemTab === "description" && currentProblem ? (
              <Description
                problem={currentProblem}
                problemNumber={currentProblemIndex + 1}
                problemCount={problems.length}
              />
            ) : problemTab === "description" ? (
              <p className="text-sm text-muted-foreground">
                No problems are available for this assessment.
              </p>
            ) : (
              <Guidelines />
            )}
          </div>
        </Panel>

        <Separator className="group relative flex w-2 self-stretch items-center justify-center border-x border-border bg-transparent transition-colors hover:bg-muted/40 active:bg-muted/60">
          <div className="h-8 w-1 rounded-full bg-border/60 transition-colors group-hover:bg-emerald-400 group-active:bg-emerald-500" />
        </Separator>

        <Panel
          id="assessment-editor"
          defaultSize={70}
          minSize="35%"
          className="flex min-h-0 min-w-0 flex-col overflow-hidden"
        >
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6">
            <div
              className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground"
              title="Language selected during interview setup"
            >
              <span>{language}</span>
              <Lock
                aria-hidden="true"
                className="size-3.5 text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Reset code"
                title="Reset code"
                onClick={handleReset}
                className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Editor settings"
                title="Editor settings"
                className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Settings aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            <EditorPanel
              key={currentProblem?.id}
              code={code}
              language={language}
              onCodeChange={handleEditorChange}
              problemId={currentProblem?.id ?? ""}
              functionParameters={currentProblem?.functionParameters ?? []}
              functionParameterDefaults={
                currentProblem?.functionParameterDefaults ?? {}
              }
              defaultParameterExpectedOutput={
                currentProblem?.defaultParameterExpectedOutput
              }
              runRequest={runRequest}
              onExecutionRunningChange={onExecutionRunningChange}
            />
          </div>
        </Panel>
      </Group>
    </section>
  );
}
