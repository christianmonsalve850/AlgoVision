'use client'

import { DifficultyBadge } from "@/features/practice/components/difficulty-badge";
import { PatternBadge } from "@/features/practice/components/pattern-badge";
import { ProblemConstraintsList } from "@/features/practice/problem-page/problem/components/problem-constraints-list";
import { ProblemExampleCard } from "@/features/practice/problem-page/problem/components/problem-example-card";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ProblemSidebarProps } from "@/features/practice/problem-page/problem/types";

export function ProblemSidebar({ problem, examples }: ProblemSidebarProps) {
  const router = useRouter();

  return (
    <aside className="flex h-full w-full min-w-0 min-h-0 flex-col border-r border-border bg-background/95 text-foreground overflow-hidden">
      <div className="flex-1 w-full min-h-0 overflow-y-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-4 border-b border-border pb-6">
          <div className="space-y-2">
            <button 
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => router.push("/practice")}
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground wrap-break-words">{problem.title}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <DifficultyBadge difficulty={problem.difficulty} />
            <PatternBadge pattern={problem.pattern} />
          </div>

          <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground break-words">
            {problem.description}
          </p>
        </div>

        {/* Examples Section */}
        <section className="space-y-3 border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
              Examples
            </h2>
            <span className="text-xs text-muted-foreground">{examples.length} total</span>
          </div>

          <div className="space-y-3">
            {examples.map((example) => (
              <ProblemExampleCard key={example.id} example={example} />
            ))}
          </div>
        </section>

        {/* Constraints Section */}
        <section className="space-y-3 pb-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Constraints
          </h2>
          <ProblemConstraintsList constraints={problem.constraints} />
        </section>
      </div>
    </aside>
  );
}