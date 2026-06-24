'use client'

import { useState, useCallback, useRef, useEffect } from "react";
import { Code2, Play, RotateCcw } from "lucide-react";
import { ProblemCodeEditor } from "./problem-code-editor";
import { ProblemTestCasesPanel } from "./problem-test-cases-panel";
import type { Language, ProblemEditorPanelProps } from "../types";
import { ExecutionTrace } from "../../visualization/types";

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function ProblemEditorPanel({ problem_id, starterCodeMap }: ProblemEditorPanelProps) {
  const [language, setLanguage] = useState<Language>("Python");
  const [code, setCode] = useState(starterCodeMap[language] ?? "");

  const [traceSteps, setTraceSteps] = useState<ExecutionTrace[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const codeRef = useRef<string>("");
  const compositeKey = `problem:${problem_id}:${language}`;

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
  };

  const handleReset = () => {
    setCode(starterCodeMap[language] ?? "");
    localStorage.setItem(compositeKey, starterCodeMap[language] ?? "")
  };

  const debouncedSave = useCallback(
    debounce((value: string) => {
      if (!value) return;
      localStorage.setItem(compositeKey, value);
      console.log("Buffered code autosaved safely.");
    }, 400),
    [compositeKey]
  );

  const handleEditorChange = (value: string | undefined) => {
    const currentCode = value || "";
    
    codeRef.current = currentCode; 

    debouncedSave(currentCode);
  };

  useEffect(() => {
    const savedCode = localStorage.getItem(compositeKey);

    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(starterCodeMap[language] || "");
    }
  }, [problem_id, language]);


  return (
    <section className="col-span-6 flex h-full min-h-0 flex-col border-r border-border bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Editor
          </h2>
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
            onClick={() => console.log()}
          >
            <Play className="size-4" />
            Run
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-4 p-5">
        <div className="min-h-0 flex-[1.3]">
          <ProblemCodeEditor
            language={language}
            code={code}
            onLanguageChange={handleLanguageChange}
            onCodeChange={handleEditorChange}
          />
        </div>
        <div className="min-h-0 flex-[0.8]">
          <ProblemTestCasesPanel />
        </div>
      </div>
    </section>
  );
}
