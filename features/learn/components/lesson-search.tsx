'use client';

import { Search } from "lucide-react";

type ProblemFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
};


export function LessonSearch({ search, onSearchChange }: ProblemFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 md:flex-row md:items-center md:justify-between">
      <label className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
        <Search className="size-4 shrink-0" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search lessons"
          className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>
    </div>
  );
}
