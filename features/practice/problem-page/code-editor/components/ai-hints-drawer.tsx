import { useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import type { HintLevel } from "@/app/types/api-types";
import type { ProblemRecord } from "@/features/practice/problem-page/problem/types";
import { requestAiHint } from "@/features/practice/problem-page/services/request-ai-hint";

const hintSteps: {
  level: HintLevel;
  title: string;
  description: string;
}[] = [
  {
    level: 1,
    title: "Nudge",
    description: "A question or concept to help you think about your next step.",
  },
  {
    level: 2,
    title: "More direction",
    description: "A focused pointer toward the relevant part of your approach.",
  },
  {
    level: 3,
    title: "Strong hint",
    description: "A specific strategy or key insight, without the full solution.",
  },
];

interface AIHintsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  problem: ProblemRecord;
  userCode: string;
  executionId: string | null;
}

export function AIHintsDrawer({
  isOpen,
  onClose,
  problemId,
  problem,
  userCode,
  executionId,
}: AIHintsDrawerProps) {
  const [hints, setHints] = useState<Partial<Record<HintLevel, string>>>({});
  const [errors, setErrors] = useState<Partial<Record<HintLevel, string>>>({});
  const [loadingLevel, setLoadingLevel] = useState<HintLevel | null>(null);

  const nextHintLevel: HintLevel | null = !hints[1]
    ? 1
    : !hints[2]
      ? 2
      : !hints[3]
        ? 3
        : null;

  const requestHint = async (hintLevel: HintLevel) => {
    if (hintLevel !== nextHintLevel || loadingLevel !== null) return;

    setLoadingLevel(hintLevel);
    setErrors((previous) => ({ ...previous, [hintLevel]: undefined }));

    try {
      const result = await requestAiHint({
        problemId,
        problem: {
          title: problem.title,
          description: problem.description,
          constraints: problem.constraints,
        },
        userCode,
        executionId,
        hintLevel,
      });

      if (!result?.hint) {
        throw new Error("The hint service returned an empty hint.");
      }

      setHints((previous) => ({ ...previous, [hintLevel]: result.hint }));
    } catch {
      setErrors((previous) => ({
        ...previous,
        [hintLevel]: "Couldn't generate this hint. Please try again.",
      }));
    } finally {
      setLoadingLevel(null);
    }
  };

  if (!isOpen) return null;

  return (
    <Group
      orientation="horizontal"
      defaultLayout={{ "drawer-spacer": 70, "ai-hints-drawer": 30 }}
      className="pointer-events-none fixed inset-0 z-50"
    >
      <Panel
        id="drawer-spacer"
        defaultSize="70%"
        className="pointer-events-none"
      />
      <Separator className="group pointer-events-auto relative z-10 flex w-2 cursor-col-resize items-center justify-center border-l border-border/60 bg-transparent transition-colors hover:bg-muted/40 active:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500">
        <div className="h-8 w-1 rounded-full bg-border/60 transition-colors group-hover:bg-emerald-400/70 group-active:bg-emerald-500" />
      </Separator>
      <Panel
        id="ai-hints-drawer"
        defaultSize="30%"
        minSize={280}
        maxSize={640}
        className="pointer-events-auto min-w-0"
      >
        <div className="flex h-full flex-col border-l border-border bg-background text-foreground shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span aria-hidden="true">✨</span>
              <h2 className="text-sm font-semibold tracking-wide">
                Step-by-step hints
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-foreground transition-colors hover:text-muted-foreground"
              aria-label="Close AI Hints"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Reveal one hint at a time. Each step gets more specific and is
              generated from your code and latest submission summary, not from
              earlier hints.
            </p>

            {hintSteps.map(({ level, title, description }) => {
              const hint = hints[level];
              const error = errors[level];
              const isLoading = loadingLevel === level;
              const isLocked = level !== nextHintLevel && !hint;

              return (
                <section
                  key={level}
                  aria-labelledby={`hint-title-${level}`}
                  className={`rounded-lg border p-3 ${
                    isLocked
                      ? "border-border/60 bg-muted/30 opacity-70"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="mb-2 flex items-start gap-3">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        hint
                          ? "bg-emerald-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {level}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3
                        id={`hint-title-${level}`}
                        className="text-sm font-medium"
                      >
                        {title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>

                  {hint && (
                    <p className="ml-9 whitespace-pre-wrap rounded-md bg-muted p-3 text-xs leading-relaxed">
                      {hint}
                    </p>
                  )}

                  {error && (
                    <p role="alert" className="ml-9 mb-2 text-xs text-red-500">
                      {error}
                    </p>
                  )}

                  {!hint && (
                    <div className="ml-9">
                      <button
                        type="button"
                        onClick={() => requestHint(level)}
                        disabled={isLocked || loadingLevel !== null}
                        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading
                          ? "Generating..."
                          : error
                            ? "Try again"
                            : isLocked
                              ? `Unlock after Hint ${level - 1}`
                              : "Reveal hint"}
                      </button>
                    </div>
                  )}
                </section>
              );
            })}

            {nextHintLevel === null && (
              <p className="text-center text-xs text-muted-foreground">
                You’ve revealed all three hints. Keep working through the
                problem with what you’ve uncovered.
              </p>
            )}
          </div>
        </div>
      </Panel>
    </Group>
  );
}
