"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { ChevronDown, Play, RotateCcw, X } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { languageOptions } from "@/features/practice/problem-page/code-editor/constants/languages";
import type {
  Language,
  ProblemEditorPanelProps,
} from "@/features/practice/problem-page/code-editor/types";
import { executeTrace } from "@/lib/algovision-harness/src/script";
import { useTraceStore } from "../../stores/use-trace-store";
import type {
  ExecutionOutcome,
  TraceStep,
} from "@/lib/algovision-harness/src/runtime/types";

export function ProblemCodeEditor({
  problem_id,
  starterCodeMap,
}: ProblemEditorPanelProps) {
  const { resolvedTheme } = useTheme();

  const [language, setLanguage] = useState<Language>("Python");
  const [code, setCode] = useState(starterCodeMap[language] ?? "");

  const setTrace = useTraceStore((state) => state.setTrace);
  const setIsRunning = useTraceStore((state) => state.setIsRunning);

  const compositeKey = `problem:${problem_id}:${language}`;

  const activeLanguage = useMemo(
    () =>
      languageOptions.find((option) => option.value === language) ??
      languageOptions[0],
    [language],
  );

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
  };

  function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedSave = useCallback(
    debounce((value: string) => {
      if (!value) return;
      localStorage.setItem(compositeKey, value);
      console.log("Buffered code autosaved safely.");
    }, 400),
    [compositeKey],
  );

  const handleEditorChange = (value: string | undefined) => {
    const currentCode = value || "";
    setCode(currentCode);

    debouncedSave(currentCode);
  };

  const handleReset = () => {
    setCode(code ?? "");
    localStorage.setItem(compositeKey, starterCodeMap[language] ?? "");
  };

  const handleRun = useCallback(async () => {
    console.log("Run clicked");
    try {
      setIsRunning(true);
      const outcome: ExecutionOutcome = await executeTrace(code);

      if (outcome?.trace) {
        setTrace(outcome.trace as TraceStep[]);
      }
    } catch (error) {
      console.error("executeTrace error:", error);
    } finally {
      setIsRunning(false);
    }
  }, [code, setIsRunning, setTrace]);

  useEffect(() => {
    const savedCode = localStorage.getItem(compositeKey);

    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(starterCodeMap[language] || "");
    }
  }, [problem_id, language]);

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
            onClick={handleRun}
          >
            <Play className="size-4" />
            Run
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 bg-[#FFFFFF] dark:bg-[#1E1E1E]">
          <div className="flex m-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 cursor-pointer text-sm text-foreground bg-muted px-2 py-1 rounded-sm">
              <span>Solution 1</span>
              <button
                type="button"
              >
                <X className="w-4 h-4 p-0.5 text-muted-foreground rounded-xs hover:text-red-400 hover:bg-red-400/20"/>
              </button>
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
