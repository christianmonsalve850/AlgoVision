import { DescriptionProps } from "@/features/interview/assessment/types";
import { Difficulty } from "@/features/interview/types";
import Markdown from "react-markdown";

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Medium:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Hard: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

export default function Description({
  problems,
  problemCount,
}: DescriptionProps) {
  const problem = problems[0];
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Problem 01 / {problemCount.toString().padStart(2, '0')}
          </div>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">
            {problem.title}
          </h1>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${difficultyStyles[problem.difficulty]}`}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="space-y-7 text-[15px] leading-7 text-muted-foreground">
        <div className="space-y-4">
          <Markdown
            components={{
              p: ({ children }) => (
                <p className="leading-7 text-muted-foreground">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc space-y-2 pl-6">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal space-y-2 pl-6">{children}</ol>
              ),
              li: ({ children }) => <li className="pl-1">{children}</li>,
              code: ({ children }) => (
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 font-mono text-sm leading-6 text-foreground [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
                  {children}
                </pre>
              ),
            }}
          >
            {problem.description}
          </Markdown>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
            Examples
          </h2>
          <div className="space-y-3">
            {problem.examples.map(
              ({ example_number, input, output, explanation }) => (
                <div
                  key={example_number}
                  className="border-l-2 border-border bg-muted/45 px-4 py-3.5"
                >
                  <div className="mb-2 text-xs font-semibold text-foreground">
                    Example {example_number}
                  </div>
                  <div className="font-mono text-xs leading-6">
                    <div>
                      <span className="text-muted-foreground">Input:</span>{" "}
                      <span className="text-foreground">{input}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Output:</span>{" "}
                      <span className="text-foreground">{output}</span>
                    </div>
                  </div>
                  {explanation && (
                    <p className="mt-2 text-sm leading-6">{explanation}</p>
                  )}
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
            Constraints
          </h2>
          <ul className="space-y-2 font-mono text-xs">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
