import { DifficultyBadge } from "@/features/practice/components/difficulty-badge";
import { PatternBadge } from "@/features/practice/components/pattern-badge";

import { ProblemConstraintsList } from "./problem-constraints-list";
import { ProblemExampleCard } from "./problem-example-card";
import type { ProblemPageData } from "./types";

type ProblemSidebarProps = ProblemPageData;

export function ProblemSidebar({ problem, examples }: ProblemSidebarProps) {
  return (
    <aside className="col-span-4 flex h-[calc(100vh-4rem)] flex-col border-r border-border bg-background/95 text-foreground">
      <div className="flex h-full flex-col overflow-y-auto p-6">
        <div className="space-y-4 border-b border-border pb-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Problem
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{problem.title}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <DifficultyBadge difficulty={problem.difficulty} />
            <PatternBadge pattern={problem.pattern} />
          </div>

          <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {problem.description}
          </p>
        </div>

        <section className="space-y-3 border-b border-border py-6">
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

        <section className="space-y-3 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Constraints
          </h2>
          <ProblemConstraintsList constraints={problem.constraints} />
        </section>
      </div>
    </aside>
  );
}
