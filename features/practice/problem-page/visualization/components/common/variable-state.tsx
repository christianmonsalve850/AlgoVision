import { Braces } from "lucide-react";
import type { VariablesMap, VariableValue } from "@/lib/algovision-harness/src/runtime/types";
import { getDisplayVariables, formatValue, getTypeLabel } from "@/features/practice/problem-page/visualization/utils";
import { useEffect, useMemo, useState } from "react";

type VariableStateProps = {
  variables: VariablesMap | null | undefined;
  changedVariables?: string[] | null;
};

export function VariableState({ variables, changedVariables }: VariableStateProps) {
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!changedVariables || changedVariables.length === 0) return;

    const set = new Set(changedVariables);
    setHighlighted(set);

    const id = setTimeout(() => setHighlighted(new Set()), 1400);
    return () => clearTimeout(id);
  }, [changedVariables]);

  const variableEntries = useMemo(() => {
    const entries = getDisplayVariables(variables);
    return entries.slice().sort((a, b) => {
      const aHighlighted = highlighted.has(a[0]);
      const bHighlighted = highlighted.has(b[0]);
      if (aHighlighted === bHighlighted) return a[0].localeCompare(b[0]);
      return aHighlighted ? -1 : 1;
    });
  }, [variables, highlighted]);

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
        <Braces className="size-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Variables In Scope
        </h3>
      </div>

      <div className="flex flex-col gap-1.5 font-mono text-xs">
        {variableEntries.map(([name, value]) => {
          const isHighlighted = highlighted.has(name);
          return (
            <div
              key={name}
              className={`grid grid-cols-12 items-center rounded-md px-2 py-1.5 transition-all duration-300 ${
                isHighlighted ? "bg-emerald-700/50 ring-1 ring-emerald-400/40" : "hover:bg-card-foreground/20"
              }`}
            >
              <span className="col-span-4 truncate font-medium text-muted-foreground">{name}</span>
              <span className="col-span-3 text-[10px] uppercase tracking-wide text-muted-foreground/60">
                {getTypeLabel(value)}
              </span>
              <span className="col-span-5 truncate text-right font-semibold text-emerald-400">
                {formatValue(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}