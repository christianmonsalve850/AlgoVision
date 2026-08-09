import { Braces } from "lucide-react";

type VariableStateProps = {
  variables: { name: string; type: string; value: any; updated?: boolean }[];
};

export function VariableState({ variables }: VariableStateProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Braces className="size-4 text-zinc-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Variables In Scope
        </h3>
      </div>

      <div className="flex flex-col gap-1.5 font-mono text-xs">
        {variables.map((v) => (
          <div
            key={v.name}
            className={`grid grid-cols-12 items-center rounded-md px-2 py-1.5 transition-colors ${
              v.updated ? "bg-amber-500/10 text-amber-300" : "hover:bg-zinc-900/40"
            }`}
          >
            {/* Variable Name */}
            <span className="col-span-4 font-medium text-zinc-200 truncate">{v.name}</span>
            
            {/* Variable Type */}
            <span className="col-span-3 text-[10px] text-zinc-500 uppercase tracking-wide">
              {v.type}
            </span>
            
            {/* Variable Value Container */}
            <span className={`col-span-5 text-right font-semibold truncate ${v.updated ? "text-amber-400" : "text-emerald-400"}`}>
              {typeof v.value === "object" ? JSON.stringify(v.value) : String(v.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}