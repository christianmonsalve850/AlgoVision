"use client";

import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { ChevronDown, Play, RotateCcw, X } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { languageOptions } from "@/features/practice/problem-page/code-editor/constants/languages";
import type {
  Language,
  ProblemCodeEditorPanelProps,
} from "@/features/practice/problem-page/code-editor/types";
import { useCodeEditor } from "@/features/practice/problem-page/hooks/use-code-editor";
import { useProblemRunner } from "@/features/practice/problem-page/hooks/use-problem-runner";

export function ProblemCodeEditor({
  problem_id,
  function_name,
  class_name,
  starterCodeMap,
  testCases,
  setIsOpenConsole,
}: ProblemCodeEditorPanelProps) {
  const { resolvedTheme } = useTheme();
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

  const { run } = useProblemRunner({
    code,
    testCases,
    functionName: function_name,
    className: class_name,
    onRunStart: () => setIsOpenConsole(true),
  });
  
  const activeLanguage = useMemo(
    () =>
      languageOptions.find((option) => option.value === language) ??
      languageOptions[0],
    [language],
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background shadow-sm">
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
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            onClick={handleReset}
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
            onClick={run}
          >
            <Play className="size-4" />
            Run
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
