import { Progress } from "@/components/ui/progress"
import { Play, ArrowLeftRight, ArrowRight } from "lucide-react"

export default function ContinueLearning() {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-sky-500/80 p-1 text-sky-500/80">
          <Play strokeWidth={3} className="h-full w-full fill-sky-500/20" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Continue Learning
        </h2>
      </div>

      {/* Main Learning Card */}
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-sky-500/30">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          
          {/* Left: Lesson Info */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-500/80">
              <ArrowLeftRight className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-foreground">Two Pointers</h3>
              <p className="text-xs text-muted-foreground">Arrays &amp; Strings</p>
            </div>
          </div>

          {/* Right: Action Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Continue Practice
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar Section */}
        <div className="mt-5 space-y-2 pt-1 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Lesson Progress</span>
            <span className="font-semibold tabular-nums text-sky-500/80">65%</span>
          </div>
          <Progress value={65} />
        </div>
      </div>
    </div>
  )
}