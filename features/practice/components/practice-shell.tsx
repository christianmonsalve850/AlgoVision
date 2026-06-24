'use client';

import { useState } from "react";

import { PatternSidebar } from "@/features/practice/components/patterns-sidebar";
import { Problems } from "@/features/practice/components/problems";
import type { PatternName } from "@/features/practice/types/pattern-types";
import type { ProblemListItem } from "@/features/practice/types/problem-list-item";

type PracticeShellProps = {
  problems: ProblemListItem[];
};

export function PracticeShell({ problems }: PracticeShellProps) {
  const [selectedPattern, setSelectedPattern] = useState<PatternName>("Recommended");

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-start bg-background px-6">
      <PatternSidebar selectedPattern={selectedPattern} onSelectPattern={setSelectedPattern} />
      <div className="w-full">
        <Problems selectedPattern={selectedPattern} problems={problems} />
      </div>
    </main>
  );
}
