
import { AlertCircle, ArrowDownToLine, Braces, Terminal } from "lucide-react";
import type { OutputTabProps } from "@/features/interview/assessment/types";

const outputSections = [
  {
    label: "Your input",
    key: "input",
    Icon: Braces,
    emptyMessage: "Input will appear here when you run your code.",
  },
  {
    label: "stdout",
    key: "stdout",
    Icon: Terminal,
    emptyMessage: "Program output will appear here.",
  },
  {
    label: "Output",
    key: "output",
    Icon: ArrowDownToLine,
    emptyMessage: "The result will appear here.",
  },
] as const;

export default function OutputTab({
  input,
  stdout,
  output,
  error,
}: OutputTabProps) {
  const values = { input, stdout, output };

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Run results
          </div>
          <h2 className="mt-0.5 text-sm font-semibold tracking-tight">
            Execution output
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] text-muted-foreground">
          read only
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
        {error !== null ? (
          <section
            aria-label="Execution error"
            role="alert"
            className="flex min-h-0 flex-1 items-start gap-3 rounded-lg border border-rose-500/25 bg-rose-500/5 p-3"
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0 text-rose-500"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                Execution error
              </h3>
              <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-foreground">
                {error}
              </pre>
            </div>
          </section>
        ) : (
          outputSections.map(({ label, key, Icon, emptyMessage }) => (
            <section
              key={key}
              aria-label={label}
              className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-muted/15"
            >
              <div className="flex shrink-0 items-center gap-2 border-b border-border/70 bg-muted/30 px-3 py-2">
                <Icon
                  className="size-3.5 text-emerald-500"
                  aria-hidden="true"
                />
                <h3 className="text-xs font-medium text-foreground">{label}</h3>
              </div>
              <textarea
                aria-label={label}
                readOnly
                value={values[key] ?? ""}
                placeholder={emptyMessage}
                rows={2}
                className="min-h-12 w-full flex-1 resize-none bg-transparent px-3 py-2 font-mono text-xs leading-5 text-foreground outline-none placeholder:text-muted-foreground/60"
              />
            </section>
          ))
        )}
      </div>
    </div>
  );
}