import { Braces } from "lucide-react";
import type { VariablesMap, VariableValue } from "@/lib/algovision-harness/src/runtime/types";

type VariableStateProps = {
  variables: VariablesMap | null | undefined;
};

function formatValue(value: VariableValue): string {
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }

  return String(value);
}

export function VariableState({ variables }: VariableStateProps) {
  const variableEntries = variables ? Object.entries(variables) : [];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Braces className="size-4 text-zinc-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Variables In Scope
        </h3>
      </div>

      <div className="flex flex-col gap-1.5 font-mono text-xs">
        {variableEntries.map(([name, value]) => (
          <div
            key={name}
            className="grid grid-cols-12 items-center rounded-md px-2 py-1.5 transition-colors hover:bg-zinc-900/40"
          >
            <span className="col-span-4 truncate font-medium text-zinc-200">{name}</span>
            <span className="col-span-3 text-[10px] uppercase tracking-wide text-zinc-500">
              {typeof value}
            </span>
            <span className="col-span-5 truncate text-right font-semibold text-emerald-400">
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}