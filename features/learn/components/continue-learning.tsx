import { Progress } from "@/components/ui/progress"
import { Play, ArrowRight } from "lucide-react"
import { LessonListItem } from "../types"
import { lessonCategoryItems } from "../data/lesson-category-items"

type ContinueLearningProps = {
  lessons: LessonListItem[],
}

export default function ContinueLearning({ lessons }: ContinueLearningProps) {

  const categoryMeta = lessonCategoryItems.find(
    (item) => item.name === lessons[0].category
  )?.meta;
  
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className={`
          flex h-6 w-6 items-center justify-center rounded-full border-2 p-1
          ${ categoryMeta?.bg }
          ${ categoryMeta?.color}
          ${ categoryMeta?.color.replace("text", "border") }
        `}>
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
            <div className={`
              flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border p-2
              ${ categoryMeta?.bg }
              ${ categoryMeta?.color}
              ${ categoryMeta?.color.replace("text", "border") }
            `}>
              { categoryMeta?.icon }
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-foreground">{ lessons[0].title }</h3>
              <p className="text-xs text-muted-foreground">{ lessons[0].category }</p>
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
            <span className={`font-semibold tabular-nums ${categoryMeta?.color}`}>{ lessons[0].progress }%</span>
          </div>
          <Progress value={ lessons[0].progress } bg={ categoryMeta?.bg } color={ categoryMeta?.progressColor ?? "bg-primary" } />
        </div>
      </div>
    </div>
  )
}