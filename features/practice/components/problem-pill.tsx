import { CircleCheck } from "lucide-react"
import Link from "next/link"
import { DifficultyBadge } from "@/features/practice/components/difficulty-badge"
import { PatternBadge } from "@/features/practice/components/pattern-badge"

export function ProblemPill() {
    return (
        <Link
            href="/practice/1"
            className="group grid grid-cols-12 gap-4 w-full items-center rounded-xl border border-border bg-background px-4 py-3.5 text-sm font-medium transition-all duration-200 hover:bg-muted hover:border-border shadow-sm"
        >
            <div className="col-span-6 flex items-center gap-3 min-w-0">
                <CircleCheck className="text-emerald-500 shrink-0" size={18} />
                <span className="text-foreground font-semibold group-hover:text-foreground transition-colors truncate">
                    Two Sum
                </span>
            </div>

            <div className="col-span-3 flex justify-center">
                <DifficultyBadge difficulty="Easy" />
            </div>

            <div className="col-span-3 flex justify-end">
                <PatternBadge pattern="Hash Table"/>
            </div>
        </Link>
    )
}
