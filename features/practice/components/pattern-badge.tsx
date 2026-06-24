import { PatternName } from "../types/pattern-types"

interface PatternBadgeProps {
    pattern: PatternName;
}

export function PatternBadge({pattern}: PatternBadgeProps) {
    return (
        <span className="truncate rounded-md border border-pill-border bg-pill px-2.5 py-1 text-xs font-medium tracking-wide text-pill-foreground">
            { pattern }
        </span>
    )
}
