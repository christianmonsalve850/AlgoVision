"use client";

type ProblemCountSelectorProps = {
  minProblems: number;
  maxProblems: number;
  value: number;
  onValueChange: (value: number) => void;
};

export default function ProblemCountSelector({
  minProblems,
  maxProblems,
  value,
  onValueChange,
}: ProblemCountSelectorProps) {
  if (
    !Number.isInteger(minProblems) ||
    !Number.isInteger(maxProblems) ||
    minProblems < 1 ||
    maxProblems < minProblems
  ) {
    throw new RangeError("Problem count bounds must be positive whole numbers.");
  }

  if (!Number.isInteger(value) || value < minProblems || value > maxProblems) {
    throw new RangeError("Problem count must be within its configured bounds.");
  }

  const problemCounts = Array.from(
    { length: maxProblems - minProblems + 1 },
    (_, index) => minProblems + index,
  );

  return (
    <fieldset className="flex flex-col gap-3 rounded-lg border border-border bg-background p-5">
      <legend className="sr-only">Number of problems</legend>
      <div>
        <h3 className="font-semibold text-foreground">Number of problems</h3>
        <p className="text-sm text-muted-foreground">
          Choose how many problems to include
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {problemCounts.map((count) => (
          <label key={count} className="cursor-pointer">
            <input
              type="radio"
              name="problem-count"
              value={count}
              checked={value === count}
              onChange={() => onValueChange(count)}
              className="peer sr-only"
            />
            <span className="flex min-h-16 flex-col items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted peer-checked:border-foreground peer-checked:bg-muted peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
              <span className="text-lg font-semibold tabular-nums">{count}</span>
              <span className="text-xs text-muted-foreground">
                {count === 1 ? "problem" : "problems"}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
