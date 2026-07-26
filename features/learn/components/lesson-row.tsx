import Link from "next/link"

import type { LessonListItem } from "../types"
import { Progress } from "@/components/ui/progress"
import { lessonCategoryItems } from "../data/lesson-category-items"
import { ArrowRight } from "lucide-react"

type LessonRowProps = {
    lesson: LessonListItem,
}

export function LessonRow({ lesson }: LessonRowProps) {

  return (
    <Link
      href={`/example`}
      className="group grid grid-cols-12 items-center gap-4 rounded-xl border border-border bg-background px-4 py-3.5 text-sm font-medium shadow-sm transition-all duration-200 hover:border-border hover:bg-muted"
    >
      <div className={`
        col-span-7 sm:col-span-7 flex min-w-0 items-center gap-3
      `}>
        <div className={
          `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border p-2
          ${ lessonCategoryItems.find(item => item.name === lesson.category)?.meta.color }
          ${ lessonCategoryItems.find(item => item.name === lesson.category)?.meta.bg }
          ${ lessonCategoryItems.find(item => item.name === lesson.category)?.meta.color.replace("text", "border") }`
        } >
          { lessonCategoryItems.find(item => item.name === lesson.category)?.meta.icon }
        </div>
        <span className="truncate font-semibold text-foreground transition-colors group-hover:text-foreground">
          {lesson.title}
        </span>
      </div>

        

      <div className="col-span-4 flex items-center justify-end gap-2.5">
        <Progress value={lesson.progress} />
        <span className="hidden sm:flex shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
          {lesson.progress}%
        </span>
      </div>

      <div className="col-span-1 flex justify-center">
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
      </div>
    </Link>
  )
}
