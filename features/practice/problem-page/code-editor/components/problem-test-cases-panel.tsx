"use client";

import { useState } from "react";
import { ProblemTestCaseDetail } from "@/features/practice/problem-page/code-editor/components/problem-test-case-detail";
import { ProblemTestCaseTab } from "@/features/practice/problem-page/code-editor/components/problem-test-case-tab";
import { testCases } from "@/features/practice/problem-page/code-editor/constants/problem-test-cases-data";
import { SquareCheck, Terminal } from "lucide-react";

export function ProblemTestCasesPanel() {
  const [selectedCaseId, setSelectedCaseId] = useState(testCases[0].id);
  const selectedCase = testCases.find((testCase) => testCase.id === selectedCaseId) ?? testCases[0];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background shadow-sm">
      <div className="group flex border-b border-border p-1 items-center">
        <button className="flex text-foreground hover:bg-accent py-1 px-2 gap-1 text-sm items-center rounded-sm"><SquareCheck className="text-emerald-400 p-0.5" /> Testcase</button>
        <div className="h-4 border-r border-border transition-opacity duration-150 group-hover:opacity-0" />
        <button className="flex text-foreground hover:bg-accent py-1 px-2 gap-1 text-sm items-center rounded-sm"><Terminal className="text-emerald-400 p-0.5" /> Output</button>
      </div>
      <div className="border-b border-border px-3 py-2.5 space-y-2">
        <div className=" overflow-x-auto pb-1">
          <div className="flex min-w-max gap-1.5">
            {testCases.map((testCase) => {
              const isSelected = testCase.id === selectedCaseId;

              return (
                <ProblemTestCaseTab
                  key={testCase.id}
                  testCase={testCase}
                  selected={isSelected}
                  onSelect={setSelectedCaseId}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-2.5 p-3">
        <div className="min-h-0 flex-1 overflow-auto">
          <ProblemTestCaseDetail testCase={selectedCase} />
        </div>
      </div>
    </div>
  );
}
