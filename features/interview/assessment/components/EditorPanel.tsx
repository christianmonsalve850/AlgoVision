"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, CodeXml, SquareCheck } from "lucide-react";
import { MonacoCodeEditor } from "@/components/code-editor/monaco-code-editor";
import type { EditorPanelProps } from "@/features/interview/assessment/types";
import {
  Group,
  Separator,
  Panel,
  PanelImperativeHandle,
} from "react-resizable-panels";
import { SUPPORTED_LANGUAGES } from "@/features/code-editor/languages";
import TestcaseTab from "@/features/interview/assessment/components/TestcaseTab";
import OutputTab from "@/features/interview/assessment/components/OutputTab";
import { requestRunTestCase } from "@/features/interview/assessment/services/request-run-test-case";
import type { SingleTestExecutionResult } from "@/lib/docker-runner/types";

type ProblemTab = "testcase" | "output";

interface InterviewExecutionOutput {
  input: Record<string, unknown>;
  expectedOutput: unknown;
  result: SingleTestExecutionResult | null;
}

export function EditorPanel({
  code,
  language,
  onCodeChange,
  problemId,
  functionParameters,
  functionParameterDefaults,
}: EditorPanelProps) {
  const [isOpenConsole, setIsOpenConsole] = useState<boolean>(false);
  const [problemTab, setProblemTab] = useState<ProblemTab>("testcase");
  const [isRunning, setIsRunning] = useState(false);
  const [executionOutput, setExecutionOutput] =
    useState<InterviewExecutionOutput | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  const panelRef = useRef<PanelImperativeHandle>(null);

  const runTestCase = async (
    input: Record<string, unknown>,
    expectedOutput: unknown,
  ) => {
    setIsOpenConsole(true);
    setProblemTab("output");
    setIsRunning(true);
    setExecutionError(null);
    setExecutionOutput({
      input,
      expectedOutput,
      result: null,
    });

    try {
      const result = await requestRunTestCase({
        problemId,
        language,
        sourceCode: code,
        input,
        expectedOutput,
      });
      setExecutionOutput({
        input,
        expectedOutput,
        result,
      });
    } catch (error) {
      setExecutionError(
        error instanceof Error ? error.message : "Failed to run test case.",
      );
    } finally {
      setIsRunning(false);
    }
  };

  const clearExecutionOutput = () => {
    setExecutionOutput(null);
    setExecutionError(null);
  };

  useEffect(() => {
    const panel = panelRef.current;
    if (panel) {
      if (isOpenConsole) {
        if (panel.isCollapsed()) {
          panel.expand();
        }
        panel.resize(320);
      } else {
        if (!panel.isCollapsed()) {
          panel.collapse();
        }
      }
    }
  }, [isOpenConsole]);

  return (
    <section className="flex h-full min-h-0 flex-col bg-background overflow-y-auto">
      <div className="flex flex-1 min-h-0 flex-col gap-4">
        <Group
          orientation="vertical"
          defaultLayout={{
            "code-editor": 94.5,
            console: 5.5,
          }}
        >
          {/* Code Editor */}
          <Panel id="code-editor" defaultSize={70}>
            <MonacoCodeEditor
              defaultLanguage={SUPPORTED_LANGUAGES[language].monacoLanguage}
              language={SUPPORTED_LANGUAGES[language].monacoLanguage}
              value={code}
              onChange={onCodeChange}
            />
          </Panel>

          {/* Resize Handle */}
          <Separator className="group relative flex w-full h-2 items-center justify-center bg-transparent transition-colors hover:bg-zinc-800/20 active:bg-zinc-800/40 border-y border-border">
            <div className="h-1 w-8 rounded-full bg-border/60 transition-colors group-hover:bg-emerald-400 group-active:bg-emerald-500" />
          </Separator>

          {/* Console */}
          <Panel
            panelRef={panelRef}
            id="console"
            collapsible
            collapsedSize="40px"
            minSize="40px"
            maxSize="400px"
            defaultSize="300px"
            onResize={(size) => {
              setIsOpenConsole(size.inPixels > 40);
            }}
            className="flex min-h-0 flex-col"
          >
            {/* Console Header */}
            <div className="flex shrink-0 justify-between border-b border-border p-1">
              {/* Tab Buttons go Here */}
              <div className="group flex items-center">
                <button
                  className={`flex items-center gap-1 rounded-sm px-2 py-1 text-sm text-foreground hover:bg-accent ${problemTab === "output" ? "opacity-50" : ""}`}
                  onClick={() => setProblemTab("testcase")}
                >
                  <SquareCheck className="p-0.5 text-emerald-400" />
                  Testcase
                </button>
                <div className="h-4 border-r border-border transition-opacity duration-150 group-hover:opacity-0" />
                <button
                  className={`flex items-center gap-1 rounded-sm px-2 py-1 text-sm text-foreground hover:bg-accent ${problemTab === "testcase" ? "opacity-50" : ""}`}
                  onClick={() => setProblemTab("output")}
                >
                  <CodeXml className="p-0.5 text-emerald-400" />
                  Output
                </button>
              </div>

              <div className="flex items-center pr-2">
                <button
                  type="button"
                  aria-label={
                    isOpenConsole ? "Collapse console" : "Expand console"
                  }
                  aria-expanded={isOpenConsole}
                  aria-controls="console"
                  className="rounded-sm text-muted-foreground hover:bg-accent"
                  onClick={() => setIsOpenConsole(!isOpenConsole)}
                >
                  {isOpenConsole ? <ChevronDown /> : <ChevronUp />}
                </button>
              </div>
            </div>
            {/* Console Content */}
            <div className="min-h-0 flex-1 overflow-hidden p-3">
              {problemTab === "testcase" ? (
                <TestcaseTab
                  functionParameters={functionParameters}
                  functionParameterDefaults={functionParameterDefaults}
                  onRunTestCase={(input, expectedOutput) => {
                    void runTestCase(input, expectedOutput);
                  }}
                  onTestCaseChange={clearExecutionOutput}
                  isRunning={isRunning}
                />
              ) : (
                <OutputTab
                  input={executionOutput?.input ?? null}
                  expectedOutput={
                    executionOutput
                      ? executionOutput.expectedOutput
                      : undefined
                  }
                  stdout={executionOutput?.result?.stdout}
                  output={
                    executionOutput?.result &&
                    Object.hasOwn(executionOutput.result, "actualOutput")
                      ? executionOutput.result.actualOutput
                      : undefined
                  }
                  error={
                    executionError ??
                    executionOutput?.result?.error ??
                    null
                  }
                  correct={
                    executionOutput?.result?.status === "error"
                      ? null
                      : (executionOutput?.result?.correct ?? null)
                  }
                />
              )}
            </div>
          </Panel>
        </Group>
      </div>
    </section>
  );
}
