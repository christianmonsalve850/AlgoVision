"use client";

import { useState } from "react";
import { ProblemTestCaseDetail } from "./problem-test-case-detail";
import { ProblemTestCaseTab } from "./problem-test-case-tab";
import { testCases } from "../constants/problem-test-cases-data";

export function ProblemTestCasesPanel() {
  const [selectedCaseId, setSelectedCaseId] = useState(testCases[0].id);
  const selectedCase = testCases.find((testCase) => testCase.id === selectedCaseId) ?? testCases[0];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="border-b border-border px-3 py-2.5 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
          Test Session
        </h3>

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
