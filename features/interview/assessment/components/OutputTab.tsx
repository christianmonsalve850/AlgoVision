
import { AlertCircle, ArrowDownToLine, Braces, Terminal } from "lucide-react";
import type { OutputTabProps } from "@/features/interview/assessment/types";
import { formatValue } from "@/features/interview/assessment/utils/format-value";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const outputSections = [
  {
    label: "stdout",
    key: "stdout",
    Icon: Terminal,
  },
  {
    label: "Expected output",
    key: "expectedOutput",
    Icon: ArrowDownToLine,
  },
  {
    label: "Output",
    key: "output",
    Icon: ArrowDownToLine,
  },
] as const;

export default function OutputTab({
  input,
  expectedOutput,
  stdout,
  output,
  error,
  correct,
}: OutputTabProps) {
  const values = { stdout, expectedOutput, output };
  const inputEntries = isRecord(input) ? Object.entries(input) : null;
  const visibleOutputSections = outputSections.filter(({ key }) => {
    const value = values[key];
    return key === "stdout"
      ? typeof value === "string" && value.trim().length > 0
      : value !== null && value !== undefined;
  });

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-y-auto">
      <div className="mb-2 flex shrink-0 items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Run results
          </div>
          <h2 className="mt-0.5 text-sm font-semibold tracking-tight">
            Execution output
          </h2>
        </div>
        {correct !== null && (
          <span
            role="status"
            className={`shrink-0 rounded-full border px-2 py-1 font-mono text-[10px] ${
              correct
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            }`}
          >
            {correct ? "Correct" : "Incorrect"}
          </span>
        )}
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-2">
        {error !== null ? (
          <section
            aria-label="Execution error"
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-rose-500/25 bg-rose-500/5 p-2 sm:col-span-2"
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0 text-rose-500"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                Execution error
              </h3>
              <pre className="mt-1 max-h-20 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-foreground">
                {error}
              </pre>
            </div>
          </section>
        ) : (
          <>
            {inputEntries && inputEntries.length > 0 && (
            <section
              aria-label="Arguments"
              className="min-w-0 overflow-hidden rounded-lg border border-border bg-muted/15 sm:col-span-2"
            >
              <div className="flex items-center gap-2 border-b border-border/70 bg-muted/30 px-2.5 py-1.5">
                <Braces
                  className="size-3.5 text-emerald-500"
                  aria-hidden="true"
                />
                <h3 className="text-xs font-medium text-foreground">
                  Arguments
                </h3>
              </div>
              <dl className="grid gap-1.5 p-2 sm:grid-cols-2">
                {inputEntries.map(([name, value]) => (
                  <div
                    key={name}
                    className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-baseline gap-2 rounded-md border border-border/60 bg-background/50 px-2 py-1"
                  >
                    <dt className="truncate font-mono text-[11px] font-medium text-muted-foreground">
                      {name}
                    </dt>
                    <dd className="min-w-0">
                      <code className="block max-w-full overflow-x-auto whitespace-nowrap font-mono text-xs leading-4 text-foreground">
                        {formatValue(value)}
                      </code>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            )}
            {visibleOutputSections.map(({ label, key, Icon }) => (
              <section
                key={key}
                aria-label={label}
                className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-muted/15"
              >
                <div className="flex shrink-0 items-center gap-2 border-b border-border/70 bg-muted/30 px-2.5 py-1.5">
                  <Icon
                    className="size-3.5 text-emerald-500"
                    aria-hidden="true"
                  />
                  <h3 className="text-xs font-medium text-foreground">
                    {label}
                  </h3>
                </div>
                <pre
                  aria-label={label}
                  className={`max-h-20 min-h-8 overflow-auto bg-transparent px-2.5 py-1.5 font-mono text-xs leading-4 text-foreground empty:before:text-muted-foreground/60 ${
                    key === "stdout"
                      ? "whitespace-pre-wrap break-words"
                      : "whitespace-nowrap"
                  }`}
                >
                  {key === "stdout" ? (
                    String(values[key])
                  ) : (
                    formatValue(values[key])
                  )}
                </pre>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}