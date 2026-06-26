import type { ProblemExampleCardProps } from "@/features/practice/problem-page/problem/types";

export function ProblemExampleCard({ example }: ProblemExampleCardProps) {
  return (
    <article className="rounded-xl border border-border bg-muted/40 p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Example {example.example_number}
      </div>

      <div className="space-y-2 text-sm leading-6">
        <p>
          <span className="font-semibold text-foreground">Input:</span>{" "}
          <span className="text-muted-foreground">{example.input}</span>
        </p>
        <p>
          <span className="font-semibold text-foreground">Output:</span>{" "}
          <span className="text-muted-foreground">{example.output}</span>
        </p>
        {example.explanation ? (
          <p className="text-muted-foreground">{example.explanation}</p>
        ) : null}
      </div>
    </article>
  );
}
