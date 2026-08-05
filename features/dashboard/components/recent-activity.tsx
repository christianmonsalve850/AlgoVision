import { CheckCircle, BookOpen, Circle } from "lucide-react";


export default async function RecentActivity() {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Recent Activity
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pick up where you left off
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="group grid grid-cols-20 gap-2 rounded-lg p-2.5 -mx-2.5 transition-colors hover:bg-muted/40">
          <div className="flex items-center justify-center p-0.5">
            <CheckCircle className="col-span-1 text-emerald-500 dark:text-emerald-400" />
          </div>

          <div className="flex flex-col gap-1 text-sm col-span-19 justify-center">
            <span className="font-medium text-foreground transition-colors group-hover:text-primary tracking-wide">
              Container With Most Water
            </span>
            <span className="text-xs font-semibold text-muted-foreground tabular-nums">
              Two Pointers · 2 hours ago
            </span>
          </div>
        </div>
      </div>
        <div className="group grid grid-cols-20 gap-2 rounded-lg p-2.5 -mx-2.5 transition-colors hover:bg-muted/40">
          <div className="flex items-center justify-center p-0.5">
            <BookOpen className="col-span-1 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="flex flex-col gap-1 text-sm col-span-19 justify-center">
            <span className="font-medium text-foreground transition-colors group-hover:text-primary tracking-wide">
              Completed: Sliding Window Pattern
            </span>
            <span className="text-xs font-semibold text-muted-foreground tabular-nums">
              Lessons · 5 hours ago
            </span>
          </div>
        </div>
      <div className="group grid grid-cols-20 gap-2 rounded-lg p-2.5 -mx-2.5 transition-colors hover:bg-muted/40">
          <div className="flex items-center justify-center p-0.5">
            <CheckCircle className="col-span-1 text-emerald-500 dark:text-emerald-400" />
          </div>

          <div className="flex flex-col gap-1 text-sm col-span-19 justify-center">
            <span className="font-medium text-foreground transition-colors group-hover:text-primary tracking-wide">
              Longest Substring Without Repeating
            </span>
            <span className="text-xs font-semibold text-muted-foreground tabular-nums">
              Sliding Window · 1 day ago
            </span>
          </div>
        </div>
        <div className="group grid grid-cols-20 gap-2 rounded-lg p-2.5 -mx-2.5 transition-colors hover:bg-muted/40">
          <div className="flex items-center justify-center p-0.5">
            <Circle className="col-span-1 text-gray-500 dark:text-gray-400" />
          </div>

          <div className="flex flex-col gap-1 text-sm col-span-19 justify-center">
            <span className="font-medium text-foreground transition-colors group-hover:text-primary tracking-wide">
              Attempted: Minimum Window Substring
            </span>
            <span className="text-xs font-semibold text-muted-foreground tabular-nums">
              Sliding Window · 1 day ago
            </span>
          </div>
        </div>
        <div className="group grid grid-cols-20 gap-2 rounded-lg p-2.5 -mx-2.5 transition-colors hover:bg-muted/40">
          <div className="flex items-center justify-center p-0.5">
            <BookOpen className="col-span-1 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="flex flex-col gap-1 text-sm col-span-19 justify-center">
            <span className="font-medium text-foreground transition-colors group-hover:text-primary tracking-wide">
              Completed: Two Pointers Introduction
            </span>
            <span className="text-xs font-semibold text-muted-foreground tabular-nums">
              Lessons · 2 days ago
            </span>
          </div>
        </div>
    </div>
  );
}
