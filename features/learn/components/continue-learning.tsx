import { Progress } from "@/components/ui/progress"
import { Play, ArrowRight, BookOpen } from "lucide-react"
import type { LessonListItem } from "../types"
import { lessonCategoryItems } from "../data/lesson-category-items"

type ContinueLearningProps = {
  lessons: LessonListItem[]
}

export default function ContinueLearning({ lessons }: ContinueLearningProps) {
  if (!lessons || lessons.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted p-1 text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Continue Learning
          </h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No lessons in progress yet. Pick a topic below to start!
        </div>
      </div>
    )
  }

  const firstLesson = lessons[0]
  const categoryMeta = lessonCategoryItems.find(
    (item) => item.name === firstLesson.category
  )?.meta

  const progressValue = firstLesson.progress ?? 0

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 p-1 ${categoryMeta?.bg} ${categoryMeta?.color}`}
        >
          <Play strokeWidth={3} className="h-full w-full" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Continue Learning
        </h2>
      </div>

      {/* Main Learning Card */}
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          {/* Left: Lesson Info */}
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border p-2 ${categoryMeta?.bg} ${categoryMeta?.color}`}
            >
              {categoryMeta?.icon}
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-foreground">
                {firstLesson.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {firstLesson.category}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Continue Practice
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-2 border-t border-border/50 pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              Lesson Progress
            </span>
            <span
              className={`font-semibold tabular-nums ${
                categoryMeta?.color ?? "text-foreground"
              }`}
            >
              {progressValue}%
            </span>
          </div>
          <Progress
            value={progressValue}
            bg={categoryMeta?.bg}
            color={categoryMeta?.progressColor}
          />
        </div>
      </div>
    </div>
  )
}