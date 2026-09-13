"use client";

import { useState } from "react";
import { ProblemTestCaseDetail } from "@/features/practice/problem-page/code-editor/components/problem-test-case-detail";
import { ProblemTestCasePill } from "@/features/practice/problem-page/code-editor/components/problem-test-case-pill";
import { TestCase } from "@/features/practice/problem-page/code-editor/types";

export function ProblemTestCasesPanel({ testCases } : {testCases : TestCase[]} ) {
  console.log(testCases)
  const [selectedCaseId, setSelectedCaseId] = useState(testCases[0].id);
  const selectedCase =
    testCases.find((testCase) => testCase.id === selectedCaseId) ??
    testCases[0];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background shadow-sm p-4">
      <div className="overflow-x-auto space-y-4">
        <div className="flex min-w-max gap-2">
          {testCases.map((testCase) => {
            const isSelected = testCase.id === selectedCaseId;

            return (
              <ProblemTestCasePill
                key={testCase.id}
                testCase={testCase}
                selected={isSelected}
                onSelect={setSelectedCaseId}
              />
            );
          })}
        </div>
        <div className="flex flex-1 min-h-0 flex-col">
          <div className="min-h-0 flex-1 overflow-auto">
            <ProblemTestCaseDetail testCase={selectedCase} />
          </div>
        </div>
      </div>
    </div>
  );
}
