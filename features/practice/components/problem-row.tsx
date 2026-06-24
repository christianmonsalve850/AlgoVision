import { CircleCheck } from "lucide-react"
import Link from "next/link"

import { DifficultyBadge } from "@/features/practice/components/difficulty-badge"
import { PatternBadge } from "./pattern-badge"
import type { ProblemListItem } from "@/features/practice/types/problem-list-item"

type ProblemRowProps = {
  problem: ProblemListItem
}

export function ProblemRow({ problem }: ProblemRowProps) {
  return (
    <Link
      href={`/practice/${problem.id}`}
      className="group grid grid-cols-12 items-center gap-4 rounded-xl border border-border bg-background px-4 py-3.5 text-sm font-medium shadow-sm transition-all duration-200 hover:border-border hover:bg-muted"
    >
      <div className="col-span-6 flex min-w-0 items-center gap-3">
        <CircleCheck
          className={problem.solved ? "shrink-0 text-emerald-500" : "shrink-0 text-muted-foreground"}
          size={18}
        />
        <span className="truncate font-semibold text-foreground transition-colors group-hover:text-foreground">
          {problem.title}
        </span>
      </div>

      <div className="col-span-3 flex justify-center">
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <div className="col-span-3 flex justify-end">
        <PatternBadge pattern={problem.pattern} />
      </div>
    </Link>
  )
}
