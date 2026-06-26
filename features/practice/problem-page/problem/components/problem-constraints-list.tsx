import { ProblemConstraintsListProps } from "@/features/practice/problem-page/problem/types";

export function ProblemConstraintsList({ constraints }: ProblemConstraintsListProps) {
  return (
    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
      {constraints.map((constraint) => (
        <li key={constraint} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
          <span>{constraint}</span>
        </li>
      ))}
    </ul>
  );
}
