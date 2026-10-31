import { Brand } from "@/components/layout/brand";
import { AssessmentNavProps } from "@/features/interview/assessment/types";
import { Clock3, LogOut } from "lucide-react";
import CountdownTimer from "@/features/interview/assessment/components/CountdownTimer";


export function AssessmentNav({
  onQuitOpen,
  initialTimeMinutes,
} : AssessmentNavProps) {

  return (
    <header className="sticky top-0 flex h-16 w-full items-center border-b border-border bg-background/90 px-6 backdrop-blur justify-between py-5">
      {/* Left Group (takes up flex space) */}
      <div className="flex items-center gap-3 flex-1">
        <Brand />
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center justify-center border px-3 py-1.5 rounded-full border-yellow-500/50 bg-yellow-500/10">
          <span className="flex items-center justify-center gap-2 font-semibold text-yellow-500 text-xs">
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
            Timed assessment · Medium
          </span>
        </div>
      </div>

      {/* Center Clock (Stays dead center) */}
      <div className="flex items-center justify-center rounded-lg border border-border bg-accent px-3 py-1">
        <Clock3 className="size-4" />
        <CountdownTimer
          key={initialTimeMinutes}
          initialTimeMinutes={initialTimeMinutes}
        />
      </div>

      {/* Right Group (takes up equal flex space to balance the left side) */}
      <div className="flex flex-1 justify-end gap-3">
        <button
          onClick={onQuitOpen}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-rose-500/30 hover:bg-rose-500/8 hover:text-rose-600 dark:hover:text-rose-300"
          aria-label="Quit assessment"
        >
          <LogOut className="size-4" />
        </button>
    </div>
    </header>
  );
}
