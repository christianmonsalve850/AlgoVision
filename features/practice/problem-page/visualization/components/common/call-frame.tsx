import type { CallFrameProps } from "@/features/practice/problem-page/visualization/types"

export function CallFrame({ name, args, isActive }: CallFrameProps) {
  return (
    <div className={`flex flex-col gap-1.5 border border-border bg-zinc-900/20 p-3 rounded-lg ${
      isActive ? "ring-1 ring-emerald-500/30 border-emerald-500/40" : ""
    }`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-zinc-200">{name}()</span>
        {isActive && (
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Active
          </span>
        )}
      </div>
      
      {/* Flattened Arguments list to avoid massive vertical stacking */}
      <div className="flex flex-wrap gap-2 font-mono text-[11px] text-muted-foreground">
        {Object.entries(args).map(([k, v]) => (
          <span key={k}>
            <span className="text-zinc-400">{k}</span>={JSON.stringify(v)}
          </span>
        ))}
      </div>
    </div>
  );
}