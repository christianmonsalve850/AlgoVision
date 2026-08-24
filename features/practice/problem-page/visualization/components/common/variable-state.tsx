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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Braces className="size-4 text-zinc-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
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
                isHighlighted ? "bg-emerald-900/30 ring-1 ring-emerald-400/40" : "hover:bg-zinc-900/40"
              }`}
            >
              <span className="col-span-4 truncate font-medium text-zinc-200">{name}</span>
              <span className="col-span-3 text-[10px] uppercase tracking-wide text-zinc-500">
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