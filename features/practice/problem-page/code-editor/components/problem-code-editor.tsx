"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { ChevronDown, Play, RotateCcw, Send } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { languageOptions } from "@/features/practice/problem-page/code-editor/constants/languages";
import type {
  Language,
  ProblemCodeEditorPanelProps,
} from "@/features/practice/problem-page/code-editor/types";
import { useCodeEditor } from "@/features/practice/problem-page/hooks/use-code-editor";
import { useProblemRunner } from "@/features/practice/problem-page/hooks/use-problem-runner";
import { useProblemSubmitter } from "@/features/practice/problem-page/hooks/use-problem-submitter";
import { SubmissionOverlay } from "@/features/practice/problem-page/code-editor/components/submission-overlay";
import { Spinner } from "@/components/ui/spinner";
import { ExecutionStatus } from "@/features/practice/problem-page/types";
import { AIHintsDrawer } from "@/features/practice/problem-page/code-editor/components/ai-hints-drawer";

export function ProblemCodeEditor({
  isAiHintsOpen,
  onAiHintsOpenChange,
  problem_id,
  problem,
  function_name,
  class_name,
  starterCodeMap,
  onRunStart,
  onSubmitStart,
  submissionLoadRequest,
}: ProblemCodeEditorPanelProps) {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [ submissionStatus, setSubmissionStatus ] = useState<"success" | "failure" | null>(null);
  const [ executionsStatus, setExecutionStatus ] = useState<ExecutionStatus>("idle");
  const [ submissionRefreshKey, setSubmissionRefreshKey ] = useState(0);
  const [ latestExecutionId, setLatestExecutionId ] = useState<string | null>(null);
  const [ latestSubmittedCode, setLatestSubmittedCode ] = useState("");

  useEffect(() => {
    if (submissionRefreshKey > 0) {
      router.refresh();
    }
  }, [router, submissionRefreshKey]);

  const {
    code,
    language,
    handleLanguageChange,
    handleReset,
    handleEditorChange,
  } = useCodeEditor({
    problemId: problem_id,
    starterCodeMap,
  });

  const lastProcessedSubmissionRequestId = useRef<number | null>(null);

  useEffect(() => {
    if (
      !submissionLoadRequest ||
      lastProcessedSubmissionRequestId.current ===
        submissionLoadRequest.requestId
    ) {
      return;
    }

    lastProcessedSubmissionRequestId.current = submissionLoadRequest.requestId;
    const submissionCode = submissionLoadRequest.submission.source_code;

    if (
      code !== submissionCode &&
      !window.confirm(
        "Load this submission into the editor? Your current code will be replaced.",
      )
    ) {
      return;
    }

    handleEditorChange(submissionCode);
  }, [code, handleEditorChange, submissionLoadRequest]);

  const { run } = useProblemRunner({
    problemId: problem_id,
    language,
    code,
    functionName: function_name,
    className: class_name,
    setExecutionStatus,
    onRunStart,
  });

  const { submit } = useProblemSubmitter({
    problemId: problem_id,
    language,
    code,
    functionName: function_name,
    className: class_name,
    setExecutionStatus,
    onSubmitStart: () => {
      setLatestExecutionId(null);
      setLatestSubmittedCode(code);
      onSubmitStart();
    },
    onSubmitEnd: (result) => {
      setSubmissionStatus(result.success ? "success" : "failure");
      setLatestExecutionId(result.executionId ?? null);
      if (result.recorded) {
        setSubmissionRefreshKey((key) => key + 1);
      }
    },
  });

  const activeLanguage = useMemo(
    () =>
      languageOptions.find((option) => option.value === language) ??
      languageOptions[0],
    [language],
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background shadow-sm">
      <SubmissionOverlay
        status={submissionStatus}
        onClose={() => setSubmissionStatus(null)}
        durationMs={2000}
      />
      <AIHintsDrawer
        isOpen={isAiHintsOpen}
        onClose={() => onAiHintsOpenChange(false)}
        problem={problem}
        problemId={problem_id}
        userCode={latestExecutionId ? latestSubmittedCode : code}
        executionId={latestExecutionId}
      />
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <label className="relative">
              <span className="sr-only">Language</span>
              <select
                value={language}
                onChange={(event) =>
                  handleLanguageChange(event.target.value as Language)
                }
                className="appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-9 text-sm text-foreground outline-none transition-colors hover:bg-muted"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
              onClick={() => onAiHintsOpenChange(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
              <span>AI Hints</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            onClick={handleReset}
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            onClick={run}
          >
            { executionsStatus == "running" ? <Spinner /> : <Play className="size-4" />}
            Run
          </button>

          <button
            type="button"
            disabled={executionsStatus === "submitting"}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={submit}
          >
            { executionsStatus == "submitting" ? <Spinner /> : <Send className="size-4" />}
            Submit
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 bg-[#FFFFFF] dark:bg-[#1E1E1E]">
          <div className="flex m-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-sm text-foreground bg-muted px-2 py-1 rounded-sm">
              <span>{activeLanguage.fileName}</span>
            </div>
          </div>
          <div className="h-full overflow-hidden bg-background">
            <Editor
              height="100%"
              defaultLanguage="python"
              language={activeLanguage.extension}
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                roundedSelection: false,
                renderLineHighlight: "all",
                padding: { top: 16, bottom: 16 },
                tabSize: 4,
                fixedOverflowWidgets: true,
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                wordWrap: "on",
              }}
              theme={`vs-${resolvedTheme}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
