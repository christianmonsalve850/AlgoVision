'use client'

import { type ProblemListItem } from "../types/problem-list-item"
import { patternItems } from "../data/pattern-items"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

type LatestProblemProps = {
    problems: ProblemListItem[]
}

export function LatestProblem({ problems }: LatestProblemProps) {
    const router = useRouter()

    if (problems.length === 0) {
        return null
    }

    const latestPattern = patternItems.find((item) => item.name === problems[0].pattern)

    return (
        <div className="space-y-3">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Continue Problem</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Pick up where you left off</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                <div className="grid gap-0 md:grid-cols-[1fr_auto]">
                    <div className="flex min-w-0 gap-4 border-b border-border p-4 md:border-b-0 md:border-r">
                        <div className="mt-0.5  w-1.5 shrink-0 rounded-full bg-foreground/10" />

                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate text-sm font-semibold text-foreground">
                                    {problems[0].title}
                                </p>
                                <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    In progress
                                </span>
                                {latestPattern ? (
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium ${latestPattern.meta.bg} ${latestPattern.meta.color}`}
                                    >
                                        {latestPattern.meta.icon}
                                        {problems[0].pattern}
                                    </span>
                                ) : null}
                            </div>

                            <p className="text-xs leading-5 text-muted-foreground">
                                Continue from your last session and keep momentum on this pattern.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-3 p-4 md:min-w-52 md:items-end">
                        <p className="text-xs text-muted-foreground">Practice session in progress</p>
                        <button
                            type="button"
                            onClick={() => router.push(`/practice/${problems[0].id}`)}
                            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
                        >
                            Continue Practice
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
