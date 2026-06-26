'use client';

import { useMemo, useState } from "react"

import { ProblemFilters } from "@/features/practice/components/problem-filters"
import { ProblemRow } from "@/features/practice/components/problem-row"
import type { PatternName } from "@/features/practice/types/pattern-types"
import type { Difficulty } from "@/features/practice/components/difficulty-badge";
import { PracticeHeader } from "@/features/practice/components/practice-header";
import type { ProblemListItem } from "@/features/practice/types/problem-list-item";
import { LatestProblem } from "@/features/practice/components/latest-problem";

type ProblemsProps = {
    selectedPattern: PatternName
    problems: ProblemListItem[]
}

export function Problems({ selectedPattern, problems }: ProblemsProps) {

    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState<Difficulty | "All Difficulties">("All Difficulties")

    const filteredProblems = useMemo(() => {
        const query = search.trim().toLowerCase()
        
        return problems
            .filter((problem) => {
                const matchesPattern =
                    selectedPattern === "All"
                        ? true
                        : problem.pattern === selectedPattern 
                        || selectedPattern === "Recommended" && problem.is_recommended;

                const matchesSearch = query.length === 0 || problem.title.toLowerCase().includes(query);

                const matchesDifficulty = filter === "All Difficulties" || problem.difficulty === filter

                return matchesPattern && matchesSearch && matchesDifficulty
            })
    }, [search, selectedPattern, filter, problems])

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
            <div className="mb-6 px-1">
                <PracticeHeader />
                <LatestProblem problems={problems}/>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{selectedPattern}</h3>
            </div>

            <div className="mb-4">
                <ProblemFilters
                    search={search}
                    onSearchChange={setSearch}
                    filter={filter}
                    onFilterChange={setFilter}
                />
            </div>

            <div className="flex flex-col gap-2.5">
                {filteredProblems.map((problem) => (
                    <ProblemRow key={problem.id} problem={problem} />
                ))}
            </div>
        </div>
    )
}
