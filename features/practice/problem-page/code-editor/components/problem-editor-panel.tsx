"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  SquareCheck,
  Terminal,
} from "lucide-react";
import { ProblemCodeEditor } from "@/features/practice/problem-page/code-editor/components/problem-code-editor";
import { ProblemTestCasesPanel } from "@/features/practice/problem-page/code-editor/components/problem-test-cases-panel";
import type {
  ProblemEditorPanelProps,
} from "@/features/practice/problem-page/code-editor/types";
import {
  Group,
  Separator,
  Panel,
  PanelImperativeHandle,
} from "react-resizable-panels";
import { ProblemTestCaseOutput } from "@/features/practice/problem-page/code-editor/components/problem-test-case-output";

export function ProblemEditorPanel({
  problem_id,
  starterCodeMap,
}: ProblemEditorPanelProps) {
  const [isOpenConsole, setIsOpenConsole] = useState<boolean>(false);
  const [isTestCaseSelected, setIsTestCaseSelected] = useState<boolean>(true);

  const panelRef = useRef<PanelImperativeHandle>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (panel) {
      if (isOpenConsole) {
        if (panel.isCollapsed()) {
          panel.expand();
        }
        panel.resize(300);
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
            <ProblemCodeEditor
              problem_id={problem_id}
              starterCodeMap={starterCodeMap}
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
              <div className="group flex items-center">
                <button
                  className={`flex items-center gap-1 rounded-sm px-2 py-1 text-sm text-foreground hover:bg-accent ${!isTestCaseSelected ? "opacity-50" : ""}`}
                  onClick={() => setIsTestCaseSelected(true)}
                >
                  <SquareCheck className="p-0.5 text-emerald-400" />
                  Testcase
                </button>

                <div className="h-4 border-r border-border transition-opacity duration-150 group-hover:opacity-0" />

                <button
                  className={`flex items-center gap-1 rounded-sm px-2 py-1 text-sm text-foreground hover:bg-accent ${isTestCaseSelected ? "opacity-50" : ""}`}
                  onClick={() => setIsTestCaseSelected(false)}
                >
                  <Terminal className="p-0.5 text-emerald-400" />
                  Output
                </button>
              </div>

              <div className="flex items-center pr-2">
                <button
                  className="rounded-sm text-muted-foreground hover:bg-accent"
                  onClick={() => setIsOpenConsole(!isOpenConsole)}
                >
                  {isOpenConsole ? <ChevronDown /> : <ChevronUp />}
                </button>
              </div>
            </div>

            {/* Console Content */}
            <div className="min-h-0 flex-1">
              { isTestCaseSelected ? <ProblemTestCasesPanel /> : <ProblemTestCaseOutput /> }
            </div>
          </Panel>
        </Group>
      </div>
    </section>
  );
}
