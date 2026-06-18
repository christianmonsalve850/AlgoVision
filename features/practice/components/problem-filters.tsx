'use client';

import { Search } from "lucide-react";
import { type Difficulty } from "./difficulty-badge";

type ProblemFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filter: Difficulty | "All Difficulties";
  onFilterChange: (value: Difficulty | "All Difficulties") => void;
};

const difficultyOptions: { label: string; value: Difficulty | "All Difficulties" }[] = [
  { label: "Difficulty", value: "All Difficulties" },
  { label: "Easy", value: "Easy" },
  { label: "Medium", value: "Medium" },
  { label: "Hard", value: "Hard" },
];

export function ProblemFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: ProblemFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 md:flex-row md:items-center md:justify-between">
      <label className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground md:max-w-md">
        <Search className="size-4 shrink-0" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search problems"
          className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="flex items-center gap-2">
        <select
          value={filter}
          onChange={(event) => onFilterChange(event.target.value as Difficulty | "All Difficulties")}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
        >
          {difficultyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
