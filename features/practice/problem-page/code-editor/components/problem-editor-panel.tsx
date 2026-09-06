"use client";

import { useState, useCallback, useEffect } from "react";
import { Code2, Play, RotateCcw } from "lucide-react";
import { ProblemCodeEditor } from "@/features/practice/problem-page/code-editor/components/problem-code-editor";
import { ProblemTestCasesPanel } from "@/features/practice/problem-page/code-editor/components/problem-test-cases-panel";
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
import { Group, Separator, Panel } from "react-resizable-panels";

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function ProblemEditorPanel({
  problem_id,
  starterCodeMap,
}: ProblemEditorPanelProps) {
  const [language, setLanguage] = useState<Language>("Python");
  const [code, setCode] = useState(starterCodeMap[language] ?? "");

  const setTrace = useTraceStore((state) => state.setTrace);
  const setIsRunning = useTraceStore((state) => state.setIsRunning);

  const compositeKey = `problem:${problem_id}:${language}`;

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
  };

  const handleReset = () => {
    setCode(starterCodeMap[language] ?? "");
    localStorage.setItem(compositeKey, starterCodeMap[language] ?? "");
  };

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
    <section className="flex h-full min-h-0 flex-col bg-background overflow-y-auto">
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
            onClick={handleRun}
          >
            <Play className="size-4" />
            Run
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-4">
        <Group
          orientation="vertical"
          defaultLayout={{
            "code-editor": 75,
            "test-cases": 25,
          }}
        >
          <Panel id="code-editor" defaultSize={75} minSize="50%" maxSize="75%">
            <ProblemCodeEditor
              language={language}
              code={code}
              onLanguageChange={handleLanguageChange}
              onCodeChange={handleEditorChange}
            />
          </Panel>
          <Separator className="group relative flex w-full h-2 items-center justify-center bg-transparent transition-colors hover:bg-zinc-800/20 active:bg-zinc-800/40 border-y border-border">
            <div className="h-1 w-8 rounded-full bg-border/60 transition-colors group-hover:bg-emerald-400 group-active:bg-emerald-500" />
          </Separator>
          <Panel id="test-cases" defaultSize={25}>
            <ProblemTestCasesPanel />
          </Panel>
        </Group>
      </div>
    </section>
  );
}
